import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import Validator from "../helpers/validator.js";
import employeeModel from "./employee.js";

const UNREAD_STATUS = 0;
const READ_STATUS = 1;
const STATUS = [UNREAD_STATUS, READ_STATUS];

const notificationTable = new Table("notification", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "employee_id": {
        type: DataType.NUMBER(),
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
    "status": {
        type: DataType.NUMBER({ check: (val) => STATUS.indexOf(val) > -1 }),
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
            if (obj.employee_id) {
                obj.employee = await employeeModel.getOne(conn, obj.employee_id);
                employeeModel.prepare(obj.employee);
            } else {
                obj.employee = null;
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

async function getAllByEmployeeId(conn, employee_id, query, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let data = utils.objectAssign(["employee_id"], { employee_id });
    notificationTable.validate(data);
    let { 
        parsedQuery, 
        whereQueryStr, 
        sortQueryStr, 
        pagingQueryStr, 
        whereParams, 
        pagingParams 
    } = notificationTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `notification`.`id`) FROM `notification` ' 
        + (!whereQueryStr ? ' WHERE `notification`.`employee_id` = ? ' :  ' WHERE `notification`.`employee_id` = ? AND ' + whereQueryStr),
        [data.employee_id].concat(whereParams)
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `notification`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT `notification`.* FROM `notification` ' 
        + (!whereQueryStr ? ' WHERE `notification`.`employee_id` = ? ' :  ' WHERE `notification`.`employee_id` = ? AND ' + whereQueryStr)
        + (!sortQueryStr ? ' ' : ' ORDER BY ' + sortQueryStr)
        + (!pagingQueryStr ? ' ' : ' ' + pagingQueryStr),
        [data.employee_id].concat(whereParams, pagingParams)
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

async function getOne(conn, id, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let data = utils.objectAssign(["id"], { id });
    notificationTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `notification` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    if (opt.include) {
        await include(conn, rows[0]);
    }
    return rows[0] || null;
}

async function getOneByEmployeeId(conn, employee_id, id, opt = {}) {
    opt = utils.objectAssign(["include"], { include: false }, opt);
    let data = utils.objectAssign(["id", "employee_id"], { id, employee_id });
    notificationTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `notification` WHERE `id` = ? AND `employee_id` = ? AND `is_deleted` = ?',
        [data.id, data.employee_id, false]
    );
    if (opt.include) {
        await include(conn, rows[0]);
    }
    return rows[0] || null;
}

async function updateOne(conn, newNotification) {
    let oldNotification = await getOne(conn, newNotification.id);
    if (!oldNotification) {
        throw new HttpError({statusCode: 400, message: `notification not found.`});
    }
    let data = utils.objectAssign(["id", "employee_id", "status"], oldNotification, newNotification);
    notificationTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `notification` SET status = ? WHERE `id` = ? AND `employee_id` = ? AND `is_deleted` = ?',
        [data.status, data.id, data.employee_id, false]
    );
    return data.id;
}

async function deleteManyByEmployeeId(conn, employee_id) {
    let data = utils.objectAssign(["employee_id"], { employee_id });
    notificationTable.validate(data);
    let now = new Date();
    const [rows] = await conn.query(
        'UPDATE `notification` SET is_deleted = ?, deleted_at = ? WHERE `employee_id` = ? AND `is_deleted` = ?',
        [true, now, data.employee_id, false]
    );
    return rows;
}

export default {
    table: notificationTable,
    getAllByEmployeeId,
    getOne,
    getOneByEmployeeId,
    updateOne,
    deleteManyByEmployeeId
}