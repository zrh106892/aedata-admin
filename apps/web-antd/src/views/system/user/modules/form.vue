<script lang="ts" setup>
import type { Recordable } from '@vben/types';

import type { SystemUserApi } from '#/api/system/user';

import { computed, ref } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';

import { Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getRoleList } from '#/api/system/role';
import { createUser, updateUser } from '#/api/system/user';
import { $t } from '#/locales';

import { roleOptions, useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemUserApi.SystemUser>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const roles = ref<Recordable<any>[]>([]);
const loadingRoles = ref(false);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();

    // 确保role_ids是数字数组
    if (values.role_ids && Array.isArray(values.role_ids)) {
      values.role_ids = values.role_ids.map((id) =>
        typeof id === 'string' ? Number.parseInt(id, 10) : id,
      );
    }

    drawerApi.lock();
    (id.value ? updateUser(id.value, values) : createUser(values))
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<SystemUserApi.SystemUser>();
      formApi.resetForm();
      if (data) {
        formData.value = data;
        id.value = data.id;

        // 确保role_ids存在且为数组
        if (data.role_ids && !Array.isArray(data.role_ids)) {
          data.role_ids = [data.role_ids];
        }

        formApi.setValues(data);
      } else {
        id.value = undefined;
      }

      if (roleOptions.value.length === 0) {
        loadRoles();
      }
    }
  },
});

async function loadRoles() {
  loadingRoles.value = true;
  try {
    const res = await getRoleList({ page: 1, pageSize: 1000 });
    roles.value = res.items;

    // 更新全局的roleOptions
    roleOptions.value = roles.value.map((role) => ({
      label: role.role_name,
      value: role.id,
    }));
  } finally {
    loadingRoles.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.user.name'))
    : $t('common.create', $t('system.user.name'));
});
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Spin :spinning="loadingRoles">
      <Form />
    </Spin>
  </Drawer>
</template>
<style lang="css" scoped>
:deep(.ant-tree-title) {
  .tree-actions {
    display: none;
    margin-left: 20px;
  }
}

:deep(.ant-tree-title:hover) {
  .tree-actions {
    display: flex;
    flex: auto;
    justify-content: flex-end;
    margin-left: 20px;
  }
}
</style>
