import { createRouter, createWebHistory } from "vue-router";
import { ElNotification } from "element-plus";
import { h } from "vue";
import login from "../pages/login.vue";
import user from "../pages/user.vue";
import admin from "../pages/admin.vue";
import loginStore from "../stores/loginStore";
import userStore from "../stores/userStore";




const routers = [
    {
		path: "/" ,
		redirect: "/login"
	},
    {
        path: "/login",
        name: "login",
        component: login
    },
    {
        path: "/user/post",
        name: "user",
        component: user
    },
    {
        path: "/admin/post",
        name: "admin",
        component: admin
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routers
});



router.beforeEach((to, from, next) :void=> {
    const newloginStore = loginStore();
    const newuserStore = userStore();
    if (!newloginStore.loginSession===true) {
		if (to.path === "/login") {
			next();
		}
		else {
			ElNotification({
				title: "失败",
				message: h("i", { style: "color: teal" }, "请您先登录！"),
			});
            next({ name: 'login' });
		}
	}
	else {
        if (newuserStore.userSession.user_type ==1 && to.path === "/admin/post") {
            ElNotification({
                title: "失败",
                message: h("i", { style: "color: teal" }, "您没有权限！"),
            });
            next({ name: 'user' });
        }else{
            next();
        }
	}
});


export default router;