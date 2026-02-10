import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * 简化版超管 AI 配置页面测试
 * 使用更宽松的等待策略和更详细的日志
 */
test.describe('超管 AI 配置页面测试（简化版）', () => {
  test('完整流程测试', async ({ page, context }) => {
    const testStartTime = new Date().toISOString();
    console.log(`\n========== 测试开始: ${testStartTime} ==========\n`);
    
    // 创建截图目录
    const screenshotDir = path.join(__dirname, 'test-screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // 监听控制台消息
    const consoleMessages: string[] = [];
    page.on('console', (msg) => {
      const text = `[${msg.type()}] ${msg.text()}`;
      consoleMessages.push(text);
      console.log(`  浏览器控制台: ${text}`);
    });

    // 监听页面错误
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      const errorMsg = error.toString();
      pageErrors.push(errorMsg);
      console.log(`  ⚠️  页面错误: ${errorMsg}`);
    });

    // 监听请求失败
    const failedRequests: string[] = [];
    page.on('requestfailed', (request) => {
      const failMsg = `${request.url()} - ${request.failure()?.errorText}`;
      failedRequests.push(failMsg);
      console.log(`  ⚠️  请求失败: ${failMsg}`);
    });

    try {
      // ============ 步骤 1: 打开登录页面（不等待完全加载）============
      console.log('步骤 1: 导航到超管登录页面...');
      
      // 设置较长的导航超时
      const response = await page.goto('http://localhost:3002/superadmin/login', { 
        waitUntil: 'commit', // 最宽松的等待策略，只等待导航提交
        timeout: 60000 
      }).catch(async (error) => {
        console.log(`  ⚠️  导航错误: ${error.message}`);
        // 即使超时也继续，可能页面已经部分加载
        return null;
      });

      console.log(`  响应状态: ${response?.status() || '未知'}`);
      console.log(`  当前 URL: ${page.url()}`);
      
      // 等待一段时间让页面渲染
      await page.waitForTimeout(3000);
      
      await page.screenshot({ 
        path: path.join(screenshotDir, '01-login-page-initial.png'),
        fullPage: true 
      });
      console.log('✅ 登录页面初始截图已保存');

      // ============ 步骤 2-3: 尝试查找并填写登录表单 ============
      console.log('\n步骤 2-3: 查找登录表单元素...');
      
      // 等待任何输入框出现
      try {
        await page.waitForSelector('input', { timeout: 10000 });
        console.log('  ✅ 找到输入框元素');
        
        // 尝试多种选择器查找用户名输入框
        const usernameSelectors = [
          'input[name="username"]',
          'input[type="text"]',
          'input[placeholder*="用户名"]',
          'input[placeholder*="账号"]',
          'input:not([type="password"])'
        ];
        
        let usernameInput = null;
        for (const selector of usernameSelectors) {
          usernameInput = page.locator(selector).first();
          if (await usernameInput.isVisible().catch(() => false)) {
            console.log(`  ✅ 使用选择器找到用户名输入框: ${selector}`);
            break;
          }
        }
        
        // 尝试多种选择器查找密码输入框
        const passwordSelectors = [
          'input[name="password"]',
          'input[type="password"]'
        ];
        
        let passwordInput = null;
        for (const selector of passwordSelectors) {
          passwordInput = page.locator(selector).first();
          if (await passwordInput.isVisible().catch(() => false)) {
            console.log(`  ✅ 使用选择器找到密码输入框: ${selector}`);
            break;
          }
        }
        
        if (usernameInput && passwordInput) {
          // 填写表单
          await usernameInput.fill('admin');
          console.log('  ✅ 用户名已输入: admin');
          
          await passwordInput.fill('k123456');
          console.log('  ✅ 密码已输入: k123456');
          
          await page.screenshot({ 
            path: path.join(screenshotDir, '02-credentials-filled.png'),
            fullPage: true 
          });

          // ============ 步骤 4: 点击登录按钮 ============
          console.log('\n步骤 4: 查找并点击登录按钮...');
          
          const loginButtonSelectors = [
            'button[type="submit"]',
            'button:has-text("登录")',
            'button:has-text("登 录")',
            'input[type="submit"]',
            'button.login-button',
            'button.btn-login'
          ];
          
          let loginButton = null;
          for (const selector of loginButtonSelectors) {
            loginButton = page.locator(selector).first();
            if (await loginButton.isVisible().catch(() => false)) {
              console.log(`  ✅ 使用选择器找到登录按钮: ${selector}`);
              break;
            }
          }
          
          if (loginButton) {
            await loginButton.click();
            console.log('  ✅ 登录按钮已点击');
            
            // ============ 步骤 5: 等待跳转 ============
            console.log('\n步骤 5: 等待跳转到超管首页...');
            
            try {
              await page.waitForURL(/\/superadmin(?!\/login)/, { timeout: 15000 });
              console.log(`  ✅ 已跳转: ${page.url()}`);
              
              await page.waitForTimeout(3000);
              await page.screenshot({ 
                path: path.join(screenshotDir, '03-dashboard.png'),
                fullPage: true 
              });
              
              // ============ 步骤 6: 查找 AI 配置导航 ============
              console.log('\n步骤 6: 查找 AI 服务配置导航...');
              
              await page.waitForTimeout(2000); // 等待侧边栏渲染
              
              const aiConfigSelectors = [
                'button:has-text("AI 服务配置")',
                'button:has-text("AI配置")',
                'button:has-text("AI 服务")',
                'a:has-text("AI 服务配置")',
                'a:has-text("AI配置")',
                'a[href*="ai-config"]',
                'nav button:has-text("AI")',
                'nav a:has-text("AI")'
              ];
              
              let aiConfigLink = null;
              for (const selector of aiConfigSelectors) {
                aiConfigLink = page.locator(selector).first();
                if (await aiConfigLink.isVisible().catch(() => false)) {
                  console.log(`  ✅ 使用选择器找到 AI 配置链接: ${selector}`);
                  break;
                }
              }
              
              if (aiConfigLink) {
                await aiConfigLink.click();
                console.log('  ✅ AI 服务配置导航已点击');
                
                // ============ 步骤 7: 等待 AI 配置页面加载 ============
                console.log('\n步骤 7: 等待 AI 配置页面加载...');
                
                try {
                  await page.waitForURL(/\/ai-config/, { timeout: 15000 });
                  console.log(`  ✅ 已到达 AI 配置页面: ${page.url()}`);
                  
                  await page.waitForTimeout(3000);
                  
                  // ============ 步骤 8: 截图 ============
                  console.log('\n步骤 8: 截图记录页面状态...');
                  await page.screenshot({ 
                    path: path.join(screenshotDir, '04-ai-config-page-full.png'),
                    fullPage: true 
                  });
                  console.log('  ✅ 完整页面截图已保存');
                  
                  // ============ 步骤 9-11: 验证页面元素 ============
                  console.log('\n步骤 9-11: 验证页面元素...');
                  
                  // 获取页面内容用于分析
                  const pageContent = await page.content();
                  
                  // 验证服务商
                  const expectedProviders = ['OpenAI', 'Anthropic', 'DeepSeek', 'Moonshot', 'Groq', 'Coze', '通义千问', '智谱'];
                  const foundProviders: string[] = [];
                  const missingProviders: string[] = [];
                  
                  for (const provider of expectedProviders) {
                    const providerElement = page.locator(`text=${provider}`).first();
                    const isVisible = await providerElement.isVisible().catch(() => false);
                    
                    if (isVisible || pageContent.includes(provider)) {
                      foundProviders.push(provider);
                      console.log(`  ✅ 找到服务商: ${provider}`);
                    } else {
                      missingProviders.push(provider);
                      console.log(`  ❌ 未找到服务商: ${provider}`);
                    }
                  }
                  
                  // 验证查询余额按钮
                  const hasQueryButton = await page.locator('button:has-text("查询"), button:has-text("余额")').first().isVisible().catch(() => false);
                  console.log(`  查询余额按钮: ${hasQueryButton ? '✅ 找到' : '❌ 未找到'}`);
                  
                  // 验证统计卡片
                  const expectedStats = ['服务商总数', '已启用', '已配置密钥', '余额告警'];
                  const foundStats: string[] = [];
                  
                  for (const stat of expectedStats) {
                    const isVisible = await page.locator(`text=${stat}`).first().isVisible().catch(() => false);
                    if (isVisible || pageContent.includes(stat)) {
                      foundStats.push(stat);
                      console.log(`  ✅ 找到统计卡片: ${stat}`);
                    } else {
                      console.log(`  ❌ 未找到统计卡片: ${stat}`);
                    }
                  }
                  
                  // 生成测试报告
                  const testReport = {
                    测试时间: testStartTime,
                    页面URL: page.url(),
                    测试状态: '成功',
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
                        完成度: `${foundStats.length}/${expectedStats.length}`
                      },
                      控制台消息数: consoleMessages.length,
                      页面错误数: pageErrors.length,
                      失败请求数: failedRequests.length
                    },
                    截图位置: screenshotDir,
                    控制台消息: consoleMessages,
                    页面错误: pageErrors,
                    失败请求: failedRequests
                  };
                  
                  // 保存报告
                  const reportPath = path.join(screenshotDir, 'test-report.json');
                  fs.writeFileSync(reportPath, JSON.stringify(testReport, null, 2), 'utf-8');
                  console.log(`\n✅ 测试报告已保存: ${reportPath}`);
                  
                  // 输出总结
                  console.log('\n========== 测试总结 ==========');
                  console.log(`✅ 登录成功: 是`);
                  console.log(`✅ AI 配置页面加载: 是`);
                  console.log(`📊 AI 服务商显示: ${foundProviders.length}/${expectedProviders.length}`);
                  console.log(`🔘 查询余额按钮: ${hasQueryButton ? '是' : '否'}`);
                  console.log(`📈 统计卡片显示: ${foundStats.length}/${expectedStats.length}`);
                  console.log(`⚠️  页面错误: ${pageErrors.length}`);
                  console.log(`📸 截图已保存到: ${screenshotDir}`);
                  console.log('==============================\n');
                  
                  // 断言
                  expect(foundProviders.length).toBeGreaterThan(0);
                  expect(page.url()).toContain('ai-config');
                  
                } catch (error) {
                  console.log(`  ❌ AI 配置页面加载失败: ${error}`);
                  await page.screenshot({ 
                    path: path.join(screenshotDir, 'error-ai-config-timeout.png'),
                    fullPage: true 
                  });
                  throw error;
                }
              } else {
                console.log('  ❌ 未找到 AI 配置导航链接');
                await page.screenshot({ 
                  path: path.join(screenshotDir, 'error-no-ai-config-link.png'),
                  fullPage: true 
                });
                
                // 列出所有可见的导航链接
                const allLinks = await page.locator('a').allTextContents();
                console.log('  页面中的所有链接:', allLinks.filter(t => t.trim()));
                
                throw new Error('未找到 AI 配置导航链接');
              }
              
            } catch (error) {
              console.log(`  ❌ 登录后跳转失败: ${error}`);
              await page.screenshot({ 
                path: path.join(screenshotDir, 'error-login-redirect.png'),
                fullPage: true 
              });
              throw error;
            }
          } else {
            console.log('  ❌ 未找到登录按钮');
            await page.screenshot({ 
              path: path.join(screenshotDir, 'error-no-login-button.png'),
              fullPage: true 
            });
            throw new Error('未找到登录按钮');
          }
        } else {
          console.log('  ❌ 未找到输入框');
          await page.screenshot({ 
            path: path.join(screenshotDir, 'error-no-inputs.png'),
            fullPage: true 
          });
          throw new Error('未找到用户名或密码输入框');
        }
      } catch (error) {
        console.log(`  ❌ 查找表单元素失败: ${error}`);
        await page.screenshot({ 
          path: path.join(screenshotDir, 'error-form-not-found.png'),
          fullPage: true 
        });
        throw error;
      }
      
    } catch (error) {
      console.log(`\n========== 测试失败 ==========`);
      console.log(`错误: ${error}`);
      console.log(`页面错误数: ${pageErrors.length}`);
      console.log(`失败请求数: ${failedRequests.length}`);
      console.log('================================\n');
      
      // 保存错误报告
      const errorReport = {
        测试时间: testStartTime,
        错误信息: error.toString(),
        页面URL: page.url(),
        控制台消息: consoleMessages,
        页面错误: pageErrors,
        失败请求: failedRequests,
        截图位置: screenshotDir
      };
      
      const errorReportPath = path.join(screenshotDir, 'error-report.json');
      fs.writeFileSync(errorReportPath, JSON.stringify(errorReport, null, 2), 'utf-8');
      console.log(`❌ 错误报告已保存: ${errorReportPath}\n`);
      
      throw error;
    }
  });
});
