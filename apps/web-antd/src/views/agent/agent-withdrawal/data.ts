import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

type WithdrawalMethod = 'alipay' | 'bank' | 'wechat';
type WithdrawalStatus = 'approved' | 'failed' | 'paid' | 'pending' | 'rejected';

export function useWithdrawalColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: '代理ID',
      field: 'agent_id',
      width: 100,
    },
    {
      title: '提现金额',
      field: 'amount',
      width: 120,
      formatter: ({ cellValue }) => `¥${cellValue.toFixed(2)}`,
    },
    {
      title: '提现方式',
      field: 'method',
      width: 120,
      formatter: ({ cellValue }: { cellValue: WithdrawalMethod }) => {
        const methodMap: Record<WithdrawalMethod, string> = {
          alipay: '支付宝',
          wechat: '微信',
          bank: '银行卡',
        };
        return methodMap[cellValue] || cellValue;
      },
    },
    {
      title: '收款账号',
      field: 'account',
      width: 180,
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      formatter: ({ cellValue }: { cellValue: WithdrawalStatus }) => {
        const statusMap: Record<WithdrawalStatus, string> = {
          pending: '待审核',
          approved: '已通过',
          rejected: '已拒绝',
          paid: '已打款',
          failed: '打款失败',
        };
        return statusMap[cellValue] || cellValue;
      },
    },
    {
      title: '申请时间',
      field: 'create_time',
      width: 180,
    },
    {
      title: '审核时间',
      field: 'audit_time',
      width: 180,
    },
    {
      title: '打款时间',
      field: 'pay_time',
      width: 180,
    },
    {
      title: '备注',
      field: 'remark',
      width: 200,
    },
  ];
}

export function useWithdrawalFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'method',
      label: '提现方式',
      component: 'Select',
      componentProps: {
        options: [
          { label: '支付宝', value: 'alipay' },
          { label: '微信', value: 'wechat' },
          { label: '银行卡', value: 'bank' },
        ],
        allowClear: true,
      },
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        options: [
          { label: '待审核', value: 'pending' },
          { label: '已通过', value: 'approved' },
          { label: '已拒绝', value: 'rejected' },
          { label: '已打款', value: 'paid' },
          { label: '打款失败', value: 'failed' },
        ],
        allowClear: true,
      },
    },
  ];
}
