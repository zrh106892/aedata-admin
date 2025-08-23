<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { ProductApi } from '#/api/product-manage';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteProduct, getProductList } from '#/api/product-manage';

import { useColumns, useGridFormSchema } from './data';
import FeatureManage from './modules/feature-manage.vue';
import Form from './modules/form.vue';

// 表单抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 模块管理弹窗
const [FeatureManageModal, featureManageModalApi] = useVbenModal({
  connectedComponent: FeatureManage,
  destroyOnClose: true,
});

// 表格配置
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridOptions: {
    columns: useColumns(onActionClick),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getProductList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<ProductApi.ProductItem>,
});

// 操作处理函数
function onActionClick(e: OnActionClickParams<ProductApi.ProductItem>) {
  switch (e.code) {
    case 'delete': {
      onDelete(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'features': {
      onManageFeatures(e.row);
      break;
    }
  }
}

// 编辑处理
function onEdit(row: ProductApi.ProductItem) {
  formDrawerApi.setData(row).open();
}

// 删除处理
function onDelete(row: ProductApi.ProductItem) {
  const hideLoading = message.loading({
    content: `正在删除 ${row.product_name}`,
    duration: 0,
    key: 'action_process_msg',
  });
  deleteProduct(row.id)
    .then(() => {
      message.success({
        content: `删除 ${row.product_name} 成功`,
        key: 'action_process_msg',
      });
      onRefresh();
    })
    .catch(() => {
      hideLoading();
    });
}

// 刷新处理
function onRefresh() {
  gridApi.query();
}

// 创建处理
function onCreate() {
  formDrawerApi.setData({}).open();
}

// 模块管理处理
function onManageFeatures(row: ProductApi.ProductItem) {
  featureManageModalApi
    .setData({
      productId: row.id,
      productName: row.product_name,
    })
    .open();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <FeatureManageModal @success="onRefresh" />
    <Grid table-title="产品列表">
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          新增产品
        </Button>
      </template>
    </Grid>
  </Page>
</template>
