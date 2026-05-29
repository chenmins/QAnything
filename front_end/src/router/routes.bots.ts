/*
 * @Description: Bots-only routes configuration
 * This file contains only the routes needed for the bots-only build
 */
import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    component: () => import('@/layout/index.vue'),
    redirect: '/bots',
    children: [
      {
        path: '/bots',
        name: 'bots',
        component: () => import('@/views/bots/Bots.vue'),
        children: [
          {
            path: '/bots',
            name: 'bots-manage',
            component: () => import('@/views/bots/children/BotsManage.vue'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: '/bots/:botId/edit',
            name: 'edit',
            component: () => import('@/views/bots/children/BotEdit.vue'),
            meta: {
              requiresAuth: true,
            },
            children: [
              {
                path: '/bots/:botId/edit',
                name: 'edit-detail',
                component: () => import('@/views/bots/children/EditDetail.vue'),
                meta: {
                  requiresAuth: true,
                },
              },
              {
                path: '/bots/:botId/publish',
                name: 'publish',
                component: () => import('@/views/bots/children/BotPublish.vue'),
                meta: {
                  requiresAuth: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/statistics',
    name: 'statistics',
    component: () => import('@/views/Statistics/index.vue'),
    redirect: '/statistics/overview',
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/views/Statistics/components/Overview.vue'),
      },
      {
        path: 'details',
        name: 'details',
        component: () => import('@/views/Statistics/components/Details.vue'),
      },
    ],
  },
  {
    path: '/bots/:botId/share',
    name: 'share',
    component: () => import('@/views/bots/children/BotShare.vue'),
  },
  {
    path: '/:catchAll(.*)',
    redirect: '/bots',
  },
];
