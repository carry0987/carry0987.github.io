// ==UserScript==
// @name         EH Hath Seller
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.2.0
// @description  Auto summary credit of hath
// @icon         https://carry0987.github.io/favicon.png
// @match        https://e-hentai.org/exchange.php?t=hath
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    //Initialize vars
    let client = '',
        id = '',
        status = '',
        created = '',
        lastSeen = '',
        filesServed = '',
        clientIP = '',
        port = '',
        version = '',
        maxSpeed = 0,
        trust = '',
        quality = '',
        hitrate = 0,
        hathrate = 0,
        country = '';

    //Get value
    var current_price = document.querySelector('.stuffbox>div>div:nth-child(2)>div>strong:nth-child(2)');
    var get_price = current_price.nextSibling.wholeText;
    get_price = get_price.split(' ')[1].replace(/\,/g, '');
    get_price = parseInt(get_price);
    var ask_count = document.getElementById('ask_count');
    var ask_price = document.getElementById('ask_price');

    let init = function() {
        ask_count.onchange = function(e) {
            var get_count = parseInt(ask_count.value);
            if (get_count >= 1) {
                ask_price.value = get_price;
            }
        }
    }
    init()
})();
