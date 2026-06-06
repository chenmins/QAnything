<template>
  <Teleport to="body">
    <a-modal
      v-model:open="chatSourceVisible"
      centered
      :title="common.dataSource"
      wrap-class-name="chat-source-modal"
      :footer="null"
    >
      <Source />
    </a-modal>
  </Teleport>
</template>

<script lang="ts" setup>
import Source from './Source/index.vue';
import { useChatSource } from '@/store/useChatSource';
import { getLanguage } from '@/language/index';

const common = getLanguage().common;
const { chatSourceVisible } = storeToRefs(useChatSource());
</script>
