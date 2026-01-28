// DISC行为风格测试题库
// D(Dominance)-支配型, I(Influence)-影响型, S(Steadiness)-稳健型, C(Conscientiousness)-谨慎型

export interface DISCQuestion {
  id: number
  question: string
  options: { value: string; text: string }[]
}

export const discQuestions: DISCQuestion[] = [
  {
    id: 1,
    question: "在团队中，您更倾向于：",
    options: [
      { value: "D", text: "主导决策，带领团队前进" },
      { value: "I", text: "活跃气氛，激励团队成员" },
      { value: "S", text: "支持他人，确保团队和谐" },
      { value: "C", text: "分析数据，确保决策质量" },
    ],
  },
  {
    id: 2,
    question: "面对挑战时，您的第一反应是：",
    options: [
      { value: "D", text: "立即行动，解决问题" },
      { value: "I", text: "寻找支持，团队协作" },
      { value: "S", text: "冷静思考，稳步推进" },
      { value: "C", text: "收集信息，谨慎分析" },
    ],
  },
  {
    id: 3,
    question: "您在工作中最看重的是：",
    options: [
      { value: "D", text: "成果和效率" },
      { value: "I", text: "认可和赞赏" },
      { value: "S", text: "稳定和安全" },
      { value: "C", text: "准确和质量" },
    ],
  },
  {
    id: 4,
    question: "与他人沟通时，您通常：",
    options: [
      { value: "D", text: "直接了当，注重结果" },
      { value: "I", text: "热情友好，善于表达" },
      { value: "S", text: "耐心倾听，体贴理解" },
      { value: "C", text: "逻辑清晰，注重细节" },
    ],
  },
  {
    id: 5,
    question: "压力之下，您会：",
    options: [
      { value: "D", text: "变得更加强势和控制" },
      { value: "I", text: "寻求他人支持和鼓励" },
      { value: "S", text: "保持冷静，按部就班" },
      { value: "C", text: "更加谨慎，反复确认" },
    ],
  },
  {
    id: 6,
    question: "您认为自己的优势是：",
    options: [
      { value: "D", text: "决断力强，行动迅速" },
      { value: "I", text: "人际关系好，善于激励" },
      { value: "S", text: "可靠稳定，团队协作" },
      { value: "C", text: "分析能力强，注重细节" },
    ],
  },
  {
    id: 7,
    question: "在会议中，您通常扮演的角色是：",
    options: [
      { value: "D", text: "主导者，推动决策" },
      { value: "I", text: "激励者，调动气氛" },
      { value: "S", text: "调和者，平衡各方" },
      { value: "C", text: "分析者，提供数据" },
    ],
  },
  {
    id: 8,
    question: "您最不喜欢的工作环境是：",
    options: [
      { value: "D", text: "缺乏挑战，进展缓慢" },
      { value: "I", text: "被孤立，缺乏互动" },
      { value: "S", text: "变化太快，不稳定" },
      { value: "C", text: "混乱无序，缺乏标准" },
    ],
  },
  {
    id: 9,
    question: "做决定时，您更依赖：",
    options: [
      { value: "D", text: "直觉和经验" },
      { value: "I", text: "他人的意见" },
      { value: "S", text: "过去的成功经验" },
      { value: "C", text: "数据和事实" },
    ],
  },
  {
    id: 10,
    question: "您的工作风格是：",
    options: [
      { value: "D", text: "快速高效，注重结果" },
      { value: "I", text: "灵活多变，充满创意" },
      { value: "S", text: "稳定持续，一步一步" },
      { value: "C", text: "严谨细致，追求完美" },
    ],
  },
  {
    id: 11,
    question: "遇到冲突时，您会：",
    options: [
      { value: "D", text: "直面冲突，解决问题" },
      { value: "I", text: "调解双方，化解矛盾" },
      { value: "S", text: "避免冲突，保持和谐" },
      { value: "C", text: "分析原因，找出根本" },
    ],
  },
  {
    id: 12,
    question: "您期望的领导风格是：",
    options: [
      { value: "D", text: "给予挑战和自主权" },
      { value: "I", text: "认可和表扬" },
      { value: "S", text: "稳定和支持" },
      { value: "C", text: "明确的指导和标准" },
    ],
  },
  {
    id: 13,
    question: "处理任务时，您更注重：",
    options: [
      { value: "D", text: "速度和效率" },
      { value: "I", text: "创意和新颖" },
      { value: "S", text: "过程和协作" },
      { value: "C", text: "质量和准确" },
    ],
  },
  {
    id: 14,
    question: "您的社交方式是：",
    options: [
      { value: "D", text: "目的明确，建立有价值的关系" },
      { value: "I", text: "广泛社交，认识各种人" },
      { value: "S", text: "深度交往，维护长期友谊" },
      { value: "C", text: "选择性社交，志同道合" },
    ],
  },
  {
    id: 15,
    question: "您理想的工作节奏是：",
    options: [
      { value: "D", text: "快节奏，充满挑战" },
      { value: "I", text: "灵活多变，充满活力" },
      { value: "S", text: "稳定有序，可预测的" },
      { value: "C", text: "有条理，按计划进行" },
    ],
  },
  {
    id: 16,
    question: "面对变化，您的态度是：",
    options: [
      { value: "D", text: "主动拥抱，寻找机会" },
      { value: "I", text: "积极适应，乐观面对" },
      { value: "S", text: "需要时间，逐步适应" },
      { value: "C", text: "谨慎评估，确保万无一失" },
    ],
  },
  {
    id: 17,
    question: "您的时间管理风格是：",
    options: [
      { value: "D", text: "高效利用，最大化产出" },
      { value: "I", text: "灵活安排，留有余地" },
      { value: "S", text: "按部就班，稳定执行" },
      { value: "C", text: "精确规划，严格执行" },
    ],
  },
  {
    id: 18,
    question: "激励您的是：",
    options: [
      { value: "D", text: "成就和控制" },
      { value: "I", text: "认可和社交" },
      { value: "S", text: "稳定和归属" },
      { value: "C", text: "正确和标准" },
    ],
  },
  {
    id: 19,
    question: "您处理细节的方式是：",
    options: [
      { value: "D", text: "关注大局，委托他人" },
      { value: "I", text: "可能忽略，更关注整体" },
      { value: "S", text: "认真对待，确保准确" },
      { value: "C", text: "极度重视，追求完美" },
    ],
  },
  {
    id: 20,
    question: "您对规则的态度是：",
    options: [
      { value: "D", text: "规则是用来打破的" },
      { value: "I", text: "灵活运用，不拘泥于规则" },
      { value: "S", text: "遵守规则，维护秩序" },
      { value: "C", text: "严格遵守，确保合规" },
    ],
  },
]

// DISC类型描述
export const discDescriptions = {
  D: {
    type: "D型 - 支配型",
    title: "领导者",
    description: "您是天生的领导者，注重结果和效率。您喜欢掌控局面，勇于接受挑战，决策果断迅速。",
    strengths: ["决断力强", "目标导向", "行动迅速", "敢于挑战", "领导能力"],
    weaknesses: ["可能过于强势", "缺乏耐心", "可能忽视他人感受"],
    careers: ["企业高管", "创业者", "项目经理", "销售总监", "律师"],
    communication: "与D型沟通时，直接了当，注重结果，避免冗长的细节。",
  },
  I: {
    type: "I型 - 影响型",
    title: "社交家",
    description: "您热情友好，善于社交和表达。您喜欢与人互动，能够激励他人，创造积极的氛围。",
    strengths: ["善于沟通", "乐观积极", "创意丰富", "人际关系好", "激励他人"],
    weaknesses: ["可能过于乐观", "注意力分散", "可能忽略细节"],
    careers: ["市场营销", "公关专员", "培训师", "销售代表", "主持人"],
    communication: "与I型沟通时，保持热情友好，给予认可和赞赏，创造轻松氛围。",
  },
  S: {
    type: "S型 - 稳健型",
    title: "支持者",
    description: "您稳重可靠，注重团队和谐。您是出色的倾听者和支持者，能够维持稳定的环境。",
    strengths: ["可靠稳定", "团队协作", "耐心倾听", "忠诚度高", "适应能力"],
    weaknesses: ["可能抗拒变化", "决策较慢", "可能过于迁就他人"],
    careers: ["人力资源", "客户服务", "行政管理", "护士", "教师"],
    communication: "与S型沟通时，保持耐心和真诚，给予支持和安全感，避免突然的变化。",
  },
  C: {
    type: "C型 - 谨慎型",
    title: "分析家",
    description: "您注重细节和准确性，追求完美和高标准。您善于分析，逻辑思维能力强。",
    strengths: ["分析能力强", "注重细节", "准确严谨", "高标准", "系统思维"],
    weaknesses: ["可能过于完美主义", "决策较慢", "可能过于批评"],
    careers: ["数据分析师", "工程师", "会计师", "质量控制", "研究员"],
    communication: "与C型沟通时，提供数据和事实，逻辑清晰，给予思考时间。",
  },
}

export default discQuestions
