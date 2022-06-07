<!--
 * @Author: Songjq
 * @Date: 2022-03-07 22:39:33
 * @Desscription: 
-->
<template>
  <div
    class="echart"
    ref="pieDom"
    :style="{ width: '100%', height: '100%' }"
  ></div>
</template>

<script>
import { postOrderChart } from "@http/finance/order.js";
import * as echarts from "echarts";
export default {
  data() {
    return {
      dateTimes: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 15),
        new Date(),
      ], // 最近一周
    };
  },
  created() {},
  methods: {
    /**
     * 初始化柱状图
     *
     */
    initChart() {
      // 获取近15天重置数据
      postOrderChart({
        startTime: this.dateTimes[0],
        endTime: this.dateTimes[1],
        status: 2,
      }).then((res) => {
        this.renderChart(res.data);
      });
    },

    // 渲染图表
    renderChart(data) {
      let getchart = echarts.init(this.$refs.pieDom);
      var option = {
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: data.dates,
          //设置轴线的属性
          axisLine: {
            lineStyle: {
              color: "#aaaaaa",
              width: 1, //这里是为了突出显示加上的
            },
          },
        },
        yAxis: {
          type: "value",
          //设置轴线的属性
          axisLine: {
            lineStyle: {
              color: "#aaaaaa",
              width: 1, //这里是为了突出显示加上的
            },
          },
          splitLine: false,
        },
        itemStyle: {
          color: "#5470c6",
        },
        series: [
          {
            data: data.counts,
            type: "bar",
            barWidth: 15,
            label: {
              show: true,
              position: "top",
            },
          },
        ],
      };

      getchart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        getchart.resize();
      });
    },
  },
};
</script>