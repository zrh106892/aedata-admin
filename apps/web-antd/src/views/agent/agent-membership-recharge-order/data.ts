import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

// 支付方式选项
export const paymentMethodOptions = [
  { label: '支付宝', value: 'alipay' },
  { label: '微信', value: 'wechat' },
  { label: '苹果支付', value: 'appleiap' },
  { label: '其他', value: 'other' },
];

// 会员等级选项
export const levelNameOptions = [
  { label: '普通会员', value: '' },
  { label: 'VIP会员', value: 'VIP' },
  { label: 'SVIP会员', value: 'SVIP' },
];

// 状态选项
export const statusOptions = [
  { label: '待支付', value: 'pending' },
  { label: '支付成功', value: 'success' },
  { label: '支付失败', value: 'failed' },
  { label: '已取消', value: 'cancelled' },
];

// 列表列配置
export function useMembershipRechargeOrderColumns(): VxeTableGridOptions['columns'] {
  return [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'user_id', title: '用户ID', width: 100 },
    { field: 'agent_id', title: '代理ID', width: 100 },
    {
      field: 'level_name',
      title: '会员等级',
      width: 100,
      formatter: ({ cellValue }) => {
        const option = levelNameOptions.find(
          (item) => item.value === cellValue,
        );
        return option?.label || '普通会员';
      },
    },
    {
      field: 'amount',
      title: '金额',
      width: 100,
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'payment_method',
      title: '支付方式',
      width: 100,
      formatter: ({ cellValue }) => {
        const option = paymentMethodOptions.find(
          (item) => item.value === cellValue,
        );
        return option?.label || cellValue;
      },
    },
    { field: 'order_no', title: '订单号', width: 180 },
    { field: 'platform_order_id', title: '平台订单号', width: 180 },
    {
      field: 'status',
      title: '状态',
      width: 100,
      formatter: ({ cellValue }) => {
        const option = statusOptions.find((item) => item.value === cellValue);
        return option?.label || cellValue;
      },
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 180,
    },
  ];
}

// 搜索表单配置
export function useMembershipRechargeOrderFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'InputNumber',
      fieldName: 'user_id',
      label: '用户ID',
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'agent_id',
      label: '代理ID',
      componentProps: {
        placeholder: '请输入代理ID',
      },
    },
    {
      component: 'Input',
      fieldName: 'order_no',
      label: '订单号',
      componentProps: {
        placeholder: '请输入订单号',
      },
    },
    {
      component: 'Input',
      fieldName: 'platform_order_id',
      label: '平台订单号',
      componentProps: {
        placeholder: '请输入平台订单号',
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        placeholder: '请选择状态',
        options: statusOptions,
      },
    },
    {
      component: 'Select',
      fieldName: 'payment_method',
      label: '支付方式',
      componentProps: {
        placeholder: '请选择支付方式',
        options: paymentMethodOptions,
      },
    },
  ];
}
