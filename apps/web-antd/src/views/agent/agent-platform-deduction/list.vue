<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAgentPlatformDeductionList } from '#/api/agent';

import {
  usePlatformDeductionColumns,
  usePlatformDeductionFormSchema,
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
    schema: usePlatformDeductionFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: usePlatformDeductionColumns(),
    proxyConfig: {
      ajax: {
        query: async ({
          form,
          page,
        }: {
          form: Record<string, any>;
          page: QueryParams;
        }) => {
          return await getAgentPlatformDeductionList({
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
    <Grid :table-title="agentId ? '平台抽佣列表' : '所有平台抽佣记录'" />
  </Page>
</template>
