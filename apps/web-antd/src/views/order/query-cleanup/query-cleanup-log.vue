<script lang="ts" setup>
import type { QueryCleanupConfigItem, QueryCleanupLogItem } from './data';

import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { onMounted, reactive, ref } from 'vue';

import { ColPage, useVbenModal } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getQueryCleanupConfigList,
  getQueryCleanupLogList,
  updateQueryCleanupConfig,
} from '#/api/order/query';

import { useColumns, useConfigFormSchema, useGridFormSchema } from './data';
import DetailsModal from './modules/details-modal.vue';

// 配置相关
const configLoading = ref(false);
const _submitting = ref(false);
const configList = ref<QueryCleanupConfigItem[]>([]);

// 获取配置列表
const fetchConfigList = async () => {
  try {
    configLoading.value = true;
    const { items } = await getQueryCleanupConfigList();
    if (items?.length) {
      configList.value = items;
      // 设置表单初始值
      const initialValues: Record<string, string> = {};
      for (const item of items) {
        initialValues[item.config_key] = item.config_value;
      }
      _configFormApi?.setValues(initialValues);
    }
  } catch (error) {
    console.error('获取配置列表失败:', error);
    message.error('获取配置列表失败');
  } finally {
    configLoading.value = false;
  }
};

const [ConfigForm, _configFormApi] = useVbenForm({
  schema: useConfigFormSchema(configList),
  handleSubmit: async (values) => {
    try {
      _submitting.value = true;

      // 验证 cron 表达式
      const cronValue = values.cleanup_cron;
      if (cronValue) {
        const cronParts = cronValue.split(' ');
        if (cronParts.length !== 5) {
          throw new Error('Cron表达式格式错误：应为5个字段（分 时 日 月 周）');
        }

        // 验证每个字段的值范围
        const [minute, hour, day, month, weekday] = cronParts;

        // 验证分钟 (0-59)
        if (
          !/^(?:[*0-9]|1\d|2\d|3\d|4\d|5\d|\*\/(?:\d|1\d|2\d|3\d|4\d|5\d))$/.test(
            minute,
          )
        ) {
          throw new Error('分钟字段格式错误：应为0-59之间的数字，或 */n 格式');
        }

        // 验证小时 (0-23)
        if (!/^(?:[*0-9]|1\d|2[0-3]|\*\/(?:\d|1\d|2[0-3]))$/.test(hour)) {
          throw new Error('小时字段格式错误：应为0-23之间的数字，或 */n 格式');
        }

        // 验证日期 (1-31)
        if (
          !/^(?:[*1-9]|1\d|2\d|3[01]|\*\/(?:[1-9]|1\d|2\d|3[01]))$/.test(day)
        ) {
          throw new Error('日期字段格式错误：应为1-31之间的数字，或 */n 格式');
        }

        // 验证月份 (1-12)
        if (!/^(?:[*1-9]|1[0-2]|\*\/(?:[1-9]|1[0-2]))$/.test(month)) {
          throw new Error('月份字段格式错误：应为1-12之间的数字，或 */n 格式');
        }

        // 验证星期 (0-6)
        if (!/^(?:[*0-6]|\*\/[0-6])$/.test(weekday)) {
          throw new Error('星期字段格式错误：应为0-6之间的数字，或 */n 格式');
        }
      }

      const updates = configList.value.map((item) => {
        const value = values[item.config_key];
        return {
          id: item.id,
          config_value: value?.toString() ?? '',
          status: item.status,
        };
      });

      // 逐个更新配置
      for (const update of updates) {
        await updateQueryCleanupConfig(update);
      }
      message.success('配置更新成功');
      await fetchConfigList();
    } catch (error: any) {
      message.error('配置更新失败', error.message || '请检查输入是否正确');
    } finally {
      _submitting.value = false;
    }
  },
  resetButtonOptions: {
    show: false,
  },
  submitButtonOptions: {
    content: '修改',
  },
});

// 详情弹窗
const [DetailsModalComponent, detailsModalApi] = useVbenModal({
  connectedComponent: DetailsModal,
  destroyOnClose: true,
});

// 日志列表配置
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [['create_time', ['start_time', 'end_time']]],
    schema: useGridFormSchema(),
    submitOnChange: false,
  },
  gridOptions: {
    columns: useColumns((e) => {
      if (e.code === 'view' && e.row) {
        handleViewDetails(e.row);
      }
    }),
    minHeight: 600,
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const result = await getQueryCleanupLogList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
          return result;
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: true,
      refresh: { code: 'query' },
      search: true,
      zoom: true,
    },
  } as VxeTableGridOptions<QueryCleanupLogItem>,
});

// 刷新处理
function onRefresh() {
  gridApi?.query();
}

// 查看详情
const handleViewDetails = (row: QueryCleanupLogItem) => {
  if (row?.id) {
    detailsModalApi.setData({ logId: row.id }).open();
  }
};

// 布局配置
const layoutProps = reactive({
  leftWidth: 30,
  rightWidth: 70,
  leftMinWidth: 20,
  leftMaxWidth: 40,
  resizable: true,
  leftCollapsible: true,
  splitLine: false,
});

onMounted(() => {
  fetchConfigList();
});
</script>

<template>
  <ColPage v-bind="layoutProps" auto-content-height>
    <template #left>
      <Card title="清理配置" :bordered="false" :loading="configLoading">
        <ConfigForm />
      </Card>
    </template>

    <Card class="ml-2" title="清理日志" :bordered="false">
      <Grid table-title="清理日志列表" />
    </Card>

    <!-- 详情弹窗 -->
    <DetailsModalComponent @success="onRefresh" />
  </ColPage>
</template>

<style lang="less" scoped></style>
