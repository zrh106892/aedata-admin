<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { AgentApi } from '#/api/agent/agent';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getMembershipRechargeOrderList } from '#/api/agent';

import {
  useMembershipRechargeOrderColumns,
  useMembershipRechargeOrderFormSchema,
} from './data';

const [Grid, _gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useMembershipRechargeOrderFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useMembershipRechargeOrderColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async (
          { page }: { page: { currentPage: number; pageSize: number } },
          formValues: Record<string, any>,
        ) => {
          const res = await getMembershipRechargeOrderList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return { items: res.items, total: res.total };
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
  } as VxeGridProps<AgentApi.MembershipRechargeOrderListItem>,
});
</script>

<template>
  <Page auto-content-height>
    <Grid table-title="会员充值订单列表" />
  </Page>
</template>
