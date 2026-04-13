<template>
  <div class="knowledge">
    <PageHead title="知识文章">
      <template #buttons>
        <el-button type="primary" @click="dialogVisble = true">新增</el-button>
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
      <el-table-column prop="publishedAt" label="发布时间" width="150" />
      <el-table-column label="操作" fixed="right" width="240">
        <template #default="scope">
          <el-button text type="primary">编辑</el-button>
          <el-button text v-if="scope.row.status === 0 || scope.row.status === 2" type="success">发布 </el-button>
          <el-button text type="warning" v-if="scope.row.status === 1">下线</el-button>
          <el-button text type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 25px"
      layout="prev, pager, next"
      :page-size="pagenation.size"
      :total="pagenation.total"
      @change="handleChange(page)"
    />
    <ArticleDialog v-model:modelValue="dialogVisble" :categories="categories"></ArticleDialog>
  </div>
</template>
<style lang="scss" scoped></style>
<script setup>
  import PageHead from '@/components/PageHead.vue';
  import TableSearch from '@/components/TableSearch.vue';
  import ArticleDialog from '@/components/ArticleDialog.vue';
  import { onMounted, ref, reactive } from 'vue';
  import { categoryTree } from '@/api/admin';
  import { articlePage } from '@/api/admin';
  import { Timer } from '@element-plus/icons-vue';

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
  });

  const handleChange = (page) => {
    pagenation.currentPage = page;
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
    const { records, total } = await articlePage(params);
    tableData.value = records;
    pagenation.total = total;
    // console.log("res", res);
  };
</script>
