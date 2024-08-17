import request from "./request";

export default class loginService {
    static async login(data:{
        username: string,
        password: string
    }
    ) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/user/login",
            method: "POST",
            data: data
        });
    }
}