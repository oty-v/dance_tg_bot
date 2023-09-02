const {...about} = require("./about");
const {...lessons} = require("./lessons");
const {...main} = require("./main");

const limitStr = (str, n, symb) => {
    if (!n && !symb) return str;
    symb = symb || '...';
    return str.substr(0, n - symb.length) + symb;
}

module.exports = {
    limitStr,
    ...main,
    ...lessons,
    ...about
}