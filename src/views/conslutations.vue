<template>
  <div class="conslutations">
    <PageHead title="咨询记录"> </PageHead>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar :src="scope.row.userNickname" :size="30" />
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="sessionTitle">
            {{ scope.row.sessionTitle }}
          </div>
          <div class="sessionPreview">
            {{ scope.row.lastMessageContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="200" />
      <el-table-column prop="lastMessageTime" label="时间" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button @click="viewDetail" text type="primary">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px"
      layout="prev, pager, next"
      :page-size="pagenation.size"
      :total="pagenation.total"
      @change="handleChange"
    />
  </div>
</template>
<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import PageHead from '@/components/PageHead.vue';
  import { sessionPage } from '@/api/admin';
  const tableData = ref([]);
  const pagenation = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
  });
  onMounted(async () => {
    const { records, total } = await sessionPage(pagenation);
    tableData.value = records;
    pagenation.total = total;
  });
  const viewDetail = (row) => {
    console.log(row);
  };
  const handleChange = (page) => {
    pagenation.currentPage = page;
    handleSearch();
  };
  const handleSearch = async () => {
    const { records, total } = await sessionPage(pagenation);
    tableData.value = records;
    pagenation.total = total;
  };
</script>
<style lang="scss" scoped></style>
