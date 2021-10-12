//$(document).ready(function(){
    var wt, headerHt, cont1ht, cont2ht, cont3ht, cont4ht, cont5ht, hybrid_ht;


    /*setting*/
    ht_check();

    $(window).resize(function(){
        ht_check();
    });


    function ht_check(){
        wt = $(window).width(),
        headerHt = $('.logo').height(),
        cont1ht = wt*1.5656,
        cont2ht = wt*1.5626,
        cont3ht = wt*1.5626,
        cont4ht = wt*1.5626,
        cont5ht = wt*1.5593,
        WinH = $(window).outerHeight() - 70;
//        hybrid_ht = wt*2.75;

        //gnb line-height
    var gnb_tHeight = $('.main_gnbWrap').height(),
        gnb_leng = $('.main_gnb li').length,
        gnb_aHeight = $('.main_gnb li a').height(),
        logo_boggomHt = $('.logo_label').height(),
        gnb_listMargin = (((gnb_tHeight-logo_boggomHt)/gnb_leng)-gnb_aHeight)/2;

//        $('header').height(headerHt);
        $('.contant1').height(WinH);
        $('.ct2_1').height(cont2ht);
        $('.ct2_2').height(cont3ht);
        $('.ct2_3').height(cont4ht);
        $('.ct2_4').height(cont5ht);
//        $('.hybrid_wrap').height(hybrid_ht);
        $('.container').css('margin-top',headerHt)
        $('.cont1_inner').css('margin-top',-($('.cont1_inner').height()/2))

        //gnb height
        $('.main_gnbWrap ul').css('top',logo_boggomHt);
        $('.main_gnbWrap ul li a').css({
            'margin-top':gnb_listMargin,
            'margin-bottom':gnb_listMargin
        });
    }

    /*logo 숨기기*/
    logo_sl()

    function logo_sl(){
        $(window).scroll(function(){
            var scTop = $(this).scrollTop();

            if(scTop > 10){
                $('.logo_label').addClass('logo_hide');
            } else if(scTop <= 10){
                $('.logo_label').removeClass('logo_hide');
            }
        });
    }


    /*gnb팝업*/
    $('.menu_btn').on('click', function(e){
        $('.gnb_wrap').addClass('view_gnbWrap');
        $(document).on('touchmove', function(e){
			e.preventDefault();
		});
    });
    $('.gnb_close, .gnb_inner ul li a').on('click', function(){
        $('.gnb_wrap').removeClass('view_gnbWrap');
        $(document).on('touchmove', function(e){
			$(document).unbind('touchmove');
		});
    });

    $('#nav').find('>ul>li').each(function(index){
        if(index == 0 || index == 1){
            var thisBtn = $(this);
            thisBtn.find('>a').on('click',function(e){
                thisBtn.toggleClass('active');
                e.preventDefault();
            });
        }
    })


    /*main youtube 영상 컨트롤*/
    $('.thurm_box ul li').on('click', function(){
        var tt = $(this).data('movie'),
            idx = $(this).index();

//        player.stopVideo();
        if($(this).data('movie') == 'none'){
            $('#ytplayer').hide();
            stopVideo();
            $('.player_wrap > a').show();
            if(idx == 2){
                $('.player_wrap > a').attr('href','https://youtu.be/7t3M835G8V8');
                $('.player_wrap > a img').attr('src','../../images/model_view/m_prius/image/main_popVisual3.jpg');
            } else {
                $('.player_wrap > a').attr('href','#none');
                $('.player_wrap > a img').attr('src','../../images/model_view/m_prius/image/main_popVisual2.jpg');
            }
        } else {
            $('#ytplayer').show();
            $('.player_wrap > a').hide();
            player.loadVideoById(tt);
        }

        $(this).addClass('main_pNow').siblings().removeClass('main_pNow');
    });

    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    function onYouTubePlayerAPIReady(id) {
        if(id == undefined){
            id = $('.thurm_box ul li').eq(0).attr('data-movie');
        }
        player = new YT.Player('ytplayer', {
//            height: cont1ht,
            width: wt,
            videoId: id,
            playerVars:{'controls':0, 'rel':0, 'showinfo':0 , 'showsearch':0},
            events: {
                'onReady': onPlayerReady
//                'onPlaybackQualityChange': onPlayerbackQualityChange
//                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerbackQualityChange(event){
        console.log(event.data)
    }

    function onPlayerReady(event) {
        $('.go_intMovie').addClass('play_intMovie');
        $('.go_intMovie').on('click', function(){
            $('.cont1_intro').addClass('hide_intImg');
            mbh__resizeVideo();
            $('.player_wrap').css('margin-top',-($('.player_wrap').height()/2)+'px');
            playVideo();
        });
    }

//    var done = false;
//    function onPlayerStateChange(event) {
//        console.log(event.data)
//    }

    function playVideo(){
        player.playVideo();
    }
    function stopVideo(){
        player.stopVideo();
    }
    function pauseVideo(){
        player.pauseVideo();
    }



    $('.intro_mclose').on('click', function(){
        $('.cont1_intro').removeClass('hide_intImg');
        player.pauseVideo();
    });

    if($('html').hasClass('ie ie8')){
		window.onload  = function(){
			mbh__resizeVideo();
		}
	} else {
		mbh__resizeVideo();
	}

	$(window).resize(function(){
		mbh__resizeVideo();
	});

	function mbh__resizeVideo(){
		var oVideo = document.getElementById("ytplayer"),
			oParent = oVideo.parentNode,
			resizeW = oParent.offsetWidth,
			resizeH = Math.ceil((resizeW/16) * 9);

		oVideo.setAttribute("width", resizeW);
		oVideo.setAttribute("height", resizeH);
	}



    //시퀀스
    $('.secButton').on('click', function(){
        secBtnClick();
    });

    function secBtnClick(){
        seq('.seq', '100');
        $('.ct2_2second').removeClass('seq_current').siblings().addClass('seq_current');
        $('.secButton').hide(300);

        $('.ct2_2first').removeClass('seq_current').siblings().addClass('seq_current');
    }

    $(window).load(function(){
        $('.loading_seq').hide(300);
        $('.secButton').show(300);
    });

    function seq(_target, _speed){
        $('.secButton').unbind('click');

        var nowNum = 1,
            _leng = $(_target).find('img').length;

        var set = setInterval(function(){
            if(nowNum > _leng-1){
                $('.secButton').on('click', function(){
//                        seq(_target, _speed);
                    secBtnClick();
                });

//                    $('.secButton').show(300);
                clearInterval(set);
            } else {
                $(_target).find('img').eq(nowNum).addClass('seq_current').siblings().removeClass('seq_current');
                nowNum++;
            }
        }, _speed);
    }


    //자동차 마스킹
    carHide();

    $(window).resize(function(){
        carHide();
    });
    $('.car_hide').on('touchmove', function(e){
        var xPos = e.originalEvent.touches[0].pageX;

        $('.car_hideHidden').width(xPos+'px');
    });

    function carHide(){
        $('.car_hide img').width($(window).width());
    }


    /*ct2 내용보기 popup*/
    $('.view_ct2Box1 button').on('click', function(){
       $(this).closest('.ct2').addClass('ct2_boxPopView');
    });
    $('.ct2_popClose').on('click', function(){
        $(this).closest('.ct2').removeClass('ct2_boxPopView');
    });

    var ct2Arr = ['technology_01','technology_02','technology_03','technology_04','technology_05','technology_06'],
        ct2Text = [
            '스티어링 휠 온도 제어 기능',
            '풀 컬러 헤드 업 디스플레이',
            '4.2인치 컬러 TFT 트윈 미터',
            'S-FLOW 에어컨 기능',
            'DRIVE MODE / EV MODE',
            '휴대폰 무선 충전 시스템'
        ]

    /*ct2_4 이미지 view팝업*/
    $('.view_24 button').on('click', function(){
        var idx = $(this).index();

        $('.ct2_4').addClass('ct2_4ImgView');

        ct2_view(idx);
    });

    $('.ct2_viewClose').on('click', function(){
        $('.ct2_4').removeClass('ct2_4ImgView');

    });

    var ct2_viewIdx;

    $('.ct2_viewPrev').on('click', function(){
        if(ct2_viewIdx > 0){
            ct2_viewIdx--;
        }else{
            return false;
        }

        ct2_view(ct2_viewIdx);
    });

    $('.ct2_viewNext').on('click', function(){
        var ss = $('.view_24 button').length;

        if(ct2_viewIdx < ss-1){
            ct2_viewIdx++;
        }else{
            return false;
        }

        ct2_view(ct2_viewIdx);
    });

    function ct2_view(idx){
        $('.ct2_viewImg').attr('src','../../images/model_view/m_prius/image/'+ct2Arr[idx]+'.jpg');
        $('.ct2_text').text(ct2Text[idx])

        ct2_viewIdx = idx;
    }


    var arr = {
            'colors':[
                {
                    'color':'df1319', //색깔 코드
                    'car':'color_1.jpg', //이미지 네임
                    'carName':'EMOTIONAL RED'
                },
                {
                    'color':'0359a6',
                    'car':'color_2.jpg',
                    'carName':'DARK BLUE MICA METALLIC'
                },
                {
                    'color':'96aeb0',
                    'car':'color_3.jpg',
                    'carName':'FROSTY GREEN'
                },
                {
                    'color':'ffffff',
                    'car':'color_4.jpg',
                    'carName':'WHITE PEARL CRYSTAL SHINE'
                },
                {
                    'color':'070924',
                    'car':'color_8.jpg',
                    'carName':'ATTITUDE BLACK MICA'
                },
                {
                    'color':'494848',
                    'car':'color_7.jpg',
                    'carName':'GRAY METALLIC'
                },
                {
                    'color':'e1e1e1',
                    'car':'color_5.jpg',
                    'carName':'SUPER WHITE'
                },
                {
                    'color':'ebeef5',
                    'car':'color_6.jpg',
                    'carName':'SILVER METALLIC'
                }
            ]
        }


    /*colors 페이지 에니메이션관련*/
    var list = $('.car_colorBtn ul li');

    for(var i = 0; i < list.length; i++){
        list.eq(i).find('span').css('background-color','#'+arr.colors[i].color+'');
    }

    $('.car_colorBtn ul li').click(function(){
        var idx = $(this).index();

        $(this).addClass('current').siblings().removeClass('current');

        $('.carImg img').attr('src','../../images/model_view/m_prius/image/'+arr.colors[idx].car);
        $('.car_color').text(arr.colors[idx].carName);
    });

    /*갤러리 팝업*/
    var gal_index;


    //name = 팝업이미지 네임
    var gal_arr = {
            'img' : [
                {
                    'name':'',
                    'youtube':'COp7F3M2rKA'
                },
                {
                    'name':'gl2',
                },
                {
                    'name':'gl3'
                },
                {
                    'name':'gl4',
                    'vr_link':'7t3M835G8V8'
                },
                {
                    'name':'gl8',
                    'vr_link':'YWFrQIM6EAA'
                },
                {
                    'name':'gl6'
                },
                {
                    'name':'gl7'
                },
                {
                    'name':'gl10',
                    'vr_link':'ZZUDcXiIWCI'
                },
                {
                    'name':'gl9'
                },
                {
                    'name':'gl15',
                    'vr_link':'1CjiOmE0qv0'
                },
                {
                    'name':'gl11'
                },
                {
                    'name':'gl12'
                },
                {
                    'name':'gl13'
                },
                {
                    'name':'',
                    'youtube':'0wGAaBYmA-Q'
                },
                {
                    'name':'',
                    'youtube':'lxTiL5uyJ3Q'
                },
                {
                    'name':'add_gl1'
                },
                {
                    'name':'add_gl2'
                },
                {
                    'name':'add_gl3'
                },
                {
                    'name':'add_gl4'
                },
                {
                    'name':'add_gl5'
                },
                {
                    'name':'add_gl6'
                },
                {
                    'name':'add_gl7'
                },
                {
                    'name':'add_gl8'
                },
                {
                    'name':'add_gl9'
                },
                {
                    'name':'add_gl10'
                },
                {
                    'name':'add_gl11'
                },
                {
                    'name':'add_gl12'
                },
                {
                    'name':'add_gl13'
                },
                {
                    'name':'add_gl14'
                },
                {
                    'name':'add_gl15'
                },
                {
                    'name':'add_gl16'
                },
                {
                    'name':'add_gl17'
                },
                {
                    'name':'add_gl18'
                },
                {
                    'name':'add_gl19'
                },
                {
                    'name':'add_gl20'
                },
                {
                    'name':'add_gl21'
                },
                {
                    'name':'add_gl22'
                },
                {
                    'name':'add_gl23'
                }

            ]
        }



    //갤러리 팝업함수
    function gal_movie(idx){
        var _this = $('.cont4_inner ul li').eq(idx);

        $('.gal_movie iframe').remove();

        if(_this.hasClass('movie_check')){

            //무비
            $('.gal_viewInner > a').hide();
            $('.gal_movie').addClass('gal_viewNow').siblings().removeClass('gal_viewNow');
            $('.gal_movie').append('<iframe id="pl" width="100%" src="https://www.youtube.com/embed/'+gal_arr.img[idx].youtube+'" frameborder="0" allowfullscreen></iframe>')
        } else {
            if(_this.hasClass('gl_play')){
                $('.move_play').addClass('gl_playView');
                $('.gal_viewInner > a').attr('href','https://youtu.be/'+gal_arr.img[idx].vr_link);
            } else {
                $('.move_play').removeClass('gl_playView');
                $('.gal_viewInner > a').attr('href','#none');
            }
//            $('.gal_movie iframe').remove();
            $('.gal_viewInner > a').show();
            //이미지
            $('.gal_viewInner > a').addClass('gal_viewNow').siblings().removeClass('gal_viewNow');

            $('.gal_viewInner > a > img').attr('src','../../images/model_view/m_prius/image/'+gal_arr.img[idx].name+'.jpg');

        }

        mbh__resizeVideo();
        gal_index = idx;
    }


    $('.cont4_inner ul li').on('click', function(){
        var idx = $(this).index();

        $('.gal_pop').addClass('gal_open');

        gal_movie(idx);

        $(document).on('touchmove', function(e){
			e.preventDefault();
		});
    });

    $('.gal_close').on('click', function(){
        $('.gal_pop').removeClass('gal_open');
        $('.gal_movie iframe').remove();
        $(document).on('touchmove', function(e){
			$(document).unbind('touchmove');
		});
    });

    $('.gal_popPrev').on('click', function(){
        if(gal_index > 0){
            gal_index--;
        } else {
            return false;
        }
        gal_movie(gal_index);
    });

    $('.gal_popNext').on('click', function(){
        var st = $('.cont4_inner ul li').length;
        if(gal_index < st-1){

            gal_index++;
        } else {
            return false;
        }

        gal_movie(gal_index);
    });


    $(document).ready(function(){
        function mbh__resizeVideo(){
            var oVideo = document.getElementById("pl"),
                oParent = oVideo.parentNode,
                resizeW = oParent.offsetWidth,
                resizeH = Math.ceil((resizeW/16) * 9);

            oVideo.setAttribute("width", resizeW);
            oVideo.setAttribute("height", resizeH);
        }
    });


//});



 function rsz(){
    var wh = $(window).height(),
        headh = $('#header').height(),
        lnb_wraph = $('.lnb_wrap > h2').height();

    var cal = wh-70;
//                $container.css('top',cal);

    $('#vrDiv').css('height', cal);
}
//rsz
rsz();
$(window).resize(function(){
    rsz();
});
var sections = ['#vrDiv','#exterior','#interior','#features','#gallery','.colors'];
// $('.lnb_title > h3').on('click',function(e){
//     var _this = $('.lnb_title');
//     _this.toggleClass('lnb_open');
// });
$('.lnb_title').find('li').each(function(index){
    var _this = $(this),
        _liindex = index;
    if(!_this.hasClass('havPdf')){
        _this.find('a').on('click',function(e){
            $('.lnb_title').removeClass('lnb_open');
            var gotoTarget = $(sections[_liindex]).offset().top - ($('.lnb_wrap').height() + 138);
            scrollToDiv(gotoTarget);
            $('.lnb_title').removeClass('lnb_open').find('>h3').html($(this).text());
            eventClick(e);
        });
    }
});

function scrollToDiv(num){
    if($('body').scrollTop() !== num){
        $('html,body').animate({
            scrollTop: num
        }, 400, 'easeInOutCirc', function() {
        });
    }
    //if
}
function eventClick(event) {
        if (event.preventDefault) {
            event.preventDefault(); //FF
        } else {
            event.returnValue = false; //IE
        }
}
