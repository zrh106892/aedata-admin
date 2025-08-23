<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { FeatureApi } from '#/api/product-manage';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteFeature, getFeatureList } from '#/api/product-manage';

import { useColumns, useGridFormSchema } from './data';
import Form from './modules/form.vue';

// 表单抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 表格配置
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
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
          return await getFeatureList({
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
  } as VxeTableGridOptions<FeatureApi.FeatureItem>,
});

// 操作处理函数
function onActionClick(e: OnActionClickParams<FeatureApi.FeatureItem>) {
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

// 编辑处理
function onEdit(row: FeatureApi.FeatureItem) {
  formDrawerApi.setData(row).open();
}

// 删除处理
function onDelete(row: FeatureApi.FeatureItem) {
  const hideLoading = message.loading({
    content: `正在删除 ${row.name}`,
    duration: 0,
    key: 'action_process_msg',
  });
  deleteFeature(row.id)
    .then(() => {
      message.success({
        content: `删除 ${row.name} 成功`,
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
    <Grid table-title="模块列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增模块
        </Button>
      </template>
    </Grid>
  </Page>
</template>
