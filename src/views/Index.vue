<template>
  <div id="index-container" ref="view2D" class="index-container">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="3D view" name="view3D"><router-view name="preview"></router-view></el-tab-pane>
      <el-tab-pane label="2D view" name="view2D">
        <router-view name="edit"></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { TabsPaneContext } from "element-plus";

const router = useRouter();
const route = useRoute();
const activeName = ref("view3D");
const handleClick = (tab: TabsPaneContext, event: Event) => {
  if (tab.paneName === "view2D") {
    router.push({ name: "edit" });
  } else if (tab.paneName === "view3D") {
    router.push({ name: "preview" });
  }
};
watchEffect(() => {
  console.log(route.name);
  if (route.name === "preview") {
    activeName.value = "view3D";
  } else if (route.name === "edit") {
    activeName.value = "view2D";
  }
});
onMounted(() => {
  //
});
</script>

<style lang="scss">
.index-container {
  width: 100%;
  height: 100%;
  .el-tabs {
    width: 100%;
    height: 100%;
    .el-tabs__header {
      margin: 0;
    }
    .el-tabs__content {
      width: 100%;
      height: calc(100% - 55px);
      .el-tab-pane {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
