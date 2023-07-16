<!--suppress ALL -->
<template>
  <div class="index-page">
    <a-input-search
      v-model:value="searchParams.text"
      placeholder="请输入搜索关键词"
      enter-button="Search"
      size="large"
      @search="onSearch"
    />
    <!--    {{ JSON.stringify(postList) }}-->
    <!--    {{ JSON.stringify(userList) }}-->
    <!--    {{ JSON.stringify(pictureList) }}-->
    <!-- 不太理解，明天问问gpt  -->
    <MyDivider />
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <a-tab-pane key="user" tab="用户">
        <UserList :user-list="userList" />
      </a-tab-pane>
      <a-tab-pane key="post" tab="帖子">
        <!--  将后台所获取数据，渲染到postList页面  -->
        <PostList :post-list="postList" />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="图片">
        <PictureList :picture-list="pictureList" />
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
import myAxios from "@/plugins/myAxios";

const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);

const router = useRouter();
const route = useRoute();
// 动态改变
const activeKey = route.params.category;

const initSearchParams = {
  text: "",
  pageSize: 10,
  pageNum: 1
};

const loadData = (params: any) => {
  // 查询参数
  const postQuery = {
    ...params,
    searchText: params.text
  };
  // post请求必须传递 JSON 参数，哪怕是 {}
  myAxios.post("post/list/page/vo", postQuery).then((res: any) => {
    postList.value = res.records;
    console.log(postList.value);
    console.log(res);
  });

  // 查询参数
  const userQuery = {
    ...params,
    userName: params.text
  };
  // post请求必须传递 JSON 参数，哪怕是 {}
  myAxios.post("user/list/page/vo", userQuery).then((res: any) => {
    userList.value = res.records;
    console.log(userList.value);
    console.log(res);
  });

  // 查询参数
  const pictureQuery = {
    ...params,
    searchText: params.text
  };
// post请求必须传递 JSON 参数，哪怕是 {}
  myAxios.post("picture/list/page/vo", pictureQuery).then((res: any) => {
    pictureList.value = res.records;
    console.log(pictureList.value);
    console.log(res);
  });
};

// 一个接口加载所有参数
const loadAllData = (params: any) => {
  const searchQuery = {
    ...params,
    searchText: params.text
  };
  myAxios.post("searchAll/list/page/vo", searchQuery).then((res: any) => {
    postList.value = res.postList;
    userList.value = res.userList;
    pictureList.value = res.pictureList;
  });
};

// 抽象一个搜索关键词
const searchParams = ref(initSearchParams);
loadAllData(searchParams);
// 动态监听变量
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    // 将所输入内容，半持久化存储
    text: route.query.text
  } as any; //as any用于覆盖 TypeScript 的类型检查，允许将类型为 any 的值赋给 searchParam.value 对象。
  // loadData(searchParams.value);
  loadAllData(searchParams.value);
});

const onSearch = (value: string) => {
  console.log(value);
  router.push({
    query: searchParams.value,
  });
  loadAllData(searchParams.value);
};

const onTabChange = (key: string) => {
  router.push({
    //直接改变 url
    path: `/${key}`,
    query: searchParams.value,
  });
};
</script>
