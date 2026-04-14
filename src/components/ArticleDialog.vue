<template>
  <el-dialog :title="isEdit ? '编辑文章' : '新增文章'" v-model="props.modelValue" width="50%" @close="handleClose">
    <h1>文章详情</h1>

    <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formData.title" maxlength="200" placeholder="请输入文章标题" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="文章分类" prop="categoryId">
        <el-select v-model="formData.categoryId" placeholder="请选择文章分类" style="width: 100%">
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
      <el-form-item label="封面图片" prop="coverImage">
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
          placeholder="请输入文章内容，支持富文本格式\n可以使用加粗、斜体、列表、标题等格式来丰富文章内容"
          :maxCharCount="5000"
          @change="handleContentChange"
          @created="handleEditorCreated"
          :article="currentArticle"
          minHeight="400px"
        />
      </el-form-item>
    </el-form>
    <div v-if="btnPreview">
      <div v-html="formData.content"></div>
    </div>
    <template #footer>
      <el-button type="primary" @click="btnPreview = !btnPreview">{{ btnPreview ? '关闭预览' : '预览效果' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">{{
        isEdit ? '更新文章' : '创建文章'
      }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
  import { reactive, ref, onMounted, nextTick, computed, watch } from 'vue';
  import { ElMessage } from 'element-plus';
  import { uploadFile, articleCreate } from '@/api/admin';
  import { fileBaseUrl } from '@/config/index';
  import RichTextEditor from '@/components/RichTextEditor.vue';
  import { updateArticle } from '@/api/admin';
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    categories: {
      type: Array,
      default: () => [],
    },
    article: {
      type: Object,
      default: null,
    },
  });

  const emit = defineEmits(['update:modelValue', 'success']);
  const isEdit = computed(() => !!props.article?.id);
  const currentArticle = computed(() => props.article);
  const btnPreview = ref(false);
  const loading = ref(false);
  const formRef = ref(null);
  const imgUrl = ref('');
  const editorInstance = ref(null);
  //监听编辑数据
  watch(
    () => props.article,
    (newVal) => {
      if (newVal) {
        // 处理标签数据：将字符串转换为数组
        const tagsArray = newVal.tags ? newVal.tags.split(',') : [];

        Object.assign(formData, {
          ...newVal,
          tagArray: tagsArray,
        });

        //使用现有id
        businessId.value = newVal.id;
        //封面url
        imgUrl.value = fileBaseUrl + newVal.coverImage;
      }
    },
  );

  // 表单数据
  const formData = reactive({
    title: '',
    content: '',
    coverImage: '',
    categoryId: '', // 建议初始值设为空，配合 required 校验
    summary: '',
    tagArray: [], // 对应模板中的 v-model="formData.tagArray"
  });

  // 表单校验规则
  const rules = reactive({
    title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
    categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
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

  // 关闭弹窗
  const handleClose = () => {
    // 关闭时重置表单
    formRef.value.resetFields();
    emit('update:modelValue', false);
    businessId.value = null;
    removeImg();
  };

  // 上传前校验
  const beforeUpload = (file) => {
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

  // 删除图片
  const removeImg = () => {
    imgUrl.value = '';
    formData.coverImage = '';
  };
  const businessId = ref(null);
  // 自定义上传请求
  const handleUploadRequest = async ({ file }) => {
    businessId.value = crypto.randomUUID();
    try {
      const res = await uploadFile(file, {
        businessId: businessId.value,
      });
      imgUrl.value = fileBaseUrl + res.filePath;
      formData.coverImage = res.filePath;
      ElMessage.success('图片上传成功');
    } catch (error) {
      ElMessage.error('图片上传失败');
    }
  };

  // 文章内容改变时触发
  const handleContentChange = (content) => {
    formData.content = content.html;
  };

  // 富文本编辑器创建时触发
  const handleEditorCreated = (editor) => {
    editorInstance.value = editor;
    if (formData.content && editor) {
      nextTick(() => {
        editor.setHtml(formData.content);
      });
    }
  };

  // 提交表单
  // 提交表单
  const handleSubmit = async () => {
    try {
      // 验证表单
      const valid = await formRef.value.validate();
      if (valid) {
        loading.value = true;

        // 构建提交数据
        const submitData = {
          ...formData,
          tags: formData.tagArray.join(','),
        };
        delete submitData.tagArray;

        // 调用创建文章接口
        const res = await articleCreate(submitData);

        if (!isEdit.value) {
          // 更新文章
          loading.value = false;
          emit('success'); // 触发成功事件
          submitData.id = businessId.value;
          await updateArticle(submitData);
        } else {
          // 创建文章
          await articleCreate(submitData);
          loading.value = false;
          emit('success'); // 触发成功事件
          currentArticle.value = res;
        }
        // 处理响应
        ElMessage.success('文章创建成功');

        handleClose();
      }
    } catch (error) {
      // 处理错误
      console.error('提交失败:', error);
      ElMessage.error('提交失败，请重试');
      loading.value = false;
    }
  };
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
    cursor: pointer;
  }
  .cover-img {
    width: 200px;
    height: 120px;
    display: block;
    object-fit: cover;
  }
  .img-remove {
    margin-top: 10px;
  }
</style>
