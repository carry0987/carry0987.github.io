// ==UserScript==
// @name         HV Equipment Repairer
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.0.0
// @description  Repair equipments automatically
// @icon         https://carry0987.github.io/favicon.png
// @include      http*://hentaiverse.org/?s=Forge&ss=re*
// @include      http*://alt.hentaiverse.org/?s=Forge&ss=re*
// @run-at       document-end
// ==/UserScript==

(function() {
    //Check if is not in shop
    if (!getElem('#filterbar')) return
    var Material = [{
            'name': 'Scrap Cloth',
            'code': '60051',
            'cost': '100'
        },
        {
            'name': 'Scrap Leather',
            'code': '60052',
            'cost': '100'
        },
        {
            'name': 'Scrap Metal',
            'code': '60053',
            'cost': '100'
        },
        {
            'name': 'Scrap Wood',
            'code': '60054',
            'cost': '100'
        },
        {
            'name': 'Energy Cell',
            'code': '60071',
            'cost': '200'
        }
    ]
    var materialsList = document.querySelectorAll('#repairall+div span')
    var xhr = new window.XMLHttpRequest()
    xhr.open('GET', window.location.origin + '/?s=Bazaar&ss=is&filter=ma')
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'document'
    xhr.onload = function() {
        var token = xhr.response.querySelector('input[name="storetoken"]').value
        if (materialsList.length > 0) {
            for (var i = 0; i < materialsList.length; i++) {
                var amount = materialsList[i].innerHTML.match(/\d+/)[0]
                var code = Material[materialsName2Code(materialsList[i].innerHTML.match(/\d+x (.*)/)[1])].code
                buyMaterial(code, amount, Material[i].cost, token)
            }
            setTimeout(function() {
                document.querySelector('#repairall div').click()
            }, 3000)
        }
    }
    xhr.send(null)
})()

//Get material name
function materialsName2Code(name) {
    switch (name) {
        case 'Scrap Cloth':
            return '0'
        case 'Scrap Leather':
            return '1'
        case 'Scrap Metal':
            return '2'
        case 'Scrap Wood':
            return '3'
        case 'Energy Cell':
            return '4'
    }
}

//Purchase materials
function buyMaterial(code, amount, cost, token) {
    var xhr = 'xhr_Buy' + Math.random().toString()
    xhr = new window.XMLHttpRequest()
    xhr.open('POST', window.location.origin + '/?s=Bazaar&ss=is&filter=ma')
    //item_pane: Sell
    //shop_pane: Buy
    var parm = 'storetoken=' + token + '&select_mode=shop_pane&select_item=' + code + '&select_count=' + amount
    xhr.setRequestHeader('Accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.send(parm)
    xhr.onload = function() {}
}

//Get element
function getElem(ele, mode, parent) {
    if (typeof ele === 'object') {
        return ele
    } else if (mode === undefined && parent === undefined) {
        return (isNaN(ele * 1)) ? document.querySelector(ele) : document.getElementById(ele)
    } else if (mode === 'all') {
        return (parent === undefined) ? document.querySelectorAll(ele) : parent.querySelectorAll(ele)
    } else if (typeof mode === 'object' && parent === undefined) {
        return mode.querySelector(ele)
    }
}
