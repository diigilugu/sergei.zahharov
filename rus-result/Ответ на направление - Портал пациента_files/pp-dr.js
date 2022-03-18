let PpToDr = (function ($) {

    function connect() {
        $.ajax({
            url: PP.CONTEXT_ROOT + '/drClient/requestURL',
            type: 'GET',
            data: {
                providerSite: getUrlVars()["returnUrl"] || window.location.origin + PP.CONTEXT_ROOT,
                destPage: getUrlVars()["destPage"] || null,
                providerCode: getUrlVars()["providerCode"] || null,
                providerCounty: getUrlVars()["providerCounty"] || null,
                appointmentNr: getUrlVars()["appointmentNr"] || null,
                appointmentOid: getUrlVars()["appointmentOid"] || null,
                referralNr: getUrlVars()["referralNr"] || null,
                referralOid: getUrlVars()["referralOid"] || null,
                locale: $.cookie("pp_locale_cookie") || "et"
            },
            dataType: 'text',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                PP.logoutWithoutRedirect();
                let json = parseJson(data);
                let errorElem = document.getElementById("drErrorMsg");
                if (json.error) {
                    $("#DRLoader").remove();
                    errorElem.innerHTML = json.error;
                    errorElem.style.visibility = "visible";
                } else if (json.url) {
                    window.location.replace(json.url);
                } else {
                    $("#DRLoader").remove();
                    errorElem.style.visibility = "visible";
                }
            },
            error: function () {
                PP.logoutWithoutRedirect();
                $("#DRLoader").remove();
                document.getElementById("drErrorMsg").style.visibility = "visible";
            },
            timeout: 60000
        });
        // let expiryTime = new Date();
        // expiryTime.setTime(expiryTime.getTime() - (24 * 60 * 60 * 1000));
        // let expires = "expires=" + expiryTime.toUTCString();
        // document.cookie = PP.COOKIES.PP_TO_DR + "=" + "" + ";" + expires;
        $.removeCookie(PP.COOKIES.PP_TO_DR, {path: "/"});
    }

    function connectFromBooking(drDiv, drButton) {
        let providerSite = getUrlVars()["returnUrl"] || window.location.origin + PP.CONTEXT_ROOT;
        let locale = $.cookie("pp_locale_cookie") || "et";
        $.ajax({
            url: PP.CONTEXT_ROOT + '/drClient/requestURL',
            type: 'GET',
            data: {
                providerSite: providerSite,
                destPage: null,
                providerCode: null,
                providerCounty: null,
                appointmentNr: null,
                appointmentOid: null,
                referralNr: null,
                referralOid: null,
                locale: locale,
            },
            dataType: 'text',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                alterClasses(drDiv, drButton);
                let json = parseJson(data);
                let errorElem = document.getElementById("drErrorMsg");
                if (json.error) {
                    errorElem.innerHTML = json.error;
                    errorElem.style.visibility = "visible";
                } else if (json.url) {
                    window.location.replace(json.url);
                } else {
                    errorElem.style.visibility = "visible";
                }
            },
            error: function () {
                alterClasses(drDiv, drButton);
                document.getElementById("drErrorMsg").style.visibility = "visible";
            },
            timeout: 60000
        });
    }

    function connectFromReferral(refNr, refOid, target) {
        $.ajax({
            url: PP.CONTEXT_ROOT + '/drClient/requestURL',
            type: 'GET',
            data: {
                providerSite: getUrlVars()["returnUrl"] || window.location.origin + PP.CONTEXT_ROOT,
                destPage: target,
                providerCode: null,
                providerCounty: null,
                appointmentNr: null,
                appointmentOid: null,
                referralNr: refNr,
                referralOid: refOid,
                locale: $.cookie("pp_locale_cookie") || "et"
            },
            dataType: 'text',
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                let errorElem = document.getElementById("drErrorMsg_" + refNr);
                let linkElem = document.getElementById("link-toDR_" + refNr);
                let json = parseJson(data);
                if (json.error) {
                    showDrErrorMsg(linkElem, errorElem);
                    linkElem.innerHTML = json.error;
                } else if (json.url) {
                    window.location.replace(json.url);
                } else {
                    showDrErrorMsg(linkElem, errorElem);
                }
            },
            error: function () {
                showDrErrorMsg(linkElem, errorElem);
            },
            timeout: 60000
        });
    }

    function alterClasses(drDiv, drButton) {
        drDiv.classList.remove("DRBoxSpinner");
        drButton.classList.remove("drButtonActive");
        drButton.classList.add("drButtonPassive");
    }


    function getQueryString() {
        if (window.location.href.indexOf('?') !== -1) {
            let queryString = '?';
            let hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (let i = 0; i < hashes.length; i++) {
                queryString += hashes[i];
                if (i < hashes.length - 1) {
                    queryString += '&';
                }
            }
            return queryString;
        } else {
            return '';
        }
    }

    function getUrlVars() {
        let vars = [], hash;
        let hashes
        let ppToDrHash = $.cookie(PP.COOKIES.PP_TO_DR);
        if (typeof ppToDrHash === 'undefined' || ppToDrHash === "") {
            hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        } else {
            hashes = ppToDrHash.slice(ppToDrHash.indexOf('?') + 1).split('&');
        }
        for (let i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    function redirectLoadingBody(title, errorMsg) {
        return '<div style="text-align: center; width: 800px; margin-top: 10%; margin-left: auto; margin-right: auto;">'
            + '	<h1>' + title + '</h1>'
            + '	<div id="DRLoader" style="width: 150px; height: 150px; margin-left: auto; margin-right: auto; margin-top: 20px;">'
            + '	<img src="' + PP.CONTEXT_ROOT + "/resources/images/ajax-loader-large.gif" + '" alt="" style="height: 100%; width: 100%" />'
            + '	</div>'
            + '<h4 id="drErrorMsg" style="color: red; margin-top: 20px"> ' + errorMsg + '</h4>'
            + '	</div>';
    }

    function parseJson(jsonStr) {
        try {
            return JSON.parse(jsonStr);
        } catch (e) {
            return {"error": null, "url": null}
        }
    }

    function showDrErrorMsg(linkElem, errorElem) {
        linkElem.style.display = "none";
        errorElem.style.display = "table-cell";
        linkElem.parentElement.style.backgroundColor = "transparent";
    }

    return {
        connect: connect,
        connectFromBooking: connectFromBooking,
        connectFromReferral: connectFromReferral,
        getQueryString: getQueryString,
        getUrlVars: getUrlVars,
        redirectLoadingBody: redirectLoadingBody,
    }

})(jQuery);