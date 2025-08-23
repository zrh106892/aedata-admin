import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace PromotionLinkApi {
  export interface PromotionLinkItem {
    id: number;
    name: string;
    url: string;
    create_time: string;
  }

  export interface PromotionLink {
    total: number;
    items: PromotionLinkItem[];
  }
}

/**
 * 获取推广链接列表数据
 */
async function getPromotionLinkList(params: Recordable<any>) {
  return requestClient.get<PromotionLinkApi.PromotionLink>(
    '/promotion/link/list',
    {
      params,
    },
  );
}

/**
 * 创建推广链接
 * @param data 推广链接数据
 */
async function createPromotionLink(
  data: Omit<PromotionLinkApi.PromotionLinkItem, 'id'>,
) {
  return requestClient.post('/promotion/link/create', data);
}

/**
 * 更新推广链接
 *
 * @param id 推广链接 ID
 * @param data 推广链接数据
 */
async function updatePromotionLink(
  id: string,
  data: Omit<PromotionLinkApi.PromotionLinkItem, 'id'>,
) {
  return requestClient.put(`/promotion/link/update/${id}`, data);
}

/**
 * 删除推广链接
 * @param id 推广链接 ID
 */
async function deletePromotionLink(id: string) {
  return requestClient.delete(`/promotion/link/delete/${id}`);
}

export {
  createPromotionLink,
  deletePromotionLink,
  getPromotionLinkList,
  updatePromotionLink,
};
