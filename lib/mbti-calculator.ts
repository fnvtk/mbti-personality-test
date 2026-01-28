// MBTI计算器 - 核心算法
// 用于计算测试结果和验证答案

// 维度得分接口
export interface IDimensionScore {
  E: number; // 外向
  I: number; // 内向
  S: number; // 感觉
  N: number; // 直觉
  T: number; // 思考
  F: number; // 情感
  J: number; // 判断
  P: number; // 感知
}

// 测试答案接口
export interface ITestAnswer {
  questionId: number;
  selectedOption: string; // E/I, S/N, T/F, J/P
  dimension: string; // EI, SN, TF, JP
}

// MBTI维度权重配置
interface DimensionWeights {
  EI: { [key: number]: number }; // 问题ID -> 权重
  SN: { [key: number]: number };
  TF: { [key: number]: number };
  JP: { [key: number]: number };
}

// 问题权重配置（核心问题权重更高）
const QUESTION_WEIGHTS: DimensionWeights = {
  EI: {
    // 外向-内向维度的核心问题权重
    1: 1.5, 2: 1.0, 3: 1.2, 4: 1.0, 5: 1.3,
    6: 1.0, 7: 1.1, 8: 1.0, 9: 1.4, 10: 1.0,
    11: 1.2, 12: 1.0, 13: 1.0, 14: 1.1, 15: 1.0,
    16: 1.3, 17: 1.0, 18: 1.0, 19: 1.2, 20: 1.0,
    21: 1.0, 22: 1.1, 23: 1.0
  },
  SN: {
    // 感觉-直觉维度的核心问题权重
    24: 1.4, 25: 1.0, 26: 1.3, 27: 1.0, 28: 1.2,
    29: 1.0, 30: 1.1, 31: 1.0, 32: 1.5, 33: 1.0,
    34: 1.2, 35: 1.0, 36: 1.0, 37: 1.3, 38: 1.0,
    39: 1.1, 40: 1.0, 41: 1.2, 42: 1.0, 43: 1.4,
    44: 1.0, 45: 1.0
  },
  TF: {
    // 思考-情感维度的核心问题权重
    46: 1.5, 47: 1.0, 48: 1.3, 49: 1.0, 50: 1.2,
    51: 1.0, 52: 1.4, 53: 1.0, 54: 1.1, 55: 1.0,
    56: 1.2, 57: 1.0, 58: 1.0, 59: 1.3, 60: 1.0,
    61: 1.1, 62: 1.0, 63: 1.2, 64: 1.0, 65: 1.4,
    66: 1.0, 67: 1.0
  },
  JP: {
    // 判断-感知维度的核心问题权重
    68: 1.4, 69: 1.0, 70: 1.3, 71: 1.0, 72: 1.2,
    73: 1.0, 74: 1.5, 75: 1.0, 76: 1.1, 77: 1.0,
    78: 1.3, 79: 1.0, 80: 1.2, 81: 1.0, 82: 1.1,
    83: 1.0, 84: 1.4, 85: 1.0, 86: 1.0, 87: 1.2,
    88: 1.0, 89: 1.3, 90: 1.0
  }
};

// MBTI类型描述映射
export const MBTI_DESCRIPTIONS = {
  INTJ: { name: '建筑师', category: '分析师' },
  INTP: { name: '逻辑学家', category: '分析师' },
  ENTJ: { name: '指挥官', category: '分析师' },
  ENTP: { name: '辩论家', category: '分析师' },
  INFJ: { name: '提倡者', category: '外交官' },
  INFP: { name: '调停者', category: '外交官' },
  ENFJ: { name: '主人公', category: '外交官' },
  ENFP: { name: '竞选者', category: '外交官' },
  ISTJ: { name: '物流师', category: '守护者' },
  ISFJ: { name: '守卫者', category: '守护者' },
  ESTJ: { name: '总经理', category: '守护者' },
  ESFJ: { name: '执政官', category: '守护者' },
  ISTP: { name: '鉴赏家', category: '探险家' },
  ISFP: { name: '探险家', category: '探险家' },
  ESTP: { name: '企业家', category: '探险家' },
  ESFP: { name: '表演者', category: '探险家' }
};

/**
 * MBTI计算器类
 */
export class MBTICalculator {
  /**
   * 计算维度得分
   * @param answers 测试答案数组
   * @returns 维度得分对象
   */
  static calculateDimensionScores(answers: ITestAnswer[]): IDimensionScore {
    // 初始化得分
    const scores: IDimensionScore = {
      E: 0, I: 0, S: 0, N: 0,
      T: 0, F: 0, J: 0, P: 0
    };
    
    // 初始化权重总和
    const weightSums = {
      EI: 0, SN: 0, TF: 0, JP: 0
    };
    
    // 遍历所有答案
    answers.forEach(answer => {
      const { questionId, selectedOption, dimension } = answer;
      const weight = this.getQuestionWeight(questionId, dimension);
      
      // 累加对应维度的得分和权重
      scores[selectedOption as keyof IDimensionScore] += weight;
      weightSums[dimension as keyof typeof weightSums] += weight;
    });
    
    // 标准化得分到0-100范围
    const normalizedScores: IDimensionScore = {
      E: weightSums.EI > 0 ? Math.round((scores.E / weightSums.EI) * 100) : 50,
      I: weightSums.EI > 0 ? Math.round((scores.I / weightSums.EI) * 100) : 50,
      S: weightSums.SN > 0 ? Math.round((scores.S / weightSums.SN) * 100) : 50,
      N: weightSums.SN > 0 ? Math.round((scores.N / weightSums.SN) * 100) : 50,
      T: weightSums.TF > 0 ? Math.round((scores.T / weightSums.TF) * 100) : 50,
      F: weightSums.TF > 0 ? Math.round((scores.F / weightSums.TF) * 100) : 50,
      J: weightSums.JP > 0 ? Math.round((scores.J / weightSums.JP) * 100) : 50,
      P: weightSums.JP > 0 ? Math.round((scores.P / weightSums.JP) * 100) : 50
    };
    
    return normalizedScores;
  }
  
  /**
   * 根据维度得分确定MBTI类型
   * @param scores 维度得分
   * @returns MBTI类型字符串
   */
  static determineMBTIType(scores: IDimensionScore): string {
    const type = [
      scores.E > scores.I ? 'E' : 'I',
      scores.S > scores.N ? 'S' : 'N',
      scores.T > scores.F ? 'T' : 'F',
      scores.J > scores.P ? 'J' : 'P'
    ].join('');
    
    return type;
  }
  
  /**
   * 计算结果置信度
   * @param scores 维度得分
   * @returns 置信度百分比 (0-100)
   */
  static calculateConfidence(scores: IDimensionScore): number {
    // 计算每个维度的差异程度
    const differences = [
      Math.abs(scores.E - scores.I),
      Math.abs(scores.S - scores.N),
      Math.abs(scores.T - scores.F),
      Math.abs(scores.J - scores.P)
    ];
    
    // 平均差异程度
    const avgDifference = differences.reduce((sum, diff) => sum + diff, 0) / 4;
    
    // 置信度计算：差异越大，置信度越高
    // 最小置信度50%，最大置信度95%
    const confidence = Math.min(95, Math.max(50, 50 + avgDifference * 0.9));
    
    return Math.round(confidence);
  }
  
  /**
   * 获取问题权重
   * @param questionId 问题ID
   * @param dimension 维度
   * @returns 权重值
   */
  private static getQuestionWeight(questionId: number, dimension: string): number {
    const weights = QUESTION_WEIGHTS[dimension as keyof DimensionWeights];
    return weights?.[questionId] || 1.0; // 默认权重为1.0
  }
  
  /**
   * 获取MBTI类型描述
   * @param mbtiType MBTI类型
   * @returns 类型描述对象
   */
  static getMBTIDescription(mbtiType: string) {
    return MBTI_DESCRIPTIONS[mbtiType as keyof typeof MBTI_DESCRIPTIONS] || 
           { name: '未知类型', category: '未分类' };
  }
  
  /**
   * 完整的MBTI计算流程
   * @param answers 测试答案数组
   * @returns 完整的测试结果
   */
  static calculateMBTIResult(answers: ITestAnswer[]) {
    // 计算维度得分
    const dimensionScores = this.calculateDimensionScores(answers);
    
    // 确定MBTI类型
    const mbtiType = this.determineMBTIType(dimensionScores);
    
    // 计算置信度
    const confidence = this.calculateConfidence(dimensionScores);
    
    // 获取类型描述
    const description = this.getMBTIDescription(mbtiType);
    
    return {
      mbtiType,
      dimensionScores,
      confidence,
      description,
      dominantDimensions: {
        energySource: dimensionScores.E > dimensionScores.I ? 'E' : 'I',
        informationGathering: dimensionScores.S > dimensionScores.N ? 'S' : 'N',
        decisionMaking: dimensionScores.T > dimensionScores.F ? 'T' : 'F',
        lifestyle: dimensionScores.J > dimensionScores.P ? 'J' : 'P'
      },
      dimensionStrengths: {
        EI: Math.abs(dimensionScores.E - dimensionScores.I),
        SN: Math.abs(dimensionScores.S - dimensionScores.N),
        TF: Math.abs(dimensionScores.T - dimensionScores.F),
        JP: Math.abs(dimensionScores.J - dimensionScores.P)
      }
    };
  }
  
  /**
   * 验证测试答案的有效性
   * @param answers 测试答案数组
   * @returns 验证结果
   */
  static validateAnswers(answers: ITestAnswer[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // 检查答案数量
    if (answers.length !== 90) {
      errors.push(`答案数量错误：期望90个，实际${answers.length}个`);
    }
    
    // 检查问题ID的完整性
    const questionIds = answers.map(a => a.questionId).sort((a, b) => a - b);
    
    for (let i = 1; i <= 90; i++) {
      if (!questionIds.includes(i)) {
        errors.push(`缺少问题${i}的答案`);
      }
    }
    
    // 检查重复答案
    const duplicates = questionIds.filter((id, index) => questionIds.indexOf(id) !== index);
    if (duplicates.length > 0) {
      errors.push(`存在重复答案：问题${duplicates.join(', ')}`);
    }
    
    // 检查答案选项的有效性
    answers.forEach(answer => {
      if (!['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'].includes(answer.selectedOption)) {
        errors.push(`问题${answer.questionId}的答案选项无效：${answer.selectedOption}`);
      }
      
      if (!['EI', 'SN', 'TF', 'JP'].includes(answer.dimension)) {
        errors.push(`问题${answer.questionId}的维度无效：${answer.dimension}`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  /**
   * 简化版计算（用于前端直接计算）
   * @param answers 简单的答案对象 { questionId: selectedOption }
   * @param questions 题目数组
   * @returns 计算结果
   */
  static calculateFromSimpleAnswers(
    answers: Record<number, string>,
    questions: Array<{ id: number; dimension: string }>
  ) {
    // 转换为标准答案格式
    const standardAnswers: ITestAnswer[] = Object.entries(answers).map(([qId, option]) => {
      const question = questions.find(q => q.id === Number(qId));
      return {
        questionId: Number(qId),
        selectedOption: option,
        dimension: question?.dimension || 'EI'
      };
    });
    
    return this.calculateMBTIResult(standardAnswers);
  }
}

export default MBTICalculator;
