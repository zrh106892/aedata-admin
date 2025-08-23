import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace NotificationApi {
  export interface NotificationItem {
    id: number;
    title: string;
    content?: string;
    notification_page: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    status: number;
    create_time: string;
    update_time: string;
  }

  export interface NotificationList {
    total: number;
    items: NotificationItem[];
  }

  export interface CreateNotificationRequest {
    title: string;
    content: string;
    notification_page: string;
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
    status: 0 | 1;
  }

  export interface CreateNotificationResponse {
    id: number;
  }

  export interface UpdateNotificationRequest
    extends Partial<CreateNotificationRequest> {
    id: number;
  }

  export interface UpdateNotificationResponse {
    success: boolean;
  }

  export interface DeleteNotificationResponse {
    success: boolean;
  }
}

/**
 * 获取通知列表
 */
async function getNotificationList(params: Recordable<any>) {
  return requestClient.get<NotificationApi.NotificationList>(
    '/notification/list',
    {
      params,
    },
  );
}

/**
 * 创建通知
 */
async function createNotification(
  data: NotificationApi.CreateNotificationRequest,
) {
  return requestClient.post<NotificationApi.CreateNotificationResponse>(
    '/notification/create',
    data,
  );
}

/**
 * 更新通知
 */
async function updateNotification(
  id: number,
  data: NotificationApi.UpdateNotificationRequest,
) {
  return requestClient.put<NotificationApi.UpdateNotificationResponse>(
    `/notification/update/${id}`,
    data,
  );
}

/**
 * 删除通知
 */
async function deleteNotification(id: number) {
  return requestClient.delete<NotificationApi.DeleteNotificationResponse>(
    `/notification/delete/${id}`,
  );
}

export {
  createNotification,
  deleteNotification,
  getNotificationList,
  updateNotification,
};
