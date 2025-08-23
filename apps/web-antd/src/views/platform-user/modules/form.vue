<script lang="ts" setup>
import type { PlatformUserApi } from '#/api/platform-user';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { updatePlatformUser } from '#/api/platform-user';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<PlatformUserApi.PlatformUserItem>();

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
    updatePlatformUser(
      id.value,
      values as PlatformUserApi.UpdatePlatformUserRequest,
    )
      .then(() => {
        emit('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<PlatformUserApi.PlatformUserItem>();
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
  return formData.value?.id ? '编辑用户' : '创建用户';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
