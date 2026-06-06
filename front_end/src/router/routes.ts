/*
 * @Author: zhangxx03 zhangxx03@rd.netease.com
 * @Date: 2023-05-30 10:55:35
 * @LastEditors: 祝占朋 wb.zhuzhanpeng01@mesg.corp.netease.com
 * @LastEditTime: 2024-01-11 10:41:53
 * @FilePath: /QAnything/front_end/src/router/routes.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/bots/:botId/share',
    name: 'share',
    component: () => import('@/views/bots/children/BotShare.vue'),
  },
];
