import utils from "../helpers/utils.js";
import { HttpError } from "../helpers/error.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import Validator from "../helpers/validator.js";
import categoryModel from "./category.js";

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

async function getCategoryByProductId(conn, product_id) {
    let data = utils.objectAssign(["product_id"], { product_id });
    productCategoryTable.validate(data);
    const [rows] = await conn.query(
        'SELECT `category`.* FROM `category` INNER JOIN `product_category` ON `product_category`.`category_id` = `category`.`id` WHERE `product_category`.`product_id` = ?',
        [data.product_id, false]
    );
    return rows;
}

async function deleteCategoryByProductId(conn, product_id) {
    let data = utils.objectAssign(["product_id"], { product_id });
    productCategoryTable.validate(data);
    const [rows] = await conn.query(
        'DELETE FROM `product_category` WHERE `product_id` = ?',
        [data.product_id]
    );
    return rows;
}

async function deleteProductByCategoryId(conn, category_id) {
    let data = utils.objectAssign(["category_id"], { category_id });
    productCategoryTable.validate(data);
    const [rows] = await conn.query(
        'DELETE FROM `product_category` WHERE `category_id` = ?',
        [data.category_id]
    );
    return rows;
}

async function createCategoryByProductId(conn, product_id, category_ids) {
    let validator = new Validator({
        category_ids: {
            type: DataType.ARRAY(DataType.NUMBER()),
            isRequired: DataType.NULLABLE()
        }
    });
    let data = utils.objectAssign(["product_id", "category_ids"], { product_id, category_ids });
    productCategoryTable.validate(data);
    validator.validate(data);
    let categories = await categoryModel.getManyByIds(conn, category_ids);
    if (categories.length != category_ids.length) {
        throw new HttpError({statusCode: 400, message: "Invalid category." });
    }
    let query = [];
    let params = [];
    for (let category_id of category_ids) {
        query.push(`(?, ?)`);
        params.push(category_id, product_id);
    }
    const [rows] = await conn.query(
        'INSERT INTO `product_category`(`category_id`, `product_id`) VALUES ' + query.join(","),
        params
    );
    return rows;
}

export default {
    table: productCategoryTable,
    getCategoryByProductId,
    deleteCategoryByProductId,
    deleteProductByCategoryId,
    createCategoryByProductId
}