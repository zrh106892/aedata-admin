<script lang="ts" setup>
import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import PlatformDeductionList from '../../agent-platform-deduction/list.vue';

interface ModalData {
  agentId: number;
}

const [Modal, modalApi] = useVbenModal({
  title: '平台抽佣记录',
  width: 1000,
  destroyOnClose: true,
});

const modalData = computed(() => modalApi.getData<ModalData>());
</script>

<template>
  <Modal>
    <PlatformDeductionList v-if="modalData" :agent-id="modalData.agentId" />
  </Modal>
</template>

<style scoped>
:deep(.ant-modal-body) {
  padding: 24px;
}
</style>
