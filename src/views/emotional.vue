<template>
  <div>
    <PageHead title="情绪日志"> </PageHead>
    <TableSearch :fromItem="fromItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="ID" prop="userId" width="80"> </el-table-column>
      <el-table-column label="会话ID" width="80">
        <template #default="scope">
          <el-avatar :size="40" :shape="circle"> {{ scope.row.nickname }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="记录日期" prop="diaryDate" width="180" />
      <el-table-column label="情绪评分">
        <template #default="scope">
          <el-rate :model-value="scope.row.moodScore" :max="10" disabled> </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="生活指标" width="100">
        <template #default="scope">
          <div>
            <p>睡眠: {{ scope.row.sleepQuality }}/5</p>
            <p>压力: {{ scope.row.stressLevel }}/5</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="emotionTriggers" label="情绪触发因素" width="200" />
      <el-table-column prop="diaryContent" label="日记内容" width="200" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="viewDetail(scope.row)" text type="primary">详情</el-button>
          <el-button @click="handleDelete(scope.row)" text type="danger">删除</el-button>
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
  import PageHead from '@/components/PageHead.vue';
  import TableSearch from '@/components/TableSearch.vue';
  import { getEmotionPage } from '@/api/admin';
  import { ref, onMounted, reactive } from 'vue';
  //列表数据

  const tableData = ref([]);
  const pagenation = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
  });
  const fromItem = [
    {
      component: 'el-input',
      label: '用户ID',
      prop: 'userId',
      placeholder: '请输入用户ID',
    },
    {
      component: 'el-select',
      label: '情绪评分',
      prop: 'moodScreRange',
      placeholder: '请选择情绪评分范围',
      options: [
        {
          label: '低分(1-3)',
          value: '1-3',
        },
        {
          label: '中分(4-6)',
          value: '4-6',
        },
        {
          label: '高分(7-10)',
          value: '7-10',
        },
      ],
    },
  ];
  onMounted(() => {
    handleSearch();
  });
  const handleChange = (page) => {
    pagenation.currentPage = page;
    handleSearch();
  };
  const handleSearch = async (data) => {
    const params = {
      ...pagenation,
      ...data,
    };
    try {
      const { records, total } = await getEmotionPage(params);
      tableData.value = records;
      pagenation.total = total;
    } catch (error) {
      console.error('获取情绪日志列表失败:', error);
      ElMessage.error('获取情绪日志列表失败');
    }
  };
</script>
<style lang="scss" scoped></style>
