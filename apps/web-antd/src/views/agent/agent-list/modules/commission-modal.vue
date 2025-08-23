<script lang="ts" setup>
import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import CommissionList from '../../agent-commission/list.vue';

interface ModalData {
  agentId: number;
}

const [Modal, modalApi] = useVbenModal({
  title: '佣金记录列表',
  destroyOnClose: true,
});

const modalData = computed(() => modalApi.getData<ModalData>());
</script>

<template>
  <Modal class="w-[calc(100vw-200px)]" :footer="false">
    <div class="agent-commission-modal">
      <CommissionList :agent-id="modalData?.agentId" />
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.agent-commission-modal {
  padding: 16px;
}
</style>
