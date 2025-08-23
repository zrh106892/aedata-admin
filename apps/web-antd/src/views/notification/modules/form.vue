<script lang="ts" setup>
import type { Dayjs } from 'dayjs';

import type { NotificationApi } from '#/api/notification';

import { computed, nextTick, ref, watch } from 'vue';

import { useVbenDrawer, useVbenForm } from '@vben/common-ui';

import { DatePicker, RadioButton, RadioGroup } from 'ant-design-vue';
import dayjs from 'dayjs';

import { createNotification, updateNotification } from '#/api/notification';

import { useFormSchema } from '../data';

const emit = defineEmits<{
  (e: 'success'): void;
}>();

// 使用单选按钮组来控制模式
const dateMode = ref<'daily' | 'range'>('range');
const timeMode = ref<'allDay' | 'range'>('range');

// 表单值管理
const formValues = ref<{
  [key: string]: any;
  dateRange?: [Dayjs, Dayjs] | undefined;
  timeRange?: [Dayjs, Dayjs] | undefined;
}>({});

const id = ref<number>();

// 表单配置
const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

// 抽屉配置
const [Drawer, drawerApi] = useVbenDrawer({
  class: 'w-[800px]',
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;

    // 获取表单值
    const values = await formApi.getValues();

    // 处理日期时间值
    if (dateMode.value === 'daily') {
      values.start_date = '';
      values.end_date = '';
    } else if (formValues.value.dateRange) {
      const [start, end] = formValues.value.dateRange;
      values.start_date = start.format('YYYY-MM-DD');
      values.end_date = end.format('YYYY-MM-DD');
    }

    if (timeMode.value === 'allDay') {
      values.start_time = '';
      values.end_time = '';
    } else if (formValues.value.timeRange) {
      const [start, end] = formValues.value.timeRange;
      values.start_time = start.format('HH:mm:ss');
      values.end_time = end.format('HH:mm:ss');
    }

    // 提交数据
    drawerApi.lock();
    try {
      await (id.value
        ? updateNotification(id.value, {
            ...values,
          } as NotificationApi.UpdateNotificationRequest)
        : createNotification(
            values as NotificationApi.CreateNotificationRequest,
          ));
      emit('success');
      drawerApi.close();
    } catch {
      drawerApi.unlock();
    }
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<NotificationApi.NotificationItem>();
      formApi.resetForm();
      if (data) {
        id.value = data.id;

        // 初始化日期时间范围
        const dateRange =
          data.start_date && data.end_date
            ? ([dayjs(data.start_date), dayjs(data.end_date)] as [Dayjs, Dayjs])
            : undefined;
        const timeRange =
          data.start_time && data.end_time
            ? ([
                dayjs(data.start_time, 'HH:mm:ss'),
                dayjs(data.end_time, 'HH:mm:ss'),
              ] as [Dayjs, Dayjs])
            : undefined;

        // 设置表单值
        formValues.value = {
          ...data,
          dateRange,
          timeRange,
        };
        nextTick(() => {
          // 设置表单字段值
          formApi.setValues({
            ...data,
            start_date: data.start_date || undefined,
            end_date: data.end_date || undefined,
            start_time: data.start_time || undefined,
            end_time: data.end_time || undefined,
          });
        });

        // 设置模式
        dateMode.value = !data.start_date && !data.end_date ? 'daily' : 'range';
        timeMode.value =
          (!data.start_time && !data.end_time) ||
          data.start_time === data.end_time
            ? 'allDay'
            : 'range';
      } else {
        // 重置所有值
        id.value = undefined;
        formValues.value = {
          dateRange: undefined,
          timeRange: undefined,
        };
        dateMode.value = 'range';
        timeMode.value = 'range';
      }
    }
  },
});

// 计算抽屉标题
const getDrawerTitle = computed(() => {
  return id.value ? '编辑通知' : '创建通知';
});

// 监听模式变化
watch(dateMode, (newMode) => {
  if (newMode === 'daily') {
    formValues.value.dateRange = undefined;
    formApi.setFieldValue('start_date', '');
    formApi.setFieldValue('end_date', '');
  }
});

watch(timeMode, (newMode) => {
  if (newMode === 'allDay') {
    formValues.value.timeRange = undefined;
    formApi.setFieldValue('start_time', '');
    formApi.setFieldValue('end_time', '');
  }
});

// 更新字段值
const updateField = (
  field: string,
  value: [Dayjs, Dayjs] | null | undefined,
) => {
  if (!value) {
    if (field === 'dateRange') {
      formValues.value.dateRange = undefined;
      formApi.setFieldValue('start_date', '');
      formApi.setFieldValue('end_date', '');
    } else if (field === 'timeRange') {
      formValues.value.timeRange = undefined;
      formApi.setFieldValue('start_time', '');
      formApi.setFieldValue('end_time', '');
    }
    return;
  }

  const [start, end] = value;
  if (!start || !end) return;

  if (field === 'dateRange') {
    formValues.value.dateRange = [start, end];
    formApi.setFieldValue('start_date', start.format('YYYY-MM-DD'));
    formApi.setFieldValue('end_date', end.format('YYYY-MM-DD'));
  } else if (field === 'timeRange') {
    formValues.value.timeRange = [start, end];
    formApi.setFieldValue('start_time', start.format('HH:mm:ss'));
    formApi.setFieldValue('end_time', end.format('HH:mm:ss'));
  }
};
</script>

<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #show_date>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <RadioGroup v-model:value="dateMode" button-style="solid">
              <RadioButton value="range">日期范围</RadioButton>
              <RadioButton value="daily">每天</RadioButton>
            </RadioGroup>
          </div>

          <div v-if="dateMode === 'range'" class="form-item">
            <label class="form-label">日期范围</label>
            <DatePicker.RangePicker
              :value="formValues.dateRange"
              @update:value="
                (val) => updateField('dateRange', val as [Dayjs, Dayjs] | null)
              "
              format="YYYY-MM-DD"
              class="w-full"
            />
          </div>
        </div>
      </template>

      <template #show_time>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <RadioGroup v-model:value="timeMode" button-style="solid">
              <RadioButton value="range">时间段</RadioButton>
              <RadioButton value="allDay">全天</RadioButton>
            </RadioGroup>
          </div>

          <div v-if="timeMode === 'range'" class="form-item">
            <label class="form-label">时间范围</label>
            <DatePicker.RangePicker
              :value="formValues.timeRange"
              @update:value="
                (val) => updateField('timeRange', val as [Dayjs, Dayjs] | null)
              "
              format="HH:mm:ss"
              picker="time"
              class="w-full"
            />
          </div>
        </div>
      </template>
    </Form>
  </Drawer>
</template>

<style scoped>
.form-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-label {
  font-size: 14px;
  color: rgb(0 0 0 / 85%);
}

:deep(.ant-radio-group) {
  margin-bottom: 8px;
}

:deep(.ant-picker) {
  width: 100%;
}
</style>
