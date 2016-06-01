// ==UserScript==
// @name        ToSbase+
// @namespace   /r/treeofsavior
// @author      /u/N3G4
// @description Tweaks and additions to tosbase.com
// @include     *www.tosbase.com/*
// @version     1
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// ==/UserScript==

var g_style = GM_getValue("style", true);
var g_scroll = GM_getValue("scroll", true);
var g_toscamp = GM_getValue("toscamp", true);

GM_registerMenuCommand("Toggle style tweaks",
        function() { g_style = !g_style; GM_setValue("style", g_style); }, "s");
GM_registerMenuCommand("Toggle scroll button",
        function() { g_scroll = !g_scroll; GM_setValue("scroll", g_scroll); }, "c");
GM_registerMenuCommand("Toggle toscamp images",
        function() { g_toscamp = !g_toscamp; GM_setValue("toscamp", g_toscamp); }, "t");

function styleTweaks() {
    document.getElementById("header").style.display = "none";

    var topbar = document.getElementById("top_bar");
    topbar.style["margin-bottom"] = "0";
    topbar.style.width = "100%";
    topbar.style["min-width"] = "1200px";
}

function scrollButton() {
    var buttonel = document.createElement("p");
    buttonel.id = "tbp-btn";
    buttonel.innerHTML = "^";
    buttonel.style.cssText =
        "position: fixed; right: 10px; bottom: 10px; padding: 1px 6px;" +
        "margin: 0; background-color: rgba(32, 32, 32, 0.6); color: #FFF;" +
        "box-shadow: 0 3px 12px rgba(240, 240, 240, 0.15); cursor: pointer;";

    var button = document.getElementsByTagName("body")[0].appendChild(buttonel);
    button.addEventListener("click", function(){
        window.scrollTo(window.pageXOffset, 0);
    });
}

function toscamp() {
    var extractInfo = function(response) {
        var resdom = document.createElement("html");
        resdom.innerHTML = response.responseText;

        var mapnodes = resdom.getElementsByClassName("map_text")[0].childNodes;
        var indexfound = -1;
        for(var i=5; i<mapnodes.length-5; i++) {
            if(mapnodes[i].innerHTML.search(mapname + "$") !== -1) {
                indexfound = i;
                break;
            }
        }
        if(indexfound === -1) {
            console.error("Could not find map on toscamp.");
        } else {
            insertMapImage(mapnodes[i].href);
        }
    };

    var insertMapImage = function(url) {
        var newelement = document.createElement("a");
        newelement.href = url;
        newelement.innerHTML =
            "<img src='" + url + "' style='max-height: 400px; margin-left: 10px'>";

        var insertpoint = document.getElementById("content"); 
        var inserted = insertpoint.insertBefore(newelement, insertpoint.childNodes[5]);
    };

    if( window.location.pathname.search("^/game/world-map/") !== -1 ) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://toscamp.com/map_en/",
            onload: function(response){ extractInfo(response); },
            onerror: function(){ console.error("Error on HTTP GET request"); }
        });

        var mapname = document.getElementById("content")
            .getElementsByTagName("h1")[0].innerHTML;
    }
}

if(g_style) styleTweaks();
if(g_scroll) scrollButton();
if(g_toscamp) toscamp();
