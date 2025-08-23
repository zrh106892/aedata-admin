import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace PlatformUserApi {
  export interface PlatformUserItem {
    id: number;
    mobile: string;
    nickname: string;
    info: string;
    inside: number;
    create_time: string;
    update_time: string;
  }

  export interface PlatformUserList {
    total: number;
    items: PlatformUserItem[];
  }

  export interface UpdatePlatformUserRequest {
    mobile: string;
    nickname: string;
    info: string;
    inside: number;
  }
}

/**
 * 获取平台用户列表数据
 */
async function getPlatformUserList(params: Recordable<any>) {
  return requestClient.get<PlatformUserApi.PlatformUserList>(
    '/platform_user/list',
    {
      params,
    },
  );
}

/**
 * 更新平台用户
 * @param id 用户 ID
 * @param data 用户数据
 */
async function updatePlatformUser(
  id: number,
  data: PlatformUserApi.UpdatePlatformUserRequest,
) {
  return requestClient.put(`/platform_user/update/${id}`, data);
}

export { getPlatformUserList, updatePlatformUser };
