<template>
    <div class="container">
        <label class="title">发表文章</label>
        <br />
        <el-input v-model="content" style="width: 800px" :autosize="{ minRows: 5, maxRows: 8 }" type="textarea"
            placeholder="Please input" />
        <br />
        <div class="button-container">
            <el-button type="primary" @click="createPost">
                创建<el-icon class="el-icon--right">
                    <Edit />
                </el-icon>
            </el-button>
            <el-button type="primary">
                清空<el-icon class="el-icon--right">
                    <Delete />
                </el-icon>
            </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import createPostService from '../apis/createPostService'
import userStore from '../stores/userStore';
import { ElNotification } from 'element-plus'
const content = ref('')

const createSuccess = () => {
  ElNotification({
    title: 'Success',
    message: '发布成功',
    type: 'success',
  })
}

const createError = () => {
  ElNotification({
    title: 'Error',
    message: '网络异常，请稍后再试',
    type: 'error',
  })
}

const newUserStore = userStore();
const createPost = async () => {
    const id = newUserStore.userSession.id
    const postInfo = {
        content: content.value,
        userId: id
    }
    const response = await createPostService.createPost({
        content: postInfo.content,
        user_id: id
    })
    if (response.status === 200&&response.data.code === 200) {
        console.log('创建成功')
        content.value = ''
        createSuccess()
    } else {
        console.log('创建失败')
        createError()
    }
}


</script>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
}

.button-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>