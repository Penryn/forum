<template>
    <div v-if="loading" class="skeleton-container">
        <el-skeleton :rows="10" animated loading />
    </div>
    <div v-else>
        <div class="report-container">
            <h2>管理员未审核举报列表</h2>
            <ul v-infinite-scroll="load" class="infinite-list">
                <li v-for="(report, index) in displayedReports" :key="index" class="infinite-list-item">
                    <div class="report-content">
                        <div class="report-details">
                            <p><strong>举报用户名称:</strong> {{ report.username }}</p>
                            <p><strong>举报内容:</strong> {{ report.content }}</p>
                            <p><strong>举报原因:</strong> {{ report.reason }}</p>
                        </div>
                        <div class="report-actions">
                            <el-button type="success" @click="approval(report.post_id)" :icon="Check" circle />
                            <el-button type="danger" @click="disagree(report.post_id)" :icon="Delete" circle />
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, ref } from 'vue';
import userStore from '../stores/userStore';
import getAdminReportService from '../apis/getAdminReportService';
import postReportService from '../apis/postReportService';
import { Check, Delete } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus'

interface Report {
    username: string;
    content: string;
    reason: string;
    post_id: number;
}

const res = ref<Report[]>([]);
const displayedReports = ref<Report[]>([]);
const count = ref(0);
const loadAmount = 2; // 每次加载的数量
const loading = ref(true); // 控制是否显示骨架屏
const newUserStore = userStore();

const load = () => {
    const endIndex = count.value + loadAmount;
    if (count.value < res.value.length) {
        displayedReports.value.push(...res.value.slice(count.value, endIndex));
        count.value = endIndex;
    }
};

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

const fetchReports = async () => {
    try {
        const id = newUserStore.userSession.id;
        const response = await getAdminReportService.getAdminReports({ user_id: id });
        res.value = response.data.data.report_list;

        displayedReports.value = [];
        count.value = 0;
        loading.value = false;

        load();
    } catch (error) {
        console.error('获取举报列表失败:', error);
    }
};


const approval = async (post_id: number) => {
    try {
        const response = await postReportService.postReports({
            user_id: newUserStore.userSession.id,
            post_id: post_id,
            approval: 1
        });
        if (response.status === 200 && response.data.code === 200) {
            msgSuccess('审核完成');
            fetchReports();
        } else {
            msgError(response.data.msg);
        }
    } catch (error) {
        console.error('审核失败:', error);
    }
};

const disagree = async (post_id: number) => {
    try {
        const response = await postReportService.postReports({
            user_id: newUserStore.userSession.id,
            post_id: post_id,
            approval: 2
        });
        if (response.status === 200 && response.data.code === 200) {
            msgSuccess('审核完成');
            fetchReports();
        } else {
            msgError(response.data.msg);
        }
    } catch (error) {
        console.error('审核失败:', error);
    }
};

onBeforeMount(fetchReports);
</script>

<style>
.report-container {
    width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.report-container h2 {
    text-align: center;
    color: var(--el-color-primary);
    margin-bottom: 20px;
    font-size: 24px;
}

.infinite-list {
    height: 700px;
    padding: 0;
    margin: 0;
    list-style: none;
    overflow: auto;
    border: 1px solid var(--el-color-border);
    border-radius: 8px;
    background: var(--el-color-primary-light-9);
}

.infinite-list .infinite-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: white;
    margin: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.infinite-list .infinite-list-item+.infinite-list-item {
    margin-top: 10px;
}

.report-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.report-details {
    max-width: 70%;
    text-align: left;
}

.report-details p {
    margin: 5px 0;
    color: var(--el-color-text-primary);
    word-break: break-word;
}

.report-details p strong {
    color: var(--el-color-primary-dark);
}

.report-actions {
    display: flex;
    gap: 10px;
}
</style>
