import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace OrderQueryApi {
  export interface QueryItem {
    feature: Recordable<any>;
    data: Recordable<any>;
  }

  export interface QueryDetail {
    id: number;
    order_id: number;
    user_id: number;
    product_name: string;
    query_params: Recordable<any>;
    query_data: QueryItem[];
    create_time: string;
    update_time: string;
    query_state: string;
  }

  export interface GetQueryDetailRequest {
    order_id: number;
  }

  export interface GetQueryDetailResponse {
    id: number;
    order_id: number;
    user_id: number;
    product_name: string;
    query_params: Recordable<any>;
    query_data: QueryItem[];
    create_time: string;
    update_time: string;
    query_state: string;
  }

  // 清理日志相关接口定义
  export interface GetQueryCleanupLogListRequest {
    page?: number;
    page_size?: number;
    status?: number;
    start_time?: string;
    end_time?: string;
  }

  export interface QueryCleanupLogItem {
    id: number;
    cleanup_time: string;
    cleanup_before: string;
    status: number;
    affected_rows: number;
    error_msg: string;
    remark: string;
    create_time: string;
  }

  export interface GetQueryCleanupLogListResponse {
    total: number;
    items: QueryCleanupLogItem[];
  }

  // 清理详情相关接口定义
  export interface GetQueryCleanupDetailListRequest {
    log_id: number;
    page?: number;
    page_size?: number;
  }

  export interface QueryCleanupDetailItem {
    id: number;
    cleanup_log_id: number;
    query_id: number;
    order_id: number;
    user_id: number;
    product_id: number;
    query_state: string;
    create_time_old: string;
    create_time: string;
  }

  export interface GetQueryCleanupDetailListResponse {
    total: number;
    items: QueryCleanupDetailItem[];
  }

  // 清理配置相关接口定义
  export interface GetQueryCleanupConfigListRequest {
    status?: number;
  }

  export interface QueryCleanupConfigItem {
    id: number;
    config_key: string;
    config_value: string;
    config_desc: string;
    status: number;
    create_time: string;
    update_time: string;
  }

  export interface GetQueryCleanupConfigListResponse {
    items: QueryCleanupConfigItem[];
  }

  export interface UpdateQueryCleanupConfigRequest {
    id: number;
    config_value: string;
    status: number;
  }

  export interface UpdateQueryCleanupConfigResponse {
    success: boolean;
  }
}

/**
 * 获取订单查询详情
 * @param orderId 订单ID
 */
async function getOrderQueryDetail(orderId: number) {
  return requestClient.get<OrderQueryApi.GetQueryDetailResponse>(
    `/query/detail/${orderId}`,
  );
}

/**
 * 获取清理日志列表
 */
async function getQueryCleanupLogList(
  params: OrderQueryApi.GetQueryCleanupLogListRequest,
) {
  return requestClient.get<OrderQueryApi.GetQueryCleanupLogListResponse>(
    '/query/cleanup/logs',
    { params },
  );
}

/**
 * 获取清理详情列表
 * @param logId 清理日志ID
 */
async function getQueryCleanupDetailList(
  logId: number,
  params: Omit<OrderQueryApi.GetQueryCleanupDetailListRequest, 'log_id'>,
) {
  return requestClient.get<OrderQueryApi.GetQueryCleanupDetailListResponse>(
    `/query/cleanup/details/${logId}`,
    { params },
  );
}

/**
 * 获取清理配置列表
 */
async function getQueryCleanupConfigList(
  params?: OrderQueryApi.GetQueryCleanupConfigListRequest,
) {
  return requestClient.get<OrderQueryApi.GetQueryCleanupConfigListResponse>(
    '/query/cleanup/configs',
    { params },
  );
}

/**
 * 更新清理配置
 */
async function updateQueryCleanupConfig(
  data: OrderQueryApi.UpdateQueryCleanupConfigRequest,
) {
  return requestClient.put<OrderQueryApi.UpdateQueryCleanupConfigResponse>(
    '/query/cleanup/config',
    data,
  );
}

export {
  getOrderQueryDetail,
  getQueryCleanupConfigList,
  getQueryCleanupDetailList,
  getQueryCleanupLogList,
  updateQueryCleanupConfig,
};
