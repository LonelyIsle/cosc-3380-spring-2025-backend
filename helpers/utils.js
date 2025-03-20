function _objectAssign(keys, ...objs) {
    return objs.reduce((acc, curr) => {
        for (let key of keys) {
            if (curr[key] !== undefined && curr[key] !== "") {
                acc[key] = curr[key];
            }
        }
        return acc;
    });
}
function objectAssign(keys, ...objs) {
    let nullObj = {};
    for (let key of keys) {
        nullObj[key] = null;
    }
    return _objectAssign(keys, nullObj, ...objs);
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function parseToPrimitive(val) {
    let temp = null;
    if (val.indexOf(".") > -1) {
        temp = parseFloat(val);
    } else {
        temp = parseInt(val);
    } 
    if (!isNaN(temp)) {
        return temp;
    }
    return val;
}

export default {
    objectAssign,
    timeout,
    parseToPrimitive
}