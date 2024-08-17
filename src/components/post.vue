<template>
    <div class="container">
        <div v-if="loading" class="skeleton-container">
            <el-skeleton :rows="10" animated loading />
        </div>
        <div v-else>
            <div class="header">
                <label class="title">帖子列表</label>
                <el-button round @click="showDialog = true">
                    <el-icon class="el-icon--right">
                        <Edit />
                    </el-icon>
                    新增帖子
                </el-button>
            </div>
            <div class="card-container">
                <el-card v-for="post in paginatedPosts" :key="post.id" class="card" shadow="hover">
                    <template #header>
                        <div class="card-header">
                            <span class="card-info">帖子编号: {{ post.id }}</span>
                            <span class="card-info">发布者编号: {{ post.user_id }}</span>
                            <span class="card-info">发布时间: {{ new Date(post.time).toLocaleString() }}</span>
                        </div>
                    </template>
                    <p class="card-content">{{ post.content }}</p>
                    <template #footer>
                        <div class="card-footer">
                            <el-button type="primary" @click="update(post.id)" class="card-button">修改帖子</el-button>
                            <el-button type="danger" @click="deletePost(post.id)" class="card-button">删除帖子</el-button>
                            <el-button type="info" @click="report(post.id)" class="card-button">举报评论</el-button>
                        </div>
                    </template>
                </el-card>
            </div>
            <div class="pagination-container">
                <el-pagination background :current-page="currentPage" :page-size="pageSize" :total="totalPosts"
                    @current-change="handlePageChange" layout="prev, pager, next, jumper, ->, total" />
            </div>

            <el-dialog title="新增帖子" v-model="showDialog" width="30%">
                <el-form :model="{ content: newPostContent }" ref="postForm">
                    <el-form-item label="帖子内容" prop="content">
                        <el-input type="textarea" v-model="newPostContent" placeholder="请输入文章内容"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="showDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitPost">提交</el-button>
                </template>
            </el-dialog>
            <el-dialog title="修改帖子" v-model="editDialog" width="30%">
                <el-form :model="{ content: newPostContent }" ref="postForm">
                    <el-form-item label="帖子内容" prop="content">
                        <el-input type="textarea" v-model="newPostContent" placeholder="请输入文章内容"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="editDialog = false">取消</el-button>
                    <el-button type="primary" @click="editPost()">修改</el-button>
                </template>
            </el-dialog>
            <el-dialog title="举报帖子" v-model="reportDialog" width="30%">
                <el-form :model="{ reason: newPostReason }" ref="postForm">
                    <el-form-item label="举报原因" prop="content">
                        <el-input type="textarea" v-model="newPostReason" placeholder="请输入举报原因"></el-input>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <el-button @click="reportDialog = false">取消</el-button>
                    <el-button type="primary" @click="confirmPost()">确认</el-button>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, computed } from 'vue';
import getPostService from '../apis/getPostService';
import userStore from '../stores/userStore';
import createPostService from '../apis/createPostService';
import deletePostService from '../apis/deletePostService';
import updatePostService from '../apis/updatePostService';
import reportPostService from '../apis/reportPostService';


// 响应数据
const res = ref<{ post_list: { id: number, content: string, user_id: number, time: string }[] }>({ post_list: [] });
const showDialog = ref(false); // 控制弹窗显示
const editDialog = ref(false); // 控制修改弹窗显示
const reportDialog = ref(false); // 控制举报弹窗显示
const newPostContent = ref(''); // 新文章的内容
const newPostReason = ref(''); // 举报原因
const loading = ref(true); // 控制是否显示骨架屏
const newUserStore = userStore();
const currentPage = ref(1);
const pageSize = 5; // 每页显示的文章数量
const totalPosts = ref(0);
import { ElNotification, ElForm } from 'element-plus'
const content = ref('')
var post_id: number = 0

const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return res.value.post_list.slice(start, end);
});

const msgSuccess = (msg: string) => {
    ElNotification({
        title: 'Success',
        message: msg,
        type: 'success',
    })
}

const msgError = (msg: string) => {
    ElNotification({
        title: 'Error',
        message: msg,
        type: 'error',
    })
}

const fetchPosts = async () => {
    try {
        const response = await getPostService.getPosts();
        res.value = response.data.data;
        totalPosts.value = response.data.data.post_list.length; // 更新文章总数
        loading.value = false;
    } catch (error) {
        console.error('获取文章列表失败:', error);
    }
};

// 在组件挂载前发出请求
onBeforeMount(fetchPosts);

const submitPost = () => {
    showDialog.value = false;
    createPost();
}



const createPost = async () => {
    const id = newUserStore.userSession.id
    const postInfo = {
        content: content.value,
        user_id: id
    }
    const response = await createPostService.createPost(postInfo)
    if (response.status === 200 && response.data.code === 200) {
        content.value = ''
        msgSuccess("发布成功")
        await fetchPosts()
    } else {
        msgError(response.data.msg)
    }
}

const update = (postId: number) => {
    post_id = postId
    editDialog.value = true
}

const report = (postId: number) => {
    post_id = postId
    reportDialog.value = true
}

const editPost = () => {
    editDialog.value = false;
    updatePost();
}

const updatePost = async () => {
    const id = newUserStore.userSession.id
    const postInfo = {
        content: newPostContent.value,
        post_id: post_id,
        user_id: id
    }
    const response = await updatePostService.updatePost(postInfo)
    if (response.status === 200 && response.data.code === 200) {
        content.value = ''
        msgSuccess("修改成功")
        await fetchPosts()
    } else {
        msgError(response.data.msg)
    }
}

const deletePost = async (postId: number) => {
    const id = newUserStore.userSession.id
    post_id = postId
    const response = await deletePostService.deletePost({
        post_id: post_id,
        user_id: id
    })
    if (response.status === 200 && response.data.code === 200) {
        msgSuccess("删除成功")
        await fetchPosts()
    } else {
        msgError(response.data.msg)
    }

}

const confirmPost = () => {
    reportDialog.value = false;
    reportPost();
}

const reportPost = async () => {
    const id = newUserStore.userSession.id
    const postInfo = {
        reason: newPostReason.value,
        post_id: post_id,
        user_id: id
    }
    const response = await reportPostService.reportPost(postInfo)
    if (response.status === 200 && response.data.code === 200) {
        content.value = ''
        msgSuccess("举报成功")
    } else {
        msgError(response.data.msg)
    }
}

const handlePageChange = (page: number) => {
    currentPage.value = page;
    fetchPosts(); // 切换页码时重新获取文章列表
};



</script>


<style scoped>
.container {
    padding: 20px;
}

.el-skeleton {
    width: 100%; 
    max-width: 800px; 
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.el-button {
    font-size: 14px;
    padding: 10px 20px;
}

.skeleton-container {
    width: 100%; /* 或者设置为具体宽度，例如 800px */
    max-width: 800px;
}


.card-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.card {
    width: 800px;
    margin-bottom: 20px;
    transition: transform 0.3s;
}

.card:hover {
    transform: translateY(-5px);
}

.card-header {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
}

.card-info {
    margin-right: 20px;
    white-space: nowrap;
}

.card-content {
    font-size: 16px;
    color: #333;
    margin-bottom: 15px;
    line-height: 1.6;
}

.card-footer {
    display: flex;
    justify-content: flex-end;
}

.card-button {
    margin-left: 10px;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.pagination-container .el-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
