let setDifference = function (a, b) {

    if (!(a instanceof Set))
        a = new Set()
    if (!(b instanceof Set))
        b = new Set()

    return new Set([...a].filter(x => !b.has(x)))
}

module.exports = {setDifference}