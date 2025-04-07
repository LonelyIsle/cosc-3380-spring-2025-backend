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
        type: DataType.NUMBER({ check: (val) => [0, 1].indexOf(val) > -1 }),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: [],
    filter: {}
});

async function include(conn, rows) {
    const _include = async (obj) => {
        if (obj) {
            obj.coupon = await couponModel.getOne(conn, obj.coupon_id);
        }
    }
    if (!Array.isArray(rows)) {
        await _include(rows);
    } else {
        for (let row of rows) {
            await _include(row);
        }
    }
}

async function getAll(conn, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    const [rows] = await conn.query(
        'SELECT * FROM `sale_event` WHERE (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [false]
    );
    if (opt.include) {
        await include(conn, rows);
    }
    return rows;
}

export default {
    table: saleEventTable,
    getAll
}