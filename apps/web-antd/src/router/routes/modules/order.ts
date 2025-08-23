import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:shopping-cart',
      order: 1000,
      title: '订单管理',
    },
    name: 'Order',
    path: '/order',
    component: () => import('#/views/order/order/index.vue'),
  },
];

export default routes;
