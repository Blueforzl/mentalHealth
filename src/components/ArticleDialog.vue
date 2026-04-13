<template>
  <el-dialog
    title="新增文章"
    v-model="props.dialogVisable"
    width="50%"
    @close="handleClose"
  >
    <h1>文章详情</h1>
  </el-dialog>
</template>
<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
</script>