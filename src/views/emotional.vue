<template>
  <div>
    <PageHead title="情绪日志"> </PageHead>
    <TableSearch :fromItem="fromItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="ID" prop="userId" width="80"> </el-table-column>
      <el-table-column label="会话ID" width="80">
        <template #default="scope">
          <el-avatar :size="40" shape="circle"> {{ scope.row.nickname }}</el-avatar>
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
    <el-dialog v-model="detailDialogVisible" title="情绪日志详情" width="50%" :close-on-click-modal="false">
      <div class="detail-content" v-if="currentDetail">
        <div class="detail-section">
          <h4>用户信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="用户名">{{ currentDetail.username }}</el-descriptions-item>
            <el-descriptions-item label="昵称">{{ currentDetail.nickname }}</el-descriptions-item>
            <el-descriptions-item label="用户ID">{{ currentDetail.userId }}</el-descriptions-item>
            <el-descriptions-item label="记录日期">
              {{ currentDetail.diaryDate }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>情绪状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="情绪评分">
              <el-rate :model-value="currentDetail.moodScore" :max="10" disabled> </el-rate>
            </el-descriptions-item>
            <el-descriptions-item label="主要情绪">
              <el-tag :type="getEmotionTagType(currentDetail.dominantEmotion)">{{
                currentDetail.dominantEmotion || '-'
              }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="睡眠质量"> {{ currentDetail.sleepQuality || '-' }}/5 </el-descriptions-item>
            <el-descriptions-item label="压力等级"> {{ currentDetail.stressLevel || '-' }}/5 </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <h4>日记内容</h4>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="情绪触发因素">
              {{ currentDetail.emotionTriggers || '-' }}
            </el-descriptions-item>
            <el-descriptions-item label="日记内容">
              {{ currentDetail.diaryContent || '-' }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="detail-section">
          <div class="ai-analysis-content">
            <h4>AI情绪分析</h4>
            <el-descriptions :column="2" border>
              <el-descriptions-item label="主要情绪">
                <el-tag :type="getEmotionTagType(aiData.value?.primaryEmotion)">{{
                  aiData.value?.primaryEmotion || '-'
                }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="情绪强度">
                <el-progress
                  :percentage="aiData.value?.emotionScore || 0"
                  :color="(score) => getEmotionScoreColor(score)"
                  :stroke-width="8"
                />
              </el-descriptions-item>
              <el-descriptions-item label="风险等级">
                {{ aiData.value?.riskLevel || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="情绪性质">
                <el-tag :type="aiData.value?.isNegative ? 'danger' : 'success'">
                  {{ aiData.value?.isNegative ? '负面情绪' : '正面情绪' }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <div class="ai-suggesion-section">
            <h5>专业建议</h5>
            <div class="suggestion-content">{{ aiData.value?.suggestion || '-' }}</div>
          </div>
          <div class="ai-risk-content">
            <h5>风险描述</h5>
            <div class="suggestion-content">{{ aiData.value?.riskDescription || '-' }}</div>
          </div>
          <div class="ai-improvement-section">
            <h5>改进建议</h5>
            <ul class="improvement-list">
              <li v-for="(item, index) in aiData.value?.improvementSuggestions || []" :key="index">{{ item }}</li>
            </ul>
          </div>
        </div>
        <div class="detail-session">
          <h4>时间信息</h4>
          <div class="time-info">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="创建时间">{{ currentDetail.createAt }}</el-descriptions-item>
              <el-descriptions-item label="更新时间">{{ currentDetail.updateAt }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import PageHead from '@/components/PageHead.vue';
  import TableSearch from '@/components/TableSearch.vue';
  import { getEmotionPage, deleteEmotion } from '@/api/admin';
  import { ref, onMounted, reactive } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  //列表数据
  const aiData = ref(null);
  const tableData = ref([]);
  const detailDialogVisible = ref(false);
  const currentDetail = ref(null);
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
  const viewDetail = (row) => {
    if (row.aiEmotionAnalysis) {
      aiData.value = JSON.parse(row.aiEmotionAnalysis);
    } else {
      aiData.value = {};
    }
    currentDetail.value = row;
    detailDialogVisible.value = true;
  };
  const handleDelete = async (row) => {
    console.log('删除情绪日志', row);
    try {
      await ElMessageBox.confirm('确定删除情绪日志吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      await deleteEmotion(row.id);
      ElMessage.success('删除成功');
      handleSearch();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除情绪日志失败:', error);
        ElMessage.error('删除情绪日志失败');
      }
    }
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
      console.log(1111);
    } catch (error) {
      console.error('获取情绪日志列表失败:', error);
      ElMessage.error('获取情绪日志列表失败');
    }
  };
  const getEmotionTagType = (emotion) => {
    const emotionTypes = {
      快乐: 'success',
      平静: 'info',
      兴奋: 'warning',
      愤怒: 'danger',
      悲伤: 'info',
      焦虑: 'warning',
    };
    return emotionTypes[emotion] || 'info';
  };

  const getAiEmotionTagType = (emotion) => {
    const emotionTagMap = {
      快乐: 'success',
      平静: 'success',
      兴奋: 'warning',
      满足: 'success',
      愤怒: 'danger',
      悲伤: 'info',
      焦虑: 'warning',
      恐惧: 'danger',
      沮丧: 'info',
      压力: 'warning',
    };
    return emotionTagMap[emotion] || 'info';
  };

  const getEmotionScoreColor = (score) => {
    if (score >= 80) return '#f56c6c';
    if (score >= 60) return '#e6a23c';
    if (score >= 40) return '#909399';
    return '#67c23a';
  };

  const getRiskLevelTagType = (riskLevel) => {
    const riskTagMap = {
      0: 'success',
      1: 'info',
      2: 'warning',
      3: 'danger',
    };
    return riskTagMap[riskLevel] || 'info';
  };

  const getRiskLevelText = (riskLevel) => {
    const riskTextMap = {
      0: '正常',
      1: '关注',
      2: '预警',
      3: '危机',
    };
    return riskTextMap[riskLevel] || '未知风险等级';
  };
</script>
<style lang="scss" scoped>
  .detail-content {
    .detail-section {
      margin-bottom: 24px;

      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 16px;

        i {
          margin-right: 8px;
          color: #409eff;
        }
      }
    }
  }

  // AI分析相关样式
  .ai-analysis-status {
    .ai-status-tag {
      margin-bottom: 4px;

      i {
        margin-right: 4px;
      }
    }

    .ai-analysis-preview {
      font-size: 11px;
      color: #909399;
      margin-top: 2px;
    }
  }

  .ai-analysis-result {
    .ai-keywords-section,
    .ai-suggestion-section,
    .ai-risk-section,
    .ai-improvements-section {
      margin-top: 16px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 4px;

      h5 {
        margin: 0 0 8px 0;
        color: #606266;
        font-size: 14px;
        font-weight: 600;

        i {
          margin-right: 6px;
          color: #909399;
        }
      }
    }

    .keywords-container {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      .keyword-tag {
        background-color: #e1f3d8;
        color: #67c23a;
        border-color: #b3d8a4;
      }
    }

    .suggestion-content,
    .risk-content {
      line-height: 1.6;
      color: #606266;
      background-color: white;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #ebeef5;
    }

    .improvement-list {
      margin: 0;
      padding-left: 20px;

      li {
        margin-bottom: 4px;
        color: #606266;
        line-height: 1.5;
      }
    }

    .ai-analysis-meta {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #ebeef5;

      .analysis-time {
        margin: 0;
        font-size: 12px;
        color: #909399;

        i {
          margin-right: 4px;
        }
      }
    }

    .el-progress {
      .el-progress__text {
        font-size: 12px !important;
      }
    }
  }
</style>
