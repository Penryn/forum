import request from "./request";

export default class deletePostService {
    static async deletePost(data:{
        post_id: number
        user_id: number
    }
    ) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/student/post",
            method: "DELETE",
            params: data
        });
    }
}
