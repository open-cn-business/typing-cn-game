<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
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
  <RouterView />
</template>

<style scoped>
</style>
