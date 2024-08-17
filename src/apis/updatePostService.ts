import request from "./request";

export default class updatePostService {
    static async updatePost(data:{
        content: string
        user_id: number
        post_id: number
    }
    ) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/student/post",
            method: "PUT",
            data: data
        });
    }
}