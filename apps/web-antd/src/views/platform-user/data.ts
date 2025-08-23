import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PlatformUserApi } from '#/api/platform-user';

// 表单配置
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'mobile',
      label: '手机号',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
    },
    {
      component: 'Textarea',
      fieldName: 'info',
      label: '备注信息',
    },
    {
      component: 'RadioGroup',
      fieldName: 'inside',
      label: '是否内部用户',
      rules: 'required',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 0,
    },
  ];
}

// 搜索表单配置
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'mobile',
      label: '手机号',
    },
    {
      component: 'Input',
      fieldName: 'nickname',
      label: '昵称',
    },
    {
      component: 'Select',
      fieldName: 'inside',
      label: '是否内部用户',
      componentProps: {
        allowClear: true,
        options: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'create_time',
      label: '创建时间',
      componentProps: {
        showTime: true,
      },
    },
  ];
}

// 表格列配置
export function useColumns<T = PlatformUserApi.PlatformUserItem>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '用户ID',
      width: 100,
    },
    {
      field: 'mobile',
      title: '手机号',
    },
    {
      field: 'nickname',
      title: '昵称',
      width: 120,
    },
    {
      field: 'info',
      title: '备注信息',
    },
    {
      field: 'inside',
      title: '是否内部用户',
      width: 100,
      formatter: ({ cellValue }) => (cellValue === 1 ? '是' : '否'),
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 160,
      sortable: true,
      sortType: 'string',
    },
    {
      field: 'update_time',
      title: '更新时间',
      width: 160,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'nickname',
          nameTitle: '用户',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          'edit', // 默认的编辑按钮
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 130,
    },
  ];
}
