// 简单的路由系统
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        
        // 监听浏览器前进后退
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
    }

    // 注册路由
    register(path, handler) {
        this.routes[path] = handler;
    }

    // 导航到指定路径
    navigate(path) {
        if (path === this.currentRoute) return;
        
        history.pushState(null, null, path);
        this.handleRoute();
    }

    // 处理当前路由
    handleRoute() {
        const path = window.location.pathname;
        const hash = window.location.hash;
        
        this.currentRoute = path;
        
        // 解析路由
        let route = '/';
        let params = {};
        
        if (path === '/' || path === '/index.html') {
            if (hash === '#articles') {
                route = '/articles';
            } else if (hash === '#tags') {
                route = '/tags';
            } else if (hash === '#about') {
                route = '/about';
            } else {
                route = '/home';
            }
        } else if (path.startsWith('/article/')) {
            route = '/article';
            params.id = path.split('/')[2];
        } else if (path.startsWith('/tag/')) {
            route = '/tag';
            params.tag = decodeURIComponent(path.split('/')[2]);
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
