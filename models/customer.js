import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import pwd from "../helpers/pwd.js";
import subscriptionModel from "./subscription.js";

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
        type: DataType.STRING({ check: (val) => /^.+@.+$/.test(val)}),
        isRequired: DataType.NOTNULL()
    },
    "password": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "reset_password_question": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "reset_password_answer": {
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
    sort: [],
    filter: {}
});

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    customerTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `customer` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    if (rows[0]) {
        rows[0].subscription = await subscriptionModel.getOneByCustomerID(conn, rows[0].id);
    }
    return rows[0] || null;
}

async function getOneByEmail(conn, email) {
    let data = utils.objectAssign(["email"], { email });
    customerTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `customer` WHERE `email` = ? AND `is_deleted` = ?',
        [data.email, false]
    );
    if (rows[0]) {
        rows[0].subscription = await subscriptionModel.getOneByCustomerID(conn, rows[0].id);
    }
    return rows[0] || null;
}

async function getOneByEmailAndPwd(conn, email, password) {
    let data = utils.objectAssign(["email", "password"], { email, password });
    customerTable.validate(data);
    let customer = await getOneByEmail(conn, data.email);
    if (customer && await pwd.compare(password, customer.password)) {
        customer.subscription = await subscriptionModel.getOneByCustomerID(conn, customer.id);
        return customer;
    }
    return null;
}

async function getOneByEmailAndAnswer(conn, email, answer) {
    let data = utils.objectAssign(["email", "answer"], { email, answer });
    customerTable.validate(data);
    let customer = await getOneByEmail(conn, data.email);
    if (customer && await pwd.compare(answer, customer.reset_password_answer)) {
        customer.subscription = await subscriptionModel.getOneByCustomerID(conn, customer.id);
        return customer;
    }
    return null;
}

async function createOne(conn, customer) {
    let data = utils.objectAssign(["first_name", "middle_name", "last_name", "email", "password", "reset_password_question", "reset_password_answer"], customer);
    customerTable.validate(data);
    let existedCustomer = await getOneByEmail(conn, data.email);
    if (existedCustomer) {
        throw new HttpError({statusCode: 400, message: `This email is registered.`});
    }
    data.password = await pwd.hash(data.password);
    data.reset_password_answer = await pwd.hash(data.reset_password_answer)
    const [rows] = await conn.query(
        'INSERT INTO `customer`(`first_name`, `middle_name`, `last_name`, `email`, `password`, `reset_password_question`, `reset_password_answer`) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [data.first_name, data.middle_name, data.last_name, data.email, data.password, data.reset_password_question, data.reset_password_answer]
    );
    return rows.insertId;
}

async function updateOne(conn, newCustomer) {
    let oldCustomer = await getOne(conn, newCustomer.id);
    if (!oldCustomer) {
        throw new HttpError({statusCode: 400, message: `customer ${newCustomer.id} not found.`});
    }
    let data = utils.objectAssign([
        "id", 
        "first_name",
        "middle_name",
        "last_name",
        "shipping_address_1",
        "shipping_address_2",
        "shipping_address_city",
        "shipping_address_state",
        "shipping_address_zip",
        "billing_address_1",
        "billing_address_2",
        "billing_address_city",
        "billing_address_state",
        "billing_address_zip",
        "card_name",
        "card_number",
        "card_expire_month",
        "card_expire_year",
        "card_code"
    ], oldCustomer, newCustomer);
    customerTable.validate(data);
    const [rows] = await conn.query(
        'UPDATE `customer` SET '
        + '`first_name` = ?, '
        + '`middle_name` = ?, '
        + '`last_name` = ?, '
        + '`shipping_address_1` = ?, '
        + '`shipping_address_2` = ?, '
        + '`shipping_address_city` = ?, '
        + '`shipping_address_state` = ?, '
        + '`shipping_address_zip` = ?, '
        + '`billing_address_1` = ?, '
        + '`billing_address_2` = ?, '
        + '`billing_address_city` = ?, '
        + '`billing_address_state` = ?, '
        + '`billing_address_zip` = ?, '
        + '`card_name` = ?, '
        + '`card_number` = ?, '
        + '`card_expire_month` = ?, '
        + '`card_expire_year` = ?, '
        + '`card_code` = ? '
        + 'WHERE `id` = ? AND `is_deleted` = ?',
        [
            data.first_name,
            data.middle_name,
            data.last_name,
            data.shipping_address_1,
            data.shipping_address_2,
            data.shipping_address_city,
            data.shipping_address_state,
            data.shipping_address_zip,
            data.billing_address_1,
            data.billing_address_2,
            data.billing_address_city,
            data.billing_address_state,
            data.billing_address_zip,
            data.card_name,
            data.card_number,
            data.card_expire_month,
            data.card_expire_year,
            data.card_code,
            data.id,
            false
        ]
    );
    return newCustomer.id;
}

async function updatePassword(conn, id, password) {
    let data = utils.objectAssign(["id", "password"], { id, password });
    customerTable.validate(data);
    data.password = await pwd.hash(data.password);
    const [rows] = await conn.query(
        'UPDATE `customer` SET password = ? WHERE `id` = ? AND `is_deleted` = ?',
        [data.password, data.id, false]
    );
    return rows;
}

async function updateQuestionAndAnswer(conn, id, reset_password_question, reset_password_answer) {
    let data = utils.objectAssign([
        "id", 
        "reset_password_question", 
        "reset_password_answer"
    ], { 
        id, 
        reset_password_question, 
        reset_password_answer 
    });
    customerTable.validate(data);
    data.reset_password_answer = await pwd.hash(data.reset_password_answer);
    const [rows] = await conn.query(
        'UPDATE `customer` SET reset_password_question = ?, reset_password_answer = ? WHERE `id` = ? AND `is_deleted` = ?',
        [
            data.reset_password_question, 
            data.reset_password_answer, 
            data.id, 
            false
        ]
    );
    return rows;
}

export default {
    customerTable,
    createOne,
    updateOne,
    getOne,
    getOneByEmail,
    getOneByEmailAndPwd,
    getOneByEmailAndAnswer,
    updatePassword,
    updateQuestionAndAnswer
}