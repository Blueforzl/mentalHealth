import { createRouter, createWebHashHistory } from 'vue-router';
import BackendLayout from '@/components/BackendLayout.vue';

const backendRoutes = [
  {
    path: '/back',
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

const router = createRouter({
  history: createWebHashHistory(),
  routes: backendRoutes,
});

export default router;
