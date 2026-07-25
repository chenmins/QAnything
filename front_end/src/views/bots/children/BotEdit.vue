<template>
  <div class="container">
    <div class="bot-edit">
      <div v-if="isLoading" class="loading">
        <a-spin :indicator="indicator" />
      </div>
      <div v-else>
        <div class="header">
          <img src="@/assets/bots/bot-avatar.png" alt="avatar" />
          <div class="name">{{ curBot?.bot_name }}</div>
          <div class="tabs">
            <div
              v-for="item in tabList"
              :key="item.name"
              :class="[
                'tab-item',
                tabIndex === item.value ? 'tab-active' : '',
                (!curBot.kb_ids || !curBot.kb_ids.length) && item.value === 1 ? 'tab-disable' : '',
              ]"
              @click="changeEditTab(item.value)"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useBots } from '@/store/useBots';
import { useChatSetting } from '@/store/useChatSetting';
import urlResquest from '@/services/urlConfig';
import { resultControl } from '@/utils/utils';
import routeController from '@/controller/router';
import { message } from 'ant-design-vue';
import { LoadingOutlined } from '@ant-design/icons-vue';
import { getLanguage } from '@/language/index';
import { IChatSetting } from '@/utils/types';

const { getCurrentRoute, changePage } = routeController();
const { tabIndex, curBot } = storeToRefs(useBots());
const { setTabIndex, setCurBot, setKnowledgeList } = useBots();

const bots = getLanguage().bots;

const tabList = [
  {
    name: bots.edit,
    value: 0,
  },
  {
    name: bots.publish,
    value: 1,
  },
];

const botId = ref(null);
const isLoading = ref(true);

const indicator = h(LoadingOutlined, {
  style: {
    fontSize: '48px',
  },
  spin: true,
});

const applyBotChatSetting = bot => {
  if (!bot?.llm_setting) {
    return;
  }

  try {
    const setting = JSON.parse(bot.llm_setting);
    const chatSetting: IChatSetting = {
      modelType: '自定义模型配置',
      modelName: setting.model || '',
      apiKey: setting.api_key || '',
      apiBase: setting.api_base || '',
      apiModelName: setting.model || '',
      apiContextLength: setting.api_context_length || 4096,
      context: setting.other?.context || 0,
      maxToken: setting.max_token || 512,
      chunkSize: setting.chunk_size || 800,
      temperature: setting.temperature ?? 0.5,
      top_P: setting.top_p ?? 1,
      top_K: setting.top_k ?? 30,
      capabilities: {
        onlySearch: setting.only_need_search_results || false,
        mixedSearch: setting.hybrid_search || false,
        networkSearch: setting.networking || false,
        rerank: setting.rerank || false,
      },
      active: true,
      other: {
        contentArr: setting.other?.contentArr || [{ text: '', key: Math.random() }],
        context: setting.other?.context || 0,
      },
    };

    useChatSetting().setChatSettingConfigured(chatSetting);
  } catch (error) {
    console.error('解析机器人模型配置失败', error);
  }
};

const getKbList = async kbIds => {
  try {
    const res: any = await resultControl(await urlResquest.kbList());
    const list = res.filter(item => !/.*_FAQ$/.test(item.kb_name));
    let kbs = [...list];
    console.log('kbs', kbs, kbIds);
    if (kbIds && kbIds.length) {
      kbs = kbs.map(kb => {
        // state: 0 未绑定 1 绑定
        if (kbIds.some(item => item === kb.kb_id)) {
          kb.state = 1;
        } else {
          kb.state = 0;
        }
        return kb;
      });
    } else {
      kbs = kbs.map(kb => {
        kb.state = 0;
        return kb;
      });
    }
    console.log('kbs2', kbs);
    setKnowledgeList(kbs);
  } catch (e) {
    message.error(e.msg || '获取知识库列表失败');
  }
};

const getBotInfo = async botId => {
  try {
    const res: any = await resultControl(await urlResquest.queryBotInfo({ bot_id: botId }));
    setCurBot(res[0]);
    applyBotChatSetting(res[0]);
    getKbList(res[0].kb_ids);
    isLoading.value = false;
  } catch (e) {
    message.error(e.msg || '获取Bot信息失败');
  }
};

init();
function init() {
  const route = getCurrentRoute();
  console.log('zj-route', route);
  botId.value = route.value.params.botId;
  getBotInfo(botId.value);
}

function changeEditTab(value) {
  if (value === 1 && (!curBot.value.kb_ids || !curBot.value.kb_ids.length)) {
    return;
  }
  if (tabIndex.value === value) {
    return;
  }
  setTabIndex(value);
  if (value === 0) {
    changePage(`/bots/${botId.value}/edit`);
  } else {
    changePage(`/bots/${botId.value}/publish`);
  }
}
</script>
<style lang="scss" scoped>
.container {
  background-color: #1566ef;
}
.bot-edit {
  width: 100%;
  height: calc(100vh - 64px);
  background: #f3f6fd;
  border-radius: 12px 0 0 0;
  font-family: PingFang SC;
  padding: 22px 26px;
  .header {
    width: 100%;
    height: 40px;
    padding: 0 32px;
    display: flex;
    align-items: center;
    margin-bottom: 26px;
    img {
      width: 40px;
      height: 40px;
      margin-right: 16px;
    }
    .name {
      flex-grow: 1;
      font-size: 24px;
      font-weight: 500;
      color: #222222;
    }
    .tabs {
      width: 120px;
      display: flex;
      justify-content: space-between;
      .tab-item {
        font-size: 16px;
        font-weight: 500;
        color: #666666;
        cursor: pointer;
      }
      .tab-active {
        color: #1566ef;
      }
      .tab-disable {
        color: #666666;
        cursor: not-allowed;
      }
    }
  }
  .loading {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
