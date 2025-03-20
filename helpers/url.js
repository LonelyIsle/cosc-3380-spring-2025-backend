import { URL } from "url"

function getURLObj(url) {
    if (!URL.canParse(url)) {
        url = `http://fakehost${url}`;
    }
    return URL.parse(url);
}

function getPathnameObj(pathname) {
    if (!URL.canParse(pathname)) {
        pathname = `http://fakehost${pathname}`;
    }
    return URL.parse(pathname);
}

export default {
    getURLObj,
    getPathnameObj,
}