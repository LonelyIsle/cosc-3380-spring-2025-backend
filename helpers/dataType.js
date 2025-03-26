import { HttpError } from "../helpers/error.js";
import utils from "./utils.js";

class ARRAY {
    validate(val, attr = val) {
        return this.elementType.validate(val, attr);
    }
    constructor(elementType) {
        this.elementType = elementType;
    }
}

class NUMBER {
    getFilterQuery(key, val) {
        if (!utils.isNaN(val)) {
            let min = val;
            let max = val;
            return { op: "=", min, max, query: '`' + key + '`' + " = ?", params: [min]};
        }
        let _val = val.split(":");
        if (_val.length !== 2) {
            return { error: new Error("Invalid filter.") };
        }
        let [min] = utils.parseStr(_val[0]);
        let [max] = utils.parseStr(_val[1]);
        if (utils.isNaN(min)) {
            return { op: "<", min: null, max, query: '`' + key + '`' + " < ?", params: [max]};
        } 
        if (utils.isNaN(max)) {
            return { op: ">", min, max: null, query: '`' + key + '`' + " > ?", params: [min]};
        }
        if (min == max) {
            return { op: "=", min, max, query: '`' + key + '`' + " = ?", params: [min]};
        }
        return { op: "BETWEEN", min, max, query: '`' + key + '`' + " BETWEEN ? AND ?", params: [min, max]};
    }
    validate(val, attr = val) {}
    constructor() {}
}

class STRING {
    getFilterQuery(key, val) {
        return { 
            op: "LIKE", 
            q: val,
            query: '`' + key + '`' + " LIKE ?", 
            params: ['%' + val + '%']
        };
    }
    validate(val, attr = val) {
        if (this.regexp) {
            if(!this.regexp.test(val)) {
                throw new HttpError({ statusCode: 400, message: `${attr} is invalid.` });
            }
        }
    }
    constructor(regexp) {
        this.regexp = regexp;
    }
}

class TIMESTAMP {
    validate(val, attr = val) {}
    constructor() {}
}

class NULLABLE {
    validate(val, attr = val) {}
    constructor() {}
}

class NOTNULL {
    validate(val, attr = val) {
        if (val === null) {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be null.` });
        }
        if (val === undefined) {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be undefined.` });
        }
        if (typeof val === "string" && val.trim() === "") {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be empty.` });
        }
    }
    constructor() {}
}

class BLOB {
    validate() {}
    constructor() {}
}

class DataType {
    static ARRAY(...opt) { return new ARRAY(...opt); }
    static NUMBER(...opt) { return new NUMBER(...opt); }
    static STRING(...opt) { return new STRING(...opt); }
    static TIMESTAMP(...opt) { return new TIMESTAMP(...opt); }
    static NULLABLE(...opt) { return new NULLABLE(...opt); }
    static NOTNULL(...opt) { return new NOTNULL(...opt); }
    static BLOB(...opt) { return new BLOB(...opt); }
}

export default DataType;