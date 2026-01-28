export interface MBTIQuestion {
  id: number
  question: string
  options: { value: string; text: string }[]
  dimension: "EI" | "SN" | "TF" | "JP"
}

export const mbtiQuestions: MBTIQuestion[] = [
  // E vs I 维度问题 (23题)
  {
    id: 1,
    question: "在社交场合中，您通常会：",
    options: [
      { value: "E", text: "认识新朋友，扩大社交圈" },
      { value: "I", text: "与已认识的朋友交流，保持小圈子" },
    ],
    dimension: "EI",
  },
  {
    id: 2,
    question: "您更喜欢：",
    options: [
      { value: "E", text: "在团队中工作，与他人合作" },
      { value: "I", text: "独立工作，自己思考问题" },
    ],
    dimension: "EI",
  },
  {
    id: 3,
    question: "当您需要充电时，您会选择：",
    options: [
      { value: "E", text: "与朋友聚会，参加社交活动" },
      { value: "I", text: "独处，阅读或进行个人爱好" },
    ],
    dimension: "EI",
  },
  {
    id: 4,
    question: "在会议或讨论中，您通常：",
    options: [
      { value: "E", text: "积极发言，边说边思考" },
      { value: "I", text: "先思考，然后再发表意见" },
    ],
    dimension: "EI",
  },
  {
    id: 5,
    question: "您更倾向于：",
    options: [
      { value: "E", text: "认识很多人，建立广泛的社交网络" },
      { value: "I", text: "与少数几个人建立深厚的友谊" },
    ],
    dimension: "EI",
  },
  {
    id: 6,
    question: "在工作环境中，您更喜欢：",
    options: [
      { value: "E", text: "开放的办公空间，可以随时与同事交流" },
      { value: "I", text: "安静的私人空间，可以专注工作" },
    ],
    dimension: "EI",
  },
  {
    id: 7,
    question: "当面对问题时，您更倾向于：",
    options: [
      { value: "E", text: "与他人讨论，获取不同观点" },
      { value: "I", text: "独自思考，寻找解决方案" },
    ],
    dimension: "EI",
  },
  {
    id: 8,
    question: "您更喜欢的休闲活动是：",
    options: [
      { value: "E", text: "参加派对、团体活动或体育比赛" },
      { value: "I", text: "阅读、看电影或独自进行创作" },
    ],
    dimension: "EI",
  },
  {
    id: 9,
    question: "在陌生环境中，您通常会：",
    options: [
      { value: "E", text: "主动与他人交谈，快速融入环境" },
      { value: "I", text: "观察周围环境，等待他人接近" },
    ],
    dimension: "EI",
  },
  {
    id: 10,
    question: "您认为自己是：",
    options: [
      { value: "E", text: "外向、健谈的人" },
      { value: "I", text: "内敛、安静的人" },
    ],
    dimension: "EI",
  },
  {
    id: 11,
    question: "长时间的社交活动后，您通常会：",
    options: [
      { value: "E", text: "感到精力充沛，想继续社交" },
      { value: "I", text: "感到疲惫，需要独处恢复精力" },
    ],
    dimension: "EI",
  },
  {
    id: 12,
    question: "您更喜欢的工作方式是：",
    options: [
      { value: "E", text: "与团队一起头脑风暴和协作" },
      { value: "I", text: "独立思考和解决问题" },
    ],
    dimension: "EI",
  },
  {
    id: 13,
    question: "您更容易：",
    options: [
      { value: "E", text: "在说话的过程中组织思路" },
      { value: "I", text: "在说话前先组织好思路" },
    ],
    dimension: "EI",
  },
  {
    id: 14,
    question: "您更喜欢的学习方式是：",
    options: [
      { value: "E", text: "小组讨论和互动学习" },
      { value: "I", text: "自学和独立研究" },
    ],
    dimension: "EI",
  },
  {
    id: 15,
    question: "当您有好消息时，您会：",
    options: [
      { value: "E", text: "立即告诉朋友和家人分享喜悦" },
      { value: "I", text: "只告诉少数几个亲近的人" },
    ],
    dimension: "EI",
  },
  {
    id: 16,
    question: "您更喜欢的假期类型是：",
    options: [
      { value: "E", text: "热闹的旅游胜地，有很多活动和人" },
      { value: "I", text: "安静的度假地，可以放松和思考" },
    ],
    dimension: "EI",
  },
  {
    id: 17,
    question: "在团队项目中，您更倾向于：",
    options: [
      { value: "E", text: "担任协调者或发言人的角色" },
      { value: "I", text: "负责研究或分析的工作" },
    ],
    dimension: "EI",
  },
  {
    id: 18,
    question: "您更喜欢的通讯方式是：",
    options: [
      { value: "E", text: "面对面交谈或视频通话" },
      { value: "I", text: "电子邮件或文字消息" },
    ],
    dimension: "EI",
  },
  {
    id: 19,
    question: "当您遇到困难时，您更倾向于：",
    options: [
      { value: "E", text: "寻求他人的建议和支持" },
      { value: "I", text: "自己思考解决方案" },
    ],
    dimension: "EI",
  },
  {
    id: 20,
    question: "您更喜欢的工作环境是：",
    options: [
      { value: "E", text: "充满活力和互动的环境" },
      { value: "I", text: "安静和专注的环境" },
    ],
    dimension: "EI",
  },
  {
    id: 21,
    question: "您更倾向于：",
    options: [
      { value: "E", text: "在多个社交圈中活跃" },
      { value: "I", text: "在一个小圈子中深入交往" },
    ],
    dimension: "EI",
  },
  {
    id: 22,
    question: "您更喜欢：",
    options: [
      { value: "E", text: "参加大型社交活动" },
      { value: "I", text: "与一两个朋友进行深入交流" },
    ],
    dimension: "EI",
  },
  {
    id: 23,
    question: "您更倾向于：",
    options: [
      { value: "E", text: "在公共场合表达自己的想法" },
      { value: "I", text: "在私下或小范围内分享想法" },
    ],
    dimension: "EI",
  },

  // S vs N 维度问题 (22题)
  {
    id: 24,
    question: "当面对新信息时，您更倾向于：",
    options: [
      { value: "S", text: "关注具体细节和事实" },
      { value: "N", text: "寻找模式和可能性" },
    ],
    dimension: "SN",
  },
  {
    id: 25,
    question: "您更相信：",
    options: [
      { value: "S", text: "实际经验和直接观察" },
      { value: "N", text: "直觉和想象力" },
    ],
    dimension: "SN",
  },
  {
    id: 26,
    question: "您更喜欢处理：",
    options: [
      { value: "S", text: "已知的、确定的信息" },
      { value: "N", text: "理论性的、抽象的概念" },
    ],
    dimension: "SN",
  },
  {
    id: 27,
    question: "在解决问题时，您更倾向于：",
    options: [
      { value: "S", text: "使用已证实有效的方法" },
      { value: "N", text: "尝试创新的解决方案" },
    ],
    dimension: "SN",
  },
  {
    id: 28,
    question: "您更关注：",
    options: [
      { value: "S", text: "当下的现实和实际情况" },
      { value: "N", text: "未来的可能性和潜在发展" },
    ],
    dimension: "SN",
  },
  {
    id: 29,
    question: "您更喜欢的工作类型是：",
    options: [
      { value: "S", text: "有明确指导和具体步骤的工作" },
      { value: "N", text: "允许创新和探索的工作" },
    ],
    dimension: "SN",
  },
  {
    id: 30,
    question: "您更倾向于：",
    options: [
      { value: "S", text: "关注实际和现实的细节" },
      { value: "N", text: "思考概念和理论" },
    ],
    dimension: "SN",
  },
  {
    id: 31,
    question: "您更喜欢的书籍或电影是：",
    options: [
      { value: "S", text: "基于现实的故事或纪实作品" },
      { value: "N", text: "科幻、奇幻或充满想象力的作品" },
    ],
    dimension: "SN",
  },
  {
    id: 32,
    question: "在学习新技能时，您更倾向于：",
    options: [
      { value: "S", text: "按部就班地学习，掌握每个具体步骤" },
      { value: "N", text: "先了解整体概念，然后填补细节" },
    ],
    dimension: "SN",
  },
  {
    id: 33,
    question: "您更喜欢的工作环境是：",
    options: [
      { value: "S", text: "有明确结构和规则的环境" },
      { value: "N", text: "灵活多变，鼓励创新的环境" },
    ],
    dimension: "SN",
  },
  {
    id: 34,
    question: "您更倾向于：",
    options: [
      { value: "S", text: "关注现实和实际问题" },
      { value: "N", text: "思考未来和可能性" },
    ],
    dimension: "SN",
  },
  {
    id: 35,
    question: "在描述事物时，您更倾向于：",
    options: [
      { value: "S", text: "提供具体细节和精确描述" },
      { value: "N", text: "使用比喻和隐喻，强调整体印象" },
    ],
    dimension: "SN",
  },
  {
    id: 36,
    question: "您更喜欢的工作任务是：",
    options: [
      { value: "S", text: "需要精确和注重细节的任务" },
      { value: "N", text: "需要创造力和想象力的任务" },
    ],
    dimension: "SN",
  },
  {
    id: 37,
    question: "您更相信：",
    options: [
      { value: "S", text: "亲眼所见和实际经验" },
      { value: "N", text: "直觉和内在感受" },
    ],
    dimension: "SN",
  },
  {
    id: 38,
    question: "在讨论问题时，您更关注：",
    options: [
      { value: "S", text: "具体事实和实际例子" },
      { value: "N", text: "概念和理论框架" },
    ],
    dimension: "SN",
  },
  {
    id: 39,
    question: "您更喜欢的学习方式是：",
    options: [
      { value: "S", text: "通过实践和具体例子学习" },
      { value: "N", text: "通过理论和概念学习" },
    ],
    dimension: "SN",
  },
  {
    id: 40,
    question: "您更倾向于：",
    options: [
      { value: "S", text: "关注现在和过去的经验" },
      { value: "N", text: "思考未来和可能发生的事情" },
    ],
    dimension: "SN",
  },
  {
    id: 41,
    question: "在解决问题时，您更依赖：",
    options: [
      { value: "S", text: "已经证明有效的方法和经验" },
      { value: "N", text: "创新的思路和直觉" },
    ],
    dimension: "SN",
  },
  {
    id: 42,
    question: "您更喜欢的工作是：",
    options: [
      { value: "S", text: "有明确目标和具体步骤的工作" },
      { value: "N", text: "允许探索和创新的工作" },
    ],
    dimension: "SN",
  },
  {
    id: 43,
    question: "您更倾向于：",
    options: [
      { value: "S", text: "关注实际和现实的问题" },
      { value: "N", text: "思考抽象和理论性的问题" },
    ],
    dimension: "SN",
  },
  {
    id: 44,
    question: "您更喜欢：",
    options: [
      { value: "S", text: "按照既定的方法和程序工作" },
      { value: "N", text: "尝试新的方法和创新的解决方案" },
    ],
    dimension: "SN",
  },
  {
    id: 45,
    question: "您更关注：",
    options: [
      { value: "S", text: "实际的细节和具体的事实" },
      { value: "N", text: "整体的概念和潜在的可能性" },
    ],
    dimension: "SN",
  },

  // T vs F 维度问题 (22题)
  {
    id: 46,
    question: "在做决定时，您通常会：",
    options: [
      { value: "T", text: "考虑逻辑和客观分析" },
      { value: "F", text: "考虑个人价值观和他人感受" },
    ],
    dimension: "TF",
  },
  {
    id: 47,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "公正客观地分析情况" },
      { value: "F", text: "考虑决定对人的影响" },
    ],
    dimension: "TF",
  },
  {
    id: 48,
    question: "在解决冲突时，您更关注：",
    options: [
      { value: "T", text: "找出问题的根本原因和逻辑解决方案" },
      { value: "F", text: "维护关系和照顾各方感受" },
    ],
    dimension: "TF",
  },
  {
    id: 49,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "直接指出问题，即使可能伤害他人感受" },
      { value: "F", text: "委婉表达，避免伤害他人感受" },
    ],
    dimension: "TF",
  },
  {
    id: 50,
    question: "在评估情况时，您更重视：",
    options: [
      { value: "T", text: "客观事实和逻辑分析" },
      { value: "F", text: "人际关系和价值观" },
    ],
    dimension: "TF",
  },
  {
    id: 51,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "保持客观，不受个人情感影响" },
      { value: "F", text: "考虑决定对他人的情感影响" },
    ],
    dimension: "TF",
  },
  {
    id: 52,
    question: "在团队中，您更关注：",
    options: [
      { value: "T", text: "任务的完成和效率" },
      { value: "F", text: "团队和谐和成员满意度" },
    ],
    dimension: "TF",
  },
  {
    id: 53,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "基于逻辑和事实做决定" },
      { value: "F", text: "基于价值观和个人信念做决定" },
    ],
    dimension: "TF",
  },
  {
    id: 54,
    question: "在给予反馈时，您更倾向于：",
    options: [
      { value: "T", text: "直接指出问题和改进方向" },
      { value: "F", text: "先肯定优点，再委婉提出建议" },
    ],
    dimension: "TF",
  },
  {
    id: 55,
    question: "您更看重：",
    options: [
      { value: "T", text: "公平和一致性" },
      { value: "F", text: "同情和个人情况" },
    ],
    dimension: "TF",
  },
  {
    id: 56,
    question: "在工作中，您更重视：",
    options: [
      { value: "T", text: "效率和成果" },
      { value: "F", text: "团队合作和人际关系" },
    ],
    dimension: "TF",
  },
  {
    id: 57,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "客观分析问题，不受个人情感影响" },
      { value: "F", text: "考虑决定对人的影响和感受" },
    ],
    dimension: "TF",
  },
  {
    id: 58,
    question: "在处理冲突时，您更倾向于：",
    options: [
      { value: "T", text: "关注问题本身，寻求公正的解决方案" },
      { value: "F", text: "关注人际关系，寻求和谐的解决方案" },
    ],
    dimension: "TF",
  },
  {
    id: 59,
    question: "您更看重：",
    options: [
      { value: "T", text: "真实和诚实，即使可能伤害感情" },
      { value: "F", text: "善良和体贴，避免伤害他人" },
    ],
    dimension: "TF",
  },
  {
    id: 60,
    question: "在评价他人时，您更倾向于：",
    options: [
      { value: "T", text: "客观评价其表现和能力" },
      { value: "F", text: "考虑其努力和意图" },
    ],
    dimension: "TF",
  },
  {
    id: 61,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "基于原则和规则做决定" },
      { value: "F", text: "基于具体情况和个人需求做决定" },
    ],
    dimension: "TF",
  },
  {
    id: 62,
    question: "在处理问题时，您更关注：",
    options: [
      { value: "T", text: "找出最有效的解决方案" },
      { value: "F", text: "确保所有人都感到被尊重和理解" },
    ],
    dimension: "TF",
  },
  {
    id: 63,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "保持客观和理性" },
      { value: "F", text: "表达同理心和关怀" },
    ],
    dimension: "TF",
  },
  {
    id: 64,
    question: "在做决定时，您更看重：",
    options: [
      { value: "T", text: "逻辑和一致性" },
      { value: "F", text: "价值观和人际和谐" },
    ],
    dimension: "TF",
  },
  {
    id: 65,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "分析问题，寻找最佳解决方案" },
      { value: "F", text: "理解他人感受，寻求共识" },
    ],
    dimension: "TF",
  },
  {
    id: 66,
    question: "在工作中，您更重视：",
    options: [
      { value: "T", text: "完成任务和达成目标" },
      { value: "F", text: "维护良好的工作关系" },
    ],
    dimension: "TF",
  },
  {
    id: 67,
    question: "您更倾向于：",
    options: [
      { value: "T", text: "基于事实和数据做决定" },
      { value: "F", text: "考虑决定对人的影响" },
    ],
    dimension: "TF",
  },

  // J vs P 维度问题 (23题)
  {
    id: 68,
    question: "您更喜欢：",
    options: [
      { value: "J", text: "提前计划并按计划执行" },
      { value: "P", text: "保持灵活，根据情况调整" },
    ],
    dimension: "JP",
  },
  {
    id: 69,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "按时完成任务，避免拖延" },
      { value: "P", text: "在最后期限前完成任务，保持灵活性" },
    ],
    dimension: "JP",
  },
  {
    id: 70,
    question: "您更喜欢的工作环境是：",
    options: [
      { value: "J", text: "有明确的规则和结构" },
      { value: "P", text: "灵活多变，允许即兴发挥" },
    ],
    dimension: "JP",
  },
  {
    id: 71,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "制定详细的计划并遵循" },
      { value: "P", text: "根据情况随机应变" },
    ],
    dimension: "JP",
  },
  {
    id: 72,
    question: "您更喜欢：",
    options: [
      { value: "J", text: "有条理和组织的生活方式" },
      { value: "P", text: "自然流动和灵活的生活方式" },
    ],
    dimension: "JP",
  },
  {
    id: 73,
    question: "在做决定时，您更倾向于：",
    options: [
      { value: "J", text: "尽快做出决定并执行" },
      { value: "P", text: "保持选项开放，等待更多信息" },
    ],
    dimension: "JP",
  },
  {
    id: 74,
    question: "您更喜欢：",
    options: [
      { value: "J", text: "按照既定的时间表和计划行事" },
      { value: "P", text: "根据当下的情况和感受行事" },
    ],
    dimension: "JP",
  },
  {
    id: 75,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "完成一项任务后再开始下一项" },
      { value: "P", text: "同时处理多项任务，根据情况切换" },
    ],
    dimension: "JP",
  },
  {
    id: 76,
    question: "您更喜欢的工作方式是：",
    options: [
      { value: "J", text: "有明确的目标和截止日期" },
      { value: "P", text: "灵活的工作流程，可以随时调整" },
    ],
    dimension: "JP",
  },
  {
    id: 77,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "提前做决定，避免最后一刻的压力" },
      { value: "P", text: "保持选项开放，等待最佳时机" },
    ],
    dimension: "JP",
  },
  {
    id: 78,
    question: "您的工作区域通常是：",
    options: [
      { value: "J", text: "整洁有序，物品摆放有规律" },
      { value: "P", text: "创意性混乱，物品随手可及" },
    ],
    dimension: "JP",
  },
  {
    id: 79,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "按部就班地完成任务" },
      { value: "P", text: "在灵感来临时集中精力工作" },
    ],
    dimension: "JP",
  },
  {
    id: 80,
    question: "您更喜欢：",
    options: [
      { value: "J", text: "有明确的规则和指导方针" },
      { value: "P", text: "灵活的环境，可以自由发挥" },
    ],
    dimension: "JP",
  },
  {
    id: 81,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "提前计划假期和活动" },
      { value: "P", text: "即兴决定和安排活动" },
    ],
    dimension: "JP",
  },
  {
    id: 82,
    question: "您更喜欢：",
    options: [
      { value: "J", text: "有明确的日程安排" },
      { value: "P", text: "根据当天的情况决定" },
    ],
    dimension: "JP",
  },
  {
    id: 83,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "按照计划行事，避免意外" },
      { value: "P", text: "适应变化，享受意外惊喜" },
    ],
    dimension: "JP",
  },
  {
    id: 84,
    question: "您更喜欢的生活方式是：",
    options: [
      { value: "J", text: "有规律和可预测的" },
      { value: "P", text: "自然流动和多变的" },
    ],
    dimension: "JP",
  },
  {
    id: 85,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "提前做好准备，避免匆忙" },
      { value: "P", text: "在最后一刻完成准备，保持灵活性" },
    ],
    dimension: "JP",
  },
  {
    id: 86,
    question: "您更喜欢：",
    options: [
      { value: "J", text: "明确的指导和方向" },
      { value: "P", text: "探索不同的可能性" },
    ],
    dimension: "JP",
  },
  {
    id: 87,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "按照既定的程序和方法工作" },
      { value: "P", text: "根据情况调整工作方法" },
    ],
    dimension: "JP",
  },
  {
    id: 88,
    question: "您更喜欢：",
    options: [
      { value: "J", text: "有明确的目标和计划" },
      { value: "P", text: "保持开放的态度，随机应变" },
    ],
    dimension: "JP",
  },
  {
    id: 89,
    question: "您更倾向于：",
    options: [
      { value: "J", text: "做决定并坚持执行" },
      { value: "P", text: "保持灵活，根据新信息调整" },
    ],
    dimension: "JP",
  },
  {
    id: 90,
    question: "您更喜欢的工作环境是：",
    options: [
      { value: "J", text: "有明确的期望和截止日期" },
      { value: "P", text: "灵活的工作流程和时间安排" },
    ],
    dimension: "JP",
  },
]
