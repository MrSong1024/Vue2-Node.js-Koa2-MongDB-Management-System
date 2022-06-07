/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 菜单管理
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入相关模板
const Menu = require("../../models/system/Menu");
const Role = require("../../models/system/Role");

// 引入发送短信记录方法
const { deteleObject } = require("../../tools/publicFunction");

/**
 * @route GET api/menu/all
 * @desc  获取菜单列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, parentId, status } = ctx.request.query;
        // 配置检索条件
        const searchData = {
            $or: [
                { menuName: new RegExp(keyword) },
                { menuId: new RegExp(keyword) }
            ],
            status: new RegExp(status), // 根据状态筛选
            parentId: new RegExp(parentId), // 根据父级ID筛选
        };

        // 根据条件查找数据
        await Menu.find(searchData)
            .sort({
                orderNum: 1,
            })
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: getChildrens(res),
                    total: res.length,
                };
            });
    }
);


/**
 * @route POST api/menu
 * @desc  新增菜单
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { menuName, icon, _id: id } = ctx.request.body;
        const { userno } = ctx.state.user;

        // 新增
        const newMenu = new Menu({
            ...ctx.request.body,
            meta: {
                title: menuName,
                icon: icon,
                noCache: true,
            },
            createBy: userno,
        });

        // 判断菜单字段是否被占用(暂时不做判断)
        // const findResult = await Menu.findOne({ menuId });
        // if (findResult) {
        //   ctx.status = 500;
        //   ctx.body = {
        //     code: 500,
        //     message: "菜单值已被占用",
        //   };
        // } else {
        await newMenu
            .save()
            .then((res) => {
                ctx.body = {
                    code: 200,
                    message: "操作成功",
                    data: newMenu,
                };
                global.log.desc = `新增菜单`;
            })
            .catch((err) => {
                ctx.body = err;
            });
        // }
    }
);


/**
 * @route PUT api/menu
 * @desc  编辑菜单
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { menuName, icon, _id } = ctx.request.body;
        const { userno } = ctx.state.user;

        // 通过id获取菜单，并进行更新
        await Menu.updateOne({
            _id,
        }, {
            $set: {
                ...ctx.request.body,
                meta: {
                    title: menuName,
                    icon: icon,
                    noCache: true,
                },
                children: [],
                updateBy: userno,
                updateTime: new Date(),
            },
        });
        ctx.body = {
            code: 200,
            message: "操作成功",
        };
        global.log.desc = `编辑菜单`;
    }
);


/**
 * @route DELETE api/menu
 * @desc  批量删除菜单
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Menu.deleteMany({
            _id: { $in: ids },
        }).then(() => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `删除菜单`;
    }
);

/**
 * @route POST api/menu/enable
 * @desc  批量启用
 * @access 接口是私有的
 */
router.post(
    "/enable",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { ids } = ctx.request.body;
        ids.forEach(async _id => {
            await Menu.updateOne({
                _id
            }, {
                $set: {
                    status: "0",
                    updateBy: userno,
                    updateTime: new Date(),
                },
            });
        })

        ctx.body = {
            code: 200,
            message: "操作成功",
        };

        global.log.desc = `启用菜单`;
    }
);

/**
 * @route POST api/menu/disable
 * @desc  批量禁用
 * @access 接口是私有的
 */
router.post(
    "/disable",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { userno } = ctx.state.user;
        const { ids } = ctx.request.body;
        ids.forEach(async _id => {
            await Menu.updateOne({
                _id
            }, {
                $set: {
                    status: "1",
                    updateBy: userno,
                    updateTime: new Date(),
                },
            });
        })

        ctx.body = {
            code: 200,
            message: "操作成功",
        };

        global.log.desc = `禁用菜单`;
    }
);


// 组装组织树拼装方法
const getChildrens = function(node) {
    node.forEach(function(it) {
        delete it.children;
    });
    // 定义map/
    var map = {};
    // 这里可以重构数据类型，放回字段值
    node.forEach(function(it) {
        map[it._id || it.id] = it;
    });

    // 定义返回集合
    var val = [];
    node.forEach(function(it) {
        var parent = map[it.parentId];
        if (parent) {
            // 有数据说明不是顶级节点，将数据放到该 children 子节点下
            (parent.children || (parent.children = [])).push(it);
        } else {
            // 没有数据说明是顶级节点放到val中
            val.push(it);
        }
    });
    return val;
};

/**
 * @route GET api/menu/tree
 * @desc  获取菜单树 - 懒加载，根据父级ID获取
 * @access 接口是私有的
 */
router.get(
    "/tree",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { parentId, keyword, page = 1, size = 999 } = ctx.request.query;

        // 配置检索数据
        const searchData = {
            menuName: new RegExp(keyword),
        };

        // 根据状态筛选
        if (parentId) {
            searchData.parentId = parentId;
        }

        // 有关键词则为检索
        if (keyword) {
            let allDatas = []
            // 所有树节点
            const ALL_MENUS = await Menu.find()
            // 当前筛选子节点
            let menus = await Menu.find(searchData)

            // 递归获取父节点数据
            function getParents(menu) {
                allDatas.push({
                    id: menu._id.toString(),
                    label: menu.menuName,
                    parentId: menu.parentId,
                })
                let innerNodes = ALL_MENUS.filter(v => {
                    return v._id == menu.parentId
                })
                if (innerNodes.length > 0) {
                    innerNodes.forEach(v => {
                        getParents(v)
                    })
                }
            }

            menus.forEach(val => {
                getParents(val)
            })

            ctx.status = 200;
            ctx.body = {
                code: 200,
                data: deteleObject(allDatas)
            };
            return
        }

        // 根据条件查找数据
        await Menu.find(searchData)
            .sort({
                orderNum: 1,
            })
            .skip(Number((page - 1) * size))
            .limit(Number(size))
            .then((res) => {
                let newData = [];
                res.forEach((val) => {
                    newData.push({
                        label: val.menuName,
                        parentId: val.parentId,
                        id: val._id,
                    });
                });

                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: newData,
                    total: res.length,
                };
            });
    }
);


/**
 * @route GET api/menu/treeAll
 * @desc  获取菜单树 - 懒加载，根据父级ID获取
 * @access 接口是私有的
 */
router.get(
    "/treeAll",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        // 根据条件查找数据
        await Menu.find()
            .sort({
                orderNum: 1,
            })
            .then((res) => {
                let newData = [];
                res.forEach((val) => {
                    newData.push({
                        label: val.menuName,
                        parentId: val.parentId,
                        permission: val.permission,
                        id: val._id,
                    });
                });

                // 排序
                newData = newData.sort((a, b) => {
                    return a.orderNum - b.orderNum
                })

                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: getChildrens(newData),
                    total: newData.length,
                };
            });
    }
);


/**
 * @route GET api/menu/build
 * @desc  获取权限菜单列表
 * @access 接口是私有的
 */
router.get(
    "/build",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { role } = ctx.state.user;
        // 1.通过角色匹配权限列表
        const roleResult = await Role.findOne({ roleKey: role });
        let roles = [...roleResult.permissions, ...[role]];

        // 根据关键字检索
        const searchData = {
            $or: [{ menuType: new RegExp("M") }, { menuType: new RegExp("C") }],
        };

        // 根据条件查找数据
        await Menu.find(searchData)
            .sort({
                orderNum: 1,
            })
            .then((res) => {
                // 根据角色权限 返回菜单
                const getArrEqual = function(arr1, arr2) {
                    let newArr = [];
                    for (let i = 0; i < arr2.length; i++) {
                        for (let j = 0; j < arr1.length; j++) {
                            if (arr1[j].permission === arr2[i]) {
                                newArr.push(arr1[j]);
                            }
                        }
                    }
                    return newArr;
                };
                let newData = getArrEqual(res, roles);
                // 排序
                newData = newData.sort((a, b) => {
                    return a.orderNum - b.orderNum
                })
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: getChildrens(newData),
                    total: newData.length,
                };
            });
    }
);

module.exports = router.routes();