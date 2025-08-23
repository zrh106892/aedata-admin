<script lang="ts" setup>
import type { ProductApi } from '#/api/product-manage';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';
import { createProduct, updateProduct } from '#/api/product-manage';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<ProductApi.ProductItem>();

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
        ? updateProduct(id.value, values as ProductApi.UpdateProductRequest)
        : createProduct(values as ProductApi.CreateProductRequest));
      emit('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<ProductApi.ProductItem>();
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
  return formData.value?.id ? '编辑产品' : '创建产品';
});
</script>

<template>
  <Drawer :title="getDrawerTitle"> <Form /> </Drawer>
</template>
