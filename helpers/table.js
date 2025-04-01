import utils from "./utils.js";
import { HttpError } from "./error.js";

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
            return { query: '`' + this.name + '`' + '.' + '`' + attr + '`' + ' ' + op }
        } else {
            return { error: new Error("invalid sort value")};
        }
    }

    getQueryStr(query) {
        query = this.parseReqQuery(query);
        let filterAttrs= this.filterAttribute;
        let sortAttrs = this.sortAttribute;
        let temp = null;
        let whereQuery = [];
        let sortQuery = [];
        let pagingQuery = []
        let whereParams = [];
        let pagingParams = [];
        // WHERE
        for (let attr in filterAttrs) {
            if (query[attr]) {
                temp = filterAttrs[attr].getFilterQuery(this.name, attr, query[attr]);
                if (!temp.error) {
                    whereQuery.push(...['(' + temp.query + ')', "AND"]);
                    whereParams.push(...temp.params);
                }
            }
        }
        whereQuery.push('(`' + this.name + '`' + '.' + '`is_deleted` = ?)');
        whereParams.push(false);
        // ORDER BY
        temp = this.getSortQueryStr(query.sort_by);
        if (temp.error) {
            // sort by this.sortAttribute[0] by default
            if (sortAttrs[0]) {
                temp = this.getSortQueryStr(sortAttrs[0] + "-asc");
                if (!temp.error) {
                    sortQuery.push(...[temp.query]);
                }
            }
        } else {
            sortQuery.push(...[temp.query]);
        }
        // LIMIT & OFFSET
        pagingQuery.push("LIMIT ?");
        pagingParams.push(query.limit);
        pagingQuery.push("OFFSET ?");
        pagingParams.push(query.offset);
        return {
            parsedQuery: query,
            whereQueryStr: whereQuery.join(" "),
            sortQueryStr: sortQuery.join(" "),
            pagingQueryStr: pagingQuery.join(" "),
            whereParams,
            pagingParams
        }
    }

    validate(row) {
        for (let attr in this.attribute) {
            if (attr in row) {
                for (let key in this.attribute[attr]) {
                    if(!this.attribute[attr][key].validate(row[attr])) {
                        throw new HttpError({ statusCode: 400, message: `${attr} is invalid.` });
                    }
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