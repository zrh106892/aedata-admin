import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

export function useCommissionDeductionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: 'ID',
      field: 'id',
      width: 80,
    },
    {
      title: '代理ID',
      field: 'agent_id',
      width: 100,
    },
    {
      title: '被扣代理ID',
      field: 'deducted_agent_id',
      width: 100,
    },
    {
      title: '抽佣金额',
      field: 'amount',
      width: 120,
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      title: '产品名称',
      field: 'product_name',
      width: 150,
    },
    {
      title: '抽佣类型',
      field: 'type',
      width: 120,
      formatter: ({ cellValue }: { cellValue: 'cost' | 'pricing' }) => {
        const typeMap = {
          cost: '成本抽佣',
          pricing: '定价抽佣',
        };
        return typeMap[cellValue] || cellValue;
      },
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: [
          { value: 0, color: 'warning', label: '待结算' },
          { value: 1, color: 'success', label: '已结算' },
          { value: 2, color: 'error', label: '已取消' },
        ],
      },
    },
    {
      title: '创建时间',
      field: 'create_time',
      width: 180,
    },
  ];
}

export function useCommissionDeductionFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'product_name',
      label: '产品名称',
      component: 'Input',
      componentProps: {
        allowClear: true,
      },
    },
    {
      fieldName: 'type',
      label: '抽佣类型',
      component: 'Select',
      componentProps: {
        options: [
          { label: '成本抽佣', value: 'cost' },
          { label: '定价抽佣', value: 'pricing' },
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
          { label: '待结算', value: 0 },
          { label: '已结算', value: 1 },
          { label: '已取消', value: 2 },
        ],
        allowClear: true,
      },
    },
  ];
}
