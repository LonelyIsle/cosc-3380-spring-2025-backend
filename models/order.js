import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

const orderTable = new Table("order", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "customer_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "customer_email": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "customer_is_subscription": {
        type: DataType.NUMBER({ check: (val) => (val === 0 || val === 1) }),
        isRequired: DataType.NOTNULL()
    },
    "coupon_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    },
    "product_id": {
        type: DataType.ARRAY(DataType.NUMBER()),
        isRequired: DataType.NOTNULL()
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
    sort: [],
    filter: {}
});

async function getAll(conn) {
    const [rows] = [[]];
    return rows;
}

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    orderTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `order` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function createOne(conn, order) {
    let data = utils.objectAssign(["name", "description"], order);
    orderTable.validate(data);
    const [rows] = [[]];
    return rows.insertId;
}

export default {
    getAll,
    getOne,
    createOne
}