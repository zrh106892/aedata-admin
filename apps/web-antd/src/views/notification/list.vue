<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { NotificationApi } from '#/api/notification';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  deleteNotification,
  getNotificationList,
  updateNotification,
} from '#/api/notification';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

// 表单抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 表格配置
const columns = useColumns<NotificationApi.NotificationItem>(
  onActionClick,
  (newStatus: 0 | 1, row: NotificationApi.NotificationItem) => {
    return onStatusChange(newStatus, row);
  },
);

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['date', ['startDate', 'endDate']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getNotificationList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<NotificationApi.NotificationItem>,
});

// 操作处理函数
function onActionClick(
  e: OnActionClickParams<NotificationApi.NotificationItem>,
) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

/**
 * 将Antd的Modal.confirm封装为promise，方便在异步函数中调用。
 * @param content 提示内容
 * @param title 提示标题
 */
function confirm(content: string, title: string) {
  return new Promise((reslove, reject) => {
    Modal.confirm({
      content,
      onCancel() {
        reject(new Error('已取消'));
      },
      onOk() {
        reslove(true);
      },
      title,
    });
  });
}

/**
 * 状态开关即将改变
 * @param newStatus 期望改变的状态值
 * @param row 行数据
 * @returns 返回false则中止改变，返回其他值（undefined、true）则允许改变
 */
async function onStatusChange(
  newStatus: 0 | 1,
  row: NotificationApi.NotificationItem,
) {
  const status: Recordable<string> = {
    1: '启用',
    0: '禁用',
  };
  try {
    await confirm(
      `你要将通知"${row.title}"的状态切换为【${status[newStatus]}】吗？`,
      '切换状态',
    );
    // 获取完整的通知数据
    const notification = await getNotificationList({
      page: 1,
      pageSize: 1,
      id: row.id,
    });
    const fullData = notification.items[0];
    if (!fullData) {
      message.error('获取通知数据失败');
      return false;
    }
    await updateNotification(row.id, {
      id: row.id,
      status: newStatus,
      title: fullData.title,
      content: fullData.content || '',
      notification_page: fullData.notification_page,
      start_date: fullData.start_date,
      start_time: fullData.start_time,
      end_date: fullData.end_date,
      end_time: fullData.end_time,
    });
    return true;
  } catch {
    return false;
  }
}

// 编辑处理
function onEdit(row: NotificationApi.NotificationItem) {
  formDrawerApi.setData(row).open();
}

// 删除处理
function onDelete(row: NotificationApi.NotificationItem) {
  const hideLoading = message.loading({
    content: `正在删除通知：${row.title}`,
    duration: 0,
    key: 'action_process_msg',
  });
  deleteNotification(row.id)
    .then(() => {
      message.success({
        content: `删除通知成功：${row.title}`,
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

// 刷新处理
function onRefresh() {
  gridApi.query();
}

// 创建处理
function onCreate() {
  formDrawerApi.setData({}).open();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="通知列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          创建通知
        </Button>
      </template>
    </Grid>
  </Page>
</template>
