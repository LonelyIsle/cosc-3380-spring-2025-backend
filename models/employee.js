import utils from "../helpers/utils.js";
import auth from "../helpers/auth.js"
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import pwd from "../helpers/pwd.js";

const employeeTable = new Table("employee", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "first_name": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "middle_name": {
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "last_name": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "email": {
        type: DataType.STRING({ check: (val) => /^.+@.+$/.test(val)}),
        isRequired: DataType.NOTNULL()
    },
    "password": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "role": {
        // 0: staff, 1: manager
        type: DataType.NUMBER({ check: (val) => auth.EMPLOYEE_ROLES.indexOf(val) > -1 }),
        isRequired: DataType.NOTNULL()
    },
    "hourly_rate": {
        type: DataType.NUMBER(),
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
    sort: [],
    filter: {}
});

function prepare(rows) {
    const _prepare = (obj) => {
        if (obj) {
            delete obj.password;
        }
    }
    if (!Array.isArray(rows)) {
        _prepare(rows);
    } else {
        for (let row of rows) {
            _prepare(row);
        }
    }
}

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    employeeTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `employee` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}

async function getOneStaff(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    employeeTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `employee` WHERE `id` = ? AND `role` = ? AND `is_deleted` = ?',
        [data.id, auth.STAFF, false]
    );
    return rows[0] || null;
}

async function getOneByEmail(conn, email) {
    let data = utils.objectAssign(["email"], { email });
    employeeTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `employee` WHERE `email` = ? AND `is_deleted` = ?',
        [data.email, false]
    );
    return rows[0] || null;
}

async function getOneByEmailAndPwd(conn, email, password) {
    let data = utils.objectAssign(["email", "password"], { email, password });
    employeeTable.validate(data);
    let employee = await getOneByEmail(conn, data.email);
    if (employee && await pwd.compare(password, employee.password)) {
        return employee;
    }
    return null;
}

async function updatePassword(conn, id, password) {
    let data = utils.objectAssign(["id", "password"], { id, password });
    employeeTable.validate(data);
    let employee = await getOne(conn, data.id);
    if (!employee) {
        throw new HttpError({statusCode: 400, message: `employee not found.`});
    }
    data.password = await pwd.hash(data.password);
    const [rows] = await conn.query(
        'UPDATE `employee` SET password = ? WHERE `id` = ? AND `is_deleted` = ?',
        [data.password, data.id, false]
    );
    return id;
}

async function updateOne(conn, newEmployee) {
    let oldEmployee = await getOne(conn, newEmployee.id);
    if (!oldEmployee) {
        throw new HttpError({statusCode: 400, message: `employee not found.`});
    }
    let data = utils.objectAssign(
        [
            "id", 
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "role",
            "hourly_rate"
        ], 
        oldEmployee, 
        newEmployee
    );
    employeeTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `employee` SET '
        + '`first_name` = ?, '
        + '`middle_name` = ?, '
        + '`last_name` = ?, '
        + '`email` = ?,'
        + '`role` = ?,'
        + '`hourly_rate` = ?'
        + ' WHERE `id` = ? AND `is_deleted` = ?',
        [
            data.first_name,
            data.middle_name,
            data.last_name,
            data.email,
            data.role,
            data.hourly_rate,
            data.id,
            false
        ]
    );
    return newEmployee.id;
}

export default {
    table: employeeTable,
    prepare,
    getOne,
    getOneStaff,
    getOneByEmail,
    getOneByEmailAndPwd,
    updatePassword,
    updateOne
}