export default {
    routes: [
        {
            method: "GET",
            path: "/test-events/upcoming-years",
            handler: "test-event.upcomingYears",
            config: {
                auth: false
            }
        }
    ]
};
