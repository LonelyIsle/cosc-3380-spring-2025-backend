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
        type: DataType.NUMBER(),
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
    return rows;
}

export default {
    configTable,
    getAll
}