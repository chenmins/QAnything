<template>
  <div>
    <div v-if="thinkHtml.length" class="think-container">
      <div class="think-head" @click="changeArrow">
        <p class="think-text">已深度思考</p>
        <img v-show="showThinkC" src="@/assets/bots/arrow-bottom.png" alt="" />
        <img v-show="!showThinkC" src="@/assets/bots/arrow-top.png" alt="" />
      </div>
      <p v-show="showThinkC" class="think-content">
        {{ thinkHtml }}
      </p>
    </div>
    <div class="high-light-comp" v-html="html"></div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, watch } from 'vue';
import 'highlight.js/styles/stackoverflow-dark.css';
// import showdown from 'showdown';
import hljs from 'highlight.js';
import MarkdownIt from 'markdown-it';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  showCode: {
    type: Boolean,
    default: false,
  },
  showThink: {
    type: Boolean,
    default: true,
  },
});

// 使用markdown-it实例并开启highlight.js支持
const md = new MarkdownIt({
  html: true,
  breaks: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(str, { language: lang }).value +
          '</code></pre>'
        );
      } catch (__) {
        console.log('markdown-err');
      }
    }
    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>'; // 使用默认的转义
  },
});

// const converter = new showdown.Converter();

//格式化think标签
const extractStrings = str => {
  const regex = /<think>(.*?)<\/think>(.*)|<think>(.*)|^(?!<think>)([\s\S]*)$/s;
  const matches = str.match(regex);
  if (matches) {
    return {
      first: matches[1] || matches[3] || '',
      second: matches[2] || matches[4] || '',
    };
  }
  return {
    first: '',
    second: '',
  };
};

const emit = defineEmits(['changeShowThink']);

const changeArrow = () => {
  emit('changeShowThink', !props.showThink);
};

const html = ref('');
const thinkHtml = ref('');
watch(
  () => props.content,
  newvalue => {
    let formatObj = extractStrings(newvalue);
    html.value = md.render(formatObj.second || '');
    thinkHtml.value = formatObj.first || '';
  },
  { immediate: true }
);
watch(
  () => props.showCode,
  newvalue => {
    nextTick(() => {
      if (newvalue) {
        document.querySelectorAll('pre code').forEach(() => {
          hljs.highlightAll();
        });
      }
    });
  },
  { immediate: true }
);
const showThinkC = ref(true);
watch(
  () => props.showThink,
  newvalue => {
    showThinkC.value = newvalue;
  },
  { immediate: true }
);
</script>
<style>
.high-light-comp {
  user-select: text;
  word-break: break-all;
}

.high-light-comp ul,
.high-light-comp ol {
  padding-left: 20px;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.high-light-comp li {
  list-style-position: inside;
  list-style-type: disc;
  word-break: break-all;
  /* white-space: pre-line; */

  p {
    margin: 0;
    display: inline;
  }
}

.high-light-comp table {
  border-collapse: collapse;
  border-spacing: 0;
}

.high-light-comp tr th {
  background-color: #f0f0f0;
  border: 1px solid #dbdbdb;
  border-bottom: solid 2px #bfbfbf;
  padding: 8px;
  /* text-align: left; */
  margin: 0;
}

.hight-light-comp td {
  border: 1px solid #dbdbdb;
  padding: 4px;
  text-align: center;
}

.hight-light-comp a {
  color: blue;
}

.hljs {
  background: #333;
  color: #f0f0f0;
  padding: 20px;
  overflow-x: auto;
}

.hight-light-comp p {
  word-wrap: break-word;
  line-break: anywhere;
  word-break: break-all;
  white-space: pre-line;
}
.think-container img {
  width: 12px;
  margin-left: 6px;
}
.think-text {
  color: #90a0af;
  font-size: 12px;
}
.think-head {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.think-content {
  color: #90a0af;
  line-height: 18px;
  margin: 5px 0;
  font-size: 12px;
}
</style>
