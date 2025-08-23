<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PromotionLinkApi } from '#/api';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Copy, Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deletePromotionLink, getPromotionLinkList } from '#/api';
import { $t } from '#/locales';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['create_time', ['startTime', 'endTime']]],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getPromotionLinkList({
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
  } as VxeTableGridOptions<PromotionLinkApi.PromotionLink>,
});

function onActionClick(
  e: OnActionClickParams<PromotionLinkApi.PromotionLinkItem>,
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

function onEdit(row: PromotionLinkApi.PromotionLinkItem) {
  formDrawerApi.setData(row).open();
}

function onDelete(row: PromotionLinkApi.PromotionLinkItem) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deletePromotionLink(row.id.toString())
    .then(() => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  formDrawerApi.setData({}).open();
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(
    () => {
      message.success('复制成功');
    },
    () => {
      message.error('复制失败');
    },
  );
}
</script>
<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="链接列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          创建链接
        </Button>
      </template>
      <template #url="{ row }">
        <div class="flex items-center gap-2">
          <span class="truncate">{{ row.url }}</span>
          <Button
            type="link"
            size="small"
            class="!p-0"
            @click="copyToClipboard(row.url)"
          >
            <Copy class="size-4" />
          </Button>
        </div>
      </template>
    </Grid>
  </Page>
</template>
