import defaultRoutes from "./routes";
import customYears from "./custom-years";
import customMonths from "./custom-months";
import customUpcomingYears from "./custom-upcoming-years";
import customRoutes from "./custom-test-event";

export default {
    routes: [
        ...defaultRoutes.routes,
        ...customYears.routes,
        ...customMonths.routes,
        ...customUpcomingYears.routes,
        ...customRoutes.routes
    ],
};
