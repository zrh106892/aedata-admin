<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import type { PromotionAnalyticsApi } from '#/api/promotion/analytics';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const props = defineProps<{
  data: PromotionAnalyticsApi.TrendData[];
  type: 'amount' | 'count';
}>();

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const renderChart = () => {
  const dates = props.data.map((item) => item.stats_date);
  const clickCounts = props.data.map((item) => item.click_count);
  const payCounts = props.data.map((item) => item.pay_count);
  const payAmounts = props.data.map((item) => item.pay_amount);

  renderEcharts({
    grid: {
      top: 60,
      left: 50,
      right: 50,
      bottom: 50,
    },
    legend: {
      data: props.type === 'count' ? ['点击数', '付费次数'] : ['付费金额'],
      top: 20,
    },
    series:
      props.type === 'count'
        ? [
            {
              name: '点击数',
              type: 'line',
              data: clickCounts,
              smooth: true,
              showSymbol: false,
              itemStyle: {
                color: '#5ab1ef',
              },
            },
            {
              name: '付费次数',
              type: 'line',
              data: payCounts,
              smooth: true,
              showSymbol: false,
              itemStyle: {
                color: '#019680',
              },
            },
          ]
        : [
            {
              name: '付费金额',
              type: 'line',
              data: payAmounts,
              smooth: true,
              showSymbol: false,
              itemStyle: {
                color: '#b6a2de',
              },
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(182, 162, 222, 0.3)',
                    },
                    {
                      offset: 1,
                      color: 'rgba(182, 162, 222, 0.1)',
                    },
                  ],
                },
              },
            },
          ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        formatter: (value: string) => value.slice(5), // 只显示月-日
      },
      splitLine: {
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        show: true,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value: number) => {
          if (props.type === 'amount') {
            return `¥${value}`;
          }
          return value.toString();
        },
      },
      splitLine: {
        lineStyle: {
          type: 'solid',
          width: 1,
        },
        show: true,
      },
    },
  });
};

watch(() => props.data, renderChart, { deep: true });
watch(() => props.type, renderChart);

onMounted(() => {
  renderChart();
});
</script>

<template>
  <EchartsUI ref="chartRef" class="h-[400px]" />
</template>

<style scoped></style>
