<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { PlatformUserApi } from '#/api/platform-user';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPlatformUserList } from '#/api/platform-user';

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
    fieldMappingTime: [
      ['create_time', ['create_time_start', 'create_time_end']],
    ],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridEvents: {
    sortChange: () => {
      gridApi.query();
    },
  } as VxeGridListeners<PlatformUserApi.PlatformUserItem>,
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    sortConfig: {
      remote: true,
      multiple: false,
      trigger: 'default',
      orders: ['asc', 'desc', null],
      resetPage: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page, sort }, formValues) => {
          const sortParams = sort
            ? {
                order_by: sort.field,
                order_type: sort.order,
              }
            : {};

          const res = await getPlatformUserList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            ...sortParams,
          });

          return {
            ...res,
            sort: sort || null,
          };
        },
      },
      props: {
        result: 'items',
        total: 'total',
      },
      autoLoad: true,
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
  } as VxeTableGridOptions<PlatformUserApi.PlatformUserItem>,
});

// 操作处理函数
function onActionClick(
  e: OnActionClickParams<PlatformUserApi.PlatformUserItem>,
) {
  switch (e.code) {
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

// 编辑处理
function onEdit(row: PlatformUserApi.PlatformUserItem) {
  formDrawerApi.setData(row).open();
}

// 刷新处理
function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <Grid table-title="平台用户列表">
      <template #toolbar-tools>
        <!-- 暂时不需要添加按钮 -->
      </template>
    </Grid>
  </Page>
</template>
