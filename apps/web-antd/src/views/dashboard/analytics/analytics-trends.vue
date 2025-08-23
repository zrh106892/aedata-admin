<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    grid: {
      bottom: 0,
      containLabel: true,
      left: '1%',
      right: '1%',
      top: '2%',
    },
    series: [
      {
        areaStyle: {},
        data: [
          120, 300, 500, 800, 1200, 1800, 2500, 3000, 2800, 2600, 2400, 2200,
          2000, 1800, 1600, 1400, 1200, 1000, 800, 600, 400, 200, 100, 50, 30,
          20, 10, 5, 2, 1,
        ],
        itemStyle: {
          color: '#5ab1ef',
        },
        smooth: true,
        type: 'line',
        name: '访问量',
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#5ab1ef',
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      axisTick: {
        show: false,
      },
      boundaryGap: false,
      data: Array.from({ length: 30 }).map(
        (_item, index) => `Day ${index + 1}`,
      ),
      splitLine: {
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        show: true,
      },
      type: 'category',
    },
    yAxis: [
      {
        axisTick: {
          show: false,
        },
        max: 3000,
        splitArea: {
          show: true,
        },
        splitNumber: 4,
        type: 'value',
      },
    ],
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
