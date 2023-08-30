<template>
  <div class="container row full-height">
    <ModelList />
    <div class="container col-10 column items-center  full-height bg-brand text-brand">
      <q-scroll-area
        ref="scrollRef"
        class="scroll-area q-px-md col-grow row-grow "
      >
        <!-- <q-list
          padding
        >
          <q-item-label header class="text-brand ">
            CRISPE Prompt 框架
          </q-item-label>
          <q-item >
            <q-item-section >
              <q-item-label overline class="text-brand ">
                Capacity and Role
              </q-item-label>
              <q-item-label caption class="text-brand ">
                What role (or roles) should ChatGPT act as?
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item >
            <q-item-section>
              <q-item-label overline class="text-brand ">
                Insight
              </q-item-label>
              <q-item-label caption class="text-brand ">
                Provides the behind the scenes insight, background, and context to your request.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline class="text-brand ">
                Statement
              </q-item-label>
              <q-item-label caption class="text-brand ">
                What you are asking ChatGPT to do.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline class="text-brand ">
                Personality
              </q-item-label>
              <q-item-label caption class="text-brand ">
                The style, personality, or manner you want ChatGPT to respond in.
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label overline class="text-brand ">
                Experiment
              </q-item-label>
              <q-item-label caption class="text-brand ">
                Asking ChatGPT to provide multiple examples to you.
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list> -->
        <div class="row q-gutter-md q-px-md bg-brand">
          <q-btn
            v-for="item in promptTips"
            :key="item.label"
            rounded
            @click="promptTip(item)"
          >
            {{ item.label }}
          </q-btn>
        </div>
        <q-chat-message
          v-for="(message, idx) in messageArr"
          :key="idx"
          :avatar="message.sender === 'you' ? meUrl:chatUrl"
          :text="message.sender === 'you'? [message.message]: [markedMessage(message.message)]"
          :name="message.sender === 'you'?'me':'CodeGPT'"
          :sent="message.sender === 'you'"
          :text-html="message.sender === 'bot'"
          class="text-body1"
          bg-color="grey-9"
          text-color = "grey-1"
        />
        <div
          v-show="messageArr.length > 0 && !sendDisabled"
          class="row q-pl-xl q-pb-md bg-brand"
        >
          <q-btn
            color="blue-grey-7"
            rounded
            @click="retry"
          >
            重新回答
          </q-btn>
        </div>
      </q-scroll-area>
      <q-separator class="full-width bg-brand" />
      <div
        ref="inputRef"
        class="footer full-width q-pt-md q-pb-none bg-grey-1 q-px-sm bg-brand"
        style="position: relative;"
      >
        <q-list
          v-show="computedPromptArr.length > 0"
          bordered
          separator
          class="rounded-borders bg-brand"
          style="position: absolute;left: 0;top: 0;transform: translate(60px, calc(-100% + 14px));background-color: white; z-index: 1;"
        >
          <q-item
            v-for="(item, index) in computedPromptArr"
            :key="item"
            clickable
            dense
            :active="promptActive === index"
          >
            <q-item-section>{{ item }}</q-item-section>
          </q-item>
        </q-list>
        <q-input
          color="blue-grey-7"
          bg-color = "grey-9"
          v-model="newMessage"
          bottom-slots
          rounded
          dark
          outlined
          prefix="/codeflow  "
          placeholder="请在此输入您的问题"
          class="full-width"
          @keyup.enter="add"
          @keydown.up.prevent="keyUp"
          @keydown.down.prevent="keyDown"
        >
          <template #before>
            <q-avatar>
              <img src="../assets/chatgirl.png">
            </q-avatar>
          </template>

          <template #append>
            <q-icon
              v-if="newMessage !== ''"
              name="close"
              class="cursor-pointer"
              @click="newMessage = ''"
            />
          </template>


          <template #after>
            <q-btn
              color="blue-grey-7"
              round
              dense
              flat
              icon="send"
              :disable="sendDisabled"
              @click="add"
            />
            <q-btn
              color="blue-grey-7"
              round
              dense
              flat
              icon="replay"
              @click="clear"
            />
          </template>
        </q-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from '@vue/reactivity'
import { QScrollArea, useQuasar } from 'quasar'
import { onMounted, onUnmounted, onUpdated, reactive, ref, watch } from 'vue'
import {marked} from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import meUrl from '../assets/chatgirl.png'
import chatUrl from '../assets/chatbot.png'
import ModelList from './ModelList.vue'
interface WSMessage {
  sender: string
  type: string
  message: string
}
interface PromptTip {
  label: string
  command: string
}

const scrollRef = ref< QScrollArea | null >(null)
const inputRef = ref< HTMLDivElement | null>(null)
const newMessage = ref('')
const messageArr = ref <Array<WSMessage>>([])
const sendDisabled = ref(false)
const $q = useQuasar()
const promptArr = ['chatgpt', 'codeflow','help','devops','?','h']
const promptActive = ref(0)
let commandTag = ''
// const helpStr2 = {
//   sender: 'bot',
//   message: '### 主要特性- 支持“标准”Markdown / CommonMark和Github风格的语法，也可变身为代码编辑器；- 支持实时预览、图片（跨域）上传、预格式文本/代码/表格插入、代码折叠、搜索替换、只读模式、自定义样式主题和多语言语法高亮等功能；- 支持ToC（Table of Contents）、Emoji表情、Task lists、@链接等Markdown扩展语法；- 支持TeX科学公式（基于KaTeX）、流程图 Flowchart 和 时序图 Sequence Diagram;- 支持识别和解析HTML标签，并且支持自定义过滤标签解析，具有可靠的安全性和几乎无限的扩展性；- 支持 AMD / CMD 模块化加载（支持 Require.js & Sea.js），并且支持自定义扩展插件；- 兼容主流的浏览器（IE8+）和Zepto.js，且支持iPad等平板设备；- 支持自定义主题样式；',
//   type: 'end'
// }
const helpStr={
      sender: 'bot',
      message: `> Help
>>/?
>>/h
>>/help

> 对齐
>>/codeflow [prompt]

>>/codeflow 登录鉴权 FAQ
>>/codeflow 工作空间 FAQ
>>/codeflow 终端连接 FAQ

> 快马
>>/codegpt [prompt]

> 行者
>>/distbuild [prompt]

> 磐石
>>/metalflow [prompt]

> 云测
>>/pandora [prompt]

> 品味
>>/pingview [prompt]

> 飞云
>>/pipeflow [prompt]

> DevOps
>>/devops [prompt]

> DevOps: 创建分支
>>/devops create gerrit:{gerrit-name} project:{project-name} branch:{branch-name}

> DevOps: 获取 CI 信息
>>/devops fetch ci

> DevOps: 获取项目信息
>>/devops fetch gerrit:{gerrit-name} project:{project-name}

> DevOps: 获取日志信息
>>/devops fetch gerrit:{gerrit-name} log

> DevOps: 提交单据
>>/devops submit gerrit:{gerrit-name} change:{change-id}`,
      type: 'end'
    }
const promptTips: PromptTip[] = [{label: 'codeflow 登录鉴权 FAQ', command: 'codeflow'}, {label: 'codeflow 工作空间 FAQ', command: 'codeflow'}, {label: 'codeflow 终端连接 FAQ', command: 'codeflow'}]
const computedPromptArr = computed(() => {
  if (newMessage.value.startsWith('/')) {
    const len = newMessage.value.length
    const str = newMessage.value.slice(1, len)
    return promptArr.filter((item) => item.includes(str))
  }
  return []
})

watch(computedPromptArr, () => {
  promptActive.value = 0
})


marked.setOptions({
  highlight: function (code: string) {
    return hljs.highlightAuto(code).value
  }
})
const websocketRef = reactive<{
  socket: WebSocket | null
}>({
  socket: null
})

const markedMessage = (msg: string) => {
  if (msg === '') {
    return '思考中 ...'
  }
  return marked.parse(msg)
}

let lastSendData = {
  command: '',
  prompt: ''
}

const add = async() => {
  if (computedPromptArr.value.length > 0) {
    commandTag = computedPromptArr.value[promptActive.value]
    newMessage.value = '/' + computedPromptArr.value[promptActive.value] + '  '
  } else if (newMessage.value !== '' && sendDisabled.value === false) {
    if (websocketRef.socket?.readyState === WebSocket.CLOSED) {
      await createSocket()
    }
    if(newMessage.value === '/help  '||newMessage.value === '/h  ' || newMessage.value === '/?  '){
      messageArr.value.push({
        sender: 'you',
        message: newMessage.value,
        type: 'end'
      })
      messageArr.value.push(helpStr)
      newMessage.value = ''
      sendDisabled.value = false
      commandTag = ''
      setTimeout(() => {
        scrollRef.value?.setScrollPercentage('vertical', 1)
      }, 300)
    }else{
      newMessage.value = '/codeflow  '+ newMessage.value
      const sendData = {
      command: promptArr[0],
      prompt: newMessage.value
      }
      if (commandTag.length > 0) {
        const len = 1 + commandTag.length + 2
        sendData.prompt = newMessage.value.slice(len, newMessage.value.length)
        sendData.command = commandTag
      }
      lastSendData = sendData

      websocketRef.socket?.send(JSON.stringify(sendData))
      messageArr.value.push({
        sender: 'you',
        message: newMessage.value,
        type: 'end'
      })
      newMessage.value = ''
      sendDisabled.value = true
      commandTag = ''
      setTimeout(() => {
        scrollRef.value?.setScrollPercentage('vertical', 1)
      }, 300)
    }

  }
}
const clear = () => {
  messageArr.value = []
}
const keyUp = async() => {
  const len = computedPromptArr.value.length
  if (len > 0) {
    if (promptActive.value > 0) {
      promptActive.value = promptActive.value - 1
    } else {
      promptActive.value = len - 1
    }
  }
}
const keyDown = async() => {
  const len = computedPromptArr.value.length
  if (promptActive.value < len - 1) {
    promptActive.value = promptActive.value + 1
  } else {
    promptActive.value = 0
  }
}

const createSocket = async () => {
  websocketRef.socket = await new WebSocket(import.meta.env.VITE_CHAT_URL)
  websocketRef.socket.onopen = () => {
    console.log('websocket open')
  }
  websocketRef.socket.onmessage = (ev: MessageEvent) => {
    const data = JSON.parse(ev.data) as WSMessage
    if (data.type === 'start' && data.sender === 'bot') {
      messageArr.value.push(data)
      setTimeout(() => {
        scrollRef.value?.setScrollPercentage('vertical', 1)
      }, 300)
    } else if (data.type === 'stream') {
      if (data.sender === 'bot') {
        const len = messageArr.value.length
        if (len > 0) {
          messageArr.value[len - 1].message += data.message
        }
      }
      setTimeout(() => {
        scrollRef.value?.setScrollPercentage('vertical', 1)
      }, 300)
    } else if (data.type === 'end') {
      sendDisabled.value = false
      setTimeout(() => {
        scrollRef.value?.setScrollPercentage('vertical', 1)
      }, 300)
    } else if (data.type === 'error') {
      sendDisabled.value = false
      $q.notify({
        message: 'CodeGPT运行出错:' + data.message,
        type: 'negative',
        timeout: 5000
      })
      const len = messageArr.value.length
      if (len > 0) {
        messageArr.value[len - 1].message += `[CodeGPT运行出错: ${data.message}]`
      }
    }
  }
  websocketRef.socket.onclose = () => {
    sendDisabled.value = false
    console.log('websocket close')
  }
  websocketRef.socket.onerror = (ev: Event) => {
    sendDisabled.value = false
    console.log('websocket error', ev)
    $q.notify({
      message: 'CodeGPT运行出错:' + ev,
      type: 'negative',
      timeout: 5000
    })
    const len = messageArr.value.length
    if (len > 0) {
      messageArr.value[len - 1].message += '[ERROR]'
    }

  }

}

const promptTip = (tip: PromptTip) => {
  commandTag = tip.command
  newMessage.value = '/' + tip.command + '  ' + tip.label
  add()
}

const retry = () => {
  commandTag = lastSendData.command
  newMessage.value = '/' + lastSendData.command + '  ' + lastSendData.prompt
  add()

}


onMounted(() => {
  scrollRef.value?.setScrollPercentage('vertical', 1)
  createSocket()
})

onUnmounted(() => {
  websocketRef.socket?.close()
})


</script>

<style scoped lang="scss">
.container {
  min-width: 500px;
  .scroll-area {
    width: 100%;
  }
}
.bg-brand {
  background: #383838 !important;
}
.text-brand {
  color: #efefef !important;
}
.butten-brand {
  color: #6b839d !important;
}
</style>
