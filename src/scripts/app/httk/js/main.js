/**
 * Created by TUAN on 12/22/2015.
 */
var myMap;
var contactHrefVal = '#httk-map';
var orderFormDataArr;
var orderFormDataObj;
var callBackFormDataArr;
var defaultTimeout = 4000;

function showCallBackPopup(selector) {
    $('#call-back-container > div[class^="call"]').addClass('hidden');
    $(selector).removeClass('hidden');
    $(selector).addClass('fadeIn');
}

function showOrderPopup(selector) {
    $('#httk-header > div[class^="order"]').addClass('hidden');
    $(selector).removeClass('hidden');
    $(selector).addClass('fadeIn');
}

function openCallBackPopup() {
    showCallBackPopup('.call-back-popup');
}

function callBack() {
    callBackFormDataArr = $("#call-back-form").serializeArray();
//			callBackFormDataObj = _.object(_.pluck(callBackFormDataArr, 'name'), _.pluck(callBackFormDataArr, 'value'));
    $.post("smCallBack.php", callBackFormDataArr, function(data, status) {
        if (status === 'success' && data.success) {
            showCallBackPopup('.call-back-popup-success');
            setTimeout(function() {
                showCallBackPopup('.call-back');
                $('#call-back-form')[0].reset();
            }, defaultTimeout);
        }
    }, "json");
    showCallBackPopup('.call-back-popup-success');
    return false;
}

function submitOrder() {
    $.post("smOrder.php", orderFormDataArr, function(data, status) {
        if (status === 'success' && data.success) {
            showOrderPopup('.order-form-success');
            setTimeout(function() {
                showOrderPopup('.order-form');
                $('#order-form-container')[0].reset();
            }, defaultTimeout);
        }
    }, "json");

}

function backToOrderForm() {
    showOrderPopup('.order-form');
}

function confirmOrder() {
    orderFormDataArr = $("#order-form-container").serializeArray();
    orderFormDataObj = _.object(_.pluck(orderFormDataArr, 'name'), _.pluck(orderFormDataArr, 'value'));
    showOrderPopup('.order-form-confirm');
    $('#form-name-value').html(orderFormDataObj["form-name"]);
    $('#form-phone-value').html(orderFormDataObj["form-phone"]);
    $('#form-place-value').html(orderFormDataObj["form-place"]);
    $('#form-fuel-value').html(orderFormDataObj["form-fuel-selected"]);
    $('#form-time-value').html(orderFormDataObj["form-time"]);
    $('#form-size-value').html(orderFormDataObj["form-size-selected"]);
    var totalAmount = orderFormDataObj["form-size-selected"] * 30;
    $('#total-amount').html(totalAmount);
    return false;
}

function addHrefContactLink() {
    $('.contact-navbar-li > a').attr("href", contactHrefVal);
}

function changeToActiveLinkAndremoveHrefLink(selectedSelector) {
    addHrefContactLink();
    $('.contact-navbar-li').removeClass('active');
    $(selectedSelector).parent().addClass('active');
    $(selectedSelector).removeAttr('href');
}

function redrawBalloon() {
    $('.ymaps-2-1-34-balloon .ymaps-2-1-34-balloon__tail').each(function () {
        var leftTailPosition = 12;
        var downMoveParentPosition = 12;
        var rightMoveParentPosition = 5;
        var leftPosition = $(this).position().left;
        $(this).css({left: leftTailPosition + 'px'});
        var rightMovePosition = leftPosition - leftTailPosition;
        var parent = $(this).parent();
        var oldLeftParentPosition = parent.position().left;
        var oldParentTopPosition = parent.position().top;
        var newParentTopPosition = oldParentTopPosition + downMoveParentPosition;
        var newParentLeftPosition = oldLeftParentPosition + rightMovePosition + rightMoveParentPosition;
        $(this).parent().css({left: newParentLeftPosition + 'px', top: newParentTopPosition + 'px'});
    });
}

function openBalloon(marker) {
    setTimeout(function() {
        marker.balloon.open();
    }, 1000);
}



function init() {
    myMap = new ymaps.Map("map", {
        center: [55.67692909, 38.3208353],
        zoom: 10,
        controls: ['smallMapDefaultSet']
    });

//		    var coords = [
//			    [56,023, 36,988]
//				    [56,025, 36,981]
//				    [56,020, 36,981]
//				    [56,021, 36,983]
//				    [56,027, 36,987]
//		    ];
//
//		    var myCollection = new ymaps.GeoObjectCollection ();
//
//		    for (var i = 0; i <coords.length; i ++) {
//			    myCollection.add (new ymaps.Placemark (coords [i]));
//		    }
//
//		    myMap.geoObjects.add (myCollection);
    var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
        '<div class="my-layout"><div>{{ properties.balloonContent }}</div>' +
        '<div>{{ properties.description }}</div></div>'
    );

    var iconImage = {
        iconLayout: 'default#image',
        iconImageHref: 'images/marker.png',
        iconImageSize: [35, 58],
        balloonContentLayout: MyBalloonContentLayoutClass,
        balloonPanelMaxMapArea: 0
        //iconImageOffset: [-3, -42]
    };

    var defaultDuration = 1000;

    myMap.controls.remove('searchControl');
    myMap.controls.remove('typeSelector');
    myMap.controls.remove('geolocationControl');
    myMap.controls.remove('fullscreenControl');

    var m_m7b = new ymaps.Placemark([55.833091, 38.394238], {
        hintContent: 'МО, Ногинский р-н, М-7 Волга, 60-й км',
        balloonContent: 'МО, Ногинский р-н,',
        description: 'М-7 Волга, 60-й км'
    }, iconImage);

    m_m7b.events.add('click', function () {
        changeToActiveLinkAndremoveHrefLink('#m-m7b')
    });

    m_m7b.events.add('balloonopen', function () {
        redrawBalloon();
    });

    myMap.geoObjects.add(m_m7b);

    var m_34MKA = new ymaps.Placemark([55.577851, 37.586392], {
        hintContent: '34 км МКАД',
        balloonContent: '34 км МКАД'
    }, iconImage);

    m_34MKA.events.add('click', function () {
        changeToActiveLinkAndremoveHrefLink('#m-34-mka')
    });

    m_34MKA.events.add('balloonopen', function () {
        redrawBalloon();
    });

    myMap.geoObjects.add(m_34MKA);

    var m_3eK = new ymaps.Placemark([55.705939, 37.622306], {
        hintContent: '3-е Кольцо',
        balloonContent: '3-е Кольцо'
    }, iconImage);

    m_3eK.events.add('click', function () {
        changeToActiveLinkAndremoveHrefLink('#m-3e-ko')
    });

    m_3eK.events.add('balloonopen', function () {
        redrawBalloon();
    });

    myMap.geoObjects.add(m_3eK);


    var m_27MKA = new ymaps.Placemark([55.578767, 37.696085], {
        hintContent: '27 км МКАД',
        balloonContent: '27 км МКАД'
    }, iconImage);

    m_27MKA.events.add('click', function () {
        changeToActiveLinkAndremoveHrefLink('#m-27-mka')
    });

    m_27MKA.events.add('balloonopen', function () {
        redrawBalloon();
    });

    myMap.geoObjects.add(m_27MKA);

    var m_Rcho = new ymaps.Placemark([55.72238, 37.788207], {
        hintContent: 'Яснополянская',
        balloonContent: 'Яснополянская'
    }, iconImage);

    m_Rcho.events.add('click', function () {
        changeToActiveLinkAndremoveHrefLink('#m-rcho')
    });

    m_Rcho.events.add('balloonopen', function () {
        redrawBalloon();
    });

    myMap.geoObjects.add(m_Rcho);


    myMap.behaviors.disable(['scrollZoom']);


    $('#m-m7b').click(function () {
        if (!$(this).parent().hasClass('active')) {
            addHrefContactLink();
            myMap.panTo(m_m7b.geometry.getCoordinates(), {duration: defaultDuration});
            openBalloon(m_m7b);
            $(this).removeAttr('href');
        }
    });

    $('#m-34-mka').click(function () {
        if (!$(this).parent().hasClass('active')) {
            addHrefContactLink();
            myMap.panTo(m_34MKA.geometry.getCoordinates(), {duration: defaultDuration});
            openBalloon(m_34MKA);
            $(this).removeAttr('href');
        }
    });

    $('#m-3e-ko').click(function () {
        if (!$(this).parent().hasClass('active')) {
            addHrefContactLink();
            myMap.panTo(m_3eK.geometry.getCoordinates(), {duration: defaultDuration});
            openBalloon(m_3eK);
            $(this).removeAttr('href');
        }
    });

    $('#m-27-mka').click(function () {
        if (!$(this).parent().hasClass('active')) {
            addHrefContactLink();
            myMap.panTo(m_27MKA.geometry.getCoordinates(), {duration: defaultDuration});
            openBalloon(m_27MKA);
            $(this).removeAttr('href');
        }
    });

    $('#m-rcho').click(function () {
        if (!$(this).parent().hasClass('active')) {
            addHrefContactLink();
            myMap.panTo(m_Rcho.geometry.getCoordinates(), {duration: defaultDuration});
            openBalloon(m_Rcho);
            $(this).removeAttr('href');
        }
    });

    $('.contact-navbar-li > a').click(function () {
        $('.contact-navbar-li').removeClass('active');
        $(this).parent().addClass('active');
    });
}

function scrollTo() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
            return false;
        }
    }
}

$(document).ready(function () {
    ymaps.ready(init);

    $('.httk-navbar-nav-li a[href*=#]:not([href=#])').click(scrollTo);
    $('.contact-navbar-li a[href*=#]:not([href=#])').click(scrollTo);

    $('#btn-order-2').click(function() {
        var target = $('#httk-header');
        if (target.length) {
            $('html,body').animate({
                scrollTop: target.offset().top
            }, 1000);
        }
    });
    $('#form-fuel').selectpicker();
    $('#form-size').selectpicker();
    $('#form-time').datetimepicker({
        format: 'DD.MM.YYYY'
    });
});
