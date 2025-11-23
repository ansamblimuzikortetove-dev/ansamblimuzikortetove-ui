export default {
    routes: [
        {
            method: "GET",
            path: "/test-events/months",
            handler: "test-event.getMonths",
            config: { auth: false },
        },
    ],
};
