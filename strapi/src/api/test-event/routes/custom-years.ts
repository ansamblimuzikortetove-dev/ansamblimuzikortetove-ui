export default {
    routes: [
        {
            method: "GET",
            path: "/test-events/years",
            handler: "test-event.getYears",
            config: { auth: false },
        },
    ],
};
