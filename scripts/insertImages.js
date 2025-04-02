// node --env-file-if-exists=[path-to-env-file] insertImages.js
import db from "../controllers/db.js";
import fs from "fs/promises";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __dirimages = path.join(__dirname, "images/"); 
const pool = db.pool;


let files = await fs.readdir(__dirimages);

for (let file of files) {
    try {
        let [id, ext] = file.split(".");
        const image = await fs.readFile(`${__dirimages}/${id}.${ext}`);
        await pool.query(
            "UPDATE `product` SET `image` = ?, `image_extension` = ? WHERE id = ?",
            [image, ext, id]
        );
        console.log("inserted", id);
    } catch(e) {
        console.log(e.message);
        break;
    }
}
console.log("DONE");