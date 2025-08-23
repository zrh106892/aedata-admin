<script lang="ts" setup>
import type { JsonViewerAction } from '@vben/common-ui';

import type { OrderQueryApi } from '#/api/order/query';

import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { JsonViewer, Page } from '@vben/common-ui';
import { MdiArrowLeft } from '@vben/icons';

import {
  Button,
  Card,
  Collapse,
  Descriptions,
  message,
  Tag,
} from 'ant-design-vue';

import { getOrderQueryDetail } from '#/api/order/query';

const route = useRoute();
const router = useRouter();
const orderId = Number(route.params.id);
const loading = ref(false);
const queryDetail = ref<OrderQueryApi.QueryDetail>();

// 查询状态配置
const queryStateConfig = [
  { value: 'pending', color: 'warning', label: '查询中' },
  { value: 'success', color: 'success', label: '查询成功' },
  { value: 'failed', color: 'error', label: '查询失败' },
  { value: 'processing', color: 'warning', label: '查询中' },
] as const;

// 获取查询状态配置
function getQueryStateConfig(state: string) {
  return (
    queryStateConfig.find((item) => item.value === state) || {
      color: 'default',
      label: state,
    }
  );
}

// 字段名称映射
const fieldNameMap: Record<string, string> = {
  // 基础字段
  name: '姓名',
  id_card: '身份证号',
  mobile: '手机号',
  code: '验证码',
  // 企业相关
  ent_name: '企业名称',
  ent_code: '统一社会信用代码',
  // 婚姻相关
  name_man: '男方姓名',
  id_card_man: '男方身份证号',
  name_woman: '女方姓名',
  id_card_woman: '女方身份证号',
  // 车辆相关
  car_type: '车辆类型',
  car_license: '车牌号',
  vin_code: '车架号',
  car_driving_permit: '行驶证号',
  // 银行卡相关
  bank_card: '银行卡号',
  // 学历相关
  certificate_number: '证书编号',
  // 日期相关
  start_date: '开始日期',
};

// 获取字段显示名称
function getFieldDisplayName(key: string): string {
  return fieldNameMap[key] || key;
}

// 返回订单管理页面
function handleBack() {
  router.push('/order');
}

// 获取查询详情
async function fetchQueryDetail() {
  if (!orderId) return;

  loading.value = true;
  try {
    const res = await getOrderQueryDetail(orderId);
    queryDetail.value = res;
  } catch {
    message.error('获取查询详情失败');
  } finally {
    loading.value = false;
  }
}

function handleCopied(_event: JsonViewerAction) {
  message.success('已复制JSON');
}

onMounted(() => {
  fetchQueryDetail();
});
</script>

<template>
  <Page>
    <div class="p-4">
      <div class="mb-4 flex items-center">
        <Button @click="handleBack">
          <template #icon><MdiArrowLeft /></template>
          返回订单管理
        </Button>
      </div>

      <Card :loading="loading" class="mb-4">
        <template #title>
          <div class="flex items-center justify-between">
            <span class="text-lg font-medium">订单查询详情</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-500">查询状态:</span>
              <Tag
                v-if="queryDetail"
                :color="getQueryStateConfig(queryDetail.query_state).color"
              >
                {{ getQueryStateConfig(queryDetail.query_state).label }}
              </Tag>
            </div>
          </div>
        </template>

        <template v-if="queryDetail">
          <Descriptions :column="2" bordered>
            <Descriptions.Item label="订单ID">
              {{ queryDetail.order_id }}
            </Descriptions.Item>
            <Descriptions.Item label="用户ID">
              {{ queryDetail.user_id }}
            </Descriptions.Item>
            <Descriptions.Item label="产品名称">
              {{ queryDetail.product_name }}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {{ queryDetail.create_time }}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {{ queryDetail.update_time }}
            </Descriptions.Item>
          </Descriptions>
        </template>
      </Card>

      <template v-if="queryDetail">
        <Card class="mb-4">
          <template #title>
            <span class="text-lg font-medium">查询参数</span>
          </template>
          <template v-if="queryDetail.query_params">
            <Descriptions :column="2" bordered>
              <Descriptions.Item
                v-for="(value, key) in queryDetail.query_params"
                :key="key"
                :label="getFieldDisplayName(key)"
              >
                {{ value }}
              </Descriptions.Item>
            </Descriptions>
          </template>
          <div v-else class="text-gray-500">暂无查询参数</div>
        </Card>

        <Card>
          <template #title>
            <span class="text-lg font-medium">查询数据</span>
          </template>
          <template v-if="queryDetail.query_data?.length">
            <Collapse
              :default-active-key="
                queryDetail.query_data.map((_, index) => index)
              "
            >
              <Collapse.Panel
                v-for="(item, index) in queryDetail.query_data"
                :key="index"
              >
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-lg font-medium">{{
                        item.feature.featureName
                      }}</span>
                      <Tag color="blue">API: {{ item.data.apiID }}</Tag>
                    </div>
                    <Tag
                      :color="
                        String(item.data.success) === 'true'
                          ? 'success'
                          : 'error'
                      "
                    >
                      {{
                        String(item.data.success) === 'true'
                          ? '查询成功'
                          : '查询失败'
                      }}
                    </Tag>
                  </div>
                </template>

                <div class="grid gap-4">
                  <div v-if="item.data.data">
                    <div class="mb-2 font-medium">查询结果:</div>
                    <JsonViewer
                      :value="item.data.data"
                      copyable
                      :expand-depth="2"
                      boxed
                      @copied="handleCopied"
                    />
                  </div>
                  <div class="text-gray-500">
                    查询时间: {{ item.data.timestamp }}
                  </div>
                </div>
              </Collapse.Panel>
            </Collapse>
          </template>
          <div v-else class="py-4 text-center text-gray-500">暂无查询数据</div>
        </Card>
      </template>
      <template v-else>
        <Card>
          <div class="py-8 text-center text-gray-500">
            {{ loading ? '加载中...' : '暂无查询数据' }}
          </div>
        </Card>
      </template>
    </div>
  </Page>
</template>

<style scoped>
:deep(.ant-collapse-header) {
  padding: 12px 16px !important;
}

:deep(.ant-collapse-content-box) {
  padding: 16px !important;
}
</style>
