<!--
 * @Author: Songjq
 * @Date: 2021-11-30 16:28:46
 * @Desscription: 圆环
-->
<template>
  <div
    class="echart"
    ref="pieDom"
    :style="{width: '100%', height: '100%'}"
  ></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  methods: {
    initChart(data) {
      let getchart = echarts.init(this.$refs.pieDom)
      let total = 49
      var option = {
        title: {
          zlevel: 0,
          text: ['{name|总数}', '{value|' + total + '}'].join('\n'),
          rich: {
            name: {
              color: '#AAAAAA',
              fontSize: 40,
              fontWeight: 'bold',
              lineHeight: 60
            },
            value: {
              color: '#909399',
              lineHeight: 20,
              fontSize: 36
            }
          },
          top: 'center',
          left: '48%',
          textAlign: 'center',
          textStyle: {
            rich: {
              value: {
                color: '#303133',
                fontSize: 40,
                fontWeight: 'bold',
                lineHeight: 40
              },
              name: {
                color: '#909399',
                lineHeight: 20
              }
            }
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          bottom: '5%',
          left: 'center'
        },
        color: ['#FBD564', '#0083FF'],
        series: [
          {
            name: 'Access From',
            type: 'pie',
            left: 40,
            right: 40,
            radius: ['60%', '70%'],
            avoidLabelOverlap: false,
            colorBy: 'data',
            label: {
              normal: {
                show: true,
                position: 'outside',
                formatter: '{d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '12'
                }
              }
            },
            labelLine: {
              normal: {
                show: true,
                length: 10,
                length2: 10
              }
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            data: data
          }
        ]
      }

      getchart.setOption(option)
      //随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        getchart.resize()
      })
    }
  }
}
</script>