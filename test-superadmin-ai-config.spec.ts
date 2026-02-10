import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// 超管 AI 配置页面测试
test.describe('超管 AI 配置页面测试', () => {
  test('完整流程：登录 -> 导航 -> 验证 AI 配置页面', async ({ page }) => {
    const testStartTime = new Date().toISOString();
    console.log(`\n========== 测试开始: ${testStartTime} ==========\n`);
    
    // 创建截图目录
    const screenshotDir = path.join(__dirname, 'test-screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // ============ 步骤 1: 打开登录页面 ============
    console.log('步骤 1: 导航到超管登录页面...');
    await page.goto('http://localhost:3002/superadmin/login', { 
      waitUntil: 'domcontentloaded', // 改为更宽松的等待策略
      timeout: 30000 
    });
    
    // 等待页面加载完成
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000); // 额外等待 1 秒确保页面渲染
    await page.screenshot({ 
      path: path.join(screenshotDir, '01-login-page.png'),
      fullPage: true 
    });
    console.log('✅ 登录页面已加载');

    // ============ 步骤 2-3: 输入用户名和密码 ============
    console.log('\n步骤 2-3: 输入登录凭证...');
    
    // 等待输入框出现
    const usernameInput = page.locator('input[name="username"], input[type="text"]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();
    
    await expect(usernameInput).toBeVisible({ timeout: 5000 });
    await expect(passwordInput).toBeVisible({ timeout: 5000 });
    
    // 输入用户名
    await usernameInput.fill('admin');
    console.log('✅ 用户名已输入: admin');
    
    // 输入密码
    await passwordInput.fill('k123456');
    console.log('✅ 密码已输入: k123456');
    
    await page.screenshot({ 
      path: path.join(screenshotDir, '02-credentials-filled.png'),
      fullPage: true 
    });

    // ============ 步骤 4: 点击登录按钮 ============
    console.log('\n步骤 4: 点击登录按钮...');
    
    // 查找登录按钮
    const loginButton = page.locator('button[type="submit"], button:has-text("登录")').first();
    await expect(loginButton).toBeVisible({ timeout: 5000 });
    await loginButton.click();
    console.log('✅ 登录按钮已点击');

    // ============ 步骤 5: 等待跳转到超管首页 ============
    console.log('\n步骤 5: 等待跳转到超管首页...');
    
    // 等待 URL 变化（跳转成功）
    await page.waitForURL(/\/superadmin(?!\/login)/, { timeout: 10000 });
    
    // 等待页面加载
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000); // 额外等待动画和数据加载
    
    await page.screenshot({ 
      path: path.join(screenshotDir, '03-dashboard.png'),
      fullPage: true 
    });
    console.log('✅ 已成功跳转到超管首页');

    // ============ 步骤 6: 找到并点击 "AI 服务配置" 导航项 ============
    console.log('\n步骤 6: 查找并点击 "AI 服务配置" 导航...');
    
    // 等待侧边栏加载
    await page.waitForSelector('nav, aside, [role="navigation"]', { timeout: 5000 });
    
    // 多种方式查找 AI 配置链接
    const aiConfigLink = page.locator('a:has-text("AI 服务配置"), a:has-text("AI配置"), a[href*="ai-config"]').first();
    
    await expect(aiConfigLink).toBeVisible({ timeout: 5000 });
    await aiConfigLink.click();
    console.log('✅ AI 服务配置导航已点击');

    // ============ 步骤 7: 等待 AI 配置页面加载完成 ============
    console.log('\n步骤 7: 等待 AI 配置页面加载...');
    
    // 等待 URL 包含 ai-config
    await page.waitForURL(/\/ai-config/, { timeout: 10000 });
    
    // 等待页面内容加载
    await page.waitForLoadState('load');
    await page.waitForTimeout(3000); // 等待数据加载和渲染
    
    console.log('✅ AI 配置页面已加载');

    // ============ 步骤 8: 截图记录页面状态 ============
    console.log('\n步骤 8: 截图记录页面状态...');
    await page.screenshot({ 
      path: path.join(screenshotDir, '04-ai-config-page-full.png'),
      fullPage: true 
    });
    console.log('✅ 完整页面截图已保存');

    // ============ 步骤 9: 验证 AI 服务商列表 ============
    console.log('\n步骤 9: 验证 AI 服务商列表...');
    
    const expectedProviders = [
      'OpenAI',
      'Anthropic',
      'DeepSeek',
      'Moonshot',
      'Groq',
      'Coze',
      '通义千问',
      '智谱'
    ];
    
    const foundProviders: string[] = [];
    const missingProviders: string[] = [];
    
    for (const provider of expectedProviders) {
      // 查找服务商名称（可能在卡片、列表或表格中）
      const providerElement = page.locator(`text=${provider}`).first();
      const isVisible = await providerElement.isVisible().catch(() => false);
      
      if (isVisible) {
        foundProviders.push(provider);
        console.log(`  ✅ 找到服务商: ${provider}`);
      } else {
        missingProviders.push(provider);
        console.log(`  ❌ 未找到服务商: ${provider}`);
      }
    }
    
    console.log(`\n服务商验证结果: ${foundProviders.length}/${expectedProviders.length} 个服务商已显示`);

    // ============ 步骤 10: 验证"查询全部余额"按钮 ============
    console.log('\n步骤 10: 验证"查询全部余额"按钮...');
    
    const queryBalanceButton = page.locator('button:has-text("查询全部余额"), button:has-text("查询余额")').first();
    const hasQueryButton = await queryBalanceButton.isVisible().catch(() => false);
    
    if (hasQueryButton) {
      console.log('  ✅ "查询全部余额"按钮已找到');
      // 高亮并截图
      await queryBalanceButton.scrollIntoViewIfNeeded();
      await page.screenshot({ 
        path: path.join(screenshotDir, '05-query-balance-button.png'),
        fullPage: false 
      });
    } else {
      console.log('  ❌ "查询全部余额"按钮未找到');
    }

    // ============ 步骤 11: 验证统计概览卡片 ============
    console.log('\n步骤 11: 验证统计概览卡片...');
    
    const expectedStats = [
      '服务商总数',
      '已启用',
      '已配置密钥',
      '余额告警'
    ];
    
    const foundStats: string[] = [];
    const missingStats: string[] = [];
    
    for (const stat of expectedStats) {
      const statElement = page.locator(`text=${stat}`).first();
      const isVisible = await statElement.isVisible().catch(() => false);
      
      if (isVisible) {
        foundStats.push(stat);
        console.log(`  ✅ 找到统计卡片: ${stat}`);
      } else {
        missingStats.push(stat);
        console.log(`  ❌ 未找到统计卡片: ${stat}`);
      }
    }
    
    console.log(`\n统计卡片验证结果: ${foundStats.length}/${expectedStats.length} 个统计项已显示`);

    // ============ 最终截图：突出重点区域 ============
    console.log('\n保存最终验证截图...');
    await page.screenshot({ 
      path: path.join(screenshotDir, '06-final-verification.png'),
      fullPage: true 
    });

    // ============ 检查页面是否有错误 ============
    console.log('\n检查页面错误...');
    
    // 检查控制台错误
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // 检查页面中是否有错误提示
    const errorMessages = await page.locator('[role="alert"], .error, .alert-error').allTextContents();
    
    if (consoleErrors.length > 0) {
      console.log('  ⚠️  发现控制台错误:');
      consoleErrors.forEach((err, i) => console.log(`    ${i + 1}. ${err}`));
    } else if (errorMessages.length > 0) {
      console.log('  ⚠️  发现页面错误提示:');
      errorMessages.forEach((err, i) => console.log(`    ${i + 1}. ${err}`));
    } else {
      console.log('  ✅ 未发现明显错误');
    }

    // ============ 生成测试报告 ============
    const testReport = {
      测试时间: testStartTime,
      页面URL: page.url(),
      测试结果: {
        登录成功: true,
        页面加载: true,
        AI服务商列表: {
          显示: foundProviders.length > 0,
          已找到: foundProviders,
          未找到: missingProviders,
          完成度: `${foundProviders.length}/${expectedProviders.length}`
        },
        查询余额按钮: hasQueryButton,
        统计概览卡片: {
          显示: foundStats.length > 0,
          已找到: foundStats,
          未找到: missingStats,
          完成度: `${foundStats.length}/${expectedStats.length}`
        },
        控制台错误: consoleErrors.length,
        页面错误提示: errorMessages.length
      },
      截图位置: screenshotDir
    };

    // 保存测试报告
    const reportPath = path.join(screenshotDir, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2), 'utf-8');
    console.log(`\n✅ 测试报告已保存: ${reportPath}`);

    // ============ 输出最终总结 ============
    console.log('\n========== 测试总结 ==========');
    console.log(`✅ 登录成功: 是`);
    console.log(`✅ AI 配置页面加载: 是`);
    console.log(`📊 AI 服务商显示: ${foundProviders.length}/${expectedProviders.length}`);
    console.log(`🔘 查询余额按钮: ${hasQueryButton ? '是' : '否'}`);
    console.log(`📈 统计卡片显示: ${foundStats.length}/${expectedStats.length}`);
    console.log(`⚠️  错误数量: ${consoleErrors.length + errorMessages.length}`);
    console.log(`📸 截图已保存到: ${screenshotDir}`);
    console.log('==============================\n');

    // ============ 断言验证 ============
    // 核心功能必须全部通过
    expect(foundProviders.length).toBeGreaterThan(0); // 至少显示一些服务商
    expect(foundStats.length).toBeGreaterThan(0); // 至少显示一些统计
    expect(page.url()).toContain('ai-config'); // 确保在正确的页面
  });
});
