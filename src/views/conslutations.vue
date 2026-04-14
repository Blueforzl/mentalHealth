<template>
  <div class="conslutations">
    <PageHead title="咨询记录"> </PageHead>
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="会话ID" width="100">
        <template #default="scope">
          <el-avatar :size="30">{{ scope.row.userNickname ? scope.row.userNickname.charAt(0) : 'U' }}</el-avatar>
        </template>
      </el-table-column>
      <el-table-column label="情绪日志">
        <template #default="scope">
          <div class="session-title">
            {{ scope.row.sessionTitle }}
          </div>
          <div class="session-preview">
            {{ scope.row.lastMessageContent }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="messageCount" label="消息数" width="200" />
      <el-table-column prop="lastMessageTime" label="时间" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button @click="viewDetail(scope.row)" text type="primary">查看详情</el-button>
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
    <el-dialog click-on-click-modal="false" v-model="showDetailDialog" title="咨询记录详情" width="50%">
      <div class="session-detail">
        <div class="detail-header">
          <div class="detail-row">
            <div class="detail-label">用户：</div>
            <div class="detail-value">{{ sessionDetailData.userNickname }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">时间：</div>
            <div class="detail-value">{{ sessionDetailData.startedAt }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">消息数：</div>
            <div class="detail-value">{{ sessionDetailData.messageCount }}</div>
          </div>
        </div>
        <div class="messages-container">
          <div class="messages-header">
            <h4>对话记录</h4>
          </div>
          <div class="messages-list" v-loading="loadingMessage">
            <div
              v-for="item in sessionMessage"
              class="message-item"
              :class="item.senderType === 1 ? 'user-message' : 'ai-message'"
              :key="item.id"
            >
              <div class="message-header">
                <span class="sender">{{ item.senderType === 1 ? '用户' : 'AI助手' }}</span>
                <span class="time">{{ item.sendTime }}</span>
              </div>
              <div class="message-content">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
  import { ref, onMounted, reactive } from 'vue';
  import PageHead from '@/components/PageHead.vue';
  import { sessionPage, sessionDetail } from '@/api/admin';
  const tableData = ref([]);
  const showDetailDialog = ref(false);
  const sessionDetailData = ref({});
  const sessionMessage = ref([]);
  const loadingMessage = ref(false);
  const pagenation = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
  });
  onMounted(async () => {
    try {
      const { records, total } = await sessionPage(pagenation);
      tableData.value = records;
      pagenation.total = total;
    } catch (error) {
      console.error('获取咨询记录失败:', error);
    }
  });
  const viewDetail = async (row) => {
    loadingMessage.value = true;
    try {
      showDetailDialog.value = true;
      const res = await sessionDetail(row.id);
      loadingMessage.value = false;
      sessionMessage.value = res;
      sessionDetailData.value = row;
    } catch (error) {
      console.error('获取会话详情失败:', error);
    }
  };
  const handleChange = (page) => {
    pagenation.currentPage = page;
    handleSearch();
  };
  const handleSearch = async () => {
    try {
      const { records, total } = await sessionPage(pagenation);
      tableData.value = records;
      pagenation.total = total;
    } catch (error) {
      console.error('获取咨询记录失败:', error);
    }
  };
</script>
<style lang="scss" scoped>
  .session-title {
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .session-preview {
    font-size: 13px;
    color: #666;
    margin-bottom: 4px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .session-detail {
    max-height: 70vh;
    overflow-y: auto;
    .detail-header {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }

    .detail-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      :last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 500;
        color: #495057;
        min-width: 80px;
        margin-right: 8px;
      }

      .detail-value {
        color: #333;
      }
    }
  }
  .messages-container {
    margin-top: 20px;
    .messages-header {
      margin-bottom: 16px;
      h4 {
        margin: 0;
        color: #333;
        font-size: 16px;
        font-weight: 500;
      }
    }
    .messages-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      padding: 16px;
      background: #fff;
      .message-item {
        margin-bottom: 12px;
        padding: 12px;
        border-radius: 8px;
        background: #f8f9fa;
        border: 1px solid #e9ecef;
        :last-child {
          margin-bottom: 0;
        }
        &.user-message {
          background: #e8f4fd;
        }

        &.ai-message {
          background: #f0f9f0;
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          .sender {
            font-weight: 500;
            color: #333;
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .time {
            font-size: 12px;
            color: #999;
          }
        }
        .message-content {
          color: #333;
          line-height: 1.6;
          white-space: pre-wrap;
          margin-top: 8px;
          font-size: 14px;
        }
      }
    }
  }
</style>
