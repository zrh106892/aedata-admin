<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAgentCommissionList } from '#/api/agent';

import { useCommissionColumns, useCommissionFormSchema } from './data';

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
    schema: useCommissionFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useCommissionColumns(),
    proxyConfig: {
      ajax: {
        query: async ({
          page,
          form,
        }: {
          form: Record<string, any>;
          page: QueryParams;
        }) => {
          return await getAgentCommissionList({
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
    <Grid :table-title="agentId ? '佣金记录列表' : '所有佣金记录'" />
  </Page>
</template>
