import CryptoJS from 'crypto-js';
// 或者
import RecorderManager1 from '@/assets/js/index.umd';

let RecorderManager = RecorderManager1.RecorderManager1;
console.log(RecorderManager);
/**
 * 获取websocket url
 * 该接口需要后端提供，这里为了方便前端处理
 */
function getWebSocketUrl() {
  // 请求地址根据语种不同变化
  let url = 'wss://iat-api.xfyun.cn/v2/iat';
  let host = 'iat-api.xfyun.cn';
  let apiKey = 'd0f2facbdf41f2d617ed84e5cc966d31';
  let apiSecret = 'NzdjOWRlNDQzNDgxNDZjNjQ4MjhiNTBl';
  let date = new Date().toGMTString();
  let algorithm = 'hmac-sha256';
  let headers = 'host date request-line';
  let signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
  let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
  let signature = CryptoJS.enc.Base64.stringify(signatureSha);
  let authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
  let authorization = btoa(authorizationOrigin);
  url = `${url}?authorization=${authorization}&date=${date}&host=${host}`;
  return url;
}

/**
 * 录音、WebSocket 所有方法
 */
export class XunFeiRecord {
  constructor() {
    this.iatWS = null;
    this.resultText = ''; // 内容
    this.resultTextTemp = ''; // 内容
    this.status = 'pending'; // 转换状态 pending-转换中 success-转换结束
    this.recorder = new RecorderManager('/qanything');
    this.recorder.onStart = () => {
      console.log('录音开始');
      //   this.changeBtnStatus("OPEN");
    };
    this.recorder.onStop = () => {
      console.log('录音停止');
    };
    this.recorder.onFrameRecorded = ({ isLastFrame, frameBuffer }) => {
      if (this.iatWS.readyState === this.iatWS.OPEN) {
        this.iatWS.send(
          JSON.stringify({
            data: {
              status: isLastFrame ? 2 : 1,
              format: 'audio/L16;rate=16000',
              encoding: 'raw',
              audio: this.toBase64(frameBuffer),
            },
          })
        );
        if (isLastFrame) {
          // this.changeBtnStatus("CLOSING");
        }
      }
    };
  }

  // 停止录音
  recordStop() {
    this.recorder.stop();
  }
  // 连接WebSocket
  connectWebSocket(callback) {
    this.resultText = '';
    this.resultTextTemp = '';
    this.status = 'pending';
    const websocketUrl = getWebSocketUrl();
    if ('WebSocket' in window) {
      this.iatWS = new WebSocket(websocketUrl);
    } else if ('MozWebSocket' in window) {
      this.iatWS = new MozWebSocket(websocketUrl);
    } else {
      callback('error', '浏览器不支持WebSocket,功能不可使用');
      return;
    }
    console.log('iatWS', this.iatWS, this.iatWS.url);
    // this.changeBtnStatus("CONNECTING");
    this.iatWS.onopen = () => {
      console.log('onopen');
      this.recorder.start({
        sampleRate: 16000,
        frameSize: 1280,
      });
      let params = {
        common: {
          app_id: '6505c609',
        },
        business: {
          language: 'zh_cn',
          domain: 'iat',
          accent: 'mandarin',
          vad_eos: 5000,
          dwa: 'wpgs',
        },
        data: {
          status: 0,
          format: 'audio/L16;rate=16000',
          encoding: 'raw',
        },
      };
      this.iatWS.send(JSON.stringify(params));
    };
    this.iatWS.onmessage = e => {
      console.log('onmessage', e.data);
      // 识别结束
      let jsonData = JSON.parse(e.data);
      if (jsonData.data && jsonData.data.result) {
        let data = jsonData.data.result;
        let str = '';
        let ws = data.ws;
        for (let i = 0; i < ws.length; i++) {
          str = str + ws[i].cw[0].w;
        }
        // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
        // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
        if (data.pgs) {
          if (data.pgs === 'apd') {
            // 将resultTextTemp同步给resultText
            this.resultText = this.resultTextTemp;
          }
          // 将结果存储在resultTextTemp中
          this.resultTextTemp = this.resultText + str;
        } else {
          this.resultText = this.resultText + str;
        }
        if (data.ls) {
          this.status = 'success';
        }
        callback(this.status, this.resultTextTemp);
      }
      if (jsonData.code === 0 && jsonData.data.status === 2) {
        callback('close');
        this.iatWS.close();
      }
      if (jsonData.code !== 0) {
        callback('close');
        this.iatWS.close();
      }
    };
    this.iatWS.onerror = () => {
      console.log('onerror检测异常，报错！');
      callback('error', '连接发生错误');
      //   this.changeBtnStatus("CLOSED");
      this.recordStop();
    };
    this.iatWS.onclose = () => {
      console.log('onclose进入到关闭');
      callback('close');
      //   this.changeBtnStatus("CLOSED");
      this.recordStop();
    };
  }
  toBase64(buffer) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }
}
