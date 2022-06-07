<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

const newVar = {
  name: "App",
  data() {
    return {};
  },
  watch: {
    user(val) {
      if (this.$matomo) {
        this.$matomo.setUserId(val.nickName + "_" + val.phone);
        this.$matomo.trackPageView();
        this.$matomo.enableLinkTracking();
      }
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
  created: function () {
    if (this.user) {
      if (this.$matomo) {
        this.$matomo.setUserId(this.user.nickName + "_" + this.user.phone);
        this.$matomo.trackPageView();
        this.$matomo.enableLinkTracking();
      }
    }
  },
};
export default newVar;
</script>

<style rel="stylesheet/scss" lang="scss">
@import "~@/assets/styles/mixin.scss";
@import "~@/assets/styles/variables.scss";
// .star {
//   color: red;
//   padding-right: 2px;
// }
// .v-table-header-row {
//   background: #e3e7ec;
// }
// .v-table-htable {
//   font-size: 14px;
// }
// .v-table-btable {
//   font-size: 14px;
// }
// .el-popper {
//   margin-top: 5px !important;
// }
// .el-table__header-wrapper tr {
//   background: #e3e7ec;
// }
// .el-table [class^="el-icon-"],
// .el-table [class*=" el-icon-"] {
//   width: 15px;
//   font-size: 14px;
// }
// .el-textarea__inner {
//   border-radius: 0;
// }
// .el-select-dropdown {
//   border-radius: 2px;
// }
// .subTitle {
//   padding: 10px;
// }
// .breadcrumb-child {
//   font-size: 14px;
//   font-weight: bold;
//   .fa {
//     margin: 0 10px 0 2px;
//   }
// }
// .button-area {
//   padding: 10px 30px 10px 0;
//   text-align: right;
// }
// .form-unit {
//   width: 100%;
//   height: 32px;
//   line-height: 32px;
//   font-size: 14px;
//   background: #f5f7fa;
//   margin: 0 0 20px 0;
//   padding: 0 15px;
//   overflow: hidden;
// }
// .pagination_bar {
//   margin-top: 10px;
//   margin-bottom: 10px;
//   text-align: center;
// }
// .infoEdit {
//   float: left;
//   width: 60%;
//   height: 100%;
//   margin-top: 20px;
// }

// .logoEdit {
//   float: left;
//   width: 20%;
//   height: 100%;
//   margin-left: 50px;
//   margin-top: 100px;
//   text-align: center;
//   padding: 0 30px;
// }
// // 查询区域
// .fd-a {
//   background: #f5f7fa;
//   padding: 10px 10px 0;
//   margin-bottom: 10px;
//   position: relative;
//   .el-form {
//     margin-top: 0px;
//   }
//   .el-form-item--small.el-form-item {
//     margin-bottom: 10px;
//   }
//   .arrow-top {
//     position: absolute;
//     border-top: 8px transparent dashed;
//     border-left: 8px transparent dashed;
//     border-right: 8px transparent dashed;
//     border-bottom: 8px solid #f5f7fa;
//     top: -16px;
//     right: 54px;
//   }
// }
// .el-form-item--mini {
//   margin-right: 10px;
//   .el-form-item__label {
//     font-weight: 400;
//     font-size: 12px;
//     float: left;
//   }
//   .el-form-item__content {
//     font-weight: 400;
//     font-size: 12px;
//     float: left;
//   }
// }
// .el-menu-item,
// .el-submenu__title {
//   height: 48px !important;
//   line-height: 48px !important;
//   font-weight: 400;
//   font-size: 14px;
// }
// .custom-tree-node {
//   -ms-flex: 1;
//   flex: 1;
//   display: -ms-flexbox;
//   display: flex;
//   -ms-flex-align: center;
//   align-items: center;
//   -ms-flex-pack: justify;
//   justify-content: space-between;
//   font-size: 12px;
//   padding-right: 8px;
// }

// /*分页居右*/
// .el-pagination {
//   text-align: right;
// }
// #app {
//   font-size: 12px;
// }

// /*菜单*/
// .el-menu {
//   border-right: none !important;
// }
// /*高度*/
// .el-menu-item,
// .el-submenu__title {
//   height: 35px !important;
//   line-height: 35px !important;
//   color: #ccc;
// }
// .el-aside {
//   color: #fff;
// }
// .el-table {
//   .render-class1 {
//     color: #666666;
//   }
//   .render-class2 {
//     color: #ff6602;
//   }
//   .render-class3 {
//     color: #00b200;
//   }
//   .render-class4 {
//     color: #ff0019;
//   }
//   .render-class5 {
//     color: #ff0000;
//   }
// }
// .el-button--text {
//   padding-right: 10px;
// }
// .el-button--default:active,
// .el-button--default:hover,
// .el-button--default:focus {
//   color: #2357e6;
//   border-color: #2357e6;
//   background: #fff;
// }

// .bottom-btn-groups {
//   background: #fff;
//   padding: 0 10px;
//   text-align: center;
//   border-top: 1px solid rgba(151, 151, 151, 0.1);
//   height: 62px;
//   line-height: 62px;
//   overflow: hidden;
//   box-sizing: border-box;
//   margin: 0 -10px;
// }
// .app-container {
//   .multi-card {
//     padding: 0px;
//     -webkit-box-shadow: none;
//     background: none;
//     .el-card {
//       margin: 5px 0 10px 0;
//     }
//     .title {
//       font-size: 14px;
//       font-weight: 700;
//     }
//     .el-table {
//       /*border: 1px solid #efefef!important;*/
//       .el-form-item {
//         padding-top: 10px;
//       }
//     }
//   }
// }
// .view .el-card {
//   border: none;
// }
// .view .el-card__header {
//   border-bottom: none;
// }
// .view .el-card__body {
//   padding: 0px;
// }
// .view .el-card.is-always-shadow {
//   -webkit-box-shadow: none;
//   box-shadow: none;
// }
// .view.app-container.multi-card .el-table {
//   border: none !important;
//   overflow: auto;
// }
// .view.app-container.multi-card .el-card {
//   margin: 0px;
// }

// .el-dropdown-menu .el-button--text {
//   color: #333;
// }
// .el-dropdown-menu .el-button--text:hover {
//   color: #2357e6;
// }

// .report-popover {
//   background: #f5f8fe !important;
//   width: calc(100% - 220px);
//   left: 200px !important;
//   transition: all 0.3s ease;
// }
// .hideSlideBar {
//   background: #f5f8fe !important;
//   width: calc(100% - 84px) !important;
//   left: 64px !important;
//   transition: all 0.3s ease;
// }
// /* 支持IE10及以上 */
// @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
//   .el-dialog__body {
//     min-height: 50vh !important;
//   }
//   .custom_el_dialog .el-dialog__body {
//     min-height: 70vh !important;
//   }
// }
// /* 支持IE9及以上 */
// @media screen and (min-width: 0\0) {
//   .el-dialog__body {
//     min-height: 50vh !important;
//   }
//   .custom_el_dialog .el-dialog__body {
//     min-height: 70vh !important;
//   }
// }
</style>
