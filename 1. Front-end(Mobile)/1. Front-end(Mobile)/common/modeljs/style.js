$(document).ready(function () {
  'use strict';
  var mobileUI,
    iaData,
    $gnbOpenbtn = $('#header').find('span.menu_btn'),
    $gnbClosebtn = $('#header').find('.gnb_close'),
    $navDim = $('#header').find('.nav_dim'),
    $nav = $('#nav'),
    target1 = $('#driveReserved').find('.drive').find('ol').find('>li.step1'),
    target2 = $('#driveReserved').find('.drive').find('ol').find('>li.step2'),
    target3 = $('#driveReserved').find('.drive').find('ol').find('>li.step3'),
    currentStep1 = false,
    currentStep2 = false,
    selectModel = '',
    selectPlace = '',
    selectRequestType;
  var $quickmenu = $('#quickmenu'),
    $quickToggle = $('#quickToggle');

  /* ----------------------------------------------------------------------- 주요 1 : 로고 애니메이션 */
  function logoanimation(action) {
    var ease = 'easeOutQuint',
      actn = action,
      hValue;
    if (commonjs.isMobile() && actn === "open") {
      hValue = '72px';
    } else if (commonjs.isMobile() && actn === "close") {
      hValue = '40px';
    } else if (!commonjs.isMobile() && actn === "open") {
      hValue = '144px';
    } else if (!commonjs.isMobile() && actn === "close") {
      hValue = '80px';
    }
    $('#header > h1').stop().animate({'height': hValue}, 400, ease, function () {
      imgFade(actn);
    });

    function imgFade(ac) {
      var thisac = ac;
      if (thisac === "close") {
        $('#header > h1').find('.logo1.before').stop().animate({'opacity': 0}, 1400, ease).css('z-index', '9');
        $('#header > h1').find('.logo1.after').show().stop().animate({'opacity': 1}, 1400, ease).css('z-index', '10');
        //                $('#olympiclogo').stop().animate({'opacity': 0}, 1400, ease);
      } else if (thisac === "open") {
        $('#header > h1').find('.logo1.before').stop().animate({'opacity': 1}, 1400, ease).css('z-index', '10');
        $('#header > h1').find('.logo1.after').stop().animate({'opacity': 0}, 1400, ease).css('z-index', '9');
        //                $('#olympiclogo').stop().animate({'opacity': 1}, 1400, ease);
      }
    }
  }

  resizeModule(function () {
    if (!(depth1 === 99 || depth1 === 98 || (depth1 === 0 && depth2 === 2 && depth3 === 1))) {
      if ($('#header > h1').hasClass('close')) logoanimation("close");
      else logoanimation("open");
    }
  });
  $(window).scroll(function (e) {
    var $logo = $('#header').find('h1');
    var sclVal = $(window).scrollTop();
    if (!(depth1 == 99 || depth1 == 98 || (depth1 == 0 && depth2 == 2 && depth3 == 1))) {
      //각 디테일 페이지가 아닌 경우
      if (sclVal > 1 && !$logo.hasClass('close')) {
        $logo.addClass('close');
        logoanimation('close');
      } else if (sclVal <= 1 && $logo.hasClass('close')) {
        $logo.removeClass('close');
        logoanimation('open');
      }
      //if
    }
    //if
  });

  /* ----------------------------------------------------------------------- 주요 2 : ia 정보구조 생성 */
  ajaxcallingJSON("/json/IA.json?v=1", "GET", '', function (data) {
    iaData = data.ia;
    if (depth1 === 1000) {
      mainPage.settings();
    } else if (depth1 === 1001) {
      setTimeout(function () {
        window.history.back();
      }, 1500);
    } else {
      subPage.settings();
    }
    globalActions();
    gnbCtrl();
  });

  /* ----------------------------------------------------------------------- 주요 2 - 1 : gnbCtrl */
  function gnbCtrl() {
    var gnb = $('#header').find('#nav');
    gnb.find('>ul').find('>li').each(function (i) {
      var gnbthis = $(this);
      gnbthis.find('>a').on('click', function (e) {
        var thisBtn = $(this);
        gnbthis.toggleClass('active').siblings().removeClass('active');
        if (gnbthis.is('.active')) {
          $('#olympiclogo').attr('style', 'display:none !important');
        } else {
          $('#olympiclogo').attr('style', 'display:none');
        }
        if (!commonjs.isMobile()) {
          var st = $('.gnb1 .imgBox > img').height() / 2;
          $('.gnb1 .imgBox > img').css('margin-top', -st + 'px');
        }
        if (i === 0 || i === 1) commonjs.eventClick(e);
      });
      if (i === 1) {
        //1뎁스가 모델인 경우 인터렉션이 필요하기 때문에 추가 정의
        gnbthis.find('ul.hasTab').find('>li').each(function (index) {
          var gnbthisBtn = $(this);
          gnbthisBtn.hover(function (e) {
            gnbthisBtn.find('.hoverImg').stop().animate({'opacity': 1}, 400, 'easeOutQuad');
          }, function (e) {
            gnbthisBtn.find('.hoverImg').stop().animate({'opacity': 0}, 400, 'easeOutQuad');
          })
        });
      }
      //if 모델일 경우만
    });
    //each

    target2.addClass('clip_hide');
    target3.addClass('clip_hide');
    currentStep1 = false;
    currentStep2 = false;
    $nav.find('#openDrive').on('click', function (e) {
      //            if(!target2.hasClass('clip_hide') && target3.hasClass('clip_hide'))target3.removeClass('clip_hide');
      $('#wrap').addClass('test_popOpen');
      $('#driveReserved').addClass('dt_open');
      $('.viSimpleSlider').resize();
      /********************** 각 딜러사 페이지에서 시승신청 클릭시 지도 활성화를 위한 코드 *************************/
      $('.test_step2ListWrap').find('li').removeClass('selected');
      $('.test_step2ListWrap').find('>div').removeClass('other');
      $('.test_step2ListWrap').find('>div#newselect').remove();
      //초기화 해야함

      if (depth1 == 3 && depth2 == 1) {
        target2.removeClass('clip_hide');
        var activeEle = $('.test_step2ListWrap').find('li[dcode=' + d_code + ']');
        activeEle.addClass('selected');
        //디코드에 맞는 값 셀렉트
        activeEle.find('input').click();
        //해당 지점 버튼 활성화
        var area2code = activeEle.attr('area2');
        //해당 지점의 area2 코드 가져오기
        $('<div class="tslw_inner" id="newselect"></div>').appendTo($('.test_step2ListWrap')).html('<ul></ul>');
        //옮길 공간 생성
        $('.test_step2ListWrap').find('li.selected').clone().prependTo($('#newselect').find('>ul'));
        $('.test_step2ListWrap').find('li').each(function (index) {
          var _this = $(this);
          if (_this.attr('family').indexOf(area2code) >= 0) {
            _this.clone().appendTo($('#newselect').find('>ul'));
            //생성한 위치로 이동
          }
        });
        $('.test_step2ListWrap').find('>div').hide();
        $('.test_step2ListWrap').find('>div#newselect').show().find('>ul>li').removeClass('no_border');
        $('.test_step2ListWrap').find('>div#newselect').siblings().addClass('other');
        $('.test_step2ListWrap').find('>div#newselect').find('li').each(function (index) {
          var getId = $(this).find('input').attr('id') + 'new';
          $(this).find('input').attr('name', 'new_group');
          $(this).find('input').attr('id', getId);
          $(this).find('label').attr('for', getId);
          $(this).find('input').on('click', function (e) {
            var _this = $(this);
            selectPlace = _this.val();
            $('.test_step2ListWrap').find('>div.other').find('li').find('input[clicknum=' + _this.attr('clicknum') + ']').click();
          });
        });
      }
      commonjs.eventClick(e);
    });
    //시승 신청 버튼

    //        2016-12-16 민환수정
    $nav.find('#openDrive').find('>a').hover(function (e) {
      $('#openDrive').find('.gnb_car').stop().animate({'right': '87px'}, 400, 'easeOutQuad');
    }, function (e) {
      $('#openDrive').find('.gnb_car').stop().animate({'right': '50px'}, 400, 'easeOutQuad');
    });
    //사이드 팝업
    gnb.find('>ul').find('>li').eq(depth1).addClass('current');
    if (depth1 == 90) {
      gnb.find('>ul').find('>li').eq(1).addClass('current');
    } else if (depth1 == 20180605) {
      gnb.find('>ul').find('>li').eq(6).addClass('current');
    }
    if (depth1 == 0 && depth2 == 2) {
      //인사이드가 밖으로 메뉴 하나 추가되서 활성화 시키려고
      gnb.find('>ul').find('>li').eq(4).addClass('current');
    }

    function rsz() {
      /* 민환씨 추가 코드 */
      var Liheight = ($(window).height() - $('#header').height()) / 3;
      if (commonjs.isMobile()) {
        gnb.find('>ul>li').find('ul.hasTab').find('li .imgBox').css('height', '53px');
      } else {
        gnb.find('>ul>li').find('ul.hasTab').find('li .imgBox').css('height', Liheight);
        var st = $('.gnb1 .imgBox > img').height() / 2;
        var st2 = $('.gnb_txBox').height() / 2;
        $('.gnb1 .imgBox > img').css('margin-top', -st + 'px');
        $('.gnb1 .gnb_txBox').css('margin-top', -st2 + 'px')
      }
      /* 민환씨 추가 코드 끝 */
    }

    rsz();
    resizeModule(function () {
      rsz();
    });
  };

  /* ----------------------------------------------------------------------- 주요 2 - 2 : globalActions */
  function globalActions() {
    $gnbOpenbtn.on('click', function (e) {
      $nav.addClass('nav_on');
      if (!(depth1 === 99 || depth1 === 98 || (depth1 === 0 && depth2 === 2 && depth3 === 1))) {
        $('#header > h1').addClass('close');
        logoanimation('close');
      }
      commonjs.eventClick(e);
    });

    $gnbClosebtn.on('click', function (e) {
      $nav.removeClass('nav_on');
      if (!(depth1 === 99 || depth1 === 98 || (depth1 === 0 && depth2 === 2 && depth3 === 1))) {
        $('#header > h1').removeClass('close');
        logoanimation('open');
      }
      commonjs.eventClick(e);
    });

    $navDim.on('click', function (e) {
      $nav.removeClass('nav_on');
      commonjs.eventClick(e);
    });

    $('.drive_testInner').find('.close').on('click', function (e) {
      $('#driveReserved').find('input').val('');
      $('#driveReserved').find('input').prop('checked', false);
      $('#wrap').removeClass('test_popOpen');
      $('.drive_test').removeClass('dt_open');
      target2.addClass('clip_hide');
      target3.addClass('clip_hide');
      currentStep1 = false;
      currentStep2 = false;
      $('.clip > div.clip_img').find('img').attr('src', '/image/test_carDum_empty.jpg');
      commonjs.eventClick(e);
    });
    //시승신청 닫기 버튼

    $('.ie_dim').on('click', function (e) {
      $('#wrap').removeClass('test_popOpen');
      $('.drive_test').removeClass('dt_open');
      $('#drive_event').css('display','none');
      //            $('.drive_testInner').find('.close').click();
    });

    $('#footer a.foot_news').on('click', function (e) {
      $('#wrap').addClass('test_popOpen');
      $('#newsletterJoin').addClass('dt_open');
      commonjs.eventClick(e);
    });

    $('.go_top').on('click', function (e) {
      commonjs.scrollToBody(0, 100);
    });

    sideInfor();
    //사이드 기능 추가
    joinNewsletterFnc();
    //뉴스레터 기능 활성화

  }

  /* ----------------------------------------------------------------------- 주요 3 : 뉴스레터 구독신청 컨트롤러 */
  function joinNewsletterFnc() {
    var $info_check1 = $('#newsletterJoin').find('.drive').find('#news_ch1'),
      $info_check2 = $('#newsletterJoin').find('.drive').find('#news_ch2'),
      $info_check3 = $('#newsletterJoin').find('.drive').find('#news_ch3'),
      $info_nocheck1 = $('#newsletterJoin').find('.drive').find('#news_ch1_2'),
      $info_nocheck2 = $('#newsletterJoin').find('.drive').find('#news_ch2_2'),
      $info_nocheck3 = $('#newsletterJoin').find('.drive').find('#news_ch3_2'),
      $info_all = $('#newsletterJoin').find('.drive').find('#checkb');

    $info_check1.on('click', function () {
      inforAllCheck();
    });
    $info_check2.on('click', function () {
      inforAllCheck();
    });
    $info_check3.on('click', function () {
      inforAllCheck();
    });
    $info_nocheck1.on('click', function () {
      inforAllCheck();
    });
    $info_nocheck2.on('click', function () {
      inforAllCheck();
    });
    $info_nocheck3.on('click', function () {
      inforAllCheck();
    });

    $info_all.on('click', function (e) {
      if ($info_all.is(':checked')) {
        $info_check1.prop('checked', true);
        $info_check2.prop('checked', true);
        $info_check3.prop('checked', true);
        $info_nocheck1.prop('checked', false);
        $info_nocheck2.prop('checked', false);
        $info_nocheck3.prop('checked', false);
      } else {
        $info_check1.prop('checked', false);
        $info_check2.prop('checked', false);
        $info_check3.prop('checked', false);
        $info_nocheck1.prop('checked', true);
        $info_nocheck2.prop('checked', true);
        $info_nocheck3.prop('checked', true);
      }
      inforAllCheck();
    })

    function inforAllCheck() {
      var _target = $('#newsletterJoin').find('.drive');
      if ($info_check1.is(':checked') && $info_check2.is(':checked') && $info_check3.is(':checked')) {
        $info_all.prop('checked', true);
      } else {
        $info_all.prop('checked', false);
      }
      //if
      if (checkedBox()) {
        _target.find('.accept_testDrive').addClass('atd_active');
      } else {
        _target.find('.accept_testDrive').removeClass('atd_active');
      }

    }

    function checkedBox() {
      if ($info_check1.is(':checked') && $info_check2.is(':checked') && $info_check3.is(':checked')) {
        return true;
      } else {
        return false;
      }
    }

    // 모두 동의 체크 박스 유효성 검사


    $('#newsletterJoin').find('.drive').find('.accept_testDrive').on('click', function (e) {
      if ($(this).hasClass('atd_active')) {
        checkDataNewsletter();
      } else {
        alert("정보수신 및 개인정보 활용에 동의 체크해주세요.")
      }
      commonjs.eventClick(e);
    });
    //구독신청 버튼

  }

  //    $('.jsonp_test').on('click', function(){
  //        var params = {"email" : 'yhartme'};
  //
  //        ajaxcalling_jsonp('/json/jsonp.aspx', "POST", params, 'jsonp', 'myCallback', function(data){
  //            console.log(data)
  //        });
  //    });


  /* ----------------------------------------------------------------------- 주요 3 - 1 : 뉴스레터 구독 신청 유효검사 후 전송  */
  function checkDataNewsletter() {
    var emailCheck = /^([\w\.-]+)@([a-z\d\.-]+)\.([a-z\.]{2,6})$/; // 이메일 검사
    var _userEmail = $('#NLuser_email');

    if (_userEmail.val().length == 0) {
      alert('이메일 주소를 입력해주세요.');
      _userEmail.focus();
      return false;
    } else if (emailCheck.test(_userEmail.val()) != true) {
      alert('이메일 형식이 올바르지 않습니다.');
      _userEmail.focus();
      return false;
    }
    var params = {"email": _userEmail.val()};
    //        console.log(params);
    $('<div id="sending"></div>').appendTo($('#newsletterJoin')).css({
      'position': 'fixed',
      'left': '0',
      'right': '0',
      'top': '0',
      'bottom': '0',
      'width': '100%',
      'height': '100%',
      'background-color': 'rgba(0, 0, 0, 0.7)',
      //            'filter': 'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=\'#7c000000\', endColorstr=\'#7c000000\')',
      'z-index': '10003',

    }).html('<img src="/image/loading.gif" style="width:64px;height:64px;margin-top:-32px;margin-left:-32px;position:absolute;left:50%;top:50%;">');
    //        ajaxcalling(url_inside_newsletter_join, "POST", params, function(data){
    ajaxcalling_jsonp(url_inside_newsletter_join, "POST", params, 'jsonp', 'Callback', function (data) {
      $('#sending').remove();
      //            if(data == "result=true"){
      if (data.result) {
        alert("뉴스레터 구독신청이 완료되었습니다.");
        $('#newsletterJoin').find('input').val('');
        $('#newsletterJoin').find('input').prop('checked', false);
        $('#newsletterJoin').find('.drive').find('.accept_testDrive').removeClass('test_popOpen');
        $('#newsletterJoin').removeClass('dt_open');
        $('#wrap').removeClass('test_popOpen');
      } else {
        alert("구독신청에 실패하였습니다.");
      }
    });
  };

  /* ----------------------------------------------------------------------- 주요 3 - 2 : 뉴스레터 구독 신청 거부  */
  function outNewsletterFnc() {
    $('#wrap').addClass('test_popOpen');
    $('#newsletterOut').addClass('dt_open');
    $('#newsletterOut').find('.drive').find('.accept_testDrive').on('click', function (e) {
      var emailCheck = /^([\w\.-]+)@([a-z\d\.-]+)\.([a-z\.]{2,6})$/; // 이메일 검사
      var _userEmail = $('#Outuser_email');

      if (_userEmail.val().length == 0) {
        alert('이메일 주소를 입력해주세요.');
        _userEmail.focus();
        return false;
      } else if (emailCheck.test(_userEmail.val()) != true) {
        alert('이메일 형식이 올바르지 않습니다.');
        _userEmail.focus();
        return false;
      }
      var params = {"email": _userEmail.val()};
      console.log(params);
      $('<div id="sending"></div>').appendTo($('#newsletterJoin')).css({
        'position': 'fixed',
        'left': '0',
        'right': '0',
        'top': '0',
        'bottom': '0',
        'width': '100%',
        'height': '100%',
        'background-color': 'rgba(0, 0, 0, 0.7)',
        //                'filter': 'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=\'#7c000000\', endColorstr=\'#7c000000\')',
        'z-index': '10003',

      }).html('<img src="/image/loading.gif" style="width:64px;height:64px;margin-top:-32px;margin-left:-32px;position:absolute;left:50%;top:50%;">');
      //            ajaxcalling('/json/save_subscribe_deny.aspx', "POST", params, function(data){
      ajaxcalling_jsonp('https://www.toyota.co.kr/json/jsonp_save_subscribe_deny.aspx', "POST", params, 'jsonp', 'Callback', function (data) {
        $('#sending').remove();
        //                if(data == "result=true"){
        if (data.result) {
          alert("뉴스레터 수신 거부 신청이 완료되었습니다.");
          $('#newsletterOut').find('input').val('');
          $('#newsletterOut').removeClass('dt_open');
          $('#wrap').removeClass('test_popOpen');
        } else {
          alert("오류가 발생하였습니다.");
        }
      });
      commonjs.eventClick(e);
    });
    //구독신청 버튼
  }

  /* ----------------------------------------------------------------------- 주요 4 : 시승신청 */
  function sideInfor() {
    var loadData1,
      loadData2;
    ajaxcallingJSON(url_sideInfor_drive, "GET", '', function (data) {
      var _data = data,
        AddModels = 0;
      loadData1 = data;
      $.each(_data.Models, function (index) {
        var AddClass = "",
          _target = target1.find('.clip > ul');
        if (index == _data.Models.length - 1) {
          AddClass = "no_border";
        }
        $('<li class="' + AddClass + '"></li>').appendTo(_target).html('<h4>' + _data.Models[index][0].modelLine + '</h4><ul class="models"></ul>');
        //모델라인 넣고
        for (var i = 0; i < _data.Models[index][1].length; i++) {
          $('<li></li>').appendTo(_target.find('>li').eq(index).find('ul.models')).html('<input type="radio" id="car_check' + AddModels + '" name="car_group" value="' + _data.Models[index][1][i].modelName + '"><label for="car_check' + AddModels + '">' + _data.Models[index][1][i].modelName + '</label>');
          AddModels = AddModels + 1;
        }
        //for -  그안에 모델들 넣기
      });
      //each - 모델 요소들 생성
      ajaxcallingJSON(url_dealers_index, "GET", '', makeShowroom);
      //$('#car_check6').attr('disabled',true);
    });

    //makeModel

    function makeShowroom(data) {
      var _data = data,
        _target = $('#driveReserved').find('.test_step2ListWrap');
      loadData2 = data;
      _target.find('.tslw_inner').find('>ul').empty();
      $.each(_data.Exhibition, function (index) {
        var thisjs = $(this);
        var matchText = thisjs[0].area1;
        _target.find('.tslw_inner').each(function (eleIndex) {
          var _this = $(this),
            thisArea = _this.attr('area');
          if (thisArea.indexOf(matchText) >= 0) {
            $('<li dcode="' + thisjs[0].dcode + '" area2="' + thisjs[0].area2 + '" family="' + thisjs[0].family + '"></li>').appendTo(_this.find('>ul')).html('<input type="radio" id="place' + index + '" name="place_group" value="' + thisjs[0].placeName + '" clicknum="' + index + '" ><label for="place' + index + '">' + thisjs[0].placeName + '</label>');
          }
          ;
          //if
        });
      });
      _target.find('.tslw_inner').find('>ul').each(function (index) {
        var _this = $(this);
        //                console.log(_this.find('>li').length%2)
        _this.find('>li').eq(_this.find('>li').length - 1).addClass('no_border');
        if (_this.find('>li').length % 2 == 0) _this.find('>li').eq(_this.find('>li').length - 2).addClass('no_border');
      });
      $('.rd-container').insertAfter('.drive_test').css({
        'position': 'absolute',
        'z-index': '10001',
      });
      //            setCalendar();
      sideInforCtrl(loadData1, loadData2);
    };
    //makeShowroom
  };

  /* 민환씨 요청 */
  if (!("placeholder" in document.createElement("input"))) {
    jQuery(":input[placeholder]").each(function () {
      var $this = jQuery(this);
      var pos = $this.offset();
      if (!this.id) this.id = "jQueryVirtual_" + this.name;
      if (this.id) {
        if (jQuery.browser.version < 8) {
          $this.after("<label for='" + this.id +
            "' id='jQueryVirtual_label_" + this.id +
            "' class='absolute'>" + $this.attr("placeholder") +
            "</label>");
          $("#jQueryVirtual_label_" + this.id).css({
            "left": (pos.left + 5), "margin-top": 3,
            "width": $this.width(),
          });
        }
        else {
          $this.after("<label for='" + this.id +
            "' id='jQueryVirtual_label_" + this.id +
            "' style='left:" + (pos.left + 5) +
            "px;margin-top:2px' class='absolute'>" +
            $this.attr("placeholder") + "</label>");
        }
      }
    }).focus(function () {
      var $this = jQuery(this);
      $this.addClass("focusbox");
      jQuery("#jQueryVirtual_label_" + $this.attr("id")).hide();
    }).blur(function () {
      var $this = jQuery(this);
      $this.removeClass("focusbox");
      if (!jQuery.trim($this.val()))
        jQuery("#jQueryVirtual_label_" + $this.attr("id")).show();
      else jQuery("#jQueryVirtual_label_" + $this.attr("id")).hide();
    }).trigger("blur");
  }
  ;
  /* 민환씨 요청 끝 */

  /* ----------------------------------------------------------------------- 주요 4 - 1 : 시승신청 컨트롤러 */
  function sideInforCtrl(data1, data2) {
    var _data = data1,
      _data2 = data2;
    target1.find('input').on('click', function (e) {
      //index는 탭별 순서임
      var pindex = $(this).parent().parent().parent().index();
      var indexing = $(this).parent().index();
      target1.find('.clip > div.clip_img').find('img').attr('src', _data.Models[pindex][1][indexing].carImg);
      target2.removeClass('clip_hide');
      currentStep1 = true;
      if (currentStep1 && !currentStep2) target2.removeClass('clip_hide'); //1번만 체크된거라면 2번 열리고
      else if (currentStep1 && currentStep2) target3.removeClass('clip_hide'); //둘다 체크된거라면 3번 열림
      selectModel = $(this).val();
      //                console.log(selectModel)
      //자동차 모델 선택 라디오 버튼
    });
    //click - 모델 선택 인풋 이벤트
    $('.step2 .clip_img').hide();
    target2.find('input').each(function (index) {
      var _this = $(this);
      _this.on('click', function (e) {
        //                var indexing = index;
        var indexing = Number(_this.attr('clicknum'));
        placeSelect(_data2, indexing);
        currentStep2 = true;
        if (currentStep1 && currentStep2) target3.removeClass('clip_hide'); //둘다 체크해야 다음이 열림
        selectPlace = _this.val();
      });
    });

    //click - 지점 선택 인풋 이벤트
    var $info_check1 = $('#driveReserved').find('.drive').find('#info_check'),
      $info_check2 = $('#driveReserved').find('.drive').find('#ch1'),
      //$info_check3 = $('#driveReserved').find('.drive').find('#ch2'),
      $info_check4 = $('#driveReserved').find('.drive').find('#ch3'),
      $info_nocheck2 = $('#driveReserved').find('.drive').find('#ch1_2'),
      //$info_nocheck3 = $('#driveReserved').find('.drive').find('#ch2_2'),
      $info_nocheck4 = $('#driveReserved').find('.drive').find('#ch3_2'),
      $info_all = $('#driveReserved').find('.drive').find('#checka');

    $info_check1.on('click', function () {
      inforAllCheck();
    });
    $info_check2.on('click', function () {
      inforAllCheck();
    });
    //$info_check3.on('click', function () { inforAllCheck(); });
    $info_check4.on('click', function () {
      inforAllCheck();
    });
    $info_nocheck2.on('click', function () {
      inforAllCheck();
    });
    //$info_nocheck3.on('click', function () { inforAllCheck(); });
    $info_nocheck4.on('click', function () {
      inforAllCheck();
    });

    $info_all.on('click', function (e) {
      if ($info_all.is(':checked')) {
        $info_check2.prop('checked', true);
        //$info_check3.prop('checked', true);
        $info_check4.prop('checked', true);
        $info_nocheck2.prop('checked', false);
        //$info_nocheck3.prop('checked', false);
        $info_nocheck4.prop('checked', false);
      } else {
        $info_check2.prop('checked', false);
        //$info_check3.prop('checked', false);
        $info_check4.prop('checked', false);
        $info_nocheck2.prop('checked', true);
        //$info_nocheck3.prop('checked', true);
        $info_nocheck4.prop('checked', true);
      }
      inforAllCheck();
    })

    function inforAllCheck() {
      var _target = $('#driveReserved').find('.drive');
      //if ($info_check2.is(':checked') && $info_check3.is(':checked') && $info_check4.is(':checked')) {
      if ($info_check2.is(':checked') && $info_check4.is(':checked')) {
        $info_all.prop('checked', true);
        document.getElementById("ch3_2_on").style.display = "none";
      } else {
        $info_all.prop('checked', false);
        //document.getElementById("ch3_2_on").style.display = "block";
      }
      //if
      if (checkedBox()) {
        _target.find('.accept_testDrive').addClass('atd_active');
      } else {
        _target.find('.accept_testDrive').removeClass('atd_active');
      }

    }

    function checkedBox() {
      //if ($info_check2.is(':checked') && $info_check3.is(':checked') && $info_check4.is(':checked')) {
      if ($info_check2.is(':checked') && $info_check4.is(':checked')) {
        return true;
      } else {
        return false;
      }
    }

    // 모두 동의 체크 박스 유효성 검사

    $('.RequestType').on('click', function (e) {
      selectRequestType = $(this).val();
    });
    //요청 내용

    $('a.info_viewBtn').on('click', function (e) {
      $('.dps').addClass('dps_open');
      $('#driveReserved').scrollTop(0);
      commonjs.eventClick(e);
    });
    //개인정보 보기 팝업

    $('.drive_testInfoPopupClose').on('click', function (e) {
      $('.dps').removeClass('dps_open');
      $('#driveReserved').scrollTop($('.accept_testDrive').offset().top);
      commonjs.eventClick(e);
    });
    $('a.tdp_accept').on('click', function (e) {
      $('.dps').removeClass('dps_open');
      $('#driveReserved').scrollTop($('.accept_testDrive').offset().top);
      commonjs.eventClick(e);
    });
    //개인정보 보기 팝업창 닫기 이벤트

    $('#driveReserved').find('.drive').find('.accept_testDrive').on('click', function (e) {
      if (checkedBox()) {
        checkData();
      } else {
        alert("개인정보 활용에 동의 체크해주세요.");
      }
      commonjs.eventClick(e);
    });
    //시승 신청 완료 버튼

    $('.phonenumbers').keydown(function (event) {
      var keyID = (event.which) ? event.which : event.keyCode;
      if ((keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105 || keyID == 8 || keyID == 9 || keyID == 13 || keyID == 189)) {
        return;
      } else {
        return false;
      }
    });
    //폰번호 클릭시

    $('#d').keydown(function (event) {
      return false;
    });
    //d
    /*민환씨 추가*/
    $('#d').datepicker({
      minDate: 0,
      dateFormat: "yy-mm-dd",
      beforeShow: function () {
        setTimeout(function () {
          $('.ui-datepicker').css('z-index', 99999999999999);
        }, 0);
      },
    });
    $('.ui-datepicker').hide();
    $('#d').on('click', function () {
      $('.ui-datepicker').show();
    });
    $('.ui-datepicker table td a').on('click', function () {
      $('.ui-datepicker').hide();
    });
    /**/
    $('#driveReserved').find('.drive').find('ol').find('>li').addClass('clip_hide');
    $('#driveReserved').find('.drive').find('ol').find('>li.step1').removeClass('clip_hide');
  }

  /* ----------------------------------------------------------------------- 주요 4 - 2 : 지점 선택 라디오 버튼 액션 */
  function placeSelect(data, indexing) {
    $('.clip_img').show();
    var _data = data,
      _indexing = indexing;
    var _target = $('.drive_testInner').find('.drive').find('ol').find('>li.step2').find('.clip > div.clip_img');
    _target.find('div.place_popup').find('dt').html(_data.Exhibition[_indexing][0].placeName);
    _target.find('div.place_popup').find('dd.address').html(_data.Exhibition[_indexing][1][0].address);
    _target.find('div.place_popup').find('dd.tel').html(_data.Exhibition[_indexing][1][0].tel);
    if (_data.Exhibition[_indexing][1][0].mapStyle == "IMG") {
      _target.find('#mapInsert').html('<img src="' + _data.Exhibition[_indexing][1][0].mapUrl + '">');
    } else if (_data.Exhibition[_indexing][1][0].mapStyle == "googleMap") {
      /*if(commonjs.ieCheck()){
                var insertData = '<iframe src="/dealers/maps_position.html?lat=' + _data.Exhibition[_indexing][1][0].lat + '&lng=' + _data.Exhibition[_indexing][1][0].lng +  '" class="wt100" height="280px" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>';
            }else{
                var insertData = '<iframe src="' + _data.Exhibition[_indexing][1][0].mapUrl + '" width="100%" height="280px" frameborder="0" style="border:0" allowfullscreen>';
            };*/
      var insertData = '<div id="navermap" style="width:100%;height:280px;"></div>'
      _target.find('#mapInsert').html(insertData);
      var map = new naver.maps.Map('navermap', {center: new naver.maps.LatLng(_data.Exhibition[_indexing][1][0].lat, _data.Exhibition[_indexing][1][0].lng)});
      var marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(_data.Exhibition[_indexing][1][0].lat, _data.Exhibition[_indexing][1][0].lng),
        map: map,
      });
    }
    //if
  }

  /* -------------------------- --------------------------------------------- 주요 4 - 3 : 시승신청 유효 검사 후 전송 */
  function checkData() {
    var emailCheck = /^([\w\.-]+)@([a-z\d\.-]+)\.([a-z\.]{2,6})$/; // 이메일 검사
    var telCheck = /^[0-9]{3,4}$/; // 전화번호 검사
    var modelValtest = $('input:radio[name=car_group]:checked').val();
    var _month = $('#d'),
      _userName = $('#user_name'),
      _userPhone2 = $('#phone2'),
      _userPhone3 = $('#phone3'),
      _userEmail = $('#user_email'),
      _userAddr = $('#user_addr');
    if (_month.val().length == 0) {
      alert('날짜를 입력해주세요.');
      _month.focus();
      return false;
    } else if (!($('#st3_tx1').is(':checked') || $('#st3_tx2').is(':checked'))) {
      alert('요청 내용을 선택해주세요.');
      $('#st3_tx1').focus();
      return false;
    } else if (modelValtest.length == 0) {
      alert('모델을 선택해주세요.');
      return false;
    } else if (selectPlace.length == 0) {
      alert('전시장을 선택해주세요.');
      return false;
    } else if (_userName.val().length == 0) {
      alert('이름을 입력해주세요.');
      _userName.focus();
      return false;
    } else if (_userPhone2.val().length == 0) {
      alert('전화번호를 입력해주세요.');
      _userPhone2.focus();
      return false;
    } else if (_userPhone3.val().length == 0) {
      alert('전화번호를 입력해주세요.');
      _userPhone3.focus();
      return false;
    } else if (telCheck.test(_userPhone2.val()) != true) {
      alert('전화번호를 다시 확인해주세요.');
      _userPhone2.focus();
      return false;
    } else if (telCheck.test(_userPhone3.val()) != true) {
      alert('전화번호를 다시 확인해주세요.');
      _userPhone3.focus();
      return false;
    } else if (_userEmail.val().length == 0) {
      alert('이메일 주소를 입력해주세요.');
      _userEmail.focus();
      return false;
    } else if (emailCheck.test(_userEmail.val()) != true) {
      alert('이메일 형식이 올바르지 않습니다.');
      _userEmail.focus();
      return false;
    }
    ;
    /*else if (_userAddr.val().length == 0) {
            alert('거주지를 입력해주세요.');
            _userAddr.focus();
            return false;
        };*/
    var userAgentCheck = commonjs.agentCheck();
    var inforAgree = $('#driveReserved').find('.drive').find('#info_check').is(':checked');
    var userPhoneNumber = $('#phone1').val() + '-' + $('#phone2').val() + '-' + $('#phone3').val();
    var params = {
      "model": modelValtest,
      "place": selectPlace,
      "date": _month.val(),
      "time": $('#reser_time').val(),
      "requestType": selectRequestType,
      "name": _userName.val(),
      "phone": userPhoneNumber,
      "email": _userEmail.val(),
      "address": _userAddr.val(),
      "option1": $('#howtoknow').val(),
      "request_channel": userAgentCheck,
      "inforAgree": inforAgree,
      "poss_time": $('#poss_time').val(),
    };
    console.dir(params);
    $('<div id="sending"></div>').appendTo($('#driveReserved')).css({
      'position': 'fixed',
      'left': '0',
      'right': '0',
      'top': '0',
      'bottom': '0',
      'width': '100%',
      'height': '100%',
      'background-color': 'rgba(0, 0, 0, 0.7)',
      //            'filter': 'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=\'#7c000000\', endColorstr=\'#7c000000\')',
      'z-index': '10003',

    }).html('<img src="/image/loading.gif" style="width:64px;height:64px;margin-top:-32px;margin-left:-32px;position:absolute;left:50%;top:50%;">');
    //ajaxcalling(url_drivetest_form, "POST", params, function(data){
    ajaxcalling_jsonp(url_drivetest_form, "POST", params, 'jsonp', 'Callback', function (data) {
      $('#sending').remove();
      //             if(data == "result=true"){
      if (data.result) {
        $('#driveReserved').find('input').val('');
        $('#driveReserved').find('input').prop('checked', false);
        $('#driveReserved').removeClass('dt_open');
        $('#wrap').removeClass('test_popOpen');
        target2.addClass('clip_hide');
        target3.addClass('clip_hide');
        currentStep1 = false;
        currentStep2 = false;
        alert("시승신청이 완료되었습니다.");
        window.location = "/drivesuccess.aspx";
      } else {
        alert("시승신청이 실패하였습니다.");
      }
    });
  }

  /* ----------------------------------------------------------------------- (0. 메인) 셋팅 */
  var mainPage = {
    settings: function () {
      ajaxcallingJSON(url_mainContents, "GET", "", function (data) {
        $('.main_slider').viSlider_video({
          stru: data.mainslider,
          h3option: true,
          rszImgRepl: true,
          autoPlay: true,
          cut: 70,
        });
        $('.main_slide1').viSlider2({stru: data.monthlyPromotion, rszImgRepl: true});
        $('.main_slide2').viSlider2({stru: data.eventSlide, rszImgRepl: true});
        mainPage.cardMake(url_inside_story, $('.main_common.main_cont2').find('.inside_cont > ul'));
        mainPage.allnewToyotaSet(data.allnewToyota);
        $('#footer').show();
        //위 처리사항을 위해 foot도 문서 렌더링시 안나오게 해놓았기 때문
      });
    },
    allnewToyotaSet: function (data) {
      var this_data = data;
      var $wrap = $('.main_cont3');
      $wrap.find('.main_allNew > ul').empty();
      for (var i = 0; i < this_data.dataList.length; i++) {
        $('<li></li>').appendTo($wrap.find('.main_allNew > ul'))
          .html('<a href="' + this_data.dataList[i].link + '"><span class="dim"></span><div class="allNew_inner"><h3>' + this_data.dataList[i].title + '</h3><p>' + this_data.dataList[i].price + '</p><div class="allNew_dl">' + this_data.dataList[i].spec1 + '</div></div><img class="def" src="' + this_data.dataList[i].defaultImg + '" alt="' + this_data.dataList[i].title + '"></a>');
      }

      //for
      function UlwidthSet() {
        var $carLi = $wrap.find('.main_allNew').find('>ul').find('li');
        var ulWidth = ($carLi.eq(0).width() + 1) * $carLi.length;
        $wrap.find('.main_allNew').find('>ul').width(ulWidth);
        var img = new Image();
        img.onload = function () {
          ulWidth = ($carLi.eq(0).width() + 1) * $carLi.length;
          $wrap.find('.main_allNew').find('>ul').width(ulWidth);
          //                    $('.footer_ect .fe_icon').append('.'+ ulWidth);
        };
        img.src = $carLi.eq(0).find('img.def').attr('src');
      }

      //UlwidthSet
      $(window).bind("pageshow", function (event) {
        if (event.originalEvent.persisted) {
          window.location.reload()
        }
      });
      UlwidthSet();
      resizeModule(function () {
        UlwidthSet();
      });
    },
    cardMake: function (jsonURL, target) {
      //ajax 파일 경로, 파싱할 영역
      var _target = target,
        currentTotal = 0,
        moreVal = 10,
        loading = false,
        params = {},
        _data;

      var $moreBtn = $('.more_btn').find('.a');
      ajaxcallingJSON(jsonURL, "GET", params, function (data) {
        _data = data.story;
        loadContents();

      });
      var fromListBtn = false;
      var _tNum = tNum,
        _cNum = cNum,
        endNum;

      function addElement() {
        var i = currentTotal;
        var AddClass = '',
          AddElement = '';
        var imgTag = '',
          AddComment = '';
        var linkTarget = '';
        if (currentTotal < _data.dataList.length) {
          //지금까지 갯수가 전체 갯수를 넘지 않으면 불러오기
          if (endNum > _data.dataList.length) {
            var x = moreVal - (endNum - _data.dataList.length);
            endNum = currentTotal + x;
            $('.more_btn').hide();
          }
        }
        //토요타 스토리

        if (_data.dataList[i].sns_channel == "facebook") {
          var iconImg = '/image/only_main_storyIcon4.jpg';
          var linkTarget = 'target = "_blank"';
        } else if (_data.dataList[i].sns_channel == "youtube") {
          var iconImg = '/image/only_main_storyIcon2.jpg';
          var linkTarget = 'target = "_blank"';
        } else if (_data.dataList[i].sns_channel == "instagram") {
          var iconImg = '/image/only_main_storyIcon3.jpg';
          var linkTarget = 'target = "_blank"';
        } else if (_data.dataList[i].sns_channel == "naverblog") {
          var iconImg = '/image/only_main_storyIcon1.jpg';
          var linkTarget = 'target = "_blank"';
        } else if (_data.dataList[i].sns_channel == "toyota") {
          var iconImg = '/image/only_main_storyIcon6.jpg';

        }
        ;
        AddElement = '<span><a href="' + _data.dataList[i].link + '" ' + linkTarget + '><img src="' + iconImg + '" alt=""></a></span>';
        var imgVisible = false;
        if (!(_data.dataList[i].img == undefined || _data.dataList[i].img == null || _data.dataList[i].img == '')) {
          var imgTag = '<div class="inside_img"><img src="' + _data.dataList[i].img + '" alt=""></div>';
          imgVisible = true;
        }
        //이미지 없으면 공란으로
        AddComment = '<p>' + _data.dataList[i].comment + '</p>';
        $('<li class="liNum' + i + '"></li>').appendTo(_target).html('<div class="inside_contInner"><a href="#" data-href="' + _data.dataList[i].link + '" class="sh">' + imgTag + '<h5>' + _data.dataList[i].title + '</h5>' + AddComment + '<div class="dim"></div></a></div>').addClass(AddClass).css('opacity', 0);

        //각 데이터 요소 생성

        var $targetLi = _target.find('>li').eq(i);
        $targetLi.find('>.inside_contInner .inside_img').append(AddElement);
        $targetLi.find('>.inside_contInner > a').click(function (e) {
          var $this = $(this);
          if (!$this.parent().parent().hasClass('active')) {
            $this.parent().parent().addClass('active').siblings().removeClass('active');
          } else {
            window.location = $this.attr('data-href');
          }
          commonjs.eventClick(e);
        })
        //택 넣기)
        var img = new Image();
        img.onload = function () {
          loadedSet();
        };
        img.onerror = function () {
          loadedSet();
          target.find('.liNum' + i).find('.inside_img').remove();
        }
        img.src = target.find('.liNum' + i).find('.inside_img > img').attr('src');

        if (_cNum > -1 && !fromListBtn) {
          //상세페이지에서 목록 보기 버튼 클릭하여 이동해서 목록오면 변수 담기기 때문에 전체 게시물 - 지금 게시물 순번 해서 펼쳐질 것임
          //그러면서 해당 위치로 이동
          fromListBtn = true;
          if (endNum > moreVal) {
            commonjs.scrollToBody($(window).height() - $('#header').height(), 400);
          }
          //if
        }

        function loadedSet() {
          //                    $('.main_common.main_cont2 > div.inside_cont').viCardLayout();
          target.find('.liNum' + i).stop().animate({'opacity': 1}, 800);
          currentTotal = currentTotal + 1;
          if (currentTotal < endNum) {
            addElement();
          } else {
            endNum = currentTotal + moreVal;
            loading = false;
            //                        console.log('완료');
            if (currentTotal !== _data.dataList.length) {
              $('.more_btn').show();
            } else {
              $('.more_btn').hide();
            }
          }
        }

        //loadedSet
      };

      // 엘리먼트 만들기
      function loadContents() {
        endNum = currentTotal + moreVal;
        if (_cNum > -1 && !fromListBtn) {
          //변수담은 페이지
          endNum = _cNum * moreVal;
          if (endNum < moreVal) {
            endNum = moreVal;
            //변수담은 페이지에서 펼쳐질 갯수가 more보다 작으면 그냥 more로 보여줘야함
          } else if (endNum > _data.dataList.length) {
            // 변수 6 * 5 = 30 이지만 28번까지밖에 없다면
            //                        console.log("목록번호가 높다")
            endNum = _data.dataList.length;
            $('.more_btn').remove();
          }
        }
        addElement();
      }

      //loadContents
      $moreBtn.on('click', function (e) {
        window.location = '/inside/story.aspx';
        commonjs.eventClick(e);
      });
      //더보기 버튼
    },
  }
  //mainPage

  /* ----------------------------------------------------------------------- (2. 모델) 셋팅 */
  var models = {
    modelTemp: function (MName) {
      var params = {"modelName": MName}
      var jsonUrl = url_models[depth2];
      ajaxcallingJSON(jsonUrl, "GET", params, function (data) {
        var _data = data.model;
        window.__Mkslider = Mkslider;
        window.__specsHtml = specsHtml;
        window.__modelData = _data;
        mainvisualFnc(_data);
        // 메인 비주얼 생성 함수
        if (depth2 != 14) {
          if (_data.dataList[0].keyVisual) { // 키 비주얼 생성 함수
            keyvisualFnc(_data.dataList[0].keyVisual);
          }

          if ($('#model').find('.mark').length > 0) {
            $('#model').find('li').find('.mark').closest('li').append($('#model').find('li').find('.mark').clone());
          }
        }

        if (_data.dataList[0].slider) { // Exterior , Interior , Features 파트의 슬라이드 생성
          Mkslider(_data.dataList[0].slider);
        }

        if (_data.dataList[0].gallery) { // 갤러리 슬라이드 생성
          $('#gallery .main_slider').viSlider2({
            stru: _data.dataList[0].gallery[0],
            rszImgRepl: true,
            cut: 70,
          });
        }

        if (_data.dataList[0].colors) { // 컬러 생성 함수
          colorsSelect(_data.dataList[0].colors);
        }

        if (_data.dataList[0].specsHtml) { // 스펙 생성 함수
          specsHtml(_data.dataList[0].specsHtml);
        }

        if (window.__modelInitialized) window.__modelInitialized();
      });

      /* ----------------------------------------------------------------------- (2. 모델 - 1) 메인 비주얼 */
      function mainvisualFnc(data) {
        var _data = data;

        function rszMV() {
          $('.sub_visualModel').css({
            'background': '#e5e5e5 url("' + getImage().url + '") 50% 50% no-repeat',
            'background-size': 'cover',
            //                        'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + getImage().url + '", sizingMethod="scale")'
          });
        }

        function getImage() {
          if (commonjs.isMobile()) {
            return {"top": "40px", "url": _data.dataList[0].m_mainVisual};
          } else {
            return {"top": "80px", "url": _data.dataList[0].mainVisual};
          }
        }

        //getImage
        rszMV();
        resizeModule(function () {
          rszMV();
        });
      }

      /* ----------------------------------------------------------------------- (2. 모델 - 2) 키 비주얼 */
      function keyvisualFnc(data) {
        var _data = data;
        var isMobile = -1;
        $.each(_data, function (index) {
          if (_data[index].textPositionX == 'left') {
            var addClassX = 'model_textLeft';
          } else {
            var addClassX = 'model_textRight';
          }
          //좌우 클래스
          if (_data[index].textPositionY == 'top') {
            var addClassY = 'model_textTop';
          } else {
            var addClassY = 'model_textBot';
          }
          //좌우 클래스
          if (_data[index].mPositionY == 'top') {
            addClassY += ' mobile_textTop';
          } else if (_data[index].mPositionY == 'bottom') {
            addClassY += ' mobile_textBot';
          } else if (_data[index].mPositionY == 'toggle') {
            addClassY += ' mobile_textToggle';
          }
          $('<li class="model' + (index + 1) + '"></li>').appendTo($('#model').find('ul')).html('<div class="' + addClassY + ' ' + addClassX + '"><div class="dlt"><h4>' + _data[index].title + '</h4><p>' + _data[index].comment + '</p><s onclick="$(this.parentNode.parentNode).addClass(\'show-detail\')">내용보기 ></s></div><span class="dim"><img src="/image/mobile_text_toggle_x.png" class="toggle-x" onclick="$(this.parentNode.parentNode).removeClass(\'show-detail\')"></span></div>').addClass(_data[index].textColorClass).height($('.sub_visualModel').height());
        });

        function rszKV() {
          if (isMobile == commonjs.isMobile()) return;
          isMobile = commonjs.isMobile();
          $('#model').find('ul>li').each(function (index) {
            var _this = $(this);
            _this.css({
              'background': 'url("' + getImage(index) + '") center center no-repeat',
              'background-size': 'cover',
              'height': $('.sub_visualModel').height(),
            });
          });
        }//
        rszKV();

        function getImage(nums) {
          if (_data.length > nums) {
            if (isMobile) {
              return _data[nums].m_img;
            } else {
              return _data[nums].img;
            }
          }

        }

        //getImage

        resizeModule(function () {
          rszKV();
        });

      }

      /* ----------------------------------------------------------------------- (2. 모델 - 3) Exterior, Interior, Features 슬라이드 */
      function Mkslider(data) {
        var _data = data;
        $('<div class="slide_wrap"></div>').appendTo($('#exterior')).viSlider({
          stru: _data[0].exterior[0].tabmenu,
          subtitle: true,
          arrow: false,
          tabmenu: false,
          rszImgRepl: true,
          cut: _data[0].exterior[0].cut == undefined ? 70 : _data[0].exterior[0].cut,
        });
        $('<div class="slide_wrap"></div>').appendTo($('#interior')).viSlider({
          stru: _data[1].interior[0].tabmenu,
          subtitle: true,
          arrow: false,
          tabmenu: false,
          rszImgRepl: true,
          cut: _data[1].interior[0].cut == undefined ? 70 : _data[1].interior[0].cut,
        });
        $('<div class="slide_wrap"></div>').appendTo($('#features')).viSlider({
          stru: _data[2].features[0].tabmenu,
          subtitle: true,
          arrow: false,
          tabmenu: false,
          rszImgRepl: true,
          cut: _data[2].features[0].cut == undefined ? 70 : _data[2].features[0].cut,
        });
      }

      /* ----------------------------------------------------------------------- (2. 모델 - 4) 컬러 */
      function colorsSelect(data) {
        var _data = data,
          _target = $("#colors").find('div.car'),
          _imgSq = 0;
        for (var i = 0; i < _data.length; i++) {
          var stroke = "";
          if (_data[i].strokeOption) stroke = "border:1px solid #aaa;";
          $('<li></li>').appendTo(_target.find('.car_listBox').find('>ul')).html('<a href="#" style="background-color: ' + _data[i].colorCode + ';' + stroke + '"></a>');
        }
        _target.find('.car_img').css('position', 'relative');
        _target.find('.car_img').find('img.default').attr('src', _data[0].carImg); //디폴트 이미지
        _target.find('.car_listBox').css({'z-index': 2}).find('>p').html(_data[0].colorName); //디폴트 텍스트
        _target.find('.car_img').find('img.change').css({'position': 'absolute'});


        _target.find('.car_listBox').find('>ul').find('li').each(function (index) {
          $(this).on('click', function (e) {
            $(this).addClass('current').siblings().removeClass('current');
            //                        _target.find('.car_img').find('img.default').css('opacity',0);
            _target.find('.car_listBox').find('>p').html(_data[index].colorName);
            _imgSq = (_imgSq + 1) % 2;
            _target.find('.car_img').find('img.eq' + (_imgSq + 1) % 2).stop().css({'z-index': '0'});
            _target.find('.car_img').find('img.eq' + _imgSq).attr('src', _data[index].carImg).stop().css({
              'z-index': '1',
              'opacity': 0,
            }).animate({'opacity': 1}, 600, 'easeOutQuint');
            commonjs.eventClick(e);
          });
          if (index == 0) $(this).addClass('current');

        });
      }

      /* ----------------------------------------------------------------------- (2. 모델 - 5) 스펙 */
      function specsHtml(data) {
        var _data = data,
          current = 0;

        function makeSpec(num) {
          $('#specs').find('div.specs').remove();
          $(_data[num + 1]).appendTo($('#specs'));
          $('#specs').find('.specs').css('opacity', '0').end().find('.specs_header').find('.sh_img').find('>img').attr('src', _data[num].specImg);
          var printPrice = "";
          $('#specs').find('.specs_headerInner').find('ul.prices').empty();
          for (var j = 0; j < _data[num].modelPrice.length; j++) {
            printPrice += '<li>' + _data[num].modelPrice[j].modelName + '<span>' + _data[num].modelPrice[j].price + '</span>' + '</li>';
            $('<li></li>').appendTo($('#specs').find('.specs_headerInner').find('ul.prices')).html(printPrice);
            //가격 추가
          }
          ;
          //for
          $('#specs').find('.specs').stop().animate({opacity: 1}, 600);
        }

        //fnc
        makeSpec(current);
        if (_data.length > 2) {
          //2개이상일 때

          for (var i = 0; i < Math.floor(_data.length / 2); i++) {
            //총 갯수
            var selectSpec = i * 2;
            $('<li></li>').appendTo($('#specs').find('.specs_headerInner').find('div.model_tab >ul')).html('<a href="#none">' + _data[selectSpec].modelPrice[0].modelName + '</a>');

          }
          $('#specs').find('.specs_headerInner').find('div.model_tab >ul').find('>li').each(function (index) {
            var _thisLi = $(this);
            var selectSpec = index * 2;
            if (index == current) _thisLi.addClass('current');
            _thisLi.on('click', function (e) {
              _thisLi.addClass('current').siblings().removeClass('current');
              makeSpec(selectSpec);
              commonjs.eventClick(e);
            });
            //click
          });
          //
        }
        //if
      }

      resizeModule(function () {
        // console.log("sub_visual")
        // console.log($('.sub_visual'));
        // console.log($('.sub_visual').height());
        $('#model').find('ul').find('li').height($('.sub_visual').height());
      });
    },
  }
  //Model Page

  var subPage = {
    settings: function () {
      var $logo = $('#header').find('h1');
      $('.sub_visual').css({backgroundSize: "cover"});
      $('.history').css({backgroundSize: "cover"});
      $('.sub_contText.acu').css({backgroundSize: "cover"});
      if (depth1 == 99 || depth1 == 98 || (depth1 == 0 && depth2 == 2 && depth3 == 1)) {
        $logo.addClass('close');
        logoanimation('close');
      }
      if (depth1 == 0) {
        //----------------------------------- 1. toyota
        if (depth2 == 0) {
          //----------------------------------- 1-1. toyota - company
          subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설정들
          subPage.historyUi(); // 연혁 부분의 인터렉션
          subPage.socialCnt(); // 사회공헌에 외부 데이터
          subPage.newsCnt();
          subPage.mkLocation();
          $('.contribution').css({'min-height': '1084px'})
        } else if (depth2 == 1) {
          //----------------------------------- 1-2. toyota - service
          subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설정들
          subPage.serviceSmart(); //서비스 스마트 - 슬라이딩
          subPage.mkLocation();
          if (depth3 == 2) {
            //부품가격 페이지일 경우
            subPage.servicePrice();
          } else if (depth3 == 1) {
            //서비스 프로그램일 경우
            console.log('d')
            $('.sub_contText.s_tire .sm_tab').find('ul>li').each(function (index) {
              var $this = $(this);
              $this.find('>a').on('click', function (e) {
                $this.addClass('current').siblings().removeClass('current');
                $('.tire_check').find('.tc_item').eq(index).addClass('view_on').siblings().removeClass('view_on');
                commonjs.eventClick(e);
              })
            })
          }
        } else if (depth2 == 2) {
          //----------------------------------- 1-3. toyota - inside
          $('.inside_header > h4').css({'font-family': 'ng_bold'});
          //목록 상단 타이틀 한글로 맞춰달라고 해서 폰트 변경함
          subPage.mkLocation();
          if (depth3 == 2) {
            $('#newsletterjoinBtn').on('click', function (e) {
              $('#wrap').addClass('test_popOpen');
              $('#newsletterJoin').addClass('dt_open');
              commonjs.eventClick(e);
            });
          }
          if (depth3 == 1) {
            //이달의 혜택
            var target = $('.benefit_wrap');
            //                        target.css({
            //                            'max-width' : '960px',
            //                            'margin' : 'auto'
            //                        });
            $('.print > a').on('click', function (e) {
              var print = '',
                printImgHeight = 'auto', // 세로로 긴 이미지의 경우는 auto  한장에 모두 출력되어야 한다면 100% 입력
                printcommonCss = '/css/basic.css',
                printCss = '/css/style.css';
              var print = '<img src="' + $(this).parent().attr("data-print") + '" alt="" width="100%"/>';
              var printrotate;
              if ($(this).parent().attr("data-rotate") === "true") printrotate = true;
              e.preventDefault();
              $.jPrintAreaNew = function (el) {
                var iframe = document.createElement('iframe');
                var doc = null;
                $(iframe).attr('style', 'position:absolute;width:0px;height:0px;left:-500px;top:-500px;border:none;');
                iframe.src = 'about:blank';
                document.body.appendChild(iframe);
                doc = iframe.contentWindow.document;
                var links = window.document.getElementsByTagName('link');
                iframe.contentWindow.document.open("text/html", "replace");
                iframe.contentWindow.document.onreadystatechange = function () {
                  if (iframe.contentWindow.document.readyState === "complete") {
                    iframe.contentWindow.document.body.onafterprint = function () {
                      iframe.removeNode(true);
                    }
                    iframe.contentWindow.document.body.focus();
                    iframe.contentWindow.print();
                  }
                }
                doc.write('<link rel="stylesheet" type="text/css" href="' + printcommonCss + '" />');
                doc.write('<link rel="stylesheet" type="text/css" href="' + printCss + '" />');
                if (printrotate) {
                  //                                        doc.write('<style type="text/css" media="print">@page{size: landscape;margin: 5mm;}html,body,div {display:block;width:100%;height:auto;margin:0;padding:0};}</style>');
                  doc.write('<style type="text/css">@page{margin: 5mm;};html,body,div {display:block;height:100%;};img{height:100%;width:auto;};}</style>');
                } else {
                  doc.write('<style type="text/css">@page{margin: 5mm;};html,body,div {display:block;width:100%;height:100%;};}</style>');
                }
                doc.write('<div class="printClass">' + print + '</div>');
                doc.close();

              }('#printArea');

              commonjs.eventClick(e);

            });
          } else if (depth3 == 0) {
            //이달의 혜택외에는 카드레이아웃이라서
            subPage.mkCard(depth3); //카드 레이아웃 만드는 스크립트
            subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설
          } else {
            //이달의 혜택외에는 카드레이아웃이라서
            subPage.mkCard(depth3); //카드 레이아웃 만드는 스크립트
            subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설정들
          }
          //if
        }
        //if
      } else if (depth1 == 1) {
        //----------------------------------- 2. MODELS
        subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설정들
        models.modelTemp(modelName); //모델 템플릿 만들기
      } else if (depth1 == 2) {
        //----------------------------------- 3. SMART HYBRID
        subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설정들
        subPage.hybridSet();
        subPage.mkLocation();
      } else if (depth1 == 3) {
        //----------------------------------- 4. DEALERS
        if (depth2 == 0) {
          //딜러 인덱스 페이지 (게이트)
          subPage.mkDealersSet();
          subPage.mkLocation();
          $('#container').show();
        } else if (depth2 == 1) {
          //딜러사 각 개별 페이지
          subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설정들
          subPage.mkDealersPage();
        } else if (depth2 == 2) {
          //추가로 작업되는 딜러 페이지
          subPage.mkDealersSet4();
          subPage.mkLocation();
          $('#container').show();
        }
      } else if (depth1 == 5) {
        //----------------------------------- 5. CAMPAIGN
        subPage.mkTop(); //상단 비주얼에 배경 페럴렉스를 위한 설정들
      } else if (depth1 == 6) {
        //----------------------------------- X. 유틸리티
        if (depth2 == 0 || depth2 == 1) {
          //이용약관
          subPage.termsCtrl();
        } else if (depth2 == 2) {
          //사이트맵 페이지라면 링크 제작 들어감
          //                    subPage.mkSitemap();
          $('.opendrive').on('click', function (e) {
            $nav.find('#openDrive').click();
            commonjs.eventClick(e);
          });
        } else if (depth2 == 300) {
          subPage.contactform();
        }
      } else if (depth1 == 99 || depth1 == 98) {
        //----------------------------------- X. 디테일 페이지
        if (depth1 == 99 && depth2 == 0 && depth3 == 3) subPage.detailPageSet(pagetype); //컴패니 - 사회공헌 - json으로 만들어서 호출함
        if (depth1 == 99 && depth2 == 2) subPage.inside_detailPageSet2(pagetype); //토요타 - 인사이드 - 디테일 페이지
        subPage.mkLocation();
        if (depth1 == 99 || depth1 == 98) {
          //컴패니 - 보도자료 상세 / 인사이드 각 디테일 페이지
          var backspaceIsPressed = false;
          var backLink = '';
          var backVal = cNum + '&sval=' + sval;
          if (keyword.length > 0) backVal += '&keyword=' + keyword;
          //                    console.log(backVal)
          if (backVal == -1) backVal = '';
          if (pagetype == "news") backLink = "/company/company.aspx?cnum=" + backVal;
          if (pagetype == "notice") backLink = "/inside/notice.aspx?cnum=" + backVal;
          if (pagetype == "gallery") backLink = "/inside/gallery.aspx?cnum=" + backVal;
          if (pagetype == "story") backLink = "/inside/story.aspx?cnum=" + backVal;
          if (pagetype == "style") backLink = "/inside/style.aspx?cnum=" + backVal;
          if (pagetype == "newsletter") backLink = "/inside/newsletter.aspx?cnum=" + backVal;
          if (pagetype == "event") backLink = "/inside/event.aspx?cnum=" + backVal;
          if (pagetype == "contribution") backLink = "/company/company.aspx#contribution";

          $(document).keydown(function (event) {
            //                        console.log("키코드 " + event.which);
            if (event.which == 8) {
              backspaceIsPressed = true;
              window.location = backLink;
              return false;
            }
          })
          $(document).keyup(function (event) {
            if (event.which == 8) {
              backspaceIsPressed = false;
              window.location = backLink;
              return false;
            }
          })
          $(window).on('beforeunload', function () {
            if (backspaceIsPressed) {
              backspaceIsPressed = false;
              window.location = backLink;
              //                            return false;
            }
          })
        }
        //if
      }
      //if
      subPage.lnbCtrl();
      subPage.scollEvent();
      if (!(depth1 == 3 && depth2 == 0)) $('.sub_wrap').prepend('<div id="vrDiv2" style="height:' + $('.lnb_title').height() + 'px"></div>');
      $('#footer').show();
    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 1. 컴패니) 연혁 만들기 */
    historyUi: function () {
      var $sub_contInner = $('.sub_contInner'),
        $history = $sub_contInner.find('.history'),
        _posHistory,
        _current = 0;
      resizeModule(function () {
        motionHistory(_current);
      });

      function motionHistory(num) {
        var _targetY = $('.history_main').find('>ul');
        $('.history_main').find('>ul').stop().animate({
          'top': -_targetY.find('>li.point').eq(num).position().top,
        }, 600, 'easeInOutQuint');
      }

      $history.find('ul').find('li').each(function (index) {
        var _this = $(this);
        _this.find('a').on('click', function (e) {
          _this.siblings().removeClass('current');
          _this.addClass('current');
          _current = index;
          motionHistory(_current);
          commonjs.eventClick(e);
        });

      });
      //each
    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 1. 컴패니) 사회 공헌 */
    socialCnt: function () {
      var moreVal = 6, // 더보기 누르면 나오는 갯수
        currentTotal = 0,
        _data,
        loading = false;
      var $contribution_wrap = $('.contribution_wrap'),
        target = $contribution_wrap.find('.contribution').find('ul'),
        $moreBtn = $('.more_btn').find('>a');
      ajaxcallingJSON(url_company_contribution, "GET", '', callback);

      function callback(data) {
        _data = data.contribution;
        target.empty();
        loadContents();
      };

      //callback
      function loadContents() {
        var startNum = currentTotal,
          endNum = currentTotal + moreVal;

        if (currentTotal < _data.dataList.length) {
          //지금까지 갯수가 전체 갯수를 넘지 않으면 불러오기
          if (endNum > _data.dataList.length) {
            var x = moreVal - (endNum - _data.dataList.length);
            endNum = currentTotal + x;
          }

          for (var i = startNum; i < endNum; i++) {
            var strings = _data.dataList[i].contents.substring(0, 80) + '...';
            $('<li></li>').appendTo(target).html('<div class="contribution_inner"><h5><a href="' + _data.dataList[i].link + '"><span></span>' + _data.dataList[i].category + '</a></h5><a href="' + _data.dataList[i].link + '"><img src="' + _data.dataList[i].img + '" alt="" class="wt100"></a><dl><dt><a href="' + _data.dataList[i].link + '">' + _data.dataList[i].maintitle + '</a></dt><dd><a href="' + _data.dataList[i].link + '">' + _data.dataList[i].date + '</a></dd></dl><div class="cmt"><p><a href="' + _data.dataList[i].link + '">' + strings + '</a></p><span class="more"><a href="' + _data.dataList[i].link + '">MORE</a></span></div></div>');
            currentTotal = currentTotal + 1;
            if (i == endNum - 1) {
              loading = false;
              if (currentTotal !== _data.dataList.length) $('.more_btn').show();
            }
            //if
          }
          //for
        }
      }

      $moreBtn.on('click', function (e) {
        if (!loading) {
          moreVal = 6;
          $('.more_btn').hide();
          loading = true;
          loadContents();
        }
        commonjs.eventClick(e);
      });
    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 1. 컴패니) 사회 공헌 - 디테일 페이지 */
    detailPageSet: function (Ptype) {
      if (Ptype == "contribution") {
        var jsonUrl = url_company_contribution_detail;
      } else if (Ptype == "news") {
        var jsonUrl = url_compay_news;
      }
      var contri_cNum = catId,
        contri_orderNum = orderNum;
      console.log('cnum ' + contri_cNum);
      console.log('ordnum ' + contri_orderNum);
      ajaxcallingJSON(jsonUrl, "GET", '', function (data) {
        var _data = data.detail;
        var _targetH = $('.it_innerHead');
        var _targetB = $('.it_innerCont');
        var _targetS = $('.it_conInner2');
        if (Ptype == "contribution") {
          if (_data[contri_cNum].category.length > 0) _targetH.find('>h4').html(_data[contri_cNum].category);
          for (var i = 0; i < _data[contri_cNum].list.length; i++) {
            if (i == _data[contri_cNum].list.length - 1) {
              var addClass = 'no_border';
            } else {
              var addClass = '';
            }
            $('<li class="' + addClass + '"></li>').appendTo(_targetH.find('.ctr_list > ul')).html('<a href="#">' + _data[contri_cNum].list[i].maintitle + '</a>');

          }
          //탭같은 제목 for
          _targetH.find('.ctr_list > a').text(_data[contri_cNum].list[contri_orderNum].maintitle).on('click', function (e) {
            _targetH.find('.ctr_list > ul').toggleClass('on');
            commonjs.eventClick(e);
          }); //모바일 상단 메뉴 클릭
          _targetH.find('.ctr_list > ul').find('> li').each(function (index) {
            var _thisLi = $(this);
            if (index == contri_orderNum) _thisLi.addClass('current');
            _thisLi.on('click', function (e) {
              _thisLi.addClass('current').siblings().removeClass('current');
              _targetH.find('.ctr_list > ul').removeClass('on');
              _targetH.find('.ctr_list > a').text(_data[contri_cNum].list[index].maintitle);
              contri_orderNum = index;
              mkBody();
              commonjs.eventClick(e);
            });
          });

        } else {
          if (_data[0].article.maintitle.length > 0) _targetH.find('>h4').html(_data[0].article.maintitle);
          if (_data[0].article.lang == "kor") _targetH.find('>h4').css({'font-family': 'ng_bold'});
          if (_data[0].article.subtitle.length > 0) _targetH.find('>p').html(_data[0].article.subtitle);
          if (_data[0].article.title.length > 0) _targetB.find('h5').html(_data[0].article.title);
          if (_data[0].article.date.length > 0) _targetB.find('li.date').html(_data[0].article.date);
          if (_data[0].article.view.length > 0) _targetB.find('li.view > span').html(_data[0].article.view);
          if (_data[0].article.contents.length > 0) _targetB.find('div.contents').html(_data[0].article.contents);
        }
        ;

        //if
        function mkBody() {
          if (Ptype == "gallery") {
            //갤러리 타입 (Img : 이미지, Video : 비디오, Wallpaper : 웰페이퍼)
            $('.size_list').hide();
            if (_data[0].article.type == "Img") {
              if (_data[0].article.src.length > 0) _targetB.find('div.it_imgBox').html('<img src="' + _data[0].article.src + '" alt="" class="wt100">');
              $('.size_list.download').show().find('>ul >li').each(function (index) {
                var _this = $(this);
                _this.find('>a').attr('href', _data[5].imgDownloadLink[index]).on('click', function (e) {
                  //                                        commonjs.eventClick(e);
                });
              });

            } else if (_data[0].article.type == "Video") {
              if (_data[0].article.src.length > 0) _targetB.find('div.it_imgBox').html('<iframe src="' + _data[0].article.src + '" alt="" class="wt100" height="344px" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="">');

            } else if (_data[0].article.type == "Wallpaper") {
              if (_data[0].article.src.length > 0) _targetB.find('div.it_imgBox').html('<img src="' + _data[0].article.src + '" alt="" class="wt100">');
              $('.size_list.wallpaper').show().find('>ul >li').each(function (index) {
                var _this = $(this);
                _this.find('>a').attr('href', _data[4].wallpaperLink[index]).on('click', function (e) {
                  //                                        commonjs.eventClick(e);
                });
              });
            }
            //if
          } else if (Ptype == "contribution") {
            var loadImg = new Image();
            loadImg.src = _data[contri_cNum].article[contri_orderNum].img;
            loadImg.onload = function () {
              _targetB.find('div.it_imgBox').html('<img src="' + loadImg.src + '" alt="" class="wt100">');
            };
            //onload
            _targetB.find('.it_textBox h5').empty().html(_data[contri_cNum].article[contri_orderNum].title);
            _targetB.find('.it_textBox .contents').empty().html(_data[contri_cNum].article[contri_orderNum].contents);
          } else {
            if (_data[0].article.img.length > 0) _targetB.find('div.it_imgBox').html('<img src="' + _data[0].article.img + '" alt="" class="wt100">');
          }
        }

        mkBody();
        //현재 본문
        if (Ptype == "contribution") {
          if (_data[2].listButton.length > 0) _targetS.find('a#listBtn').attr('href', _data[2].listButton);
        } else {
          if (_data[1].prevarticle.maintitle.length > 0) _targetS.find('li.view_prev div.it_wayBox').find('>dl>dt').html(_data[1].prevarticle.maintitle);
          if (_data[1].prevarticle.date.length > 0) _targetS.find('li.view_prev div.it_wayBox').find('>h5').html(_data[1].prevarticle.date);
          if (_data[1].prevarticle.contents.length > 0) _targetS.find('li.view_prev div.it_wayBox').find('>dl>dd').html(_data[1].prevarticle.contents);
          if (_data[1].prevarticle.link.length > 0) _targetS.find('li.view_prev').find('>a').attr('href', _data[1].prevarticle.link);
          //prev
          if (_data[2].nextarticle.maintitle.length > 0) _targetS.find('li.view_next div.it_wayBox').find('>dl>dt').html(_data[2].nextarticle.maintitle);
          if (_data[2].nextarticle.date.length > 0) _targetS.find('li.view_next div.it_wayBox').find('>h5').html(_data[2].nextarticle.date);
          if (_data[2].nextarticle.contents.length > 0) _targetS.find('li.view_next div.it_wayBox').find('>dl>dd').html(_data[2].nextarticle.contents);
          if (_data[2].nextarticle.link.length > 0) _targetS.find('li.view_next').find('>a').attr('href', _data[2].nextarticle.link);
          //next
          if (_data[3].listButton.length > 0) _targetS.find('a#listBtn').attr('href', _data[3].listButton);
        }
        if (Ptype == "event") {
          if (_data[4].eventResultLink.length > 0) _targetB.find('a#eventResultBtn').show().attr('href', _data[4].eventResultLink);
          //당첨자 발표 링크
        }

      });
    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 1. 컴패니) 보도 자료 */
    newsCnt: function () {
      var perPage = 5, // 한페이지당 보이는 갯수
        _data,
        loading = false;
      var $news_table = $('.news_table'),
        $list = $news_table.find('ul.list'),
        $new_conWrap = $('.new_conWrap'),
        $recent = $new_conWrap.find('.recent'),
        $news_number = $news_table.find('.news_number'),
        listTotal,
        currentPageNum;
      if (cNum == -1) {
        currentPageNum = 1;
      } else {
        currentPageNum = cNum;
      }
      ;
      var params = {"Pnum": currentPageNum};
      ajaxcallingJSON(url_compay_news_list, "GET", params, callback);

      function callback(data) {
        _data = data.news;
        listTotal = _data.dataList.length;
        loadContents();
        mkpageList();
        $news_number.find('>a').show();
      }

      $news_number.find('>a').hide();
      $news_number.find('a.prev').on('click', function (e) {
        if (currentPageNum > 1) {
          currentPageNum--;
          params = {"Pnum": currentPageNum};
          ajaxcallingJSON(url_compay_news_list, "GET", params, callback);
        }
        commonjs.eventClick(e);
      });
      $news_number.find('a.next').on('click', function (e) {
        if (currentPageNum < Number(_data.totalPage)) {
          currentPageNum++;
          params = {"Pnum": currentPageNum};
          ajaxcallingJSON(url_compay_news_list, "GET", params, callback);
        }
        commonjs.eventClick(e);
      });

      //            loadAjax();
      function mkpageList() {
        perPage = 5; //목록에 페이지 넘버 5개씩
        var totalPage = _data.totalPage;

        $news_number.find('ul').empty(); //일단 초기화 하고
        var startNum = Math.floor((currentPageNum - 1) / perPage) * perPage;
        var activePage = (currentPageNum - 1);
        //                console.log("activePage " + activePage)
        var endNum = startNum + perPage;
        if (endNum > totalPage) endNum = totalPage;
        for (var i = startNum; i < endNum; i++) {
          if (i == activePage) {
            var addClass = 'active';
          } else {
            var addClass = '';
          }
          $('<li class="' + addClass + '"><a href="#">' + (i + 1) + '</a></li>').appendTo($news_number.find('ul')).find('a').on('click', function (e) {
            currentPageNum = $(this).parent().index() + startNum + 1;
            //                        console.log("페이지 번호 클릭 " + currentPageNum);
            params = {"Pnum": currentPageNum};
            ajaxcallingJSON(url_compay_news_list, "GET", params, callback);
            //loadAjax();
            commonjs.eventClick(e);
            //                        console.log($(this).attr('href'))
          });
        }
        //for
        if (cNum !== -1) {
          $(window).load(function () {
            commonjs.scrollToBody($('#news').offset().top - $('#header').height(), 100);
            //                        commonjs.scrollToBody($('#contribution').offset().top + 1084 - $('#header').height() ,100);
          });
        }
        //해당 위치로 스크롤링
      }

      //mkpageList
      //resize
      function loadContents() {
        $list.empty();
        $recent.empty();
        $.each(_data.dataList, function (index) {
          if (index < 3 && currentPageNum == 1) {
            $('<li></li>').appendTo($recent).html('<div class="recent_inner"><span><img src="/image/new_icon.png" alt=""></span><div class="recent_img"><a href="' + _data.dataList[index].link + '"><img src="' + _data.dataList[index].thumbnail_img + '" alt=""></a></div><a href="' + _data.dataList[index].link + '"><h5 class="' + _data.dataList[index].title_lan + '">' + _data.dataList[index].title + '</a></h5><p><a href="' + _data.dataList[index].link + '">' + _data.dataList[index].comment + '</a></p><span class="more"><a href="' + _data.dataList[index].link + '">MORE</a></span></div>');
          }
          $('<li></li>').appendTo($list).html('<p>' + _data.dataList[index].Number + '</p><dl><dt><a href="' + _data.dataList[index].link + '">' + _data.dataList[index].title + '</a></dt><dd>' + _data.dataList[index].date + '</dd><dd class="hit">' + _data.dataList[index].hit + '</dd></dl>');
        });
        //each
        rsz();
      }

      resizeModule(function () {
        rsz();
      });

      function rsz() {
        var maxEq = 3;
        if (listTotal < 3) maxEq = listTotal;
        if (!commonjs.isMobile() && currentPageNum == 1) {
          //최근 게시물이 나오면서 목록에서 3개가 빠짐
          for (var i = 0; i < 3; i++) {
            $list.find('li').eq(i).hide();
          }
        } else {
          //모바일에서는 최근 게시물 3개가 없는 구조니까 다 나와야함
          for (var i = 0; i < 3; i++) {
            $list.find('li').eq(i).show();
          }
        }
        //if
      }

      //rsz
    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 2. 서비스) 부품 가격 인터렉션 */
    servicePrice: function () {
      var perPage = 10, // 한페이지당 보이는 갯수
        currentPageNum = 1,
        _data,
        loading = false,
        listTotal,
        $wrap = $('.sub_contText').find('.price'),
        $price_result = $wrap.find('.price_result'),
        $number = $wrap.find('.number'),
        $news_number = $('.news_number'),
        searchVal = "",
        searchVal2 = "",
        searchVal3 = "";

      var params = {"search": searchVal, "searchOption": searchVal2, "searchOption2": searchVal3};

      function loadAjax() {
        ajaxcallingJSON(url_service_price, "GET", params, function (data) {
          _data = data.price;
          loadContents();
          mkpageList();
        });
      }

      //loadAjax
      loadAjax();
      $news_number.find('a.prev').on('click', function (e) {
        if (currentPageNum > 1) {
          currentPageNum--;
          //                    console.log("이전 클릭 " + currentPageNum);
          params = {
            "search": searchVal,
            "searchOption": searchVal2,
            "searchOption2": searchVal3,
            "cnum": currentPageNum,
          };
          loadAjax();
          commonjs.eventClick(e);
        }
      });
      $news_number.find('a.next').on('click', function (e) {
        if (currentPageNum < _data.totalPage) {
          currentPageNum++;
          //                    console.log("다음 클릭 " + currentPageNum);
          params = {
            "search": searchVal,
            "searchOption": searchVal2,
            "searchOption2": searchVal3,
            "cnum": currentPageNum,
          };
          loadAjax();
          commonjs.eventClick(e);
        }
      });
      $('#priceSearchBtn').on('click', function (e) {
        searchVal = $('#priceSearchInput').val();
        searchVal2 = $('#so').val();
        searchVal3 = $('#m_year').val();
        currentPageNum = 1;
        params = {"search": searchVal, "searchOption": searchVal2, "searchOption2": searchVal3, "cnum": currentPageNum};
        loadAjax();
        commonjs.eventClick(e);
      });
      //검색 버튼
      $("#priceSearchInput").bind("keydown", function (e) {
        if (e.keyCode == 13) { // enter key
          $('#priceSearchBtn').click();
          commonjs.eventClick(e);
        }
      });

      //검색 엔터버튼
      function mkpageList() {
        var totalPage = _data.totalPage;
        var startNum = Math.floor((currentPageNum - 1) / perPage) * perPage;
        var activePage = (currentPageNum - 1);
        //                console.log("activePage " + activePage)
        $number.find('.news_number > ul').empty();
        var endNum = startNum + perPage;
        if (endNum > totalPage) endNum = totalPage;
        //                console.log(endNum)
        for (var i = startNum; i < endNum; i++) {
          if (i == activePage) {
            var addClass = 'active';
          } else {
            var addClass = '';
          }
          $('<li class="' + addClass + '"><a href="#">' + (i + 1) + '</a></li>').appendTo($number.find('.news_number > ul')).find('a').on('click', function (e) {
            currentPageNum = $(this).parent().index() + startNum + 1;
            //                        console.log("페이지 번호 클릭 " + currentPageNum);
            params = {
              "search": searchVal,
              "searchOption": searchVal2,
              "searchOption2": searchVal3,
              "cnum": currentPageNum,
            };
            loadAjax();
            commonjs.eventClick(e);
          });
        }
        //for
      }

      //mkpageList
      function loadContents() {
        $price_result.find('>ul').empty();
        if (_data.dataList.length == 0) {
          if (searchVal.length > 0) {
            //검색한 후 결과가 없을 때
            $('<li style="line-height:59px;font-size:14px;text-align:center;"></li>').appendTo($price_result.find('>ul')).html('<b>' + searchVal + '</b>의 검색결과가 없습니다.');
          } else {
            //그냥 결과가 아예 없을때
            $('<li style="line-height:59px;font-size:14px;text-align:center;"></li>').appendTo($price_result.find('>ul')).html('등록된 내용이 없습니다.');
          }
        } else {
          $.each(_data.dataList, function (index) {
            //                    console.log(index)
            //                    if(index < 3 && currentPageNum == 1){
            $('<li></li>').appendTo($price_result.find('>ul')).html('<dl class="size1"><dt>차종</dt><dd>' + _data.dataList[index].carCode + '</dd></dl><dl ><dt>연식</dt><dd>' + _data.dataList[index].modelYear + '</dd></dl><dl ><dt>품번</dt><dd>' + _data.dataList[index].itemCode + '</dd></dl><dl><dt>권장소비자가격(원)</dt><dd>' + _data.dataList[index].price + '</dd></dl><dl><dt>품명(국문)</dt><dd>' + _data.dataList[index].itemName_kor + '</dd></dl><dl class="no_border"><dt>품명(영문)</dt><dd>' + _data.dataList[index].itemName_eng + '</dd></dl>');
            //                    }
          });
          //each
        }
        //if
      }

    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 2. 서비스) 스마트 서비스 */
    serviceSmart: function () {
      var current = 0,
        $slideWrap = $('.sub_contText.acu').find('>ul'),
        $slide = $slideWrap.find('>li'),
        $tab_box = $('.sub_contText.acu').find('.tab_box');

      $('.sub_contText.acu').find('.tab_box').find('>a').each(function (index) {
        var _thisBtn = $(this);
        _thisBtn.on('click', function (e) {
          //                    console.log(index);
          current = index;
          motion();
          $tab_box.find('a').eq(current).addClass('current').siblings().removeClass('current');
          commonjs.eventClick(e);
        });
      });

      $('.sub_contText.acu').find('.arrow_box').find('>a').each(function (index) {
        var _thisBtn = $(this);
        _thisBtn.on('click', function (e) {
          if (index == 0 && current > 0) {
            current--;
            motion();
          }
          if (index == 1 && current < $slide.length - 1) {
            current++;
            motion();
          }
          $tab_box.find('a').eq(current).addClass('current').siblings().removeClass('current');
          commonjs.eventClick(e);
        });
      });

      //
      function motion() {
        for (var i = 0; i < $slide.length; i++) {
          if (i < current) {
            $slide.eq(i).stop().animate({'left': '-100%'}, 400, 'easeInOutQuint');
          } else if (i == current) {
            $slide.eq(i).stop().animate({'left': 0}, 400, 'easeInOutQuint');
          } else if (i > current) {
            $slide.eq(i).stop().animate({'left': '100%'}, 400, 'easeInOutQuint');
          }
        }
        //for
      }

    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 2. 인사이드) 목록 페이지 - 카드레이아웃 만들기 */
    mkCard: function () {
      var target = $('.inside_cont').find('>ul'),
        currentTotal = 0,
        moreVal = 10,
        loading = false,
        params = {},
        _filterData,
        _data;
      var $moreBtn = $('.more_btn').find('.a'),
        $searchBtn = $('.search').find('.s_btnWrap'),
        $searchInput = $('.search').find(' > input'),
        $selectResult = $('.check_box').find('>ul');
      var jsonUrl;
      target.empty();
      if (depth3 == 0 || depth3 == 5 || depth3 == 4) {
        var checkFunc = {
            event: ["", "run", "end"], //dom 에 추가할 클래스명
            gallery: ["", "img", "video", "vr"],
            story: ["", "facebook", "youtube", "toyota", "instagram", "naverblog"],
          },
          selectText = {
            event: ['선택하세요.', '진행중 이벤트', '지난 이벤트'],
            gallery: ['전체', '이미지', '동영상', 'VR'],
            story: ['전체', '페이스북', '유튜브', '토요타', '인스타그램', '네이버블로그'],
          }
        var FilterCase = [];
        FilterCase[0] = true;
        //                filtersBtn();
        tabBtn();
        //탭버튼 기능정의
      } else if (depth3 == 6) {
        var searchText = '';
      } else if (depth3 == 2 || depth3 == 3) {
        selectDate();
      }
      //if

      if (depth3 == 0) {
        //이벤트
        params = {"sval": "run"};
        // 디폴트로 진행중인것만 나오게 해달라고 해서
        jsonUrl = url_inside_event;
        $('.more_btn').show();
        $selectResult.find('>li').html('<a href="#none">' + selectText.event[0] + '<img src="/image/check_boxIcon.png" alt=""></a>');

      } else if (depth3 == 5) {
        //갤러리
        jsonUrl = url_inside_gallery;
        $('.more_btn').show();
        $selectResult.find('>li').html('<a href="#none">' + selectText.gallery[0] + '<img src="/image/check_boxIcon.png" alt=""></a>');
      } else if (depth3 == 4) {
        //스토리
        jsonUrl = url_inside_story
        $('.more_btn').show();
        $selectResult.find('>li').html('<a href="#none">' + selectText.story[0] + '<img src="/image/check_boxIcon.png" alt=""></a>');
      } else if (depth3 == 6) {
        jsonUrl = url_inside_notice;
      } else if (depth3 == 2) {
        jsonUrl = url_inside_newsletter;
      } else if (depth3 == 3) {
        jsonUrl = url_inside_style;
      }
      //외부파일 호출
      if (sval.length > 0) params.sval = sval;
      if (keyword.length > 0) params.search = keyword;
      if (sval.length > 0 && depth3 == 2) params.year = sval;

      function loadAjax() {
        //                console.log(params);
        $.ajax({
          type: "GET",
          url: jsonUrl,
          data: params,
          //                    contentType : "application/json;charset=urf-8",
          dataType: "json",
          cache: false,
          success: function (data) {
            if (depth3 == 0) {
              _data = data.toyotaEvent;
            } else if (depth3 == 6) {
              _data = data.toyotaNotice;
            } else if (depth3 == 5) {
              _data = data.toyotaGallery;
            } else if (depth3 == 2) {
              _data = data.newsletter;
            } else if (depth3 == 3) {
              _data = data.style;
            } else if (depth3 == 4) {
              _data = data.story;
            }
            _filterData = _data;
            //                        console.log(data);
            loadContents();
          }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
          }, timeout: 5000,
        });
      }


      var fromListBtn = false;
      var _tNum = tNum,
        _cNum = cNum,
        endNum,
        onceLoad = false;
      if (_cNum > -1) moreVal = 5;

      function addElement() {

        var i = currentTotal;
        //                console.log("현재까지 " + currentTotal);
        var AddClass = '',
          AddElement = '';
        var imgTag = '',
          AddComment = '';
        var linkTarget = '';
        if (currentTotal < _data.dataList.length) {
          //지금까지 갯수가 전체 갯수를 넘지 않으면 불러오기
          if (endNum > _data.dataList.length) {
            var x = moreVal - (endNum - _data.dataList.length);
            endNum = currentTotal + x;
            $('.more_btn').hide();
          }
        }
        if (depth3 == 0) {
          //각 엘리먼트에 택 만들기
          if (_data.dataList[i].state.length > 0) {
            AddElement = '<div class="event_Wrap">';
            if (_data.dataList[i].state == "run") {
              AddClass += checkFunc.event[1];
              AddElement += '<div class="event_icon ' + AddClass + '">진행중 이벤트</div>';
            }
            if (_data.dataList[i].state == "end") {
              AddClass += ' ' + checkFunc.event[2];
              AddElement += '<div class="event_icon ' + AddClass + '">지난 이벤트</div>';
            }
            AddElement += '</div>';

          }
        } else if (depth3 == 4) {
          //토요타 스토리

          if (_data.dataList[i].sns_channel == "facebook") {
            var iconImg = '/image/main_storyIcon4.jpg';
            var linkTarget = 'target = "_blank"';
          } else if (_data.dataList[i].sns_channel == "youtube") {
            var iconImg = '/image/main_storyIcon2.jpg';
            var linkTarget = 'target = "_blank"';
          } else if (_data.dataList[i].sns_channel == "instagram") {
            var iconImg = '/image/main_storyIcon3.jpg';
            var linkTarget = 'target = "_blank"';
          } else if (_data.dataList[i].sns_channel == "naverblog") {
            var iconImg = '/image/main_storyIcon1.jpg';
            var linkTarget = 'target = "_blank"';
          } else if (_data.dataList[i].sns_channel == "toyota") {
            var iconImg = '/image/main_storyIcon6.jpg';

          }
          AddElement = '<span><a href="' + _data.dataList[i].link + '" ' + linkTarget + '><img src="' + iconImg + '" alt=""></a></span>';
        }
        //필터 아이콘 만들기
        var imgVisible = false;
        if (!(_data.dataList[i].img == undefined || _data.dataList[i].img == null || _data.dataList[i].img == '')) {
          var imgTag = '<div class="inside_img"><img src="' + _data.dataList[i].img + '" alt=""></div>';
          imgVisible = true;
        }
        //이미지 없으면 공란으로
        if (depth3 == 0) {
          AddComment = '<p>' + _data.dataList[i].period + '</p>';
        } else {
          AddComment = '<p>' + _data.dataList[i].comment + '</p>';
        }
        $('<li class="liNum' + i + '"></li>').appendTo(target).html('<div class="inside_contInner"><a href="' + _data.dataList[i].link + '" class="sh" ' + linkTarget + '>' + imgTag + '<h5>' + _data.dataList[i].title + '</h5>' + AddComment + '</a></div>').addClass(AddClass).css('opacity', 0);

        //각 데이터 요소 생성
        if (!(depth3 == 0 && _data.dataList[i].state == "end")) {

          //스토리
          $('<a href="' + _data.dataList[i].link + '" ' + linkTarget + 'class="more">MORE</a>').appendTo(target.find('>li').eq(i).find('.inside_contInner'));

        }
        //종료된 이벤트의 경우 more 버튼 없애기

        if (depth3 == 0) {
          target.find('.liNum' + i).find('>.inside_contInner').prepend(AddElement);
        } else if (depth3 == 4) {
          target.find('.liNum' + i).find('>.inside_contInner .inside_img').append(AddElement);
          //                            var printElement = AddElement;
        }
        //택 넣기
        //                    console.log("currentTotal : " + currentTotal + " endNum : " + endNum);
        var img = new Image();
        img.onload = function () {
          loadedSet();
        };
        img.onerror = function () {
          loadedSet();
          target.find('.liNum' + i).find('.inside_img').remove();
        }
        img.src = target.find('.liNum' + i).find('.inside_img > img').attr('src');

        if (_cNum > -1 && !fromListBtn) {
          //상세페이지에서 목록 보기 버튼 클릭하여 이동해서 목록오면 변수 담기기 때문에 전체 게시물 - 지금 게시물 순번 해서 펼쳐질 것임
          //그러면서 해당 위치로 이동
          fromListBtn = true;
          //                    console.log('endNum ' + endNum + ' / moreVal ' + moreVal)
          if (endNum > moreVal) {
            commonjs.scrollToBody($(window).height() - $('#header').height(), 400);
          }
          //if
        }

        function loadedSet() {
          $('div.inside_cont').viCardLayout();
          target.find('.liNum' + i).stop().animate({'opacity': 1}, 800);
          currentTotal = currentTotal + 1;
          //                    console.log(moreVal);
          if (currentTotal < endNum) {
            addElement();
          } else {
            endNum = currentTotal + moreVal;
            loading = false;
            if (currentTotal !== _data.dataList.length) {
              $('.more_btn').show();
            } else {
              $('.more_btn').hide();
            }
          }
          if (currentTotal == endNum - 1 && !onceLoad && depth3 !== 0) {
            onceLoad = true;
            //                    if(currentTotal == endNum-1 && currentTotal == moreVal-1 && depth3 !== 0){
            //원래는 나온 컨텐츠의 수가 기본 노출 컨텐츠 수 보다 적을 경우 스크롤링되어 올라가도록 했었음
            commonjs.scrollToBody($(window).height() - $('#header').height(), 400);
          }

        }

        //loadedSet
      };

      // 엘리먼트 만들기

      function loadContents() {
        //                var startNum = currentTotal;
        endNum = currentTotal + moreVal;
        //                console.log("currentTotal " + currentTotal + " / moreVal " + moreVal + " / endNum " + endNum + ' / _cNum ' + _cNum);
        if (_cNum > -1 && !fromListBtn) {
          //변수담은 페이지
          endNum = _cNum * moreVal;
          if (endNum < moreVal) {
            endNum = moreVal;
            //변수담은 페이지에서 펼쳐질 갯수가 more보다 작으면 그냥 more로 보여줘야함
          } else if (endNum > _data.dataList.length) {

            // 변수 6 * 5 = 30 이지만 28번까지밖에 없다면
            //                        console.log("목록번호가 높다")
            endNum = _data.dataList.length;
            $('.more_btn').hide();
          }
        }
        addElement();
      }

      //loadContents

      var $check_box = $('.check_box');
      $check_box.find('> ul > li').each(function (index) {
        var _thisLi = $(this);
        _thisLi.on('click', function (e) {
          $check_box.find('div.check_boxPopup').eq(index).toggleClass('pop_on');
          //                        console.log("클릭" + $check_box.height())
          commonjs.eventClick(e);
        });
      });

      //each 토글로 메뉴 펼침
      function selectDate() {
        var $check_box = $('.check_box'),
          newsletter_years = ["전체", "2017", "2016", "2015", "2014"], //'2017'추가(민환)
          style_years = ["전체", "2016", "2015", "2014", "2013", "2012"],
          _monrh = 0,
          _year;
        $check_box.find('div.check_boxPopup').each(function (index) {
          var _this = $(this);
          if (depth3 == 2) {
            var loopArray = newsletter_years;
          } else if (depth3 == 3) {
            var loopArray = style_years;
          }
          _year = loopArray[0];
          $check_box.find('>ul>li').html('<a href="#none">' + _year + '<img src="/image/check_boxIcon.png" alt=""></a>');
          for (var i = 0; i < loopArray.length; i++) {
            $('<li></li>').appendTo(_this.find('>ul')).html(loopArray[i]).on('click', function (e) {
              //탭버튼 클릭

              var resultValue;
              resultValue = loopArray[$(this).index()];
              _year = resultValue;
              $check_box.find('>ul>li').html('<a href="#none">' + resultValue + '<img src="/image/check_boxIcon.png" alt=""></a>');
              params = {"year": _year}; //ajax 호출 파라미터 등장
              target.empty();
              currentTotal = 0;
              loadAjax();
              $check_box.find('div.check_boxPopup').removeClass('pop_on');
              commonjs.eventClick(e);
            });
            //each btn _ 숫자클릭
          }
          ;
          //for
        });
        if (sval.length > 0) $check_box.find('>ul>li').html('<a href="#none">' + sval + '<img src="/image/check_boxIcon.png" alt=""></a>');
      }

      //날짜 연도 선택

      function tabBtn() {
        var $checkBox = $('.check_boxPopup');
        if (depth3 == 0) {
          var loop = checkFunc.event;
          var returnText = selectText.event;
        } else if (depth3 == 5) {
          var loop = checkFunc.gallery;
          var returnText = selectText.gallery;
        } else if (depth3 == 4) {
          var loop = checkFunc.story;
          var returnText = selectText.story;
        }
        ;
        $checkBox.find('li').each(function (index) {
          var _thisLi = $(this);
          _thisLi.on('click', function (e) {
            _cNum = -1;
            onceLoad = false; //필터를 누를때마다 새로운 컨텐츠가 로딩되고 다시 스크롤링이 될 수 있도록 하기 위해
            target.empty();
            currentTotal = 0;
            target.height('50px');
            if (depth3 == 0) {
              //이벤트쪽만 전체가 사라지기 때문에
              params = {"sval": loop[index + 1]};
              $('.check_box').find('>ul>li').html('<a href="#none">' + returnText[index + 1] + '<img src="/image/check_boxIcon.png" alt=""></a>')
            } else {
              $('.check_box').find('>ul>li').html('<a href="#none">' + returnText[index] + '<img src="/image/check_boxIcon.png" alt=""></a>')
              if (index == 0) {
                params = {};
              } else {
                params = {"sval": loop[index]};
              }

            }
            //                        console.log(params);
            loadAjax();
            $check_box.find('div.check_boxPopup').removeClass('pop_on');
            commonjs.eventClick(e);
          });
          //CLICK - 탭버튼 클릭
        });
        //each
      }

      //tabBtn 탭만들기

      function filtersBtn() {
        var $checkBox = $('.check_boxPopup');
        if (depth3 == 0) {
          var loop = checkFunc.event;
        } else if (depth3 == 5) {
          var loop = checkFunc.gallery;
        } else if (depth3 == 4) {
          var loop = checkFunc.story;
        }
        //                var $check_box = $('.check_box');
        $checkBox.find('li').each(function (index) {
          var _thisLi = $(this);

          //                    _thisLi.addClass('check_on');
          FilterCase[index] = true;

          _thisLi.on('click', function (e) {
            //각 탭버튼 클릭
            _thisLi.addClass('check_on');
            if (depth3 == 4) {
              //스토리
              var printText = selectText.story[index];
            } else {
              var printText = _thisLi.find('a').text();
            }
            $selectResult.find('>li').html('<a href="#none">' + printText + '<img src="/image/check_boxIcon.png" alt=""></a>');
            //                        _thisLi.addClass('check_on');
            if (index == 0) {
              //필터중 '전체'
              target.empty();
              currentTotal = 0;
              loadAjax();
              //전체
            } else {
              target.empty();
              currentTotal = 0;
              loadAjax();
            }
            $check_box.find('div.check_boxPopup').removeClass('pop_on');
            commonjs.eventClick(e);
          });
        });

      }

      //filtersBtn

      $searchBtn.on('click', function (e) {
        if ($searchInput.val().length > 0) {
          searchText = $searchInput.val();
          params = {"search": searchText}; //ajax 호출 파라미터 등장
          target.empty();
          currentTotal = 0;
          $searchInput.val('');
          loadAjax();
        } else {
          alert("검색어를 입력해 주세요.");
        }
        commonjs.eventClick(e);
      });
      //검색 버튼
      $searchInput.bind("keydown", function (e) {
        if (e.keyCode == 13) { // enter key
          $searchBtn.click();
          commonjs.eventClick(e);
        }
      });
      //검색 엔터버튼
      $moreBtn.on('click', function (e) {
        moreVal = 5;
        endNum = currentTotal + moreVal;
        //                console.log("더보기 클릭" + moreVal);
        if (!loading) {
          $('.more_btn').hide();
          loading = true;
          addElement();
        }
        commonjs.eventClick(e);
      });
      //더보기 버튼
      loadAjax();
    },

    /* ----------------------------------------------------------------------- (1. 토요타 - 3. 인사이드) 디테일 페이지 기능 정의 */
    inside_detailPageSet2: function (Ptype) {
      $('img[usemap]').rwdImageMaps();
      if (Ptype == "gallery") {
        $('.it_imgBox.video').css({
          'position': 'relative',
          'padding-bottom': '56.25%',
          'padding-top': '30px',
          'height': 0,
          'overflow': 'hidden',
        });
        $('.it_imgBox.video').find('iframe').css({
          'position': 'absolute',
          'left': '0',
          'right': '0',
          'top': '0',
          'bottom': '0',
          'width': '100%',
          'height': '100%',
        })

      } else if (Ptype == "newsletter") {
        $('.it_conInnerWrap').find('.it_imgBox').find('img').rwdImageMaps();
      }
      $('.it_conInner2').find('>ul').find('>li').each(function (index) {
        var _thisLi = $(this);
        if (_thisLi.hasClass('empty')) {
          //                    _thisLi.find('.mo_title').html('<span>&nbsp;</span> ');
          _thisLi.find('>a').prop('href', '#').on('click', function (e) {
            if (_thisLi.hasClass('view_next')) {
              alert("다음 게시물이 없습니다.");
            } else if (_thisLi.hasClass('view_prev')) {
              alert("이전 게시물이 없습니다.");
            }
            commonjs.eventClick(e);
          });
        }
        //if
      });
      var checkImg = new Image();
      checkImg.src = $('.it_imgBox').find('>img').attr('src');
      checkImg.onerror = function () {
        $('.it_imgBox').find('>img').remove();
      }
    },

    /* ----------------------------------------------------------------------- (3. 스마트 하이브리드) 페이지 시작 */
    hybridSet: function () {
      function mkTab(tabmenu, tabcontent, menuClass) {
        var _this = tabmenu;
        _this.find('>ul').find('>li').each(function (index) {
          var _thisLi = $(this);
          _thisLi.on('click', function (e) {
            _thisLi.addClass(menuClass).siblings().removeClass(menuClass);
            tabcontent.find('>div').eq(index).addClass('active').siblings().removeClass('active');
            commonjs.eventClick(e);
          });
        });
      }

      //mkTab(컨트럴wrap, 컨텐츠wrap, 컨트롤액티브 클라스)
      mkTab($('.smart_tab'), $('.smart_tabCont'), 'current');
      mkTab($('.st_inTab'), $('.st_inTabCont'), 'st_active');
      mkTab($('.sm_tab'), $('.sm_cont'), 'current');

      //민환씨 추가 스크립트 -- 시작
      $('.smc_inBox2 .check a').on('click', function () {
        var smc_inBox2_idx = $(this).index();
        $('.smc_inBox2 > ul').eq(smc_inBox2_idx).addClass('current').siblings('ul').removeClass('current');
        $(this).addClass('current').siblings().removeClass('current');
      });

      //민환씨 추가 스크립트 -- 끝
      function displayNoneBlock(ele, ctrl) {
        var _this = ele,
          currentNum = 0,
          maxNum = _this.find(ctrl).find('ul').find('>li').length;

        _this.find(ctrl).find('ul').find('>li').each(function (index) {
          var _thisLi = $(this);
          _thisLi.on('click', function (e) {
            _thisLi.addClass('active').siblings().removeClass('active');
            _this.find('>ul').find('>li').eq(index).addClass('active').siblings().removeClass('active');
            currentNum = index;
            commonjs.eventClick(e);
          });
        });
        //li
        _this.find(ctrl).find('a.prev').on('click', function (e) {
          if (currentNum > 0) {
            currentNum--;
          } else {
            currentNum = maxNum - 1;
          }
          _this.find(ctrl).find('ul').find('>li').eq(currentNum).addClass('active').siblings().removeClass('active');
          _this.find('>ul').find('>li').eq(currentNum).addClass('active').siblings().removeClass('active');
          commonjs.eventClick(e);
        });
        //이전 버튼
        _this.find(ctrl).find('a.next').on('click', function (e) {
          if (currentNum < maxNum - 1) {
            currentNum++;
          } else {
            currentNum = 0;
          }
          _this.find(ctrl).find('ul').find('>li').eq(currentNum).addClass('active').siblings().removeClass('active');
          _this.find('>ul').find('>li').eq(currentNum).addClass('active').siblings().removeClass('active');
          commonjs.eventClick(e);
        });
        //다음 버튼

      };
      $('.slide').each(function (index) {
        displayNoneBlock($(this), $('.slide_n'));
      });
      //슬라이드마다 기능정의

      var currentQna = 0,
        _qnaData;
      var _moreBtn = $('.qa_list').find('.a_list > a');
      ajaxcallingJSON(url_hybrid_qna, "GET", '', callback);

      function callback(data) {
        _qnaData = data;
        qnaSet(0);
      }

      function qnaSet(num) {
        var _data,
          _target = $('.qa_list').find('.a_list > .a_listInner');

        if (num == 0) {
          _data = _qnaData.best10;
        } else if (num == 1) {
          _data = _qnaData.Hspecial;
        } else if (num == 2) {
          _data = _qnaData.Hdrive;
        } else if (num == 3) {
          _data = _qnaData.spec;
        } else if (num == 4) {
          _data = _qnaData.compare;
        } else if (num == 5) {
          _data = _qnaData.battery;
        }
        _target.addClass('active');
        _target.find('>ul').empty();
        for (var i = 0; i < _data.length; i++) {
          $('<li></li>').appendTo(_target.find('>ul')).html('<a href="#none"></a><p></p>');
          _target.find('>ul').find('>li').eq(i).find('>a').html('Q. ' + _data[i].q);
          _target.find('>ul').find('>li').eq(i).find('>p').html('<span><img src="/image/a_img.png" alt=""></span>' + _data[i].a);
        }
        //for
        _target.find('>ul').find('>li').each(function (index) {
          var _thisLi = $(this);
          _thisLi.on('click', function (e) {
            _thisLi.toggleClass('active').siblings().removeClass('active');
            commonjs.eventClick(e);
          });
        });
        //each
        var allOpen = false;
        _moreBtn.on('click', function (e) {
          if (!allOpen) {
            _target.find('>ul').find('>li').addClass('active');
            _moreBtn.html('전체 답변 닫기 <span><img src="/image/arrow_up.png" alt=""></span>');
            allOpen = true;
          } else {
            _target.find('>ul').find('>li').removeClass('active');
            _moreBtn.html('전체 답변 열기 <span><img src="/image/arrow_down.png" alt=""></span>');
            allOpen = false;
          }
          commonjs.eventClick(e);
        });
        //more btn
      }

      //qnaSet
      (function tabmenu() {
        var _tabmenu = $('.qa_list').find('> ul');
        _tabmenu.find('>li').removeClass('current').eq(currentQna).addClass('current');
        _tabmenu.find('>li').each(function (index) {
          var _thisLi = $(this);
          _thisLi.on('click', function (e) {
            _moreBtn.html('전체 답변 열기 <span><img src="/image/arrow_down.png" alt=""></span>');
            _thisLi.addClass('current').siblings().removeClass('current');
            qnaSet(index);
            commonjs.eventClick(e);
          });
          //
        });
        //each
      }());
    },

    /* ----------------------------------------------------------------------- (4. 딜러스) 셋팅 시작 */
    mkDealersSet4: function () {
      var titleName = ["전시장",
        "서비스센터"];
      var CallUrl = [url_dealers_index,
        url_servicecenter_index];
      var addCheck = '',
        _data = [],
        _printdata,
        _filterdata = {},
        currentStep1 = sv,
        currentStep2 = 0,
        currentStep3 = 0,
        area,
        paramsCode,
        onceload = false;
      var loadfiles = 0;

      ajaxcallingJSON(CallUrl[0], "GET", '', function (data) {
        _data[0] = data;
        loadComplete();
      });
      ajaxcallingJSON(CallUrl[1], "GET", '', function (data) {
        _data[1] = data;
        loadComplete();
      });

      function loadComplete() {
        loadfiles++;
        if (!onceload && loadfiles == 2) {
          //둘다 로딩되었을 때
          lnbSet();
          _printdata = _data[currentStep1].Exhibition;
          selectArea();
          mkstep1();
          mkstep2();
          mkstep3();
          onceload = true;
        }
        //if
      }

      //loadComplete
      //----------------------- 1. lnb 버튼 인터렉션
      var $dealersStep1 = $('.step_common.step1').find('.map_list').find('>ul');
      var $dealersStep2 = $('.step_common.step2').find('.s2_map').find('.map_list').find('>ul');
      var $dealersStep3 = $('.step_common.step3').find('.map_list').find('>ul');
      var $top_m_3depth = $('.dealers_wrap').find('>.check_box > .check_box');

      function lnbSet() {
        //                var step2Navi = $('.check_box').find('>.check_box');
        $('.lnb_title > h3').html('전시장<img src="/image/down_arrow.png" alt="">');

        $('.lnb_title').find('> ul > li').each(function (index) {
          //모바일 - 상단 전시장, 서비스센터 선택 액션
          var _this = $(this);
          _this.on('click', function (e) {
            //클릭
            if (currentStep1 !== index) {
              //현재 선택된 것이 아니라면
              currentStep1 = index;
              //                            currentStep2 = 1;
              //                            currentStep3 = 0;
              $('.stc_st3List').find('>ul').find('>li').eq(index).addClass('current').siblings().removeClass('current');
              //피씨화면 메뉴 동기화
              $('.step_common').find('>.s2_map').find('.map_list').find('>ul').find('>li').removeClass('current');
              //피씨화면 지도 활성화 초기화
              $('.sub_contText_inner').find('>h3').text(titleName[currentStep1] + ' 안내');
              $('.lnb_title > h3').html(titleName[index] + '<img src="/image/down_arrow.png" alt="">');
              $('.check_box').find('>.check_box').find('>ul').find('>li').html('<a href="#none">전국 <img src="/image/check_boxIcon.png" alt=""></a>');
              $('.lnb_title').removeClass('lnb_open');
              _printdata = _data[currentStep1].Exhibition;
              selectArea();
            }
            commonjs.eventClick(e);
          });
        });
        //모바일에서 전시장이냐 서비스센터냐 선택

        $top_m_3depth.find('> ul').find('> li').on('click', function (e) {
          $top_m_3depth.find('>.check_boxPopup').toggleClass('pop_on');
          commonjs.eventClick(e);
        });

        $top_m_3depth.find('.check_boxPopup').find('> ul > li').each(function (index) {
          var $this = $(this);
          $this.on('click', function (e) {
            if (index == 0) {
              selectArea();
            } else {
              $dealersStep1.find('>li[area1=' + $this.attr("area1") + ']').click();
            }
            //if
            $top_m_3depth.find('>.check_boxPopup').removeClass('pop_on');
            $top_m_3depth.find('>ul').find('>li').html('<a href="#none">' + $this.find('>a').text() + ' <img src="/image/check_boxIcon.png" alt=""></a>');
            commonjs.eventClick(e);
          });
        });

      }

      //lnbSet - 모바일 - 메뉴 정의

      //----------------------- 2. 리스트 만들기
      //            var $dealersStep3 = $dealersStep3;

      function selectArea() {
        $dealersStep3.empty();
        //  2-1. 리스트 갯수만큼 생성하기
        if (_printdata.length == 1) {
          var AddHtmls = returnAddhtml(0);
          //1개밖에 없을 때
          $('<li data-area1="' + _printdata[i][0].area1 + '" area2="' + _printdata[i][0].area2 + '" family="' + _printdata[i][0].family + '"></li>').appendTo($dealersStep3).html('<div class="map"></div><div class="map_listInner"><dl><dt>' + _printdata[0][0].placeName + AddHtmls.Addhtml2 + '</dt><dd>' + _printdata[0][1][0].address + '</dd><dd>' + _printdata[0][1][0].tel + '</dd></dl><ul>' + AddHtmls.Addhtml + '<li><a class="no_border openMap" href="#none"><span><img src="/image/dealers_icon2.jpg" alt="" class="wt100"></span><span class="mapText" style="width:57px;">지도 열기</span></a></li></ul></div>');
        } else {
          for (var i = 0; i < _printdata.length; i++) {
            var AddHtmls = returnAddhtml(i);
            $('<li data-area1="' + _printdata[i][0].area1 + '" area2="' + _printdata[i][0].area2 + '" family="' + _printdata[i][0].family + '"></li>').appendTo($dealersStep3).html('<div class="map"></div><div class="map_listInner"><dl><dt>' + _printdata[i][0].placeName + AddHtmls.Addhtml2 + '</dt><dd>' + _printdata[i][1][0].address + '</dd><dd>' + _printdata[i][1][0].tel + '</dd></dl><ul>' + AddHtmls.Addhtml + '<li><a class="no_border openMap" href="#none"><span><img src="/image/dealers_icon2.jpg" alt="" class="wt100"></span><span class="mapText" style="width:57px;">지도 열기</span></a></li></ul></div>');

          }
          //for
        }

        //  2-2. 생성한 목록 인터렉션
        $dealersStep3.find('>li').each(function (index) {
          var $this = $(this);
          var insertData = '<div id="navermap_' + index + '" style="width:100%;height:320px;"></div>';
          if (index === 0) $this.find('.map').html(insertData);
          $this.find('a.openMap').on('click', function (e) {
            $this.find('.map').html(insertData);
            var map = new naver.maps.Map('navermap_' + index, {center: new naver.maps.LatLng(_printdata[index][1][0].lat, _printdata[index][1][0].lng)});
            var marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(_printdata[index][1][0].lat, _printdata[index][1][0].lng),
              map: map,
            });
            $this.toggleClass('current').siblings().removeClass('current');
            changeText();
            commonjs.eventClick(e);
          });
        });
        //each

        // 2-3. 인터렉션에 대한 처리
        function changeText() {
          $dealersStep3.find('>li').each(function (index) {
            var _thisLi = $(this);
            if (_thisLi.hasClass('current')) {
              _thisLi.find('.mapText').text('지도 닫기');
            } else {
              _thisLi.find('.mapText').text('지도 열기');
            }
          });
        }
      }

      //selectArea

      //----------------------- 2. 추가 옵션 - 리턴값 받기
      function returnAddhtml(Num) {
        var Addhtml = "",
          Addhtml2 = "";
        if (currentStep1 == 0) {
          //딜러사
          Addhtml = '<li><a href="' + _printdata[Num][1][0].website + '"><span><img src="/image/dealers_icon1.jpg" alt="" class="wt100"></span>딜러페이지</a></li>';
        } else {
          //서비스 센터
          if (_printdata[Num][1][0].coating == "yes") {
            Addhtml2 = '<span><img src="/image/dealers_icon3.png" alt=""> 판금/도장</span>';
          }
        }
        return {"Addhtml": Addhtml, "Addhtml2": Addhtml2};
      }

      //returnAddhtml


      function mkstep1() {
        $dealersStep1.find('>li').each(function (index) {
          var $this = $(this);
          $this.on('click', function (e) {
            selectArea();
            $this.addClass('current').siblings().removeClass('current');
            $dealersStep2.find('>li').removeClass('current');
            $dealersStep3.find('>li').hide();
            currentStep2 = index + 1;
            currentStep3 = 0;
            $dealersStep3.find('>li[data-area1=' + $this.attr("area1") + ']').show();
            //                        var _target = $('.step_common.step3').find('.map_list').find('>ul>li[data-area1=' + $this.attr("area1")+ ']');
            //                        _target.show();
            $('.step_common.step2').find('.s2_map').find('.map_list').eq(index).addClass('view').siblings().removeClass('view');
            $top_m_3depth.find('>ul > li > a').html($top_m_3depth.find('>.check_boxPopup').find('li[area1=' + $this.attr("area1") + '] > a').text() + '  <img src="/image/check_boxIcon.png" alt=""></a>');
            commonjs.eventClick(e);
          });
          //광역시도 클릭
        });
      }

      //mkstep1

      function mkstep2() {
        $('.step_common.step2').find('.s2_map').find('.map_list').each(function (index) {
          //각 시군구
          var _this = $(this);
          _this.find('>ul').find('>li').each(function (Liindex) {
            //각 시군구의 최소단위
            var _thisLi = $(this);
            _thisLi.on('click', function (e) {
              _thisLi.addClass('current').siblings().removeClass('current');
              //각 시군구의 최소단위 클릭
              $('.step_common.step3').find('.map_list').find('>ul>li').hide();
              currentStep3 = Liindex + 1;
              var matchText = _thisLi.attr("area2");
              $('.step_common.step3').find('.map_list').find('>ul>li').each(function (loopNum) {
                var _thisLoop = $(this);
                //                                if(_thisLoop.attr('family').indexOf(matchText) >= 0){ <- 패밀리들 나오게 했던 코드 (취소됨)
                if (_thisLoop.attr('area2') == matchText) {
                  _thisLoop.show();
                  _thisLoop.prependTo($('.step_common.step3').find('.map_list').find('>ul'));
                  if (!_thisLoop.hasClass('current')) _thisLoop.find('a.openMap').click();
                  //                                    if(_thisLoop.attr('area2') == matchText){
                  //                                    }
                }
                ;
              });
              commonjs.eventClick(e);
            });
            //click
          });
          //each
        });
        //each
      }

      //mkstep2

      function mkstep3() {
        $('.step_common.step3').find('.stc_st3List').find('>ul').find('>li').each(function (index) {
          var _this = $(this);
          _this.on('click', function (e) {
            $('.lnb_title').find('>h3').html(titleName[index] + '<img src="/image/down_arrow.png" alt="">');
            $('.sub_contText_inner').find('>h3').html(titleName[index] + ' 안내');
            //명칭 변경

            //현재 선택된 것이 아니라면
            if (index == 0) {
              $('.step_common.step2 > .s2_map').show();
            } else {
              currentStep3 = 0;
              $('.step_common.step2 > .s2_map').hide();
            }
            _this.addClass('current').siblings().removeClass('current');
            currentStep1 = index;
            _printdata = _data[currentStep1].Exhibition;
            if (currentStep2 == 0 && currentStep3 == 0) {
              //아무것도 안누른 상태
              selectArea();
            } else if (currentStep2 > 0 && currentStep3 == 0) {
              //광역시도만 클릭
              selectArea();
              var target = $('.step_common.step1');
              target.find('.map_list').find('>ul').find('>li.current').click();

            } else if (currentStep2 > 0 && currentStep3 > 0) {
              selectArea();
              $('.step_common.step2').find('.s2_map').find('.map_list').find('>ul').find('>li.current').click();
            }
            //if
            commonjs.eventClick(e);
          });
        });
        if (sv == 1) {
          //'서비스센터'로 다이렉트 접속
          $('.lnb_title').find('>h3').html(titleName[sv] + '<img src="/image/down_arrow.png" alt="">');
          $('.sub_contText_inner').find('>h3').html(titleName[sv] + ' 안내');
          //명칭 변경
          $('.step_common.step3').find('.stc_st3List').find('>ul').find('>li').eq(sv).addClass('current').siblings().removeClass('current');
        }
        ;
      }

      //mkstep3
    },
    /* ----------------------------------------------------------------------- 각 딜러사 별 사이트 페이지 제작 */
    mkDealersPage: function () {
      var _data,
        _data2, //메인 롤링(페이드되는) 슬라이드
        params = {"d_code": d_code},
        jsonTarget,
        $lnb_wrap = $('.lnb_wrap'),
        $dl_visual = $('.dl_visual'),
        $dl_cont = $('.dl_cont'),
        $dl_pop = $('.dl_pop'),
        $lnb_title = $('.lnb_title'),
        fadeSetInt,
        fadeSlidePrev = 0,
        fadeSlideCurrent = 0,
        fadeSlideMax,
        _target1 = $('.dl_visual'),
        popupOpen = false,
        currentLi = 0;


      //----------------- 외부데이터 선행 불러오기
      ajaxcallingJSON(url_dealers, "GET", params, function (data) {
        _data = data;
        jsonTarget = _data.main.rolling_event;
        mkDealersSub();
        mkMenu();
        mkDealersMain();
      });

      //----------------- 0. 가변적인 메뉴 생성
      function mkMenu() {
        var trg = $lnb_title.find('>ul');
        trg.empty();
        //비우고
        for (var i = 0; i < _data.sub.length; i++) {
          if (_data.sub[i].title.length > 0) {
            $('<li></li>').appendTo(trg).html('<a href="#none">' + _data.sub[i].title + '</a>');
          }
        }
        $('<li class="event"></li>').appendTo(trg).html('<a href="#none">이벤트</a>');
        $('<li class="personal_info"></li>').appendTo(trg).html('<a href="#none">개인정보처리방침</a>');
        //각 lnb 버튼 클릭 기능
        trg.find('>li').each(function (index) {
          var _thisLi = $(this);
          _thisLi.on('click', function (e) {
            $lnb_title.removeClass('lnb_open');
            //모바일에서 lnb 클릭하면 열려진 상태를 닫기
            openContents(index);
            $lnb_title.find('>h3').html(_thisLi.find('>a').text() + '<img src="/image/down_arrow.png" alt="">');
            //딜러사 수정을 위한 코드
            _thisLi.addClass('current').siblings().removeClass('current');
            commonjs.eventClick(e);
          });
        });
      }

      //----------------- 1. 메인 사이드 배너 연결
      function mkDealersMain() {
        $lnb_wrap.find('>h2').text(_data.dealername);
        $('.sub_visualText').find('>h2').html(_data.dealername);
        $lnb_title.find('>h3').html(_data.sub[0].title + '<img src="/image/down_arrow.png" alt="">');
        //lnb안에 딜러사 이름

        $dl_visual.find('>img').remove();
        var insertTilte = $dl_visual.find('h3').html();
        $('.sub_visualText').find('h2').html(insertTilte);
        //비주얼쪽 딜러사 이름

        var trg = $dl_cont.find('>.dl_contInner').find('>ul');
        trg.find('>li').each(function (index) {
          var _thisLi = $(this);
          if (index == 1) {
            var Liwidth = _thisLi.width();
            //이벤트의 경우 슬라이딩을 만들어야해서
            if (jsonTarget.length > 0) {
              //이벤트가 존재할 경우
              var mainImg = [],
                parseArray = [];
              for (var i = 0; i < jsonTarget.length; i++) {
                if (jsonTarget[i].link.length > 0 || jsonTarget[i].image.length > 0) {
                  //링크가 있거나 이미지가 있을 경우 새로 배열 구성
                  parseArray.push(jsonTarget[i]);
                }
                //if
              }
              //for
              if (parseArray.length == 0) {
                //이벤트가 하나도 없을 때 더미 이미지를 넣게 된다면 액션 추가할 것
              } else {
                _thisLi.empty().addClass('slideArea');
                var newArr = [];
                for (var i = 0; i < parseArray.length; i++) {
                  if (parseArray[i].image.length > 0) {
                    newArr.push(parseArray[i]);
                  }
                }
                //                                console.log(newArr)
                $('<ul class="dealersSlide sliders"></ul>').appendTo(_thisLi);
                if (d_code == 24) {
                  for (var i = 0; i < newArr.length; i++) {
                    var targeting = '';
                    mainImg[i] = new Image();
                    if (newArr[i].image.length > 0) {
                      //이미지가 있을 경우
                      var imgEmbed = newArr[i].image;
                    } else {
                      var imgEmbed = '/image/dl_contants2.jpg';
                    }
                    if (newArr[i].outlink) targeting = 'target="_blank"';
                    if (newArr[i].outlink && d_code == 24) targeting = '_blank';

                    var alink = newArr[i].link;
                    if (alink == '') alink = '#';
                    //링크없음으로 배너를 추가할 경우 링크 빈생성
                    $('<li data-link="' + alink + '" data-target="' + targeting + '"></li>').appendTo(_thisLi.find('>ul.dealersSlide')).html('<img src="' + imgEmbed + '" alt="">');
                    mainImg[i].onerror = function (i) {
                      _thisLi.find('>ul.dealersSlide').find('>li').eq(i).html('<img src="/image/dl_contants2.jpg" alt="">');
                    };
                    mainImg[i].src = imgEmbed;
                  }
                  //for
                } else {
                  for (var i = 0; i < newArr.length; i++) {
                    var targeting = '';
                    mainImg[i] = new Image();
                    if (newArr[i].image.length > 0) {
                      //이미지가 있을 경우
                      var imgEmbed = newArr[i].image;
                    } else {
                      var imgEmbed = '/image/dl_contants2.jpg';
                    }
                    if (newArr[i].outlink) targeting = 'target="_blank"';

                    var alink = newArr[i].link;
                    if (alink == '') alink = '#';
                    //링크없음으로 배너를 추가할 경우 링크 빈생성
                    $('<li></li>').appendTo(_thisLi.find('>ul.dealersSlide')).css({
                      'float': 'left',
                      'display': 'block',
                      'width': Liwidth,
                    }).html('<a href="' + alink + '" ' + targeting + '><img src="' + imgEmbed + '" alt=""></a>');
                    mainImg[i].onerror = function (i) {
                      _thisLi.find('>ul.dealersSlide').find('>li').eq(i).html('<a href="#" ' + targeting + '><img src="/image/dl_contants2.jpg" alt=""></a>');
                    };
                    mainImg[i].src = imgEmbed;
                  }
                }


                _thisLi.find('>ul.dealersSlide').width(jsonTarget.length * Liwidth);
                _thisLi.append('<div style="clear:both;width:0;position:absolute;z-index:999999;left:-9999px;top:-9999px;"></div>');
                if (d_code == 24) {
                  console.log("tmkr")
                  $('.slideArea').viSimpleSlider({
                    autoPlay: true,
                    autoTime: 3500,
                    speed: 800,

                  });
                } else {
                  dealersEventSlide(_thisLi, newArr);
                }
                _thisLi.find('>ul.dealersSlide').find('>li').each(function (index) {
                  var _thisBtn = $(this).find('>a');
                  BannerCtrl(_thisBtn);
                });
              }
              //if 이벤트가 존재한다면

            }
            //if
          } else {
            //그외에는 단순히 배너삽입 (슬라이드 아닌 우측 배너들)
            var targeting = '';
            if (_data.main.banner[index].link.length > 0) {
              //링크값이 있다면 링크 생성
              if (_data.main.banner[index].outlink) targeting = 'target="_blank"';
              //아웃링크일 경우 타겟팅 변경
              _thisLi.html('<a href="' + _data.main.banner[index].link + '" ' + targeting + '><img src="' + _data.main.banner[index].image + '" alt=""></a>');
              BannerCtrl(_thisLi.find('>a'));
            } else {
              //링크값이 없으면 이미지만 등록
              _thisLi.html('<img src="' + _data.main.banner[index].image + '" alt="">');
            }
            //if
          }
          //if
        });
        //each - 각 사이드 배너 생성
        fadeSlide.settings();
      }

      //----------------- 1 - 1. 메인 사이드 배너 컨트롤
      function BannerCtrl(ele) {
        ele.on('click', function (e) {
          var _this = $(this);
          if (_this.attr('target') !== "_blank" && _this.attr('href').length > 0) {
            var numbers = Number(_this.attr('href'));
            if (numbers == 99) {
              $lnb_title.find('>ul').find('>li.event').click();
            } else {
              $lnb_title.find('>ul').find('>li').eq(numbers).click();
            }
            commonjs.eventClick(e);
          }
          if (_this.attr('href') == '') {
            commonjs.eventClick(e);
          }
        })

      }

      //----------------- 2. 페이드 메인 슬라이드 만들기
      var fadeSlide = {
        //--------- 페이드 슬라이드 셋팅
        settings: function () {
          _data2 = _data.main.rolling_main;
          fadeSlideMax = _data2.length;
          fadeSlide.mkIndicate(_data2, _target1);
          fadeSlide.mkSlide(_data2, _target1);
          fadeSlide.autoSlide();
        },

        //--------- 인디케이트 만들기
        mkIndicate: function (data, target) {
          for (var i = 0; i < fadeSlideMax; i++) {
            $('<li></li>').appendTo(target.find('>div.indicate').find('>ul')).html('<a href="#none">0' + (i + 1) + '</a>');
            $('<li></li>').appendTo($('div.dl_mSlideInd').find('>ul')).html('<a href="#none">0' + (i + 1) + '</a>');
          }
          //for
          target.find('>div.indicate').find('>ul').find('>li').each(function (index) {
            var _this = $(this);
            _this.find('>a').on('click', function (e) {
              var _this = $(this);
              //                            console.log('fadeSlideCurrent ' + fadeSlideCurrent + ' / ' + index);
              if (fadeSlideCurrent !== index) {
                fadeSlidePrev = fadeSlideCurrent;
                _this.addClass('current').siblings().removeClass('current');
                fadeSlideCurrent = index;
                fadeSlide.Slideshow(fadeSlideCurrent);
              }
              //if
              commonjs.eventClick(e);
            }).hover(function (e) {
              window.clearInterval(fadeSetInt);
            }, function (e) {
              fadeSlide.autoSlide();
            });
          });
          //each

          $('div.dl_mSlideInd').find('>ul').find('>li').each(function (index) {
            var _this = $(this);
            _this.find('>a').on('click', function (e) {
              if (fadeSlideCurrent !== index) {
                _this.addClass('current').siblings().removeClass('current');
                fadeSlideCurrent = index;
                fadeSlide.Slideshow(fadeSlideCurrent);
              }
              //if
              commonjs.eventClick(e);
            });
          });

          target.find('>div.indicate').find('>ul').find('>li').eq(0).addClass('current');
          $('div.dl_mSlideInd').find('>ul').find('>li').eq(0).addClass('current');
        },

        //--------- 슬라이드 만들기
        mkSlide: function (data, target) {
          $('.dl_mSlide').append('<ul></ul>'); //모바일용 슬라이드 공간 만들기

          target.find('>ul').empty();
          for (var i = 0; i < fadeSlideMax; i++) {
            var op = 0;
            if (i == 0) op = 1;
            $('<li></li>').appendTo(target.find('>ul')).css({
              'opacity': op,
              'background': '#fff url("' + data[i].image + '") 50% 50% no-repeat',
              'background-size': 'cover',
              //                            'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + data[i].image + '", sizingMethod="scale")',
              'z-index': 10 - i,
            });

            $('<li></li>').appendTo($('.dl_mSlide').find('>ul')).css({
              'opacity': op,
              'background': '#fff url("' + data[i].image + '") 50% 50% no-repeat',
              'background-size': 'cover',
              //                            'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + data[i].image + '", sizingMethod="scale")',
              'z-index': 10 - i,
            }).html('<a href="#none"></a>');

            /*링크 체크*/
            if (!(data[i].link == '' && !data[i].outlink)) {
              if (data[i].outlink) var insertHtmlAnc = '<a href="' + data[i].link + '" target="_blank"></a>';
              else if (!data[i].outlink) var insertHtmlAnc = '<a href="' + data[i].link + '"></a>';
              target.find('>ul').find('>li').eq(i).html(insertHtmlAnc);
              $('.dl_mSlide').find('>ul').find('>li').eq(i).html(insertHtmlAnc);
              BannerCtrl(target.find('>ul').find('>li').eq(i).find('>a'));
              BannerCtrl($('.dl_mSlide').find('>ul').find('>li').eq(i).find('>a'));

            }
          }
          ;
          //for
        },

        //--------- 슬라이드 쇼 효과
        Slideshow: function (Num) {
          _target1.find('>div.indicate').find('>ul').find('>li').eq(Num).addClass('current').siblings().removeClass('current');
          $('div.dl_mSlideInd').find('>ul').find('>li').eq(Num).addClass('current').siblings().removeClass('current');
          //인디케이트 활성화 시키기

          _target1.find('>ul').find('>li').each(function (index) {
            var _this = $(this);
            if (index == Num) {
              //현재
              _this.stop().css({'z-index': 11}).animate({'opacity': 1}, 1000);
            } else if (index == fadeSlidePrev) {
              _this.stop().css({'z-index': 10}).animate({'opacity': 0}, 1000);
              //이전
            } else {
              //그 외
              _this.stop().css({'opacity': 0, 'z-index': 1});
            }
          });
          //each

          $('.dl_mSlide').find('>ul').find('>li').each(function (index) {
            var _this = $(this);
            if (index == Num) {
              //현재
              _this.stop().css({'z-index': 11}).animate({'opacity': 1}, 1000);
            } else if (index == fadeSlidePrev) {
              _this.stop().css({'z-index': 10}).animate({'opacity': 0}, 1000);
              //이전
            } else {
              //그 외
              _this.stop().css({'opacity': 0, 'z-index': 1});
            }
          });
          //each
        },

        //--------- 자동 슬라이드
        autoSlide: function (time) {
          window.clearInterval(fadeSetInt);
          fadeSetInt = window.setInterval(function () {
            fadeSlidePrev = fadeSlideCurrent;
            if (fadeSlideCurrent < fadeSlideMax - 1) {
              fadeSlideCurrent++;
            } else {
              fadeSlideCurrent = 0;
            }
            //                        console.log('fadeSlideCurrent ' + fadeSlideCurrent + ' fadeSlideMax ' + fadeSlideMax);
            fadeSlide.Slideshow(fadeSlideCurrent);
          }, 3500);
        },
      }

      //----------------- 3. 이벤트쪽 슬라이딩 기능
      function dealersEventSlide(ele, data) {
        var _dealersSlide = ele.find('>ul.dealersSlide');
        var currentSD = 0,
          maxSD = data.length - 1;
        var SetInt;
        var setTimes;

        ele.css('position', 'relative');

        //----------------- mkIndicate - 인디케이트 만들기
        function mkIndicate() {
          $('<div class="indicate"></div>').appendTo(ele).css({
            'position': 'absolute',
            'width': '100%',
            'bottom': '10px',
            'z-index': '10',
            'text-align': 'center',
          });
          var _target = ele.find('.indicate');
          for (var i = 0; i < maxSD + 1; i++) {
            $('<a href="#"></a>').appendTo(_target).html('<img src="/image/slide_indicate_normal.png">').on('click', function (e) {
              currentSD = $(this).index();
              motionSD(currentSD);
              commonjs.eventClick(e);
            }).css({
              'display': 'inline-block',
              'margin-right': '15px',

            });
          }
          //for
        }


        //----------------- mkArrow - 화살표 만들기
        function mkArrow() {
          $('<a href="#" class="arrowBtn prev"></a>').appendTo(ele).html('<img src="/image/mainSlide/Btn_arrow_left.png">').on('click', function (e) {
            if (currentSD > 0) {
              currentSD--;
            } else {
              currentSD = maxSD;
            }
            motionSD(currentSD);
            commonjs.eventClick(e);
          }).css({
            'left': '20px',
          });
          $('<a href="#" class="arrowBtn next"></a>').appendTo(ele).html('<img src="/image/mainSlide/Btn_arrow_right.png">').on('click', function (e) {
            if (currentSD < maxSD) {
              currentSD++;
            } else {
              currentSD = 0;
            }
            motionSD(currentSD);
            commonjs.eventClick(e);
          }).css({
            'right': '20px',
          });
          ele.find('.arrowBtn').css({
            'display': 'block',
            'position': 'absolute',
            'width': '40px',
            'height': '40px',
            'bottom': 'auto',
            'top': '50%',
            'margin-top': '-20px',
            'z-index': '120',
          })
        }

        //----------------- motionSD - 슬라이딩 모션 만들기
        function motionSD(num) {
          _dealersSlide.stop().animate({
            'margin-left': -ele.width() * num,
          }, 400, 'easeInOutQuint');
          ele.find('.indicate').find('>a').each(function (index) {
            var _this = $(this);
            if (index !== num) {
              _this.html('<img src="/image/slide_indicate_normal.png">')
            } else {
              _this.html('<img src="/image/slide_indicate_active.png">')
            }
          });
        }

        //----------------- autoSD - 자동 슬라이드 만들기
        function autoSD() {
          window.clearInterval(SetInt);
          SetInt = window.setInterval(function () {
            if (currentSD < maxSD) {
              currentSD++;
            } else {
              currentSD = 0;
            }
            motionSD(currentSD);
          }, 2500);

        }

        mkIndicate();
        mkArrow();
        motionSD(0);
        autoSD();

        //----------------- hover - 자동 슬라이드에 대한 컨트롤
        ele.hover(function (e) {
          window.clearInterval(SetInt);
        }, function (e) {
          autoSD();
        });

        /******** 리사이즈에 대한 정의 ***********/
        function reszSet() {
          //리사이즈
          var Liwidth = ele.outerWidth();
          window.clearTimeout(setTimes);
          setTimes = window.setTimeout(function () {
            $('ul.dealersSlide').width(jsonTarget.length * Liwidth);
            $('ul.dealersSlide').find('>li').width(Liwidth);
            //                        $dl_visual.find('>ul>li').height($('.dl_cont').height());
            //메인비주얼의 높이를 우측 컨텐츠의 높이에 동일하게 맞추기 위해서
          }, 100);
          motionSD(0);
        };
        resizeModule(function () {
          reszSet();
        });
        $(window).load(function () {
          reszSet();
        });
        /******** 리사이즈에 대한 정의 끝 ***********/

        $('.dl_pop').find('.dl_close').on('click', function (e) {
          reszSet();
          commonjs.eventClick(e);
        });
      }

      //----------------- 4. 서브 컨텐츠 바인딩
      function mkDealersSub() {
        $dl_pop.find('>ul').empty();
        for (var i = 0; i < _data.sub.length; i++) {
          var usemaps = '';
          if (_data.sub[i].title.length > 0) {
            $('<li class="subpage' + i + '"></li>').appendTo($dl_pop.find('>ul')).html('<h4>' + _data.sub[i].title + '</h4><div class="dp_cont"></div>');
            params.subpageNum = i;
            parseHTML(url_dealers_subpage, "GET", params, $dl_pop.find('>ul').find('li.subpage' + i).find('.dp_cont'));
            //이미지가 있을 경우
            var insertImg = _data.sub[i].image;
            if (_data.sub[i].imageMap) {
              usemaps = 'usemap="#map' + i + '"';
            }
            //이미지맵 존재
            if (_data.sub[i].imageMap) {
              $('<map name="map' + i + '"><area shape="rect" coords="' + _data.sub[i].mapping + '" href="' + _data.sub[i].download + '" alt=""></map>').appendTo($dl_pop.find('>ul').find('>li.subpage' + i).find('.dp_cont'));

            }
            //이미지맵 존재
          }
          //if
        }
        //for
        //여기서부터 이벤트 추가
        $('<li class="subpageEvent"></li>').appendTo($dl_pop.find('>ul')).html('<h4>이벤트</h4><div class="dp_cont"></div>');
        var ele = $dl_pop.find('>ul').find('>li.subpageEvent');
        $('<div class="dp_event"><ul></ul></div>').appendTo(ele);
        CallEventAjax(ele);

        //여기서부터 개인정보 추가
        $('<li class="personal_info info"></li>').appendTo($dl_pop.find('>ul')).html('<h4>개인정보처리방침</h4><div class="dp_cont"></div>');
        var ele2 = $dl_pop.find('>ul').find('>li.personal_info');
        parseHTML(url_privacy, "GET", params, ele2.find('.dp_cont'));
      }

      //----------------- 5. 서브 컨텐츠 레이어 팝업 - 컨텐츠 선택하여 보여주기 (모바일에서 lnb 클릭했을 때 위치 이동 포함)
      function openContents(num) {
        currentLi = num;
        popupOpen = true;
        //                $dl_cont.find('>.dl_contInner').hide();
        $dl_pop.find('>ul').find('>li').hide(); //딜러사 수정을 위한 추가 코드
        $dl_pop.find('>ul').find('>li').eq(currentLi).show();//딜러사 수정을 위한 추가 코드
        $dl_pop.show();
        $dl_pop.find('>ul').find('>li').find('.dp_cont').find('img').rwdImageMaps();
        CheckRsz();
        if (commonjs.isMobile()) {
          //모바일일 경우
          var mg = $('#header').height() + $('.lnb_title').height();
          commonjs.scrollToBody($dl_pop.find('>ul').offset().top - mg, 400);
          //                    commonjs.scrollToBody($dl_pop.find('>ul').find('>li').eq(num).offset().top-mg,400);
          //딜러사 수정을 위한 주석
        } else {
          $dl_pop.find('.dl_close').show();
          //PC일 경우
          $('#wrap').addClass('dealer_open');
          $dl_pop.scrollTop(0);
          //                    commonjs.scrollToDiv($dl_pop, 0,400);
          //                    commonjs.scrollToDiv($dl_pop, setOffset(num),400);
          //딜러사 수정을 위한 주석
        }
      }

      //----------------- 6. 이벤트 디테일 페이지 컨텐츠 호출
      function CallEventAjax(ele) {
        $.ajax({
          type: "GET",
          url: url_dealers_event,
          dataType: "JSON",
          data: params,
          //                 //cache: false,
          success: function (data) {
            var attImg = new Image();
            var insertImg = data.current.image;
            attImg.onload = function () {
              ele.find('.dp_cont').html('<img src="' + insertImg + '">');
            };
            attImg.src = insertImg;

            if (data.prev.title.length > 0) {
              $('<li></li>').appendTo(ele.find('.dp_event').find('>ul')).html('<a href="#none" class="eventPrev"><dl><dt>이전 이벤트</dt><dd>' + data.prev.title + '</dd></dl></a>').on('click', function (e) {
                ele.find('.dp_event>ul').empty();
                params = {"d_code": d_code, "idx": data.prev.idx};
                //                                console.log(params)
                CallEventAjax(ele);
                commonjs.eventClick(e);
              });
            }
            if (data.next.title.length > 0) {
              $('<li></li>').appendTo(ele.find('.dp_event').find('>ul')).html('<a href="#none" class="eventNext"><dl><dt>다음 이벤트</dt><dd>' + data.next.title + '</dd></dl></a>').on('click', function (e) {
                ele.find('.dp_event>ul').empty();
                params = {"d_code": d_code, "idx": data.next.idx};
                //                                console.log(params)
                CallEventAjax(ele);
                commonjs.eventClick(e);
              });
            }
          }, error: function (XMLHttpRequest, textStatus, errorThrown) {
            var h = $('.dl_pop').height() - 110;
            ele.find('.dp_cont').html('등록된 이벤트가 없습니다.').height(h);
            ele.find('.dp_cont').css('line-height', h + 'px');
            //                     console.log("Status: " + textStatus);
          }, timeout: 5000,
        });
      }

      function CheckRsz() {
        if (commonjs.isMobile()) {
          //m
          $dl_pop.find('.dl_close').hide();
          $dl_pop.css('position', 'relative');
          $('#wrap').removeClass('dealer_open');
        } else {
          //pc
          if (popupOpen) {
            $('#wrap').addClass('dealer_open');
            $dl_pop.find('.dl_close').show();
          }
          $dl_pop.css('position', 'fixed');
        }
      }

      // 리사이즈에 대한 높이 정책
      resizeModule(function () {
        CheckRsz();
      });

      $dl_pop.find('.dl_close').on('click', function (e) {
        popupOpen = false;
        $dl_pop.scrollTop(0);
        $(this).hide();
        //                $dl_cont.find('>.dl_contInner').show();
        $dl_pop.hide();

        $('#wrap').removeClass('dealer_open');
        $dl_cont.find('.dl_pop').removeClass('dl_popOpen');
        $lnb_title.find('>ul>li').removeClass('current');
        commonjs.eventClick(e);
        currentLi = 0;
      });
      //클로즈 버튼 클릭
    },

    /* ----------------------------------------------------------------------- (x. 유틸리티 - 개인정보 정책) - 스크롤 컨트롤 시작 */
    termsCtrl: function () {
      var $terms_cont = $('div.terms_cont');
      $terms_cont.find('.terms_left').find('ol').find('>li').each(function (index) {
        var _this = $(this);
        _this.on('click', function (e) {
          commonjs.scrollToBody($('#terms' + (index + 1)).offset().top - $('#header').height(), 400);
          commonjs.eventClick(e);
        });
      });
    },

    /* ----------------------------------------------------------------------- (x. 유틸리티 - 컨텍트) - 이메일폼 */
    contactform: function () {
      var submitBtn = $('.tr_perpose').find('a.submit'),
        $title = $('#cinput_title'),
        $name = $('#cinput_name'),
        $email1 = $('#cinput_email1'),
        $email2 = $('#cinput_email2'),
        $emailselect = $('#cinput_emailselect'),
        $tel1 = $('#cinput_tel1'),
        $tel2 = $('#cinput_tel2'),
        $tel3 = $('#cinput_tel3'),
        $hascar = $('#cinput_hascar'),
        $content = $('#cinput_content');
      var emailCheck = /([a-z\d\.-]+)\.([a-z\.]{2,6})$/; // 이메일 검사
      var telCheck = /^[0-9]{3,4}$/; // 전화번호 검사

      $emailselect.change(function () {
        if ($emailselect.val() == '직접입력') {
          $email2.val('').attr("readonly", false);
        } else {
          $email2.val($emailselect.val()).attr("readonly", true);
        }
      });

      submitBtn.on('click', function (e) {
        checkForm();
        commonjs.eventClick(e);
      });

      //submit버튼 클릭
      function checkForm() {

        var agree2 = $(':radio[name="agree2"]:checked').val();

        if ($title.val().length == 0) {
          alert('제목을 입력하여 주세요.');
          $title.focus();
          return false;
        } else if ($name.val().length == 0) {
          alert('이름을 입력하여 주세요.');
          $name.focus();
          return false;
        } else if ($email1.val().length == 0) {
          alert('이메일 주소를 확인해주세요.');
          $email1.focus();
          return false;
        } else if ($email2.val().length == 0 || emailCheck.test($email2.val()) != true) {
          alert('이메일 주소를 확인해주세요.');
          $email2.focus();
          return false;
          /*} else if ($tel2.val().length == 0) {
                    alert('전화번호를 입력해주세요.');
                    $tel2.focus();
                    return false;
                } else if ($tel3.val().length == 0) {
                    alert('전화번호를 입력해주세요.');
                    $tel3.focus();
                    return false;
                } else if (telCheck.test($tel2.val()) != true || telCheck.test($tel3.val()) != true) {
                    alert('전화번호를 확인해주세요.');
                    $tel2.focus();
                    return false;*/
        } else if ($hascar.val().length == 0) {
          alert('차량 유무를 선택해주세요.');
          $hascar.focus();
          return false;
        } else if ($content.val().length == 0) {
          alert('접수 내용을 입력해주세요.');
          $content.focus();
          return false;
        } else if ($('.trp_head').find('#no').is(':checked') || (!$('.trp_head').find('#no').is(':checked') && !$('.trp_head').find('#yes').is(':checked'))) {
          alert('개인정보 수집 및 이용목적에 동의해 주세요.')
          return false;
          //} else if ($("input:radio[name='agree2']").is(":checked") == false){
        } else if (agree2 != "Y") {
          alert('개인정보의 제3자 제공 항목에 동의하셔야 문의가 가능합니다.')
          return false;
        }
        var userPhoneNumber = $tel1.val() + '-' + $tel2.val() + '-' + $tel3.val();
        var userEmail = $email1.val() + '@' + $email2.val();
        var params = {
          "title": $title.val(),
          "name": $name.val(),
          "email": userEmail,
          "phone": userPhoneNumber,
          "car": $hascar.val(),
          "content": $content.val(),
          "agree2": agree2,
        };
        $('<div id="sending"></div>').appendTo($('#wrap')).css({
          'position': 'fixed',
          'left': '0',
          'right': '0',
          'top': '0',
          'bottom': '0',
          'width': '100%',
          'height': '100%',
          'background-color': 'rgba(0, 0, 0, 0.7)',
          //                    'filter': 'progid:DXImageTransform.Microsoft.gradient(GradientType=0,startColorstr=\'#7c000000\', endColorstr=\'#7c000000\')',
          'z-index': '10003',

        }).html('<img src="/image/loading.gif" style="width:64px;height:64px;margin-top:-32px;margin-left:-32px;position:absolute;left:50%;top:50%;">');
        console.dir(params);
        //               ajaxcalling(url_contact_form, "POST", params, senddata);
        ajaxcalling_jsonp(url_contact_form, "POST", params, 'json', 'Callback', senddata);
      }

      //checkForm
      function senddata(data) {
        $('#sending').remove();
        //                 if(data == "result=true"){
        if (data.result) {
          alert("온라인 문의가 접수되었습니다.");
          $title.val('');
          $name.val('');
          $email1.val('');
          $email2.val('');
          $tel2.val('');
          $tel3.val('');
          $content.val('');
          $('.trp_head').find('#yes').prop('checked', false);
          $('.trp_head').find('#no').prop('checked', false);
          $('input:radio[name="agree2"]').removeAttr("checked");
        } else {
          alert("접수가 실패하였습니다. \n관리자에게 문의하세요.");
        }
      }

      //senddata
    },

    /* ----------------------------------------------------------------------- 현재 위치 만들기 (선택) */
    mkLocation: function () {
      //서비스, 인사이드, 디테일
      var _depth1 = depth1,
        _depth2 = depth2;
      if (_depth1 == 99 || _depth1 == 98) _depth1 = 0;
      var _data = iaData;
      var target = $('.sub_contInner > .sub_tree').find('ol'),
        addText = '<span>&gt;</span>';
      target.empty();
      $('<li></li>').appendTo(target).html('<a href="/" >HOME</a><span>&gt;</span>');

      //홈 - 토요타 - 컴패니
      if (_depth1 == 0 && _depth2 == 0 && !(depth1 == 98 || depth1 == 99)) {
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][0].url + '" >' + _data[_depth1][0].d1name + '</a>' + addText); //1뎁스
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][1][_depth2][0].url + '" >' + _data[_depth1][1][_depth2][0].d2name + '</a>'); //2뎁스
      } else if (_depth1 == 0 && _depth2 == 0 && (depth1 == 98 || depth1 == 99)) {
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][0].url + '" >' + _data[_depth1][0].d1name + '</a>' + addText); //1뎁스
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][1][_depth2][0].url + '" >' + _data[_depth1][1][_depth2][0].d2name + '</a>' + addText); //2뎁스
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][1][_depth2][1][depth3].url + '" >' + _data[_depth1][1][_depth2][1][depth3].d3name + '</a>'); //3뎁스
      }

      //홈 - 토요타 - 서비스 - 하위(마지막 한글 나눔고딕)
      if (_depth1 == 0 && _depth2 == 1) {
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][0].url + '" >' + _data[_depth1][0].d1name + '</a>' + addText); //1뎁스
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][1][_depth2][0].url + '" >' + _data[_depth1][1][_depth2][0].d2name + '</a>' + addText); //2뎁스
        if (_data[_depth1][1][_depth2][1][depth3] !== undefined) $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][1][_depth2][1][depth3].url + '" style="font-family : ng">' + _data[_depth1][1][_depth2][1][depth3].d3name + '</a>');
      }

      //홈 - 토요타 - 인사이드 - 하위
      if (_depth1 == 0 && _depth2 == 2) {
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][0].url + '" >' + _data[_depth1][0].d1name + '</a>' + addText); //1뎁스
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][1][_depth2][0].url + '" >' + _data[_depth1][1][_depth2][0].d2name + '</a>' + addText); //2뎁스
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][1][_depth2][1][depth3].url + '" style="font-family : ng">' + _data[_depth1][1][_depth2][1][depth3].d3name + '</a>');
      }

      //모델 - 안함

      //홈 - 스마트 하이브리드
      if (_depth1 == 2) {
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][0].url + '" >' + _data[_depth1][0].d1name + '</a>'); //1뎁스
      }
      if (_depth1 == 3) {
        $('<li></li>').appendTo(target).html('<a href="' + _data[_depth1][0].url + '" >' + _data[_depth1][0].d1name + '</a>'); //1뎁스
      }
    },

    /* ----------------------------------------------------------------------- 상단 고정 비주얼 만들기 (선택) */
    mkTop: function () {
      var $container = $('#container'),
        cal;
      $('#wrap').prepend('<div id="vrDiv" style="position:relative;opacity:0;width:100%;" class="coverDiv"></div>');

      function rsz() {
        var wh = $(window).height(),
          headh = $('#header').height(),
          lnb_wraph = $('.lnb_wrap > h2').height();

        cal = wh - (lnb_wraph + headh);
        $('#vrDiv').css('height', cal);
      }

      //rsz
      $('.sub_visual').addClass('bgsize');
      $('.sub_visualModel').addClass('bgsize');
      $('.vision_list').css({backgroundSize: "cover"});

      function bgSize() {
        var _this = $('.bgsize');
        var bg = _this.css('background-image');
        bg = bg.replace('url(', '').replace(')', '');
        _this.css({
          'background-size': 'cover',
          //                    'filter': 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + bg + '", sizingMethod="scale")'
        });
      }

      bgSize();
      rsz();
      $('#container').show();
      resizeModule(function () {
        rsz();
      });
    },

    /* ----------------------------------------------------------------------- 스크롤 이벤트에 의한 GNB 인터렉션 */
    scollEvent: function () {
      var $company_wrap = $('.sub_wrap'),
        $sub_visual = $('.sub_visual'),
        $sub_visualText = $sub_visual.find('.sub_visualText');
      //            var $logo = $('#header').find('h1');
      $(window).scroll(function (e) {
        var sclVal = $(window).scrollTop();
        if (commonjs.isMobile()) {
          //m
          var targetTop = $('#container').offset().top;
        } else {
          //pc
          var targetTop = $('#container').offset().top - $('#header').height();
        }
        if (mobileUI) targetTop = targetTop + 34;
        if (sclVal > targetTop) {
          if (!$company_wrap.hasClass('fix') && !(depth1 == 3 && depth2 == 1 && !(commonjs.isMobile()))) {
            $company_wrap.addClass('fix');
          }
        } else {
          $company_wrap.removeClass('fix');
          var btmCal = (sclVal * 0.3);
          var btmCal2 = -(sclVal * 0.15);
          $sub_visualText.css('padding-bottom', btmCal);
          $('.sub_visual').css('margin-top', btmCal2);
          $('.sub_visualModel').css('margin-top', btmCal2);
        }
        // lnb 포지션 fix 하기 위한 이벤트

      });
    },

    /* ----------------------------------------------------------------------- lnb 정의 */
    lnbCtrl: function () {
      var $lnb_title = $('.lnb_title');
      var _sectionName;
      if (window.__sectionName) {
        _sectionName = window.__sectionName;
      } else if (depth1 == 0 && depth2 == 0) {
        //토요타 - 컴패니
        _sectionName = [$('.sub_contText.vision'), $('.sub_contText.bi'), $('.sub_contText.history'), $('.sub_contText.contribution_wrap'), $('.sub_contText.news')];
      } else if (depth1 == 1) {
        //모델
        // var _sectionName = [$('#model'), $('#exterior'), $('#interior'), $('#features'), $('#gallery'), $('#colors'), $('#specs')];
        _sectionName = [$('#model'), $('#exterior'), $('#interior'), $('#features'), $('#gallery'), $('#specs'), $('#footer')];

        // 20170517 비디오 탭 추가
        if (depth1 == 1 && depth2 == 10) {
          _sectionName = [$('#model'), $('#exterior'), $('#interior'), $('#features'), $('#video'), $('#gallery'), $('#colors'), $('#specs')];
        }
        if (depth2 == 13) {
          _sectionName = [$('#model'), $('#exterior'), $('#interior'), $('#features'), $('#gallery'), $('#specs'), $('#specs')];
        }
        if (depth2 == 12) {
          _sectionName = [$('#model'), $('#exterior'), $('#interior'), $('#features'), $('#specs'), $('#footer')];
        }
        // 20171222 스팩 수정
        if (depth2 == 10) {
          _sectionName = [$('#model'), $('#exterior'), $('#interior'), $('#features'), $('#video'), $('#gallery'), $('#specs'), $('#footer')];
        }
        // 20180312 프리우스 C
        if (depth2 == 14) {
          _sectionName = [$('#model'), $('#features'), $('#exterior'), $('#interior'), $('#gallery'), $('#specs'), $('#footer')];
        }

      } else if (depth1 == 2) {
        //스마트 하이브리드
        _sectionName = [$('.smart.bg_white'), $('.sm_people'), $('.qa.bg_white')];
      }
      $lnb_title.find('h3').on('click', function () {
        $lnb_title.toggleClass('lnb_open');
      });
      //if open toggle menu

      if ((depth1 == 0 && depth2 == 0) || depth1 == 1 || depth1 == 2) {
        //토요타 - 컴패니 , 모델, 스마트 하이브리드 >> 원페이지 스크롤이라 모셔닝 주기 위해서
        if (depth1 == 1) {
          /************* 테스트하기 위해 임시로 변수 정의 및 변환 ************/
          //                    if(depth2 == 10)depth2 = 7;
          /**************************************************************/

          //모델 : 원페이지 스크롤
          $('.lnb_wrap').find('.lnb_title').find('ul > li').each(function (index) {
            var _thisLi = $(this);
            _thisLi.html('<a href="#">' + iaData[depth1][1][depth2][1][index].d3name + '</a>'); //모델의 - 서브 메뉴 명칭입력
          });
          //each
          if (iaData[depth1][1][depth2][0].pdf !== undefined && iaData[depth1][1][depth2][0].pdf != "") {
            $('<li class="havPdf"><a href="#" id="downloadpdf" onclick="ga(\'send\', \'event\', \'Click\', \'E-CATALOGUE 다운로드 : ' + iaData[depth1][1][depth2][1][0].d3name + ' \');">E-CATALOGUE</a></li>').appendTo($('.lnb_wrap').find('.lnb_title').find('ul'));
            _sectionName.push($('#downloadpdf'));
            $('#downloadpdf').on('click', function (e) {
              if (commonjs.isMobile()) {
                var downURL = '/Upload/manual/' + iaData[depth1][1][depth2][0].pdf + '';
              } else {
                var downURL = 'http://www.toyota.co.kr/download/down.aspx?filename=' + iaData[depth1][1][depth2][0].pdf + '&type=manual';
              }
              //location.href = downURL;
              window.open(downURL, '_blank');
              commonjs.eventClick(e);
            });
          }
        }
        $lnb_title.find('ul').find('li').each(function (index) {
          var _this = $(this);
          if (!_this.hasClass('havPdf')) {
            _this.find('>a').on('click', function (e) {
              if (commonjs.isMobile()) {
                //모바일일 경우
                var mg = $('#header').height() + $('.lnb_title').height();
              } else {
                //pc
                var mg = $('#header').height();
              }
              if ($(this).is('.go_link')) {
                return;
              }
              if (depth2 == 99) {
                return;
              }
              commonjs.scrollToBody(_sectionName[index].offset().top - mg, 400);
              $lnb_title.removeClass('lnb_open');
              if (depth1 !== 1) {
                $lnb_title.find('h3').html($(this).text());
              }
              commonjs.eventClick(e);
            });
            //lnb 클릭
          }
        });
        if (loc >= 0) {
          $lnb_title.find('ul').find('li').eq(loc).find('>a').click();
        }
        //each
        if (depth2 == 99) {
          return;
        }
        $(window).scroll(function (e) {
          var sclVal = $(window).scrollTop();
          var mg = $('#header').height() + $('.lnb_wrap').height();
          for (var i = 0; i < _sectionName.length; i++) {
            var prevVal = _sectionName[i].offset().top - mg - 80;
            if (i == _sectionName.length - 1) {
              var nextVal = $('#footer').offset().top;
            } else {
              // console.log($lnb_title.find('ul').find('li').eq($lnb_title.find('ul').find('li').length - 1).hasClass('havPdf'))
              var nextVal = _sectionName[i + 1].offset().top - mg;
            }
            if (sclVal >= prevVal && sclVal < nextVal) {
              $lnb_title.find('ul').find('li').eq(i).addClass('current').siblings().removeClass('current');
            }
          }
        });
        //scroll
      } else if (depth1 == 0 && (depth2 == 1 || depth2 == 2)) {
        //토요타이고 서비스 , 인사이드
        var targetLnb = $('.lnb_wrap').find('.lnb_title').find('>ul');
        targetLnb.empty();
        for (var i = 0; i < iaData[depth1][1][depth2][1].length; i++) {
          if (iaData[depth1][1][depth2][1][i].d3name == '뉴스레터') {
            $('<li style="display:none;"></li>').appendTo(targetLnb).html('<a href="' + iaData[depth1][1][depth2][1][i].url + '">' + iaData[depth1][1][depth2][1][i].d3name + '</a>');
          } else {
            $('<li></li>').appendTo(targetLnb).html('<a href="' + iaData[depth1][1][depth2][1][i].url + '">' + iaData[depth1][1][depth2][1][i].d3name + '</a>');
          }
          if (i == depth3) targetLnb.find('>li').eq(i).addClass('current');
        }
        //for
        /*console.log(iaData[depth1][1][depth2][1].length)
                $('.lnb_wrap').find('.lnb_title').find('ul > li').each(function(index){
                    var _thisLi = $(this);
                    _thisLi.html('<a href="' + iaData[depth1][1][depth2][1][index].url + '">' + iaData[depth1][1][depth2][1][index].d3name + '</a>');
                    if(index == depth3)_thisLi.addClass('current');
                });
                //each*/
      } else if (depth1 == 99 && (depth2 == 2)) {
        //디테일이고 인사이드
        var _depth1 = depth1;
        _depth1 = 0;
        $('.lnb_wrap').find('.lnb_title').find('ul > li').each(function (index) {
          var _thisLi = $(this);
          _thisLi.html('<a href="' + iaData[_depth1][1][depth2][1][index].url + '">' + iaData[_depth1][1][depth2][1][index].d3name + '</a>');
          if (index == depth3) _thisLi.addClass('current');
        });
        //each
      }
      //if
    },

  }
  //subPage

  /* ----------------------------------------------------------------------- (공통) 퀵메뉴 만들기 */

  $quickToggle.on('click', function (e) {
    var $this = $(this);
    console.log($this.hasClass('active'))
    if ($this.hasClass('active')) {
      $this.removeClass('active');
      $quickmenu.removeClass('active');
    } else {
      $this.addClass('active');
      $quickmenu.addClass('active');
    }
    commonjs.eventClick(e);
  });

  $quickmenu.find('.dim.black').bind('touchstart click', function (e) {
    commonjs.eventClick(e);
  });

  $quickmenu.find('>ul').find('>li').each(function (index) {
    var $this = $(this);
    $this.on('click', function (e) {
      if (index == 0) {
        if ($('#newsletterJoin').hasClass('dt_open')) $('#newsletterJoin').find('.drive_testInner .close').find('>a').click();
        $quickToggle.click();
        $nav.find('#openDrive').click();
      } else if (index == 1) {
        window.location = '/dealers/dealers.aspx';
      } else if (index == 2) {
        window.location = '/inside/inside_benefit.aspx';
      }
    })
  });

  $(window).load(function () {
    $('body').find('>iframe').css({'position': 'absolute', 'bottom': 0});

    /* ----------------------------------------------------------------------- 토요타 - 인사이드 - 각 페이지 로딩 후 자동 페이지 올라가기 (이벤트 제외) */
    if (depth1 == 0 && depth2 == 1 && depth3 !== 0) {
      var gotoScroll = $(window).height() - $('#header').height();
      $('html,body').scrollTop(gotoScroll);
    }
    ;

    /* ----------------------------------------------------------------------- 딥링크 : 시승신청 자동오픈 */
    if (openpopup == "yes") {
      $nav.find('#openDrive').click();
      /* 2016-06-13 메조트래킹태그 시작 남인식,서영광 */
      var mezzo_landing;
      var userAgent = new String(navigator.userAgent);
      if ((userAgent.search("iPhone") > -1) || (userAgent.search("iPad") > -1 || userAgent.search("Android") > -1)) {
        mezzo_landing = "http://mobile.midas-i.com/roianal.mezzo/tracking?cmp_no=1366&depth=2"; // mobile
        // alert('Mobile');
      } else {
        mezzo_landing = "http://vtag26.midas-i.com/vat-tag?cmp_no=2976&depth=2";	//web
        // alert('PC');
      }
      var img = new Image();
      img.src = mezzo_landing;
      /* 메조트래킹 끝*/

    }

    /* ----------------------------------------------------------------------- 딥링크 : gnb 모델 펼침 */
    if (modelopen == "yes") $nav.addClass('nav_on').find('.gnb2 > a').click();

    /* ----------------------------------------------------------------------- 딥링크 : 스마트 하이브리드, 보증 서비스 자동 클릭 */
    if (dymlink == "smarthybrid2") {
      //스마트 하이브리드 - 다양한 혜택 자동 클릭
      $('.lnb_title').find('ul').find('>li').eq(1).find('>a').click();
      $('.sm_people').find('.sm_tab > ul').find('>li').eq(1).find('>a').click();
    } else if (dymlink == "warranty") {
      //토요타 - 서비스 - Warranty service
      var mvtop = $('#warranty').offset().top - $nav.height();
      commonjs.scrollToBody(mvtop, 100);
    } else if (dymlink == "NsLout") {
      outNewsletterFnc();
    } else if (dymlink == "ts") {
      //토요타 - 서비스 프로그램 - 타이어
      var mvtop = $('.sub_contText.s_tire').offset().top - ($('#header').height() + $('.lnb_title').height());
      commonjs.scrollToBody(mvtop, 100);
    } else if (dymlink == "hybrid_corebenefit") {
      $('.lnb_title').find('ul').find('>li').eq(0).find('>a').click();
      $('.smart_tab > ul').find('>li').eq(1).find('>a').click();
    }

    /*민환씨 요청 코드*/
    var newsletterHt;
    //        $('.news_join .drive_testInner').height('100%');
    $('.news_join .info_viewBtn').on('click', function () {
      newsletterHt = $('.news_join .drive_testInfoPopup').height();
      $('.news_join .drive_testInner').height(newsletterHt);
    });
    $('.news_join .drive_testInfoPopupClose,.news_join .tdp_accept').on('click', function () {
      //            $('.news_join .drive_testInner').height('100%');
    });
    resizeModule(function () {
      newsletterHt = $('.news_join .drive_testInfoPopup').height();
      if ($('.dps').hasClass('dps_open')) {
        $('.news_join .drive_testInner').height(newsletterHt);
      } else {
        //                $('.news_join .drive_testInner').height('100%');
      }
    });
    var svtHt = $('.sub_visualText').height() / 2;
    if (!(depth1 == 3 && depth2 == 0)) $('.sub_visualText').css('margin-top', -svtHt);
    /*민환씨 요청 코드 끝*/

    /*민환씨 부재중 css 대신 스크립트로 css 조절*/
    $('.dp_cont').find('p').width('100%');
    /*민환씨 부재중 css 대신 스크립트로 css 끝*/
  });
});
