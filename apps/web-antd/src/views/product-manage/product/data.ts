import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { ProductApi } from '#/api/product-manage';

// 表单配置
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'product_name',
      label: '产品名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'product_en',
      label: '产品编号',
      rules: 'required',
    },
    {
      component: 'RichText',
      fieldName: 'description',
      label: '描述',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'notes',
      label: '备注',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
      },
      fieldName: 'cost_price',
      label: '成本价',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 0,
        precision: 2,
      },
      fieldName: 'sell_price',
      label: '售价',
      rules: 'required',
    },
  ];
}

// 搜索表单配置
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'product_name',
      label: '产品名称',
    },
    {
      component: 'Input',
      fieldName: 'product_en',
      label: '产品编号',
    },
  ];
}

// 表格列配置
export function useColumns<T = ProductApi.ProductItem>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'product_name',
      title: '产品名称',
      width: 150,
    },
    {
      field: 'product_en',
      title: '产品编号',
      width: 150,
    },
    {
      field: 'description',
      title: '描述',
    },
    {
      field: 'cost_price',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
      title: '成本价',
      width: 120,
    },
    {
      field: 'sell_price',
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
      title: '售价',
      width: 120,
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'update_time',
      title: '更新时间',
      width: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'product_name',
          nameTitle: '产品',
          onClick: onActionClick,
        },
        options: [
          {
            code: 'edit',
            text: '编辑',
          },
          {
            code: 'delete',
            text: '删除',
          },
          {
            code: 'features',
            text: '模块管理',
          },
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 180,
    },
  ];
}
