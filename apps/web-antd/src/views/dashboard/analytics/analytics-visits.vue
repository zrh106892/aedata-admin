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
        barMaxWidth: 80,
        data: [
          30, 20, 33, 50, 32, 42, 32, 21, 30, 51, 60, 32, 48, 40, 35, 28, 22,
          18, 15, 10, 8, 6, 4, 2, 1, 1, 0, 0, 0, 0,
        ],
        type: 'bar',
        name: '订单数',
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      data: Array.from({ length: 30 }).map(
        (_item, index) => `Day ${index + 1}`,
      ),
      type: 'category',
    },
    yAxis: {
      max: 80,
      splitNumber: 4,
      type: 'value',
    },
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
