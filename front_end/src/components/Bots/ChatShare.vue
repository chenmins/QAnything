<template>
  <a-config-provider :theme="{ token: { colorPrimary: '#1566ef' } }">
    <div class="bots-chat-container">
      <div class="header">
        <div class="header-content">
          <div class="header-icon" :style="{ background: showYuyin ? 'linear-gradient(300deg, #0065f2 1%, #0065f2 97%)' : 'linear-gradient(300deg, #8b5cf6 1%, #8b5cf6 97%)' }">
            <SvgIcon name="arcoDesign-robot" style="color: #fff; width: 20px; height: 20px;" />
          </div>
          <div style="min-width: 0; overflow: hidden">
            <div class="header-title">{{ botInfo.bot_name }}</div>
            <div class="header-subtitle">咨询您关心的生态环境法律法规及标准规范</div>
          </div>
        </div>
        <div class="header-actions">
          <span class="action-pill-btn" :class="{ 'isPreventClick': showLoading }" @click="downloadChat">
            <SvgIcon name="riFill-file-download" :style="{ width: '12px', height: '12px' }" />
            <span>保存记录</span>
          </span>
          <span class="back-home-btn" @click="goHome">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>返回概览</span>
          </span>
        </div>
      </div>
      <div class="my-page">
        <div id="chat" ref="chatContainer" class="chat showSider">
          <ul id="chat-ul" ref="scrollDom">
            <li class="ai">
              <img v-if="showYuyin" class="avatar" src="@/assets/home/ai-avatar.png" alt="头像" />
              <span v-else class="avatar robot-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 26h1v1h-1v-1zM29 26h1v1h-1v-1z" fill="currentColor"/><path d="M24 7v6m0-6h5m-5 0h-5M3 21v11m42-11v11M9 13h30v27H9V13zm9 13h1v1h-1v-1zm11 0h1v1h-1v-1z"/></svg>
              </span>
              <div class="ai-content">
                <div class="ai-right">
                  <p class="question-text welcome" v-html="botInfo.welcome_message"></p>
                </div>
              </div>
            </li>
            <li v-for="(item, index) in QA_List" :key="index">
              <div v-if="item.type === 'user'" class="user">
                <img class="avatar" src="@/assets/home/avatar.png" alt="头像" />
                <p class="question-text">{{ item.question }}</p>
              </div>
              <div v-else class="ai">
                <img v-if="showYuyin" class="avatar" src="@/assets/home/ai-avatar.png" alt="头像" />
                <span v-else class="avatar robot-avatar">
                  <SvgIcon name="arcoDesign-robot" />
                </span>
                <div class="ai-content">
                  <div class="ai-right">
                    <p
                      class="question-text"
                      :class="[
                        !item.source.length && !item?.picList?.length ? 'change-radius' : '',
                        item.showTools ? '' : 'flashing',
                      ]"
                    >
                      <HighLightMarkDown
                        :content="item.answer.toString()"
                        :show-think="item.showThink"
                        @changeShowThink="changeShowThinkHandler(item)"
                      />
                      <ChatInfoPanel
                        v-if="Object.keys(item?.itemInfo?.tokenInfo || {}).length"
                        :chat-item-info="item.itemInfo"
                      />
                    </p>

                    <div v-if="item.showTools" class="feed-back">
                      <div class="reload-box">
                        <SvgIcon
                          :style="{
                            color: item.copied ? '' : '',
                          }"
                          name="copy"
                          @click="myCopy(item)"
                        ></SvgIcon>
                        <SvgIcon
                          name="reload"
                          style="margin-left: 10px"
                          @click="reAnswer(item)"
                        ></SvgIcon>
                        <span class="reload-text" @click="reAnswer(item)">{{
                          common.regenerate
                        }}</span>
                      </div>
                      <!-- <div class="tools">
                        <SvgIcon
                          :style="{
                            color: item.like ? '#4D71FF' : '',
                          }"
                          name="like"
                          @click="like(item, $event)"
                        ></SvgIcon>
                        <SvgIcon
                          :style="{
                            color: item.unlike ? '#4D71FF' : '',
                          }"
                          name="unlike"
                          @click="unlike(item)"
                        ></SvgIcon>
                      </div> -->
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div v-if="showLoading" class="stop-btn">
          <a-button @click="stopChat">
            <template #icon>
              <SvgIcon name="stop" :class="showLoading ? 'loading' : ''"></SvgIcon>
            </template>
            {{ common.stop }}
          </a-button>
        </div>

        <div v-show="sendType == 'audio'" v-if="showYuyin" class="yuyin-container">
          <img
            class="text-icon"
            src="@/assets/bots/jianpan.png"
            alt=""
            @click="changeType('text')"
          />
          <div class="audio-container">
            <button
              class="audio-btn"
              @touchstart="handleTouchStart"
              @touchend="handleTouchEnd"
              @click="handleTouchStartClick"
            >
              {{ btnText }}
            </button>
          </div>
        </div>

        <div v-show="sendType == 'text'" class="question-box" :style="{ position: 'relative' }">
          <div v-if="chatSettingFormActive?.other?.contentArr?.length" class="other-chat-con">
            <template v-for="(itemC, indexC) in chatSettingFormActive?.other?.contentArr">
              <p v-if="itemC?.text" :key="indexC" @click="otherSend(itemC?.text)">
                {{ itemC?.text }}
              </p>
            </template>
          </div>
          <div class="scroll-btn-div" @click="scrollBottom">
            <img
              class="avatar"
              src="@/assets/home/scroll-down.png"
              alt="滑到底部"
            />
          </div>
          <div class="question" :style="{ '--send-btn-bg': showYuyin ? 'linear-gradient(300deg, #0065f2 1%, #0065f2 97%)' : 'linear-gradient(300deg, #8b5cf6 1%, #8b5cf6 97%)', '--send-btn-bg-disabled': showYuyin ? 'linear-gradient(300deg, #4a9bf5 1%, #4a9bf5 97%)' : 'linear-gradient(300deg, #a78bfa 1%, #a78bfa 97%)' }">
            <ChatTextarea v-model:input-value="question" :options="mentionOptions" @send="send">
              <span v-if="showYuyin" class="yuyin" @click="changeType('audio')">
                <img src="@/assets/bots/yuyin.png" alt="" />
              </span>
              <!-- <a-popover trigger="click">
                <template #title>{{ common.contextLabel }}</template>
                <template #content>
                  <a-slider
                    v-model:value="chatSettingFormActive.context"
                    :min="0"
                    :max="11"
                    :step="1"
                    :tip-formatter="sliderFormatter"
                  />
                </template>
                <span class="setting">
                  <SvgIcon name="chat-setting" />
                </span>
              </a-popover> -->
              <a-button type="primary" :disabled="showLoading || !question.trim().length" shape="circle" @click="send">
                <SvgIcon name="sendplane" />
              </a-button>
            </ChatTextarea>
            <!--            <div class="send-box">-->
            <!--              <a-textarea-->
            <!--                v-model:value="question"-->
            <!--                class="send-textarea"-->
            <!--                max-length="200"-->
            <!--                :bordered="false"-->
            <!--                :placeholder="common.problemPlaceholder"-->
            <!--                :auto-size="{ minRows: 1, maxRows: 8 }"-->
            <!--                @keydown="textKeydownHandle"-->
            <!--              />-->
            <!--              &lt;!&ndash;            @pressEnter="send"&ndash;&gt;-->
            <!--              <div class="send-action"></div>-->
            <!--            </div>-->
          </div>
        </div>

        <div v-if="!botInfo.kb_ids || !botInfo.kb_ids.length" class="mask">
          <img src="@/assets/bots/lock.png" alt="icon" />
          <p>{{ bots.bindKbtoPreview }}</p>
        </div>
      </div>
      <div class="scroll-btn-div" @click="scrollBottom" v-show="sendType == 'text'">
        <img
          class="avatar"
          src="@/assets/home/scroll-down.png"
          alt="滑到底部"
        />
      </div>
    </div>
    <a-modal
      v-model:visible="recordOverlayIsShow"
      :footer="null"
      :closable="false"
      class="record-overlay"
      width="100%"
      wrap-class-name="full-modal"
    >
      <div class="record-overlay-container">
        <div class="record-text" v-html="recordHtml"></div>
        <div class="record-btn" @click.stop="handleTouchEndClick">
          <p>{{ deviceType == 'pc' ? '点击发送' : '松开发送' }}</p>
        </div>
      </div>
    </a-modal>
  </a-config-provider>

  <DefaultModal :content="content" :confirm-loading="confirmLoading" @ok="confirm" />
</template>
<script lang="ts" setup>
import { IChatItem, IChatSetting, MakePartial } from '@/utils/types';
import { useThrottleFn, useClipboard } from '@vueuse/core';
import { message } from 'ant-design-vue';
import SvgIcon from '../SvgIcon.vue';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useBotsChat } from '@/store/useBotsChat';
import { useChat } from '@/store/useChat';
import { Typewriter } from '@/utils/typewriter';
import DefaultModal from '../DefaultModal.vue';
import html2canvas from 'html2canvas';
import { getLanguage } from '@/language/index';
import { useLanguage } from '@/store/useLanguage';
import { ChatInfoClass, resultControl } from '@/utils/utils';
import ChatInfoPanel from '@/components/ChatInfoPanel.vue';
import HighLightMarkDown from '@/components/HighLightMarkDown.vue';
import ChatTextarea from '@/components/ChatTextarea.vue';
import { useUser } from '@/store/useUser';
import { XunFeiRecord } from '@/assets/js/RecordEntry.js';
import { getShareApiUrl, LOCAL_DOC_CHAT_PATH, localDocChat } from '@/services/shareBotApi';

const props = defineProps({
  chatType: {
    type: String,
    default: 'edit',
  },
  botInfo: {
    type: Object as any,
    default: () => ({}),
  },
  virtualUserId: {
    type: String,
    default: 'user',
  },
  showYuyin: {
    type: Boolean,
    default: false,
  },
});

const common = getLanguage().common;
const bots = getLanguage().bots;

const typewriter = new Typewriter((str: string) => {
  if (str) {
    QA_List.value[QA_List.value.length - 1].answer += str || '';
  }
});

const { QA_List } = storeToRefs(useBotsChat());
const { copy } = useClipboard();
const { language } = storeToRefs(useLanguage());
const { userInfo } = useUser();
declare module _czc {
  const push: (array: any) => void;
}

// 当前问的问题
const question = ref('');

// 格式化 chatSetting
type ShareSettingType = MakePartial<IChatSetting, 'modelType'>;
// eslint-disable-next-line vue/no-setup-props-destructure
const { llm_setting } = props.botInfo;
const chatSetting = JSON.parse(llm_setting);
const chatSettingFormActive = ref<ShareSettingType>();
// 初始化 chatSetting 为自己的格式
onMounted(() => {
  chatSettingFormActive.value = {
    apiKey: chatSetting.api_key,
    apiBase: chatSetting.api_base,
    apiModelName: chatSetting.model,
    apiContextLength: chatSetting.api_context_length,
    maxToken: chatSetting.max_token,
    chunkSize: chatSetting.chunk_size,
    temperature: chatSetting.temperature,
    top_K: chatSetting.top_k,
    top_P: chatSetting.top_p,
    capabilities: {
      onlySearch: chatSetting.only_need_search_results,
      mixedSearch: chatSetting.hybrid_search,
      networkSearch: chatSetting.networking,
      rerank: chatSetting.rerank,
    },
    active: true,
    other: chatSetting.other,
  };
});

// 上下文条数，无限制tooltip
const sliderFormatter = (value: number) => {
  // 11代表无限制，所以最后发送的时候如果是11，需要做无限制处理
  return value >= 11 ? '无限制' : value;
};

//问答的上下文
const history = computed(() => {
  const context = chatSettingFormActive.value?.other?.context || 0;
  if (context === 0) return [];
  const usefulChat = QA_List.value.filter(item => item.type === 'ai');
  const historyChat = context === 11 ? usefulChat : usefulChat.slice(-context);
  return historyChat.map(item => [item.question, item.answer]);
});

//当前是否回答中
const showLoading = ref(false);

const showSourceIdxs = ref([]);

//取消请求用
let ctrl: AbortController;

const chatContainer = ref(null);

const scrollDom = ref(null);

const scrollBottom = () => {
  nextTick(() => {
    nextTick(() => {
      scrollDom.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    });
  });
};

onMounted(() => {
  scrollBottom();
});

const like = useThrottleFn((item, e) => {
  item.like = !item.like;
  item.unlike = false;
  _czc.push(['_trackEvent', 'qanything', '问答页面', '点赞', '', '']);
  if (item.like) {
    e.target.parentNode.style.animation = 'shake ease-in .5s';
    const timer = setTimeout(() => {
      clearTimeout(timer);
      e.target.parentNode.style.animation = '';
    }, 600);
  }
}, 800);
const unlike = (item: IChatItem) => {
  item.unlike = !item.unlike;
  item.like = false;
  _czc.push(['_trackEvent', 'qanything', '问答页面', '点踩', '', '']);
};

//拷贝
const myCopy = (item: IChatItem) => {
  copy(item.answer)
    .then(() => {
      item.copied = !item.copied;
      message.success(common.copySuccess, 1);
      const timer = setTimeout(() => {
        clearTimeout(timer);
        item.copied = !item.copied;
      }, 1000);
    })
    .catch(() => {
      message.error(common.copyFailed, 1);
    });
};

const addQuestion = q => {
  QA_List.value.push({
    question: q,
    type: 'user',
  });
  scrollBottom();
};

const addAnswer = (question: string) => {
  QA_List.value.push({
    answer: '',
    question,
    onlySearch: chatSettingFormActive.value.capabilities.onlySearch,
    type: 'ai',
    copied: false,
    like: false,
    unlike: false,
    source: [],
    showTools: false,
    showThink: true,
  });
};

const chatInfoClass = new ChatInfoClass<ShareSettingType>();

const stopChat = () => {
  if (ctrl) {
    ctrl.abort('停止对话');
  }
  typewriter.done();
  showLoading.value = false;
  QA_List.value[QA_List.value.length - 1].showTools = true;
};

// 问答前处理 判断创建对话
const beforeSend = title => {
  try {
    // 判断需不需要新建对话, 为null直接跳出
    if (title.length > 100) {
      title = title.substring(0, 100);
    }
  } catch (e) {
    message.error(e.msg || '创建对话失败');
  }
};

// Mention 的 配置项
const mentionOptions = ref<string[]>([]);
const getMentionOptions = async () => {
  // const res: any = await resultControl(
  //   await urlResquest.getTags({
  //     kb_ids: props.botInfo.kb_ids,
  //   })
  // );
  mentionOptions.value = [];
};
onMounted(() => {
  getMentionOptions();
});
watch(
  () => props.botInfo,
  () => {
    getMentionOptions();
  },
  {
    immediate: true,
    deep: true,
  }
);
// 统计几个 @ 超过10个报错
const computedCallNumber = (question: string) => {
  const atCount = (question.match(/@/g) || []).length;
  return atCount <= 10;
};

//发送问答消息
const send = async () => {
  if (!question.value.trim().length) {
    return;
  }
  if (showLoading.value) {
    message.warn('正在聊天中...请等待结束');
    return;
  }
  if (!computedCallNumber(question.value)) {
    message.error('不可@超过10个');
    return;
  }

  const q = question.value;
  beforeSend(q);
  question.value = '';
  addQuestion(q);
  showLoading.value = true;
  ctrl = new AbortController();

  const sendData = {
    user_id: props.virtualUserId,
    user_info: userInfo.phoneNumber,
    bot_id: props.botInfo.bot_id,
    history: history.value,
    question: q,
    streaming: chatSettingFormActive.value.capabilities.onlySearch === false,
    networking: chatSettingFormActive.value.capabilities.networkSearch,
    product_source: 'saas',
    rerank: chatSettingFormActive.value.capabilities.rerank,
    only_need_search_results: chatSettingFormActive.value.capabilities.onlySearch,
    hybrid_search: chatSettingFormActive.value.capabilities.mixedSearch,
    max_token: chatSettingFormActive.value.maxToken,
    api_base: chatSettingFormActive.value.apiBase,
    api_key: chatSettingFormActive.value.apiKey,
    model: chatSettingFormActive.value.apiModelName,
    api_context_length: chatSettingFormActive.value.apiContextLength,
    chunk_size: chatSettingFormActive.value.chunkSize,
    top_p: chatSettingFormActive.value.top_P,
    top_k: chatSettingFormActive.value.top_K,
    temperature: chatSettingFormActive.value.temperature,
  };

  // 如果是仅检索
  if (chatSettingFormActive.value.capabilities.onlySearch) {
    // 模型配置添加进去
    chatInfoClass.addChatSetting(chatSettingFormActive.value);
    addAnswer(q);
    try {
      const res: any = await resultControl(
        await localDocChat(sendData, { signal: ctrl.signal })
      );
      if (res.code === 200) {
        QA_List.value[QA_List.value.length - 1].answer = res?.source_documents.length
          ? common.searchCompleted
          : common.searchNotFound;
        QA_List.value[QA_List.value.length - 1].source = res?.source_documents;
      }
    } catch (e) {
      console.log('出错', e);
      // message.error(e.msg || '出错了');
      QA_List.value[QA_List.value.length - 1].answer = e.msg || 'error';
    }
    // 无论成不成功,结束后的操作
    showLoading.value = false;
    QA_List.value[QA_List.value.length - 1].showTools = true;
    await nextTick(() => {
      scrollBottom();
    });
  } else {
    fetchEventSource(getShareApiUrl(LOCAL_DOC_CHAT_PATH), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: ['text/event-stream', 'application/json'],
      },
      openWhenHidden: true,
      body: JSON.stringify({
        ...sendData,
      }),
      signal: ctrl.signal,
      onopen(e: any) {
        console.log('open', e);
        addAnswer(q);
        if (e.ok && e.headers.get('content-type') === 'text/event-stream') {
          // 模型配置添加进去
          chatInfoClass.addChatSetting(chatSettingFormActive.value);
          typewriter.start();
        } else if (e.headers.get('content-type') === 'application/json') {
          typewriter.add('Error 请检查模型是否配置正确');
        }
      },
      onmessage(msg: { data: string }) {
        const res: any = JSON.parse(msg.data);
        if (res?.code == 200 && res?.response && res.msg === 'success') {
          // 中间的回答
          // QA_List.value[QA_List.value.length - 1].answer += res.result.response;
          // typewriter.add(res?.response.replaceAll('\n', '<br/>'));
          typewriter.add(res?.response);
          scrollBottom();
        } else {
          // 最后一次回答
          const timeObj = res.time_record.time_usage;
          delete timeObj['retriever_search_by_milvus'];
          // chatInfoClass.addTime(res.time_record.time_usage);
          // chatInfoClass.addToken(res.time_record.token_usage);
          chatInfoClass.addDate(Date.now());
          QA_List.value[QA_List.value.length - 1].showThink = false;
        }

        if (res?.source_documents?.length) {
          QA_List.value[QA_List.value.length - 1].source = res?.source_documents;
        }

        if (res?.show_images?.length) {
          res?.show_images.map(item => {
            typewriter.add(item);
            console.log(QA_List.value.at(-1).answer);
          });
        }
      },
      onclose(e: any) {
        console.log('close', e);
        typewriter.done();
        ctrl.abort();
        showLoading.value = false;
        QA_List.value[QA_List.value.length - 1].showTools = true;
        // 将chat info添加进回答中
        QA_List.value.at(-1).itemInfo = chatInfoClass.getChatInfo();
        console.log(QA_List.value);
        nextTick(() => {
          scrollBottom();
        });
      },
      onerror(err: any) {
        console.log('error', err);
        typewriter?.done();
        ctrl?.abort();
        showLoading.value = false;
        QA_List.value[QA_List.value.length - 1].showTools = true;
        message.error(err.msg || '出错了');
        nextTick(() => {
          scrollBottom();
        });
        throw err;
      },
    });
  }
};

const reAnswer = (item: IChatItem) => {
  console.log('reAnswer');
  question.value = item.question;
  send();
};

//点击查看是否显示详细来源
const showDetail = (item: IChatItem, index) => {
  item.source[index].showDetailDataSource = !item.source[index].showDetailDataSource;
};

const hideDetail = (item: IChatItem, index) => {
  item.source[index].showDetailDataSource = false;
};

const showSourceList = index => {
  showSourceIdxs.value.push(index);
};

const hideSourceList = index => {
  showSourceIdxs.value = showSourceIdxs.value.filter(item => item !== index);
};

//下载 清除聊天记录相关
const { showModal } = storeToRefs(useChat());
const confirmLoading = ref(false);
const content = ref('');
const type = ref('');
const downloadChat = () => {
  if (showLoading.value) return;
  type.value = 'download';
  showModal.value = true;
  content.value = common.saveTip;
};

const goHome = () => {
  window.parent.postMessage({ action: 'CLOSE_QA_MODAL' }, '*');
};

const confirm = async () => {
  confirmLoading.value = true;
  if (type.value === 'download') {
    console.log('download');
    try {
      const ele = document.getElementById('chat-ul');
      const canvas = await html2canvas(ele as HTMLDivElement, {
        useCORS: true,
      });
      const imgUrl = canvas.toDataURL('image/png');
      const tempLink = document.createElement('a');
      tempLink.style.display = 'none';
      tempLink.href = imgUrl;
      tempLink.setAttribute('download', 'chat-shot.png');
      if (typeof tempLink.download === 'undefined') tempLink.setAttribute('target', '_blank');

      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(imgUrl);
      message.success('下载成功');
      Promise.resolve();
    } catch (e) {
      console.log(e);
      message.error(e.message || e.msg || '出错了');
    }
  } else if (type.value === 'delete') {
    console.log('delete');
    QA_List.value = [];
  }
  type.value = '';
  content.value = '';
  confirmLoading.value = false;
  showModal.value = false;
};

const deviceType = ref('');
if (
  /android|iphone|phone|ipad|ipod|windows phone|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  )
) {
  deviceType.value = 'mobile';
} else {
  deviceType.value = 'pc';
}
const sendType = ref('text'); // 发送类型 text-文本 audio-音频
const XunFeiRecordEx = ref(null);
const countdownInterval = ref(null);
const btnText = ref(deviceType.value == 'mobile' ? '按住说话' : '点击说话');
const longPressThreshold = ref(500); // 长按时间阈值，单位毫秒
const recordOverlayIsShow = ref(false); // 录音弹窗是否显示
const recordText = ref(''); // 录音文本
const recordHtml = ref("<span class='cursor-record'>|</span>"); // 录音文本显示
const speakTime = ref(null);

onMounted(() => {
  XunFeiRecordEx.value = new XunFeiRecord();

  console.log(XunFeiRecordEx.value);
});

/**
 * @description 点击说话
 */
const handleTouchStartClick = () => {
  if (deviceType.value == 'pc') {
    handleTouchStart();
  }
};

/**
 * @description 点击结束录音
 */
const handleTouchEndClick = () => {
  if (deviceType.value == 'pc') {
    handleTouchEnd();
  }
};
/**
 * @description 按住说话
 */
const handleTouchStart = () => {
  recordText.value = ''; // 清空录音文本
  recordHtml.value = "<span class='cursor-record'>|</span>"; // 清空录音文本显示
  recordOverlayIsShow.value = true;
  speakTime.value = new Date().getTime();
  countdownHandler(); // 录音倒计时
  XunFeiRecordEx.value.connectWebSocket((type, recordTextTemp) => {
    console.log(type, recordTextTemp);
    if (type == 'pending') {
      // 录制中
      console.log('录制中', recordTextTemp);
      recordHtml.value = recordTextTemp + "<span class='cursor-record'>|</span>";
    } else if (type == 'success') {
      // 录制结束
      if (recordTextTemp) {
        recordText.value = recordTextTemp;
        recordOverlayIsShow.value = false;
        console.log('最终发送', recordText.value);
        question.value = recordText.value;
        send();
      }
    } else if (type == 'close') {
      // 录制结束
      recordOverlayIsShow.value = false;
      handleTouchEnd();
    }
  });
};
/**
 * @description 结束录音
 */
const handleTouchEnd = () => {
  recordOverlayIsShow.value = false;
  if (new Date().getTime() - speakTime.value < longPressThreshold.value) {
    message.warn('说话时间太短...请等待结束');
    return;
  } else {
    XunFeiRecordEx.value.recordStop();
  }
  clearInterval(countdownInterval.value);
  countdownInterval.value = null;
};
/**
 * @description 录音倒计时
 * @param { string } title - 标题自定义文案
 */
const countdownHandler = () => {
  let seconds = 60;
  countdownInterval.value = setInterval(() => {
    seconds = seconds - 1;
    if (seconds <= 0) {
      clearInterval(countdownInterval.value);
      countdownInterval.value = null;
      message.warn('说话时间超过1分钟,主动停止');
      XunFeiRecordEx.value.recordStop();
    }
  }, 1000);
};

/**
 * @description 修改类型
 * @param {string} type - text、audio
 */
const changeType = type => {
  sendType.value = type;
};

const changeShowThinkHandler = item => {
  item.showThink = !item.showThink;
};

const otherSend = text => {
  question.value = text;
  send();
};
</script>

<style lang="scss" scoped>
$avatar-width: 96px;

.bots-chat-container {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: #fff;
  font-family: PingFang SC;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
}

.header {
  width: 100%;
  height: 4.125rem;
  padding: 0 20px;
  background: #F5F3FF;
  border-top-right-radius: 0.625rem;
  border-top-left-radius: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ededed;
  box-sizing: border-box;

  .header-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 0;
    flex: 1;
    overflow: hidden;

    .header-icon {
      width: 2rem;
      height: 2rem;
      border-radius: 0.625rem;
      background: linear-gradient(300deg, #8b5cf6 1%, #8b5cf6 97%);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-title {
      font-size: 14px;
      font-weight: 500;
      color: #222222;
      line-height: 1.5;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header-subtitle {
      font-size: 11px;
      color: #94A3B8;
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;
    margin-left: 12px;
    gap: 8px;

    .action-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      height: 28px;
      font-size: 12px;
      color: #8b5cf6;
      background: #f3f0ff;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      font-family: PingFang SC;
      line-height: 20px;
      white-space: nowrap;
      transition: background 0.25s ease;
      user-select: none;

      &:hover {
        background: #e4dcfc;
      }
    }

    .isPreventClick {
      cursor: not-allowed !important;
      opacity: 0.5;
    }

    .back-home-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      height: 28px;
      font-size: 12px;
      color: #8b5cf6;
      background: #f3f0ff;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      font-family: PingFang SC;
      line-height: 20px;
      white-space: nowrap;
      transition: background 0.25s ease;
      user-select: none;

      &:hover {
        background: #e4dcfc;
      }
    }
  }
}

.my-page {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  background: #f3f6fd;
  overflow: hidden;
  box-sizing: border-box;
}

.chat {
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
  padding: 28px 1.25rem 0;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;

  #chat-ul {
    //padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    background: #f3f6fd;
    overflow: hidden;
    box-sizing: border-box;
  }

  .avatar {
    width: 32px;
    height: 32px;
    margin-right: 16px;
  }

  .robot-avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #8b5cf6;
    border-radius: 50%;
    flex-shrink: 0;

    svg {
      width: 20px;
      height: 20px;
      color: #fff;
    }
  }

  .user {
    display: flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    margin-bottom: 16px;
    min-width: 0;

    .avatar {
      margin: 0 0 0 16px;
      flex-shrink: 0;
    }

    .question-text {
      padding: 13px 20px;
      margin-left: 48px;
      font-size: 14px;
      font-weight: normal;
      line-height: 22px;
      color: #222222;
      background: #e1e7ff;
      border-radius: 12px;
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      min-width: 0;
    }
  }

  .ai {
    margin: 16px 0 28px 0;
    display: flex;

    .ai-content {
      display: flex;
      flex-direction: column;
      padding-right: 48px;
      min-width: 0;

      .question-text {
        flex: 1;
        padding: 13px 20px;
        font-size: 14px;
        font-weight: normal;
        line-height: 22px;
        color: $title1;
        background: #fff;
        border-radius: 12px 12px 0 0;
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        min-width: 0;
      }

      .welcome {
        border-radius: 12px;
      }

      .flashing {
        &:after {
          -webkit-animation: blink 1s steps(5, start) infinite;
          animation: blink 1s steps(5, start) infinite;
          content: '▋';
          margin-left: 0.25rem;
          vertical-align: baseline;
        }
      }

      .change-radius {
        border-radius: 12px;
      }
    }

    .source-total {
      padding: 10px 20px;
      background: #fff;
      display: flex;
      align-items: center;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.88);

      span {
        margin-right: 5px;
      }

      svg {
        width: 16px !important;
        height: 16px !important;
        cursor: pointer !important;
      }
    }

    .source-total-last {
      border-radius: 0px 0 12px 12px;
    }

    .source-list {
      background: #fff;
      border-radius: 0px 12px 12px 12px;
    }

    .data-source {
      padding: 13px 20px;
      font-size: 14px;
      line-height: 22px;
      color: $title1;

      .control {
        display: flex;
        align-items: center;
      }

      .score {
        margin-top: 26px;
      }

      .source-content {
        margin-top: 26px;
      }

      .tips {
        min-width: 78px;
        height: 22px;
        line-height: 22px;
        color: $title2;
        margin-right: 8px;
      }

      .file {
        color: $baseColor;
        margin-right: 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .filename-active {
        color: #1566ef;
        text-decoration: underline;
        cursor: pointer;
      }

      svg {
        width: 14px;
        height: 14px;
        color: $baseColor;
        cursor: pointer;
      }

      a {
        color: #1566ef;
        text-decoration: underline;
        cursor: pointer;
      }
    }

    .feed-back {
      display: flex;
      height: 20px;
      margin-top: 8px;

      .reload-box {
        display: flex;
        cursor: pointer;
        align-items: center;
        margin-right: auto;
        color: #717070;

        .reload-text {
          height: 22px;
          line-height: 22px;
        }
      }

      .tools {
        display: flex;
        align-items: center;

        svg {
          margin-left: 16px;
        }
      }

      svg {
        width: 16px !important;
        height: 16px !important;
        cursor: pointer !important;
      }
    }
  }
}

.stop-btn {
  display: flex;
  justify-content: center;
  margin: 18px 0;

  :deep(.ant-btn) {
    width: 92px;
    height: 32px;
    border: 1px solid #e2e2e2;
    color: $title2;
  }

  svg {
    width: 12px;
    height: 12px;
    margin-right: 4px;
  }

  .loading {
    animation: loading 3s infinite;
  }
}

.question-box {
  width: 100%;
  height: 20%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-top: 1px solid #ededed;
  flex-shrink: 0;

  .question {
    position: relative;
    width: 100%;
    max-width: 100%;
    flex: 1;
    margin: 0 auto;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: stretch;
    box-sizing: border-box;

    :deep(.ant-input-affix-wrapper) {
      width: 100%;
      max-width: 1108px;
      border-color: #e5e5e5;
      box-shadow: none !important;

      &:hover,
      &:focus,
      &:active {
        border-color: #1566ef !important;
        box-shadow: none !important;
      }
    }

    :deep(.ant-input:hover) {
      border-color: $baseColor;
    }

    :deep(.ant-input:focus) {
      border-color: $baseColor;
    }

    .send-box {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
      background-color: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 18px;

      &:hover {
        border-color: $baseColor;
        transition: border-color 0.3s, height 0s;
      }

      &:not(:hover) {
        border-color: #d9d9d9;
        transition: border-color 0.3s;
      }

      &:focus {
        box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
      }

      .send-textarea {
        //position: absolute;
        //bottom: 0;
        min-height: 42px;
        line-height: 25px;
        padding: 11px 15px;
        display: flex;
        align-items: center;
        font-size: 14px;
        border-radius: 18px;
      }
  }

    .send-action {
      width: 100%;
      height: 40px;
      padding-right: 10px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      color: #fff;
      z-index: 101;

      .isPreventClick {
        cursor: not-allowed !important;
      }

      .download,
      .delete,
      .setting {
        cursor: pointer;
        padding: 8px;
        display: flex;
        margin-right: 16px;
        border-radius: 50%;
        background: #ffffff;
        //border: 1px solid #e5e5e5;
        color: #666666;

        &:hover {
          //border: 1px solid #1566ef;
          background-color: #e5e5e5;
          color: #1566ef;
        }

        svg {
          width: 18px;
          height: 18px;
        }
      }

      svg {
        width: 24px;
        height: 24px;
      }
    }
  }
}

.scroll-btn-div {
  position: absolute;
  bottom: 100%;
  right: 32px;
  cursor: pointer;
  margin-bottom: 8px;

  img {
    width: 32px;
    height: 32px;
  }

  svg {
    width: 20px;
    height: 20px;
    margin-top: 5px;
  }
}

.mask {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  color: #fff;
  font-size: 16px;
  border-radius: 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;

  img {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
  }

  p {
    padding: 0 40px;
  }
}

.sourceitem-leave,
// 离开前,进入后透明度是1
.sourceitem-enter-to {
  opacity: 1;
}

.sourceitem-leave-active,
.sourceitem-enter-active {
  transition: opacity 0.5s; //过度是.5s秒
}

.sourceitem-leave-to,
.sourceitem-enter {
  opacity: 0;
}

// @media (max-width: 1023px) {
//   .chat {
//     padding: 0 1rem;
//   }
// }

//@media (min-width: 1500px) {
//  .chat {
//    padding: 0 20%;
//  }
//}
</style>
<style lang="scss">
@keyframes shake {
  0% {
    transform: rotate(0deg);
  }

  10% {
    transform: rotate(10deg);
  }

  20% {
    transform: rotate(20deg);
  }

  30% {
    transform: rotate(20deg);
  }

  40% {
    transform: rotate(20deg);
  }

  50% {
    transform: rotate(15deg);
  }

  60% {
    transform: rotate(0deg);
  }

  70% {
    transform: rotate(-15deg);
  }

  80% {
    transform: rotate(-30deg);
  }

  90% {
    transform: rotate(-15deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

@keyframes blink {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(90deg);
  }

  50% {
    transform: rotate(180deg);
  }

  75% {
    transform: rotate(270deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.yuyin {
  cursor: pointer;
  padding: 8px;
  margin-right: 8px;
  display: flex;

  img {
    width: 18px;
  }
}

.yuyin-container {
  min-height: 20px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0px 0px 24px 0px rgba(29, 36, 48, 0.06), 0px 0px 16px 0px rgba(29, 32, 39, 0.1);
  display: flex;
  align-items: center;
  margin: 32px auto;
  padding: 5px 0;
  max-width: 720px;
  width: 100%;
}

.text-icon {
  width: 22px;
  flex-shrink: 0;
  margin-left: 10px;
}

.audio-container {
  flex: 1;
  height: 34px;
  margin-right: 12px;
  padding: 0 10px;

  .audio-btn {
    width: 100%;
    height: 100%;
    background: rgba(66, 128, 250, 0.06);
    border-radius: 6px;
    border: none;
    font-size: 14px;
    font-family: PingFang SC, PingFang SC-Medium;
    text-align: center;
    color: #406cff;
    line-height: 22px;
    outline: none;
    font-weight: bold;
    user-select: none;

    &.acitve {
      background: rgba(66, 128, 250, 0.2);
    }
  }
}

.record-overlay-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  user-select: none;

  .record-text {
    min-height: 80px;
    background: #95ec69;
    margin: 100px auto;
    width: 80%;
    padding: 10px;
    border-radius: 10px;
    font-size: 18px;
  }

  .record-btn {
    height: 100px;
    background: #adadad;
    border-radius: 50% 50% 0 0;

    p {
      text-align: center;
      font-size: 12px;
      color: #232323;
      margin-top: 10px;
    }
  }
}

.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }

  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
    background-color: rgba(0, 0, 0, 0.45);
    padding: 0;
    border-radius: 0;
  }
  .ant-modal-body {
    flex: 1;
  }
}
.other-chat-con {
  max-width: 720px;
  margin: 0 auto 8px;
  display: flex;
  align-items: center;
  p {
    margin-right: 10px;
    padding: 3px 6px;
    font-size: 14px;
    line-height: 22px;
    color: #222222;
    border: 1px solid #d6d2d2;
    border-radius: 20px;
    cursor: pointer;
  }
}
</style>
