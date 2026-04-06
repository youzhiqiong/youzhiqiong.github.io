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
    // path 可以是 '#articles'、'#/article/1' 这样带 # 的格式
    // 也可以是 '/articles'、'/article/1' 这样不带 # 的格式
    navigate(path) {
        // 统一为带 # 的格式用于比较
        const hashPath = path.startsWith('#') ? path : '#' + path;
        
        if (hashPath === this.currentRoute) return;
        
        // window.location.hash 赋值时需要带 # 或不带均可（浏览器会自动规范化）
        // 这里统一传入不带 # 的部分，让浏览器加 #
        window.location.hash = path.startsWith('#') ? path.slice(1) : path;
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
