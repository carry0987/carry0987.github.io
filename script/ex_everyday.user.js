// ==UserScript==
// @name         ExH EveryDay
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.2.5
// @description  Get daily bonus reward even in ExHentai & HV
// @icon         https://carry0987.github.io/favicon.png
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @match        https://hentaiverse.org/?s=Character&ss=ch
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @noframes
// ==/UserScript==

const DAY_MS = 86400 * 1e3;
const DEBUG = false;

class Cookie {
    constructor(cookie = document.cookie) {
        this.map = document.cookie.split('; ')
            .reduce((c, s) => {
                const i = s.indexOf('=');
                c.set(s.slice(0, i), s.slice(i + 1));
                return c;
            }, new Map());
    }

    get id() {
        return this.map.get('ipb_member_id');
    }

    toString() {
        return [...this.map.entries()]
            .map(([k, v]) => `${k}=${v}`)
            .join('; ');
    }
}

const cookie = new Cookie;
const lastDate = new Date(GM_getValue(cookie.id, new Date().toJSON()));
const dateDiff = Date.now() - lastDate;

const onerror = (resp) => {
    if (DEBUG === true) {
        console.error('ExEveryDay Error', resp);
    }
}

const onload = (resp) => {
    if (DEBUG === true) {
        console.info('ExEveryDay Info', resp);
    }
    if (resp.responseText.match(/It is the dawn of a new day/g)) {
        GM_setValue(cookie.id, new Date().toJSON());
    }
}

//Report info in console
function reportInfo(vars) {
    console.log(typeof vars);
    console.log(vars);
}

//Check date
if (dateDiff > DAY_MS || dateDiff === 0) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://e-hentai.org/news.php',
        headers: {
            Cookie: cookie.toString(),
        },
        onload,
        onerror,
    });
}
//reportInfo(dateDiff);
//reportInfo(DAY_MS);
