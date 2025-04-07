import utils from "./utils.js";

class ARRAY {
    validate(val) {
        if (val && !Array.isArray(val)) {
            return false; 
        }
        if (val) {
            for (let v of val) {
                if(!this.elementType.validate(v)) {
                    return false;
                }
            }
        }
        return true;
    }
    constructor(elementType) {
        this.elementType = elementType;
    }
}

class NUMBER {
    getFilterQuery(tableName, key, val) {
        if (!utils.isNaN(val)) {
            let min = val;
            let max = val;
            return { op: "=", min, max, query: '`' + tableName + '`'+ '.' + '`' + key + '`' + " = ?", params: [min]};
        }
        let _val = val.split(":");
        if (_val.length !== 2) {
            return { error: new Error("Invalid filter.") };
        }
        let [min] = utils.parseStr(_val[0]);
        let [max] = utils.parseStr(_val[1]);
        if (utils.isNaN(min)) {
            return { op: "<=", min: null, max, query: '`' + tableName + '`'+ '.' + '`' + key + '`' + " <= ?", params: [max]};
        } 
        if (utils.isNaN(max)) {
            return { op: ">=", min, max: null, query: '`' + tableName + '`'+ '.' + '`' + key + '`' + " >= ?", params: [min]};
        }
        if (min == max) {
            return { op: "=", min, max, query: '`' + tableName + '`'+ '.' + '`' + key + '`' + " = ?", params: [min]};
        }
        return { op: "BETWEEN", min, max, query: '`' + tableName + '`'+ '.' + '`' + key + '`' + " BETWEEN ? AND ?", params: [min, max]};
    }
    validate(val) {
        if (val && utils.isNaN(val)) {
            return false;
        }
        if (val && !this.check(val)) {
            return false;
        }
        return true;
    }
    constructor(opt = {}) {
        let { check } = Object.assign({ check: () => true }, opt);
        this.check = check;
    }
}

class STRING {
    getFilterQuery(tableName, key, val) {
        return { 
            op: "LIKE", 
            q: val,
            query: '`' + tableName + '`'+ '.' + '`' + key + '`' + " LIKE ?", 
            params: ['%' + val + '%']
        };
    }
    validate(val) {
        if (val && typeof val !== "string") {
            return false;
        }
        if (val && !this.check(val)) {
            return false;
        }
        return true;
    }
    constructor(opt = {}) {
        let { check } = Object.assign({ check: () => true }, opt);
        this.check = check;
    }
}

class TIMESTAMP {
    validate(val) {
        // val must be in milliseconds
        if(val && utils.isNaN(val)) {
            return false;
        }
        return true;
    }
    constructor() {}
}

class ANY {
    validate(val) {
        return true;
    }
    constructor() {}
}

class NULLABLE {
    validate(val) {
        return true;
    }
    constructor() {}
}

class NOTNULL {
    validate(val) {
        if (val === null) {
            return false;
        }
        if (val === undefined) {
            return false;
        }
        if (typeof val === "string" && val.trim() === "") {
            return false;
        }
        if (Array.isArray(val) && val.length === 0) {
            return false;
        }
        return true;
    }
    constructor() {}
}

class BLOB {
    validate() {
        return true;
    }
    constructor() {}
}

class DataType {
    static ARRAY(opt) { return new ARRAY(opt); }
    static NUMBER(opt) { return new NUMBER(opt); }
    static STRING(opt) { return new STRING(opt); }
    static TIMESTAMP(opt) { return new TIMESTAMP(opt); }
    static ANY(opt) { return new ANY(opt); }
    static NULLABLE(opt) { return new NULLABLE(opt); }
    static NOTNULL(opt) { return new NOTNULL(opt); }
    static BLOB(opt) { return new BLOB(opt); }
}

export default DataType;