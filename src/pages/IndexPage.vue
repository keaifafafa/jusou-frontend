<!--suppress ALL -->
<template>
  <div class="index-page">
    <a-input-search
      v-model:value="searchText"
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
import { message } from "ant-design-vue";

const postList = ref([]);
const userList = ref([]);
const pictureList = ref([]);

const router = useRouter();
const route = useRoute();
// 动态改变
const activeKey = route.params.category;

const initSearchParams = {
  type: activeKey,
  text: "",
  pageSize: 10,
  pageNum: 1
};

const searchText = ref(route.query.text || "");

/**
 * 加载单个类型的数据
 * @param params
 */
const loadData = (params: any) => {
  // 根据type来判断，需要查询那个接口。
  const { type } = params;
  if(!type) {
    message.error("类型为空！");
    return;
  }
  const query = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("searchAll/list/page/vo", query).then((res: any) => {
    if (type === "post") {
      postList.value = res.dataList;
    } else if (type === "user") {
      userList.value = res.dataList;
    } else if (type === "picture") {
      pictureList.value = res.dataList;
    }
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
  loadData(searchParams.value);
  // loadAllData(searchParams.value);
});

const onSearch = (value: string) => {
  console.log(value);
  router.push({
    query: {
      ...searchParams.value,
      text: value,
    },
  });
  loadAllData(searchParams.value);
};

const onTabChange = (key: string) => {
  router.push({
    //直接改变 url
    path: `/${key}`,
    query: searchParams.value
  });
};
</script>
