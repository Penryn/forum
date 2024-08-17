<template>
    <div class="report-table-container">
        <div v-if="loading" class="skeleton-container">
            <el-skeleton :rows="10" animated loading />
        </div>
        <div v-else>
            <label class="title">举报记录列表</label>
            <el-table :data="paginatedReports" stripe style="width: 100%" border>
                <el-table-column prop="post_id" label="帖子编号" width="180" align="center" />
                <el-table-column prop="content" label="帖子内容" width="400" align="center">
                    <template #default="{ row }">
                        <div class="content-cell">{{ row.content }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="举报原因" width="250" align="center">
                    <template #default="{ row }">
                        <div class="reason-cell">{{ row.reason }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="审理状态" width="150" align="center">
                    <template #default="{ row }">
                        <span :class="getStatusClass(row.status)">
                            {{ getStatusLabel(row.status) }}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalReports"
                    layout="prev, pager, next, ->, total" @current-change="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onBeforeMount, computed } from 'vue';
import getReportService from '../apis/getUserReportService';
import userStore from '../stores/userStore';

interface Report {
    post_id: number;
    content: string;
    reason: string;
    status: number;
}

const res = ref<Report[]>([]);
const currentPage = ref(1);
const pageSize = 9; // 每页显示的举报数
const totalReports = computed(() => res.value.length);
const newUserStore = userStore();
const loading = ref(true); // 控制是否显示骨架屏


const paginatedReports = computed(() => {
    const start = (currentPage.value - 1) * pageSize;
    const end = start + pageSize;
    return res.value.slice(start, end);
});


const fetchReports = async () => {
    try {
        const id = newUserStore.userSession.id;
        const response = await getReportService.getUserReports({ user_id: id });
        res.value = response.data.data.report_list;
        loading.value = false;
    } catch (error) {
        console.error('获取举报列表失败:', error);
    }
};

// Get status label based on status number
const getStatusLabel = (status: number) => {
    switch (status) {
        case 0:
            return '未审理';
        case 1:
            return '已通过';
        case 2:
            return '未通过';
        default:
            return '';
    }
};

// Get status class based on status number
const getStatusClass = (status: number) => {
    switch (status) {
        case 0:
            return 'status-pending';
        case 1:
            return 'status-approved';
        case 2:
            return 'status-rejected';
        default:
            return '';
    }
};

// Handle page change
const handlePageChange = (page: number) => {
    currentPage.value = page;
};

onBeforeMount(fetchReports);
</script>

<style scoped>
.title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
}
.report-table-container {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

.el-table {
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
}

.content-cell,
.reason-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 60px;
    display: flex;
    align-items: center;
}

.status-pending {
    color: #E6A23C;
    font-weight: bold;
}

.status-approved {
    color: #67C23A;
    font-weight: bold;
}

.status-rejected {
    color: #F56C6C;
    font-weight: bold;
}

.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}
</style>
