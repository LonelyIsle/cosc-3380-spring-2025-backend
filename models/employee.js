import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import { Table, DataType } from "../helpers/table.js";
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
        type: DataType.STRING(/^.+@.+$/),
        isRequired: DataType.NOTNULL()
    },
    "password": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "roles": {
        type: DataType.NUMBER(),
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

async function getOneByEmail(conn, email) {
    let data = utils.objectAssign(["email"], { email });
    employeeTable.validate(data);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + employeeTable.name + '` WHERE `email` = ? AND `is_deleted` = ?',
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
    getOneByEmail,
    getOneByEmailAndPwd
}