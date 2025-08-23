<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

onMounted(() => {
  renderEcharts({
    legend: {
      bottom: 0,
      data: ['渠道A', '渠道B', '渠道C', '渠道D'],
    },
    radar: {
      indicator: [
        { name: '渠道A' },
        { name: '渠道B' },
        { name: '渠道C' },
        { name: '渠道D' },
      ],
      radius: '60%',
      splitNumber: 8,
    },
    series: [
      {
        areaStyle: {
          opacity: 1,
          shadowBlur: 0,
          shadowColor: 'rgba(0,0,0,.2)',
          shadowOffsetX: 0,
          shadowOffsetY: 10,
        },
        data: [
          {
            itemStyle: { color: '#b6a2de' },
            name: '渠道A',
            value: [90, 50, 86, 40],
          },
          {
            itemStyle: { color: '#5ab1ef' },
            name: '渠道B',
            value: [70, 75, 70, 76],
          },
          {
            itemStyle: { color: '#67e0e3' },
            name: '渠道C',
            value: [60, 65, 60, 66],
          },
          {
            itemStyle: { color: '#2ec7c9' },
            name: '渠道D',
            value: [50, 55, 50, 56],
          },
        ],
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2,
        },
        symbolSize: 0,
        type: 'radar',
      },
    ],
    tooltip: {},
  });
});
</script>

<template>
  <EchartsUI ref="chartRef" />
</template>
