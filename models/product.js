import utils from "../helpers/utils.js"
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

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
    "thumbnail_image": {
        type: DataType.BLOB(),
        isRequired: DataType.NULLABLE()
    },
    "thumbnail_image_extension": {
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
    sort: ["name", "price", "created_at", "updated_at"],
    filter: {
        "name": DataType.STRING(),
        "price": DataType.NUMBER(),
        "quantity": DataType.NUMBER()
    }
});

async function count(conn, countQueryStr, params) {
    const [rows, fields] = await conn.query(
        'SELECT COUNT(*) FROM `' + productTable.name + '` ' + countQueryStr,
        params
    );
    return (rows[0] && rows[0]["COUNT(*)"]) || 0;
}

async function getAll(conn, query) {
    let { parsedQuery, queryStr, countQueryStr, params } = productTable.getQueryStr(query);
    const total = await count(conn, countQueryStr, params);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + productTable.name + '` ' + queryStr,
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
    productTable.validate(data);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + productTable.name + '` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

export default {
    productTable,
    getAll,
    getOne
}