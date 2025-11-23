export default {
    routes: [
        {
            method: "GET",
            path: "/test-events",
            handler: "test-event.find",
        },
        {
            method: "GET",
            path: "/test-events/:id",
            handler: "test-event.findOne",
        },
        {
            method: "POST",
            path: "/test-events",
            handler: "test-event.create",
        },
        {
            method: "PUT",
            path: "/test-events/:id",
            handler: "test-event.update",
        },
        {
            method: "DELETE",
            path: "/test-events/:id",
            handler: "test-event.delete",
        },
    ],
};
