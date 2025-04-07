import utils from "../helpers/utils.js"
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import Validator from "../helpers/validator.js";

const productCategoryTable = new Table("product_category", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "category_id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "product_id": {
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
        type: DataType.NUMBER({ check: (val) => [0, 1].indexOf(val) > -1 }),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: [],
    filter: {}
});

async function getCategoryByProductId(conn, productId) {
    let data = utils.objectAssign(["productId"], { productId });
    let validator = new Validator({
        productId: {
            type: DataType.NUMBER(),
            isRequired: DataType.NOTNULL()
        }
    });
    validator.validate(data);
    const [rows] = await conn.query(
        'SELECT `category`.* FROM `category` INNER JOIN `product_category` ON `product_category`.`category_id` = `category`.`id` WHERE `product_category`.`product_id` = ? AND `category`.`is_deleted` = ?',
        [data.productId, false]
    );
    return rows;
}

export default {
    table: productCategoryTable,
    getCategoryByProductId
}