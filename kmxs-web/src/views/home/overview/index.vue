<!--
 * @Author: Songjq
 * @Date: 2021-11-25 14:25:54
 * @Desscription: 概览
-->
<template>
  <div class="ui-flex ui-column overview">
    <div class="top-item ui-flex ui-flex-wrap ui-cont-sb">
      <div class="o-item ui-flex">
        <div class="left">
          <p>可用余额</p>
          <span>{{ finance.availableAmount }}<b>(RMB)</b></span>
        </div>
        <div class="right">
          <img src="../../../assets/images/5.png" alt="" />
        </div>
      </div>
      <div class="o-item ui-flex">
        <div class="left">
          <p>消费金额</p>
          <span>{{ finance.cashAmount }}<b>(RMB)</b></span>
        </div>
        <div class="right">
          <img src="../../../assets/images/1.png" alt="" />
        </div>
      </div>
      <div class="o-item ui-flex">
        <div class="left">
          <p>充值总额</p>
          <span>{{ finance.amount }}<b>(RMB)</b></span>
        </div>
        <div class="right">
          <img src="../../../assets/images/3.png" alt="" />
        </div>
      </div>
      <div class="o-item ui-flex">
        <div class="left">
          <p>短信单价</p>
          <span>{{ finance.smsPrice }}<b>(RMB)</b></span>
        </div>
        <div class="right">
          <img src="../../../assets/images/6.png" alt="" />
        </div>
      </div>
      <div class="o-item ui-flex">
        <div class="left">
          <p>可用条数</p>
          <span>{{ finance.usableAmount }}<b>(条)</b></span>
        </div>
        <div class="right">
          <img src="../../../assets/images/2.png" alt="" />
        </div>
      </div>
      <div class="o-item ui-flex">
        <div class="left">
          <p>发送总数</p>
          <span>{{ finance.sendSmsAmount }}<b>(条)</b></span>
        </div>
        <div class="right">
          <img src="../../../assets/images/4.png" alt="" />
        </div>
      </div>
    </div>
    <div class="bottom-item ui-flex ui-cont-sb ui-flex-1">
      <div class="b-item">
        <div class="title">
          充值记录统计
          <span class="ui-size-12" style="color: #aaaaaa">(元/RMB)</span>
        </div>
        <div class="content">
          <RechargeRecord ref="recharge-record" />
        </div>
      </div>

      <div class="b-item">
        <div class="title">
          短信发送统计
          <span class="ui-size-12" style="color: #aaaaaa">(条)</span>
        </div>
        <div class="content">
          <SmsRecord ref="sms-record" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserCurrent } from "@http/login/login.js";
import RechargeRecord from "./RechargeRecord";
import SmsRecord from "./SmsRecord";
export default {
  name: "index",
  components: { RechargeRecord, SmsRecord },
  data() {
    return {
      // 财务信息
      finance: {},
    };
  },
  computed: {},
  mounted() {
    // 获取用户信息
    getUserCurrent().then((res) => {
      this.finance = res.user.finance;
    });
    this.$refs["recharge-record"].initChart();
    this.$refs["sms-record"].initChart();
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
// 概览
.overview {
  .o-item {
    width: 32.5%;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.06);
    border-radius: 6px;
    align-items: center;
    padding: 35px;
    box-sizing: border-box;
  }
  .top-item {
    .o-item {
      margin-bottom: 20px;
      height: 146px;
      .left {
        color: #fff;
        flex: 1;
        p {
          font-size: 14px;
          padding-bottom: 5px;
        }
        span {
          font-size: 36px;
          b {
            font-weight: normal;
            font-size: 14px;
            padding-left: 5px;
          }
        }
      }
      .right {
        width: 108px;
        img {
          width: 100%;
        }
      }
      &:nth-of-type(1) {
        background: linear-gradient(90deg, #0094ff 0%, #00d2ff 100%);
      }
      &:nth-of-type(2) {
        background: linear-gradient(90deg, #8e80f3 0%, #aca0ff 100%);
      }
      &:nth-of-type(3) {
        background: linear-gradient(90deg, #00c4ee 0%, #51f6e8 100%);
      }
      &:nth-of-type(4) {
        background: linear-gradient(90deg, #5ecc7b 0%, #9ff1b4 100%);
      }
      &:nth-of-type(5) {
        background: linear-gradient(270deg, #fad961 0%, #ffaa7a 100%);
      }
      &:nth-of-type(6) {
        background: linear-gradient(90deg, #0094ff 0%, #00d2ff 100%);
      }
    }
  }
  .bottom-item {
    .b-item {
      width: 49.3%;
      box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.06);
      border-radius: 6px;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
      height: 300px;
      .title {
        font-size: 16px;
      }
      .content {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        .inner {
          &:nth-of-type(1) {
            width: 300px;
            height: 300px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background-color: #f4f9ff;
            flex-direction: column;
            p {
              font-size: 16px;
              color: #aaaaaa;
            }
            span {
              font-size: 36px;
            }
          }
        }
      }
    }
  }
}
</style>
