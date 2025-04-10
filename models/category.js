import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import Validator from "../helpers/validator.js";
import productCategoryModel from "./productCategory.js";

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
        type: DataType.NUMBER({ check: (val) => [0, 1].indexOf(val) > -1 }),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: ["name", "created_at", "updated_at"],
    filter: {
        "name": DataType.STRING(),
    }
});

async function getAll(conn, query) {
    let { 
        parsedQuery, 
        whereQueryStr, 
        sortQueryStr, 
        pagingQueryStr, 
        whereParams, 
        pagingParams 
    } = categoryTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `category`.`id`) FROM `category` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr),
        whereParams
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `category`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT `category`.* FROM `category` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr)
        + (!sortQueryStr ? ' ' : ' ORDER BY ' + sortQueryStr)
        + (!pagingQueryStr ? ' ' : ' ' + pagingQueryStr),
        whereParams.concat(pagingParams)
    );
    return {
        total,
        limit: pagingQueryStr ? parsedQuery.limit : total,
        offset: pagingQueryStr ? parsedQuery.offset : 0,
        rows
    };
}

async function getManyByIds(conn, ids, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    const [rows] = await conn.query(
        'SELECT * FROM `category` WHERE `id` IN (?) AND `is_deleted` = ?',
        [ids, false]
    );
    if (opt.include) {
        await include(conn, rows);
    }
    return rows;
}

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    categoryTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `category` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function createOne(conn, category) {
    let data = utils.objectAssign(["name", "description"], category);
    categoryTable.validate(data);
    const [rows] = await conn.query(
        'INSERT INTO `category`(`name`, `description`) VALUES (?, ?)',
        [data.name, data.description]
    );
    return rows.insertId;
}

async function updateOne(conn, newCategory) {
    let oldCategory = await getOne(conn, newCategory.id);
    if (!oldCategory) {
        throw new HttpError({statusCode: 400, message: `category not found.`});
    }
    let data = utils.objectAssign(["id", "name", "description"], oldCategory, newCategory);
    categoryTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `category` SET name = ?, description = ? WHERE `id` = ? AND `is_deleted` = ?',
        [data.name, data.description, data.id, false]
    );
    return data.id;
}

async function deleteOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    categoryTable.validate(data);
    let now = new Date();
    const [rows] = await conn.query(
        'UPDATE `category` SET is_deleted = ?, deleted_at = ? WHERE `id` = ? AND `is_deleted` = ?',
        [true, now, id, false]
    );
    await productCategoryModel.deleteProductByCategoryId(conn, data.id);
    return rows;
}

export default {
    table: categoryTable,
    getAll,
    getManyByIds,
    getOne,
    createOne,
    updateOne,
    deleteOne
}