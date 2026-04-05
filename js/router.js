// 简单的路由系统
class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = '';
        
        // 监听hash变化
        window.addEventListener('hashchange', () => {
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
        
        // 转换为hash
        const hash = path === '/' ? '' : path;
        window.location.hash = hash;
    }

    // 处理当前路由
    handleRoute() {
        const hash = window.location.hash || '#home';
        
        this.currentRoute = hash;
        
        // 解析路由
        let route = '/home';
        let params = {};
        
        if (hash === '#home' || hash === '' || hash === '#') {
            route = '/home';
        } else if (hash === '#articles') {
            route = '/articles';
        } else if (hash === '#tags') {
            route = '/tags';
        } else if (hash === '#about') {
            route = '/about';
        } else if (hash.startsWith('#/article/')) {
            route = '/article';
            params.id = hash.split('/')[2];
        } else if (hash.startsWith('#/tag/')) {
            route = '/tag';
            params.tag = decodeURIComponent(hash.split('/')[2]);
        }
        
        // 执行对应的路由处理器
        if (this.routes[route]) {
            this.routes[route](params);
        } else {
            this.routes['/home']();
        }
        
        // 更新导航状态
        this.updateNavState(hash);
        
        // 滚动到顶部
        window.scrollTo(0, 0);
    }

    // 更新导航激活状态
    updateNavState(hash) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === hash || (hash === '#home' && href === '#home')) {
                link.classList.add('active');
            }
        });
    }
}

// 创建全局路由实例
const router = new Router();
