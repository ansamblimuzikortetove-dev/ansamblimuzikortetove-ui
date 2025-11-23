export default {
    routes: [
        {
            method: "GET",
            path: "/test-events/by-month",
            handler: "test-event.byMonth",
            config: {
                auth: false
            }
        }
    ]
};
