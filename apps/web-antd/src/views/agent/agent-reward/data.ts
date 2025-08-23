import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useRewardColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '代理ID',
      field: 'agent_id',
      width: 100,
    },
    {
      title: '奖励类型',
      field: 'type',
      width: 120,
    },
    {
      title: '奖励金额',
      field: 'amount',
      width: 120,
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      title: '关联订单',
      field: 'order_id',
      width: 120,
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
    },
    {
      title: '创建时间',
      field: 'create_time',
      width: 180,
    },
    {
      title: '发放时间',
      field: 'pay_time',
      width: 180,
    },
  ];
}

export function useRewardFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'type',
      label: '奖励类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '注册奖励', value: 'register' },
          { label: '首单奖励', value: 'first_order' },
          { label: '升级奖励', value: 'level_up' },
        ],
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '待发放', value: 'pending' },
          { label: '已发放', value: 'paid' },
          { label: '发放失败', value: 'failed' },
        ],
        allowClear: true,
      },
    },
  ];
}
