"use strict";
$(function () {
    let list, tempCoin, toggleArr = [], toggleArrFiltered = [], interval = null, date = new Date() // משתנים לשימוש חוזר
    const StarterLoader = () => { // פונקציה מציגה אלמנטים קבועים בדף
        navDataContainer()
        $('<div/>').addClass('loader').appendTo('body')
        $('.modalBg').fadeIn()
        $('.loader').fadeIn()
        getCoins()
        $('.modalBg').fadeOut()
        $('.loader').fadeOut()
    }
    async function getCoins() { // ושולחת לפונקציה אחרת להצגת המידע רנדומלי JSON פונקציה יוצאת להביא  
        try {
            list = await $.ajax({ url: config.allCoins })
            randomDataDisplay(list)
            setTimeout(() => {
                $('.curContainer').fadeIn()
            }, 500);
        }
        catch (error) {
            $('.loader').fadeOut()
            errorMsg()
            $('.search-box').remove()
            $('.tryAgain').on('click', refresh)
        }
    }

    const refresh = () => {
        location.reload()
    }

    $(document).on('click', '#myBtn', () => topFunction())

    $(document).on('keyup', '#search', ((event) => {// פונקציית חיפוש ששולחת לפונציה שתציג מה שמחפשים
        const val = $(event.target).val()
        const coins = list.filter(coin => {
            return coin.symbol.includes(val)
        })
        if (val === "") {
            $('.liResult').remove()
            randomDataDisplay(list, toggleArr)
            $('.curContainer').fadeIn()
            return
        }
        displaySearch(coins)
    }))

    const displaySearch = (coins) => { // פונקציה מציגה את המידע שהמשתמש חיפש
        $('.liResult').remove()
        const resultDiv = $('<div/>').addClass('liResult').appendTo('.buttonGroup')
        const coinsName = coins.map(coin => coin.symbol)
        for (let coin of coinsName) {
            $(`<li></li>`).attr('id', 'liSearch').addClass('liSearch').html(coin).appendTo(resultDiv)
        }
    }

    $(document).on('click', 'div.box-1', function (event) { //LocalStorage - והולכת לפונקציה שתבדוק אם המידע קיים ב INFO פונקציה שמופעלת באמצעות לחיצה על כפתור 
        const divParentCoinId = $(this).parent().attr('id')
        const coinId = event.target.id
        checkLocalStorage(divParentCoinId, coinId)
    })
    $(document).on('click', `input.form-check-input`, (event) => { // TOGGLE - פונציית ה
        const maxArrLength = 5

        if (event.target.checked) { // סומן TOGGLE אם 
            if (toggleArr.length < maxArrLength) {// קיים מערך ריק, אם המערך קטן מ -5 תוסיף למערך 
                toggleArr.push(event.target.name)
            }
            else {
                myModal(toggleArr, event.target.name) // אם גדול מ - 5 תציג מודל המאפשר להחליף מטבע שנבחר קודם במטבע שנבחר אחרון - השישי
                tempCoin = event.target.name // שומר את המטבע האחרון שנלחץ למניפולציה לסגירת המודל
            }
        }
        else {
            if (toggleArr.length >= maxArrLength) { // אם המערך שווה ל -5 או קטן מ - 5
                if ($.inArray(tempCoin, toggleArr) === -1) { // בלחיצה על מחיקת המטבח והחלפתו במטבע האחרון שנלחץ, אז תתבצע בדיקה אם המטבע האחרון שנלחץ לא קיים במערך
                    toggleArr.push(tempCoin)// Live Reports אם לא קיים ידחף אותו למערך לטובת 
                    $('div#modal').remove()
                    $('.modalBg').hide()

                }
            }
            toggleArr = toggleArr.filter((c) => { return c !== event.target.name }) // הצעת המודל עם שם המטבע ולא הסמל ומכיוון שסמל יש יותר מאחד אותו הדבר
        }
    })

    $(document).on('click', '#cancel', () => $(`#toggle_${tempCoin}`).click()) //של המטבע האחרון שנלחץ ואז בעצם יסגור את המודל TOGGLE - כפתור הביטול במודל בעצם ילחץ על כפתור ה 
    $(document).on('click', '.close', lastCoinClick) // TOGGLE - פונקציה שמצעת לחיצה על המטבע האחרון שנבחר וסוגרת את ה 

    $('body').on('click', '#liSearch', function (event) { // פונקציה ששולחת לרינדור את המטבעות שנבחרו בחיפוש
        $('.liResult').fadeOut()
        setTimeout(() => {
            $('.liResult').remove()
        }, 500);
        const val = $(event.target).text()
        const result = list.filter(coin => coin.symbol.includes(val))
        renderData(result)
        $('.curContainer').fadeIn(500)
    })

    $(document).on('click', '#home', () => {// פונקציה שמאפסת את כל המידע באתר ומציגה אותו כמו שהלקוח ראה כשרק נכנס
        hideAbout()
        toggleArr = []
        clearReportInterval()
        $('.content').empty()
        $('.search-box').fadeIn()
        $('.loader').fadeIn()
        $('.loader').fadeOut()
        randomDataDisplay(list)
        $('.loader').fadeOut()
        $('.curContainer').fadeIn()
        $('.content').fadeIn()

    })

    $(document).on('click', '#liveReport', () => {// פונקציה שולחת להצגה דוחות בזמן אמת
        $('.content').empty()
        $(`<div id="chartContainer" class="chart" style="height: 370px; width: 100%; display: none"></div>`).appendTo($('.content'))
        liveReports()
    })

    async function getCoinsById(divParentId, coinId) {// INFO פונקציה שמביאה מידע על כל מטבע בעת לחיצה על 
        const coin = await $.ajax({ url: config.oneCoin + coinId })
        const coinStringify = JSON.stringify(coin)
        localStorage.setItem(coinId, coinStringify)
        timeOut(coinId)
        createInfo(divParentId, coin)
    }

    const checkLocalStorage = (divParentId, coin) => {//LocalStorage - פונקציה שבודקת ב 
        const getInfoFromLocalStorage = localStorage.getItem(coin)
        if ($(`#info_${divParentId}`).length > 0 && $(`div#${divParentId}`).height() === 198) {
            $(`div#${divParentId}`).css('height', '180px')
            $(`#info_${divParentId}`).hide()
            return
        }
        else if (getInfoFromLocalStorage === null) {
            return getCoinsById(divParentId, coin)
        }
        else {
            const parseFromLocalStorage = JSON.parse(getInfoFromLocalStorage)
            return createInfo(divParentId, parseFromLocalStorage)
        }
    }

    const timeOut = (coin) => {//כל 2 דקות LocalStorage - מ INFO-פונקציה שמוחקת את המידע ה  
        setTimeout(() => {
            localStorage.removeItem(coin)
        }, 120000);
    }

    window.onscroll = () => { scrollFunction() };
    const scrollFunction = () => {//Back To TOP פונקציית כפתור 
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            $('#myBtn').css('display', 'block');
        } else {
            $('#myBtn').css('display', 'none')
        }
    }

    const topFunction = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    const liveReports = () => {
        $('.curContainer').hide()
        $('.curContainer').remove()
        $('.modalBg').fadeIn()
        $('.loader').fadeIn()
        setTimeout(() => {
            $('.modalBg').fadeOut()
            $('.loader').fadeOut()
            $('.chart').fadeIn()
        }, 1200);
        $('.search-box').fadeOut()

        interval = setInterval(() => {
            liveReportsAjax()
        }, 2000);

    }

    const toUpper = (string) => {
        return string.toUpperCase();
    };

    async function liveReportsAjax() {
        toggleArr = toggleArr.map(toUpper)
        const reportList = await $.ajax({ url: config.liveReport + toggleArr + config.LiveReportToUSD })
        chartReport(reportList)
    }

    const chartReport = (coins) => {
        let dataAdded
        let options = {
            exportEnabled: true,
            animationEnabled: false,
            title: {
                text: `${toggleArrFiltered} to USD`
            },
            subtitles: [{
                text: "Currency Movements"
            }],
            axisX: {
                title: "Local Time in Minutes",
                gridThickness: 0,
                valueFormatString: "mm:ss",
            },
            axisY: {
                title: "Currency in USD",
                titleFontColor: "#C0504E",
                lineColor: "#C0504E",
                labelFontColor: "#C0504E",
                tickColor: "#C0504E"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
                itemclick: toggleDataSeries
            },
            data: []
        };
        for (let coin of toggleArr) { //על מנת לאמת שאכן הגיע המטבע TOGGLE - משתמש במערך של ה 
            for (let coinId in coins) {
                if (coin === coinId) {//response Error כאן מבצבע אימות מכיוון שלפעמים חוזר 
                    const { USD } = coins[coin]
                    dataAdded = {
                        type: "spline",
                        name: `${coin}`,
                        showInLegend: true,
                        yValueFormatString: "$#,##0.#",
                        dataPoints: [
                            { x: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() - 2, 120)), y: USD },
                            { x: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes() - 2, 0)), y: USD },
                        ]
                    }
                    options.data.push(dataAdded)
                    toggleArrFiltered.push(coin)
                    options.subtitles[0].text = "Unfortunately for some coins there is no Live information"
                    options.title.text = `${toggleArrFiltered} To USD`
                    $("#chartContainer").CanvasJSChart(options);
                }
                else {
                    continue// הוא המטבע הקליינט ביקש לא חוזר כי אין מידע אז הפונצקיה תמשיך לבא ולא תקרוס כי אין מידע
                }
            }
        }
        if (toggleArrFiltered.length == []) {//LIVE REPORT - של ה   INTERVAL  - אם כל במטבעות שהתבקשו אין מידע עבורם תוצג הודעה למשתמש ויבוטל ה 
            clearInterval(interval)
            $('.chart').remove()
            failReport()
            return
        }
        toggleArrFiltered = []
    }
    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    const clearReportInterval = () => {
        clearInterval(interval)
    }

    $(document).on('click', '#aboutBtn', () => {
        clearReportInterval()
        createAbout()
    })
    StarterLoader()
})