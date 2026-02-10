# 部署详细流程

## 一、Web端部署（Vercel）

### 自动部署
1. 代码推送到 `main` 分支
2. Vercel 自动检测并触发构建
3. 构建命令：`npm install --no-optional && next build`
4. 部署完成后自动更新 `ai-pandora.xyz`

### 手动部署
```bash
cd /Users/karuo/Documents/开发/3、自营项目/MBTI
vercel --prod
```

### 环境变量配置
在 Vercel Dashboard → Settings → Environment Variables 中配置：
- `MONGODB_URI`
- `JWT_SECRET`
- `GROQ_API_KEY`
- `COZE_API_KEY`
- `COZE_BOT_ID`
- `BLOB_READ_WRITE_TOKEN`
- `POSTGRES_URL`（Neon PostgreSQL）

### vercel.json 配置
```json
{
  "builds": [{
    "src": "package.json",
    "use": "@vercel/next",
    "config": {
      "installCommand": "npm install --no-optional --no-package-lock --omit=optional"
    }
  }],
  "build": {
    "env": {
      "NPM_FLAGS": "--no-optional --no-package-lock --omit=optional"
    }
  }
}
```

---

## 二、小程序部署

### 方式1：微信开发者工具 CLI
```bash
/Applications/wechatwebdevtools.app/Contents/MacOS/cli upload \
  --project "/Users/karuo/Documents/开发/3、自营项目/MBTI/miniprogram" \
  -v "1.0.0" \
  -d "版本描述"
```

### 方式2：miniprogram-ci（需私钥）
```bash
cd /Users/karuo/Documents/开发/3、自营项目/MBTI/miniprogram
./upload.sh
```

需要私钥文件 `private.wx3d15ed02e98b04e3.key`，获取方式：
1. 登录 https://mp.weixin.qq.com
2. 开发 → 开发管理 → 开发设置
3. 小程序代码上传 → 生成密钥

### 方式3：本 Skill 部署脚本
```bash
bash /Users/karuo/Documents/开发/3、自营项目/MBTI/.cursor/skills/mbti-project-manager/scripts/deploy-miniprogram.sh "1.0.0" "版本描述"
```

### 上传后操作
1. 打开 https://mp.weixin.qq.com
2. 版本管理 → 开发版本
3. 设为体验版 → 测试通过后提交审核
4. 审核通过 → 发布上线

---

## 三、数据库部署

### PostgreSQL (Neon) - 生产环境
- 控制台：https://console.neon.tech
- 连接串在 `lib/config.ts` 或 Vercel 环境变量
- 表结构变更通过 API 路由 `/api/init-db` 执行

### MongoDB - 开发环境
```bash
# 确认 MongoDB 运行中
brew services list | grep mongodb
# 或
mongosh --eval "db.serverStatus().host"

# 连接开发数据库
mongosh mongodb://localhost:27017/mbti_test
```

---

## 四、完整部署检查清单

```
□ Web端
  □ 代码已推送到 main 分支
  □ Vercel 构建成功（检查 Dashboard）
  □ 环境变量已配置
  □ API 接口测试通过（/api/database/connect）
  □ 域名 ai-pandora.xyz 可访问

□ 小程序
  □ 代码已上传到微信平台
  □ 体验版测试通过
  □ API 域名已配置（ai-pandora.xyz）
  □ 提交审核（若正式发布）

□ 数据库
  □ PostgreSQL 连接正常
  □ 数据表/集合已初始化
  □ 索引已创建
```
