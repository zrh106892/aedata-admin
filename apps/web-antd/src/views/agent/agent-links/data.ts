import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

// 推广链接列表列配置
export function useLinkColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'agent_id',
      title: '代理ID',
      width: 100,
    },
    {
      field: 'product_name',
      title: '产品名称',
      width: 150,
    },
    {
      field: 'price',
      title: '价格',
      width: 120,
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'link_identifier',
      title: '推广码',
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

// 推广链接搜索表单配置
export function useLinkFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'product_name',
      label: '产品名称',
    },
    {
      component: 'Input',
      fieldName: 'link_identifier',
      label: '推广码',
    },
  ];
}
