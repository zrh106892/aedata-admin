import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace OrderApi {
  export interface Order {
    id: number;
    order_no: string;
    platform_order_id: string;
    product_name: string;
    payment_platform: 'alipay' | 'appleiap' | 'wechat';
    payment_scene: 'app' | 'h5' | 'mini_program' | 'public_account';
    amount: number;
    status: 'closed' | 'failed' | 'paid' | 'pending' | 'refunded';
    query_state: 'cleaned' | 'failed' | 'pending' | 'processing' | 'success';
    create_time: string;
    pay_time: null | string;
    refund_time: null | string;
    is_promotion: 0 | 1;
  }

  export interface OrderList {
    total: number;
    items: Order[];
  }

  export interface RefundOrderRequest {
    refund_amount: number;
    refund_reason: string;
  }

  export interface RefundOrderResponse {
    status: string;
    refund_no: string;
    amount: number;
  }
}

/**
 * 获取订单列表数据
 */
async function getOrderList(params: Recordable<any>) {
  return requestClient.get<OrderApi.OrderList>('/order/list', {
    params,
  });
}

/**
 * 订单退款
 * @param id 订单 ID
 * @param data 退款请求数据
 */
async function refundOrder(id: number, data: OrderApi.RefundOrderRequest) {
  return requestClient.post<OrderApi.RefundOrderResponse>(
    `/order/refund/${id}`,
    data,
  );
}

export { getOrderList, refundOrder };
