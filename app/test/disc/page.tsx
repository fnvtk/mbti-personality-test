"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"

// DISC测试题目
const discQuestions = [
  {
    id: 1,
    options: [
      { value: "C", text: "富于冒险：愿意面对新事物并敢于下决心掌握的人" },
      { value: "P", text: "适应力强：轻松自如适应任何环境" },
      { value: "S", text: "生动：充满活力，表情生动，多手势" },
      { value: "M", text: "善于分析：喜欢研究各部分之间的逻辑和正确的关系" },
    ],
  },
  {
    id: 2,
    options: [
      { value: "M", text: "坚持不懈：要完成一事才接着做新事" },
      { value: "S", text: "喜好娱乐：开心，充满乐趣与幽默感" },
      { value: "C", text: "善于说服：用逻辑与事实而不用威严和权力服人" },
      { value: "P", text: "平和：在任何冲突中，不受干扰，保存平静" },
    ],
  },
  {
    id: 3,
    options: [
      { value: "P", text: "顺服：以接受他人的观点或喜好，不坚持己见" },
      { value: "M", text: "自我牺牲：为他人利益或家庭责任乐于奉献自己" },
      { value: "S", text: "善于交际：认为与人相处是好玩，是参与的机会，而不是挑战或商业机会" },
      { value: "C", text: "意志坚定：决心依自己的方式做事的人" },
    ],
  },
  {
    id: 4,
    options: [
      { value: "M", text: "体贴：关心别人的感觉与需要" },
      { value: "P", text: "自控性：控制自己的情感，极少流露" },
      { value: "C", text: "竞争性：把一切当成竞赛，总是有强烈的赢的欲望" },
      { value: "S", text: "令人信服：因个人魅力或性格使人信服" },
    ],
  },
  {
    id: 5,
    options: [
      { value: "S", text: "使人振作：给他人清新振奋的刺激" },
      { value: "M", text: "受尊重：对人诚实尊重" },
      { value: "P", text: "含蓄：自我约束情绪与热忱" },
      { value: "C", text: "果断决定：对任何情况都很快做出有效地反应" },
    ],
  },
  {
    id: 6,
    options: [
      { value: "P", text: "满足：容易接受任何情况和环境的人" },
      { value: "M", text: "敏感：对周围的人事过分关心" },
      { value: "C", text: "自立：独立性强，只依靠自己的能力判断与才智" },
      { value: "S", text: "生机勃勃：充满生命力与兴奋" },
    ],
  },
  {
    id: 7,
    options: [
      { value: "M", text: "计划者：为完成工程和目标事前做详尽计划，宁愿依计划进行工作，而不愿执行任务" },
      { value: "P", text: "耐性：不因延误而懊恼，冷静且能容忍" },
      { value: "C", text: "积极：相信自己有转危为安的能力" },
      { value: "S", text: "推动者：动用性格魅力或鼓励别人参予或投资" },
    ],
  },
  {
    id: 8,
    options: [
      { value: "C", text: "肯定：自信，极少犹豫或动摇" },
      { value: "S", text: "无拘无束: 不喜欢预先计划，或受计划牵制，凭感觉行事" },
      { value: "M", text: "按部就班：生活与处事均依照时间表，不喜欢计划被人干扰" },
      { value: "P", text: "羞涩：安静不善于交谈的人" },
    ],
  },
  {
    id: 9,
    options: [
      { value: "M", text: "井井有条：有系统有条理安排事情的人" },
      { value: "P", text: "迁就： 改变自己，使自己与他人协调，短时间内按他人的方式行事" },
      { value: "C", text: "坦率：毫无保留，坦率发言，直来直去" },
      { value: "S", text: "乐观：愉快的性情令自己也令他人愉快" },
    ],
  },
  {
    id: 10,
    options: [
      { value: "S", text: "外向：极易接近的人" },
      { value: "M", text: "乐于助人：无时不刻愿意帮助别人" },
      { value: "P", text: "沉静：不善于发言的人" },
      { value: "C", text: "有远见：有激情，有梦想，有远大目标" },
    ],
  },
  // 添加更多问题...
  {
    id: 11,
    options: [
      { value: "C", text: "勇敢：敢于冒险，勇敢，无所畏惧" },
      { value: "S", text: "可爱：开心，与他相处充满乐趣的人" },
      { value: "P", text: "处交手腕：待人得体有耐性" },
      { value: "M", text: "细节：对事情记忆清晰，做事有条不紊" },
    ],
  },
  {
    id: 12,
    options: [
      { value: "S", text: "令人高兴：一向充满活力，并将快乐感染他人" },
      { value: "P", text: "始终如一：情绪平稳，不易波动，如人所料" },
      { value: "M", text: "文化修养：对学术、艺术特别爱好，如戏剧、交响乐、芭蕾舞等" },
      { value: "C", text: "自信：确信自己个人能力，可以取得成功" },
    ],
  },
  {
    id: 13,
    options: [
      { value: "M", text: "理想主义：以自己完美的标准来设想衡量事情" },
      { value: "C", text: "独立：自给自足，自己生活，自信，无需他人帮助" },
      { value: "P", text: "无攻击性：从不说或作引起别人不满和反对的事" },
      { value: "S", text: "激励性：鼓励别人参与、加入并能使每件事变得有趣" },
    ],
  },
  {
    id: 14,
    options: [
      { value: "S", text: "感情外露：从不掩饰自己的情感、喜欢，与人交谈时常身不由己地接触他人" },
      { value: "C", text: "果断：有很快做出判断与结论的能力" },
      { value: "P", text: "尖刻幽默：谈话中，时而说出一句出人意料的幽默" },
      { value: "M", text: "深沉：深刻并常常内省，对肤浅的交谈、消遣感到厌倦" },
    ],
  },
  {
    id: 15,
    options: [
      { value: "P", text: "调解者：经常居中调解不同的意见，以避免双方冲突" },
      { value: "M", text: "音乐性: 爱好参与并有较深的鉴赏力，因音乐的艺术性，而不单是为表演的乐趣" },
      { value: "C", text: "发起者：被高效率的需要所推动，是别人跟随的领导者，闲不住" },
      { value: "S", text: "喜交朋友：喜好周旋于宴会中，喜欢结交新朋友，不把任何人当作陌生人" },
    ],
  },
  // 添加更多问题...
  {
    id: 16,
    options: [
      { value: "M", text: "考虑周到：善解人意，能记住特别的日子，不吝于帮助别人" },
      { value: "C", text: "执着：不达到目的决不罢休" },
      { value: "S", text: "多言：不断地说话，讲笑娱乐周围人，觉得应避免沉默和他人尴尬" },
      { value: "P", text: "容忍：易接受别人的想法或做法，不愿反对或改变他人" },
    ],
  },
  {
    id: 17,
    options: [
      { value: "P", text: "聆听者：愿意听别人倾诉" },
      { value: "M", text: "忠心：对自己的理想、朋友、工作都绝对忠实，有时甚至无需任何理由" },
      { value: "C", text: "领导者：天生的带领者，不相信别人的工作能力比得上自己" },
      { value: "S", text: "活力充沛：充满活力，精力充沛，积极向上" },
    ],
  },
  {
    id: 18,
    options: [
      { value: "P", text: "知足：认为所拥有的都是最好的，不常羡慕别人" },
      { value: "M", text: "规划：为将来做计划，明确的目标，稳重的步骤" },
      { value: "C", text: "竞争：富有竞争力，以胜利为荣" },
      { value: "S", text: "快乐：乐观，不担忧，不轻易失去信心" },
    ],
  },
  {
    id: 19,
    options: [
      { value: "M", text: "反应迅速：思路敏捷，反应快" },
      { value: "P", text: "平衡：不太激动也不太冷淡" },
      { value: "S", text: "开放：不怕表露自己的无知或错误" },
      { value: "C", text: "热情：对所有事物都充满热情" },
    ],
  },
  {
    id: 20,
    options: [
      { value: "S", text: "风度翩翩：优雅，风度非凡" },
      { value: "C", text: "精干：事实求是，不浪费时间" },
      { value: "M", text: "独立思考：独立分析问题，不依赖他人的看法" },
      { value: "P", text: "谦逊：不爱炫耀，不喜欢使别人觉得不舒服" },
    ],
  },
  // 负面特质问题
  {
    id: 21,
    options: [
      { value: "P", text: "乏味：面上极少流露表情或情绪" },
      { value: "M", text: "扭捏：躲避别人的注意力，不想成为注意中心" },
      { value: "S", text: "露骨：好表现，华而不实，声音大" },
      { value: "C", text: "专横：喜命令支配，有时略傲慢" },
    ],
  },
  {
    id: 22,
    options: [
      { value: "S", text: "散漫：生活任性无秩序" },
      { value: "C", text: "无同情心：不易理解别人的问题与麻烦" },
      { value: "P", text: "缺乏热情：不易兴奋，经常感到喜事难成" },
      { value: "M", text: "不宽恕：不易宽恕或忘记别人对自己的伤害，易妒忌" },
    ],
  },
  {
    id: 23,
    options: [
      { value: "P", text: "保留：不愿意参与，尤其当事物复杂时" },
      { value: "M", text: "怨恨：把实际或自己想象的别人的冒犯经常放在心中" },
      { value: "C", text: "逆反：抗拒，犹豫或不接受别人的方法，固执己见" },
      { value: "S", text: "唠叨：重复讲同一件事或故事，忘记自己已经重复多次，总是不断找题材说话" },
    ],
  },
  {
    id: 24,
    options: [
      { value: "M", text: "挑剔：坚持琐事细节，注意细节" },
      { value: "P", text: "胆小：经常感到强烈的担心、焦虑、悲戚" },
      { value: "S", text: "健忘：由于缺乏自我约束，导致健忘，不愿总记无趣的事" },
      { value: "C", text: "率直：直言不讳，不介意把自己的看法直接表露出来" },
    ],
  },
  {
    id: 25,
    options: [
      { value: "C", text: "急躁：难以忍受等待别人" },
      { value: "M", text: "无安全感：感到担心且无自信心" },
      { value: "P", text: "优柔寡断：很难下定决心" },
      { value: "S", text: "好插嘴：是一个滔滔不绝的发言者，不是好听众，不留意别人也在讲话" },
    ],
  },
  // 添加更多问题...
  {
    id: 26,
    options: [
      { value: "M", text: "不受欢迎：由于强烈要求完美，而拒人于千里之外" },
      { value: "P", text: "不合群：不愿倾听，对别人的生活不感兴趣" },
      { value: "S", text: "难预测：时而兴奋，时而低落，或总是不能兑现其诺" },
      { value: "C", text: "不善表达：很难用语言或动作当众表达感情" },
    ],
  },
  {
    id: 27,
    options: [
      { value: "C", text: "固执：坚持依自己的意见行事" },
      { value: "S", text: "即兴：做事从无一贯性" },
      { value: "M", text: "难于取悦：因要求太高而使别人很难取悦" },
      { value: "P", text: "犹豫不决：迟迟才有行动，不易参与" },
    ],
  },
  {
    id: 28,
    options: [
      { value: "P", text: "平凡：中间性格，无高低之分，很少表露感情" },
      { value: "M", text: "悲观：尽管期待最好的但往往首先看到事情的不利之处" },
      { value: "C", text: "自负：自我评价高，认为自己是最好的人选" },
      { value: "S", text: "放任：由于不愿意承担责任，而对自己或别人的过失多找借口" },
    ],
  },
  {
    id: 29,
    options: [
      { value: "S", text: "易怒：对一点小事就大发雷霆，无法容忍" },
      { value: "P", text: "忧郁：经常因小事而苦恼，容易受伤" },
      { value: "C", text: "多疑：总是在计较别人是否足够尊重自己" },
      { value: "M", text: "犹豫：经常犹豫不决，难以作出决定" },
    ],
  },
  {
    id: 30,
    options: [
      { value: "S", text: "容易分心：不能集中注意力，不能完成任务" },
      { value: "P", text: "矛盾：表面与实际不一致，很难了解" },
      { value: "M", text: "不愿参与：感到自己不受欢迎，尽量避免社交活动" },
      { value: "C", text: "无礼：行为鲁莽，不顾别人的感受" },
    ],
  },
  // 添加更多问题...
  {
    id: 31,
    options: [
      { value: "P", text: "担忧：时时感到不确定、焦虑、心烦" },
      { value: "M", text: "不善交际：感到需要大量时间独处" },
      { value: "C", text: "工作狂：为了回报或成就感，而不是为了完美，高立雄伟目标，不断工作耻于休息" },
      { value: "S", text: "虚荣：需要旁人认同、赞赏，就如同演绎家要观众的掌声、笑声与接受" },
    ],
  },
  {
    id: 32,
    options: [
      { value: "M", text: "过分敏感：对事情过分反应，被人误解时感到冒犯" },
      { value: "C", text: "不圆滑老练：经常用冒犯或没考虑周到的方式表达自己" },
      { value: "P", text: "胆怯：遇到困难退缩" },
      { value: "S", text: "喋喋不休：难以自控，滔滔不绝，不能倾听别人" },
    ],
  },
  {
    id: 33,
    options: [
      { value: "P", text: "多疑：事事不确定，又对所做之事缺乏信心" },
      { value: "S", text: "生活紊乱：缺乏安排生活井井有条的能力" },
      { value: "C", text: "跋扈：冲动地控制事情或别人，指挥他人" },
      { value: "M", text: "抑郁：常情绪低落的人" },
    ],
  },
  {
    id: 34,
    options: [
      { value: "S", text: "反复：反复无常，互相矛盾，情绪与行动不和逻辑" },
      { value: "M", text: "内向：思想与兴趣放在心里，活在自己的世界里" },
      { value: "C", text: "排斥异己：不能忍受他人的态度、观点、做事的方式" },
      { value: "P", text: "无异议：对多数事情均漠不关心的人" },
    ],
  },
  {
    id: 35,
    options: [
      { value: "S", text: "杂乱无章：生活环境无秩序，经常找不到东西" },
      { value: "M", text: "情绪化：情绪不易高涨，当感到不被欣赏时很容易低落" },
      { value: "P", text: "言语不清：低声说话，不在乎说不清楚" },
      { value: "C", text: "喜操纵：精明处事，操纵事情，使自己得利" },
    ],
  },
  // 添加更多问题...
  {
    id: 36,
    options: [
      { value: "P", text: "缓慢：行动思想均比较慢，过分麻烦" },
      { value: "C", text: "顽固：决心依自己的意愿行事，不易被说服" },
      { value: "S", text: "好表现：要吸引人需要自己成为别人注意的中心" },
      { value: "M", text: "怀疑：不易相信别人，对所有语言背后真正的动机存有疑问" },
    ],
  },
  {
    id: 37,
    options: [
      { value: "M", text: "孤僻：需要大量时间独处，避开人群" },
      { value: "C", text: "统治欲：毫不犹豫地表现自己正确的控制能力" },
      { value: "P", text: "懒惰：总是先估量做每一件事要耗费多少精力" },
      { value: "S", text: "大嗓门：说话声与笑声总是盖过他人" },
    ],
  },
  {
    id: 38,
    options: [
      { value: "P", text: "拖延：凡事起步慢，需要推动力" },
      { value: "M", text: "多疑：凡事怀疑，不相信别人" },
      { value: "C", text: "易怒：当别人行动不够快，不能完成指定的工作时，易感到不耐烦或愤怒" },
      { value: "S", text: "善变：轻易改变决定或态度" },
    ],
  },
  {
    id: 39,
    options: [
      { value: "S", text: "喜欢炫耀：喜欢让人注目，炫耀自己" },
      { value: "P", text: "消极：少有积极的动机和态度" },
      { value: "M", text: "爱批评：总是找出事情的不是，而且要表达出来" },
      { value: "C", text: "过度自信：对自己的判断和能力过于有信心，有时显得傲慢" },
    ],
  },
  {
    id: 40,
    options: [
      { value: "C", text: "轻率：决定事情时，不考虑可能的困难与后果" },
      { value: "P", text: "害羞：在人前感到不自然和局促不安" },
      { value: "S", text: "任性：缺乏自制力，做事先不考虑，喜欢随自己高兴行事" },
      { value: "M", text: "挑剔：找毛病和错处，很难让其满意" },
    ],
  },
]

// 性格类型描述
const personalityDescriptions = {
  M: {
    name: "完美型",
    description: "追求完美，注重细节，有条理，善于分析，追求高标准。",
    strengths: ["有条理", "注重细节", "追求高标准", "分析能力强", "忠诚"],
    weaknesses: ["过分挑剔", "优柔寡断", "容易忧虑", "过度敏感", "完美主义"],
  },
  P: {
    name: "和平型",
    description: "平和，适应力强，善于倾听，避免冲突，稳定可靠。",
    strengths: ["平和", "适应力强", "善于倾听", "忍耐", "稳定"],
    weaknesses: ["优柔寡断", "缺乏热情", "拖延", "被动", "固执"],
  },
  C: {
    name: "力量型",
    description: "果断，有领导力，目标导向，自信，有竞争力。",
    strengths: ["果断", "领导力", "目标导向", "自信", "有远见"],
    weaknesses: ["专横", "急躁", "缺乏同理心", "自负", "固执"],
  },
  S: {
    name: "活跃型",
    description: "外向，热情，善于交际，乐观，充满活力。",
    strengths: ["外向", "热情", "善于交际", "乐观", "有感染力"],
    weaknesses: ["健忘", "散漫", "喋喋不休", "情绪化", "注意力不集中"],
  },
}

export default function DISCTestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(20 * 60) // 20分钟倒计时
  const [results, setResults] = useState<Record<string, number> | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  // 倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          calculateResults()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // 处理选择答案
  const handleAnswer = (questionId: number, value: string) => {
    setSelectedOption(value)

    // 延迟一小段时间后保存答案并前进到下一题
    setTimeout(() => {
      const newAnswers = { ...answers, [questionId]: value }
      setAnswers(newAnswers)

      if (currentQuestion < discQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedOption(null)
      } else {
        // 最后一题，计算结果
        calculateResults(newAnswers)
      }
    }, 300)
  }

  // 计算测试结果
  const calculateResults = (finalAnswers?: Record<number, string>) => {
    const answersToCalculate = finalAnswers || answers
    const counts = { M: 0, P: 0, C: 0, S: 0 }

    // 统计每种类型的答案数量
    Object.values(answersToCalculate).forEach((value) => {
      if (value in counts) {
        counts[value as keyof typeof counts]++
      }
    })

    setResults(counts)

    // 保存结果到本地存储
    const discResult = {
      scores: counts,
      primary: getHighestType(counts),
      secondary: getSecondHighestType(counts),
    }

    localStorage.setItem("discResult", JSON.stringify(discResult))

    // 导航到结果页面
    router.push("/disc-result")
  }

  // 获取得分最高的类型
  const getHighestType = (counts: Record<string, number>) => {
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  }

  // 获取得分第二高的类型
  const getSecondHighestType = (counts: Record<string, number>) => {
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[1][0]
  }

  // 计算进度
  const progress = ((currentQuestion + 1) / discQuestions.length) * 100

  // 格式化剩余时间
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  // 如果已经计算出结果，显示加载中
  if (results) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-gray-600">正在生成您的DISC性格分析报告...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col bg-white">
      <div className="p-4 flex items-center border-b">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="flex-1 text-center text-lg font-medium mr-10">DISC性格测试</h1>
      </div>

      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            问题 {currentQuestion + 1}/{discQuestions.length}
          </span>
          <span className="text-sm text-gray-500">剩余时间: {formatTime(timeRemaining)}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-6">请选择最符合您的选项：</h2>
          <div className="space-y-4">
            {discQuestions[currentQuestion].options.map((option, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 border p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedOption === option.value ? "bg-purple-100 border-purple-300" : "hover:bg-purple-50"
                }`}
                onClick={() => handleAnswer(discQuestions[currentQuestion].id, option.value)}
              >
                <div
                  className={`w-4 h-4 rounded-full border ${
                    selectedOption === option.value ? "bg-purple-600 border-purple-600" : "border-gray-300"
                  }`}
                >
                  {selectedOption === option.value && <div className="w-2 h-2 bg-white rounded-full m-auto mt-1"></div>}
                </div>
                <Label className="flex-1 cursor-pointer">{option.text}</Label>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1)
                setSelectedOption(answers[discQuestions[currentQuestion - 1].id] || null)
              }
            }}
            disabled={currentQuestion === 0}
          >
            上一题
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (currentQuestion < discQuestions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
                setSelectedOption(answers[discQuestions[currentQuestion + 1].id] || null)
              }
            }}
            disabled={currentQuestion === discQuestions.length - 1}
          >
            跳过
          </Button>
        </div>
      </div>
    </div>
  )
}
