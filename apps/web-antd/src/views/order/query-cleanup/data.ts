import type { Ref } from 'vue';

import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, h } from 'vue';

import { notification } from 'ant-design-vue';

import { z } from '#/adapter/form';

export interface QueryCleanupConfigItem {
  id: number;
  config_key: string;
  config_value: string;
  config_desc: string;
  status: number;
  create_time: string;
  update_time: string;
}

export interface QueryCleanupLogItem {
  id: number;
  cleanup_time: string;
  cleanup_before: string;
  status: number;
  affected_rows: number;
  error_msg: string;
  remark: string;
  create_time: string;
}

export interface QueryCleanupDetailItem {
  id: number;
  cleanup_log_id: number;
  query_id: number;
  order_id: number;
  user_id: number;
  product_id: number;
  query_state: string;
  create_time_old: string;
  create_time: string;
}

export function useColumns<T = QueryCleanupLogItem>(
  onActionClick?: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'cleanup_time',
      title: '清理时间',
      width: 180,
    },
    {
      field: 'cleanup_before',
      title: '清理截止时间',
      width: 180,
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      cellRender: {
        name: 'CellTag',
        options: [
          { value: 1, color: 'success', label: '成功' },
          { value: 2, color: 'error', label: '失败' },
        ],
      },
    },
    {
      field: 'affected_rows',
      title: '影响行数',
      width: 100,
    },
    {
      field: 'error_msg',
      title: '错误信息',
      width: 200,
    },
    {
      field: 'remark',
      title: '备注',
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'view',
            text: '查看详情',
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 120,
    },
  ];
}

export function useDetailColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'query_id',
      title: '查询ID',
      width: 100,
    },
    {
      field: 'order_id',
      title: '订单ID',
      width: 100,
    },
    {
      field: 'user_id',
      title: '用户ID',
      width: 100,
    },
    {
      field: 'product_id',
      title: '产品ID',
      width: 100,
    },
    {
      field: 'query_state',
      title: '查询结果',
      width: 120,
      cellRender: {
        name: 'CellTag',
        options: [
          { value: 'pending', color: 'warning', label: '查询中' },
          { value: 'success', color: 'success', label: '查询成功' },
          { value: 'failed', color: 'error', label: '查询失败' },
          { value: 'processing', color: 'warning', label: '查询中' },
          { value: 'cleaned', color: 'default', label: '已清除结果' },
        ],
      },
    },
    {
      field: 'create_time_old',
      title: '原创建时间',
      width: 180,
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 180,
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '成功', value: 1 },
          { label: '失败', value: 2 },
        ],
      },
      fieldName: 'status',
      label: '状态',
    },
    {
      component: 'RangePicker',
      fieldName: 'create_time',
      label: '创建时间',
    },
  ];
}

export function useConfigFormSchema(
  configList: Ref<QueryCleanupConfigItem[]>,
): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入cron表达式，例如：0 3 * * *',
        addonAfter: h(
          'a',
          {
            class: 'cursor-pointer',
            onClick: () => {
              notification.info({
                message: 'Cron表达式说明',
                description: h('div', { class: 'space-y-2' }, [
                  h('p', 'Cron表达式格式：分 时 日 月 周'),
                  h('p', '常用示例：'),
                  h('ul', { class: 'list-disc pl-4' }, [
                    h('li', '每天凌晨3点执行：0 3 * * *'),
                    h('li', '每周一凌晨3点执行：0 3 * * 1'),
                    h('li', '每月1号凌晨3点执行：0 3 1 * *'),
                    h('li', '每小时执行一次：0 * * * *'),
                    h('li', '每30分钟执行一次：*/30 * * * *'),
                  ]),
                ]),
                duration: 0,
              });
            },
          },
          '帮助',
        ),
      },
      fieldName: 'cleanup_cron',
      label: '清理任务执行时间（cron表达式）',
      rules: z
        .string()
        .min(1, '请输入cron表达式')
        .regex(
          /^(\*|(\d|1\d|2\d|3\d|4\d|5\d)|\*\/(\d|1\d|2\d|3\d|4\d|5\d)) (\*|(\d|1\d|2[0-3])|\*\/(\d|1\d|2[0-3])) (\*|([1-9]|1\d|2\d|3[01])|\*\/([1-9]|1\d|2\d|3[01])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/,
          '请输入正确的cron表达式格式',
        ),
      defaultValue: computed(
        () =>
          configList.value.find(
            (item: QueryCleanupConfigItem) =>
              item.config_key === 'cleanup_cron',
          )?.config_value,
      ),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '请输入数据保留天数',
      },
      fieldName: 'retention_days',
      label: '数据保留天数',
      rules: 'required',
      defaultValue: computed(
        () =>
          configList.value.find(
            (item: QueryCleanupConfigItem) =>
              item.config_key === 'retention_days',
          )?.config_value,
      ),
    },
    {
      component: 'InputNumber',
      componentProps: {
        min: 1,
        placeholder: '请输入每次清理的批次大小',
      },
      fieldName: 'batch_size',
      label: '每次清理的批次大小',
      rules: 'required',
      defaultValue: computed(
        () =>
          configList.value.find(
            (item: QueryCleanupConfigItem) => item.config_key === 'batch_size',
          )?.config_value,
      ),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '启用', value: '1' },
          { label: '禁用', value: '2' },
        ],
      },
      fieldName: 'enable_cleanup',
      label: '是否启用清理',
      rules: 'required',
      defaultValue: computed(
        () =>
          configList.value.find(
            (item: QueryCleanupConfigItem) =>
              item.config_key === 'enable_cleanup',
          )?.config_value,
      ),
    },
  ];
}
