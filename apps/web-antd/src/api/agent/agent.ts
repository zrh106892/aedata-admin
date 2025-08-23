import { requestClient } from '#/api/request';

export namespace AgentApi {
  export interface AgentListItem {
    id: number;
    user_id: number;
    level_name: string;
    region: string;
    mobile: string;
    membership_expiry_time: string;
    balance: number;
    total_earnings: number;
    frozen_balance: number;
    withdrawn_amount: number;
    create_time: string;
    is_real_name_verified: boolean;
    real_name: string;
    id_card: string;
    real_name_status: 'approved' | 'pending' | 'rejected';
  }

  export interface AgentList {
    total: number;
    items: AgentListItem[];
  }

  export interface GetAgentListParams {
    page: number;
    pageSize: number;
    mobile?: string;
    region?: string;
    parent_agent_id?: number;
    id?: number;
    create_time_start?: string;
    create_time_end?: string;
    order_by?: string;
    order_type?: 'asc' | 'desc';
  }

  export interface AgentLinkListItem {
    agent_id: number;
    product_name: string;
    price: number;
    link_identifier: string;
    create_time: string;
  }

  export interface AgentLinkList {
    total: number;
    items: AgentLinkListItem[];
  }

  export interface GetAgentLinkListParams {
    page: number;
    pageSize: number;
    agent_id?: number;
    product_name?: string;
    link_identifier?: string;
  }

  // 代理佣金相关接口
  export interface AgentCommissionListItem {
    id: number;
    agent_id: number;
    order_id: number;
    amount: number;
    product_name: string;
    status: number;
    create_time: string;
  }

  export interface AgentCommissionList {
    total: number;
    items: AgentCommissionListItem[];
  }

  export interface GetAgentCommissionListParams {
    page: number;
    pageSize: number;
    agent_id?: number;
    product_name?: string;
    status?: number;
  }

  // 代理奖励相关接口
  export interface AgentRewardListItem {
    id: number;
    agent_id: number;
    relation_agent_id: number;
    amount: number;
    type: string;
    create_time: string;
  }

  export interface AgentRewardList {
    total: number;
    items: AgentRewardListItem[];
  }

  export interface GetAgentRewardListParams {
    page: number;
    pageSize: number;
    agent_id?: number;
    relation_agent_id?: number;
    type?: string;
  }

  // 代理提现相关接口
  export interface AgentWithdrawalListItem {
    id: number;
    agent_id: number;
    withdraw_no: string;
    amount: number;
    status: number;
    payee_account: string;
    remark: string;
    create_time: string;
  }

  export interface AgentWithdrawalList {
    total: number;
    items: AgentWithdrawalListItem[];
  }

  export interface GetAgentWithdrawalListParams {
    page: number;
    pageSize: number;
    agent_id?: number;
    status?: number;
    withdraw_no?: string;
  }

  // 代理上级抽佣相关接口
  export interface AgentCommissionDeductionListItem {
    id: number;
    agent_id: number;
    deducted_agent_id: number;
    amount: number;
    product_name: string;
    type: 'cost' | 'pricing';
    status: number;
    create_time: string;
  }

  export interface AgentCommissionDeductionList {
    total: number;
    items: AgentCommissionDeductionListItem[];
  }

  export interface GetAgentCommissionDeductionListParams {
    page: number;
    pageSize: number;
    agent_id?: number;
    product_name?: string;
    type?: 'cost' | 'pricing';
    status?: number;
  }

  // 平台抽佣列表项
  export interface AgentPlatformDeductionListItem {
    id: number;
    agent_id: number;
    amount: number;
    type: 'cost' | 'pricing';
    status: number;
    create_time: string;
  }

  // 平台抽佣列表响应
  export interface AgentPlatformDeductionList {
    total: number;
    items: AgentPlatformDeductionListItem[];
  }

  // 获取平台抽佣列表参数
  export interface GetAgentPlatformDeductionListParams {
    page: number;
    pageSize: number;
    agent_id?: number;
    type?: 'cost' | 'pricing';
    status?: number;
  }

  // 代理产品配置列表项
  export interface AgentProductionConfigItem {
    id: number;
    product_name: string;
    cost_price: number;
    price_range_min: number;
    price_range_max: number;
    pricing_standard: number;
    overpricing_ratio: number;
    create_time: string;
  }

  // 代理产品配置列表响应
  export interface AgentProductionConfigList {
    total: number;
    items: AgentProductionConfigItem[];
  }

  // 获取代理产品配置列表参数
  export interface GetAgentProductionConfigListParams {
    page: number;
    pageSize: number;
    product_name?: string;
    id?: number;
  }

  // 更新代理产品配置参数
  export interface UpdateAgentProductionConfigParams {
    id: number;
    cost_price: number;
    price_range_min: number;
    price_range_max: number;
    pricing_standard: number;
    overpricing_ratio: number;
  }

  // 更新代理产品配置响应
  export interface UpdateAgentProductionConfigResp {
    success: boolean;
  }

  export interface MembershipRechargeOrderListItem {
    id: number;
    user_id: number;
    agent_id: number;
    level_name: string;
    amount: number;
    payment_method: 'alipay' | 'appleiap' | 'other' | 'wechat';
    order_no: string;
    platform_order_id: string;
    status: 'cancelled' | 'failed' | 'pending' | 'success';
    create_time: string;
  }

  export interface GetMembershipRechargeOrderListParams {
    page: number;
    pageSize: number;
    user_id?: number;
    agent_id?: number;
    level_name?: string;
    status?: string;
  }

  export interface MembershipRechargeOrderList {
    total: number;
    items: MembershipRechargeOrderListItem[];
  }

  // 代理会员配置相关接口
  export interface AgentMembershipConfigListItem {
    id: number;
    level_name: string;
    price: number;
    report_commission: number;
    lower_activity_reward: null | number;
    new_activity_reward: null | number;
    lower_standard_count: null | number;
    new_lower_standard_count: null | number;
    lower_withdraw_reward_ratio: null | number;
    lower_convert_vip_reward: null | number;
    lower_convert_svip_reward: null | number;
    exemption_amount: number;
    price_increase_max: null | number;
    price_ratio: null | number;
    price_increase_amount: null | number;
    create_time: string;
  }

  export interface GetAgentMembershipConfigListParams {
    page: number;
    pageSize: number;
    level_name?: string;
  }

  // 代理会员配置编辑请求参数
  export interface UpdateAgentMembershipConfigParams {
    id: number; // 主键
    level_name: string; // 会员级别名称
    price: number; // 会员年费
    report_commission: number; // 直推报告收益
    lower_activity_reward?: null | number; // 下级活跃奖励金额
    new_activity_reward?: null | number; // 新增活跃奖励金额
    lower_standard_count?: null | number; // 活跃下级达标个数
    new_lower_standard_count?: null | number; // 新增活跃下级达标个数
    lower_withdraw_reward_ratio?: null | number; // 下级提现奖励比例
    lower_convert_vip_reward?: null | number; // 下级转化VIP奖励
    lower_convert_svip_reward?: null | number; // 下级转化SVIP奖励
    exemption_amount?: null | number; // 免责金额
    price_increase_max?: null | number; // 提价最高金额
    price_ratio?: null | number; // 提价区间收取比例
    price_increase_amount?: null | number; // 在原本成本上加价的金额
  }
}

/**
 * 获取代理列表数据
 * @param params 查询参数
 */
async function getAgentList(params: AgentApi.GetAgentListParams) {
  return requestClient.get<AgentApi.AgentList>('/agent/list', {
    params,
  });
}

/**
 * 获取代理推广链接列表
 */
async function getAgentLinkList(params: AgentApi.GetAgentLinkListParams) {
  return requestClient.get<AgentApi.AgentLinkList>('/agent/agent-link/list', {
    params,
  });
}

/**
 * 获取代理佣金列表
 */
async function getAgentCommissionList(
  params: AgentApi.GetAgentCommissionListParams,
) {
  return requestClient.get<AgentApi.AgentCommissionList>(
    '/agent/agent-commission/list',
    {
      params,
    },
  );
}

/**
 * 获取代理奖励列表
 */
async function getAgentRewardList(params: AgentApi.GetAgentRewardListParams) {
  return requestClient.get<AgentApi.AgentRewardList>(
    '/agent/agent-reward/list',
    {
      params,
    },
  );
}

/**
 * 获取代理提现列表
 */
async function getAgentWithdrawalList(
  params: AgentApi.GetAgentWithdrawalListParams,
) {
  return requestClient.get<AgentApi.AgentWithdrawalList>(
    '/agent/agent-withdrawal/list',
    {
      params,
    },
  );
}

/**
 * 获取代理上级抽佣列表
 */
async function getAgentCommissionDeductionList(
  params: AgentApi.GetAgentCommissionDeductionListParams,
) {
  return requestClient.get<AgentApi.AgentCommissionDeductionList>(
    '/agent/agent-commission-deduction/list',
    {
      params,
    },
  );
}

/**
 * 获取平台抽佣列表
 */
async function getAgentPlatformDeductionList(
  params: AgentApi.GetAgentPlatformDeductionListParams,
) {
  return requestClient.get<AgentApi.AgentPlatformDeductionList>(
    '/agent/agent-platform-deduction/list',
    {
      params,
    },
  );
}

/**
 * 获取代理产品配置列表
 */
async function getAgentProductionConfigList(
  params: AgentApi.GetAgentProductionConfigListParams,
) {
  return requestClient.get<AgentApi.AgentProductionConfigList>(
    '/agent/agent-production-config/list',
    {
      params,
    },
  );
}

/**
 * 更新代理产品配置
 */
async function updateAgentProductionConfig(
  params: AgentApi.UpdateAgentProductionConfigParams,
) {
  return requestClient.post<AgentApi.UpdateAgentProductionConfigResp>(
    '/agent/agent-production-config/update',
    params,
  );
}

/**
 * 获取会员充值订单列表
 */
async function getMembershipRechargeOrderList(
  params: AgentApi.GetMembershipRechargeOrderListParams,
) {
  return requestClient.get<AgentApi.MembershipRechargeOrderList>(
    '/agent/agent-membership-recharge-order/list',
    {
      params,
    },
  );
}

/**
 * 获取代理会员配置列表
 */
async function getAgentMembershipConfigList(
  params: AgentApi.GetAgentMembershipConfigListParams,
) {
  return requestClient.get<{
    items: AgentApi.AgentMembershipConfigListItem[];
    total: number;
  }>('/agent/agent-membership-config/list', { params });
}

/**
 * 更新代理会员配置
 */
async function updateAgentMembershipConfig(
  params: AgentApi.UpdateAgentMembershipConfigParams,
) {
  return requestClient.post<{ success: boolean }>(
    '/agent/agent-membership-config/update',
    params,
  );
}

export {
  getAgentCommissionDeductionList,
  getAgentCommissionList,
  getAgentLinkList,
  getAgentList,
  getAgentMembershipConfigList,
  getAgentPlatformDeductionList,
  getAgentProductionConfigList,
  getAgentRewardList,
  getAgentWithdrawalList,
  getMembershipRechargeOrderList,
  updateAgentMembershipConfig,
  updateAgentProductionConfig,
};
