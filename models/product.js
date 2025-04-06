import utils from "../helpers/utils.js"
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import categoryModel from "./category.js";

const productTable = new Table("product", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "category_id": {
        type: DataType.ARRAY(DataType.NUMBER()),
        isRequired: DataType.NULLABLE()
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
        type: DataType.NUMBER({ check: (val) => (val === 0 || val === 1) }),
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

async function getAll(conn) {
    const [rows] = await conn.query(
        'SELECT * FROM `product` WHERE `is_deleted` = ?',
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

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    productTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `product` WHERE `id` = ? AND `is_deleted` = ?',
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

export default {
    productTable,
    getAll,
    getOne
}