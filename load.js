const getRandomBin = () => {
    let number = Math.floor(Math.random() * (0 + 999999));
    if (number.toString().length === 6) {
        return parseInt(number);
    } else {
        return false;
    }
};

console.log(getRandomBin())