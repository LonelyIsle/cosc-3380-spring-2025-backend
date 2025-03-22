// node hashPwd.js plain_pwd
import bcrypt from "bcrypt";
let plainPwd = process.argv[2];
const saltRounds = 10;
async function hash(pwd) {
    return  await bcrypt.hash(pwd, saltRounds);
}
console.log(await hash(plainPwd));