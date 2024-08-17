import {defineStore} from "pinia";
import {reactive} from "vue";
import {userInfo} from "../types/user";

const userStore = defineStore(
	"user",
	() => {
		const userSession = reactive({
			id: -1,
			username: "未登录",
            user_type: -1,
            password: "",
		});

		const setUserInfo = (info: userInfo) : void => {
			userSession.id = info.id;
			userSession.username = info.username;
			userSession.user_type = info.user_type;
			userSession.password = info.password;
		};

		return {
			userSession,
			setUserInfo,
		};
	},
	{
		persist: true
	}
);

export default userStore;