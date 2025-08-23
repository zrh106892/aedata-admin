import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

// 会员等级选项
export const levelNameOptions = [
  { label: '普通会员', value: 'normal' },
  { label: 'VIP会员', value: 'VIP' },
  { label: 'SVIP会员', value: 'SVIP' },
];

// 代理会员配置列表列配置
export function useColumns(): VxeTableGridOptions['columns'] {
  return [
    { field: 'id', title: 'ID', width: 80 },
    {
      field: 'level_name',
      title: '会员等级',
      formatter: ({ cellValue }) => {
        const option = levelNameOptions.find(
          (item) => item.value === cellValue,
        );
        return option?.label || cellValue;
      },
    },
    {
      field: 'price',
      title: '会员年费',
      formatter: ({ cellValue }) =>
        cellValue !== null && cellValue !== undefined
          ? `¥${cellValue.toFixed(2)}`
          : '-',
    },
    {
      field: 'report_commission',
      title: '直推报告收益',
      formatter: ({ cellValue }) =>
        cellValue !== null && cellValue !== undefined
          ? `¥${cellValue.toFixed(2)}`
          : '-',
    },
    {
      field: 'lower_activity_reward',
      title: '下级活跃奖励',
      formatter: ({ cellValue }) =>
        cellValue !== null && cellValue !== undefined
          ? `¥${cellValue.toFixed(2)}`
          : '-',
    },
    {
      field: 'new_activity_reward',
      title: '新增活跃奖励',
      formatter: ({ cellValue }) =>
        cellValue !== null && cellValue !== undefined
          ? `¥${cellValue.toFixed(2)}`
          : '-',
    },
    {
      field: 'lower_standard_count',
      title: '活跃下级达标数',
      formatter: ({ cellValue }) => cellValue ?? '-',
    },
    {
      field: 'new_lower_standard_count',
      title: '新增活跃下级达标数',
      formatter: ({ cellValue }) => cellValue ?? '-',
    },
    {
      field: 'lower_withdraw_reward_ratio',
      title: '下级提现奖励比例',
      formatter: ({ cellValue }) =>
        cellValue !== null && cellValue !== undefined
          ? `${(cellValue * 100).toFixed(2)}%`
          : '-',
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 180,
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

// 代理会员配置搜索表单配置
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'level_name',
      label: '会员等级',
      componentProps: {
        placeholder: '请选择会员等级',
        options: levelNameOptions,
      },
    },
  ];
}

// 代理会员配置编辑表单配置
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'level_name',
      label: '会员等级',
      rules: 'required',
      componentProps: {
        options: levelNameOptions,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price',
      label: '会员年费',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'report_commission',
      label: '直推报告收益',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'lower_activity_reward',
      label: '下级活跃奖励',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'new_activity_reward',
      label: '新增活跃奖励',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'lower_standard_count',
      label: '活跃下级达标数',
      componentProps: {
        min: 0,
        precision: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'new_lower_standard_count',
      label: '新增活跃下级达标数',
      componentProps: {
        min: 0,
        precision: 0,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'lower_withdraw_reward_ratio',
      label: '下级提现奖励比例',
      componentProps: {
        min: 0,
        max: 100,
        precision: 2,
        step: 0.01,
        addonAfter: '%',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'lower_convert_vip_reward',
      label: '下级转化VIP奖励',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'lower_convert_svip_reward',
      label: '下级转化SVIP奖励',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'exemption_amount',
      label: '免责金额',
      rules: 'required',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price_increase_max',
      label: '提价最高金额',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price_ratio',
      label: '提价区间收取比例',
      componentProps: {
        min: 0,
        max: 100,
        precision: 2,
        step: 0.01,
        addonAfter: '%',
      },
    },
    {
      component: 'InputNumber',
      fieldName: 'price_increase_amount',
      label: '加价金额',
      componentProps: {
        min: 0,
        precision: 2,
        step: 0.01,
      },
    },
  ];
}
