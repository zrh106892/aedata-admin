<script lang="ts" setup>
import type {
  OnActionClickParams,
  VxeGridListeners,
  VxeTableGridOptions,
} from '#/adapter/vxe-table';
import type { AgentApi } from '#/api/agent';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page, useVbenDrawer, useVbenModal } from '@vben/common-ui';

import { Button, Card, Dropdown, Menu } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAgentList } from '#/api/agent';

import { useColumns, useGridFormSchema } from './data';
import CommissionDeductionModal from './modules/commission-deduction-modal.vue';
import CommissionModal from './modules/commission-modal.vue';
import Form from './modules/form.vue';
import LinkModal from './modules/link-modal.vue';
import PlatformDeductionModal from './modules/platform-deduction-modal.vue';
import RewardModal from './modules/reward-modal.vue';
import WithdrawalModal from './modules/withdrawal-modal.vue';

const route = useRoute();
const router = useRouter();

// 表单抽屉
const [FormDrawer, formDrawerApi] = useVbenDrawer({
  connectedComponent: Form,
  destroyOnClose: true,
});

// 推广链接弹窗
const [LinkModalComponent, linkModalApi] = useVbenModal({
  connectedComponent: LinkModal,
  destroyOnClose: true,
});

// 佣金记录弹窗
const [CommissionModalComponent, commissionModalApi] = useVbenModal({
  connectedComponent: CommissionModal,
  destroyOnClose: true,
});

// 奖励记录弹窗
const [RewardModalComponent, rewardModalApi] = useVbenModal({
  connectedComponent: RewardModal,
  destroyOnClose: true,
});

// 提现记录弹窗
const [WithdrawalModalComponent, withdrawalModalApi] = useVbenModal({
  connectedComponent: WithdrawalModal,
  destroyOnClose: true,
});

// 上级抽佣弹窗
const [CommissionDeductionModalComponent, commissionDeductionModalApi] =
  useVbenModal({
    connectedComponent: CommissionDeductionModal,
    destroyOnClose: true,
  });

// 平台抽佣弹窗
const [PlatformDeductionModalComponent, platformDeductionModalApi] =
  useVbenModal({
    connectedComponent: PlatformDeductionModal,
    destroyOnClose: true,
  });

// 表格配置
const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    fieldMappingTime: [
      ['create_time', ['create_time_start', 'create_time_end']],
    ],
    schema: useGridFormSchema(),
    submitOnChange: true,
  },
  gridEvents: {
    sortChange: () => {
      gridApi.query();
    },
  } as VxeGridListeners<AgentApi.AgentListItem>,
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    sortConfig: {
      remote: true,
      multiple: false,
      trigger: 'default',
      orders: ['asc', 'desc', null],
      resetPage: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page, sort }, formValues) => {
          const sortParams = sort
            ? {
                order_by: sort.field,
                order_type: sort.order,
              }
            : {};

          const res = await getAgentList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
            ...sortParams,
            parent_agent_id: route.query.parent_agent_id
              ? Number(route.query.parent_agent_id)
              : undefined,
          });

          return {
            ...res,
            sort: sort || null,
          };
        },
      },
      props: {
        result: 'items',
        total: 'total',
      },
      autoLoad: true,
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
  } as VxeTableGridOptions<AgentApi.AgentListItem>,
});

// 更多操作菜单项
const moreMenuItems = [
  {
    key: 'links',
    label: '推广链接',
  },
  // {
  //   key: 'commission',
  //   label: '佣金记录',
  // },
  // {
  //   key: 'commission-deduction',
  //   label: '上级抽佣',
  // },
  // {
  //   key: 'platform-deduction',
  //   label: '平台抽佣',
  // },
  {
    key: 'reward',
    label: '奖励记录',
  },
  {
    key: 'withdrawal',
    label: '提现记录',
  },
];

// 上级代理信息
const parentAgentId = computed(() => route.query.parent_agent_id);

// 返回上级列表
function onBackToParent() {
  router.replace({
    query: {
      ...route.query,
      parent_agent_id: undefined,
    },
  });
}

// 操作处理函数
function onActionClick(
  e:
    | OnActionClickParams<AgentApi.AgentListItem>
    | { code: string; row: AgentApi.AgentListItem },
) {
  switch (e.code) {
    case 'commission': {
      onViewCommission(e.row);
      break;
    }
    case 'commission-deduction': {
      onViewCommissionDeduction(e.row);
      break;
    }
    case 'edit': {
      onEdit(e.row);
      break;
    }
    case 'links': {
      onViewLinks(e.row);
      break;
    }
    case 'platform-deduction': {
      onViewPlatformDeduction(e.row);
      break;
    }
    case 'reward': {
      onViewReward(e.row);
      break;
    }
    case 'view-sub-agent': {
      router.replace({
        query: {
          ...route.query,
          parent_agent_id: e.row.id,
        },
      });
      break;
    }
    case 'withdrawal': {
      onViewWithdrawal(e.row);
      break;
    }
  }
}

// 编辑处理
function onEdit(row: AgentApi.AgentListItem) {
  formDrawerApi.setData(row).open();
}

// 查看推广链接
function onViewLinks(row: AgentApi.AgentListItem) {
  linkModalApi.setData({ agentId: row.id }).open();
}

// 查看佣金记录
function onViewCommission(row: AgentApi.AgentListItem) {
  commissionModalApi.setData({ agentId: row.id }).open();
}

// 查看奖励记录
function onViewReward(row: AgentApi.AgentListItem) {
  rewardModalApi.setData({ agentId: row.id }).open();
}

// 查看提现记录
function onViewWithdrawal(row: AgentApi.AgentListItem) {
  withdrawalModalApi.setData({ agentId: row.id }).open();
}

// 查看上级抽佣记录
function onViewCommissionDeduction(row: AgentApi.AgentListItem) {
  commissionDeductionModalApi.setData({ agentId: row.id }).open();
}

// 查看平台抽佣记录
function onViewPlatformDeduction(row: AgentApi.AgentListItem) {
  platformDeductionModalApi.setData({ agentId: row.id }).open();
}

// 刷新处理
function onRefresh() {
  gridApi.query();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh" />
    <LinkModalComponent />
    <CommissionModalComponent />
    <CommissionDeductionModalComponent />
    <PlatformDeductionModalComponent />
    <RewardModalComponent />
    <WithdrawalModalComponent />

    <!-- 上级代理信息卡片 -->
    <Card v-if="parentAgentId" class="mb-4">
      <div class="flex items-center gap-4">
        <Button @click="onBackToParent">返回上级列表</Button>
        <div>上级代理ID：{{ parentAgentId }}</div>
      </div>
    </Card>

    <Grid table-title="代理列表">
      <template #operation="{ row }">
        <div class="operation-buttons">
          <Button type="link" @click="onActionClick({ code: 'edit', row })">
            编辑
          </Button>
          <Button
            type="link"
            @click="onActionClick({ code: 'view-sub-agent', row })"
          >
            查看下级
          </Button>
          <!-- <Button
            type="link"
            @click="onActionClick({ code: 'order-record', row })"
          >
            订单记录
          </Button> -->
          <Dropdown>
            <Button type="link">更多操作</Button>
            <template #overlay>
              <Menu
                :items="moreMenuItems"
                @click="(e) => onActionClick({ code: String(e.key), row })"
              />
            </template>
          </Dropdown>
        </div>
      </template>
    </Grid>
  </Page>
</template>

<style lang="less" scoped>
.parent-agent-card {
  margin-bottom: 16px;
  background-color: #fafafa;
}

.operation-buttons {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 4px;

  :deep(.ant-btn-link) {
    padding: 0 4px;
  }
}
</style>
