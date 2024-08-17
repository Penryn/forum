<template>
    <el-container style="height: 100vh;">
        <el-aside width="200px" class="sidebar">
            <el-menu :default-active="currentIndex" class="el-menu-vertical-demo">
                <el-menu-item index="1" @click="showComponent('info')">
                    <el-icon>
                        <setting />
                    </el-icon>
                    <span>用户信息</span>
                </el-menu-item>
                <el-menu-item index="2" @click="showComponent('post-show')">
                    <el-icon>
                        <document />
                    </el-icon>
                    <span>帖子与展示</span>
                </el-menu-item>
                <el-menu-item index="3" @click="showComponent('report')">
                    <el-icon>
                        <Menu />
                    </el-icon>
                    <span>举报记录</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-main>
                <!-- 根据选中的菜单项动态显示内容 -->
                <component :is="currentComponent" />
            </el-main>
        </el-container>
    </el-container>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue';
import post from '../components/post.vue';
import info from '../components/info.vue';
import report from '../components/user.vue';

// 组件映射
const componentMap: Record<string, typeof info | typeof post | typeof report> = {
    'info': info,
    'post-show': post,
    'report': report,
};

// 从 localStorage 获取当前组件索引
const currentIndex = ref<string>('1');
const currentComponent = ref<typeof info | typeof post | typeof report>(info);

onMounted(() => {
    const savedIndex = localStorage.getItem('selectedIndex');
    if (savedIndex) {
        currentIndex.value = savedIndex;
        currentComponent.value = componentMap[savedIndex] || null;
    }
});

const showComponent = (component: string) => {
    currentIndex.value = component;
    localStorage.setItem('selectedIndex', component);
    currentComponent.value = componentMap[component] || null;
};
</script>


<style scoped>
.sidebar {
    background-color: #f4f4f4;
    height: 100%;
    /* 确保侧边栏高度占满父容器 */
    position: fixed;
    /* 固定在左侧 */
    top: 0;
    left: 0;
}

.el-menu-vertical-demo {
    border-right: 1px solid #dcdfe6;
}

.el-menu-item {
    font-size: 14px;
}

.el-main {
    padding: 20px;
    margin-left: 200px;

}
</style>
