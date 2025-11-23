module.exports = {
    async beforeCreate(event) {
        const data = event.params.data;
        if (data.date) {
            const now = new Date();
            const eventDate = new Date(data.date);
            data.status = eventDate < now ? 'past' : 'upcoming';
        }
    },

    async beforeUpdate(event) {
        const data = event.params.data;
        if (data.date) {
            const now = new Date();
            const eventDate = new Date(data.date);
            data.status = eventDate < now ? 'past' : 'upcoming';
        }
    }
};
