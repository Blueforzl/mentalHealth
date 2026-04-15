import { createRouter, createWebHashHistory } from 'vue-router';
import BackendLayout from '@/components/BackendLayout.vue';
import FrontendLayout from '@/components/FrontendLayout.vue';

const backendRoutes = [
  {
    path: '/back',
    redirect: '/back/dashboard',
    component: BackendLayout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard.vue'),
        meta: {
          title: '数据分析',
          icon: 'PieChart',
        },
      },
      {
        path: 'knowledge',
        component: () => import('@/views/knowledge.vue'),
        meta: {
          title: '知识文章',
          icon: 'Document',
        },
      },
      {
        path: 'conslutations',
        component: () => import('@/views/conslutations.vue'),
        meta: {
          title: '咨询记录',
          icon: 'ChatLineSquare',
        },
      },
      {
        path: 'emotional',
        component: () => import('@/views/emotional.vue'),
        meta: {
          title: '情感分析',
          icon: 'TrendCharts',
        },
      },
    ],
  },
  {
    path: '/auth',

    component: () => import('@/views/auth.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/login.vue'),
        meta: {
          title: '登录',
        },
      },
      {
        path: 'register',
        component: () => import('@/views/register.vue'),
        meta: {
          title: '注册',
        },
      },
    ],
  },
];
const frontendRoutes = [
  {
    path: '/',
    component: FrontendLayout,
    children: [
      {
        path: '',
        component: () => import('@/views/home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'conslutation',
        component: () => import('@/views/conslutation.vue'),
        meta: {
          title: 'AI咨询',
        },
      },
      {
        path: 'emotion-diary',
        component: () => import('@/views/emotionDiary.vue'),
      },
      {
        path: 'knowledge',
        component: () => import('@/views/frontendKnowledge.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...backendRoutes, ...frontendRoutes],
});

//路由前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // 登录和注册页面直接放行
  if (to.name === 'login' || to.name === 'register') {
    next();
    return;
  }

  // 有token的情况
  if (token) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const userType = userInfo?.userType;

      if (userType === 2) {
        // 管理员可以访问后台和前台
        next();
      } else if (userType === 1) {
        // 普通用户只能访问前台
        if (to.path.startsWith('/back')) {
          next({ name: 'login' });
        } else {
          next();
        }
      } else {
        // 未知用户类型，跳转到登录页
        next({ name: 'login' });
      }
    } catch (error) {
      // 解析userInfo失败，跳转到登录页
      next({ name: 'login' });
    }
  } else {
    // 没有token的情况
    if (to.path.startsWith('/back')) {
      // 访问后台需要登录
      next({ name: 'login' });
    } else {
      // 前台可以直接访问
      next();
    }
  }
});

export default router;
