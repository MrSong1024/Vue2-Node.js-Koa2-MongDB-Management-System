/*
 * @Author: Songjq
 * @Date: 2021-10-28 10:11:03
 * @Desscription: 组织树节点公共组件
 */
import { getMenusTree, getMenusTreeAll } from "@http/system/menu.js";
import { getDeptTree } from "@http/system/dept.js";
export default {
    props: {
        // 请求的接口类型 基准组织/业务组织
        requestUrlType: {
            type: String,
            default: "isMenus"
        },
        // 是否懒加载
        isLazy: {
            type: Boolean,
            default: true,
        },
        // 是否展开首行
        isOpenFirst: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            deptDatas: [],
            // 默认展开的树节点
            defaultExpandedKeys: [],
            defaultProps: {
                label: "label",
                children: "children",
                isLeaf: "leaf",
            },
        };
    },

    methods: {
        // 通过关键字检索树节点
        getNodeSearch(keyword) {
            this.deptDatas = [];
            this.loading = true;
            this.defaultExpandedKeys = [];
            let typeUrlFn = "";
            switch (this.requestUrlType) {
                // 基准组织
                case "isMenus":
                    typeUrlFn = getMenusTree({
                        parentId: "0",
                        keyword: keyword,
                    });
                    break;

                case "isDepts":
                    // 业务组织树
                    typeUrlFn = getDeptTree({
                        parentId: "0",
                        keyword: keyword,
                    });
                    break;
            }

            typeUrlFn.then(res => {
                this.loading = false;
                if (this.isChecked) {
                    this.$nextTick(() => {
                        this.$refs.deptTree.setCheckedNodes(this.defaultCheckedKeys);
                    });
                }
                this.deptDatas = this.MINgetTreeData(res.data, null);
            });
        },

        // 加载树节点
        loadNodes(node) {
            if (this.isLazy) {
                this.getTreeLazy(node);
            } else {
                this.getTreeAll();
            }
        },

        // 懒加载方式获取树节点
        getTreeLazy(node) {
            this.loading = true;
            let typeUrlFn = "";
            switch (this.requestUrlType) {
                // 基准组织
                case "isMenus":
                    typeUrlFn = getMenusTree({
                        parentId: node.id,
                        keyword: "",
                    });
                    break;

                case "isDepts":
                    // 业务组织树
                    typeUrlFn = getDeptTree({
                        parentId: node.id,
                        keyword: "",
                    });
                    break;
            }

            // 请求接口，获取数据
            typeUrlFn.then(res => {
                this.loading = false;
                if (!res || res.data.length === 0) {
                    this.getChildrens(this.deptDatas, node.id, res.data);
                    return;
                }

                // 解决节点展示空白的问题
                res.data.forEach(val => {
                    val.children = [{}];
                    this.defaultExpandedKeys.forEach((value, index) => {
                        if (value === val.id) {
                            this.defaultExpandedKeys.splice(index, 1);
                        }
                    });
                });

                if (node.id === "0") {
                    res.data.forEach(val => {
                        this.deptDatas.push(val);
                    });
                    this.loadNodes(res.data[0]);

                    // 如果是树列表，就默认加载第一个节点数据
                    if (this.isOpenFirst) {
                        this.defaultExpandedKeys.push(res.data[0].id);
                    }
                    if (this.loadRightData) {
                        this.handleNodeClick(res.data[0])
                    }
                } else {
                    this.getChildrens(this.deptDatas, node.id, res.data);
                }
            });
        },

        // 获取所有树节点
        getTreeAll() {
            this.loading = true;
            let fn = null;
            switch (this.requestUrlType) {
                case "isMenus":
                    fn = getMenusTreeAll()
                    break;

                case "isDepts":
                    fn = getDeptTreeAll()
                    break;
            }

            fn.then((res) => {
                this.loading = false;
                this.deptDatas = res.data;
            });
        },

        // 通过父级ID 拼接组织树
        getChildrens(nodes, parentId, arr) {
            if (this.isChecked) {
                this.$nextTick(() => {
                    this.$refs.deptTree.setCheckedNodes(this.defaultCheckedKeys);
                });
            }

            nodes.forEach(val => {
                if (val.id === parentId) {
                    val.children = arr;
                } else if (val.children && val.children.length > 0) {
                    this.getChildrens(val.children, parentId, arr);
                }
            });
        },

        // 拼接组织树
        MINgetTreeData(data, id) {
            if (!Array.isArray(data)) {
                return [];
            }
            let newData = [];
            newData = data.filter(v => v.parentId === id);
            data = data.filter(v => v.parentId);
            this.MINgetChildren(newData, data);
            return newData;
        },

        MINgetChildren(parentData, data) {
            if (!data || data.length === 0) return;
            parentData.forEach(v => {
                const newData = data.filter(v1 => {
                    return v1.parentId === v.id;
                });
                if (newData && newData.length > 0) {
                    v.children = newData;
                    this.defaultExpandedKeys.push(v.id);
                    this.MINgetChildren(newData, data);
                } else {
                    v.children = [{}];
                }
            });
        },

        // 设置默认展开
        setDefaultExpandedKeys() {
            if (this.deptDatas.length > 0) {
                this.deptDatas.forEach(val => {
                    this.defaultExpandedKeys.push(val.id);
                });
            }
        }
    }
};