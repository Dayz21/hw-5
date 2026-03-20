export const getFormattedTime = (timing: number): string => {
    const hours = Math.floor(timing / 60);
    const minutes = timing % 60;
    return `${hours}h ${minutes}m`;
};
