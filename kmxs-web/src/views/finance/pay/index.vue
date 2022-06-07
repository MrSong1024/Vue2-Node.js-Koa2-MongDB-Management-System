<!--
 * @Author: Songjq
 * @Date: 2022-04-08 17:17:27
 * @Desscription: 
-->
<template>
  <div class="head-container pay-style" v-loading="loading">
    <div class="title">在线充值</div>
    <div class="tx_div">
      <h3>充值说明：</h3>
      <p>
        1、我们提供在线充值服务（支付宝、银联、微信）<br />
        2、请尽量保障账户余额大于您在资费配置内设置的保底套餐额度，避免因余额不足造成业务中断<br />
        3、区块链、虚拟货币、Pos机、色情、赌博、棋牌、捕鱼 等违规类业务暂不支持
      </p>
    </div>
    <el-steps
      :active="active"
      finish-status="success"
      simple
      style="margin-top: 20px"
    >
      <el-step title="输入金额"></el-step>
      <el-step title="选择充值方式"></el-step>
      <el-step title="确认订单"></el-step>
      <el-step title="进行付款"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- 第一步 -->
    <div class="step1 w-100" v-if="active == 1">
      <h2 class="ui-flex ui-items-center ui-mgb-10 inner-title">
        <i>1</i>输入金额
      </h2>
      <div class="s11 ui-flex">
        <div class="s11_l ui-flex ui-cont-center ui-items-center">
          <span class="base_tit">充值金额：</span>
          <el-input
            class="ui-w-220"
            v-model="productInfo.totalAmount"
            placeholder="请输入充值金额"
          ></el-input>
        </div>

        <div class="s11_r ui-flex ui-items-center">
          <dl class="img">
            <dt>
              <img src="../../../assets/images/img_s2.png" />
            </dt>
            <dd>账户余额</dd>
          </dl>

          <dl class="acount ui-flex-1">
            <dt>{{ finance.availableAmount }}</dt>
            <dd>含赠送金额&nbsp;0&nbsp;元</dd>
          </dl>
        </div>
      </div>
    </div>

    <!-- 第二步 -->
    <div class="step2 w-100" v-else-if="active == 2">
      <h2 class="ui-flex ui-items-center ui-mgb-10 inner-title">
        <i>2</i>选择充值方式
      </h2>
      <ul class="ui-flex ui-cont-sa">
        <li>
          <el-radio
            v-model="productInfo.payType"
            label="1"
            border
            class="ui-flex ui-items-center"
            ><img src="../../../assets/images/alipay.png"
          /></el-radio>
        </li>
        <li>
          <el-radio
            v-model="productInfo.payType"
            label="2"
            border
            disabled
            class="ui-flex ui-items-center"
            ><img src="../../../assets/images/pay_m4.png"
          /></el-radio>
        </li>
        <li>
          <el-radio
            v-model="productInfo.payType"
            label="3"
            border
            disabled
            class="ui-flex ui-items-center"
            ><img src="../../../assets/images/pay_m2.png"
          /></el-radio>
        </li>
      </ul>
    </div>

    <!-- 第三步 -->
    <div class="step1 w-100" v-else-if="active == 3">
      <h2 class="ui-flex ui-items-center ui-mgb-10 inner-title">
        <i>3</i>确认订单
      </h2>
      <div class="s31">
        <dl style="background: rgb(249, 249, 249)">
          <dt>订单号:</dt>
          <dd>{{ productInfo.out_trade_no }}</dd>
        </dl>
        <dl>
          <dt>付款金额:</dt>
          <dd>
            <em>{{ productInfo.totalAmount }}</em
            >元
          </dd>
        </dl>
        <dl style="background: rgb(249, 249, 249)">
          <dt>付款方式:</dt>
          <dd class="dd_sel">
            {{ $utils.getAlias(productInfo.payType, dict.sys_recharge_type) }}
          </dd>
        </dl>
        <dl>
          <dt>订单状态:</dt>
          <dd><span>未完成支付</span></dd>
        </dl>
      </div>
    </div>

    <!-- 第四步 -->
    <div class="step1 w-100" v-else-if="active == 4">
      <h2 class="ui-flex ui-items-center ui-mgb-10 inner-title">
        <i>4</i>进行付款
      </h2>
      <div class="s31">
        <dl style="background: rgb(249, 249, 249)">
          <dt>订单号:</dt>
          <dd>{{ productInfo.out_trade_no }}</dd>
        </dl>
        <dl>
          <dt>付款金额:</dt>
          <dd>
            <em>{{ productInfo.totalAmount }}</em
            >元
          </dd>
        </dl>
        <dl style="background: rgb(249, 249, 249)">
          <dt>付款方式:</dt>
          <dd class="dd_sel">
            {{ $utils.getAlias(productInfo.payType, dict.sys_recharge_type) }}
          </dd>
        </dl>
        <dl>
          <dt>订单状态:</dt>
          <dd><span>支付中...</span></dd>
        </dl>
      </div>
    </div>

    <!-- 第五步 -->
    <div class="step1 w-100" v-else-if="active == 5">
      <h2 class="ui-flex ui-items-center ui-mgb-10 inner-title">
        <i>5</i>充值完成
      </h2>
      <div class="s51 ui-flex ui-items-center">
        <span>已经完成充值</span>
        <b>{{ productInfo.totalAmount }}&nbsp;元</b>
      </div>
    </div>

    <el-button
      type="primary"
      class="next-btn"
      v-if="active !== 1 && active !== 5"
      @click="stepPrv()"
      >上一步</el-button
    >
    <el-button
      type="primary"
      class="next-btn"
      v-if="active !== 5"
      @click="stepNext()"
      >下一步</el-button
    >
    <el-button
      type="primary"
      class="next-btn"
      @click="goOn()"
      v-if="active == 5"
      >继续充值</el-button
    >
  </div>
</template>

<script>
import { getUserCurrent } from "@http/login/login.js";
import { alipay, queryAlipay } from "@http/finance/order.js";
import publice from "@/mixins/publice.js";

export default {
  name: "Order",
  components: {},
  mixins: [publice],
  dicts: ["sys_recharge_type"],
  data() {
    return {
      permission: {
        user: ["admin", "order:user"],
        list: ["admin", "order:list"],
        add: ["admin", "order:add"],
        edit: ["admin", "order:edit"],
        del: ["admin", "order:del"],
      },
      loading: false,
      active: 1, // 当前步骤
      // 充值信息
      productInfo: {
        subject: "短信费用重置",
        body: "短信费用重置",
        totalAmount: 0,
        payType: "1",
        out_trade_no: "", // 订单号
      },
      // 财务信息
      finance: {},
    };
  },
  created() {
    // 获取用户信息
    getUserCurrent().then((res) => {
      this.finance = res.user.finance;
    });

    this.init();
  },
  methods: {
    /**
     * 初始化数据
     */
    init() {
      let out_trade_no = this.$route.query.out_trade_no;
      if (!out_trade_no) {
        return;
      }
      this.loading = true;
      // 查询订单充值状态
      queryAlipay({
        out_trade_no,
      }).then((res) => {
        // 交易状态：WAIT_BUYER_PAY（交易创建，等待买家付款）、TRADE_CLOSED（未付款交易超时关闭，或支付完成后全额退款）、TRADE_SUCCESS（交易支付成功）、TRADE_FINISHED（交易结束，不可退款）
        switch (res.trade_status) {
          // 交易支付成功
          case "TRADE_SUCCESS":
            this.productInfo.totalAmount = this.$route.query.total_amount;
            this.active = 5;

            break;

          // 交易结束，不可退款
          case "TRADE_FINISHED":
            break;

          // 交易创建，等待买家付款
          case "WAIT_BUYER_PAY":
            break;

          // 未付款交易超时关闭，或支付完成后全额退款
          case "TRADE_CLOSED":
            break;
        }
        this.loading = false;
      });
    },

    /**
     * 上一步
     */
    stepPrv() {
      this.active--;
    },

    /**
     * 下一步
     */
    stepNext() {
      if (this.productInfo.totalAmount <= 0) {
        this.$notify.error({
          title: "充值金额必须大于0",
        });
        return;
      }

      this.active++;
      switch (this.active) {
        // 确认订单，生成订单号
        case 3:
          this.productInfo.out_trade_no = `${this.$utils.parseTime(
            new Date(),
            "{y}{m}{d}{h}{i}{s}"
          )}${Math.floor(Math.random() * 900) + 100}`;
          break;

        // 进行付款
        case 4:
          alipay(this.productInfo).then((res) => {
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
          break;
      }
    },

    /**
     * 继续充值
     */
    goOn() {
      this.active = 1;
      this.productInfo.totalAmount = 0;
      this.$router.push({
        path: "/finance/pay",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.pay-style {
  padding: 10px 30px;
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    width: 100%;
    border-bottom: 1px solid #e7e5e5;
  }
  .tx_div {
    width: 100%;
    background: #fefaf1;
    padding: 15px;
    margin: 20px 0 0;
    box-sizing: border-box;
    h3 {
      font-size: 16px;
      padding-bottom: 10px;
    }
    p {
      line-height: 20px;
    }
  }

  .inner-title {
    font-size: 14px;
    i {
      width: 40px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      display: inline-block;
      margin: 0 10px 0 0;
      color: #54db93;
      border: 1px solid #54db93;
      border-radius: 50%;
      font-size: 18px;
    }
  }

  .step1 {
    margin-top: 20px;
    .s11 {
      background: #f4fafd;
      > div {
        width: 50%;
        height: 100px;
        &.s11_r {
          background: #eacb9b;
          padding-left: 5%;
          color: #fff;
          text-align: center;
          .img {
            dt {
              padding-bottom: 5px;
              img {
                width: 50px;
              }
            }
          }
          .acount {
            dt {
              font-size: 34px;
            }
          }
        }
      }
    }
    .s31 {
      margin-top: 10px;
      > dl {
        display: flex;
        height: 40px;
        line-height: 40px;
        dt {
          width: 150px;
          text-align: right;
          padding-right: 30px;
          font-weight: bold;
        }
        dd {
          em {
            color: #fea720;
            font-weight: bold;
            padding-right: 5px;
          }
          span {
            color: #02b9ef;
          }
        }
      }
    }
    .s51 {
      background: #f4fafd;
      padding: 25px 50px;
      height: 80px;
      box-sizing: border-box;
      span {
        font-size: 18px;
        color: #03c2fa;
        padding-right: 30px;
      }
      b {
        font-size: 34px;
        color: #808080;
      }
    }
  }

  .step2 {
    margin-top: 20px;
    ul {
      background: #f4fafd;
      list-style: none;
      li {
        padding: 20px 0;
        label {
          height: 78px;
          padding: 10px;
          box-sizing: border-box;
          img {
            width: 168px;
            height: 58px;
          }
        }
      }
    }
  }

  .next-btn {
    margin: 30px 20px 10px 0px;
    min-width: 96px;
  }
}
</style>