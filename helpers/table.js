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
        let _val = val.split(":");
        if (_val.length !== 2 || (isNaN(_val[0]) && isNaN(_val[1]))) {
            return { error: new Error("Invalid filter.") };
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

    validate(row) {
        for (let attr in this.attribute) {
            if (attr in row) {
                for (let key in this.attribute[attr]) {
                    this.attribute[attr][key].validate(row[attr], attr);
                }
            }
        }
    }

    constructor(name, attribute, { sort, filter }) {
        this.name = name;
        this.attribute = attribute;
        this.sortAttribute = sort || [];
        this.filterAttribute = filter || {};
    }
}

class DataType {
    static ARRAY(...opt) { return new ARRAY(...opt); }
    static NUMBER() { return new NUMBER(); }
    static STRING(...opt) { return new STRING(...opt); }
    static TIMESTAMP() { return new TIMESTAMP(); }
    static NULLABLE() { return new NULLABLE(); }
    static NOTNULL() { return new NOTNULL(); }
}

export { 
    Table,
    DataType,
    ARRAY,
    NUMBER,
    STRING,
    TIMESTAMP,
    NULLABLE,
    NOTNULL
};