<template>
  <div class="common-layout">
    <el-container>
      <el-main ref="mainRef" id="main">
        <el-scrollbar ref="scrollbarRef">
          <div class="show-message" ref="showMessageBoxRef" id="show-message">
            <div v-for="mess in messageGroup" :key="mess + ''">
              <el-row
                class="my-row"
                :gutter="20"
                style="margin: 2rem 0"
                v-if="mess?.role === 'AI'"
                justify="start"
              >
                <el-avatar style="margin-right: 20px"> {{ mess?.role }} </el-avatar>
                <div>
                  <el-card class="box-card" style="max-width: 80vw">
                    <MdPreview
                      :modelValue="mess?.message"
                      readOnly
                      disabled
                      :toolbars="[]"
                      :footers="[]"
                      class="myEditor"
                    />
                  </el-card>
                </div>
              </el-row>
              <el-row class="my-row" :gutter="20" style="margin: 2rem 0" justify="end" v-else>
                <div>
                  <el-card class="box-card" style="max-width: 80vw">
                    <MdPreview
                      :modelValue="mess?.message"
                      readOnly
                      disabled
                      :toolbars="[]"
                      :footers="[]"
                      class="myEditor"
                    />
                  </el-card>
                </div>
                <el-avatar style="margin-left: 20px"> {{ mess?.role }} </el-avatar>
              </el-row>
            </div>
          </div>
        </el-scrollbar>
      </el-main>
      <el-footer>
        <el-row style="height: 40px">
          <el-avatar style="margin-bottom: 5px; margin-right: 5px" :size="30" v-if="isLoading">
            {{ 'AI' }}
          </el-avatar>
          <MyLoading style="margin-bottom: 5px" v-if="isLoading" />
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-input
              v-model="input"
              type="textarea"
              placeholder="Please input"
              :autosize="{ minRows: 2, maxRows: 8 }"
              resize="none"
              @input="watchWindowHeight"
              @keydown.enter.prevent.exact="enterKeyCodeFn"
              @keydown.shift.enter.prevent.exact="shiftEnterKeyCodeFn"
            />
          </el-col>
          <el-col :span="1"> </el-col>
        </el-row>
        <div class="button-box">
          <el-button type="info" @click="emptyFn">Empty</el-button>
          <el-button type="primary" @click="sendFn" style="margin-left: 20px" :disabled="!input"
            >Send</el-button
          >
          <el-icon :size="20" @click="playRecord"><Microphone /></el-icon>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script setup>
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import MyLoading from './components/LoadingStyle.vue'
import Recorder from 'js-audio-recorder'
import Player from 'js-audio-recorder/src/player/player'
import { requestWithFetch } from '@/util/fetch'
import { ref, nextTick, onBeforeUnmount, onMounted, onUnmounted } from 'vue'

const messageGroup = ref([])
const isLoading = ref(false)
const input = ref('')
const scrollbarRef = ref(null)

const watchWindowHeight = () => {
  nextTick(() => {
    scrollbarRef.value?.scrollTo({
      top: 9999,
      left: 0,
      behavior: 'smooth'
    })
  })
}
const enterKeyCodeFn = () => {
  if (input.value) sendFn()
}
const shiftEnterKeyCodeFn = () => {
  input.value += '\n'
}
const emptyFn = () => {}
const sendFn = async () => {}

let recorder = null
const playRecord = async () => {
  let wavFile = await fetch('/wavs/LJ001-0001.wav')
  let wavblob = await wavFile.blob()

  // 播放音频
  // let wavbuffer = await wavblob.arrayBuffer()
  // Player.play(wavbuffer)
  let data = new FormData()
  data.append('file', wavblob, 'LJ001-0001.wav')
  let res = await fetch('http://localhost:5000/SpeechToText', {
    method: 'POST',
    body: data
  })
  let resJson = await res.json()
  input.value = resJson.message
}
onMounted(() => {
  recorder = new Recorder()
})

onUnmounted(() => {
  recorder.destroy().then(() => {
    recorder = null
  })
})
</script>
<style lang="scss" scoped>
.common-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

:deep(.el-main) {
  padding: 0;
  width: 100vw;
  height: 80vh;
}

:deep(.el-card__body) {
  padding: 0 10px;
}

.show-message {
  min-height: 75vh;
  .myEditor {
    width: 100%;
    height: 100%;
    border: none;
  }

  :deep(.md-editor-preview-wrapper) {
    padding: 0;
    height: auto;
  }
  :deep(.el-button) {
    padding-bottom: 10px;
  }
}
:deep(.el-footer) {
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0px 40px 10px;
}

.my-row {
  padding: 0 2rem;
  flex-wrap: nowrap;
  flex-direction: row;
}

.el-card__body {
  padding: 0 2rem;
}

.button-box {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
