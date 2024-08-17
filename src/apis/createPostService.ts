import request from "./request";

export default class createPostService {
    static async createPost(data:{
        content: string
        user_id: number
    }
    ) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/student/post",
            method: "POST",
            data: data
        });
    }
}