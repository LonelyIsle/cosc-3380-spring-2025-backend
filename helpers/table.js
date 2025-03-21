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

class INT {
    getFilterQuery(key, val) {
        let _val = val.split(":");
        if (_val.length !== 2 || (isNaN(_val[0]) && isNaN(_val[1]))) {
            return { error: new Error("invalid filter") };
        }
        let min = utils.parseStr(_val[0]);
        let max = utils.parseStr(_val[1]);
        if (isNaN(min)) {
            return { op: "<", min: null, max, query: '`' + key + '`' + " < ?", params: [max]};
        } 
        if (isNaN(max)) {
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

class FLOAT {
    getFilterQuery(key, val) {
        let _val = val.split(":");
        if (_val.length !== 2 || (isNaN(_val[0]) && isNaN(_val[1]))) {
            return { error: new Error("invalid filter") };
        }
        let min = utils.parseStr(_val[0]);
        let max = utils.parseStr(_val[1]);
        if (isNaN(min)) {
            return { op: "<", min: null, max, query: '`' + key + '`' + " < ?", params: [max]};
        } 
        if (isNaN(max)) {
            return { op: ">", min, max: null, query: '`' + key + '`' + " > ?", params: [min]};
        }
        if (min == max) {
            return { op: "=", min, max, query: '`' + key + '`' + " = ?", params: [min]};
        }
        return { op: "BETWEEN", min, max, query: '`' + key + '`' + " BETWEEN ? AND ?", params: [min, max]};
    }
    validate(val, attr = val) {
        let _val = val.toString();
        let [left, right] = _val.split(".");
        if (left.length > (this.size - this.d) || right.length > (this.d)) {
            throw new HttpError({ statusCode: 400, message: `${attr} is invalid` });
        }
        throw new HttpError({ statusCode: 400, message: `${attr} is invalid` });
    }
    constructor(size = 10, d = 0) {
        this.size = size;
        this.d = d;
    }
}

class VARCHAR {
    getFilterQuery(key, val) {
        return { 
            op: "LIKE", 
            q: val,
            query: '`' + key + '`' + " LIKE ?", 
            params: ['%' + val + '%']
        };
    }
    validate(val, attr = val) {
        if (val && val.length > this.maxLength) {
            throw new HttpError({ statusCode: 400, message: `${attr} is invalid` });
        }
    }

    constructor({ maxLength }) {
        this.maxLength = maxLength === undefined ? 65535 : maxLength
    }
}

class LONGTEXT {
    getFilterQuery(key, val) {
        return { 
            op: "LIKE", 
            q: val,
            query: '`' + key + '`' + " LIKE ?", 
            params: ['%' + val + '%']
        };
    }
    validate(val, attr = val) {
        if (val && val.length > 4294967295) {
            throw new HttpError({ statusCode: 400, message: `${attr} is invalid` });
        }
    }
    constructor() {}
}

class TIMESTAMP {
    validate(val, attr = val) {}
    constructor() {}
}

class TINYINT {
    validate(val, attr = val) {
        if (val && (val < 0 || val > 1)) {
            throw new HttpError({ statusCode: 400, message: `${attr} is invalid` });
        }
    }
    constructor() {

    }
}

class NULLABLE {
    validate(val, attr = val) {}
    constructor() {}
}

class NOTNULL {
    validate(val, attr = val) {
        if (val === null) {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be null` });
        }
        if (val === undefined) {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be undefined` });
        }
        if (typeof val === "string" && val.trim() === "") {
            throw new HttpError({ statusCode: 400, message: `${attr} cannot be empty` });
        }
    }
    constructor() {}
}

class DataType {
    static ARRAY(...opt) { return new ARRAY(...opt); }
    static INT() { return new INT(); }
    static FLOAT(...opt) { return new FLOAT(...opt); }
    static VARCHAR(...opt) { return new VARCHAR(...opt); }
    static LONGTEXT() { return new LONGTEXT(); }
    static TIMESTAMP() { return new TIMESTAMP(); }
    static TINYINT() { return new TINYINT(); }
    static NULLABLE() { return new NULLABLE(); }
    static NOTNULL() { return new NOTNULL(); }
}

class Table {
    parseReqQuery(query) {
        return utils.objectAssign(
            [...Object.keys(this.filterAttribute), "sort_by", "limit", "offset"],
            { limit: 10, offset: 0 },
            query
        );
    }

    getSortQueryStr(val) {
        if (val && val.toLowerCase()) {
            let [attr, op] = val.split("-");
            op = op.toUpperCase();
            if (this.sortAttribute.indexOf(attr) < 0 || (op !== "ASC" && op !== "DESC")) {
                return { error: new Error("invalid sort value")};
            }
            return { query: '`' + attr + '`' + ' ' + op }
        } else {
            return { error: new Error("invalid sort value")};
        }
    }

    getQueryStr(query) {
        query = this.parseReqQuery(query);
        let filterAttrs= this.filterAttribute;
        let sortAttrs = this.sortAttribute;
        let temp = null;
        let queryStr = [];
        let countQueryStr = null;
        let params = [];
        // WHERE
        queryStr.push("WHERE");
        for (let attr in filterAttrs) {
            if (query[attr]) {
                temp = filterAttrs[attr].getFilterQuery(attr, query[attr]);
                if (!temp.error) {
                    queryStr.push(...['(' + temp.query + ')', "AND"]);
                    params.push(...temp.params);
                }
            }
        }
        queryStr.push('(`is_deleted` = ?)');
        params.push(false);
        // ORDER BY
        temp = this.getSortQueryStr(query.sort_by);
        if (temp.error) {
            // sort by this.sortAttribute[0] by default
            if (sortAttrs[0]) {
                temp = this.getSortQueryStr(sortAttrs[0] + "-asc");
                if (!temp.error) {
                    queryStr.push(...["ORDER BY", temp.query]);
                }
            }
        } else {
            queryStr.push(...["ORDER BY", temp.query]);
        }
        // LIMIT & OFFSET
        countQueryStr = queryStr.join(" ");
        queryStr.push("LIMIT ?");
        params.push(query.limit);
        queryStr.push("OFFSET ?");
        params.push(query.offset);
        return {
            parsedQuery: query,
            queryStr: queryStr.join(" "),
            countQueryStr,
            params: params
        }
    }

    constructor(name, attribute, { sort, filter }) {
        this.name = name;
        this.attribute = attribute;
        this.sortAttribute = sort || [];
        this.filterAttribute = filter || {};
    }
}

export { 
    Table,
    DataType,
    ARRAY,
    INT,
    FLOAT,
    VARCHAR,
    LONGTEXT,
    TIMESTAMP,
    TINYINT,
    NULLABLE,
    NOTNULL
};