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

function parseStr(val) {
    try {
        let temp = JSON.parse(val);
        if (typeof temp === "string") {
            temp = decodeURI(temp).trim();
        }
        return [temp, null];
    } catch(e) {
        return [val, e];
    }
}

export default {
    objectAssign,
    timeout,
    parseStr
}