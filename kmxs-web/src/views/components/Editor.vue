<!--
 * @Author: Songjq
 * @Date: 2022-01-23 21:17:53
 * @Desscription: 
-->
<template>
  <div>
    <p
      class="warn-content"
      v-if="isMenu"
    >
      富文本基于
      <el-link
        type="primary"
        href="https://www.kancloud.cn/wangfupeng/wangeditor3/332599"
        target="_blank"
      >wangEditor</el-link>，图片上传使用 <el-link
        type="primary"
        href="https://sm.ms/"
        target="_blank"
      >SM.MS</el-link>
    </p>
    <div
      ref="toolbar-container"
      class="toolbar"
    ></div>
    <div
      ref="text-container"
      class="text"
    ></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { upload } from "@/utils/upload";
import E from "wangeditor";
export default {
  name: "Editor",
  props: {
    isMenu: {
      type: Boolean,
      default: true,
    },
    editorContent: {
      type: String,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["imagesUploadApi"]),
  },
  mounted() {
    // 作为菜单页面展示，需要初始化
    if (this.isMenu) {
      this.init();
    }
  },
  methods: {
    init() {
      var editor = new E(
        this.$refs["toolbar-container"],
        this.$refs["text-container"]
      );
      // 自定义菜单配置
      editor.config.zIndex = 10;
      // 文件上传
      editor.config.customUploadImg = function (files, insert) {
        // files 是 input 中选中的文件列表
        // insert 是获取图片 url 后，插入到编辑器的方法
        files.forEach((image) => {
          upload(this.imagesUploadApi, image).then((data) => {
            insert(data.data.url);
          });
        });
      };
      editor.config.onchange = (html) => {
        this.$emit("change", html);
      };
      editor.create();

      // 初始化数据
      editor.txt.html(this.editorContent);
    },
  },
};
</script>

<style scoped lang="scss">
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 300px;
}
/deep/.w-e-text {
  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  table,
  pre {
    margin: 0 !important;
  }
}
/deep/.w-e-text-container {
  overflow-y: scroll;
  max-height: 400px;
  .placeholder {
    top: 0;
  }
}
</style>
