import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace FeatureApi {
  export interface FeatureItem {
    id: number;
    api_id: string;
    name: string;
    create_time: string;
    update_time: string;
  }

  export interface FeatureList {
    total: number;
    items: FeatureItem[];
  }

  export interface CreateFeatureRequest {
    api_id: string;
    name: string;
  }

  export interface UpdateFeatureRequest {
    api_id?: string;
    name?: string;
  }
}

/**
 * 获取模块列表数据
 */
async function getFeatureList(params: Recordable<any>) {
  return requestClient.get<FeatureApi.FeatureList>('/feature/list', {
    params,
  });
}

/**
 * 获取模块详情
 * @param id 模块ID
 */
async function getFeatureDetail(id: number) {
  return requestClient.get<FeatureApi.FeatureItem>(`/feature/detail/${id}`);
}

/**
 * 创建模块
 * @param data 模块数据
 */
async function createFeature(data: FeatureApi.CreateFeatureRequest) {
  return requestClient.post<{ id: number }>('/feature/create', data);
}

/**
 * 更新模块
 * @param id 模块ID
 * @param data 模块数据
 */
async function updateFeature(
  id: number,
  data: FeatureApi.UpdateFeatureRequest,
) {
  return requestClient.put<{ success: boolean }>(`/feature/update/${id}`, data);
}

/**
 * 删除模块
 * @param id 模块ID
 */
async function deleteFeature(id: number) {
  return requestClient.delete<{ success: boolean }>(`/feature/delete/${id}`);
}

export {
  createFeature,
  deleteFeature,
  getFeatureDetail,
  getFeatureList,
  updateFeature,
};
