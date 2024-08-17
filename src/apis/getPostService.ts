import request from "./request";

export default class getPostService {
    static async getPosts() {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/student/post",
            method: "GET",
        });
    }
}
