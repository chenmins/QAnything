/*
 * @Description: Bots-only routes configuration for share pages
 * This build only includes bot share pages, no management interface
 * 此配置仅包含机器人分享页面，不包含管理界面，防止通过前台网址访问管理功能
 */
import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/bots/:botId/share',
    name: 'share',
    component: () => import('@/views/bots/children/BotShare.vue'),
  },
  {
    // Redirect all other routes to a default share page or show 404
    // 所有其他路由都重定向，防止访问管理界面
    path: '/:catchAll(.*)',
    redirect: () => {
      // Return to a 404 or prevent access
      return '/bots/error/share';
    },
  },
];
