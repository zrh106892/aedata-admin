<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import type { PromotionAnalyticsApi } from '#/api/promotion/analytics';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const props = defineProps<{
  data: PromotionAnalyticsApi.TrendData[];
}>();

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

const renderChart = () => {
  // 计算转化率数据
  const totalClicks = props.data.reduce(
    (sum, item) => sum + item.click_count,
    0,
  );
  const totalPays = props.data.reduce((sum, item) => sum + item.pay_count, 0);
  const totalAmount = props.data.reduce(
    (sum, item) => sum + item.pay_amount,
    0,
  );

  const conversionRate = totalClicks > 0 ? (totalPays / totalClicks) * 100 : 0;
  const averageAmount = totalPays > 0 ? totalAmount / totalPays : 0;

  renderEcharts({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: '转化率',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: 100,
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid',
          },
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1,
        },
        emphasis: {
          label: {
            fontSize: 20,
          },
        },
        data: [
          { value: 100, name: '点击量' },
          { value: conversionRate, name: '付费转化率' },
          { value: averageAmount, name: '平均付费金额' },
        ],
      },
    ],
  });
};

watch(() => props.data, renderChart, { deep: true });

onMounted(() => {
  renderChart();
});
</script>

<template>
  <EchartsUI ref="chartRef" class="h-[400px]" />
</template>

<style scoped></style>
