<script setup lang="ts"></script>

<template>
  <div class="loading-text">
    <span class="dot1"></span>
    <span class="dot2"></span>
    <span class="dot3"></span>
    <span class="dot4"></span>
    <span class="dot5"></span>
  </div>
</template>
<style lang="scss" scoped>
.loading-text {
  display: flex;
  align-items: center;
  justify-content: center;
  > span {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: rgb(185, 183, 183);
    border-radius: 50%;
    & + span {
      margin-left: 5px;
    }
  }
  .dot1 {
    animation: dot 1s infinite;
  }
  .dot2 {
    animation: dot 1s infinite 0.2s;
  }
  .dot3 {
    animation: dot 1s infinite 0.4s;
  }
  .dot4 {
    animation: dot 1s infinite 0.6s;
  }
  .dot5 {
    animation: dot 1s infinite 0.8s;
  }
  @keyframes dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
}
</style>
