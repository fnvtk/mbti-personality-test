import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置文件
 * 用于超管 AI 配置页面的自动化测试
 */
export default defineConfig({
  // 测试目录
  testDir: './',
  
  // 测试文件匹配模式
  testMatch: '**/*.spec.ts',
  
  // 全局超时设置
  timeout: 60000, // 单个测试 60 秒超时
  
  // 断言超时
  expect: {
    timeout: 10000 // 断言 10 秒超时
  },
  
  // 失败时的重试次数
  retries: 0, // 首次运行不重试，便于调试
  
  // 并发测试数量
  workers: 1, // 单线程运行，避免端口冲突
  
  // 报告配置
  reporter: [
    ['list'], // 控制台输出
    ['html', { outputFolder: 'playwright-report' }], // HTML 报告
    ['json', { outputFile: 'test-results/results.json' }] // JSON 报告
  ],
  
  // 输出目录
  outputDir: 'test-results/',
  
  // 使用配置
  use: {
    // 基础 URL
    baseURL: 'http://localhost:3002',
    
    // 浏览器上下文选项
    trace: 'on-first-retry', // 失败时记录 trace
    screenshot: 'only-on-failure', // 失败时截图
    video: 'retain-on-failure', // 失败时保留视频
    
    // 视口大小
    viewport: { width: 1920, height: 1080 },
    
    // 忽略 HTTPS 错误
    ignoreHTTPSErrors: true,
    
    // 动作超时
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  
  // 项目配置
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // 使用中文
        locale: 'zh-CN',
        timezoneId: 'Asia/Shanghai',
      },
    },
  ],
  
  // 开发服务器配置（可选）
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3002',
  //   reuseExistingServer: true,
  //   timeout: 120000,
  // },
});
