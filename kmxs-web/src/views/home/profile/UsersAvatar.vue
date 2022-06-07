<template>
  <div>
    <div class="user-info-head" @click="editCropper()">
      <img
        :src="showImg || imgSrc"
        title="点击上传头像"
        class="img-circle img-lg"
      />
    </div>

    <!-- 获取图片 -->
    <UploadPicture
      ref="upload-picture"
      :img="showImg"
      @setPicture="setPicture"
    />
  </div>
</template>

<script>
import store from "@/store";
import UploadPicture from "@/components/UploadPicture/index.vue";
import { edit } from "@/api/http/system/user";
export default {
  components: { UploadPicture },
  props: {
    user: {
      type: Object,
    },
  },
  data() {
    return {
      imgSrc: require("@/assets/images/head.jpg"),
      // 弹出层标题
      title: "修改头像",
      showImg: store.getters.avatar,
    };
  },
  methods: {
    // 编辑头像
    editCropper() {
      this.$refs["upload-picture"].open = true;
      this.$nextTick(() => {
        this.$refs["upload-picture"].init();
      });
    },

    // 上传图片
    setPicture(data) {
      edit(Object.assign({ ...this.user }, { avatar: data }))
        .then((res) => {
          store.commit("SET_AVATAR", data);
          this.$refs["upload-picture"].open = false;
          this.$refs["upload-picture"].visible = false;
          this.showImg = data;
          this.$notify.success({
            title: res.message,
            duration: 5000,
          });
        })
        .catch((err) => {
          this.$notify.error({
            title: err.message,
            duration: 5000,
          });
        });
    },
  },
};
</script>
<style scoped lang="scss">
.user-info-head {
  position: relative;
  display: inline-block;
  height: 100px;
}

.user-info-head:hover:after {
  content: "+";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  color: #eee;
  background: rgba(0, 0, 0, 0.5);
  font-size: 24px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  line-height: 100px;
  border-radius: 50%;
}

/* image */
.img-circle {
  border-radius: 50%;
}

.img-lg {
  width: 100px;
  height: 100px;
}
</style>