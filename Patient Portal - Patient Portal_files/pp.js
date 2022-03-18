let PP = (function ($) {

    function login() {
        $(location).attr('href', PP.TARA_AUTH);
    }

    function logout() {
        tryClearingSSLCache();
        $(location).attr('href', PP.AFTER_LOGOUT_URL);
    }

    function forcedLogout() {
        tryClearingSSLCache();
        $(location).attr('href', PP.AFTER_FORCED_LOGOUT_URL);
    }

    function forcedLogoutWithLogin() {
        tryClearingSSLCache();
        $(location).attr('href', PP.RELOGIN_URL);
    }

    function logoutWithoutRedirect(skipServerSessionDestroy) {
        if (skipServerSessionDestroy === true) {
            tryClearingSSLCache();
            window.onbeforeunload = null;
        } else {
            $.get(PP.LOGOUT_URL, function () {
                tryClearingSSLCache();
                window.onbeforeunload = null;
            });
        }
    }

    function forwardToAfterLogoutURL() {
        window.onbeforeunload = null;
        window.location.href = PP.AFTER_LOGOUT_URL;
    }

    function tryClearingSSLCache() {
        if (window.crypto && window.crypto.logout) {
            window.crypto.logout();
        } else {
            // Following supported by IE only, should not do anything anywhere else
            document.execCommand("ClearAuthenticationCache");
        }
    }

    function applyAccessibility(accebilityType) {
        let elements = document.getElementsByTagName("*");
        for (let i = 0, all = elements.length; i < all; i++) {
            let classes = $(elements[i]).attr('class');
            if (accebilityType === PP.CONFIG.ACCESSIBILITY.CONTRAST.HIGH) {
                // changeCSSClass(elements[i]);
                if (classes && classes.indexOf('accessibility-option') !== -1) {
                    elements[i].classList.add('accessibility-high-contrast-button');
                    $('#accessibility-ordinary').removeClass('is-active');
                    $('#accessibility-contrast').addClass('is-active');
                }
            } else if (accebilityType === PP.CONFIG.ACCESSIBILITY.CONTRAST.NORMAL) {
                if (classes && classes.indexOf('accessibility-option') !== -1) {
                    classes.replace('accessibility-high-contrast-button', '');
                    $('#accessibility-ordinary').addClass('is-active');
                    $('#accessibility-contrast').removeClass('is-active');
                }
            } else if (accebilityType === PP.CONFIG.ACCESSIBILITY.LINE_HEIGHT.ONE_FIVE) {
                if (classes && classes.indexOf('accessibility-option') !== -1) {
                    $('#accessibility-line-height').addClass('is-active');
                    $('#accessibility-ordinary-line-height').removeClass('is-active');
                }
            } else {
                if (classes && classes.indexOf('accessibility-option') !== -1) {
                    classes.replace(PP.CONFIG.ACCESSIBILITY.LINE_HEIGHT.ONE_FIVE, '');
                    $('#accessibility-line-height').removeClass('is-active');
                    $('#accessibility-ordinary-line-height').addClass('is-active');
                }
            }
        }
    }

    function setAccessibility(option) {
        let accessibility = PP.CONFIG.ACCESSIBILITY;
        let cookieConfig = PP.COOKIES.ACCESSIBILITY;

        let d = new Date();
        let year = d.getFullYear();
        let month = d.getMonth();
        let day = d.getDate();
        let expiryTime = new Date(year + 1, month, day);

        switch (option) {
            case accessibility.CONTRAST.HIGH:
                $.cookie(cookieConfig.CONTRAST, option, {expires: expiryTime, path: "/"});
                break;
            case accessibility.LINE_HEIGHT.ONE_FIVE:
                $.cookie(cookieConfig.LINE_HEIGHT, option, {expires: expiryTime, path: "/"});
                break;
            case accessibility.CONTRAST.NORMAL:
                $.removeCookie(cookieConfig.CONTRAST, {path: "/"});
                break;
            case accessibility.LINE_HEIGHT.NORMAL:
                $.removeCookie(cookieConfig.LINE_HEIGHT, {path: "/"});
                break;
        }
        location.reload();
    }

    function toDashboard() {
        location.href = PP.CONTEXT_ROOT;
    }

    function filterVisible(nodeList) {
        let elementArray = [].slice.call(nodeList);
        return elementArray.filter(isVisible);
    }

    function isVisible(element) {
        return (element.offsetWidth > 0
            || element.offsetHeight > 0
            || element.getClientRects().length > 0)
            && element.style.visibility !== 'hidden';
    }

    function isEmpty(value) {
        return (typeof value === "undefined" || value === "" || value === null);
    }

    return {
        CONTEXT_ROOT: null,
        AFTER_LOGOUT_URL: null,
        AFTER_FORCED_LOGOUT_URL: null,
        RELOGIN_URL: "",
        LOGOUT_URL: null,
        TARA_AUTH: null,
        COOKIES: {
            ACCESSIBILITY: {
                CONTRAST: "accessibility",
                LINE_HEIGHT: "accessibility-line-height"
            },
            LOCALE: "pp_locale_cookie",
            PP_TO_DR: "pp_to_dr_cookie",
        },
        CONFIG: {
            ACCESSIBILITY: {
                CONTRAST: {
                    NORMAL: "normal-contrast",
                    HIGH: "high-contrast",
                },
                LINE_HEIGHT: {
                    NORMAL: "normal-line-height",
                    ONE_FIVE: "1.5-line-height"
                }
            }
        },
        // modal window
        BACK_BUTTON_SELECTOR: '.back-button',
        FULL_SCREEN_BACK_FLIP_CLASS: 'full-screen-back-flip',
        FULL_SCREEN_BACK_FLIP_SELECTOR: '.full-screen-back-flip:visible',
        DIALOG_OVERLAY_SELECTOR: '[role="dialog"]:visible',

        login: login,
        logout: logout,
        forcedLogout: forcedLogout,
        forcedLogoutWithLogin: forcedLogoutWithLogin,
        logoutWithoutRedirect: function (skipServerSessionDestroy) {
            return logoutWithoutRedirect(skipServerSessionDestroy);
        },
        forwardToAfterLogoutURL: function () {
            return forwardToAfterLogoutURL();
        },
        tryClearingSSLCache: function () {
            return tryClearingSSLCache();
        },
        applyAccessibility: function (accebilityType) {
            return applyAccessibility(accebilityType);
        },
        setAccessibility: function (option) {
            return setAccessibility(option);
        },
        toDashboard: function () {
            return toDashboard();
        },
        filterVisible: function (nodeList) {
            return filterVisible(nodeList);
        },
        isEmpty: isEmpty,
        isNotEmpty: function (value) {
            return !isEmpty(value);
        },
        scrolling: {
            enable: function () {
                $('body').css('overflow', '');
            },

            disable: function () {
                $('body').css('overflow', 'hidden');
            },
        },

    };


})(jQuery);


