import utils from "./utils.js";

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

export default Table;