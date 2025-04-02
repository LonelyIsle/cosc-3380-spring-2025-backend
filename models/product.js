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
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "category_id": {
        type: DataType.ARRAY(DataType.NUMBER()),
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

async function getAll(conn, query) {
    let categoryIdsQuery = query.category_id;
    let validator = DataType.ARRAY(DataType.NUMBER());
    if (!validator.validate(categoryIdsQuery)) {
        categoryIdsQuery = [];
    }
    let joinQuery = "WHERE";
    if (categoryIdsQuery.length !== 0) {
        joinQuery = 'INNER JOIN `product_category` ON `product`.`id` = `product_category`.`product_id`'
            + ' WHERE `product_category`.`category_id` IN (' + categoryIdsQuery.join(",") + ') AND `product_category`.`is_deleted`=false' 
            + ' AND';
    }
    let { parsedQuery, whereQueryStr, sortQueryStr, pagingQueryStr, whereParams, pagingParams } = productTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `product`.`id`) FROM `product` ' + joinQuery + ' ' + whereQueryStr + ' ORDER BY ' + sortQueryStr,
        whereParams
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `product`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT DISTINCT `product`.* FROM `product` ' + joinQuery + ' ' + whereQueryStr + ' ORDER BY ' + sortQueryStr + ' ' + pagingQueryStr,
        whereParams.concat(pagingParams)
    );
    for (let row of rows) {
        row.category = await categoryModel.getAllByProductId(conn, row.id);
    }
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
    const [rows] = await conn.query(
        'SELECT * FROM `product` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    if (rows[0]) {
        rows[0].category = await categoryModel.getAllByProductId(conn, rows[0].id);
    }
    return rows[0] || null;
}

export default {
    productTable,
    getAll,
    getOne
}