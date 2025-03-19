import dataType from "./dataType.js";
import utils from "../helpers/utils.js"

const TABLE_NAME = "category";
const ATTRIBUTES = {
    "id": {
        type: dataType.INT,
        isRequired: dataType.NOTNULL
    },
    "name": {
        type: dataType.LONGTEXT,
        isRequired: dataType.NOTNULL
    },
    "description": {
        type: dataType.LONGTEXT,
        isRequired: dataType.NULLABLE
    },
    "created_at": {
        type: dataType.TIMESTAMP,
        isRequired: dataType.NULLABLE
    },
    "updated_at": {
        type: dataType.TIMESTAMP,
        isRequired: dataType.NULLABLE
    },
    "deleted_at": {
        type: dataType.TIMESTAMP,
        isRequired: dataType.NULLABLE
    },
    "is_deleted": {
        type: dataType.TINYINT,
        isRequired: dataType.NULLABLE
    }
};

function validate(category) {
    for (let attr in ATTRIBUTES) {
        if (attr in category) {
            for (let key in ATTRIBUTES[attr]) {
                ATTRIBUTES[attr][key].validate(category[attr], attr);
            }
        }
    }
}

async function getOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    validate(data);
    const [rows, fields] = await conn.execute(
        'SELECT * FROM `category` WHERE `id` = ?',
        [data.id]
    );
    return { rows, fields };
}

async function createOne(conn, category) {
    let data = utils.objectAssign(["name", "description"], category);
    validate(data);
    const [rows, fields] = await conn.execute(
        'INSERT INTO `category`(`name`, `description`) VALUES (?, ?)',
        [data.name, data.description]
    );
    return { rows, fields };
}

export default {
    TABLE_NAME,
    ATTRIBUTES,
    validate,
    createOne,
    getOne
}