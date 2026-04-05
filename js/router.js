// 简单的路由系统
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        
        // 监听浏览器前进后退和hash变化
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
    }

    // 注册路由
    register(path, handler) {
        this.routes[path] = handler;
    }

    // 导航到指定路径 - 使用hash路由兼容GitHub Pages
    navigate(path) {
        if (path === this.currentRoute) return;
        
        // 转换为hash路由
        const hash = path === '/' ? '' : path.substring(1);
        window.location.hash = hash;
        this.handleRoute();
    }

    // 处理当前路由
    handleRoute() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        this.currentRoute = path;
        
        // 解析路由 - 支持GitHub Pages子路径
        let route = '/';
        let params = {};
        
        // 获取基础路径（用于GitHub Pages）
        const basePath = this.getBasePath();
        const relativePath = path.replace(basePath, '') || '/';
        
        if (relativePath === '/' || relativePath === '/index.html') {
            if (hash === '#articles') {
                route = '/articles';
            } else if (hash === '#tags') {
                route = '/tags';
            } else if (hash === '#about') {
                route = '/about';
            } else {
                route = '/home';
            }
        } else if (relativePath.startsWith('/article/')) {
            route = '/article';
            params.id = relativePath.split('/')[2];
        } else if (relativePath.startsWith('/tag/')) {
            route = '/tag';
            params.tag = decodeURIComponent(relativePath.split('/')[2]);
        }
        
        // 执行对应的路由处理器
        if (this.routes[route]) {
            this.routes[route](params);
        } else {
            this.routes['/home']();
        }
        
        // 更新导航状态
        this.updateNavState(hash || '#home');
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }
    
    // 获取基础路径（用于GitHub Pages等子目录部署）
    getBasePath() {
        // 从当前脚本路径推断基础路径
        const scripts = document.querySelectorAll('script[src]');
        for (let script of scripts) {
            const src = script.getAttribute('src');
            if (src && src.includes('/js/')) {
                const basePath = src.substring(0, src.indexOf('/js/'));
                return basePath;
            }
        }
        return '';
    }

    // 更新导航激活状态
    updateNavState(hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === hash) {
                link.classList.add('active');
            }
        });
    }
}

// 创建全局路由实例
const router = new Router();
