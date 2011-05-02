// ==UserScript==
// @name           peflplayerhist
// @namespace      pefl
// @description    history page modification (PEFL)
// @include        http://pefl.ru/hist.php?id=*&t=p
// @include        http://www.pefl.ru/hist.php?id=*&t=p
// @include        http://pefl.net/hist.php?id=*&t=p
// @include        http://www.pefl.net/hist.php?id=*&t=p
// @include        http://pefl.org/hist.php?id=*&t=p
// @include        http://www.pefl.org/hist.php?id=*&t=p
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = 'http://pefladdons.googlecode.com/svn/trunk/hist/ie/hist.js';
headID.appendChild(newScript);