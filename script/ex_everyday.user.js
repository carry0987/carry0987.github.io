// ==UserScript==
// @name         ExH EveryDay
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.4.0
// @description  Get daily bonus reward even in ExHentai & HV
// @icon         https://carry0987.github.io/favicon.png
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @match        https://hentaiverse.org/?s=Character&ss=ch
// @match        https://hentaiverse.org/
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// @noframes
// ==/UserScript==

const DAY_MS = 86400 * 1e3;
const DEBUG = false;
const six_hr = 2.16e+7;
const twelve_hr = 4.32e+7;

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
const lastDate = new Date(getValue(cookie.id, false));

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
        setValue(cookie.id, new Date().toJSON());
    }
}

//Report info in console
function reportInfo(vars, showType = false) {
    if (showType === true) console.log(typeof vars);
    console.log(vars);
}

//Get bonus
function getBonus() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://e-hentai.org/news.php',
        headers: {
            Cookie: cookie.toString(),
        },
        onload,
        onerror
    });
}

//Set value via localSorage
function setValue(item, value) {
    window.localStorage[item] = (typeof value === 'string') ? value : JSON.stringify(value);
}

//Get value via localSorage
function getValue(item, toJSON) {
    return (window.localStorage[item]) ? ((toJSON) ? JSON.parse(window.localStorage[item]) : window.localStorage[item]) : null;
}

//Check date
(function() {
    checkNew();
    function checkNew() {
        setInterval(function() {
            var dateDiff = Date.now() - lastDate;
            //reportInfo(six_hr, true);
            if (dateDiff > DAY_MS || dateDiff === 0) {
                getBonus();
            }
        }, six_hr)
    }
})()
