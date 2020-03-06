// ==UserScript==
// @name         HV How Rich Am I ?
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.1.0
// @description  Show how many Credits you have
// @icon         https://carry0987.github.io/favicon.png
// @include      https://hentaiverse.org/*
// ==/UserScript==

var wnd = window
var doc = wnd.document
var loc = location
var href = loc.href

var $ = function(e, css) { if (!css) { css = e;
        e = doc }; return e.querySelector(css) }
var $$ = function(e, css) { if (!css) { css = e;
        e = doc }; return e.querySelectorAll(css) }

//Get Credit
var getCredit = function() {
    var frm = doc.createElement('IFRAME')
    frm.src = '/?s=Bazaar&ss=es'
    frm.width = frm.height = frm.frameBorder = 0
    frm.addEventListener('load', function() {
        var doc = this.contentDocument
        var cell = doc.getElementById('networth')
        var credit = cell.innerHTML.match(/Credits:\s*([,0-9]*)\s*/i)[1]
        credit = parseInt(credit.replace(/,/g, ''))
        //credit = credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        var show_credit_1 = document.createElement('div')
        show_credit_1.setAttribute('id', 'networth')
        show_credit_1.setAttribute('width', '148px')
        var show_credit_2 = document.createElement('div')
        show_credit_2.className = 'fc4 fal fcb'
        show_credit_2.setAttribute('width', '138px')
        var credit_box = document.getElementById('mainpane')
        if (credit_box !== null) {
            credit_box.appendChild(show_credit_1)
        }
        if (credit != '0') { show_credit_1.innerHTML = 'Credits: ' + credit }
        this.parentElement.removeChild(this)
    }, false)
    doc.body.appendChild(frm)
}
getCredit()
