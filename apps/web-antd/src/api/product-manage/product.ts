import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace ProductApi {
  export interface ProductItem {
    id: number;
    product_name: string;
    product_en: string;
    description: string;
    notes: string;
    cost_price: number;
    sell_price: number;
    create_time: string;
    update_time: string;
  }

  export interface ProductList {
    total: number;
    items: ProductItem[];
  }

  export interface CreateProductRequest {
    product_name: string;
    product_en: string;
    description: string;
    notes?: string;
    cost_price: number;
    sell_price: number;
  }

  export interface UpdateProductRequest {
    product_name?: string;
    product_en?: string;
    description?: string;
    notes?: string;
    cost_price?: number;
    sell_price?: number;
  }

  export interface ProductFeatureListItem {
    id: number;
    product_id: number;
    feature_id: number;
    api_id: string;
    name: string;
    sort: number;
    enable: number;
    is_important: number;
    create_time: string;
    update_time: string;
  }

  export interface ProductFeatureItem {
    feature_id: number;
    sort: number;
    enable: number;
    is_important: number;
  }

  export interface UpdateProductFeaturesRequest {
    features: ProductFeatureItem[];
  }
}

/**
 * 获取产品列表数据
 */
async function getProductList(params: Recordable<any>) {
  return requestClient.get<ProductApi.ProductList>('/product/list', {
    params,
  });
}

/**
 * 获取产品详情
 * @param id 产品ID
 */
async function getProductDetail(id: number) {
  return requestClient.get<ProductApi.ProductItem>(`/product/detail/${id}`);
}

/**
 * 创建产品
 * @param data 产品数据
 */
async function createProduct(data: ProductApi.CreateProductRequest) {
  return requestClient.post<{ id: number }>('/product/create', data);
}

/**
 * 更新产品
 * @param id 产品ID
 * @param data 产品数据
 */
async function updateProduct(
  id: number,
  data: ProductApi.UpdateProductRequest,
) {
  return requestClient.put<{ success: boolean }>(`/product/update/${id}`, data);
}

/**
 * 删除产品
 * @param id 产品ID
 */
async function deleteProduct(id: number) {
  return requestClient.delete<{ success: boolean }>(`/product/delete/${id}`);
}

/**
 * 获取产品功能列表
 * @param productId 产品ID
 */
async function getProductFeatureList(productId: number) {
  return requestClient.get<ProductApi.ProductFeatureListItem[]>(
    `/product/feature/list/${productId}`,
  );
}

/**
 * 更新产品功能关联
 * @param productId 产品ID
 * @param data 功能列表数据
 */
async function updateProductFeatures(
  productId: number,
  data: ProductApi.UpdateProductFeaturesRequest,
) {
  return requestClient.put<{ success: boolean }>(
    `/product/feature/update/${productId}`,
    data,
  );
}

export {
  createProduct,
  deleteProduct,
  getProductDetail,
  getProductFeatureList,
  getProductList,
  updateProduct,
  updateProductFeatures,
};
