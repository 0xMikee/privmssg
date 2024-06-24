export const getExpirationDate = (duration: string) => {
    const now = new Date();
    switch (duration) {
        case "viewing":
            return null;
        case "1hr":
            return new Date(now.getTime() + 60 * 60 * 1000);
        case "5hrs":
            return new Date(now.getTime() + 5 * 60 * 60 * 1000);
        case "1day":
            return new Date(now.getTime() + 24 * 60 * 60 * 1000);
        case "1week":
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        case "1month":
            const nextMonth = new Date(now);
            nextMonth.setMonth(now.getMonth() + 1);
            return nextMonth;
        default:
            return now;
    }
};