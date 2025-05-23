import utils from "../helpers/utils.js";
import Table from "../helpers/table.js";
import DataType from "../helpers/dataType.js";
import Validator from "../helpers/validator.js";
import productCategoryModel from "./productCategory.js";
import { HttpError } from "../helpers/error.js";

const productTable = new Table("product", {
    "id": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "sku": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "price": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "quantity": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "threshold": {
        type: DataType.NUMBER(),
        isRequired: DataType.NOTNULL()
    },
    "name": {
        type: DataType.STRING(),
        isRequired: DataType.NOTNULL()
    },
    "description": {
        type: DataType.STRING(),
        isRequired: DataType.NULLABLE()
    },
    "image": {
        type: DataType.BLOB(),
        isRequired: DataType.NULLABLE()
    },
    "image_extension": {
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
        type: DataType.NUMBER({ check: (val) => [0, 1].indexOf(val) > -1 }),
        isRequired: DataType.NULLABLE()
    }
}, {
    sort: ["name", "price", "created_at", "updated_at"],
    filter: {
        "name": DataType.STRING(),
        "price": DataType.NUMBER(),
        "quantity": DataType.NUMBER()
    }
});

const COLS_LITE_STR = [
    "`product`.`id`",
    "`product`.`sku`",
    "`product`.`price`",
    "`product`.`quantity`",
    "`product`.`threshold`",
    "`product`.`name`",
    "`product`.`description`",
    "`product`.`created_at`",
    "`product`.`updated_at`",
    "`product`.`deleted_at`",
    "`product`.`is_deleted`",
].join(",");

async function include(conn, rows) {
    const _include = async (obj) => {
        if (obj) {
            if (obj.id) {
                obj.category = await productCategoryModel.getCategoryByProductId(conn, obj.id);
            } else {
                obj.category = null;
            }
        }
    }
    if (!Array.isArray(rows)) {
        await _include(rows);
    } else {
        for (let row of rows) {
            await _include(row);
        }
    }
}

async function getAll(conn, query, opt = {}) {
    opt = utils.objectAssign(["include", "inclImg"], { include: false, inclImg: true }, opt);
    let categoryIdsQuery = query.category_id;
    let validator = new Validator({
        categoryIdsQuery: {
            type: DataType.ARRAY(DataType.NUMBER()),
            isRequired: DataType.NULLABLE()
        }
    });
    validator.validate({ categoryIdsQuery });
    let joinQuery = "WHERE";
    let joinParam = [];
    if (categoryIdsQuery && categoryIdsQuery.length !== 0) {
        joinQuery = 'INNER JOIN `product_category` ON `product`.`id` = `product_category`.`product_id`'
            + ' WHERE `product_category`.`category_id` IN (?) AND `product_category`.`is_deleted`= ?' 
            + ' AND';
        joinParam = [categoryIdsQuery, false];
    }
    let { 
        parsedQuery, 
        whereQueryStr, 
        sortQueryStr, 
        pagingQueryStr, 
        whereParams, 
        pagingParams 
    } = productTable.getQueryStr(query);
    const [countRows] = await conn.query(
        'SELECT COUNT(DISTINCT `product`.`id`) FROM `product` ' 
        + joinQuery + ' ' + whereQueryStr,
        joinParam.concat(whereParams)
    );
    const total =  (countRows[0] && countRows[0]["COUNT(DISTINCT `product`.`id`)"]) || 0;
    const [rows] = await conn.query(
        'SELECT ' + (opt.inclImg ? '`product`.*' : COLS_LITE_STR) + ' FROM `product` ' 
        + joinQuery + ' ' + whereQueryStr 
        + (!sortQueryStr ? ' ' : ' ORDER BY ' + sortQueryStr)
        + (!pagingQueryStr ? ' ' : ' ' + pagingQueryStr),
        joinParam.concat(whereParams, pagingParams)
    );
    if (opt.include) {
        await include(conn, rows);
    }
    for (let row of rows) {
        if (row.image) {
            row.image = Buffer.from(row.image).toString('base64');
        }
    }
    return {
        total,
        limit: pagingQueryStr ? parsedQuery.limit : total,
        offset: pagingQueryStr ? parsedQuery.offset : 0,
        rows
    };
}

async function getManyByIds(conn, ids, opt = {}) {
    opt = utils.objectAssign(["include", "inclImg"], { include: false, inclImg: true }, opt);
    const [rows] = await conn.query(
        'SELECT ' + (opt.inclImg ? '*' : COLS_LITE_STR) + ' FROM `product` WHERE `id` IN (?) AND `is_deleted` = ?',
        [ids, false]
    );
    if (opt.include) {
        await include(conn, rows);
    }
    for (let row of rows) {
        if (row.image) {
            row.image = Buffer.from(row.image).toString('base64');
        }
    }
    return rows;
}

async function getOne(conn, id, opt = {}) {
    opt = utils.objectAssign(["include", "inclImg"], { include: false, inclImg: true }, opt);
    let data = utils.objectAssign(["id"], { id });
    productTable.validate(data);
    const [rows] = await conn.query(
        'SELECT ' + (opt.inclImg ? '*' : COLS_LITE_STR) + ' FROM `product` WHERE `id` = ? AND `is_deleted` = ?',
        [data.id, false]
    );
    if (opt.include) {
        await include(conn, rows[0]);
    }
    if (rows[0]) {
        if (rows[0].image) {
            rows[0].image = Buffer.from(rows[0].image).toString('base64');
        }
    }
    return rows[0] || null;
}

async function updateManyQuantityByIds(conn, products) {
    let queryStrs = [];
    let params = [];
    let result = [];
    for (let product of products) {
        let data = utils.objectAssign(["id", "quantity"], product);
        productTable.validate(data);
        queryStrs.push('UPDATE `product` SET `quantity` = IF(`quantity` + ? > 0, `quantity` + ?, 0) WHERE `id` = ? AND `is_deleted` = ?');
        params.push([data.quantity, data.quantity, data.id, false]);
        result.push(data.id);
    }
    for (let i = 0; i <  queryStrs.length; i++) {
        const [rows] = await conn.query(
            queryStrs[i],
            params[i]
        );
    }
    return result;
}

async function createOne(conn, product) {
    let validator = new Validator({
        category_id: {
            type: DataType.ARRAY(DataType.NUMBER()),
            isRequired: DataType.NULLABLE()
        }
    });
    let data = utils.objectAssign(
        [
            "sku",
            "price",
            "quantity",
            "threshold",
            "name",
            "description",
            "category_id"
        ], 
        product
    );
    productTable.validate(data);
    validator.validate(data)
    const [rows] = await conn.query(
        'INSERT INTO `product`('
        + '`sku`,'
        + '`price`,'
        + '`quantity`,'
        + '`threshold`,'
        + '`name`,'
        + '`description`'
        + ') VALUES (?, ?, ?, ?, ?, ?)',
        [
            data.sku,
            data.price,
            data.quantity,
            data.threshold,
            data.name,
            data.description
        ]
    );
    let productId = rows.insertId;
    if (data.category_id && data.category_id.length !== 0) {
        await productCategoryModel.createCategoryByProductId(conn, productId, data.category_id);
    }
    return productId;
}

async function updateOne(conn, newProduct) {
    let oldProduct = await getOne(conn, newProduct.id);
    if (!oldProduct) {
        throw new HttpError({statusCode: 400, message: `product not found.`});
    }
    let validator = new Validator({
        category_id: {
            type: DataType.ARRAY(DataType.NUMBER()),
            isRequired: DataType.NULLABLE()
        }
    });
    let data = utils.objectAssign(
        [
            "id",
            "sku",
            "price",
            "threshold",
            "name",
            "description",
            "category_id"
        ], 
        oldProduct,
        newProduct
    );
    productTable.validate(data);
    validator.validate(data)
    const [rows] = await conn.query(
        'UPDATE `product`SET'
        + '`sku` = ?,'
        + '`price` = ?,'
        + '`threshold` = ?,'
        + '`name` = ?,'
        + '`description` = ?'
        + ' WHERE `id` = ? AND `is_deleted` = ?',
        [
            data.sku,
            data.price,
            data.threshold,
            data.name,
            data.description,
            data.id,
            false
        ]
    );
    await productCategoryModel.deleteCategoryByProductId(conn, newProduct.id);
    if (data.category_id && data.category_id.length !== 0) {
        await productCategoryModel.createCategoryByProductId(conn, newProduct.id, data.category_id);
    }
    return data.id;
}

async function updateOneImage(conn, newProduct) {
    let oldProduct = await getOne(conn, newProduct.id);
    if (!oldProduct) {
        throw new HttpError({statusCode: 400, message: `product not found.`});
    }
    let data = utils.objectAssign(["id", "image"], newProduct);
    productTable.validate(data);
    if (data.image && data.image.size) {
        data.image_extension = data.image.mimetype.split("/")[1];
        data.image = data.image.buffer;
    } else {
        data.image = null;
        data.image_extension = null;
    }
    const [rows] = await conn.query(
        'UPDATE `product`SET'
        + '`image` = ?,'
        + '`image_extension` = ?'
        + ' WHERE `id` = ? AND `is_deleted` = ?',
        [
            data.image,
            data.image_extension,
            data.id,
            false
        ]
    );
    return data.id;
}

async function restockOne(conn, newProduct) {
    let oldProduct = await getOne(conn, newProduct.id);
    if (!oldProduct) {
        throw new HttpError({ statusCode: 400, message: `product not found.` });
    }
    let data = utils.objectAssign(["id", "quantity"], newProduct);
    productTable.validate(data);
    await updateManyQuantityByIds(conn, [{
        id: data.id,
        quantity: data.quantity
    }]);
    return data.id;
}

async function deleteOne(conn, id) {
    let data = utils.objectAssign(["id"], { id });
    productTable.validate(data);
    let now = new Date();
    const [rows] = await conn.query(
        'UPDATE `product` SET sku = CONCAT(sku, ?, ?), is_deleted = ?, deleted_at = ? WHERE `id` = ? AND `is_deleted` = ?',
        ["#deleted", "#" + now.getTime(), true, now, data.id, false]
    );
    await productCategoryModel.deleteCategoryByProductId(conn, data.id);
    return rows;
}

export default {
    table: productTable,
    getAll,
    getOne,
    getManyByIds,
    updateManyQuantityByIds,
    createOne,
    updateOne,
    updateOneImage,
    restockOne,
    deleteOne
}