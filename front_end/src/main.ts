/*
 * @Author: 祝占朋 wb.zhuzhanpeng01@mesg.corp.netease.com
 * @Date: 2024-01-09 15:28:56
 * @LastEditors: lizhiyong
 * @LastEditTime: 2025-10-20 09:39:22
 * @FilePath: /QAnything/front_end/src/main.ts
 * @Description:
 */

import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index';
import pinia from './store/index';
import '@/styles/common/global.scss';
import 'virtual:svg-icons-register';

let queryArr = window.location.href.split('?');
let user_id = '';
if (queryArr[1]) {
  user_id = new URLSearchParams(queryArr[1]).get('user_id');
}
let userStr = localStorage.getItem('user');
if (userStr) {
  let userObj = JSON.parse(userStr);
  if (userObj?.userInfo?.phoneNumber.length <= 1) {
    localStorage.setItem(
      'user',
      JSON.stringify({
        userInfo: { token: '', phoneNumber: user_id || '13333323624' },
        userPhoneDialogOpen: false,
      })
    );
  } else {
    localStorage.setItem(
      'user',
      JSON.stringify({
        userInfo: { token: '', phoneNumber: user_id || userObj?.userInfo?.phoneNumber },
        userPhoneDialogOpen: false,
      })
    );
  }
} else {
  localStorage.setItem(
    'user',
    JSON.stringify({
      userInfo: { token: '', phoneNumber: user_id || '13333323624' },
      userPhoneDialogOpen: false,
    })
  );
  console.log(localStorage.getItem('user'));
}

const vueApp = createApp(App);
vueApp.use(pinia).use(router);
vueApp.mount('#app');
