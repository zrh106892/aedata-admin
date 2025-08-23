import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

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
      fieldName: 'level_name',
      label: '等级名称',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'region',
      label: '区域',
      rules: 'required',
    },
    {
      component: 'DatePicker',
      fieldName: 'membership_expiry_time',
      label: '会员到期时间',
      rules: 'required',
      componentProps: {
        showTime: true,
      },
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
      fieldName: 'region',
      label: '区域',
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
export function useColumns(): VxeTableGridOptions['columns'] {
  const columns = [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'user_id',
      title: '用户ID',
      width: 100,
    },
    {
      field: 'level_name',
      title: '等级名称',
      width: 120,
      formatter: ({ cellValue }: { cellValue: string }) => {
        if (cellValue === '' || cellValue === 'normal') {
          return '普通代理';
        }
        return cellValue;
      },
    },
    {
      field: 'region',
      title: '区域',
      width: 120,
    },
    {
      field: 'mobile',
      title: '手机号',
      width: 120,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { value: 'approved', color: 'success', label: '已认证' },
          { value: 'pending', color: 'warning', label: '审核中' },
          { value: 'rejected', color: 'error', label: '已拒绝' },
          { value: '', color: 'default', label: '未认证' },
        ],
      },
      field: 'real_name_status',
      title: '实名认证状态',
      width: 120,
    },
    {
      field: 'real_name',
      title: '实名姓名',
      width: 120,
      formatter: ({ cellValue }: { cellValue: string }) => {
        if (!cellValue) return '-';
        return cellValue;
      },
    },
    {
      field: 'id_card',
      title: '身份证号',
      width: 180,
      formatter: ({ cellValue }: { cellValue: string }) => {
        if (!cellValue) return '-';
        // 只显示前6位和后4位，中间用*代替
        return `${cellValue.slice(0, 6)}${'*'.repeat(8)}${cellValue.slice(-4)}`;
      },
    },
    {
      field: 'membership_expiry_time',
      title: '会员到期时间',
      width: 160,
      sortable: true,
      sortType: 'string' as const,
    },
    {
      field: 'balance',
      title: '钱包余额',
      width: 120,
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'total_earnings',
      title: '累计收益',
      width: 120,
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'frozen_balance',
      title: '冻结余额',
      width: 120,
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'withdrawn_amount',
      title: '提现总额',
      width: 120,
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'create_time',
      title: '成为代理时间',
      width: 160,
      sortable: true,
      sortType: 'string' as const,
    },
    {
      align: 'center' as const,
      slots: { default: 'operation' },
      field: 'operation',
      fixed: 'right' as const,
      title: '操作',
      width: 280,
    },
  ];
  return columns;
}
// 推广链接列表列配置
export function useLinkColumns(): VxeTableGridOptions['columns'] {
  return [
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

// 佣金记录列表列配置
export function useCommissionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
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
    },
  ] as const;
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

// 奖励记录列表列配置
export function useRewardColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'agent_id',
      title: '代理ID',
      width: 100,
    },
    {
      field: 'relation_agent_id',
      title: '关联代理ID',
      width: 100,
    },
    {
      field: 'amount',
      title: '奖励金额',
      width: 120,
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'type',
      title: '奖励类型',
      width: 120,
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 160,
      sortable: true,
    },
  ] as const;
}

// 奖励记录搜索表单配置
export function useRewardFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'type',
      label: '奖励类型',
    },
    {
      component: 'Input',
      fieldName: 'relation_agent_id',
      label: '关联代理ID',
    },
  ];
}

// 提现记录列表列配置
export function useWithdrawalColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'agent_id',
      title: '代理ID',
      width: 100,
    },
    {
      field: 'withdraw_no',
      title: '提现单号',
      width: 180,
    },
    {
      field: 'amount',
      title: '提现金额',
      width: 120,
      formatter: ({ cellValue }: { cellValue: number }) =>
        `¥${cellValue.toFixed(2)}`,
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      formatter: ({ cellValue }: { cellValue: number }) => {
        const statusMap: Record<number, string> = {
          0: '待审核',
          1: '已通过',
          2: '已拒绝',
          3: '已打款',
        };
        return statusMap[cellValue] || '未知';
      },
    },
    {
      field: 'payee_account',
      title: '收款账户',
      width: 180,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 160,
      sortable: true,
    },
  ] as const;
}

// 提现记录搜索表单配置
export function useWithdrawalFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'withdraw_no',
      label: '提现单号',
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        allowClear: true,
        options: [
          { label: '待审核', value: 0 },
          { label: '已通过', value: 1 },
          { label: '已拒绝', value: 2 },
          { label: '已打款', value: 3 },
        ],
      },
    },
  ];
}
