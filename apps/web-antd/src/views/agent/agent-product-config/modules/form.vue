<script lang="ts" setup>
import type { AgentApi } from '#/api/agent';

import { ref } from 'vue';

import { useVbenDrawer, useVbenForm } from '@vben/common-ui';

import { updateAgentProductionConfig } from '#/api/agent';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<AgentApi.AgentProductionConfigItem>();
const id = ref<number>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});
const drawerTitle = ref('产品配置');

const [Drawer, drawerApi] = useVbenDrawer({
  title: drawerTitle.value,
  destroyOnClose: true,
  async onConfirm() {
    const valid = await formApi.validate();
    if (!valid || !id.value) return;

    const values = await formApi.getValues();
    const params: AgentApi.UpdateAgentProductionConfigParams = {
      id: id.value,
      cost_price: values.cost_price,
      price_range_min: values.price_range_min,
      price_range_max: values.price_range_max,
      pricing_standard: values.pricing_standard,
      overpricing_ratio: values.overpricing_ratio / 100,
    };

    await updateAgentProductionConfig(params);

    emit('success');
    drawerApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<AgentApi.AgentProductionConfigItem>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues({
          ...data,
          overpricing_ratio: data.overpricing_ratio * 100,
        });
      } else {
        id.value = undefined;
      }
    }
  },
});
</script>

<template>
  <Drawer :title="drawerTitle">
    <Form />
  </Drawer>
</template>
