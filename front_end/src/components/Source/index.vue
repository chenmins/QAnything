<template>
  <div class="chat-source">
    <a-image v-if="imageArr.includes(sourceType) && sourceUrl" :src="sourceUrl" :preview-mask="false" />
    <HighLightMarkDown v-else-if="sourceType === 'md'" class="txt" :content="textContent" />
    <div v-else class="txt">
      {{ textContent || '暂不支持预览该文件类型' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import HighLightMarkDown from '@/components/HighLightMarkDown.vue';
import { useChatSource } from '@/store/useChatSource';

const { sourceUrl, sourceType, textContent } = storeToRefs(useChatSource());
const imageArr = ['jpg', 'png', 'jpeg'];
</script>

<style lang="scss" scoped>
.chat-source {
  width: 100%;
  min-height: 35vh;
  max-height: calc(90vh - 48px);
  display: flex;

  .txt {
    width: 100%;
    height: auto;
    padding: 15px 20px 30px 20px;
    white-space: pre-wrap;
  }

  :deep(.ant-image) {
    margin: 5px auto;
    max-width: 100%;
  }
}
</style>
