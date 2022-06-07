<template>
  <div>
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" placeholder="请输入订单号">
        <template v-slot:left>
          <el-select
            size="mini"
            v-model="query.type"
            placeholder="充值类型"
            @change="crud.toQuery()"
            clearable
            filterable
            class="filter-item ui-w-120"
          >
            <el-option
              v-for="item in dict.sys_recharge_type"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="query.status"
            clearable
            size="mini"
            placeholder="状态"
            class="filter-item ui-w-100"
            @change="crud.toQuery()"
          >
            <el-option
              v-for="item in dict.sys_trade_status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-form ref="form" :model="form" :rules="rules" label-width="150px">
          <el-form-item label="充值类型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择"
              class="w-100"
              @change="setTypePicture"
            >
              <el-option
                v-for="item in dict.sys_recharge_type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="type">
            <el-image
              style="width: 200px; height: 200px"
              :src="typeImg"
            ></el-image>
          </el-form-item>
          <el-form-item label="充值金额（RMB）" prop="money">
            <el-input
              type="number"
              size="small"
              v-model="form.money"
              placeholder="请输入金额"
              @change="moneyToFixed(form.money)"
            ></el-input>
          </el-form-item>
          <el-form-item label="充值状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择"
              class="w-100"
              :disabled="crud.status.add == 1"
            >
              <el-option
                v-for="item in dict.sys_trade_status"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
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

      <!--表格渲染 暂时废弃-->
      <el-table
        ref="table"
        v-loading="crud.loading"
        :data="crud.data"
        height="calc(100vh - 180px)"
        border
        @selection-change="crud.selectionChangeHandler"
      >
        <el-table-column type="selection" width="40" />
        <el-table-column label="序号" type="index"> </el-table-column>
        <el-table-column label="订单编号" prop="orderNo" width="180">
        </el-table-column>
        <el-table-column prop="createBy" label="申请人" sortable width="120">
        </el-table-column>
        <el-table-column prop="type" label="充值类型" sortable width="120">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.type, dict.sys_recharge_type) }}
          </template>
        </el-table-column>
        <el-table-column prop="money" label="充值金额（RMB）" width="150">
        </el-table-column>
        <el-table-column prop="status" label="充值状态" sortable width="180">
          <template slot-scope="scope">
            {{ $utils.getAlias(scope.row.status, dict.sys_trade_status) }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" min-width="160">
          <template slot-scope="scope">
            {{ $utils.parseTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="90">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="toPay(scope.row)"
              :disabled="
                ['WAIT_BUYER_PAY', 'ACQ.TRADE_NOT_EXIST'].indexOf(
                  scope.row.status
                ) < 0
              "
              >继续支付</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import Order, { alipay } from "@http/finance/order.js";
import CRUD, { presenter, header, form, crud } from "@crud/crud";
import crudOperation from "@crud/CRUD.operation";
import udOperation from "@crud/UD.operation";
import rrOperation from "@crud/RR.operation";
import pagination from "@crud/Pagination";
import publice from "@/mixins/publice.js";

// crud交由presenter持有
const defaultCrud = CRUD({
  title: "充值订单",
  url: "api/Order/all",
  crudMethod: { ...Order },
  optShow: { del: true, user: true },
});

const defaultForm = {
  _id: null,
  type: "",
  money: "",
  status: "0",
  remark: "",
};

export default {
  name: "Order",
  components: {
    pagination,
    crudOperation,
    udOperation,
    rrOperation,
  },
  mixins: [
    presenter(defaultCrud),
    header(),
    form(defaultForm),
    crud(),
    publice,
  ],
  dicts: ["sys_recharge_type", "sys_trade_status"],
  data() {
    return {
      permission: {
        user: ["admin", "order:user"],
        list: ["admin", "order:list"],
        add: ["admin", "order:add"],
        edit: ["admin", "order:edit"],
        del: ["admin", "order:del"],
      },
      rules: {
        type: [
          { required: true, message: "请选择充值类型", trigger: "change" },
        ],
        money: [{ required: true, message: "请输入金额", trigger: "blur" }],
      },
      typeImg: "", // 支付图片
    };
  },
  created() {
    // 初始化新增
    if (this.$route.query.isAdd == 1) {
      this.addFn();
    }
  },
  methods: {
    /**
     * @Author: Songjq
     * @Date: 2021-12-07 23:59:08
     * @Fn:新增
     */
    addFn() {
      this.crud.toAdd();
    },

    // 设置金额保留两位小数
    moneyToFixed(val) {
      this.form.money = parseFloat(val).toFixed(2);
    },

    // 设置支付图片
    setTypePicture(item) {
      this.dict.sys_recharge_type.forEach((v) => {
        if (v.value == item) {
          this.typeImg = v.picture;
        }
      });
    },

    /**
     * 继续支付
     *
     * @param {Object} row 当前行数据
     */
    toPay(row) {
      const { orderNo, money, subject, body, type } = row;
      alipay({
        subject,
        body,
        totalAmount: money,
        payType: type,
        out_trade_no: orderNo, // 订单号
      }).then((res) => {
        window.open(res.data);
        this.$confirm(
          "将在新窗口为您打开付款界面，请按提示进行操作。",
          "提示",
          {
            confirmButtonText: "查看订单",
            cancelButtonText: "已完成付款",
            type: "warning",
          }
        )
          .then(() => {
            this.$router.push({
              path: "/finance/order",
            });
          })
          .catch(() => {
            this.$router.push({
              path: "/finance/order",
            });
          });
      });
    },
  },
};
</script>
<style lang="scss"></style>