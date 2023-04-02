<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import {onMounted} from "vue";
import { APITable } from "apitable";
// 如果不能使用 es6 import，可用 const Vika = require('@vikadata/vika').default; 代替
import { Vika } from "@vikadata/vika";


onMounted(() => {
  console.log('component load');
  const apitable  = new APITable({ token: "uskC5N39PU3niM28XOfNgnF"});
  // 通过 datasheetId 来指定要从哪张表格操作数据。
  const datasheet = apitable.datasheet("dst8WkATpJxh4MtbaC");

  // 获取 viwdgAaEFvbCj 视图下的记录, 默认返回第一页。
  datasheet.records.query({ viewId: "viwdgAaEFvbCj"}).then(response => {
    if (response.success) {
      console.log(response.data);
    } else {
      console.error(response);
    }
  });


  const vika = new Vika({ token: "uskM9c6MzfkHMeCJVipM1zv", fieldKey: "name" });
// 通过 datasheetId 来指定要从哪张维格表操作数据。
  const datasheet2 = vika.datasheet("dstLaYMb81A4xgMwGQ");

  // 获取 viwDXMqPUSPg4 视图下的记录, 默认返回第一页。
  datasheet2.records.query({ viewId: "viwDXMqPUSPg4"}).then(response => {
    if (response.success) {
      console.log(response.data);
    } else {
      console.error(response);
    }
  });


})
</script>

<template>
  <header>
    <div class="wrapper">
      <HelloWorld msg="Hello World" />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
