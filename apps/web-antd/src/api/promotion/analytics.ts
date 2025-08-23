import { requestClient } from '#/api/request';

export namespace PromotionAnalyticsApi {
  export interface OverviewData {
    today_click_count: number;
    today_pay_count: number;
    today_pay_amount: number;
    total_click_count: number;
    total_pay_count: number;
    total_pay_amount: number;
  }

  export interface TrendData {
    id: number;
    link_id: number;
    pay_amount: number;
    click_count: number;
    pay_count: number;
    stats_date: string;
  }
}

/**
 * 获取推广数据概览
 */
async function statsTotal() {
  return requestClient.get<PromotionAnalyticsApi.OverviewData>(
    '/promotion/stats/total',
  );
}

/**
 * 获取推广数据趋势
 * @param params 日期范围参数
 */
async function statsHistory(params: { end_date: string; start_date: string }) {
  return requestClient.get<PromotionAnalyticsApi.TrendData[]>(
    '/promotion/stats/history',
    {
      params,
    },
  );
}

export { statsHistory, statsTotal };
