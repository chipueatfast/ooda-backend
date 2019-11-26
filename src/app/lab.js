

const getCurrentHalf = () => {
    const now = new Date();
    return Math.ceil(now.getMonth() / 6);
} 

console.log(getCurrentHalf());