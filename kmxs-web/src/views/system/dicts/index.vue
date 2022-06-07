<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入字典名称/类型">
        <template v-slot:left>
          <rrOperation :crud="crud" />
        </template>
        <template v-slot:right></template>
      </crudOperation>

      <!--表单渲染-->
      <el-dialog
        :close-on-click-modal="false"
        :before-close="crud.cancelCU"
        :visible.sync="crud.status.cu > 0"
        :title="crud.status.title"
        width="660px"
        :append-to-body="true"
      >
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="字典名称" prop="dictName">
            <el-input
              size="small"
              v-model="form.dictName"
              placeholder="请输入字典名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input
              size="small"
              v-model="form.dictType"
              placeholder="请输入字典类型"
            ></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio
              v-for="(item, idx) in dict.sys_disabled_status"
              :key="idx"
              v-model="form.status"
              :label="item.value"
              >{{ item.label }}</el-radio
            >
          </el-form-item>

          <el-form-item label="字典值" prop="dictList">
            <div class="dialogLong">
              <div
                class="ui-flex ui-items-center long"
                v-for="(item, index) in form.dictList"
                :key="index"
              >
                <el-input
                  v-model="item.label"
                  size="small"
                  class="ui-w-180 ui-mgr-6"
                  placeholder="字典标签"
                />
                <el-input
                  v-model="item.value"
                  size="small"
                  class="ui-w-50 ui-mgr-6"
                  placeholder="字典键值"
                />
                <el-select
                  v-model="item.status"
                  placeholder="状态"
                  class="ui-w-80 ui-mgr-6"
                >
                  <el-option
                    v-for="itm in dict.sys_disabled_status"
                    :key="itm.value"
                    :label="itm.label"
                    :value="itm.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  v-model="item.remark"
                  size="small"
                  placeholder="描述"
                  class="ui-flex-1"
                />
                <i
                  class="el-icon-picture ui-size-18 ui-cous ui-mgl-6 changebtn"
                  @click="editCropper(index)"
                ></i>
                <i
                  class="
                    el-icon-circle-plus
                    ui-size-18 ui-cous ui-mgl-6
                    changebtn
                  "
                  @click="addLongUrl(index)"
                ></i>
                <i
                  class="el-icon-remove ui-size-18 ui-cous ui-mgl-6 changebtn"
                  @click="reduceLongUrl(index)"
                ></i>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button
            :loading="crud.btnLoading"
            type="primary"
            @click="crud.submitCU"
            >确认</el-button
          >
        </span>
      </el-dialog>

      <!--表格渲染-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        height="calc(100vh - 180px)"
        border
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="40"> </el-table-column>
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column prop="dictName" label="字典名称" min-width="180">
        </el-table-column>
        <el-table-column prop="dictType" label="字典类型" min-width="180">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="scope">
            <disabled-tag
              :status="scope.row.status"
              :options="dict.sys_disabled_status"
            />
          </template>
        </el-table-column>
        <el-table-column label="字典值" align="center" min-width="200">
          <el-table-column prop="label" label="字典标签" width="200">
            <template slot-scope="scope">
              <div class="longUrlLists">
                <div
                  class="ui-pdt-6 ui-pdb-6"
                  v-for="(item, index) in scope.row.dictList"
                  :key="index"
                >
                  {{ item.label }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="字典键值" width="180">
            <template slot-scope="scope">
              <div class="longUrlLists">
                <div
                  class="ui-pdt-6 ui-pdb-6"
                  v-for="(item, index) in scope.row.dictList"
                  :key="index"
                >
                  {{ item.value }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <div class="longUrlLists">
                <div
                  class="ui-pdt-6 ui-pdb-6"
                  v-for="(item, index) in scope.row.dictList"
                  :key="index"
                >
                  <disabled-tag
                    :status="item.status"
                    :options="dict.sys_disabled_status"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="描述" width="120">
            <template slot-scope="scope">
              <div class="longUrlLists">
                <div
                  class="ui-pdt-6 ui-pdb-6"
                  v-for="(item, index) in scope.row.dictList"
                  :key="index"
                >
                  {{ item.remark || "-" }}
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="60">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            ></udOperation>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
    <!--工具栏-->

    <!-- 获取图片 -->
    <UploadPicture
      ref="upload-picture"
      :img="showImg"
      title="绑定图片"
      @setPicture="setPicture"
    />
  </div>
</template>

<script>
import Dict from "@http/system/dict.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";
import UploadPicture from "@/components/UploadPicture/index.vue";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "字典",
  url: "api/dict/all",
  crudMethod: { ...Dict },
  optShow: { status: true, add: true, del: true, enable: true, disable: true },
});

const defaultForm = {
  _id: null,
  dictName: "",
  dictType: "",
  status: "0",
  remark: "",
  dictList: [
    {
      label: "",
      value: "",
      status: "",
      remark: "",
    },
  ],
};

export default {
  name: "dicts",
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_disabled_status"],
  components: {
    UploadPicture,
    pagination,
    crudOperation,
    udOperation,
    rrOperation,
  },
  data() {
    return {
      permission: {
        list: ["admin", "dicts:list"],
        add: ["admin", "dicts:add"],
        edit: ["admin", "dicts:edit"],
        del: ["admin", "dicts:del"],
        enable: ["admin", "dicts:enable"],
        disable: ["admin", "dicts:disable"],
      },
      rules: {
        dictName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
        dictType: [
          { required: true, message: "请输入字典类型", trigger: "blur" },
        ],
      },
      showImg: "", // 当前展示的图片
      showIndex: "", // 当前操作的索引
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
    addLongUrl() {
      this.form.dictList.push({
        label: "",
        value: "",
        status: "",
        remark: "",
      });
    },

    // 减少
    reduceLongUrl(idx) {
      this.form.dictList.splice(idx, 1);
    },

    // 编辑头像
    editCropper(index) {
      this.$refs["upload-picture"].open = true;
      this.showIndex = index;
      this.showImg = this.form.dictList[this.showIndex].picture;
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
      this.form.dictList[this.showIndex].picture = data;
      this.$refs["upload-picture"].open = false;
      this.$refs["upload-picture"].visible = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
