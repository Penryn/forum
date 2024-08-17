import request from "./request";

export default class reportPostService {
    static async reportPost(data:{
        reason: string
        user_id: number
        post_id: number
    }
    ) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/student/report-post",
            method: "POST",
            data: data
        });
    }
}