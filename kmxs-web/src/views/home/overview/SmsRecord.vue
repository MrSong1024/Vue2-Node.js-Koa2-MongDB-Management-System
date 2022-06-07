<!--
 * @Author: Songjq
 * @Date: 2022-03-07 22:40:13
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
import { getSmsReturnRecordChart } from "@http/sms/returnRecord.js";
import * as echarts from "echarts";
export default {
  data() {
    return {
      dateTimes: [
        new Date(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date(),
      ], // 最近一周
    };
  },
  methods: {
    initChart() {
      // 获取近7天重置数据
      getSmsReturnRecordChart({
        startTime: this.dateTimes[0],
        endTime: this.dateTimes[1],
      }).then((res) => {
        this.renderChart(res.data);
      });
    },

    // 渲染图表
    renderChart(data) {
      let getchart = echarts.init(this.$refs.pieDom);
      var option = {
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["成功", "失败"],
        },
        color: ["#91cc75", "#5470c6"],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        label: {
          show: true,
          position: "top",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
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
          position: "left",
          offset: 15,
        },
        series: [
          {
            name: "成功",
            type: "line",
            data: data.datax,
          },
          {
            name: "失败",
            type: "line",
            data: data.datay,
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