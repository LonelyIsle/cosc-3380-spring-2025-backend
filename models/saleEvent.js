import utils from "../helpers/utils.js";
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
        isRequired: DataType.NULLABLE()
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
    sort: ["title", "created_at", "updated_at"],
    filter: {
        "title": DataType.STRING(),
    }
});

async function include(conn, rows) {
    const _include = async (obj) => {
        if (obj) {
            if (obj.coupon_id) {
                obj.coupon = await couponModel.getOne(conn, obj.coupon_id);
            } else {
                obj.coupon = null;
            }
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

async function getAll(conn, query, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let { 
        parsedQuery, 
        whereQueryStr, 
        sortQueryStr, 
        pagingQueryStr, 
        whereParams, 
        pagingParams 
    } = saleEventTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `sale_event`.`id`) FROM `sale_event` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr),
        whereParams
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `sale_event`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT `sale_event`.* FROM `sale_event` ' 
        + (!whereQueryStr ? ' ' :  ' WHERE ' + whereQueryStr)
        + (!sortQueryStr ? ' ' : ' ORDER BY ' + sortQueryStr)
        + (!pagingQueryStr ? ' ' : ' ' + pagingQueryStr),
        whereParams.concat(pagingParams)
    );
    if (opt.include) {
        await include(conn, rows);
    }
    return {
        total,
        limit: pagingQueryStr ? parsedQuery.limit : total,
        offset: pagingQueryStr ? parsedQuery.offset : 0,
        rows
    };
}

async function getOneActive(conn, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    const [rows] = await conn.query(
        'SELECT `sale_event`.* FROM `sale_event` WHERE (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [false]
    );
    if (opt.include) {
        await include(conn, rows[0]);
    }
    return rows[0] || null;
}

async function getOne(conn, id, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let data = utils.objectAssign(["id"], { id });
    saleEventTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `sale_event` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    if (opt.include) {
        await include(conn, rows[0]);
    }
    return rows[0] || null;
}

async function createOne(conn, saleEvent) {
    let data = utils.objectAssign(
        [
            "coupon_id",
            "start_at",
            "end_at",
            "title",
            "description"
        ], 
        saleEvent
    );
    saleEventTable.validate(data);
    const [rows] = await conn.query(
        'INSERT INTO `sale_event`('
        + '`coupon_id`,'
        + '`start_at`,'
        + '`end_at`,'
        + '`title`,'
        + '`description`'
        + ') VALUES (?, ?, ?, ?, ?)',
        [
            data.coupon_id,
            new Date(data.start_at),
            new Date(data.end_at),
            data.title,
            data.description
        ]
    );
    return rows.insertId;
}

async function updateOne(conn, newSaleEvent) {
    let oldSaleEvent = await getOne(conn, newSaleEvent.id);
    if (!oldSaleEvent) {
        throw new HttpError({statusCode: 400, message: `sale event not found.`});
    }
    let data = utils.objectAssign(
        [
            "id",
            "coupon_id",
            "start_at",
            "end_at",
            "title",
            "description"
        ], 
        oldSaleEvent, 
        newSaleEvent
    );
    saleEventTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `sale_event` SET '
        + '`coupon_id` = ?,'
        + '`start_at` = ?,'
        + '`end_at` = ?,'
        + '`title` = ?,'
        + '`description` = ?' 
        + ' WHERE `id` = ? AND `is_deleted` = ?',
        [   
            data.coupon_id,
            new Date(data.start_at),
            new Date(data.end_at),
            data.title,
            data.description,
            data.id,
            false
        ]
    );
    return data.id;
}

export default {
    table: saleEventTable,
    getAll,
    getOneActive,
    getOne,
    updateOne,
    createOne
}