<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAgentLinkList } from '#/api/agent';

import { useLinkColumns, useLinkFormSchema } from './data';

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
    schema: useLinkFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useLinkColumns(),
    proxyConfig: {
      ajax: {
        query: async ({
          page,
          form,
        }: {
          form: Record<string, any>;
          page: QueryParams;
        }) => {
          return await getAgentLinkList({
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
    <Grid :table-title="agentId ? '推广链接列表' : '所有推广链接'" />
  </Page>
</template>
