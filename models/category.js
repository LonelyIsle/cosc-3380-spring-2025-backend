import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import { Table, DataType } from "../helpers/table.js";

const categoryTable = new Table("category", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "name": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "description": {
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "created_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    },
    "updated_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    },
    "deleted_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NULLABLE()
    },
    "is_deleted": {
        type: DataType.TINYINT(),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: ["name", "created_at", "updated_at"],
    filter: {
        "name": DataType.STRING()
    }
});

async function count(conn, countQueryStr, params) {
    const [rows, fields] = await conn.query(
        'SELECT COUNT(*) FROM `' + categoryTable.name + '` ' + countQueryStr,
        params
    );
    return (rows[0] && rows[0]["COUNT(*)"]) || 0;
}

async function getAll(conn, query) {
    let { parsedQuery, queryStr, countQueryStr, params } = categoryTable.getQueryStr(query);
    const total = await count(conn, countQueryStr, params);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + categoryTable.name + '` ' + queryStr,
        params
    );
    return {
        total,
        limit: parsedQuery.limit,
        offset: parsedQuery.offset,
        rows
    };
}

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    categoryTable.validate(data);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + categoryTable.name + '` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function createOne(conn, category) {
    let data = utils.objectAssign(["name", "description"], category);
    categoryTable.validate(data);
    const [rows, fields] = await conn.query(
        'INSERT INTO `' + categoryTable.name + '`(`name`, `description`) VALUES (?, ?)',
        [data.name, data.description]
    );
    return rows.insertId;
}

async function updateOne(conn, newCategory) {
    let oldCategory = await getOne(conn, newCategory.id);
    if (!oldCategory) {
        throw new HttpError({statusCode: 400, message: `category ${newCategory.id} not found.`});
    }
    let data = utils.objectAssign(["id", "name", "description"], oldCategory, newCategory);
    categoryTable.validate(data);
    const [rows, fields] = await conn.query(
        'UPDATE `' + categoryTable.name + '` SET name = ?, description = ? WHERE `id` = ? AND `is_deleted` = ?',
        [data.name, data.description, data.id, false]
    );
    return newCategory.id;
}

async function deleteOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    categoryTable.validate(data);
    const [rows, fields] = await conn.query(
        'UPDATE `' + categoryTable.name + '` SET is_deleted = ?, deleted_at = ? WHERE `id` = ? AND `is_deleted` = ?',
        [true, new Date(), id, false]
    );
    return rows;
}

export default {
    categoryTable,
    getAll,
    getOne,
    createOne,
    updateOne,
    deleteOne
}