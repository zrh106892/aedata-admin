<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { OrderApi } from '#/api/order';

import { useRouter } from 'vue-router';

import { Page, useVbenDrawer } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOrderList } from '#/api/order';

import { useColumns, useGridFormSchema } from './data';
import RefundForm from './modules/refund-form.vue';

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [
      ['create_time', ['create_time_start', 'create_time_end']],
      ['pay_time', ['pay_time_start', 'pay_time_end']],
      ['refund_time', ['refund_time_start', 'refund_time_end']],
    ],
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
          return await getOrderList({
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
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<OrderApi.Order>,
});

const [RefundDrawer, refundDrawerApi] = useVbenDrawer({
  connectedComponent: RefundForm,
  destroyOnClose: true,
});

const router = useRouter();

function onActionClick(e: OnActionClickParams<OrderApi.Order>) {
  switch (e.code) {
    case 'query': {
      router.push({
        name: 'OrderQueryDetail',
        params: {
          id: e.row.id,
        },
      });
      break;
    }
    case 'refund': {
      onRefund(e.row);
      break;
    }
  }
}

function onRefund(row: OrderApi.Order) {
  refundDrawerApi.setData(row).open();
}

function onRefundSuccess() {
  onRefresh();
}

function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <RefundDrawer @success="onRefundSuccess" />
    <Grid table-title="订单列表" />
  </Page>
</template>
