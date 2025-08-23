<script lang="ts" setup>
import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import RewardList from '../../agent-reward/list.vue';

interface ModalData {
  agentId: number;
}

const [Modal, modalApi] = useVbenModal({
  title: '奖励记录',
  destroyOnClose: true,
});

const modalData = computed(() => modalApi.getData<ModalData>());
</script>

<template>
  <Modal class="w-[calc(100vw-200px)]" :footer="false">
    <div class="agent-reward-modal">
      <RewardList :agent-id="modalData?.agentId" />
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.agent-reward-modal {
  padding: 16px;
}
</style>
