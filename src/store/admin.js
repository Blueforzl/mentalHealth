import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useAdminStore = defineStore('admin', () => {
  const isCollapsed = ref(false);
  function toggleCollapsed() {
    isCollapsed.value = !isCollapsed.value;
  }
  return {
    isCollapsed,
    toggleCollapsed,
  };
});
