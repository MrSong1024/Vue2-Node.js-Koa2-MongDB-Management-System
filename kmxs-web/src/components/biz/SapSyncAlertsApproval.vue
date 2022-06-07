<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        <span class="my-title">基础信息</span>
      </div>
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">同步批次：</span>
            <span>{{ sapSyncAlertsInfo.syncAlertBizid }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">同步标识：</span>
            <span>{{ sapSyncAlertsInfo.syncObjUid }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">对象类型：</span>
            <span>{{ sapSyncAlertsInfo.syncObjTypeName }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">板块标识：</span>
            <span>{{ sapSyncAlertsInfo.plate }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">处理状态：</span>
            <span>{{ sapSyncAlertsInfo.syncAlertStatus == 1 ? "已处理" : "未处理" }}</span>
          </div>
        </el-col>
        <el-col
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <div class="label-content">
            <span class="user-label">告警来源：</span>
            <span>{{ sapSyncAlertsInfo.syncAlertSourceName }}</span>
          </div>
        </el-col>
        <el-col>
          <div class="label-content">
            <span class="user-label">告警信息：</span>
            <span>{{ sapSyncAlertsInfo.syncAlertMsg }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="box-card user-list">
      <div slot="header">
        <span class="my-title">报文信息</span>
      </div>
      <div>
        <!--        <JsonViewer :json="sapSyncAlertsInfo.syncObjAttrs"></JsonViewer>
        <hr />-->

        <json-viewer
          :value="JSON.parse(sapSyncAlertsInfo.syncObjAttrs)"
          :expand-depth="5"
          copyable
          boxed
          sort
        />
        <!--        {{ jsonViw(sapSyncAlertsInfo.syncObjAttrs) }}-->
      </div>

    </el-card>
    <div
      slot="footer"
      class="bottom-btn-groups"
    >
      <el-button
        type="default"
        size="mini"
        @click="goBack()"
      >返回</el-button>
    </div>
  </div>
</template>

<script>
import { getHrSyncAlertsDetails } from "@http/mnt/sapSyncAlerts";
import Vue from "vue";
import JsonViewer from "vue-json-viewer";
Vue.use(JsonViewer);

export default {
  name: "HrSyncAlertsDetails",
  props: {
    id: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      sapSyncAlertsInfo: {},
    };
  },
  mounted() {
    this.getHrSyncAlertsDetails(this.$props.id);
  },
  methods: {
    getHrSyncAlertsDetails(argument) {
      getHrSyncAlertsDetails(argument).then((res) => {
        console.log(res);
        this.sapSyncAlertsInfo = res;
      });
    },
    goBack() {
      this.$emit("click", false);
      this.$router.push({ path: "/api/system/sapSyncAlerts/" });
    },
    jsonViw(jsonData) {
      new Vue({
        el: "#app",
        data() {
          return {
            jsonData: {
              total: 25,
              limit: 10,
              skip: 0,
              links: {
                previous: undefined,
                next: function () {},
              },
            },
          };
        },
      });
    },
  },
};
</script>

<style scoped>
.user-list {
  margin: 10px 0;
}

.my-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  text-align: left;
}

.label-content,
.user-label {
  line-height: 28px;
  font-size: 12px;
}

.user-label {
  width: 70px;
  display: inline-block;
  text-align: right;
}

.full-content {
  display: flex;
}

.full-content .user-label {
  flex-basis: 70px;
  width: 70px;
  display: inline-block;
  text-align: right;
}

.full-name {
  flex: 1;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
