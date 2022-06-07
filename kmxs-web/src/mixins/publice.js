/*
 * @Author: Songjq
 * @Date: 2021-08-13 16:38:30
 * @Desscription:
 */
import checkPermission from "@/utils/permission";
export default {
    data() {
        return {
            pageParam: {
                // 页码
                page: 1,
                // 每页数据条数
                size: 10
            },
            total: 0,
            pageSizes: [10, 20, 30, 50, 100, 200, 500],
        };
    },
    watch: {
        // 深度监听新增事件
        "crud.status.add": {
            handler(val) {
                if (val == 1) {
                    Object.keys(this.crud.form).forEach((key) => {
                        this.$set(this.form, key, this.crud.form[key]);
                    });
                    if (this.$refs.form) {
                        this.$refs.form.clearValidate();
                    }
                }
            },
            deep: true,
        },
    },
    methods: {
        checkPermission,
        /**
         * @Author: Songjq
         * @Date: 2021-12-19 17:43:18
         * @Fn: 切换展示条目数
         * @param {*} val
         */
        handleSizeChange(val) {
            this.pageParam.size = val;
            this.init();
        },

        /**
         * @Author: Songjq
         * @Date: 2021-12-19 17:43:41
         * @Fn: 切换页码
         * @param {*} val
         */
        handleCurrentChange(val) {
            this.pageParam.page = val;
            this.init();
        },

        /**
         * @Author: Songjq
         * @Date: 2021-12-19 18:20:58
         * @Fn: 重置分页信息
         */
        resetPage() {
            this.pageParam.page = 1;
            this.init();
        },

        // 验证检索字段，不得为特殊字符，不能少于2个字符
        verifyKeyword(keyword) {
            var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
            var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
            let isNotGo = false;
            let str = "";
            if (regEn.test(keyword) || regCn.test(keyword)) {
                str = "名称不能包含特殊字符";
                isNotGo = true;
            }

            if (keyword && keyword.length > 0 && keyword.length < 2) {
                str = "检索内容不得少于2个字符";
                isNotGo = true;
            }

            return {
                isNotGo: isNotGo,
                tips: str
            };
        },

        /**
         * 表单验证
         *
         * @param {Array} 表单名称
         * @inner
         */
        checkForm(formName) {
            return new Promise((resolve, reject) => {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        },

        /**
         * 提交数据 - 含拓展属性
         *
         * @event Button#click
         */
        submitAttribute() {
            const list = [];
            ["form", "attribute"].forEach((val) => {
                list.push(this.checkForm(val));
            });

            Promise.all(list).then((res) => {
                const dataArr = [];
                Object.keys(this.crud.attribute).forEach((key) => {
                    let obj = this.crud.attributeOptions.find(v => {
                        return v.attrKey == key
                    })
                    dataArr.push({
                        value: this.crud.attribute[key],
                        name: key,
                        label: obj.attrName
                    });
                });

                this.crud.form = {
                    ...this.form,
                    extendAttrs: JSON.stringify(dataArr),
                };

                this.crud.submitCU();
            });
        },
    }
};