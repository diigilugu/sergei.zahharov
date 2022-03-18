(function ($) {
    PP.VaccineCertificates = function () {

        const MAIN_PAGE = PP.CONTEXT_ROOT + '/documents/vaccineCertificates';
        const GENERATE_PAGE = PP.CONTEXT_ROOT + '/documents/vaccineCertificates/new';

        function setup() {
            // prevent status buttons click on whole box clicking
            $('.statuses a').click(function (e) {
                e.stopPropagation();
            });

        }

        function onOkButtonClick(withTimeout) {
            if (withTimeout) {
                setTimeout(function () {
                    location.href = MAIN_PAGE;
                }, 1000);
            } else {
                location.href = MAIN_PAGE;
            }
        }

        function onSendOrderAgain() {
            location.href = GENERATE_PAGE;
        }

        function onSendOrder() {
            $('#sendVaccineOrder').attr('disabled', true);
            window.onbeforeunload = null;
            $('#generating-vaccine').show();
            let $mainVaccineForm = $('#mainVaccineForm');
            $mainVaccineForm.attr('action', GENERATE_PAGE + '/wait');
            $mainVaccineForm.submit();
        }

        function getOne(uuid, isHistorical) {

            let isMobile = {
                Android: function () {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function () {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function () {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                Opera: function () {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function () {
                    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };
            if (isMobile.any()) {
                let getOneURL;
                if (isHistorical) {
                    getOneURL = MAIN_PAGE + '/history/mobileGetOne';
                } else {
                    getOneURL = MAIN_PAGE + '/mobileGetOne';
                }
                $.post(getOneURL, {"uuid": uuid}, function (data) {
                    if (data.PDFBase64) {
                        downloadPDF(data.PDFBase64);
                    }
                });
            } else {
                let getOneURL;
                if (isHistorical) {
                    getOneURL = MAIN_PAGE + '/history/getOne';
                } else {
                    getOneURL = MAIN_PAGE + '/getOne';
                }
                $.post(getOneURL, {"uuid": uuid}, function () {
                    window.location.href = MAIN_PAGE + '/getOne';
                });
            }
        }

        function downloadPDF(cert) {
            let link = document.createElement("a");
            const binaryString = window.atob(cert);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; ++i) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            let file = new Blob([bytes], {type: 'application/pdf'});
            if (window.navigator.msSaveOrOpenBlob) {
                window.navigator.msSaveOrOpenBlob(file, fileName);
            } else {
                let fileURL = URL.createObjectURL(file);
                link.href = fileURL;
                link.download = fileName;
                link.click();
                setTimeout(function () {
                    window.URL.revokeObjectURL(fileURL);
                }, 100);
            }
        }

        function queryCertificateStatus(uuid, timeout) {
            let getCertificateStatusURL = MAIN_PAGE + '/status';
            startTimer(timeout);
            $.post(getCertificateStatusURL, {"uuid": uuid}, function (data) {
                if (data.action === 'failure') {
                    location.href = GENERATE_PAGE + '/failure';
                } else if (data.action === 'save') {
                    location.href = GENERATE_PAGE + '/success';
                }
            });
        }

        function deleteCert(uuid, button) {
            let deleteCertURL = MAIN_PAGE + '/delete';
            $.post(deleteCertURL, {"uuid": uuid}, function (data) {
                if (data.certDeleted) {
                    $("#certificate-delete-dialog").hide();
                    location.href = MAIN_PAGE;
                } else {
                    $(button).css('background-color', 'red');
                    $(button).text('Nurjus');
                }
            });
        }

        function setDeleteAction(uuid, button) {
            $(button).on('click', function () {
                $("#certificate-delete-dialog").show();
            });
            $("#certificate-delete-dialog").find(".delete-button").on("click", function () {
                PP.VaccineCertificates.deleteCert(uuid, this);
            });
        }

        function startTimer(timeout) {
            const FULL_DASH_ARRAY = 283;
            const WARNING_THRESHOLD = 30;
            const ALERT_THRESHOLD = 50;
            let timePassed = 0;
            let timerInterval = null;
            let COLOR_CODES = {
                info: {
                    color: "green"
                },
                warning: {
                    color: "orange",
                    threshold: WARNING_THRESHOLD
                },
                alert: {
                    color: "red",
                    threshold: ALERT_THRESHOLD
                }
            };
            let TIME_LIMIT = timeout;
            let timeLeft = TIME_LIMIT;
            let timer = $("#clockTimer");
            let timeValue = 0
            if (timer != null) {
                timerInterval = setInterval(function () {
                    let timePassedNew = timePassed += 1;
                    timeLeft = TIME_LIMIT - timePassedNew;
                    timeValue = timeout - timeLeft;
                    $("#base-timer-label").html(timeValue.toString());

                    //SetCircleArray
                    let value = (PP.VaccineCertificates.calculateTimeFraction(timeLeft, TIME_LIMIT) * FULL_DASH_ARRAY).toFixed(0);
                    const circleDasharray = value.toString().concat(' 283');
                    $("#base-timer-path-remaining").attr("stroke-dasharray", circleDasharray);

                    //SetRemainingPathColor
                    if (timeValue >= COLOR_CODES.alert.threshold) {
                        $('#base-timer-path-remaining').removeClass(COLOR_CODES.warning.color).addClass(COLOR_CODES.alert.color);
                    } else if (timeValue >= COLOR_CODES.warning.threshold) {
                        $('#base-timer-path-remaining').removeClass(COLOR_CODES.info.color).addClass(COLOR_CODES.warning.color);
                    }
                    if (timeLeft === 0) {
                        clearInterval(timerInterval);
                        $('#certificate-pending-dialog').hide();
                        location.href = MAIN_PAGE;
                    }
                }, 1000);
            }
        }

        function formatTime(time, timeout) {
            return timeout - time;
        }

        function calculateTimeFraction(timeLeft, timeLimit) {
            const rawTimeFraction = timeLeft / timeLimit;
            return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
        }

        return {
            setup: setup,
            onOkButtonClick: onOkButtonClick,
            onSendOrder: onSendOrder,
            getOne: getOne,
            downloadPDF: downloadPDF,
            queryCertificateStatus: queryCertificateStatus,
            deleteCert: deleteCert,
            setDeleteAction: setDeleteAction,
            calculateTimeFraction: calculateTimeFraction,
        }

    }();
})(jQuery);