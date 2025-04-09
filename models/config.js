import utils from "../helpers/utils.js";
import Validator from "../helpers/validator.js";
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

const valuesValidator = new Validator({
    SUBSCRIPTION_DISCOUNT_PERCENTAGE: {
        type: DataType.NUMBER({ check: (val) => (val >= 0 && val <= 1) }),
        isRequired: DataType.NOTNULL()
    },
    SHIPPING_FEE: {
        type: DataType.NUMBER({ check: (val) => (val >= 0) }),
        isRequired: DataType.NOTNULL()
    },
    SALE_TAX: {
        type: DataType.NUMBER({ check: (val) => (val >= 0 && val <= 1) }),
        isRequired: DataType.NOTNULL()
    },
    SUBSCRIPTION_PRICE: {
        type: DataType.NUMBER({ check: (val) => (val >= 0) }),
        isRequired: DataType.NOTNULL()
    },
})

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

async function updateAll(conn, newConfig) {
    let oldConfig = await getAll(conn);
    let data = utils.objectAssign(KEYS, oldConfig, newConfig);
    valuesValidator.validate(data);
    for (let key of KEYS) {
        await conn.query(
            'UPDATE `config` SET `value` = ? WHERE `key` = ?',
            [data[key], key]
        );
    }
    return null;
}

export default {
    SUBSCRIPTION_DISCOUNT_PERCENTAGE,
    SHIPPING_FEE,
    SALE_TAX,
    SUBSCRIPTION_PRICE,
    table: configTable,
    getAll,
    updateAll
}