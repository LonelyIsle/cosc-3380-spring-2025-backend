import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

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
        type: DataType.NUMBER({ check: (val) => (val === 0 || val === 1) }),
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
    sort: ["code", "value", "created_at", "updated_at"],
    filter: {
        "code": DataType.STRING(),
        "value": DataType.NUMBER()
    }
});

async function getOneByCode(conn, code) {
    let data = utils.objectAssign(["code"], { code });
    couponTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `coupon` WHERE `code` = ? AND (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [data.code, false]
    );
    return rows[0] || null;
}

export default {
    couponTable,
    getOneByCode
}