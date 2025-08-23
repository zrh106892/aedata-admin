import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

// 佣金记录列表列配置
export function useCommissionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'agent_id',
      title: '代理ID',
      width: 100,
    },
    {
      field: 'order_id',
      title: '订单ID',
      width: 100,
    },
    {
      field: 'amount',
      title: '佣金金额',
      width: 120,
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'product_name',
      title: '产品名称',
      width: 150,
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      formatter: ({ cellValue }: { cellValue: number }) => {
        const statusMap: Record<number, string> = {
          0: '待结算',
          1: '已结算',
          2: '已取消',
        };
        return statusMap[cellValue] || '未知';
      },
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 160,
      sortable: true,
      sortType: 'string' as const,
    },
  ];
}

// 佣金记录搜索表单配置
export function useCommissionFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'product_name',
      label: '产品名称',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        allowClear: true,
        options: [
          { label: '待结算', value: 0 },
          { label: '已结算', value: 1 },
          { label: '已取消', value: 2 },
        ],
      },
    },
  ];
}
