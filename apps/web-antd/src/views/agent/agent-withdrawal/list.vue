<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAgentWithdrawalList } from '#/api/agent';

import { useWithdrawalColumns, useWithdrawalFormSchema } from './data';

interface Props {
  agentId?: number;
}

interface QueryParams {
  currentPage: number;
  pageSize: number;
  [key: string]: any;
}

const props = defineProps<Props>();

const queryParams = computed(() => ({
  ...(props.agentId ? { agent_id: props.agentId } : {}),
}));

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useWithdrawalFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useWithdrawalColumns(),
    proxyConfig: {
      ajax: {
        query: async ({
          page,
          form,
        }: {
          page: QueryParams;
          form: Record<string, any>;
        }) => {
          return await getAgentWithdrawalList({
            ...queryParams.value,
            ...form,
            page: page.currentPage,
            pageSize: page.pageSize,
          });
        },
      },
      props: {
        result: 'items',
        total: 'total',
      },
    },
  },
});
</script>

<template>
  <Page :auto-content-height="!agentId">
    <Grid :table-title="agentId ? '提现记录列表' : '所有提现记录'" />
  </Page>
</template>
