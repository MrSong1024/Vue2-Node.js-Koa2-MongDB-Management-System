/*
 * @Author: Songjq
 * @Date: 2021-12-28 14:55:41
 * @Desscription: 系统设置 - 部门管理
 */
const Router = require("koa-router");
const router = new Router();
const passport = require("koa-passport");

// 引入相关模板
const Dept = require("../../models/system/Dept");

// 引入发送短信记录方法
const { deteleObject } = require("../../tools/publicFunction");

/**
 * @route GET api/dept/all
 * @desc  获取部门列表
 * @access 接口是私有的
 */
router.get(
    "/all",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { keyword, parentId, status, isAllChildren, page, size } = ctx.request.query;

        // 1.包含子集 =》 通过父节点递归查找所有子集
        if (isAllChildren == "true" && parentId) {
            let parentNode = await Dept.findOne({ _id: parentId })

            // 缓存所有数据
            let allDatas = [].concat(parentNode)
            await Dept.find()
                .then(res => {
                    const ALL_DATAS = res

                    // 查询所有数据，递归处理
                    function getChildrens(nodes, pid) {
                        nodes.forEach(val => {
                            if (val.parentId == pid) {
                                allDatas.push(val)
                                let innerNodes = ALL_DATAS.filter(v => {
                                    return v.parentId == val._id
                                })

                                if (innerNodes.length > 0) {
                                    getChildrens(innerNodes, val._id)
                                }
                            }
                        })
                    }
                    getChildrens(ALL_DATAS, parentId)

                    // 手动处理分页
                    let newArr = JSON.parse(JSON.stringify(allDatas))
                    let start = page * size
                    let tableData = newArr.splice(start, size)

                    // 返回数据
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        data: tableData,
                        total: allDatas.length,
                    };
                })
            return
        }

        // 2.不包含子集 =》 通过父节点递归查找当前父节点及子集
        if (isAllChildren == "false" && parentId) {
            let parentNode = await Dept.findOne({ _id: parentId })

            await Dept.find({ parentId })
                .sort({
                    orderNum: 1,
                })
                .then((res) => {
                    res.unshift(parentNode)
                    let newArr = JSON.parse(JSON.stringify(res))
                    let start = page * size
                    let tableData = newArr.splice(start, size)
                    ctx.status = 200;
                    ctx.body = {
                        code: 200,
                        data: tableData,
                        total: res.length,
                    };
                });
            return
        }

        // 3.全局检索
        const searchData = {
            $or: [
                { deptName: new RegExp(keyword) },
                { deptId: new RegExp(keyword) }
            ],
            status: new RegExp(status), // 根据状态筛选
        };

        // 总条数
        const total = await Dept.find(searchData).countDocuments();

        // 根据条件查找数据
        await Dept.find(searchData)
            .sort({
                orderNum: 1,
            })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                ctx.status = 200;
                ctx.body = {
                    code: 200,
                    data: res,
                    total,
                };
            });
    }
);


/**
 * @route POST api/dept
 * @desc  新增部门
 * @access 接口是私有的
 */
router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { deptName, icon, _id: id } = ctx.request.body;
        const { userno } = ctx.state.user;

        // 新增
        const newDept = new Dept({
            ...ctx.request.body,
            meta: {
                title: deptName,
                icon: icon,
                noCache: true,
            },
            createBy: userno,
        });

        // 判断部门字段是否被占用(暂时不做判断)
        // const findResult = await Dept.findOne({ deptName });
        // if (findResult) {
        //     ctx.status = 500;
        //     ctx.body = {
        //         code: 500,
        //         message: "部门值已被占用",
        //     };
        // } else {
        await newDept
            .save()
            .then((res) => {
                ctx.body = {
                    code: 200,
                    message: "操作成功",
                    data: newDept,
                };
                global.log.desc = `新增部门`;
            })
            .catch((err) => {
                ctx.body = err;
            });
        // }
    }
);


/**
 * @route PUT api/dept
 * @desc  编辑部门
 * @access 接口是私有的
 */
router.put(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { deptName, icon, _id } = ctx.request.body;
        const { userno } = ctx.state.user;

        // 通过id获取部门，并进行更新
        await Dept.updateOne({
            _id,
        }, {
            $set: {
                ...ctx.request.body,
                meta: {
                    title: deptName,
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
        global.log.desc = `编辑部门`;
    }
);


/**
 * @route DELETE api/dept
 * @desc  批量删除部门
 * @access 接口是私有的
 */
router.delete(
    "/",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { ids } = ctx.request.body;
        await Dept.deleteMany({
            _id: { $in: ids },
        }).then(() => {
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "删除成功",
            };
        });

        // 记录操作日志
        global.log.desc = `删除部门`;
    }
);

/**
 * @route POST api/dept/enable
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
            await Dept.updateOne({
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

        global.log.desc = `启用部门`;
    }
);

/**
 * @route POST api/dept/disable
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
            await Dept.updateOne({
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

        global.log.desc = `禁用部门`;
    }
);

/**
 * @route GET api/dept/tree
 * @desc  获取部门树 - 懒加载，根据父级ID获取
 * @access 接口是私有的
 */
router.get(
    "/tree",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        const { parentId, keyword, page = 0, size = 999 } = ctx.request.query;

        // 配置检索数据
        const searchData = {
            deptName: new RegExp(keyword),
        };

        // 根据状态筛选
        if (parentId) {
            searchData.parentId = parentId;
        }

        // 有关键词则为检索
        if (keyword) {
            let allDatas = []
            // 所有树节点
            const ALL_DEPTS = await Dept.find()
            // 当前筛选子节点
            let depts = await Dept.find(searchData)

            // 递归获取父节点数据
            function getParents(dept) {
                allDatas.push({
                    id: dept._id.toString(),
                    label: dept.deptName,
                    parentId: dept.parentId,
                })
                let innerNodes = ALL_DEPTS.filter(v => {
                    return v._id == dept.parentId
                })
                if (innerNodes.length > 0) {
                    innerNodes.forEach(v => {
                        getParents(v)
                    })
                }
            }

            depts.forEach(val => {
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
        await Dept.find(searchData)
            .sort({
                orderNum: 1,
            })
            .skip(Number(page * size))
            .limit(Number(size))
            .then((res) => {
                let newData = [];
                res.forEach((val) => {
                    newData.push({
                        label: val.deptName,
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
 * @route GET api/dept/treeAll
 * @desc  获取菜单树 - 懒加载，根据父级ID获取
 * @access 接口是私有的
 */
router.get(
    "/treeAll",
    passport.authenticate("jwt", { session: false }),
    async (ctx) => {
        // 根据条件查找数据
        await Dept.find()
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

module.exports = router.routes();