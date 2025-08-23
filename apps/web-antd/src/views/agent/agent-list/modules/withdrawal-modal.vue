<script lang="ts" setup>
import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import WithdrawalList from '../../agent-withdrawal/list.vue';

interface ModalData {
  agentId: number;
}

const [Modal, modalApi] = useVbenModal({
  title: '提现记录',
  destroyOnClose: true,
});

const modalData = computed(() => modalApi.getData<ModalData>());
</script>

<template>
  <Modal class="w-[calc(100vw-200px)]" :footer="false">
    <div class="agent-withdrawal-modal">
      <WithdrawalList :agent-id="modalData?.agentId" />
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.agent-withdrawal-modal {
  padding: 16px;
}
</style>
