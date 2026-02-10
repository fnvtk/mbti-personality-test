// AI分析服务工具函数（已移除Coze依赖）

// 获取AI分析的模拟结果
export function getMockAnalysisResult() {
  return {
    overview: "基于面部特征分析，结合《冰鉴》骨形学和面相五官分析，您展现出外向、善于思考的特质，具有较强的领导能力和决策力。",
    mbti: {
      type: "ENTJ",
      title: "指挥官型人格",
      dimensions: {
        energy: "外向(E) - 从外部世界获取能量，喜欢社交互动",
        information: "直觉(N) - 关注可能性和未来，善于发现模式和联系",
        decisions: "思考(T) - 基于逻辑和客观分析做决定，注重效率",
        lifestyle: "判断(J) - 喜欢计划和组织，追求确定性和结构",
      },
    },
    pdp: {
      primary: "老虎",
      secondary: "孔雀",
      description: "主导型为老虎型，表现为果断、直接、目标导向；辅助型为孔雀型，增添了表达能力和社交魅力。",
    },
    disc: {
      primary: "D型(力量型)",
      secondary: "I型(活跃型)",
      description: "沟通风格以力量型(D)为主，表现为直接、果断、结果导向；辅以活跃型(I)特质，增强了表达能力和说服力。",
    },
    gallup: {
      top3: ["战略", "统率", "成就"],
      description: "盖洛普前三大优势为战略思维、统率力和成就驱动。"
    },
    faceAnalysis: {
      forehead: "额头饱满宽阔，《冰鉴》言'天庭饱满'主智慧，善于战略思考。",
      eyes: "目光清澈有神，眼距适中，洞察力强，善于观察细节。",
      ears: "耳朵轮廓分明，耳垂丰厚，主福禄寿全。",
      nose: "鼻梁挺直，山根高耸，财运亨通，决策能力强。",
      mouth: "嘴唇适中，轮廓清晰，言语表达客观冷静。",
      chin: "下巴轮廓清晰，方正有力，晚年运势佳，具有领导力。",
      boneStructure: "颧骨高耸有力，伏犀骨显露，主大格局。将军骨饱满，具有统帅之才。"
    },
    facialExpressions: {
      overall: "整体面部表情显示出自信、坚定，同时带有一定的亲和力。",
      emotions: ["自信", "专注", "亲和"],
    },
    resultId: `result_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
  }
}

// 提取MBTI类型
export function extractMBTIType(text: string): string | null {
  const mbtiTypes = [
    "INTJ", "INTP", "ENTJ", "ENTP",
    "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ",
    "ISTP", "ISFP", "ESTP", "ESFP",
  ]
  for (const type of mbtiTypes) {
    if (text.includes(type)) return type
  }
  return null
}

// MBTI类型中文名称
export function getMBTITitle(type: string): string {
  const titles: Record<string, string> = {
    ENFJ: "教导者", ENFP: "冒险家", ENTJ: "指挥官", ENTP: "辩论家",
    ESFJ: "执政官", ESFP: "表演者", ESTJ: "总经理", ESTP: "企业家",
    INFJ: "提倡者", INFP: "调停者", INTJ: "建筑师", INTP: "逻辑学家",
    ISFJ: "守卫者", ISFP: "探险家", ISTJ: "物流师", ISTP: "鉴赏家",
  }
  return titles[type] || "未知类型"
}
