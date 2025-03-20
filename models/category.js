import dataType from "./dataType.js";
import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";

const TABLE_NAME = "category";
const ATTRIBUTES = {
    "id": {
        type: dataType.INT(),
        isRequired: dataType.NOTNULL()
    },
    "name": {
        type: dataType.LONGTEXT(),
        isRequired: dataType.NOTNULL()
    },
    "description": {
        type: dataType.LONGTEXT(),
        isRequired: dataType.NULLABLE()
    },
    "created_at": {
        type: dataType.TIMESTAMP(),
        isRequired: dataType.NULLABLE()
    },
    "updated_at": {
        type: dataType.TIMESTAMP(),
        isRequired: dataType.NULLABLE()
    },
    "deleted_at": {
        type: dataType.TIMESTAMP(),
        isRequired: dataType.NULLABLE()
    },
    "is_deleted": {
        type: dataType.TINYINT(),
        isRequired: dataType.NULLABLE()
    }
};

function validate(category) {
    for (let attr in ATTRIBUTES) {
        if (attr in category) {
            for (let key in ATTRIBUTES[attr]) {
                ATTRIBUTES[attr][key].validate(category[attr], attr);
            }
        }
    }
}

function queryBuilder(query) {
    let queryString = ['WHERE'];
    let countQueryString = "";
    let params = [];
    // WHERE
    if (query.q) {
        queryString.push("`name` LIKE ? AND");
        params.push('%' + query.q.toString().trim() + '%');
    }
    queryString.push('`is_deleted` = ?');
    params.push(false);
    // ORDER BY
    queryString.push("ORDER BY");
    switch(query.sort_by && query.sort_by.toLowerCase()) {
        case "name-asc":
            queryString.push('`name`', 'ASC');
            break;
        case "name-dsc":
            queryString.push('`name`', 'DESC');
            break;
        case "created_at-asc":
            queryString.push('`created_at`', 'ASC');
            break;
        case "created_at-dsc":
            queryString.push('`created_at`', 'DESC');
            break;
        default:
            queryString.push('`name`', 'ASC');
            break
    }
    // LIMIT & OFFSET
    countQueryString = queryString.join(" ");
    queryString.push("LIMIT ?");
    params.push(query.limit ? query.limit : 10);
    queryString.push("OFFSET ?");
    params.push(query.offset ? query.offset : 0);
    return {
        queryString: queryString.join(" "),
        countQueryString,
        params: params
    }
}

async function count(conn, countQueryString, params) {
    const [rows, fields] = await conn.query(
        'SELECT COUNT(*) FROM `' + TABLE_NAME + '` ' + countQueryString,
        params
    );
    return (rows[0] && rows[0]["COUNT(*)"]) || 0;
}

async function getAll(conn, query) {
    query = utils.objectAssign(
        ["q", "sort_by", "limit", "offset"],
        { limit: 10, offset: 0 },
        query
    );
    let { queryString, countQueryString, params } = queryBuilder(query);
    const total = await count(conn, countQueryString, params);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + TABLE_NAME + '` ' + queryString,
        params
    );
    return {
        total,
        limit: query.limit,
        offset: query.offset,
        rows
    };
}

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    validate(data);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + TABLE_NAME + '` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function createOne(conn, category) {
    let data = utils.objectAssign(["name", "description"], category);
    validate(data);
    const [rows, fields] = await conn.query(
        'INSERT INTO `' + TABLE_NAME + '`(`name`, `description`) VALUES (?, ?)',
        [data.name, data.description]
    );
    return rows.insertId;
}

async function updateOne(conn, newCategory) {
    let oldCategory = await getOne(conn, newCategory.id);
    if (!oldCategory) {
        throw new HttpError({statusCode: 400, message: `category ${newCategory.id} not found`});
    }
    let data = utils.objectAssign(["id", "name", "description"], oldCategory, newCategory);
    validate(data);
    const [rows, fields] = await conn.query(
        'UPDATE `' + TABLE_NAME + '` SET name = ?, description = ? WHERE `id` = ? AND `is_deleted` = ?',
        [data.name, data.description, data.id, false]
    );
    return newCategory.id;
}

async function deleteOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    validate(data);
    const [rows, fields] = await conn.query(
        'UPDATE `' + TABLE_NAME + '` SET is_deleted = ?, deleted_at = ? WHERE `id` = ? AND `is_deleted` = ?',
        [true, new Date(), id, false]
    );
    return rows;
}

export default {
    TABLE_NAME,
    ATTRIBUTES,
    validate,
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
}