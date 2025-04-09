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
        type: DataType.STRING({ check: (val) => /^[^ ]*$/.test(val) }),
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
    sort: ["code", "created_at", "updated_at"],
    filter: {
        "code": DataType.STRING(),
    }
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

async function getOneByCode(conn, code) {
    let data = utils.objectAssign(["code"], { code });
    couponTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `coupon` WHERE `code` = ? AND `is_deleted` = ?',
        [data.code, false]
    );
    return rows[0] || null;
}

async function getAll(conn, query) {
    let { 
        parsedQuery, 
        whereQueryStr, 
        sortQueryStr, 
        pagingQueryStr, 
        whereParams, 
        pagingParams 
    } = couponTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `coupon`.`id`) FROM `coupon` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr),
        whereParams
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `coupon`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT `coupon`.* FROM `coupon` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr)
        + (!sortQueryStr ? ' ' : ' ORDER BY ' + sortQueryStr)
        + (!pagingQueryStr ? ' ' : ' ' + pagingQueryStr),
        whereParams.concat(pagingParams)
    );
    return {
        total,
        limit: pagingQueryStr ? parsedQuery.limit : total,
        offset: pagingQueryStr ? parsedQuery.offset : 0,
        rows
    };
}

async function createOne(conn, coupon) {
    let data = utils.objectAssign(
        [
            "code",
            "value",
            "start_at",
            "end_at",
            "type",
            "description"
        ], 
        coupon
    );
    couponTable.validate(data);
    const [rows] = await conn.query(
        'INSERT INTO `coupon`('
        + '`code`,'
        + '`value`,'
        + '`start_at`,'
        + '`end_at`,'
        + '`type`,'
        + '`description`'
        + ') VALUES (?, ?, ?, ?, ?, ?)',
        [
            data.code,
            data.value,
            new Date(data.start_at),
            new Date(data.end_at),
            data.type,
            data.description
        ]
    );
    return rows.insertId;
}

async function updateOne(conn, newCoupon) {
    let oldCoupon = await getOne(conn, newCoupon.id);
    if (!oldCoupon) {
        throw new HttpError({statusCode: 400, message: `coupon not found.`});
    }
    let data = utils.objectAssign(
        [
            "id",
            "code",
            "value",
            "start_at",
            "end_at",
            "type",
            "description"
        ], 
        oldCoupon, 
        newCoupon
    );
    couponTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `coupon` SET '
        + '`code` = ?,'
        + '`value` = ?,'
        + '`start_at` = ?,'
        + '`end_at` = ?,'
        + '`type` = ?,'
        + '`description` = ?' 
        + ' WHERE `id` = ? AND `is_deleted` = ?',
        [   
            data.code,
            data.value,
            new Date(data.start_at),
            new Date(data.end_at),
            data.type,
            data.description,
            data.id,
            false
        ]
    );
    return newCoupon.id;
}

export default {
    table: couponTable,
    FIXED_AMOUNT_TYPE,
    PERCENTAGE_TYPE,
    TYPES,
    getOneActive,
    getOneActiveByCode,
    getOne,
    getOneByCode,
    getAll,
    createOne,
    updateOne
}