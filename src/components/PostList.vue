<template>
  <a-list item-layout="horizontal" :data-source="props.postList">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :description="item.content">
          <template #title>
            <a href="https://www.antdv.com/">{{ item.title }}</a>
          </template>
          <template #avatar>
            <a-avatar :src="keaifa" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup lang="ts">
import keaifa from "../assets/keaifa.jpg";
import { withDefaults, defineProps } from "vue";

// 定义一个变量
interface Props {
  // 这里先不定义类型
  postList: any[];
}

// 默认赋值
const props = withDefaults(defineProps<Props>(), {
  postList: () => [],
});
</script>

<style scoped>
.keaifa {
  width: 200px;
}
</style>
