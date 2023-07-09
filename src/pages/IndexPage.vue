<!--suppress ALL -->
<template>
  <div class="index-page">
    <a-input-search
      v-model:value="searchParams.text"
      placeholder="input search text"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
<!--    {{ JSON.stringify(postList) }}-->
    {{ JSON.stringify(userList) }}
    <!-- 不太理解，明天问问gpt  -->
    <MyDivider />
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <a-tab-pane key="user" tab="用户">
        <UserList :user-list="userList"/>
      </a-tab-pane>
      <a-tab-pane key="post" tab="帖子">
        <!--  将后台所获取数据，渲染到postList页面  -->
        <PostList :post-list="postList" />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="图片">
        <PictureList />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">


import { ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import UserList from "@/components/UserList.vue";
import PictureList from "@/components/PictureList.vue";
import MyDivider from "@/components/MyDivider.vue";
import { useRoute, useRouter } from "vue-router";
import * as path from "path";
import Router from "@/router";
import myAxios from "@/plugins/myAxios";

const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);

// post请求必须传递 JSON 参数，哪怕是 {}
myAxios.post("post/list/page/vo", {}).then((res: any) => {
  postList.value = res.records;
  console.log(postList.value);
  console.log(res);
});

// post请求必须传递 JSON 参数，哪怕是 {}
myAxios.post("user/list/page/vo", {}).then((res: any) => {
  userList.value = res.records;
  console.log(userList.value);
  console.log(res);
});

const initSearchParams = {
  text: "",
  pageSize: 10,
  pageNum: 1
};

// 抽象一个搜索关键词
const searchParams = ref(initSearchParams);

const router = useRouter();
const route = useRoute();
// 动态改变
const activeKey = route.params.category;

// 动态监听变量
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    // 将所输入内容，半持久化存储
    text: route.query.text
  } as any; //as any用于覆盖 TypeScript 的类型检查，允许将类型为 any 的值赋给 searchParam.value 对象。
});

const onSearch = (value: string) => {
  alert(value);
  router.push({
    query: searchParams.value
  });
};
const onTabChange = (key: string) => {
  router.push({
    //直接改变 url
    path: `/${key}`,
    query: searchParams.value
  });
};
</script>
