import request from "./request";

export default class getAdminReportService {
    static async getAdminReports(data: {
        user_id: number
    }) {
        return request({
            "headers": {
                "Content-Type": "application/json"
            },
            url: "/api/admin/report",
            method: "GET",
            params: data
        });
    }
}
