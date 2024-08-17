<template>
    <el-radio-group v-model="size">
        <el-radio value="large">Large</el-radio>
        <el-radio value="default">Default</el-radio>
        <el-radio value="small">Small</el-radio>
    </el-radio-group>
    <el-descriptions class="user-info" title="您的用户信息是" :column="3" :size="size" border>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <user />
                    </el-icon>
                    用户名
                </div>
            </template>
            {{ username }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <View />
                    </el-icon>
                    用户编号
                </div>
            </template>
            {{ id }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <location />
                    </el-icon>
                    用户类型
                </div>
            </template>
            {{ type }}
        </el-descriptions-item>
        <el-descriptions-item>
            <template #label>
                <div class="cell-item">
                    <el-icon :style="iconStyle">
                        <star />
                    </el-icon>
                    每日一句
                </div>
            </template>
            {{ randomPhrase }}
        </el-descriptions-item>
    </el-descriptions>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import type { ComponentSize } from 'element-plus'
import userStore from "../stores/userStore";

// 随机句子列表
const phrases = [
    "保持微笑，生活充满希望。",
    "每天都是新的开始。",
    "努力的你最美丽。",
    "永不放弃，你比你想象的更强大。",
    "成功属于那些勇敢追梦的人。",
];

// 当前选择的句子
const randomPhrase = ref<string>("");

// 在组件挂载时随机选择一句话
onMounted(() => {
    randomPhrase.value = phrases[Math.floor(Math.random() * phrases.length)];
});

const size = ref<ComponentSize>('default')
const newUserStore = userStore();
const id = newUserStore.userSession.id;
const username = newUserStore.userSession.username;
const type = newUserStore.userSession.user_type === 1 ? '普通用户' : '管理员';

const iconStyle = computed(() => ({
    marginRight: '16px',  
    fontSize: size.value === 'large' ? '40px' : size.value === 'small' ? '32px' : '36px', 
}));

</script>

<style scoped>
.el-descriptions {
    margin-top: 40px;
}

.cell-item {
    display: flex;
    align-items: center;
}

.user-info {
    margin-top: 40px; 
}

.el-radio-group {
    margin-bottom: 40px; 
}
</style>
