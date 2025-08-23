import type { VbenFormSchema } from '#/adapter/form';
import type { OnActionClickFn, VxeTableGridOptions } from '#/adapter/vxe-table';
import type { OrderApi } from '#/api/order';

export function useColumns<T = OrderApi.Order>(
  onActionClick: OnActionClickFn<T>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: 'ID',
      width: 80,
    },
    {
      field: 'order_no',
      title: '商户订单号',
      minWidth: 180,
    },
    {
      field: 'platform_order_id',
      title: '支付订单号',
      minWidth: 220,
    },
    {
      field: 'product_name',
      title: '产品',
      minWidth: 150,
    },
    {
      field: 'payment_platform',
      title: '支付方式',
      width: 120,
      formatter: ({ row }) => {
        const platformMap: Record<string, string> = {
          alipay: '支付宝',
          wechat: '微信支付',
          appleiap: '苹果支付',
        };
        return platformMap[row.payment_platform] || row.payment_platform;
      },
    },
    {
      field: 'payment_scene',
      title: '支付平台',
      width: 120,
      formatter: ({ row }) => {
        const sceneMap: Record<string, string> = {
          app: 'APP',
          h5: 'H5',
          mini_program: '小程序',
          public_account: '公众号',
        };
        return sceneMap[row.payment_scene] || row.payment_scene;
      },
    },
    {
      field: 'amount',
      title: '金额',
      width: 120,
      formatter: ({ row }) => {
        return `¥${row.amount.toFixed(2)}`;
      },
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { value: 'pending', color: 'warning', label: '待支付' },
          { value: 'paid', color: 'success', label: '已支付' },
          { value: 'failed', color: 'error', label: '支付失败' },
          { value: 'refunded', color: 'purple', label: '已退款' },
          { value: 'refunding', color: 'pink', label: '退款中' },
          { value: 'closed', color: 'default', label: '已关闭' },
        ],
      },
      field: 'status',
      title: '支付状态',
      width: 120,
    },
    {
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
      field: 'query_state',
      title: '查询状态',
      width: 120,
    },
    {
      field: 'create_time',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'pay_time',
      title: '支付时间',
      width: 180,
    },
    {
      field: 'refund_time',
      title: '退款时间',
      width: 180,
    },
    {
      cellRender: {
        name: 'CellTag',
        options: [
          { value: 0, color: 'default', label: '否' },
          { value: 1, color: 'success', label: '是' },
        ],
      },
      field: 'is_promotion',
      title: '推广订单',
      width: 100,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'order_no',
          nameTitle: '商户订单号',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'refund',
            text: '退款',
            disabled: (row: OrderApi.Order) => {
              return row.status !== 'paid';
            },
          },
          {
            code: 'query',
            text: '查询结果',
            disabled: (row: OrderApi.Order) => {
              return row.query_state !== 'success';
            },
          },
        ],
      },
      field: 'operation',
      fixed: 'right',
      title: '操作',
      width: 180,
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'order_no',
      label: '商户订单号',
    },
    {
      component: 'Input',
      fieldName: 'platform_order_id',
      label: '支付订单号',
    },
    {
      component: 'Input',
      fieldName: 'product_name',
      label: '产品名称',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '支付宝', value: 'alipay' },
          { label: '微信支付', value: 'wechat' },
          { label: '苹果支付', value: 'appleiap' },
        ],
      },
      fieldName: 'payment_platform',
      label: '支付方式',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: 'APP', value: 'app' },
          { label: 'H5', value: 'h5' },
          { label: '小程序', value: 'mini_program' },
          { label: '公众号', value: 'public_account' },
        ],
      },
      fieldName: 'payment_scene',
      label: '支付平台',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '待支付', value: 'pending' },
          { label: '已支付', value: 'paid' },
          { label: '支付失败', value: 'failed' },
          { label: '已退款', value: 'refunded' },
          { label: '已关闭', value: 'closed' },
        ],
      },
      fieldName: 'status',
      label: '支付状态',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          { label: '否', value: 0 },
          { label: '是', value: 1 },
        ],
      },
      fieldName: 'is_promotion',
      label: '推广订单',
    },
    {
      component: 'RangePicker',
      fieldName: 'create_time',
      label: '创建时间',
    },
    {
      component: 'RangePicker',
      fieldName: 'pay_time',
      label: '支付时间',
    },
    {
      component: 'RangePicker',
      fieldName: 'refund_time',
      label: '退款时间',
    },
  ];
}
