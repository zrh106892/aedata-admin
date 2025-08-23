<script lang="ts" setup>
import type { QueryCleanupDetailItem } from '../data';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getQueryCleanupDetailList } from '#/api/order/query';

import { useDetailColumns } from '../data';

const _emit = defineEmits(['success']);

// 定义数据接口
interface ModalData {
  logId: number;
}

const [Modal, modalApi] = useVbenModal({
  title: '清理详情',
  destroyOnClose: true,
  onOpenChange: (isOpen) => {
    if (isOpen) {
      gridApi?.reload();
    }
  },
});

// 详情列表配置
const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useDetailColumns(),
    height: 500,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const { logId } = modalApi.getData<ModalData>();
          if (!logId) {
            return {
              items: [],
              total: 0,
            };
          }
          const result = await getQueryCleanupDetailList(logId, {
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return result;
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
      zoom: true,
    },
  } as VxeTableGridOptions<QueryCleanupDetailItem>,
});

onMounted(() => {
  const { logId } = modalApi.getData<ModalData>();
  if (logId && gridApi) {
    gridApi.reload();
  }
});
</script>

<template>
  <Modal class="w-[calc(100vw-200px)]">
    <div class="px-2">
      <Grid table-title="清理详情列表" />
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.query-cleanup-details-modal {
  padding: 16px;
}
</style>
