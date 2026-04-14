<template>
  <el-form ref="ruleformRef" :model="formData">
    <el-row :gutter="24">
      <template v-for="item in fromItemAttrs" :key="item.prop">
        <el-col v-bind="item.col">
          <el-form-item :label="item.label" :prop="item.prop">
            <component :is="item.component" v-model="formData[item.prop]" :placeholder="item.placeholder">
              <template v-if="item.component === 'el-select'">
                <el-option
                  v-for="option in item.options"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </template>
            </component>
          </el-form-item>
        </el-col>
      </template>
    </el-row>
    <el-row :gutter="24">
      <el-button type="primary" @click="handleSearch(formData)">查询</el-button>
      <el-button @click="handleReset(ruleformRef)">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  const emit = defineEmits(['search']);
  const ruleformRef = ref(null);
  const formData = reactive({
    title: '',
    category: '',
  });
  onMounted(() => {
    handleSearch(formData);
  });
  const fromItemAttrs = computed(() => {
    const { fromItem } = props;
    fromItem.forEach((item) => {
      item.col = { xs: 24, sm: 12, md: 8, lg: 6, xl: 6 };
    });
    return fromItem;
  });
  const props = defineProps({
    fromItem: {
      type: Array,
      default: () => [],
    },
  });
  const handleSearch = (data) => {
    console.log(data);
    emit('search', data);
  };
  const handleReset = (formEl) => {
    if (!formEl) return;
    formEl.resetFields();
    emit('search', data);
  };
</script>
<style lang="scss" scoped></style>
