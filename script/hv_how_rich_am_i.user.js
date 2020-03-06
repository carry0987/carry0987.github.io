// ==UserScript==
// @name         HV How Rich Am I ?
// @author       carry0987
// @namespace    https://github.com/carry0987
// @version      1.0.0
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
        var cell = document.getElementById('#networth')
        var credit
        credit = doc.body.innerHTML.match(/Available:\s*([,0-9]*)\s*kGP/i)[1]
        credit = parseInt(credit.replace(/,/g, '')) * 1000
        credit = credit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        console.log('Credits: ' + cell)
        //console.log('Credits: ' + cell)
        //if (credit != '0') { cell.textContent = 'Credits: ' + credit }
        this.parentElement.removeChild(this)
    }, false)
    doc.body.appendChild(frm)
}
getCredit()
