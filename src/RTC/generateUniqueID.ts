export default (): string => {
    return Date.now().toString(16) + (Math.floor(Math.random() * 10000000).toString(16));
}