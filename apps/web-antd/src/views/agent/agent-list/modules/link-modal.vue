<script lang="ts" setup>
import { computed } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import LinkList from '../../agent-links/list.vue';

interface ModalData {
  agentId: number;
}

const [Modal, modalApi] = useVbenModal({
  title: '推广链接列表',
  destroyOnClose: true,
});

const modalData = computed(() => modalApi.getData<ModalData>());
</script>

<template>
  <Modal class="w-[calc(100vw-200px)]" :footer="false">
    <div class="agent-link-modal">
      <LinkList :agent-id="modalData?.agentId" />
    </div>
  </Modal>
</template>

<style lang="less" scoped>
.agent-link-modal {
  padding: 16px;
}
</style>
