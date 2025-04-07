import utils from "../helpers/utils.js"
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import categoryModel from "./category.js";

const productTable = new Table("product", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "sku": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "price": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "quantity": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "threshold": {
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
    "image": {
        type: DataType.BLOB(),
        isRequired: DataType.NULLABLE()
    },
    "image_extension": {
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
    sort: ["name", "price", "created_at", "updated_at"],
    filter: {
        "name": DataType.STRING(),
        "price": DataType.NUMBER(),
        "quantity": DataType.NUMBER()
    }
});

const COLS_LITE_STR = [
    "`id`",
    "`sku`",
    "`price`",
    "`quantity`",
    "`threshold`",
    "`name`",
    "`description`",
    "`created_at`",
    "`updated_at`",
    "`deleted_at`",
    "`is_deleted`",
].join(",");

async function getAll(conn, inclImg = false) {
    const [rows] = await conn.query(
        'SELECT ' + (inclImg ? '*' : COLS_LITE_STR) + ' FROM `product` WHERE `is_deleted` = ?',
        [false]
    );
    for (let row of rows) {
        row.category = await categoryModel.getAllByProductId(conn, row.id);
        if (row.image) {
            row.image = Buffer.from(row.image).toString('base64');
        }
    }
    return rows;
}

async function getManyByIds(conn, ids, inclImg = false) {
    const [rows] = await conn.query(
        'SELECT ' + (inclImg ? '*' : COLS_LITE_STR) + ' FROM `product` WHERE `id` IN (?) AND `is_deleted` = ?',
        [ids, false]
    );
    for (let row of rows) {
        row.category = await categoryModel.getAllByProductId(conn, row.id);
        if (row.image) {
            row.image = Buffer.from(row.image).toString('base64');
        }
    }
    return rows;
}

async function getOne(conn, id, inclImg = false) {
    let data = utils.objectAssign(["id"], { id });
    productTable.validate(data);
    const [rows] = await conn.query(
        'SELECT ' + (inclImg ? '*' : COLS_LITE_STR) + ' FROM `product` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    if (rows[0]) {
        rows[0].category = await categoryModel.getAllByProductId(conn, rows[0].id);
        if (rows[0].image) {
            rows[0].image = Buffer.from(rows[0].image).toString('base64');
        }
    }
    return rows[0] || null;
}

async function updateManyQuantityByIds(conn, products) {
    let queryStrs = [];
    let params = [];
    let result = [];
    for (let product of products) {
        let data = utils.objectAssign(["id", "quantity"], product);
        productTable.validate(data);
        queryStrs.push('UPDATE `product` SET `quantity` = `quantity` + ? WHERE `id` = ? AND `is_deleted` = ?');
        params.push([data.quantity, data.id, false]);
        result.push(data.id);
    }
    for (let i = 0; i <  queryStrs.length; i++) {
        const [rows] = await conn.query(
            queryStrs[i],
            params[i]
        );
    }
    return result;
}

export default {
    table: productTable,
    getAll,
    getOne,
    getManyByIds,
    updateManyQuantityByIds
}