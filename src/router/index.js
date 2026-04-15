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
        path: '/',
        component: () => import('@/views/home.vue'),
        meta: {
          title: '首页',
        },
      },
      {
        path: 'conslutations',
        component: () => import('@/views/conslutation.vue'),
        meta: {
          title: '咨询记录',
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
  //是否有token，有则放行，没有则跳转到登录页
  if (token) {
    //如果是后台
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const userType = userInfo.userType;
    if (userType == 2) {
      if (to.path.startsWith('/back')) {
        next();
      } else {
        next({ name: 'dashboard' });
      }
    } else if (userType == 1) {
      if (to.path.startsWith('/back')) {
        next({ name: 'login' });
      } else {
        next();
      }
    }
  } else {
    //判断访问的是前台还是后台
    if (to.path.startsWith('/back')) {
      next({ name: 'login' });
    } else {
      next();
    }
  }
  if (to.name === 'login' || to.name === 'register') {
    next();
  } else if (token) {
    next();
  } else {
    next({ name: 'login' });
  }
});

export default router;
