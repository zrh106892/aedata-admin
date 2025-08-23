import type { VbenFormSchema } from '@vben/common-ui';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { AgentApi } from '#/api/agent';

// 平台抽佣列表列配置
export function usePlatformDeductionColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      title: 'ID',
      field: 'id',
      width: 80,
    },
    {
      title: '代理ID',
      field: 'agent_id',
      width: 100,
    },
    {
      title: '抽佣金额',
      field: 'amount',
      width: 120,
      formatter: ({ cellValue }) => {
        return `¥${cellValue.toFixed(2)}`;
      },
    },
    {
      title: '抽佣类型',
      field: 'type',
      width: 120,
      formatter: ({
        cellValue,
      }: {
        cellValue: AgentApi.AgentPlatformDeductionListItem['type'];
      }) => {
        const typeMap = {
          cost: '成本抽佣',
          pricing: '定价抽佣',
        };
        return typeMap[cellValue] || cellValue;
      },
    },
    {
      title: '状态',
      field: 'status',
      width: 100,
      formatter: ({ cellValue }) => {
        const statusMap = {
          0: { text: '待处理', type: 'warning' },
          1: { text: '已处理', type: 'success' },
          2: { text: '已取消', type: 'error' },
        };
        const status = statusMap[cellValue as keyof typeof statusMap];
        return status
          ? `<a-tag color="${status.type}">${status.text}</a-tag>`
          : cellValue;
      },
    },
    {
      title: '创建时间',
      field: 'create_time',
      width: 180,
    },
  ];
}

// 平台抽佣列表搜索表单配置
export function usePlatformDeductionFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      fieldName: 'type',
      label: '抽佣类型',
      componentProps: {
        options: [
          { label: '成本抽佣', value: 'cost' },
          { label: '定价抽佣', value: 'pricing' },
        ],
        allowClear: true,
      },
    },
    {
      component: 'Select',
      fieldName: 'status',
      label: '状态',
      componentProps: {
        options: [
          { label: '待处理', value: 0 },
          { label: '已处理', value: 1 },
          { label: '已取消', value: 2 },
        ],
        allowClear: true,
      },
    },
  ];
}
