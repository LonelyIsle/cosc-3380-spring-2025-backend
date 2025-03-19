function _objectAssign(keys, ...objs) {
    return objs.reduce((acc, curr) => {
        for (let key of keys) {
            if (curr[key] !== undefined) {
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

export default {
    objectAssign
}