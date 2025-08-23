import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { FeatureApi } from '#/api/product-manage';

// 表单配置
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'api_id',
      label: '模块编号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '描述',
      rules: 'required',
    },
  ];
}

// 搜索表单配置
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'api_id',
      label: '模块编号',
    },
    {
      component: 'Input',
      fieldName: 'name',
      label: '描述',
    },
  ];
}

// 表格列配置
export function useColumns<T = FeatureApi.FeatureItem>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'api_id',
      title: '模块编号',
      minWidth: 150,
    },
    {
      field: 'name',
      title: '描述',
      minWidth: 200,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 180,
    },
    {
      field: 'update_time',
      title: '更新时间',
      minWidth: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '模块',
          onClick: onActionClick,
        },
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}
