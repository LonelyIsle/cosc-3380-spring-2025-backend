import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import customerModel from "./customer.js";
import configModel from "./config.js";

const subscriptionTable = new Table("subscription", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "customer_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "price": {
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
    "billing_address_1":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_2":{ 
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "billing_address_city":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_state":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "billing_address_zip":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_name":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_number":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_expire_month":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_expire_year":{ 
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "card_code":{ 
        type: DataType.STRING(),
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

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    subscriptionTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `subscription` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    return rows[0] || null;
}


async function getOneActiveByCustomerID(conn, customer_id) {
    let data = utils.objectAssign(["customer_id"], { customer_id });
    subscriptionTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `subscription` WHERE `customer_id` = ? AND (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [data.customer_id, false]
    );
    return rows[0] || null;
}

async function createOne(conn, subscription) {
    let data = utils.objectAssign(
        [
            "customer_id",
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
        ], 
        subscription
    );
    subscriptionTable.validate(data);
    let customer = await customerModel.getOne(conn, data.customer_id);
    if (!customer) {
        throw new HttpError({statusCode: 401 });
    }
    let existedSubscription = await getOneActiveByCustomerID(conn, data.customer_id);
    if (existedSubscription) {
        throw new HttpError({statusCode: 400, message: `You are already subscribed.`});
    }
    let now = new Date();
    let config = await configModel.getAll(conn);
    data.price = config[configModel.SUBSCRIPTION_PRICE];
    data.start_at = now;
    data.end_at = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 1 month
    // payment successfully processed
    const [rows] = await conn.query(
        'INSERT INTO `subscription`('
        + '`customer_id`, '
        + '`price`, '
        + '`start_at`, '
        + '`end_at`, '
        + '`billing_address_1`, '
        + '`billing_address_2`, '
        + '`billing_address_city`, '
        + '`billing_address_state`, '
        + '`billing_address_zip`, '
        + '`card_name`, '
        + '`card_number`, '
        + '`card_expire_month`, '
        + '`card_expire_year`, '
        + '`card_code`'
        + ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            data.customer_id, 
            data.price, 
            data.start_at, 
            data.end_at, 
            data.billing_address_1, 
            data.billing_address_2, 
            data.billing_address_city, 
            data.billing_address_state, 
            data.billing_address_zip, 
            data.card_name, 
            data.card_number, 
            data.card_expire_month, 
            data.card_expire_year, 
            data.card_code
        ]
    );
    return rows.insertId;
}

export default {
    table: subscriptionTable,
    getOne,
    getOneActiveByCustomerID,
    createOne
}