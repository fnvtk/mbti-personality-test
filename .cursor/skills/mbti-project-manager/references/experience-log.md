# 灵犀 · 经验沉淀日志

> 每次开发中踩坑/解决问题/发现最佳实践 → 记录于此
> 下次遇到类似问题 → **先查本文件**
> 上限 50 条，超过则整合相似条目

---

## 经验条目

### 2026-02-10 | Skill 初始化

**问题**：MBTI 项目缺乏统一的开发入口和项目管理机制

**解决方案**：创建「灵犀」Skill 作为项目管理中枢
- SKILL.md 作为唯一开发入口（<500行）
- 8个 references 文档按需加载（技术栈/API/部署/支付/代码/进度/经验/页面）
- 3个脚本工具（小程序部署/环境检查/数据同步）
- 吸收卡若AI核心能力：执行流程、经验沉淀、风险管理、复盘总结

**关键步骤**：
1. 探索项目完整结构（50+页面/15+API/13小程序页面）
2. 读取现有开发文档核心内容（微信支付/MBTI算法/AI功能/开发计划）
3. 学习卡若AI 75 Skill 体系的执行流程和经验沉淀机制
4. 创建 SKILL.md + 8个references + 3个scripts

**经验**：
- Skill 主文件控制在 500 行以内，详细内容放 references
- 飞书文档需登录认证，WebFetch 无法直接抓取
- 项目进度文档需要每次对话结束时更新

---

### 2026-02-10 | 第二期需求整合

**问题**：飞书需求文档需要整合到灵犀 Skill 中，作为强制开发方向

**解决方案**：
- 飞书文档直接抓取失败（需登录认证），改为用户手动提供内容
- 将需求文档写入 `feishu-requirements.md`，标记为**强制遵循**
- 全面更新 SKILL.md（新增定价体系、企业版模块、用户转化链路）
- 更新 project-progress.md（从8项任务扩展到33项，按P0/P1/P2分级）
- 更新 wechat-payment.md（新定价¥198/¥1,980/企业版三套餐，废弃旧定价）
- 更新 api-routes.md（新增企业/简历/定价/超管/存客宝共12个新接口）
- 更新 pages-map.md（新增4个页面 + 修改3个现有页面）

**经验**：
- 需求变更时，必须同时更新 SKILL.md + 所有相关 references，保持一致性
- 定价体系变更需要明确标注旧定价为「已废弃」，避免混淆
- 飞书文档无法自动抓取，需走手动流程

---

### 2026-02-10 | 超管 AI 服务商配置管理

**问题**：需要在超级管理后台集中管理多个 AI 服务商（GPT/Claude/DeepSeek/Kimi/Groq/Coze 等）的 API 配置，并支持实时余额查询和告警通知

**解决方案**：
- 创建 `/api/superadmin/ai-config` API（GET/POST），服务端 JSON 文件存储配置，API Key 脱敏处理
- 创建 `/api/superadmin/ai-balance` API（POST），支持 OpenAI/DeepSeek/Moonshot 真实余额查询，其他服务商验证 Key 有效性
- 创建 `/superadmin/ai-config/page.tsx` 管理页面，8 家 AI 服务商卡片式管理
- 更新 `lib/config.ts` 新增 `getAIProviderConfig()` 和 `getEnabledAIProviders()` 动态读取
- 更新超管导航布局新增 "AI 服务配置" 入口

**关键步骤**：
1. 定义 AI 服务商配置数据结构（AIProviderConfig 接口）
2. 各服务商余额查询 API 适配（OpenAI 用 billing API、DeepSeek 用 /user/balance、Moonshot 用 /users/me/balance）
3. 前端使用 Card + Switch + Badge 组合，支持展开/收起高级配置
4. 余额告警通过阈值比较实现，低于阈值时在页面顶部显示 Alert
5. 配置存储在 `data/ai-providers-config.json`，服务端读写，避免 localStorage 安全风险

**经验**：
- AI 服务商余额查询 API 各不相同，需要逐一适配；Anthropic/Coze/通义千问/智谱暂无公开余额 API
- API Key 脱敏显示（前4后4）+ 服务端存储 = 安全性与易用性的平衡
- 使用文件存储而非数据库，简化部署但限制了并发写入能力（后续可迁移到数据库）
- Groq 是免费服务商，默认开启，无需余额告警

---

<!-- 模板：复制此块新增条目
### YYYY-MM-DD | 标题

**问题**：描述遇到的问题

**解决方案**：如何解决的
- 步骤1
- 步骤2

**经验**：一句话总结可复用的经验
-->
