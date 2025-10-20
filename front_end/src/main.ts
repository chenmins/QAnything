/*
 * @Author: 祝占朋 wb.zhuzhanpeng01@mesg.corp.netease.com
 * @Date: 2024-01-09 15:28:56
 * @LastEditors: lizhiyong
 * @LastEditTime: 2025-09-30 17:17:13
 * @FilePath: /QAnything/front_end/src/main.ts
 * @Description:
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import pinia from './store/index';
import '@/styles/common/global.scss';
import 'virtual:svg-icons-register';
import SvgIcon from '@/components/SvgIcon.vue';

let userStr = localStorage.getItem('user');
if (userStr) {
  let userObj = JSON.parse(userStr);
  console.log(userObj?.userInfo?.phoneNumber);
  if (userObj?.userInfo?.phoneNumber.length <= 1) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        userInfo: { token: '', phoneNumber: '13333323623' },
        userPhoneDialogOpen: false,
      })
    );
  }
} else {
  localStorage.setItem(
    'user',
    JSON.stringify({
      userInfo: { token: '', phoneNumber: '13333323623' },
      userPhoneDialogOpen: false,
    })
  );
}

const vueApp = createApp(App);
vueApp.use(pinia).use(router);
vueApp.component('SvgIcon', SvgIcon);
vueApp.mount('#app');
