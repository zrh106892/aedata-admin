import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { SystemRoleApi } from '#/api';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
      rules: 'required',
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: '名称',
    },
    {
      component: 'Input',
      fieldName: 'url',
      label: '链接',
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: '名称',
      minWidth: 120,
    },
    {
      field: 'url',
      title: '链接',
      minWidth: 250,
      slots: { default: 'url' },
    },
    {
      field: 'click_count',
      title: '累计点击数',
      minWidth: 120,
    },
    {
      field: 'pay_count',
      title: '付费次数',
      minWidth: 120,
    },
    {
      field: 'pay_amount',
      title: '付费金额',
      minWidth: 120,
    },
    {
      field: 'create_time',
      title: '创建时间',
      minWidth: 180,
    },
    {
      field: 'last_click_time',
      title: '最后点击时间',
      minWidth: 180,
    },
    {
      field: 'last_pay_time',
      title: '最后付费时间',
      minWidth: 180,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: '名称',
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
