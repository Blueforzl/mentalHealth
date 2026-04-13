<template>
  <div class="pageHead">
    <p class="pageTitle">{{ props.title }}</p>
    <div class="actionButtion">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "页面标题",
  },
});
</script>
<style lang="scss" scoped>
.pageHead {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .pageTitle {
    font-size: 24px;
    color: #2d3748;
    margin-bottom: 10px;
  }
}
.actionButtion {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>