import bcrypt from "bcrypt";
const saltRounds = 10;

async function hash(pwd) {
    return  await bcrypt.hash(pwd, saltRounds);
}

async function compare(pwd, hash) {
    return await bcrypt.compare(pwd, hash)
}

export default {
    hash,
    compare
}