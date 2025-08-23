<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { AgentApi } from '#/api/agent';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { Button, Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAgentMembershipConfigList } from '#/api/agent';

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
  gridEvents: {
    sortChange: () => {
      gridApi.query();
    },
  } as VxeGridListeners<AgentApi.AgentMembershipConfigListItem>,
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const res = await getAgentMembershipConfigList({
            page: page.currentPage,
            pageSize: page.pageSize,
            level_name: formValues.level_name,
          });
          return res;
        },
      },
      props: {
        result: 'items',
        total: 'total',
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
  } as VxeTableGridOptions<AgentApi.AgentMembershipConfigListItem>,
});

// 操作处理函数
function onActionClick(
  e: OnActionClickParams<AgentApi.AgentMembershipConfigListItem>,
) {
  switch (e.code) {
    case 'edit': {
      onEdit(e.row);
      break;
    }
  }
}

// 编辑处理
function onEdit(row: AgentApi.AgentMembershipConfigListItem) {
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
    <Grid table-title="代理会员配置列表">
      <template #operation="{ row }">
        <Space>
          <Button type="link" @click="onActionClick({ code: 'edit', row })">
            配置
          </Button>
        </Space>
      </template>
    </Grid>
  </Page>
</template>
