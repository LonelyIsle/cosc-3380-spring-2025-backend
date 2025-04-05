import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

function sign(data) {
    // exp: 1 month
    return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
        data
    }, JWT_SECRET);
}

function verify(token) {
    return jwt.verify(token, JWT_SECRET);
}

export default {
    sign,
    verify
}