<!--
 * @Author: Songjq
 * @Date: 2022-03-30 21:14:43
 * @Desscription: 
-->
<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入短域名">
        <template v-slot:left>
          <el-select
            size="mini"
            v-model="query.type"
            placeholder="类型"
            @change="crud.toQuery()"
            clearable
            filterable
            class="filter-item ui-w-120"
          >
            <el-option
              v-for="item in dict.long_url_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表单组件-->
      <el-drawer
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        size="750px"
        append-to-body
        destroy-on-close
      >
        <div class="drawer__content">
          <div class="view-container inner-form">
            <el-form
              ref="form"
              :model="form"
              :rules="rules"
              label-width="150px"
            >
              <el-form-item
                v-permission="permission.write"
                label="绑定用户"
                prop="user"
              >
                <!-- 用户 -->
                <UserSelect
                  ref="user-select"
                  classStyle="w-100"
                  size="small"
                  :queryParam="form"
                  placeholder="绑定用户"
                />
              </el-form-item>
              <el-form-item label="短域名" prop="shortUrl">
                <el-input
                  :disabled="!checkPermission(permission.write)"
                  v-model="form.shortUrl"
                  placeholder="请输入短域名"
                ></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select
                  v-model="form.type"
                  placeholder="请选择"
                  class="w-100"
                  :disabled="!checkPermission(permission.write)"
                >
                  <el-option
                    v-for="item in dict.long_url_type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="长链接" prop="longUrlLists">
                <div class="dialogLong">
                  <div
                    class="ui-flex ui-items-center long"
                    v-for="(item, index) in form.longUrlLists"
                    :key="index"
                  >
                    <el-input
                      :disabled="!checkPermission(permission.write)"
                      v-model="item.label"
                      class="ui-w-130 ui-mgr-5"
                      placeholder="标题"
                    />
                    <el-input
                      :disabled="!checkPermission(permission.write)"
                      v-model="item.className"
                      class="ui-w-100 ui-mgr-5"
                      placeholder="类名"
                    />
                    <el-input
                      v-model="item.url"
                      class="ui-flex-1 ui-mgr-5"
                      placeholder="请输入对应长链接"
                    />
                    <i
                      v-permission="permission.write"
                      class="
                        el-icon-circle-plus
                        ui-size-18 ui-cous ui-mgr-5
                        changebtn
                      "
                      @click="addLongUrl(index)"
                    ></i>
                    <i
                      v-permission="permission.write"
                      v-if="form.longUrlLists.length > 1"
                      class="el-icon-remove ui-size-18 ui-cous changebtn"
                      @click="reduceLongUrl(index)"
                    ></i>
                  </div>
                </div>
              </el-form-item>
              <!-- 在线客服相关 start -->
              <template
                v-if="form.type == '1' && checkPermission(permission.online)"
              >
                <el-form-item label="电脑端-客服" prop="isOpenServicePc">
                  <div class="ui-flex ui-items-center ui-mgt-6">
                    <el-switch
                      v-model="form.isOpenServicePc"
                      :disabled="!checkPermission(['admin'])"
                    ></el-switch>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="客服系统为私有定制，如需开通，请联系管理员;【演示效果：ad45.cc】"
                      placement="top-start"
                    >
                      <i class="el-icon-warning tips"></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <el-form-item label="主题颜色" prop="serviceColor">
                  <el-color-picker
                    v-model="form.serviceColor"
                  ></el-color-picker>
                </el-form-item>
                <el-form-item label="显示位置" prop="servicePosition">
                  <el-radio
                    v-for="(item, idx) in position_options"
                    :key="idx"
                    v-model="form.servicePosition"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-form-item>
                <el-form-item label="默认展示" prop="serviceShow">
                  <el-radio
                    v-for="(item, idx) in show_options"
                    :key="idx"
                    v-model="form.serviceShow"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-form-item>
                <el-form-item label="联系方式" prop="serviceListsPc">
                  <div class="dialogLong">
                    <div
                      class="ui-flex ui-items-center long"
                      v-for="(item, index) in form.serviceListsPc"
                      :key="index"
                    >
                      <el-select
                        v-model="item.label"
                        placeholder="请选择"
                        class="ui-w-100 ui-mgr-5"
                        @change="doChangeType(item, true)"
                      >
                        <el-option
                          v-for="itm in dict.sys_contact_type"
                          :key="itm.value"
                          :label="itm.label"
                          :value="itm.value"
                        >
                        </el-option>
                      </el-select>
                      <el-input
                        v-model="item.value"
                        class="ui-w-100 ui-mgr-5"
                        placeholder="绑定账号"
                        @change="doChangeType(item, true)"
                      />
                      <el-input
                        v-model="item.url"
                        class="ui-flex-1 ui-mgr-5"
                        :disabled="
                          ['qq', 'WeChat', 'skype', 'telegram'].indexOf(
                            item.label
                          ) >= 0
                        "
                        placeholder="绑定链接"
                      />
                      <el-select
                        v-model="item.status"
                        placeholdeui-mgl-5r="状态"
                        class="ui-w-80 ui-mgr-5"
                      >
                        <el-option
                          v-for="itm in dict.sys_disabled_status"
                          :key="itm.value"
                          :label="itm.label"
                          :value="itm.value"
                        >
                        </el-option>
                      </el-select>
                      <div class="ui-w-65 ui-flex ui-cont-end">
                        <i
                          class="
                            el-icon-picture
                            ui-size-18 ui-cous ui-mgr-5
                            changebtn
                          "
                          v-if="item.label == 'WeChat'"
                          @click="editCropper(index, true)"
                        ></i>
                        <i
                          class="
                            el-icon-circle-plus
                            ui-size-18 ui-cous ui-mgr-5
                            changebtn
                          "
                          @click="addService(index, true)"
                        ></i>
                        <i
                          v-if="form.serviceListsPc.length > 1"
                          class="el-icon-remove ui-size-18 ui-cous changebtn"
                          @click="reduceService(index, true)"
                        ></i>
                      </div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="手机端-客服" prop="isOpenServicePhone">
                  <div class="ui-flex ui-items-center ui-mgt-6">
                    <el-switch
                      v-model="form.isOpenServicePhone"
                      :disabled="!checkPermission(['admin'])"
                    ></el-switch>
                    <el-tooltip
                      class="item"
                      effect="dark"
                      content="客服系统为私有定制，如需开通，请联系管理员;【演示效果：ad45.cc】"
                      placement="top-start"
                    >
                      <i class="el-icon-warning tips"></i>
                    </el-tooltip>
                  </div>
                </el-form-item>
                <el-form-item label="主题样式" prop="serviceTheme">
                  <el-radio
                    v-for="(item, idx) in theme_options"
                    :key="idx"
                    v-model="form.serviceTheme"
                    :label="item.value"
                    >{{ item.label }}</el-radio
                  >
                </el-form-item>
                <el-form-item label="联系方式" prop="serviceListsPhone">
                  <div class="dialogLong">
                    <div
                      class="ui-flex ui-items-center long"
                      v-for="(item, index) in form.serviceListsPhone"
                      :key="index"
                    >
                      <el-select
                        v-model="item.label"
                        placeholder="请选择"
                        class="ui-w-100 ui-mgr-5"
                        @change="doChangeType(item, false)"
                      >
                        <el-option
                          v-for="itm in dict.sys_contact_type"
                          :key="itm.value"
                          :label="itm.label"
                          :value="itm.value"
                        >
                        </el-option>
                      </el-select>
                      <el-input
                        v-model="item.value"
                        class="ui-w-100 ui-mgr-5"
                        placeholder="绑定账号"
                        @change="doChangeType(item, false)"
                      />
                      <el-input
                        v-model="item.url"
                        class="ui-flex-1 ui-mgr-5"
                        :disabled="
                          ['qq', 'WeChat', 'skype', 'telegram'].indexOf(
                            item.label
                          ) >= 0
                        "
                        placeholder="绑定链接"
                      />
                      <el-select
                        v-model="item.status"
                        placeholdeui-mgl-5r="状态"
                        class="ui-w-80 ui-mgr-5"
                      >
                        <el-option
                          v-for="itm in dict.sys_disabled_status"
                          :key="itm.value"
                          :label="itm.label"
                          :value="itm.value"
                        >
                        </el-option>
                      </el-select>
                      <div class="ui-w-65 ui-flex ui-cont-end">
                        <i
                          class="
                            el-icon-picture
                            ui-size-18 ui-cous ui-mgr-5
                            changebtn
                          "
                          v-if="item.label == 'WeChat'"
                          @click="editCropper(index, false)"
                        ></i>
                        <i
                          class="
                            el-icon-circle-plus
                            ui-size-18 ui-cous ui-mgr-5
                            changebtn
                          "
                          @click="addService(index, false)"
                        ></i>
                        <i
                          v-if="form.serviceListsPhone.length > 1"
                          class="el-icon-remove ui-size-18 ui-cous changebtn"
                          @click="reduceService(index, false)"
                        ></i>
                      </div>
                    </div>
                  </div>
                </el-form-item>
                <el-form-item label="在线时间" prop="serviceStartTime">
                  <el-time-select
                    placeholder="上班时间"
                    v-model="form.serviceStartTime"
                    :picker-options="{
                      start: '08:00',
                      step: '00:60',
                      end: '24:00',
                      maxTime: form.serviceEndTime,
                    }"
                  >
                  </el-time-select>
                  <el-time-select
                    placeholder="下班时间"
                    v-model="form.serviceEndTime"
                    :picker-options="{
                      start: '08:00',
                      step: '00:60',
                      end: '24:00',
                      minTime: form.serviceStartTime,
                    }"
                  >
                  </el-time-select>
                </el-form-item>
                <el-form-item
                  label="技术支持"
                  prop="serviceIt"
                  v-if="checkPermission(['admin'])"
                >
                  <el-input
                    v-model="form.serviceIt"
                    placeholder="请输入技术联系方式"
                  ></el-input>
                </el-form-item>
              </template>
              <!-- 在线客服相关 end -->
              <el-form-item label="状态" prop="status">
                <el-radio
                  :disabled="!checkPermission(permission.write)"
                  v-for="(item, idx) in dict.sys_disabled_status"
                  :key="idx"
                  v-model="form.status"
                  :label="item.value"
                  >{{ item.label }}</el-radio
                >
              </el-form-item>
              <el-form-item label="过期时间" prop="expirationTime">
                <el-date-picker
                  :disabled="!checkPermission(permission.write)"
                  type="date"
                  placeholder="选择日期"
                  v-model="form.expirationTime"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
              <el-form-item label="描述" prop="desc">
                <el-input type="textarea" v-model="form.desc"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="view-footer">
            <el-button @click="crud.cancelCU">取消</el-button>
            <el-button
              :loading="crud.btnLoading"
              type="primary"
              @click="crud.submitCU"
              >确认</el-button
            >
          </div>
        </div>
      </el-drawer>

      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        style="width: 100%"
        border
        :default-sort="{ prop: 'id', order: 'descending' }"
        height="calc(100vh - 180px)"
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="shortUrl" label="短域名" sortable width="120">
          <template slot-scope="scope">
            <a :href="'http://' + scope.row.shortUrl" target="blank">
              {{ scope.row.shortUrl }}
            </a>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" sortable width="80">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.type, dict.long_url_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="longUrlLists" label="长链接 (点击可直接测试)">
          <template slot-scope="scope">
            <div class="longUrlLists">
              <div
                class="ui-flex ui-pdt-6 ui-pdb-6 ui-items-center"
                v-for="(item, index) in scope.row.longUrlLists"
                :key="index"
              >
                <span style="font-weight: bold">{{ item.label }}：</span>
                <span>
                  <a :href="item.url" target="blank" style="color: #0083ff">
                    {{ item.url }}
                  </a>
                </span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="expirationTime"
          label="过期日期"
          sortable
          width="100"
        >
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.expirationTime, "{y}-{m}-{d}") }}
          </template>
        </el-table-column>
        <el-table-column prop="desc" label="描述" width="180">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission" />
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>

    <!-- 获取图片 -->
    <UploadPicture
      ref="upload-picture"
      :img="showImg"
      title="绑定微信二维码"
      @setPicture="setPicture"
    />
  </div>
</template>

<script>
import DNS from "@http/domain/dns.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import UploadPicture from "@/components/UploadPicture/index.vue";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "长链接",
  url: "api/dns/all",
  crudMethod: { ...DNS },
  optShow: {
    user: true,
    status: true,
    add: true,
    del: true,
    download: true,
    enable: true,
    disable: true,
  },
});

const defaultForm = {
  _id: null,
  user: "",
  shortUrl: "",
  type: "",
  longUrlLists: [
    {
      label: "跳转",
      className: "",
      url: "",
      des: "",
    },
  ],
  status: "0",
  expirationTime: null,
  desc: "",
  isOpenServicePc: false,
  isOpenServicePhone: false,
  serviceColor: "#2761ff",
  serviceListsPc: [
    {
      label: "",
      value: "",
      status: "0",
      url: "",
      remark: "",
      picture: "",
    },
  ],
  serviceListsPhone: [
    {
      label: "",
      value: "",
      status: "0",
      url: "",
      remark: "",
      picture: "",
    },
  ],
  servicePosition: "right",
  serviceShow: false,
  serviceTheme: "black",
  serviceStartTime: "",
  serviceEndTime: "",
  serviceIt: "",
};

export default {
  name: "DNS",
  components: {
    pagination,
    crudOperation,
    udOperation,
    rrOperation,
    UploadPicture,
  },
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["long_url_type", "sys_disabled_status", "sys_contact_type"],
  data() {
    return {
      permission: {
        user: ["admin", "dns:user"],
        list: ["admin", "dns:list"],
        add: ["admin", "dns:add"],
        edit: ["admin", "dns:edit"],
        del: ["admin", "dns:del"],
        write: ["admin", "dns:write"],
        export: ["admin", "dns:export"],
        enable: ["admin", "dns:enable"],
        disable: ["admin", "dns:disable"],
        online: ["admin", "dns:online"],
      },
      rules: {
        user: [{ required: true, message: "请绑定用户", trigger: "change" }],
        shortUrl: [
          { required: true, message: "请输入短域名", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择类型", trigger: "change" }],
        expirationTime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
      },
      showImg: "", // 当前展示的图片
      showIndex: "", // 当前操作的索引
      showType: "", // 展示类型
      position_options: [
        {
          value: "left",
          label: "左侧",
        },
        {
          value: "right",
          label: "右侧",
        },
      ],
      show_options: [
        {
          value: false,
          label: "展开",
        },
        {
          value: true,
          label: "收缩",
        },
      ],
      theme_options: [
        {
          value: "black",
          label: "深色",
        },
        {
          value: "white",
          label: "浅色",
        },
      ],
    };
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true;
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-08 23:14:45
     * @Fn:增加长链接
     */
    addLongUrl(idx) {
      this.form.longUrlLists.splice(idx + 1, 0, {
        label: "",
        className: "",
        url: "",
        des: "",
      });
    },

    // 减少
    reduceLongUrl(idx) {
      this.form.longUrlLists.splice(idx, 1);
    },

    // 编辑客服
    doChangeType(item, type) {
      switch (item.label) {
        case "qq":
          if (type) {
            this.$set(
              item,
              "url",
              `tencent://message/?uin=${item.value}&Menu=yes`
            );
          } else {
            this.$set(
              item,
              "url",
              `mqqwpa://im/chat?chat_type=wpa&uin=${item.value}&version=1&src_type=web`
            );
          }
          break;

        case "WeChat":
          this.$set(item, "url", "");
          break;

        case "skype":
          this.$set(item, "url", `skype:${item.value}?call`);
          break;

        case "telegram":
          this.$set(item, "url", `https://t.me/${item.value}`);
          break;

        case "flygram":
          this.$set(item, "url", "https://www.flygram3.com");
          break;

        case "bianfu":
          this.$set(item, "url", "https://web.batchat.com/#/login");
          break;

        case "cloudchat":
          this.$set(item, "url", "https://www.cloudchat.com/");
          break;

        case "potato":
          this.$set(item, "url", "https://www.potato.im/");
          break;

        case "68":
          this.$set(item, "url", "");
          break;

        case "online":
          this.$set(item, "url", "");
          break;
      }
    },

    /**
     * @Author: Songjq
     * @Date: 2021-12-08 23:14:45
     * @Fn:增加客服
     */
    addService(idx, type) {
      this.form[type ? "serviceListsPc" : "serviceListsPhone"].splice(
        idx + 1,
        0,
        {
          label: "",
          value: "",
          status: "0",
          url: "",
          remark: "",
          picture: "",
        }
      );
    },

    // 减少客服
    reduceService(idx, type) {
      this.form[type ? "serviceListsPc" : "serviceListsPhone"].splice(idx, 1);
    },

    // 编辑头像
    editCropper(index, type) {
      this.$refs["upload-picture"].open = true;
      this.showIndex = index;
      this.showType = type;

      if (type) {
        this.showImg = this.form.serviceListsPc[this.showIndex].picture;
      } else {
        this.showImg = this.form.serviceListsPhone[this.showIndex].picture;
      }

      this.$nextTick(() => {
        this.$refs["upload-picture"].init();
      });
    },

    /**
     * @Author: Songjq
     * @Date: 2022-02-27 00:16:39
     * @Fn: 设置字典图片
     */
    setPicture(data) {
      if (this.showType) {
        this.form.serviceListsPc[this.showIndex].picture = data;
      } else {
        this.form.serviceListsPhone[this.showIndex].picture = data;
      }
      this.$refs["upload-picture"].open = false;
      this.$refs["upload-picture"].visible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.tips {
  color: #2761ff;
  font-size: 16px;
  cursor: pointer;
  margin-left: 5px;
}
</style>