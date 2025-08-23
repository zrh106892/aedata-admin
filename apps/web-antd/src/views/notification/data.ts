import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { NotificationApi } from '#/api/notification';

// 表单配置
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: '通知标题',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'notification_page',
      label: '通知页面',
      rules: 'required',
    },
    {
      component: 'RichText',
      fieldName: 'content',
      label: '通知内容',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'show_date',
      label: '展示日期',
    },
    {
      component: 'Input',
      fieldName: 'show_time',
      label: '展示时间',
    },
    {
      component: 'RadioGroup',
      fieldName: 'status',
      label: '状态',
      rules: 'required',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        optionType: 'button',
      },
      defaultValue: 1,
    },
  ];
}

// 搜索表单配置
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'title',
      label: '通知标题',
    },
    {
      component: 'Select',
      fieldName: 'notification_page',
      label: '通知页面',
      componentProps: {
        allowClear: true,
        options: [
          { label: '首页', value: 'home' },
          { label: '个人中心', value: 'profile' },
          { label: '订单页', value: 'order' },
        ],
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        allowClear: true,
        options: [
          { label: '启用', value: 'active' },
          { label: '禁用', value: 'inactive' },
        ],
      },
    },
    {
      component: 'RangePicker',
      fieldName: 'date_range',
      label: '生效时间',
      componentProps: {
        showTime: true,
      },
    },
  ];
}

// 表格列配置
export function useColumns<T = NotificationApi.NotificationItem>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (
    newStatus: 0 | 1,
    row: T,
  ) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'title',
      title: '通知标题',
      minWidth: 200,
    },
    {
      field: 'notification_page',
      title: '通知页面',
      width: 200,
    },
    {
      field: 'show_date',
      title: '展示日期',
      width: 300,
      formatter: ({ row }) => {
        return !row.start_date && !row.end_date
          ? '每天'
          : `${row.start_date} 至 ${row.end_date}`;
      },
    },
    {
      field: 'show_time',
      title: '展示时间',
      width: 300,
      formatter: ({ row }) => {
        return (!row.start_time && !row.end_time) ||
          row.start_time === row.end_time
          ? '全天'
          : `${row.start_time} 至 ${row.end_time}`;
      },
    },
    {
      cellRender: {
        attrs: {
          beforeChange: onStatusChange,
        },
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: '状态',
      width: 100,
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
          nameField: 'title',
          nameTitle: '通知',
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
