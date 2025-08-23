import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

// 代理产品配置列表列配置
export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'product_name',
      title: '产品名称',
    },
    {
      field: 'cost_price',
      title: '成本',
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'price_range_min',
      title: '最低定价',
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'price_range_max',
      title: '最高定价',
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'pricing_standard',
      title: '定价标准',
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'overpricing_ratio',
      title: '超标抽佣比例',
      formatter: ({ cellValue }: { cellValue: number }) =>
        `${(cellValue * 100).toFixed(2)}%`,
    },
    {
      align: 'center',
      slots: { default: 'operation' },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 120,
    },
  ] as const;
}

// 代理产品配置搜索表单配置
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'product_name',
      label: '产品名称',
    },
  ];
}

// 代理产品配置编辑表单配置
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'InputNumber',
      fieldName: 'cost_price',
      label: '成本',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price_range_min',
      label: '最低定价',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price_range_max',
      label: '最高定价',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'pricing_standard',
      label: '定价标准',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'overpricing_ratio',
      label: '超标抽佣比例',
      rules: 'required',
      componentProps: {
        min: 0,
        max: 100,
        precision: 2,
        step: 0.01,
        addonAfter: '%',
        controls: true,
        validateTrigger: ['blur', 'change'],
      },
    },
  ];
}
