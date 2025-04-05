import utils from "../helpers/utils.js"
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
        type: DataType.NUMBER({ check: (val) => (val === 0 || val === 1) }),
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
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: ["last_name", "first_name", "middle_name", "created_at", "updated_at"],
});

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    employeeTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `employee` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
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

export default {
    employeeTable,
    getOne,
    getOneByEmail,
    getOneByEmailAndPwd
}