export default (): string => {
    return Date.now().toString(16) + (Math.floor(Math.random() * 100).toString(16));
}