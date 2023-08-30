<script setup lang="ts">
import Chat from './components/Chat.vue'
import Login from './components/Login.vue'

</script>

<template>
  <KeepAlive>
    <router-view></router-view>
  </KeepAlive>
</template>

<style>
#app {
  height: 100% !important;
}

</style>
