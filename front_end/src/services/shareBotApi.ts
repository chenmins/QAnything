const apiBase = import.meta.env.VITE_APP_MODE === 'dev' ? '' : import.meta.env.VITE_APP_API_HOST || '';

// Share page is constrained to exactly these two backend APIs.
export const GET_BOT_INFO_PATH = '/share/local_doc_qa/get_bot_info';
export const LOCAL_DOC_CHAT_PATH = '/share/local_doc_qa/local_doc_chat';

export const getShareApiUrl = (path: string) => `${apiBase}${path}`;

const postJson = async (path: string, body: Record<string, any>, option: RequestInit = {}) => {
  const res = await fetch(getShareApiUrl(path), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    ...option,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
};

export const getShareBotInfo = (botId: string) => {
  return postJson(GET_BOT_INFO_PATH, {
    user_id: 'share',
    user_info: 'share',
    bot_id: botId,
  });
};

export const localDocChat = (params: Record<string, any>, option: RequestInit = {}) => {
  return postJson(LOCAL_DOC_CHAT_PATH, params, option);
};
