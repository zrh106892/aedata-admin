<script lang="ts" setup>
import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import CommissionDeductionList from '../../agent-commission-deduction/list.vue';

interface ModalData {
  agentId: number;
}

const [Modal, modalApi] = useVbenModal({
  title: '上级抽佣记录',
  destroyOnClose: true,
});

const modalData = computed(() => modalApi.getData<ModalData>());
</script>

<template>
  <Modal class="w-[calc(100vw-200px)]" :footer="false">
    <div class="agent-commission-deduction-modal">
      <CommissionDeductionList :agent-id="modalData?.agentId" />
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.agent-commission-deduction-modal {
  padding: 16px;
}
</style>
