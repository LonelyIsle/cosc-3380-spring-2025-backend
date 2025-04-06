import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";

const configTable = new Table("config", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "key": {
        type: DataType.STRING(),
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
        type: DataType.NUMBER({ check: (val) => (val === 0 || val === 1) }),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: [],
    filter: {}
});

const SUBSCRIPTION_DISCOUNT_PERCENTAGE = "SUBSCRIPTION_DISCOUNT_PERCENTAGE";
const SHIPPING_FEE = "SHIPPING_FEE";
const SALE_TAX = "SALE_TAX";
const SUBSCRIPTION_PRICE = "SUBSCRIPTION_PRICE";

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
    configTable,
    getAll
}