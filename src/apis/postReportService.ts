import request from "./request";

export default class postReportService {
    static async postReports(data: {
        user_id: number
        post_id: number
        approval: number
    }) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/admin/report",
            method: "POST",
            data: data
        });
    }
}
