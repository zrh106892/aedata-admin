<script lang="ts" setup>
import type { AnalysisOverviewItem } from '@vben/common-ui';

import type { PromotionAnalyticsApi } from '#/api/promotion/analytics';

import { onMounted, ref } from 'vue';

import { AnalysisChartCard, AnalysisOverview } from '@vben/common-ui';
import { SvgCakeIcon, SvgCardIcon, SvgDownloadIcon } from '@vben/icons';

import { DatePicker } from 'ant-design-vue';
import dayjs from 'dayjs';

import { statsHistory, statsTotal } from '#/api/promotion/analytics';

import PromotionTrends from './promotion-trends.vue';

const overviewItems = ref<AnalysisOverviewItem[]>([
  {
    icon: SvgCardIcon,
    title: '今日点击数',
    totalTitle: '累计',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgCakeIcon,
    title: '今日付费次数',
    totalTitle: '累计',
    totalValue: 0,
    value: 0,
  },
  {
    icon: SvgDownloadIcon,
    title: '今日付费金额',
    totalTitle: '累计',
    totalValue: 0,
    value: 0,
  },
]);

const trendData = ref<PromotionAnalyticsApi.TrendData[]>([]);
const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs]>([
  dayjs().subtract(7, 'day'),
  dayjs(),
]);

const fetchOverview = async () => {
  try {
    const data = await statsTotal();
    overviewItems.value = [
      {
        icon: SvgCardIcon,
        title: '今日点击数',
        totalTitle: '累计',
        totalValue: data.total_click_count,
        value: data.today_click_count,
        decimals: 0,
      },
      {
        icon: SvgCakeIcon,
        title: '今日付费次数',
        totalTitle: '累计',
        totalValue: data.total_pay_count,
        value: data.today_pay_count,
        decimals: 0,
      },
      {
        icon: SvgDownloadIcon,
        title: '今日付费金额',
        totalTitle: '累计',
        totalValue: data.total_pay_amount,
        value: data.today_pay_amount,
        decimals: 2,
      },
    ];
  } catch (error) {
    console.error('获取概览数据失败:', error);
  }
};

const fetchTrendData = async () => {
  try {
    const data = await statsHistory({
      start_date: dateRange.value[0].format('YYYY-MM-DD'),
      end_date: dateRange.value[1].format('YYYY-MM-DD'),
    });
    trendData.value = data;
  } catch (error) {
    console.error('获取趋势数据失败:', error);
  }
};

const handleDateChange = () => {
  fetchTrendData();
};

onMounted(() => {
  fetchOverview();
  fetchTrendData();
});
</script>

<template>
  <div class="p-5">
    <AnalysisOverview :items="overviewItems" />
    <div class="mt-5">
      <AnalysisChartCard title="数据趋势">
        <div class="flex flex-col gap-4">
          <div class="flex justify-end">
            <DatePicker.RangePicker
              v-model:value="dateRange"
              @change="handleDateChange"
            />
          </div>
          <PromotionTrends type="count" :data="trendData" />
          <PromotionTrends type="amount" :data="trendData" />
        </div>
      </AnalysisChartCard>
    </div>
  </div>
</template>

<style scoped></style>
