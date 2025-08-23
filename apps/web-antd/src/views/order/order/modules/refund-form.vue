<script lang="ts" setup>
import type { OrderApi } from '#/api/order';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { refundOrder } from '#/api/order';

const emits = defineEmits(['success']);

const formData = ref<OrderApi.Order>();
const loading = ref(false);
const refundResult = ref<OrderApi.RefundOrderResponse>();

// 预设退款原因选项
const refundReasonOptions = [
  { label: '用户不满意要求退款', value: '用户不满意要求退款' },
  { label: '产品问题退款', value: '产品问题退款' },
  { label: '重复下单退款', value: '重复下单退款' },
  { label: '其他原因', value: 'other' },
];

const [Form, formApi] = useVbenForm({
  schema: [
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: computed(() => formData.value?.amount || 0),
        precision: 2,
        style: { width: '100%' },
        addonBefore: '¥',
      },
      fieldName: 'refund_amount',
      label: '退款金额',
      rules: z
        .number()
        .min(0.01, '退款金额必须大于0')
        .refine(
          (val: number) => val <= (formData.value?.amount || 0),
          '退款金额不能大于订单金额',
        ),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        max: computed(() => formData.value?.amount || 0),
        precision: 2,
        style: { width: '100%' },
        addonBefore: '¥',
      },
      fieldName: 'confirm_refund_amount',
      label: '确认退款金额',
      rules: z.number().refine(async (val: number) => {
        const form = await formApi.getValues();
        return val === (form as { refund_amount: number }).refund_amount;
      }, '两次输入的退款金额不一致'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: refundReasonOptions,
        style: { width: '100%' },
      },
      fieldName: 'preset_reason',
      label: '退款原因',
      defaultValue: 'other',
    },
    {
      component: 'Textarea',
      componentProps: (values) => {
        return {
          rows: 3,
          placeholder: '请输入具体退款原因',
          maxLength: 200,
          showCount: true,
          style: { width: '100%' },
          disabled:
            (values as { preset_reason?: string })?.preset_reason !== 'other',
        };
      },
      fieldName: 'refund_reason',
      label: ' ',
      rules: z.string().superRefine(async (val, ctx) => {
        const values = await formApi.getValues();
        const presetReason = (values as { preset_reason?: string })
          ?.preset_reason;
        if (presetReason === 'other') {
          if (!val || val.length === 0) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: '请输入具体退款原因',
            });
          } else if (val.length > 200) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: '退款原因不能超过200个字符',
            });
          }
        }
      }),
    },
  ],
  showDefaultActions: false,
});

const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues<{
      preset_reason: string;
      refund_amount: number;
      refund_reason: string;
    }>();

    loading.value = true;
    try {
      refundResult.value = await refundOrder(formData.value!.id, {
        refund_amount: values.refund_amount,
        refund_reason:
          values.preset_reason === 'other'
            ? values.refund_reason
            : values.preset_reason,
      });

      message.success({
        content: `退款成功！退款单号：${refundResult.value.refund_no}`,
        duration: 0,
        key: 'refund_result',
      });

      emits('success');
      drawerApi.close();
    } finally {
      loading.value = false;
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<OrderApi.Order>();
      formApi.resetForm();
      refundResult.value = undefined;
      if (data) {
        formData.value = data;
        // 默认填入订单金额和选择其他原因
        formApi.setValues({
          refund_amount: data.amount,
          confirm_refund_amount: data.amount,
          preset_reason: 'other',
        });
      }
    }
  },
});

const getDrawerTitle = computed(() => {
  return `退款订单 ${formData.value?.order_no || ''}`;
});
</script>

<template>
  <Drawer :title="getDrawerTitle" :loading="loading" width="600">
    <Form />
  </Drawer>
</template>
