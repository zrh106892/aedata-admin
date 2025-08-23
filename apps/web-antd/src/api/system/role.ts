import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRoleItem {
    id: number;
    role_name: string;
    role_code: string;
    description?: string;
    status: 0 | 1;
    sort: number;
    create_time: string;
    menu_ids: number[];
  }

  export interface SystemRole {
    total: number;
    items: SystemRoleItem[];
  }
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  return requestClient.get<SystemRoleApi.SystemRole>('/role/list', {
    params,
  });
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRoleItem, 'id'>) {
  return requestClient.post('/role/create', data);
}

/**
 * 更新角色
 *
 * @param id 角色 ID
 * @param data 角色数据
 */
async function updateRole(
  id: number,
  data: Omit<SystemRoleApi.SystemRoleItem, 'id'>,
) {
  return requestClient.put(`/role/update/${id}`, data);
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(id: string) {
  return requestClient.delete(`/role/delete/${id}`);
}

export { createRole, deleteRole, getRoleList, updateRole };
