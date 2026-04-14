<template>
  <div class="knowledge">
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="handleEdit({})">新增</el-button>
        <el-button type="primary">编辑</el-button>
      </template>
    </PageHead>
    <TableSearch :from-item="fromItem" @search="handleSearch" />
    <el-table :data="tableData" style="width: 100%; margin-top: 25px">
      <el-table-column label="文章标题" width="200">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon>
              <timer />
            </el-icon>
            <span>{{ scope.row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="分类" fixed="left">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon>
              <timer />
            </el-icon>
            <span>{{ categoryMap[scope.row.categoryId] }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="authorName" label="作者" width="150" />
      <el-table-column prop="readCount" label="阅读量" width="150" />
      <el-table-column prop="updatedAt" label="发布时间" width="150" />
      <el-table-column label="操作" fixed="right" width="240">
        <template #default="scope">
          <el-button text type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            @click="handlePublish(scope.row)"
            text
            v-if="scope.row.status === 0 || scope.row.status === 2"
            type="success"
            >发布
          </el-button>
          <el-button @click="handleUnPublish(scope.row)" text type="warning" v-if="scope.row.status === 1"
            >下线</el-button
          >
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
    <ArticleDialog
      v-model:modelValue="dialogVisble"
      :categories="categories"
      :article="currentArticle"
      @success="handleSuccess"
    ></ArticleDialog>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup>
  import PageHead from '@/components/PageHead.vue';
  import TableSearch from '@/components/TableSearch.vue';
  import ArticleDialog from '@/components/ArticleDialog.vue';
  import { onMounted, ref, reactive } from 'vue';
  import { categoryTree } from '@/api/admin';
  import { articlePage, articleDetail } from '@/api/admin';
  import { Timer } from '@element-plus/icons-vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { articleStatus, articleDelete } from '@/api/admin';
  //分类映射
  const categoryMap = reactive({});
  //分类列表
  const categories = ref([]);
  //列表数据
  const tableData = ref([]);
  onMounted(async () => {
    const data = await categoryTree();
    console.log(data);
    categories.value = data.map((item) => {
      categoryMap[item.id] = item.categoryName;
      return {
        label: item.categoryName,
        value: item.id,
      };
    });
    fromItem[1].options = categories.value;
    // 初始化文章列表数据
    handleSearch();
  });
  // 编辑文章
  const currentArticle = ref(null);
  const handleEdit = async (row) => {
    // console.log('当前行数据', row);
    if (!row.id) {
      //新增文章
      currentArticle.value = null;
      dialogVisble.value = true;
    } else {
      //编辑文章
      try {
        const res = await articleDetail(row.id);
        console.log(res, '编辑数据');
        currentArticle.value = res;
        dialogVisble.value = true;
      } catch (error) {
        console.error('获取文章详情失败:', error);
        ElMessage.error('获取文章详情失败');
      }
    }
  };
  // 发布文章
  const handlePublish = async (row) => {
    // console.log('发布文章', row);
    try {
      await ElMessageBox.confirm('确定发布文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      });
      await articleStatus(row.id, { status: 1 });
      ElMessage.success('发布成功');
      handleSearch();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('发布文章失败:', error);
        ElMessage.error('发布文章失败');
      }
    }
  };
  // 下线文章
  const handleUnPublish = async (row) => {
    // console.log('下线文章', row);
    try {
      await ElMessageBox.confirm('确定下线文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      });
      await articleStatus(row.id, { status: 2 });
      ElMessage.success('下线成功');
      handleSearch();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('下线文章失败:', error);
        ElMessage.error('下线文章失败');
      }
    }
  };
  //删除文章
  const handleDelete = async (row) => {
    // console.log('删除文章', row);
    try {
      await ElMessageBox.confirm('确定删除文章吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      await articleDelete(row.id);
      ElMessage.success('删除成功');
      handleSearch();
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除文章失败:', error);
        ElMessage.error('删除文章失败');
      }
    }
  };

  const handleChange = (page) => {
    pagenation.currentPage = page;
    handleSearch();
  };
  // 新增成功后刷新列表
  const handleSuccess = () => {
    handleSearch();
  };
  const fromItem = [
    {
      component: 'el-input',
      label: '文章标题',
      prop: 'title',
      placeholder: '请输入文章标题',
    },
    {
      component: 'el-select',
      label: '文章分类',
      prop: 'category',
      placeholder: '请选择文章分类',
    },
    {
      component: 'el-select',
      prop: 'status',
      label: '文章状态 ',
      placeholder: '请选择文章状态',
      options: [
        { label: '草稿', value: '0' },
        { label: '已发布', value: 'published' },
        { label: '已下架', value: 'unpublished' },
      ],
    },
  ];
  //对话框显示
  const dialogVisble = ref(false);
  //分页参数
  const pagenation = reactive({
    currentPage: 1,
    size: 10,
    total: 0,
  });
  const handleSearch = async (data) => {
    console.log(data, '查询参数');
    const params = {
      ...pagenation,
      ...data,
    };
    try {
      const { records, total } = await articlePage(params);
      tableData.value = records;
      pagenation.total = total;
    } catch (error) {
      console.error('获取文章列表失败:', error);
      ElMessage.error('获取文章列表失败');
    }
  };
</script>
