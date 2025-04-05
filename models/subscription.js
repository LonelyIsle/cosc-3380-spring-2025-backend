import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

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
        type: DataType.NUMBER(),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: [],
    filter: {}
});

async function getOneByCustomerID(conn, customer_id) {
    let data = utils.objectAssign(["customer_id"], { customer_id });
    subscriptionTable.validate(data);
    const [rows] = await conn.query(
        'SELECT * FROM `subscription` WHERE `customer_id` = ? AND (NOW() BETWEEN `start_at` AND `end_at`) AND `is_deleted` = ?',
        [data.customer_id, false]
    );
    return rows[0] || null;
}

export default {
    subscriptionTable,
    getOneByCustomerID,
}