function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function shuffleArray(arr) {
    let i, j;
    let length = arr.length - 1;
    for (i = 0; i < length; i++) {
        j = getRandomInt(0, length);
        swap(i, j, arr);
    }
}

function swap(x, y, arr) {
    let tmp = arr[y];
    arr[y] = arr[x];
    arr[x] = tmp;
}

function insertToEndOfArray(item, array) {
    array.push(item);
}

function deepCopy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function pullItemFromArray(item, array) {

    return array.splice(findIndexOfItemInArray(item, array), 1)[0];
}

function pullItemFromEndOfArray(array) {
    return pullItemFromArray(array[array.length - 1], array);
}

function findIndexOfItemInArray(targetItem, array) {
    return array.findIndex(item => targetItem === item);
}

function getKey(obj, index) {
    return Object.keys(obj)[index];
}

function getFirstItemByMatchConditions(arr, conditionList) {
    return arr.find(function (item) {
        return conditionList.reduce(function (accumulator, condition) {
            let key = getKey(condition, 0);
            let value = condition[key];
            return accumulator && item[key] === value;
        }, true);
    });
}

module.exports = {
    getRandomInt,
    shuffleArray,
    insertToEndOfArray,
    pullItemFromArray,
    pullItemFromEndOfArray,
    getKey,
    getFirstItemByMatchConditions,
};
