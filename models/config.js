import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

const SUBSCRIPTION_DISCOUNT_PERCENTAGE = "subscription_discount_percentage";
const SHIPPING_FEE = "shipping_fee";
const SALE_TAX = "sale_tax";
const SUBSCRIPTION_PRICE = "subscription_price";
const KEYS = [
    SUBSCRIPTION_DISCOUNT_PERCENTAGE,
    SHIPPING_FEE,
    SALE_TAX,
    SUBSCRIPTION_PRICE
];

const configTable = new Table("config", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "key": {
        type: DataType.STRING({ check: (val) => KEYS.indexOf(val) > -1 }),
        isRequired: DataType.NOTNULL()
    },
    "value": {
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

async function getAll(conn) {
    const [rows] = await conn.query(
        'SELECT * FROM `config` WHERE `is_deleted` = ?',
        [false]
    );
    let configObj = {};
    for (let row of rows) {
        let [val] = utils.parseStr(row.value)
        configObj[row.key] = val;
    }
    return configObj;
}

export default {
    SUBSCRIPTION_DISCOUNT_PERCENTAGE,
    SHIPPING_FEE,
    SALE_TAX,
    SUBSCRIPTION_PRICE,
    table: configTable,
    getAll
}