import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import couponModel from "./coupon.js";

const saleEventTable = new Table("sale_event", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "coupon_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "start_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NOTNULL()
    },
    "end_at": {
        type: DataType.TIMESTAMP(),
        isRequired: DataType.NOTNULL()
    },
    "title": {
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
        type: DataType.NUMBER({ check: (val) => (val === 0 || val === 1) }),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: [],
    filter: {}
});

async function getAll(conn) {
    const [rows] = await conn.query(
        'SELECT * FROM `sale_event` WHERE (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [false]
    );
    for (let row of rows) {
        row.coupon = await couponModel.getOne(conn, row.coupon_id);
    }
    return rows;
}

export default {
    saleEventTable,
    getAll
}