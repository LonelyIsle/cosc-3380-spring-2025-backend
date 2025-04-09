import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

const PERCENTAGE_TYPE = 0;
const FIXED_AMOUNT_TYPE = 1;
const TYPES = [PERCENTAGE_TYPE, FIXED_AMOUNT_TYPE];

const couponTable = new Table("coupon", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "code": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "value": {
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
    "type": {
        // 0: percentage, 1: fixed amount
        type: DataType.NUMBER({ check: (val) => TYPES.indexOf(val) > -1 }),
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

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    couponTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `coupon` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function getOneActive(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    couponTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `coupon` WHERE `id` = ? AND (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function getOneActiveByCode(conn, code) {
    let data = utils.objectAssign(["code"], { code });
    couponTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `coupon` WHERE `code` = ? AND (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [data.code, false]
    );
    return rows[0] || null;
}

export default {
    table: couponTable,
    FIXED_AMOUNT_TYPE,
    PERCENTAGE_TYPE,
    TYPES,
    getOneActive,
    getOneActiveByCode,
    getOne
}