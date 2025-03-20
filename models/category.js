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

async function count(conn, query) {
    let {
        limit = 10,
        offset = 0
    } = query;
    const [rows, fields] = await conn.query(
        'SELECT COUNT(*) FROM `' + TABLE_NAME + '` WHERE `is_deleted` = ? ORDER BY `name` LIMIT ? OFFSET ?',
        [false, limit, offset]
    );
    return rows[0]["COUNT(*)"];
}

async function getAll(conn, query) {
    let {
        limit = 10,
        offset = 0
    } = query;
    const total = await count(conn, query);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + TABLE_NAME + '` WHERE `is_deleted` = ? ORDER BY `name` LIMIT ? OFFSET ?',
        [false, limit, offset]
    );
    return {
        total,
        limit,
        offset,
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