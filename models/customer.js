import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import pwd from "../helpers/pwd.js";

const customerTable = new Table("customer", {
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
    "shipping_address_1":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "shipping_address_2":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "shipping_address_city":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "shipping_address_state":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "shipping_address_zip":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "billing_address_1":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "billing_address_2":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "billing_address_city":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "billing_address_state":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "billing_address_zip":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "card_name":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "card_number":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "card_expire_month":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "card_expire_year":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()

    },
    "card_code":{ 
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
    sort: ["last_name", "first_name", "middle_name", "created_at", "updated_at"],
});

async function getOneByEmail(conn, email) {
    let data = utils.objectAssign(["email"], { email });
    customerTable.validate(data);
    const [rows, fields] = await conn.query(
        'SELECT * FROM `' + customerTable.name + '` WHERE `email` = ? AND `is_deleted` = ?',
        [data.email, false]
    );
    return rows[0] || null;
}

async function getOneByEmailAndPwd(conn, email, password) {
    let data = utils.objectAssign(["email", "password"], { email, password });
    customerTable.validate(data);
    let customer = await getOneByEmail(conn, data.email);
    if (customer && await pwd.compare(password, customer.password)) {
        return customer;
    }
    return null;
}

async function createOne(conn, customer) {
    let data = utils.objectAssign(["first_name", "middle_name", "last_name", "email", "password"], customer);
    customerTable.validate(data);
    let existedCustomer = await getOneByEmail(conn, data.email);
    if (existedCustomer) {
        throw new HttpError({statusCode: 400, message: `This email is registered.`});
    }
    data.password = await pwd.hash(data.password);
    const [rows, fields] = await conn.query(
        'INSERT INTO `' + customerTable.name + '`(`first_name`, `middle_name`, `last_name`, `email`, `password`) VALUES (?, ?, ?, ?, ?)',
        [data.first_name, data.middle_name, data.last_name, data.email, data.password]
    );
    return rows.insertId;
}

export default {
    customerTable,
    createOne,
    getOneByEmail,
    getOneByEmailAndPwd
}