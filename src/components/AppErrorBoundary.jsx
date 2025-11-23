import React from "react";
import toast from "react-hot-toast";

export default class AppErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("🔥 React Fatal Error", error, info);
        toast.error("Unexpected application error.");
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen flex items-center justify-center text-center text-white">
                    <div>
                        <h2 className="text-2xl mb-4">Something went wrong.</h2>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-accent rounded-lg"
                        >
                            Reload
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}