// PDP性格测试题库
// 老虎(Tiger)-支配型, 孔雀(Peacock)-表现型, 考拉(Koala)-耐心型, 猫头鹰(Owl)-精确型, 变色龙(Chameleon)-整合型

export interface PDPQuestion {
  id: number
  question: string
  options: { value: string; text: string }[]
}

export const pdpQuestions: PDPQuestion[] = [
  {
    id: 1,
    question: "面对紧急任务，您的第一反应是：",
    options: [
      { value: "Tiger", text: "立即行动，快速完成" },
      { value: "Peacock", text: "召集团队，激励大家" },
      { value: "Koala", text: "冷静分析，稳步推进" },
      { value: "Owl", text: "仔细规划，确保无误" },
      { value: "Chameleon", text: "根据情况灵活应对" },
    ],
  },
  {
    id: 2,
    question: "在社交场合，您通常会：",
    options: [
      { value: "Tiger", text: "主导话题，引领讨论" },
      { value: "Peacock", text: "活跃气氛，成为焦点" },
      { value: "Koala", text: "安静倾听，适时回应" },
      { value: "Owl", text: "观察分析，选择性交流" },
      { value: "Chameleon", text: "根据对象调整方式" },
    ],
  },
  {
    id: 3,
    question: "您最看重工作中的：",
    options: [
      { value: "Tiger", text: "权力和成就" },
      { value: "Peacock", text: "认可和赞赏" },
      { value: "Koala", text: "稳定和和谐" },
      { value: "Owl", text: "准确和质量" },
      { value: "Chameleon", text: "平衡和适应" },
    ],
  },
  {
    id: 4,
    question: "处理冲突时，您倾向于：",
    options: [
      { value: "Tiger", text: "直接面对，迅速解决" },
      { value: "Peacock", text: "调解双方，化解矛盾" },
      { value: "Koala", text: "避免冲突，维护和平" },
      { value: "Owl", text: "分析原因，理性处理" },
      { value: "Chameleon", text: "灵活应对，视情况而定" },
    ],
  },
  {
    id: 5,
    question: "您的决策风格是：",
    options: [
      { value: "Tiger", text: "果断迅速，行动导向" },
      { value: "Peacock", text: "直觉判断，情感驱动" },
      { value: "Koala", text: "深思熟虑，追求共识" },
      { value: "Owl", text: "数据分析，逻辑推理" },
      { value: "Chameleon", text: "综合考虑，灵活决策" },
    ],
  },
  {
    id: 6,
    question: "面对压力，您会：",
    options: [
      { value: "Tiger", text: "更加强势，控制局面" },
      { value: "Peacock", text: "寻求支持，表达情绪" },
      { value: "Koala", text: "保持冷静，稳定情绪" },
      { value: "Owl", text: "更加谨慎，反复确认" },
      { value: "Chameleon", text: "调整策略，灵活应对" },
    ],
  },
  {
    id: 7,
    question: "您的领导风格是：",
    options: [
      { value: "Tiger", text: "指挥型，明确方向" },
      { value: "Peacock", text: "激励型，鼓舞士气" },
      { value: "Koala", text: "支持型，关怀团队" },
      { value: "Owl", text: "专家型，以身作则" },
      { value: "Chameleon", text: "教练型，因材施教" },
    ],
  },
  {
    id: 8,
    question: "您处理细节的方式是：",
    options: [
      { value: "Tiger", text: "关注大局，委托他人" },
      { value: "Peacock", text: "可能忽略，更重整体" },
      { value: "Koala", text: "认真对待，确保准确" },
      { value: "Owl", text: "极度重视，追求完美" },
      { value: "Chameleon", text: "视情况决定关注程度" },
    ],
  },
  {
    id: 9,
    question: "您的沟通方式是：",
    options: [
      { value: "Tiger", text: "直接简短，注重结果" },
      { value: "Peacock", text: "热情生动，富有感染力" },
      { value: "Koala", text: "温和耐心，善于倾听" },
      { value: "Owl", text: "逻辑清晰，注重事实" },
      { value: "Chameleon", text: "根据对象调整方式" },
    ],
  },
  {
    id: 10,
    question: "您对变化的态度是：",
    options: [
      { value: "Tiger", text: "主动推动，寻找机会" },
      { value: "Peacock", text: "积极拥抱，乐观面对" },
      { value: "Koala", text: "需要适应时间" },
      { value: "Owl", text: "谨慎评估，确保万全" },
      { value: "Chameleon", text: "灵活适应，随机应变" },
    ],
  },
  {
    id: 11,
    question: "您的时间管理风格是：",
    options: [
      { value: "Tiger", text: "高效利用，追求速度" },
      { value: "Peacock", text: "灵活安排，留有余地" },
      { value: "Koala", text: "按部就班，稳定执行" },
      { value: "Owl", text: "精确规划，严格执行" },
      { value: "Chameleon", text: "根据情况调整计划" },
    ],
  },
  {
    id: 12,
    question: "您被什么激励：",
    options: [
      { value: "Tiger", text: "成就和权力" },
      { value: "Peacock", text: "认可和赞赏" },
      { value: "Koala", text: "安全和归属" },
      { value: "Owl", text: "正确和标准" },
      { value: "Chameleon", text: "多样性和平衡" },
    ],
  },
  {
    id: 13,
    question: "您的学习方式是：",
    options: [
      { value: "Tiger", text: "边做边学，实践第一" },
      { value: "Peacock", text: "互动讨论，分享学习" },
      { value: "Koala", text: "循序渐进，反复练习" },
      { value: "Owl", text: "深入研究，系统学习" },
      { value: "Chameleon", text: "多种方式结合" },
    ],
  },
  {
    id: 14,
    question: "您对规则的态度是：",
    options: [
      { value: "Tiger", text: "规则是用来打破的" },
      { value: "Peacock", text: "灵活运用，不拘一格" },
      { value: "Koala", text: "遵守规则，维护秩序" },
      { value: "Owl", text: "严格遵守，确保合规" },
      { value: "Chameleon", text: "视情况灵活处理" },
    ],
  },
  {
    id: 15,
    question: "您在团队中的角色是：",
    options: [
      { value: "Tiger", text: "领导者，推动进展" },
      { value: "Peacock", text: "激励者，凝聚人心" },
      { value: "Koala", text: "协调者，维护和谐" },
      { value: "Owl", text: "专家，提供专业意见" },
      { value: "Chameleon", text: "多面手，灵活补位" },
    ],
  },
  {
    id: 16,
    question: "您的工作节奏是：",
    options: [
      { value: "Tiger", text: "快节奏，追求效率" },
      { value: "Peacock", text: "充满活力，变化多端" },
      { value: "Koala", text: "稳定有序，按部就班" },
      { value: "Owl", text: "有条理，精确执行" },
      { value: "Chameleon", text: "根据需要调整节奏" },
    ],
  },
  {
    id: 17,
    question: "您最大的优势是：",
    options: [
      { value: "Tiger", text: "决断力和执行力" },
      { value: "Peacock", text: "影响力和感染力" },
      { value: "Koala", text: "耐心和可靠性" },
      { value: "Owl", text: "分析力和准确性" },
      { value: "Chameleon", text: "适应力和灵活性" },
    ],
  },
  {
    id: 18,
    question: "您的人际关系特点是：",
    options: [
      { value: "Tiger", text: "目标导向，建立有价值的关系" },
      { value: "Peacock", text: "广泛社交，朋友众多" },
      { value: "Koala", text: "深度交往，关系稳定" },
      { value: "Owl", text: "选择性交往，志同道合" },
      { value: "Chameleon", text: "根据情况建立不同类型关系" },
    ],
  },
  {
    id: 19,
    question: "面对批评，您的反应是：",
    options: [
      { value: "Tiger", text: "可能会反驳或辩护" },
      { value: "Peacock", text: "可能会感到受伤" },
      { value: "Koala", text: "接受并思考改进" },
      { value: "Owl", text: "分析批评的合理性" },
      { value: "Chameleon", text: "根据情况调整反应" },
    ],
  },
  {
    id: 20,
    question: "您的理想工作环境是：",
    options: [
      { value: "Tiger", text: "充满挑战，自主权高" },
      { value: "Peacock", text: "互动频繁，氛围活跃" },
      { value: "Koala", text: "稳定和谐，团队协作" },
      { value: "Owl", text: "有序规范，专注质量" },
      { value: "Chameleon", text: "灵活多变，兼顾平衡" },
    ],
  },
]

// PDP类型描述
export const pdpDescriptions = {
  Tiger: {
    type: "老虎型",
    title: "支配者",
    emoji: "🐅",
    description: "您是天生的领导者，具有强烈的目标导向和执行力。您勇于接受挑战，决策果断，善于推动事情向前发展。",
    strengths: ["决断力强", "目标导向", "行动迅速", "敢于挑战", "领导能力强"],
    weaknesses: ["可能过于强势", "缺乏耐心", "可能忽视他人感受", "不善于倾听"],
    careers: ["企业高管", "创业者", "项目经理", "销售总监", "律师", "军人"],
    teamRole: "在团队中，您适合担任领导者角色，推动决策和执行。",
  },
  Peacock: {
    type: "孔雀型",
    title: "表现者",
    emoji: "🦚",
    description: "您热情友好，善于表达和社交。您能够激励他人，创造积极的氛围，是团队的活力源泉。",
    strengths: ["善于沟通", "乐观积极", "创意丰富", "影响力强", "激励他人"],
    weaknesses: ["可能过于乐观", "注意力分散", "可能忽略细节", "情绪化"],
    careers: ["市场营销", "公关专员", "培训师", "销售代表", "主持人", "演员"],
    teamRole: "在团队中，您适合担任激励者和调解者角色，凝聚团队士气。",
  },
  Koala: {
    type: "考拉型",
    title: "支持者",
    emoji: "🐨",
    description: "您稳重可靠，注重团队和谐。您是出色的倾听者和支持者，能够维持稳定的人际关系和工作环境。",
    strengths: ["可靠稳定", "团队协作", "耐心倾听", "忠诚度高", "善解人意"],
    weaknesses: ["可能抗拒变化", "决策较慢", "可能过于迁就他人", "不善表达"],
    careers: ["人力资源", "客户服务", "行政管理", "护士", "教师", "社工"],
    teamRole: "在团队中，您适合担任协调者和支持者角色，维护团队和谐。",
  },
  Owl: {
    type: "猫头鹰型",
    title: "分析者",
    emoji: "🦉",
    description: "您注重细节和准确性，追求完美和高标准。您善于分析，逻辑思维能力强，是团队的质量把关者。",
    strengths: ["分析能力强", "注重细节", "准确严谨", "高标准", "系统思维"],
    weaknesses: ["可能过于完美主义", "决策较慢", "可能过于批评", "不善社交"],
    careers: ["数据分析师", "工程师", "会计师", "质量控制", "研究员", "程序员"],
    teamRole: "在团队中，您适合担任专家和质量控制者角色，确保工作质量。",
  },
  Chameleon: {
    type: "变色龙型",
    title: "整合者",
    emoji: "🦎",
    description: "您适应能力强，能够在不同情境中灵活调整。您善于平衡各方，是团队的多面手。",
    strengths: ["适应力强", "灵活多变", "平衡能力", "协调各方", "多才多艺"],
    weaknesses: ["可能缺乏主见", "身份认同模糊", "可能过于迎合", "难以坚持"],
    careers: ["咨询顾问", "协调员", "翻译", "调解员", "自由职业者"],
    teamRole: "在团队中，您适合担任协调者和多面手角色，灵活补位。",
  },
}

export default pdpQuestions
