<template>
  <div class="col-2  bg-grey-10 text-grey-4">
    <q-list>
      <q-item
        v-ripple
        clickable
        active

      >
      <q-item-section class="vertical-middle text-grey-5 text-h6 text-center" >频道</q-item-section>

        <q-btn
        class="vertical-middle float-right  text-grey-5"
        icon="add"
        @click="addModel"
        />

     </q-item>

     <q-item
        v-ripple
        clickable
        active
        to="/codeflow" exact
      >
        <q-item-section avatar >
          <q-icon
            color="primary"
            class="text-grey-4"
            name="link"
          />
        </q-item-section>
        <q-item-section class="text-grey-4 absolute-center" >Codeflow</q-item-section>
      </q-item>

      <q-item
        v-ripple
        clickable
        active
        to="/codegpt" exact
        @click="onClickcodegpt"
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            class="text-grey-4"
            name="link"
          />
        </q-item-section>
        <q-item-section class="text-grey-4 absolute-center">Codegpt</q-item-section>
      </q-item>

      <q-item
        v-ripple
        clickable
        active
        to="/devops" exact
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            class="text-grey-4"
            name="link"
          />
        </q-item-section>
        <q-item-section class="text-grey-4 absolute-center">Devops</q-item-section>
      </q-item>

      <q-item
        v-for="model in modelList"
        :key="model.id"
        v-ripple
        clickable
        active
        to="/" exact
      >
        <q-item-section avatar>
          <q-icon
            color="primary"
            class="text-grey-4"
            name="link"
          />
        </q-item-section>
        <q-item-section class="text-grey-4 absolute-center">{{ model.name }}</q-item-section>
      </q-item>


    </q-list>

  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { ref } from "vue";


const router = useRouter()
// import router from './router/index.js'



// 模型列表数据
const modelList = ref([
  {
    id: 0,
    name: "Chat"
  } // 初始模型选项
]);

const onClickcodegpt = () => {
  router.push({ path: "/codegpt" });
};

const addModel = () => {
  const modelId = modelList.value.length + 1;
  const modelName = "Channel " + modelId;
  modelList.value.push({ id: modelId, name: modelName });

  // 添加新的 chat 页面路由
  // router.addRoute({
  //   path: '/chat/' + modelId,
  //   component: () => import('./Chat.vue') // 替换为 Chat 组件的路径和文件名
  // })
};
</script>

<style scoped>
.bg-brand {
  background: #383838 !important;
}
</style>