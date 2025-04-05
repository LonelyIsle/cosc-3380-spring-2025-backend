import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

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
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: [],
    filter: {}
});

async function getAll(conn) {
    const [rows] = await conn.query(
        'SELECT * FROM `category` WHERE `is_deleted` = false',
        [false]
    );
    return rows;
}

async function getAllByProductId(conn, productId) {
    let data = utils.objectAssign(["productId"], { productId });
    let validator = DataType.NUMBER();
    if (!data.productId || !validator.validate(data.productId)) {
        throw new HttpError({ statusCode: 400, message: `productId is invalid.` });
    }
    const [rows] = await conn.query(
        'SELECT DISTINCT `category`.* FROM `category` INNER JOIN `product_category` ON `product_category`.`category_id` = `category`.`id` WHERE `product_category`.`product_id` = ? AND `category`.`is_deleted` = ?',
        [data.productId, false]
    );
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
        throw new HttpError({statusCode: 400, message: `category ${newCategory.id} not found.`});
    }
    let data = utils.objectAssign(["id", "name", "description"], oldCategory, newCategory);
    categoryTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `category` SET name = ?, description = ? WHERE `id` = ? AND `is_deleted` = ?',
        [data.name, data.description, data.id, false]
    );
    return newCategory.id;
}

async function deleteOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    categoryTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `category` SET is_deleted = ?, deleted_at = ? WHERE `id` = ? AND `is_deleted` = ?',
        [true, new Date(), id, false]
    );
    return rows;
}

export default {
    categoryTable,
    getAll,
    getAllByProductId,
    getOne,
    createOne,
    updateOne,
    deleteOne
}