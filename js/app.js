// 博客应用主逻辑

// 全局错误捕获（帮助调试）
window.addEventListener('error', (e) => {
    console.error('[BlogApp Error]', e.message, e.filename, e.lineno);
});

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    try {
        initApp();
    } catch (e) {
        console.error('[initApp Error]', e);
        document.getElementById('app').innerHTML = `
            <div style="text-align:center;padding:80px 20px;color:#666;">
                <p style="font-size:2rem">⚠️</p>
                <p>页面加载出现问题，请刷新重试。</p>
                <p style="font-size:0.8rem;margin-top:8px;color:#999;">${e.message}</p>
            </div>`;
    }
});

function initApp() {
    // 初始化主题
    initTheme();
    
    // 注册路由
    registerRoutes();
    
    // 绑定导航点击事件
    bindNavEvents();
    
    // 处理初始路由（延迟一帧确保 DOM 就绪）
    setTimeout(() => {
        router.handleRoute();
    }, 0);
}

// 初始化主题
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // 应用保存的主题
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
    }
    
    // 绑定切换事件
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// 注册所有路由
function registerRoutes() {
    router.register('/home', renderHome);
    router.register('/articles', renderArticles);
    router.register('/article', renderArticleDetail);
    router.register('/tags', renderTags);
    router.register('/tag', renderTagArticles);
    router.register('/about', renderAbout);
}

// 绑定导航事件
function bindNavEvents() {
    // 导航链接点击 - 使用hash路由
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href'); // 形如 '#home', '#articles'
            // location.hash 赋值时必须去掉开头的 #，否则会变成 ##home
            window.location.hash = href.startsWith('#') ? href.slice(1) : href;
        });
    });
    
    // Logo点击返回首页
    document.querySelector('.logo').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = 'home'; // 注意：不带 #
    });
    
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // 点击导航链接后关闭移动端菜单
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// 渲染首页
function renderHome() {
    const app = document.getElementById('app');
    try {
        const recentArticles = blogData.articles.slice(0, 3);
        const hotTags = getAllTags().slice(0, 10);
        
        app.innerHTML = `
        <div class="container fade-in">
            <section class="hero">
                <h1>🧠 探索内心的旅程</h1>
                <p>在这里，我们用心理学的视角理解自己，用科学的方法改善生活。<br>每一篇文章都是一次心灵的对话，愿你在这里找到属于自己的答案。</p>
                <div class="hero-actions">
                    <a href="#articles" class="hero-btn hero-btn-primary">
                        📖 开始阅读
                    </a>
                    <a href="#about" class="hero-btn hero-btn-secondary">
                        👋 了解作者
                    </a>
                </div>
            </section>

            <section class="features-section">
                <div class="features-grid">
                    <div class="feature-item">
                        <span class="feature-icon">🧠</span>
                        <h3>科学严谨</h3>
                        <p>每篇文章基于心理学研究，理论与实践并重</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">💡</span>
                        <h3>实用易懂</h3>
                        <p>将专业知识转化为可操作的日常建议</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🌱</span>
                        <h3>持续成长</h3>
                        <p>定期更新，陪伴你的每一步心理成长</p>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">❤️</span>
                        <h3>温暖陪伴</h3>
                        <p>不评判、不说教，只是陪你一起看见内心</p>
                    </div>
                </div>
            </section>
            
            <section class="articles-section">
                <div class="section-header">
                    <h2 class="section-title">最新文章</h2>
                    <a href="#articles" class="view-all">查看全部 →</a>
                </div>
                <div class="articles-grid">
                    ${recentArticles.map(article => createArticleCard(article)).join('')}
                </div>
            </section>

            <section class="topics-preview">
                <div class="section-header">
                    <h2 class="section-title">热门主题</h2>
                    <a href="#tags" class="view-all">全部标签 →</a>
                </div>
                <div class="hot-tags">
                    ${hotTags.map(([tag, count]) => {
                        const encoded = encodeURIComponent(tag);
                        return `<a href="#/tag/${encoded}" class="hot-tag">${tag} <span>(${count})</span></a>`;
                    }).join('')}
                </div>
            </section>
        </div>
    `;
        
        bindArticleCardEvents();
    } catch (e) {
        console.error('[renderHome Error]', e);
        app.innerHTML = `<div class="container"><p style="padding:40px;color:#666;">首页加载失败：${e.message}</p></div>`;
    }
}

// 渲染文章列表页
function renderArticles() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="container fade-in">
            <div class="page-header">
                <h1 class="page-title">所有文章</h1>
                <p class="page-description">探索心理学世界的每一个角落</p>
            </div>
            
            <div class="filter-bar">
                <input type="text" class="search-input" placeholder="搜索文章标题、内容或标签..." id="searchInput">
            </div>
            
            <div class="articles-grid" id="articlesGrid">
                ${blogData.articles.map(article => createArticleCard(article)).join('')}
            </div>
            
            <div class="empty-state" id="emptyState" style="display: none;">
                <div class="empty-state-icon">🔍</div>
                <p>没有找到匹配的文章</p>
            </div>
        </div>
    `;
    
    // 绑定搜索功能
    const searchInput = document.getElementById('searchInput');
    const articlesGrid = document.getElementById('articlesGrid');
    const emptyState = document.getElementById('emptyState');
    
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim();
        let articles = blogData.articles;
        
        if (keyword) {
            articles = searchArticles(keyword);
        }
        
        if (articles.length === 0) {
            articlesGrid.style.display = 'none';
            emptyState.style.display = 'block';
        } else {
            articlesGrid.style.display = 'grid';
            emptyState.style.display = 'none';
            articlesGrid.innerHTML = articles.map(article => createArticleCard(article)).join('');
            bindArticleCardEvents();
        }
    });
    
    bindArticleCardEvents();
}

// 渲染文章详情页
function renderArticleDetail(params) {
    const app = document.getElementById('app');
    const article = getArticleById(params.id);
    
    if (!article) {
        app.innerHTML = `
            <div class="container fade-in">
                <div class="empty-state">
                    <div class="empty-state-icon">😕</div>
                    <p>文章不存在</p>
                    <a href="#articles" class="view-all" style="margin-top: 16px; display: inline-block;">
                        ← 返回文章列表
                    </a>
                </div>
            </div>
        `;
        return;
    }
    
    // 渲染Markdown内容
    const htmlContent = marked.parse(article.content);
    
    // 生成目录
    const toc = generateTOC(article.content);
    
    app.innerHTML = `
        <div class="container fade-in">
            <a href="#articles" class="back-btn">
                ← 返回文章列表
            </a>
            
            <div class="article-layout">
                ${toc ? `
                <aside class="toc">
                    <div class="toc-title">📑 文章目录</div>
                    <ul class="toc-list">
                        ${toc}
                    </ul>
                </aside>
                ` : ''}
                
                <article class="article-detail">
                    <header class="article-header">
                        <h1 class="article-detail-title">${article.title}</h1>
                        <div class="article-detail-meta">
                            <span>📅 ${article.date}</span>
                            <span>⏱️ ${article.readTime}</span>
                            <span>🏷️ ${article.tags.join('、')}</span>
                        </div>
                    </header>
                    
                    <div class="article-body" id="articleBody">
                        ${htmlContent}
                    </div>
                    
                    <div class="share-buttons">
                        <button class="share-btn share-wechat" onclick="shareToWeChat('${article.title}')">
                            💬 微信分享
                        </button>
                        <button class="share-btn share-weibo" onclick="shareToWeibo('${article.title}')">
                            📢 微博分享
                        </button>
                        <button class="share-btn share-link" onclick="copyLink()">
                            🔗 复制链接
                        </button>
                    </div>
                    
                    <div class="comments-section">
                        <h3 class="comments-title">💬 评论</h3>
                        <div id="comments-container">
                            <p style="color: var(--text-muted); font-size: 0.875rem;">
                                评论功能需要部署后才能使用。你可以使用 <a href="https://disqus.com" target="_blank" style="color: var(--primary-color);">Disqus</a> 或 <a href="https://twikoo.js.org" target="_blank" style="color: var(--primary-color);">Twikoo</a> 添加评论系统。
                            </p>
                        </div>
                    </div>
                </article>
            </div>
        </div>
    `;
    
    // 高亮代码块
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
    
    // 绑定目录滚动监听
    if (toc) {
        bindTOCScroll();
    }
}

// 生成目录
function generateTOC(content) {
    const headings = content.match(/^## .+$/gm);
    if (!headings) return '';
    
    return headings.map(heading => {
        const title = heading.replace(/^## /, '');
        const id = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        return `<li><a href="#${id}" onclick="scrollToSection('${id}'); return false;">${title}</a></li>`;
    }).join('');
}

// 滚动到指定章节
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 绑定目录滚动监听
function bindTOCScroll() {
    const articleBody = document.getElementById('articleBody');
    if (!articleBody) return;
    
    const headings = articleBody.querySelectorAll('h2');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-20% 0px -80% 0px' });
    
    headings.forEach(heading => observer.observe(heading));
}

// 分享功能
function shareToWeChat(title) {
    const url = window.location.href;
    alert(`请复制链接分享到微信：\n\n${title}\n${url}`);
}

function shareToWeibo(title) {
    const url = window.location.href;
    const shareUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function copyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('链接已复制到剪贴板！');
    }).catch(() => {
        // 降级方案
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        alert('链接已复制到剪贴板！');
    });
}

// 渲染标签页
function renderTags() {
    const app = document.getElementById('app');
    const tags = getAllTags();
    
    app.innerHTML = `
        <div class="container fade-in">
            <div class="page-header">
                <h1 class="page-title">文章标签</h1>
                <p class="page-description">按主题浏览文章</p>
            </div>
            
            <div class="tags-cloud">
                ${tags.map(([tag, count]) => `
                    <a href="#/tag/${encodeURIComponent(tag)}" class="tag-item">
                        ${tag}
                        <span class="tag-count">${count}</span>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

// 渲染特定标签的文章
function renderTagArticles(params) {
    const app = document.getElementById('app');
    const tag = params.tag;
    const articles = getArticlesByTag(tag);
    
    app.innerHTML = `
        <div class="container fade-in">
            <a href="#tags" class="back-btn">
                ← 返回标签页
            </a>
            
            <div class="page-header">
                <h1 class="page-title">标签：${tag}</h1>
                <p class="page-description">共 ${articles.length} 篇文章</p>
            </div>
            
            <div class="articles-grid">
                ${articles.map(article => createArticleCard(article)).join('')}
            </div>
            
            ${articles.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>该标签下暂无文章</p>
                </div>
            ` : ''}
        </div>
    `;
    
    bindArticleCardEvents();
}

// 渲染关于页
function renderAbout() {
    const app = document.getElementById('app');
    const about = blogData.about;
    const bioParagraphs = about.bio.split('\n\n').filter(p => p.trim());
    
    app.innerHTML = `
        <div class="container fade-in">
            <section class="about-section">
                <div class="about-card">
                    <div class="about-avatar">${about.avatar}</div>
                    <h1 class="about-name">${about.name}</h1>
                    <p class="about-title">${about.title}</p>
                    <div class="about-bio">
                        ${bioParagraphs.map(p => `<p>${p}</p>`).join('')}
                    </div>
                    
                    <div class="about-stats">
                        <div class="stat-item">
                            <div class="stat-value">${about.stats.articles}</div>
                            <div class="stat-label">篇文章</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${about.stats.tags}</div>
                            <div class="stat-label">个标签</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${about.stats.readers}</div>
                            <div class="stat-label">位读者</div>
                        </div>
                    </div>
                </div>

                <div class="about-topics">
                    <h2 class="section-title" style="text-align:center; margin-bottom: 1.5rem;">📚 主要研究方向</h2>
                    <div class="topics-grid">
                        <div class="topic-card">
                            <div class="topic-icon">🧠</div>
                            <h3>认知心理学</h3>
                            <p>探索大脑的思维方式，认识认知偏差，提升理性决策能力。</p>
                        </div>
                        <div class="topic-card">
                            <div class="topic-icon">💞</div>
                            <h3>情绪与关系</h3>
                            <p>理解情绪调节机制，改善人际沟通，建立更健康的亲密关系。</p>
                        </div>
                        <div class="topic-card">
                            <div class="topic-icon">🌱</div>
                            <h3>积极心理学</h3>
                            <p>发掘内在优势，培养幸福感，活出更有意义的人生。</p>
                        </div>
                        <div class="topic-card">
                            <div class="topic-icon">🕊️</div>
                            <h3>创伤与疗愈</h3>
                            <p>了解心理创伤的形成与疗愈，陪伴每一颗受伤的心走向复原。</p>
                        </div>
                        <div class="topic-card">
                            <div class="topic-icon">🧘</div>
                            <h3>正念冥想</h3>
                            <p>将正念融入日常生活，找回当下的平静与清醒。</p>
                        </div>
                        <div class="topic-card">
                            <div class="topic-icon">🌙</div>
                            <h3>睡眠科学</h3>
                            <p>解读睡眠的奥秘，帮助每个人拥有更高质量的休息与恢复。</p>
                        </div>
                    </div>
                </div>

                <div class="about-quote">
                    <blockquote>
                        "认识你自己。" —— 德尔菲神庙铭文<br>
                        <span style="font-size: 0.9em; opacity: 0.8;">了解自己，是一切成长的起点。</span>
                    </blockquote>
                </div>

                <div class="about-contact">
                    <h2 class="section-title" style="text-align:center; margin-bottom: 1rem;">📬 与我联系</h2>
                    <p style="text-align:center; color: var(--text-secondary); margin-bottom: 1.5rem;">如果你有任何想法、问题或合作意向，欢迎通过以下方式联系我。</p>
                    <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                        <a href="mailto:28324386@qq.com" class="contact-btn">
                            📧 发送邮件
                        </a>
                        <a href="#articles" class="contact-btn contact-btn-secondary">
                            📖 阅读文章
                        </a>
                    </div>
                </div>
            </section>
        </div>
    `;
}

// 创建文章卡片HTML
function createArticleCard(article) {
    return `
        <article class="article-card" data-id="${article.id}">
            <div class="article-image" style="background: linear-gradient(135deg, var(--primary-light), var(--accent-color));"></div>
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <div class="article-tags">
                        ${article.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <span>${article.readTime}</span>
                </div>
            </div>
        </article>
    `;
}

// 绑定文章卡片点击事件
function bindArticleCardEvents() {
    document.querySelectorAll('.article-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            router.navigate(`#/article/${id}`);
        });
    });
}
