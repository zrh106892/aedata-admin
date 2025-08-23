<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAgentCommissionDeductionList } from '#/api/agent';

import {
  useCommissionDeductionColumns,
  useCommissionDeductionFormSchema,
} from './data';

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
    schema: useCommissionDeductionFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useCommissionDeductionColumns(),
    proxyConfig: {
      ajax: {
        query: async ({
          form,
          page,
        }: {
          form: Record<string, any>;
          page: QueryParams;
        }) => {
          return await getAgentCommissionDeductionList({
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
    <Grid :table-title="agentId ? '上级抽佣列表' : '所有上级抽佣记录'" />
  </Page>
</template>
