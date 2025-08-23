<script lang="ts" setup>
import type { FeatureApi } from '#/api/product-manage';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createFeature, updateFeature } from '#/api/product-manage';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<FeatureApi.FeatureItem>();

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
    try {
      await (id.value
        ? updateFeature(id.value, values as FeatureApi.UpdateFeatureRequest)
        : createFeature(values as FeatureApi.CreateFeatureRequest));
      emit('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<FeatureApi.FeatureItem>();
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
  return formData.value?.id ? '编辑模块' : '创建模块';
});
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form />
  </Drawer>
</template>
