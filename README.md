# 心灵驿站 | 心理学个人博客

一个专注于心理学知识分享的个人博客网站，采用纯前端技术构建，无需后端服务器即可运行。

## 🌟 特性

- 📱 **响应式设计** - 完美适配桌面和移动设备
- 🌙 **暗黑模式** - 支持浅色/深色主题切换
- 🔍 **文章搜索** - 实时搜索文章标题、内容和标签
- 🏷️ **标签分类** - 按主题浏览文章
- 📑 **文章目录** - 自动生成文章目录导航
- 💬 **社交分享** - 支持微信、微博分享和链接复制
- 📡 **RSS 订阅** - 提供 RSS 订阅源
- 📝 **Markdown 支持** - 完整支持 Markdown 渲染和代码高亮

## 📚 文章主题

- 情绪管理与调节
- 焦虑与压力管理
- 睡眠与心理健康
- 人际关系与沟通
- 积极心理学
- 心理创伤与复原
- 正念冥想
- 认知心理学
- 依恋理论
- 自我关怀

## 🚀 快速开始

### 本地预览

直接在浏览器中打开 `index.html` 文件即可预览。

### 部署到 GitHub Pages

1. Fork 或克隆本仓库到你的 GitHub 账号
2. 进入仓库 Settings → Pages
3. Source 选择 "Deploy from a branch"
4. Branch 选择 "gh-pages"，文件夹选择 "/ (root)"
5. 点击 Save，等待几分钟即可访问

### 自定义域名（可选）

1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容填写你的域名，如 `blog.example.com`
3. 在你的域名服务商处添加 CNAME 记录指向 `youzhiqiong.github.io`

## 📝 添加新文章

编辑 `js/data.js` 文件，在 `articles` 数组中添加新文章对象：

```javascript
{
    id: 12,  // 确保ID唯一
    title: "文章标题",
    excerpt: "文章摘要",
    content: `# Markdown 内容`,
    date: "2026-04-04",
    readTime: "8分钟",
    tags: ["标签1", "标签2"],
    image: "default"
}
```

## 🎨 自定义主题

编辑 `styles/main.css` 文件中的 CSS 变量：

```css
:root {
    --primary-color: #6B5B95;
    --primary-light: #9B8FC7;
    --primary-dark: #4A3F6B;
    --bg-color: #FAFAFA;
    --card-bg: #FFFFFF;
    --text-primary: #2C3E50;
}
```

## 📄 许可证

MIT License

## 💝 致谢

感谢所有心理学研究者和作者，是他们的工作让这个世界变得更加美好。
