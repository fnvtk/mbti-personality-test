import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 题库文件路径
const DATA_DIR = path.join(process.cwd(), 'data')

// 题库文件映射
const QUESTION_FILES: Record<string, string> = {
  mbti: 'mbti-questions.ts',
  disc: 'disc-questions.ts',
  pdp: 'pdp-questions.ts',
}

// 解析 TypeScript 导出文件为 JSON 数据
function parseQuestionFile(filePath: string, testType: string): any[] {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')

    // 提取数组部分（匹配 export const xxxQuestions = [...]）
    const arrayMatch = content.match(/export\s+const\s+\w+[Qq]uestions\s*(?::\s*\w+\[\])?\s*=\s*(\[[\s\S]*?\n\])/m)
    if (!arrayMatch) return []

    let arrayStr = arrayMatch[1]

    // 清理 TypeScript 语法为合法 JSON
    // 移除注释
    arrayStr = arrayStr.replace(/\/\/.*$/gm, '')
    arrayStr = arrayStr.replace(/\/\*[\s\S]*?\*\//g, '')
    // 处理尾逗号
    arrayStr = arrayStr.replace(/,(\s*[\]}])/g, '$1')
    // key不带引号的转为带引号
    arrayStr = arrayStr.replace(/(\s)(\w+)(\s*:)/g, '$1"$2"$3')
    // 单引号转双引号（简单处理）
    arrayStr = arrayStr.replace(/'/g, '"')
    // 移除 as const 等 TypeScript 语法
    arrayStr = arrayStr.replace(/\s+as\s+\w+/g, '')

    const questions = JSON.parse(arrayStr)
    return questions
  } catch (error) {
    console.error(`解析题库文件失败 [${testType}]:`, error)
    return []
  }
}

// 验证题目数据结构
function validateQuestions(questions: any[], testType: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  if (!Array.isArray(questions) || questions.length === 0) {
    errors.push('题目数据为空或格式不正确')
    return { valid: false, errors, warnings }
  }

  // 验证每道题
  questions.forEach((q, index) => {
    if (!q.id && q.id !== 0) errors.push(`第${index + 1}题缺少 id 字段`)
    if (!q.question || typeof q.question !== 'string') errors.push(`第${index + 1}题缺少 question 文本`)
    if (!Array.isArray(q.options) || q.options.length < 2) errors.push(`第${index + 1}题选项不足（至少2个）`)

    // 验证选项
    if (Array.isArray(q.options)) {
      q.options.forEach((opt: any, optIdx: number) => {
        if (!opt.value) errors.push(`第${index + 1}题第${optIdx + 1}个选项缺少 value`)
        if (!opt.text) errors.push(`第${index + 1}题第${optIdx + 1}个选项缺少 text`)
      })
    }

    // MBTI 特有验证
    if (testType === 'mbti') {
      if (!q.dimension) warnings.push(`第${index + 1}题缺少 dimension 维度标记`)
      else if (!['EI', 'SN', 'TF', 'JP'].includes(q.dimension)) {
        errors.push(`第${index + 1}题 dimension 值无效: ${q.dimension}`)
      }
    }
  })

  // 检查 ID 唯一性
  const ids = questions.map(q => q.id)
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
  if (duplicateIds.length > 0) {
    errors.push(`发现重复的题目 ID: ${[...new Set(duplicateIds)].join(', ')}`)
  }

  // MBTI 维度覆盖检查
  if (testType === 'mbti') {
    const dimensions = new Set(questions.map(q => q.dimension).filter(Boolean))
    const required = ['EI', 'SN', 'TF', 'JP']
    required.forEach(d => {
      if (!dimensions.has(d)) warnings.push(`缺少 ${d} 维度的题目`)
    })
    // 统计各维度题数
    const dimCounts: Record<string, number> = {}
    questions.forEach(q => {
      if (q.dimension) dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1
    })
    Object.entries(dimCounts).forEach(([dim, count]) => {
      if (count < 5) warnings.push(`${dim} 维度仅有 ${count} 题，建议至少 10 题`)
    })
  }

  return { valid: errors.length === 0, errors, warnings }
}

// GET: 获取题库数据和统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get('type') || 'all'

    const result: Record<string, any> = {}

    const types = testType === 'all' ? ['mbti', 'disc', 'pdp'] : [testType]

    for (const type of types) {
      const fileName = QUESTION_FILES[type]
      if (!fileName) continue

      const filePath = path.join(DATA_DIR, fileName)
      if (!fs.existsSync(filePath)) {
        result[type] = { questions: [], count: 0, error: '题库文件不存在' }
        continue
      }

      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const questions = parseQuestionFile(filePath, type)
      const validation = validateQuestions(questions, type)

      // MBTI 维度统计
      let dimensionStats: Record<string, number> | undefined
      if (type === 'mbti') {
        dimensionStats = {}
        questions.forEach(q => {
          if (q.dimension) dimensionStats![q.dimension] = (dimensionStats![q.dimension] || 0) + 1
        })
      }

      // DISC 选项统计
      let optionStats: Record<string, number> | undefined
      if (type === 'disc' || type === 'pdp') {
        optionStats = {}
        questions.forEach(q => {
          if (Array.isArray(q.options)) {
            q.options.forEach((opt: any) => {
              optionStats![opt.value] = (optionStats![opt.value] || 0) + 1
            })
          }
        })
      }

      result[type] = {
        questions,
        count: questions.length,
        validation,
        dimensionStats,
        optionStats,
        fileSize: Buffer.byteLength(fileContent, 'utf8'),
        lastModified: fs.statSync(filePath).mtime.toISOString(),
      }
    }

    return NextResponse.json({ code: 200, data: result })
  } catch (error: any) {
    return NextResponse.json({ code: 500, message: '获取题库失败: ' + error.message }, { status: 500 })
  }
}

// POST: 导入题目数据
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { testType, questions, action } = body

    if (!testType || !QUESTION_FILES[testType]) {
      return NextResponse.json({ code: 400, message: '无效的测试类型' }, { status: 400 })
    }

    // 验证操作
    if (action === 'validate') {
      const validation = validateQuestions(questions, testType)
      return NextResponse.json({ code: 200, data: { validation } })
    }

    // 导入操作
    if (action === 'import') {
      if (!Array.isArray(questions) || questions.length === 0) {
        return NextResponse.json({ code: 400, message: '题目数据为空' }, { status: 400 })
      }

      // 先验证
      const validation = validateQuestions(questions, testType)
      if (!validation.valid) {
        return NextResponse.json({
          code: 400,
          message: '题目数据验证失败',
          data: { validation }
        }, { status: 400 })
      }

      // 备份原文件
      const fileName = QUESTION_FILES[testType]
      const filePath = path.join(DATA_DIR, fileName)
      if (fs.existsSync(filePath)) {
        const backupPath = path.join(DATA_DIR, `${fileName}.backup.${Date.now()}`)
        fs.copyFileSync(filePath, backupPath)
      }

      // 生成新的 TypeScript 文件内容
      const typeMap: Record<string, string> = {
        mbti: 'mbtiQuestions',
        disc: 'discQuestions',
        pdp: 'pdpQuestions',
      }
      const varName = typeMap[testType]

      // 接口定义
      let interfaceStr = ''
      if (testType === 'mbti') {
        interfaceStr = `export interface MBTIQuestion {\n  id: number\n  question: string\n  options: { value: string; text: string }[]\n  dimension: "EI" | "SN" | "TF" | "JP"\n}\n\n`
      } else if (testType === 'disc') {
        interfaceStr = `export interface DISCQuestion {\n  id: number\n  question: string\n  options: { value: string; text: string }[]\n}\n\n`
      } else {
        interfaceStr = `export interface PDPQuestion {\n  id: number\n  question: string\n  options: { value: string; text: string }[]\n}\n\n`
      }

      const questionsJson = JSON.stringify(questions, null, 2)
        // 将 JSON 格式的 key 双引号去掉变成 TS 风格
        .replace(/"(\w+)":/g, '$1:')

      const fileContent = `// ${testType.toUpperCase()} 测试题库\n// 自动生成于 ${new Date().toLocaleString('zh-CN')}\n// 题目数: ${questions.length}\n\n${interfaceStr}export const ${varName}: ${interfaceStr ? (testType === 'mbti' ? 'MBTIQuestion' : testType === 'disc' ? 'DISCQuestion' : 'PDPQuestion') + '[]' : 'any[]'} = ${questionsJson}\n`

      fs.writeFileSync(filePath, fileContent, 'utf-8')

      return NextResponse.json({
        code: 200,
        message: `${testType.toUpperCase()} 题库导入成功，共 ${questions.length} 题`,
        data: {
          count: questions.length,
          validation,
        }
      })
    }

    return NextResponse.json({ code: 400, message: '未知操作' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ code: 500, message: '操作失败: ' + error.message }, { status: 500 })
  }
}
