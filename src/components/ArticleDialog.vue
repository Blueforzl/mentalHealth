<template>
  <el-dialog title="新增文章" v-model="props.modelValue" width="50%" @close="handleClose">
    <h1>文章详情</h1>

    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="formData.title"
          :rules="rules.title"
          maxlength="200"
          placeholder="请输入文章标题"
          show-word-limit
          clearable
        />
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="formData.categoryId" :rules="rules.categoryId" placeholder="请选择文章分类">
          <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="文章摘要" prop="summary">
        <el-input
          v-model="formData.summary"
          type="textarea"
          maxlength="1000"
          placeholder="请输入文章摘要(可选)"
          show-word-limit
        />
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-select
          v-model="formData.tagArray"
          placeholder="请选择文章标签(逗号分隔)"
          multiple
          filterable
          allow-create
          style="width: 100%"
        >
          <el-option v-for="item in commonTags" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="封面图片">
        <div class="cover-upload">
          <el-upload
            class="cover-upload"
            :before-upload="beforeUpload"
            :http-request="handleUploadRequest"
            accept="image/*"
            show-file-list="false"
          >
            <div class="cover-placeholder" v-if="!imgUrl">
              <p>点击上传封面图片</p>
            </div>
            <img class="cover-img" v-else :src="imgUrl" alt="封面图片" style="width: 100px; height: 100px" />
            <div v-if="imgUrl" class="img-remove">
              <el-button type="danger" size="mini" @click="removeImg">删除</el-button>
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <RichTextEditor
          v-model="formData.content"
          :rules="rules.content"
          placeholder="请输入文章内容，支持富文本格式\\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容"
          :maxCharCount="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          minHeight="400px"
        />
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script setup>
  import { reactive, ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { uploadFile } from '@/api/admin';
  import { fileBaseUrl } from '@/config/index';
  import RichTextEditor from '@/components/RichTextEditor.vue';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:modelValue']);

  const handleClose = () => {
    emit('update:modelValue', false);
  };
  //上传
  const imgUrl = ref('');
  const beforeUpload = (file) => {
    // console.log(file);
    const isImg = file.type.startsWith('image/');
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImg) {
      ElMessage.error('请上传图片文件');
      return false;
    }
    if (!isLt5M) {
      ElMessage.error('图片大小不能超过5MB');
      return false;
    }
    return true;
  };
  //删除图片
  const removeImg = () => {
    imgUrl.value = '';
    formData.coverImage = '';
  };
  const handleUploadRequest = async ({ file }) => {
    const businessId = crypto.randomUUID();
    // console.log(businessId);
    const res = await uploadFile(file, {
      businessId: businessId,
    });
    // console.log(res);

    imgUrl.value = fileBaseUrl + res.filePath;
    formData.coverImage = res.filePath;
  };
  //文章内容改变时触发
  const handleContentChange = (content) => {
    // formData.content = content;
  };
  //富文本编辑器创建时触发
  const handleEditorCreated = (editor) => {
    // console.log(editor);
  };

  //表单数据
  const formData = reactive({
    title: '',
    content: '',
    coverImage: '',
    categoryId: 1,
    summary: '',
    tags: '',
    id: '',
  });
  //表达校验规则
  const rules = reactive({
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }],

    id: [{ required: true, message: '请输入文章ID', trigger: 'blur' }],
    coverImage: [{ required: true, message: '请上传文章封面', trigger: 'change' }],
  });

  const commonTags = [
    '情绪管理',
    '焦虑',
    '抑郁',
    '压力',
    '睡眠',
    '冥想',
    '正念',
    '放松',
    '心理健康',
    '自我成长',
    '人际关系',
    '工作压力',
    '学习方法',
    '生活技巧',
  ];
</script>
<style scoped lang="scss">
  .cover-placeholder {
    width: 200px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #8b949e;
    background: #f6f8fa;
  }
  .cover-img {
    width: 200px;
    height: 120px;
    display: block;
  }
  .img-remove {
    margin-left: 20px;
  }
</style>
