import request from "./request";

export default class getUserReportService {
    static async getUserReports(data: {
        user_id: number
    }) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/student/report-post",
            method: "GET",
            params: data
        });
    }
}
