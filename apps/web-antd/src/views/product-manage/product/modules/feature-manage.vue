<script lang="ts" setup>
import type { TableColumnsType } from 'ant-design-vue';
// @ts-expect-error: sortablejs 没有类型声明
import type { SortableEvent } from 'sortablejs';

import type {
  OnActionClickParams,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { FeatureApi } from '#/api/product-manage/feature';
import type { ProductApi } from '#/api/product-manage/product';

import { h, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { useSortable } from '@vben-core/composables';

import {
  Modal as AModal,
  Button,
  message,
  Switch,
  Table,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getFeatureList } from '#/api/product-manage/feature';
import {
  getProductFeatureList,
  updateProductFeatures,
} from '#/api/product-manage/product';

import { useColumns, useGridFormSchema } from '../../feature/data';

const emit = defineEmits(['success']);

// 定义数据接口
interface ModalData {
  productId: number;
  productName: string;
}

// 临时存储的已关联模块列表
interface TempFeatureItem
  extends Omit<
    ProductApi.ProductFeatureListItem,
    'create_time' | 'id' | 'product_id' | 'update_time'
  > {
  temp_id: string; // 临时ID，用于区分新增的模块
}

const [Modal, modalApi] = useVbenModal({
  title: '管理产品模块',
  destroyOnClose: true,
  onOpenChange: (isOpen) => {
    if (isOpen) {
      loadFeatureList();
    }
  },
  onConfirm: async () => {
    try {
      const { productId } = modalApi.getData<ModalData>();
      // 准备要保存的数据
      const features = tempFeatureList.value.map((item) => ({
        feature_id: item.feature_id,
        sort: item.sort,
        enable: item.enable,
        is_important: item.is_important,
      }));

      // 更新产品模块关联
      await updateProductFeatures(productId, { features });
      message.success('保存成功');
      emit('success');
      modalApi.close(); // 保存成功后关闭Modal
      return true;
    } catch {
      message.error('保存失败');
      return false;
    }
  },
});

const loading = ref(false);
const tempFeatureList = ref<TempFeatureItem[]>([]);

// 表格配置
const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    submitOnChange: true,
    showCollapseButton: false,
  },
  separator: false,
  gridOptions: {
    columns: (useColumns(onActionClick) || []).map((col) => {
      if (col.field === 'operation' && col.cellRender) {
        return {
          ...col,
          cellRender: {
            ...col.cellRender,
            options: [
              {
                code: 'add',
                text: '添加',
                show: (row: FeatureApi.FeatureItem) => {
                  return !tempFeatureList.value.some(
                    (item) => item.feature_id === row.id,
                  );
                },
              },
              {
                code: 'added',
                text: '已添加',
                disabled: true,
                show: (row: FeatureApi.FeatureItem) => {
                  return tempFeatureList.value.some(
                    (item) => item.feature_id === row.id,
                  );
                },
              },
            ],
          },
        };
      }
      return col;
    }),
    height: 500,
    keepSource: true,
    pagerConfig: {
      pageSize: 8,
      pageSizes: [8, 20, 50, 100],
      pagerCount: 5,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getFeatureList({
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
  } as VxeTableGridOptions<FeatureApi.FeatureItem>,
});

// 已关联模块表格列配置
const columns: TableColumnsType<TempFeatureItem> = [
  {
    title: '排序',
    dataIndex: 'sort',
    width: 80,
  },
  {
    title: '模块编码',
    dataIndex: 'api_id',
    width: 150,
  },
  {
    title: '模块描述',
    dataIndex: 'name',
  },
  {
    title: '是否启用',
    dataIndex: 'enable',
    width: 100,
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.enable === 1,
        onChange: (checked: any) => {
          record.enable = checked ? 1 : 0;
        },
      });
    },
  },
  {
    title: '是否重要',
    dataIndex: 'is_important',
    width: 100,
    customRender: ({ record }) => {
      return h(Switch, {
        checked: record.is_important === 1,
        onChange: (checked: any) => {
          record.is_important = checked ? 1 : 0;
        },
      });
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 100,
    fixed: 'right',
    customRender: ({ record }) => {
      return h(
        Button,
        {
          type: 'link',
          danger: true,
          onClick: () => handleRemoveFeature(record),
        },
        () => '移除',
      );
    },
  },
];

// 加载模块列表
async function loadFeatureList() {
  const { productId, productName } = modalApi.getData<ModalData>();
  // 更新标题
  modalApi.setState({ title: `管理产品模块 - ${productName}` });

  loading.value = true;
  try {
    const res = await getProductFeatureList(productId);
    // 转换为临时数据格式
    let tempList = res.map((item) => ({
      ...item,
      temp_id: `existing_${item.id}`,
    }));
    // 对sort字段进行排序，如果全为0则按原顺序赋递增sort
    const allSortZero = tempList.every((item) => !item.sort || item.sort === 0);
    if (allSortZero) {
      tempList.forEach((item, idx) => {
        item.sort = idx + 1;
      });
    } else {
      tempList = [...tempList]
        .sort((a, b) => (a.sort || 0) - (b.sort || 0))
        .map((item, idx) => ({ ...item, sort: idx + 1 }));
    }
    tempFeatureList.value = tempList;
    initSortable();
  } finally {
    loading.value = false;
  }
}

// 初始化拖拽排序
async function initSortable() {
  const el = document.querySelector('.ant-table-tbody');
  if (!el) return;

  const { initializeSortable } = useSortable(el as HTMLElement, {
    animation: 150,
    handle: '.ant-table-row',
    onEnd: async (evt: SortableEvent) => {
      let { newIndex, oldIndex } = evt;
      // 兼容性保护，如果为 undefined/null 则不处理
      if (
        typeof newIndex !== 'number' ||
        typeof oldIndex !== 'number' ||
        newIndex === oldIndex
      )
        return;

      // 1-based 转为 0-based
      newIndex = newIndex - 1;
      oldIndex = oldIndex - 1;

      // 重新排序列表
      const newList = [...tempFeatureList.value];
      const [removed] = newList.splice(oldIndex, 1);
      if (removed) {
        newList.splice(newIndex, 0, removed);
        // 更新排序值
        newList.forEach((item, index) => {
          item.sort = index + 1;
        });
        tempFeatureList.value = newList;
      }
    },
  });

  await initializeSortable();
}
// 操作处理函数
function onActionClick(e: OnActionClickParams<FeatureApi.FeatureItem>) {
  switch (e.code) {
    case 'add': {
      handleAddFeature(e.row);
      break;
    }
  }
}
// 处理添加模块
function handleAddFeature(feature: FeatureApi.FeatureItem) {
  // 获取当前最大排序值
  const maxSort = Math.max(
    ...tempFeatureList.value.map((item) => item.sort),
    0,
  );

  // 添加到临时列表
  tempFeatureList.value.push({
    feature_id: feature.id,
    api_id: feature.api_id,
    name: feature.name,
    sort: maxSort + 1,
    enable: 1,
    is_important: 0,
    temp_id: `new_${Date.now()}_${feature.id}`,
  });
}

// 处理移除模块
function handleRemoveFeature(record: TempFeatureItem) {
  AModal.confirm({
    title: '确认移除',
    content: `确定要移除模块"${record.name}"吗？`,
    onOk: () => {
      tempFeatureList.value = tempFeatureList.value.filter(
        (item) => item.temp_id !== record.temp_id,
      );
      // 重新排序
      tempFeatureList.value.forEach((item, index) => {
        item.sort = index + 1;
      });
    },
  });
}
</script>

<template>
  <Modal class="w-[calc(100vw-200px)]">
    <div class="px-2">
      <div class="flex gap-4">
        <!-- 左侧：可选模块列表 -->
        <div class="w-[600px] flex-shrink-0">
          <!-- <div class="mb-2 text-base font-medium">可选模块</div>
          <div class="mb-4 text-sm text-gray-500">
            提示：点击添加可以快速添加模块到已关联模块列表
          </div> -->
          <Grid />
        </div>
        <!-- 右侧：已关联模块列表 -->
        <div class="flex-1">
          <div class="mb-2 text-base font-medium">已关联模块</div>
          <div class="mb-4 text-sm text-gray-500">
            提示：可以通过拖拽行来调整模块顺序，通过开关控制模块的启用状态和重要程度
          </div>
          <Table
            :columns="columns"
            :data-source="tempFeatureList"
            :loading="loading"
            :pagination="false"
            :row-key="(record) => record.temp_id"
            :scroll="{ y: 500 }"
            class="sortable-table"
            size="small"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.dataIndex === 'sort'">
                <div class="flex items-center">
                  <span class="mr-2 cursor-move">⋮⋮</span>
                  {{ record.sort }}
                </div>
              </template>
            </template>
          </Table>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style>
.sortable-table .ant-table-row {
  cursor: move;
}

.sortable-table .ant-table-row.sortable-ghost {
  background: #fafafa;
  opacity: 0.5;
}
</style>
