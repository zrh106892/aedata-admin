<script lang="ts" setup>
import type { AgentApi } from '#/api/agent';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<AgentApi.AgentListItem>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();
    // TODO: 实现更新代理信息的接口
    // updateAgent(id.value, values as AgentApi.UpdateAgentRequest)
    //   .then(() => {
    //     emit('success');
    //     drawerApi.close();
    //   })
    //   .catch(() => {
    //     drawerApi.unlock();
    //   });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<AgentApi.AgentListItem>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues(data);
      } else {
        id.value = undefined;
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return formData.value?.id ? '编辑代理' : '创建代理';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
