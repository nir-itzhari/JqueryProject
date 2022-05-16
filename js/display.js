"use strict";

const errorMsg = () => {
    if ($('.curContainer').length > 0) {
        $('.curContainer').remove()
    }
    const divContainer = $('<div/>').attr('id', 'cointainer').addClass('container').css('display', 'block')
    const divContainerHeader = $('<div/>').addClass('title')
    const divContainerContent = $('<div/>').addClass('contentError')
    const errorMsg = $('<div/>').addClass('error').html('Something went wrong...<a class="tryAgain">Try again</a>')
    $(divContainerContent).append(errorMsg)
    $(divContainer).append(divContainerHeader, divContainerContent).appendTo('body')
}

const navDataContainer = () => {
    const divContainer = $('<div/>').addClass('container')
    const divContainerContent = $('<div/>').addClass('content')
    const buttonGroup = $(`
    <div class="buttonGroup"><span class="title">Crypto</span>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
    <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
    <label id="home" class="btn btn-outline-primary" for="btnradio1" data-toggle="tooltip" title="Home">Home</label>
    <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
    <label id="liveReport" class="btn btn-outline-primary" for="btnradio2" data-toggle="tooltip" title="Live Reports for chosen coins">Live Reports</label>
    <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
    <label id="aboutBtn" class="btn btn-outline-primary" for="btnradio3" data-toggle="tooltip" title="About us">About</label>
    </div>
    <div class="search-box">
    <button class="btn-search"><span class="glyphicon glyphicon-search"></span></button>
    <input type="text" id="search" class="input-search" placeholder="Type to Search..." data-toggle="tooltip" title="Search For Coin"/>
    </div>
    </div>
    `)
    $('body').append(buttonGroup)
    $('body').append(`<button id="myBtn" title="Go to top">Top</button>`)
    $(divContainer).append(divContainerContent).appendTo('body')
    $('[data-toggle="tooltip"]').tooltip()
}

const createAbout = () => {

    $('.content').fadeOut(200)
    $('.search-box').fadeOut()
    $('.loader').fadeIn()
    setTimeout(() => {
        $('.content').empty()
        const divAbout = $('<div/>').addClass('about')
        const titleAndInfoDiv = $('<div/>').addClass('titleAndInfoDiv')
        const myImgAbout = $('<img/>').addClass('myIMG').attr('src', '../assets/images/myIMAGE.jpg')
        const titleAbout = $('<div/>').addClass('titleAbout').html('About Me')
        const myInfo = `I am allround web developer. I am a junior programmer with good knowledge 
                        of front-end techniques.`
        const contentAbout = $('<div/>').addClass('contentAbout').html(myInfo)
        const details = $('<div.>').addClass('details')
        const myName = $('<div.>').addClass('AboutMyName padding-Details').html('Name:')
        const name = $('<div/>').html('Nir Itzhari').appendTo(myName)
        const myAge = $('<div/>').addClass('AboutMyAge padding-Details').html('Age:')
        const age = $('<div/>').html('30')
        const myLocation = $('<div.>').addClass('AboutMyLocation padding-Details').html('Location:')
        const location = $('<div/>').html('Rosh Ha\'ayin, Merkaz, Israel')

        $(titleAndInfoDiv).append(titleAbout, contentAbout)
        $(myName).append(name)
        $(myAge).append(age)
        $(myLocation).append(location)
        $(details).append(myName, myAge, myLocation)
        $(divAbout).append(myImgAbout, titleAndInfoDiv, details).appendTo('.content')
        $('.loader').fadeOut()
        const display = $('.content').css('display')
        if (display === 'none') {
            displayAbout()
        }
    }, 1000);
}

const displayAbout = () => {
    $('.content').fadeIn()
}

const hideAbout = () => {
    $('.about').remove()
}

const randomDataDisplay = (list, toggleArr) => {
    const firstList = list.slice(0, 49)
    renderData(firstList, toggleArr)

}

const renderData = (coins, toggleArr) => {
    $("input:checkbox:not(:checked)").closest('.curContainer').remove() // כאשר המשתמש סימן מטבע ואז הוא עושה חיפוש למטבע אחר אז כל המטבעות הלא מסומנים ימחקו מהדף
    coins.forEach(coin => {
        const { id, name, symbol } = coin
        const ifExist = $.inArray(symbol, toggleArr) // כאשר המשתמש יבקש מטבע והמטבע מסומן אז הוא לא ייצר אותו שוב
        if (ifExist === -1) {
            $(`
            <div id="parent_${symbol}"class="curContainer" dataId="${symbol}"><div class="coinNameAndSymbol">
            <div class="symbol"><div style="display: inline-block;flex:80%;">${symbol.toUpperCase()}</div><div class="form-check form-switch">
            <input id="toggle_${symbol}"class="form-check-input" name="${symbol}" data-id="${symbol}" type="checkbox" id="flexSwitchCheckDefault"></div></div>
            <div class="name">${name}</div></div><div class="box-1"><div id="${id}" class="btn btn-one">
            <span class="glyphicon glyphicon-info-sign"></span><span>INFO</span></div></div>  
            `)
                .appendTo($('.content'))
        }
    })
    $('.container').appendTo('body')
}
const createInfo = (divParentId, coin) => {
    const { image } = coin
    const { usd, ils, eur } = coin.market_data.current_price
    const divInfo = $('<div/>').attr('id', `info_${divParentId}`).css('display', 'none').addClass(`divInfo`)
    const divCoinInfo = $('<div/>').attr('id', `coinInfo_${divParentId}`).addClass('coinInfo')
    const infoDollar = $('<div/>').attr('id', `dollar_${divParentId}`).html(`USD: ${usd}$`)
    const infoEuro = $('<div/>').attr('id', `eur_'${divParentId}`).html(`EUR: ${eur}€`)
    const infoILS = $('<div/>').attr('id', `ils_'${divParentId}`).html(`ILS: ${ils}₪`)
    const infoImage = $('<img/>').attr('id', `image_'${divParentId}`).addClass('.infoIMG').attr('src', `${image.small}`)
    $(divInfo).append(divCoinInfo, infoImage)
    $(divCoinInfo).append(infoDollar, infoEuro, infoILS)
    cursorWait()
    setTimeout(() => {
        const containerHeight = $(`div#${divParentId}`).height()
        if (containerHeight === 235 || containerHeight === 168) {
            cursorWaitRemove()
            $(`div#${divParentId}`).css('height', '235')
            $(`div#${divParentId}`).css('transition-duration', '0.2s')
            $(divInfo).appendTo(`div#${divParentId}`)
            $(`#info_${divParentId}`).fadeIn()
        }
        else {
            cursorWait()
            $(`#info_${divParentId}`).fadeOut()
            setTimeout(() => {
                $(`div#${divParentId}`).css('height', '180')
                $(`div#${divParentId}`).css('transition-duration', '0.3s')
            }, 500);
            cursorWaitRemove()
        }
    }, 500);
}

const cursorWait = () => {
    $('body').addClass('wait')
    $(`.btn.btn-one`).css('cursor', 'wait')
}

const cursorWaitRemove = () => {
    $('body').removeClass('wait')
    $(`.btn.btn-one`).css('cursor', 'pointer')
}

const myModal = (coinsId) => {
    $('.modalBg').fadeIn()
    let modal, checkTrueFalse = checkModalExist()

    if (checkTrueFalse === true) {
        modal = $('div#modal')
        modal.empty()
    }
    else {
        modal = $(`<div id="modal" class="modal-content"></div>`)
    }
    const title = $(`<div class="modalTitle">Switch Coin</div>`)
    const table = $('<table/>').attr('id', 'table')
    const tbody = $('<tbody/>')
    $(`
           <thead>
               <th>Coin Name</th>
               <th class="tdBtn">ACTION</th>
           </thead>`
    ).appendTo(table)
    $(title).appendTo(modal)
    $(tbody).appendTo(table)
    $(table).appendTo(modal)
    $(`<a id="cancel" class="button" role="button">
    	<span>Cancel</span>
    	<div class="icon">
    		<i class="fa fa-remove">&times;</i>
    		<i class="fa fa-check">&times;</i>
    	</div>
    </a>
    <div class="modalNote">*Please remove of one the coins in order to see report of the new chosen coin</div>
    `).appendTo(modal)
    $(modal).appendTo('body').fadeIn().css('display', 'flex')
    coinsId.forEach(coinId => {
        $(`
               <tr>>
                   <td>${coinId.toUpperCase()}</td>
                   <td class="tdBtn"><span class="close" data="${coinId}">&times;</span></td>
               </tr
               `).appendTo('#table')

    })
}

const lastCoinClick = (event) => {
    const dataId = $(event.target).attr('data')
    $(`#toggle_${dataId}`).click()
}

const checkModalExist = () => {
    return $('div#modal')[0] instanceof HTMLElement
}

const failReport = () => {
    if ($('div.failReport').length === 0) {
        const failDiv = $('<div/>').addClass('failReport')
        const failTitle = $('<div/>').addClass('failTitle').html('NOTICE')
        const msgContent = "Unfortunately there is no information for the chosen coins or you didn't choose."
        const failMsg = $('<div/>').addClass('failMsg').html(msgContent)
        $(failTitle).appendTo(failDiv)
        $(failMsg).appendTo(failDiv)
        $(failDiv).appendTo('.content').fadeIn()
    }
}

