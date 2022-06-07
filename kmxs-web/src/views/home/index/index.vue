<!--
 * @Author: Songjq
 * @Date: 2022-01-26 10:36:14
 * @Desscription: 
-->
<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px">
          领取阿里云通用云产品1888优惠券
          <br />
          <el-link
            href="https://www.aliyun.com/activity/new?userCode=klcu2iqp"
            type="primary"
            target="_blank"
            >https://www.aliyun.com/activity/new?userCode=klcu2iqp</el-link
          >
          <br />
          阿里云服务器折扣区
          <el-link
            href="https://www.aliyun.com/daily-act/ecs/fy22-12-yure?userCode=klcu2iqp"
            type="primary"
            target="_blank"
            >>☛☛点我进入☚☚</el-link
          ><br />
          <h4 class="text-danger">
            云产品通用红包，可叠加官网常规优惠使用。(仅限新用户)
          </h4>
        </blockquote>
        <hr />
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>孔明后台管理框架</h2>
        <p>
          一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了孔明管理系统。，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。所有前端后台代码封装过后十分精简易上手，出错概率低。同时支持移动客户端访问。系统会陆续更新一些实用功能。
        </p>
        <p>
          <b>当前版本:</b> <span>{{ version }}</span>
          <el-tag type="danger" class="ui-mgl-10">&yen;免费开源</el-tag>
        </p>
        <p>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-cloudy"
            plain
            @click="goTarget('https://gitee.com/xiaosong666/Kmxs-Vue')"
            >访问码云</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-s-home"
            plain
            @click="goTarget('http://kmxs.com.cn')"
            >访问主页</el-button
          >
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>Node.js</li>
              <li>Koa2</li>
              <li>MongoDB</li>
              <li>JWT</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>联系信息</span>
          </div>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 官网：<el-link
                href="http://www.kmxs.com.cn"
                target="_blank"
                >http://www.kmxs.com.cn</el-link
              >
            </p>
            <p>
              <i class="el-icon-user-solid"></i> QQ群：
              <a href="https://jq.qq.com/?_wv=1027&k=eGKkUKrI" target="_blank">
                305564464</a
              >
            </p>
            <!-- <p>
              <i class="el-icon-chat-dot-round"></i> 微信：<a
                href="javascript:;"
                >/ *孔明</a
              >
            </p>
            <p>
              <i class="el-icon-money"></i> 支付宝：<a
                href="javascript:;"
                class="支付宝信息"
                >/ *孔明</a
              >
            </p> -->
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>更新日志</span>
          </div>
          <el-collapse accordion>
            <template v-for="item in tableData">
              <el-collapse-item :title="item.noticeTitle" :key="item._id">
                <span v-html="item.noticeContent" />
              </el-collapse-item>
            </template>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>捐赠支持</span>
          </div>
          <div class="body">
            <img
              src="../../../assets/images/jz.jpg"
              alt="donate"
              width="100%"
            />
            <span style="display: inline-block; height: 30px; line-height: 30px"
              >你可以请作者喝杯咖啡表示鼓励</span
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getConfigAll } from "@http/system/config.js";
import { getNoticeAll } from "@http/information/notice.js";
import Editor from "@/views/components/Editor.vue";
export default {
  components: { Editor },
  name: "Index",
  data() {
    return {
      // 版本号
      version: "v0.0.0",
      tableData: [],
    };
  },
  created() {
    this.init();

    // 获取版本号
    getConfigAll({
      keyword: "system.version.no",
    }).then((res) => {
      this.version = res.data[0].configValue;
    });
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },

    init() {
      getNoticeAll({
        type: 2,
      }).then((res) => {
        this.tableData = res.data;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  line-height: 1.6;
  blockquote {
    padding: 10px 20px;
    margin: 0;
    font-size: 18px;
    border-left: 5px solid #eee;
    line-height: 1.5;
  }
  .text-warning {
    color: #f8ac59;
  }
  .el-link.el-link--primary {
    color: #1890ff;
  }
  .text-danger {
    color: #ed5565;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    list-style-type: none;
  }

  h2 {
    margin-bottom: 10px;
    font-size: 26px;
    font-weight: 100;
  }
  p {
    font-size: 14px;
    margin-bottom: 10px;
  }

  /deep/.update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 0.5em;
      margin-block-end: 0.5em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 20px;
      color: #666;
    }
  }
  /deep/.el-collapse-item__content {
    padding-bottom: 5px;
  }

  /deep/.el-card__body {
    min-height: 260px;
    overflow-y: auto;
  }
}
</style>

