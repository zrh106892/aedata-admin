<script lang="ts" setup>
import type { AgentApi } from '#/api/agent';

import { ref } from 'vue';

import { useVbenDrawer, useVbenForm } from '@vben/common-ui';

import { updateAgentMembershipConfig } from '#/api/agent';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<AgentApi.AgentMembershipConfigListItem>();
const id = ref<number>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const drawerTitle = ref('会员配置');

const [Drawer, drawerApi] = useVbenDrawer({
  title: drawerTitle.value,
  destroyOnClose: true,
  async onConfirm() {
    const valid = await formApi.validate();
    if (!valid || !id.value) return;

    const values = await formApi.getValues();
    const params: AgentApi.UpdateAgentMembershipConfigParams = {
      id: id.value,
      level_name: values.level_name,
      price: values.price,
      report_commission: values.report_commission,
      lower_activity_reward: values.lower_activity_reward ?? null,
      new_activity_reward: values.new_activity_reward ?? null,
      lower_standard_count: values.lower_standard_count ?? null,
      new_lower_standard_count: values.new_lower_standard_count ?? null,
      lower_withdraw_reward_ratio:
        values.lower_withdraw_reward_ratio !== null &&
        values.lower_withdraw_reward_ratio !== undefined
          ? values.lower_withdraw_reward_ratio / 100
          : null,
      lower_convert_vip_reward: values.lower_convert_vip_reward ?? null,
      lower_convert_svip_reward: values.lower_convert_svip_reward ?? null,
      exemption_amount: values.exemption_amount ?? null,
      price_increase_max: values.price_increase_max ?? null,
      price_ratio:
        values.price_ratio !== null && values.price_ratio !== undefined
          ? values.price_ratio / 100
          : null,
      price_increase_amount: values.price_increase_amount ?? null,
    };

    await updateAgentMembershipConfig(params);

    emit('success');
    drawerApi.close();
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<AgentApi.AgentMembershipConfigListItem>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;
        formApi.setValues({
          ...data,
          lower_withdraw_reward_ratio: data.lower_withdraw_reward_ratio
            ? data.lower_withdraw_reward_ratio * 100
            : null,
          price_ratio: data.price_ratio ? data.price_ratio * 100 : null,
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
