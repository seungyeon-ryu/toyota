
;(function($, exports, undefined){
    "use strict";
    if(!$.fn.viSlider_video){
        var settings = {
            stru : {},
            arrow : true,
            h3option : false,
            rszImgRepl : false,
            autoPlay : false,
            cut : 0
        }
    }
    //if
    var msVersion = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/),
    msie = !!msVersion,
    ie8_and_below = msie && parseFloat(msVersion[1]) <= 8,
    ie9 = msie && parseFloat(msVersion[1]) == 9;

    $.fn.viSlider_video = function(option){
        var _this = $(this),
        setVal = $.type(option) == 'object' ? $.extend({},settings,option) : settings;
        var thiscurrent = 0,
            maxSlide = setVal.stru.dataList.length,
            Xposition = [],
            orgImg = [],
            mImg = [],
            dragging = false,
            motioning = false,
            slideWrapH,
            slideWrapX,
            x_origine,
            y_origine,
            x_new,
            y_new,
            ratio,
            sint,
            BV = [];
        _this.addClass('viSimpleSlider');
        var $WrapUl = _this.find('>ul');
        var intTime = 4000;

        var SimpleSlider = {
            mkSlide : function(e){
                $WrapUl.empty();
//                $WrapUl.width(maxSlide*_this.width());
                for(var i = 0; i < maxSlide; i++){
                    var thisLink = setVal.stru.dataList[i].link;
                    orgImg[i] = setVal.stru.dataList[i].pc_img;
                    mImg[i] = setVal.stru.dataList[i].m_img;
                    if(setVal.stru.dataList[i].link.length > 1){
                        //링크값이 있다면
                        $('<li></li>').appendTo($WrapUl).html('<a href="' + setVal.stru.dataList[i].link + '" class="coverDiv" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:9"></a><img src=""/>');
                    }else{
                        $('<li></li>').appendTo($WrapUl).html('<div class="coverDiv" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1"></div><img src=""/>');
                    };
                    var thisLi = $WrapUl.find('li').eq(i);
                    if(setVal.stru.dataList[i].video !== undefined && !ie8_and_below){
                        //영상있고 ie9이상
							var muted //= i == 0 ? 'muted' : '';//= i == 0 || i == 1 || i == 2 ? 'muted' :
							var videoHeight = i == 0 ? 'auto' : 'auto';
//                            $('<video id="video' + i + '"><source src="' + setVal.stru.dataList[i].video[0] + '" type="video/mp4" /><source src="' + setVal.stru.dataList[i].video[1] + '" type="video/webm" /><embed src="' + setVal.stru.dataList[i].video[2] + '" quality="high" pluginspage="http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" width="100%" height="100%" wmode="transparent"></embed></video>').appendTo(thisLi).css({
                            $('<video id="video' + i + '" '+ muted +'><source src="' + setVal.stru.dataList[i].video[0] + '" type="video/mp4" /><source src="' + setVal.stru.dataList[i].video[1] + '" type="video/webm" /></video>').appendTo(thisLi).css({
                                'position' : 'absolute',
                                'top' : '50%',
                                'left' : '50%',
                                'width': '100%',
                                'height': videoHeight,
                                'vertical-align': 'baseline'
                            });

							$('<button id="muteBtn" class="mo_none" type="button" onclick="mute_btn();"></button>').prependTo(thisLi);

                            thisLi.find('>video').bind("loadedmetadata", function () {
                                var _width = $(this).width();
                                var _height = $(this).height();
                                $(this).css({
                                    'margin-left' : _width*-0.5,
                                    'margin-top' : _height*-0.5
                                });
                            });

							// 20170724 토요타 영상 플레이어 수동 전환
							/*
							if (i == 2) {
								thisLi.find('>video').on('click', function(ev) {
									ev.preventDefault();

									var movTarget = $(this);
									var html = '';

									if (movTarget.length > 0) {
										html += '<div class="layer-main">';
										html += '<div class="layer-main-wrap">';
										html += '<div class="layer-main-content">';
										html += '<div class="yt-layer-wrap"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/IozXseU8MKQ?autoplay=1&rel=0&wmode=transparent&showinfo=0" frameborder="0" allowfullscreen></iframe></div>';
										html += '<div class="layer-main-control">';
										html += '<button type="button" class="layer-main-close"><span>닫기</span></button>';
										html += '</div>';
										html += '</div>';
										html += '</div>';
										html += '</div>';
									}

									var $galleryMov = $(html);

									$galleryMov.find('.layer-main-close').on('click', function(ev) {
										$galleryMov.remove();
									});

									if ($('.layer-main').length > 0) {
										$('.layer-main').remove();
										$('#wrap').after($galleryMov);
									} else {
										$('#wrap').after($galleryMov);
									}

								});
							}
							*/

                    }else if(setVal.stru.dataList[i].video !== undefined && ie8_and_below){
                        //영상있고 ie8이하
                        $('<div id="video' + i + '" '+ muted +'><img  src="' + setVal.stru.dataList[i].video[2] + '"/></div>').appendTo(thisLi).css({
                            'position' : 'absolute',
                            'top' : '0',
                            'left' : '0',
                            'right' : '0',
                            'width': '100%',
                            'height': 'auto',
                            'vertical-align': 'baseline'
                        });

						// 20170724 토요타 영상 플레이어 수동 전환
						/*
						if (i == 2) {
							thisLi.on('click', function(ev) {
								ev.preventDefault();

								var movTarget = $(this);
								var html = '';

								if (movTarget.length > 0) {
									html += '<div class="layer-main">';
									html += '<div class="layer-main-wrap">';
									html += '<div class="layer-main-content">';
									html += '<div class="yt-layer-wrap"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/IozXseU8MKQ?autoplay=1&rel=0&wmode=transparent&showinfo=0" frameborder="0" allowfullscreen></iframe></div>';
									html += '<div class="layer-main-control">';
									html += '<button type="button" class="layer-main-close"><span>닫기</span></button>';
									html += '</div>';
									html += '</div>';
									html += '</div>';
									html += '</div>';
								}

								var $galleryMov = $(html);

								$galleryMov.find('.layer-main-close').on('click', function(ev) {
									$galleryMov.remove();
								});

								if ($('.layer-main').length > 0) {
									$('.layer-main').remove();
									$('#wrap').after($galleryMov);
								} else {
									$('#wrap').after($galleryMov);
								}

							});
						}
						*/
                    };
                    if(setVal.h3option){
                        //메인 슬라이드라 h3 노출을 위해서
						if (setVal.stru.dataList[i].video !== undefined && !ie8_and_below) {
							$('<h3></h3>').prependTo(thisLi).html(setVal.stru.dataList[i].title).append($('<div class="yt_click" />').on('click', function(ev) {
								$(this).closest('li').find('video').trigger('click');
							}));
						} else {
							$('<h3></h3>').prependTo(thisLi).html(setVal.stru.dataList[i].title);
						}
                    }else{
                        $('<a href="#"></a>').prependTo(thisLi).html(setVal.stru.dataList[i].title);
                    }
                }
                //for

                function imgInsert(){
                    _this.find('>ul').find('>li').each(function(index){
                        var thisLi = $(this);
    //                        var thisLi = $WrapUl.find('li').eq(i);
                        thisLi.width(_this.width());
                        Xposition[index] = index*_this.width();
                        thisLi.css('left',Xposition[index]);
                        if(setVal.rszImgRepl && ($('#rsp_check').css('background-color') == 'rgb(255, 255, 255)' || $('#rsp_check').css('background-color') == 'white')){
                            if(setVal.stru.dataList[index].video !== undefined){
                                //video
                                if(!ie8_and_below){
                                    thisLi.find('>video').get(0).pause();
                                }
                                thisLi.find('>video').hide();
                            }else{
                                //img
                            }
                                var insertImg = mImg[index];
                                thisLi.find('>img').attr('src',insertImg);
                        }else{
                            //p
                            if(setVal.stru.dataList[index].video !== undefined){
                                //video
                                thisLi.find('>video').show();
                            }else{
                                //img
                            };
                                var insertImg = orgImg[index];
                                thisLi.find('>img').attr('src',insertImg);
                        }
                        //if
//                        console.log("값" + insertImg)
                    });
                }
                $(window).resize(function(){
                    Xposition = [];
                   imgInsert();
                });
                imgInsert();
                SimpleSlider.mkIndicate();
                SimpleSlider.sortSlide();
//                if(setVal.autoPlay){
//                    SimpleSlider.autoSlide();
//                }
            },
            autoSlide : function(){
                window.clearTimeout(sint);
                sint = window.setTimeout(function(){
                    if(thiscurrent < maxSlide-1){
                        thiscurrent = thiscurrent + 1;
                        slidefunc.slideMotion(thiscurrent);
                    }else{
                        //마지막에 도착했으면 이어지게 하려는 코드
//                        thiscurrent = 0;
//                        slidefunc.slideMotion(thiscurrent);
                        thiscurrent = maxSlide-1;
                        slidefunc.slideMotion(thiscurrent,0);
                    }
//                       _this.find('div.indicate').find('a').eq(thiscurrent).click();
                },intTime);
            },
            mkIndicate : function(e){
                $('<div class="indicate"></div>').appendTo(_this);
                for(var i = 0; i < maxSlide; i++){
                    $('<a href="#"></a>').appendTo(_this.find('div.indicate')).html('<img src="../../images/model_view/hybridcommon/slide_indicate_normal.png"/>')
                    .on('click',function(e){
                        var thisIndex = _this.find('div.indicate').find('a').index($(this));
                        thiscurrent = thisIndex;
                        slidefunc.slideMotion(thiscurrent);
                        $WrapUl.find('li').eq(0).css({'left' : 0});
                        $WrapUl.find('li').eq(maxSlide-1).css({'left' : Xposition[maxSlide-1]});
                        commonjs.eventClick(e);
                    });
                    _this.find('div.indicate').find('>a').eq(maxSlide-1).css({'margin-right' : 0});
                    _this.find('div.indicate').find('>a').eq(thiscurrent).find('img').attr('src','../../images/model_view/hybridcommon/slide_indicate_active.png');
                }
                //for
            },
            sortSlide : function(e){

                if(setVal.rszImgRepl && ($('#rsp_check').css('background-color') == 'rgb(255, 255, 255)' || $('#rsp_check').css('background-color') == 'white')){
                    //m
                    var insertImg = mImg[0];
                }else{
                    //p
                     var insertImg = orgImg[0];
                }
                //if
                var img = new Image();
                img.onload = function(){
                    if(setVal.rszImgRepl && ($('#rsp_check').css('background-color') == 'rgb(255, 255, 255)' || $('#rsp_check').css('background-color') == 'white')){
                        var cutVal = 0;
                    }else{
                        var cutVal = setVal.cut;
                    }
                var imgW = img.width;

                if(_this.closest('.viSimpleSlider').hasClass('m_slideCommon') && $(window).width() >= 960){
                    slideWrapH = ($(window).width()/2)*(img.height/img.width)-cutVal;
                } else {
                    slideWrapH = Math.floor(_this.width()*(img.height/img.width)-cutVal);
                };
                    _this.height(slideWrapH);
                    _this.css({paddingTop:0});
//                    _this.find('>ul').height(slideWrapH);
                    _this.find('video').each(function(index){
                        $(this).css({
                            'margin-left' : $(this).width()*-0.5,
                            'margin-top' : $(this).height()*-0.5
                        });
                    });
                };
                img.src = insertImg;
                //이미지 온로드
//                console.log(insertImg);
                if(ie8_and_below){
                    $(window).load(function(){
                        _this.height(slideWrapH);
                    });
                };
                /*$(window).resize(function(){
                   imgInsert();
                });*/
            }
        };
        var makeDepth = {
            mkArrow : function(e){
                $('<a href="#"></a>').appendTo(_this).addClass('arrowBtn prev').html('<img src="../../images/model_view/hybridcommon/mainSlide/Btn_arrow_left.png">');
                $('<a href="#"></a>').appendTo(_this).addClass('arrowBtn next').html('<img src="../../images/model_view/hybridcommon/mainSlide/Btn_arrow_right.png">');
                _this.find('a.arrowBtn').each(function(BtnIndex){
                    var _thisBtn = $(this);
                    _thisBtn.on('click', function(e){
                        if(!motioning){
                            if(_thisBtn.hasClass('prev') && thiscurrent >= 1 ){

                                thiscurrent = thiscurrent - 1;
                                slidefunc.slideMotion(thiscurrent);
                            }else if(_thisBtn.hasClass('prev') && thiscurrent == 0){
//                                thiscurrent = maxSlide-1;
//                                slidefunc.slideMotion(thiscurrent);
                                thiscurrent = 0;
                                slidefunc.slideMotion(thiscurrent,maxSlide-1);
                            }
                            //if 이전 버튼 클릭

                            if(_thisBtn.hasClass('next') && thiscurrent < maxSlide-1 ){
                                thiscurrent = thiscurrent + 1;
                                slidefunc.slideMotion(thiscurrent);
                            }else if(_thisBtn.hasClass('next') && thiscurrent == maxSlide-1){
//                                thiscurrent = 0;
//                                slidefunc.slideMotion(thiscurrent);
                                //마지막에 도착했으면 이어지게 하려는 코드
                                thiscurrent = maxSlide-1;
                                slidefunc.slideMotion(thiscurrent,0);
                            }
                            //if 다음 버튼 클릭
                        }
                        commonjs.eventClick(e);
                    });
                });
                //each
            }
        }
        SimpleSlider.mkSlide();
        //슬라이드 만들기
        if(setVal.arrow)makeDepth.mkArrow();
        //화살표 옵션 - 화살표 만들기
        if(setVal.autoPlay){
            SimpleSlider.autoSlide();
//            _this.hover(function(e){
//                window.clearTimeout(sint);
//            },function(e){
//                SimpleSlider.autoSlide();
//            });
        }
        //오토 슬라이딩 옵션 - 슬라이딩 실행

        function playMovie(num){
            if($WrapUl.find('>li').eq(num).find('video').length > 0){
//                console.log("영상있음");

                if(setVal.rszImgRepl && ($('#rsp_check').css('background-color') == 'rgb(255, 255, 255)' || $('#rsp_check').css('background-color') == 'white')){
                    //m
                    if(!ie8_and_below){
						$WrapUl.find('>li').find('video').each(function(i) {
							$(this)[0].pause();
						});
                    }
                    $WrapUl.find('>li').eq(num).find('video').hide();
                    intTime = 2000;
                    if(setVal.autoPlay)SimpleSlider.autoSlide();
                }else{
                    //p
                    window.clearTimeout(sint);
					$WrapUl.find('>li').find('video').each(function(i) {
						$(this)[0].pause();
					});
                    $WrapUl.find('>li').eq(num).css('opacity',0);
                    $WrapUl.find('>li').eq(num).eq(num).find('video').show();
                    $WrapUl.find('>li').eq(num).css('opacity',1);
                    if(!ie8_and_below){
                        $WrapUl.find('>li').eq(num).find('video').get(0).play();
                        $WrapUl.find('>li').eq(num).find('video').on('ended',function(e){
    //                        console.log('영상끝났으니')
                            if(setVal.autoPlay){
                                intTime = 0;
                                SimpleSlider.autoSlide();
                            }
                        });
                    }
                }
            }else{
                //console.log("영상없음");
                if(!ie8_and_below) {
					$WrapUl.find('>li').find('video').each(function(i) {
						$(this)[0].pause();
					});
				}
//                $WrapUl.find('>li').find('video').hide();
                intTime = 2000;
                if(setVal.autoPlay)SimpleSlider.autoSlide();
            }
        };
        playMovie(0);
        var scrollingAble = false;
        var slidefunc = {
            slideMotion : function(targetIndex,loop){

                /* 이어지기 만드는 중 */
                var _loop = loop;
                slidefunc.reposition();
                /* 이어지기 만드는 중 */

                var _ele = $WrapUl,
                    _elewidth = $WrapUl.find('li').eq(targetIndex).width();
                if(_loop == 0){
                    thiscurrent = 0;
                    motioning = true;
                    _ele.stop().animate({
                        'left' : -(Xposition[maxSlide-1] + $WrapUl.find('li').eq(maxSlide-1).width())
                    },800,'easeOutQuint',function(){
                        motioning = false;
                        dragging = false;
                        _ele.find('li').eq(0).css({'left' : 0});
                        _ele.css('left',0);
                        playMovie(thiscurrent);
                    });
                }else if(_loop == maxSlide-1){
                    thiscurrent = maxSlide-1;
                    motioning = true;
                    _ele.stop().animate({
                        'left' : $WrapUl.find('li').eq(maxSlide-1).width()
                    },800,'easeOutQuint',function(){
                        motioning = false;
                        dragging = false;
                        _ele.find('li').eq(maxSlide-1).css({'left' : Xposition[maxSlide-1]});
                        _ele.css('left',-Xposition[maxSlide-1]);
                        playMovie(thiscurrent);
                    });
                }else{
                    motioning = true;
                    _ele.stop().animate({
                        'left' : -targetIndex*_elewidth
                    },800,'easeOutQuint',function(){
                        motioning = false;
                        dragging = false;
                        playMovie(thiscurrent);
                    });
                }
//                console.log(thiscurrent);
                _this.find('div.indicate').find('>a').find('img').attr('src','../../images/model_view/hybridcommon/slide_indicate_normal.png')
                _this.find('div.indicate').find('>a').eq(thiscurrent).find('img').attr('src','../../images/model_view/hybridcommon/slide_indicate_active.png');

//                $WrapUl.find('li').removeClass('current').eq(thiscurrent).addClass('current');
            },
            //slideMotion
            reposition : function(){
                /*자리배치 맞추기*/
                if(thiscurrent > 1){
                    var moveLi = Xposition[maxSlide-1] + $WrapUl.find('li').eq(maxSlide-1).width();
                    $WrapUl.find('li').eq(0).css({'left' : moveLi});
                }else{
                    $WrapUl.find('li').eq(0).css({'left' : 0});
                }
                if(thiscurrent < maxSlide-2){
                    var moveLi = - $WrapUl.find('li').eq(maxSlide-1).width();
                    $WrapUl.find('li').eq(maxSlide-1).css({'left' : moveLi});
                }else{
                    var moviLi = Xposition[maxSlide-2] + $WrapUl.find('li').eq(maxSlide-1).width();
                    $WrapUl.find('li').eq(maxSlide-1).css({'left' : moviLi});
                }
            },
            dragAction : function(event,num){
                var _ele = $WrapUl,
                    moveX;
                $('html,body').stop();
                window.clearTimeout(sint);
                //터치했을 때는 인터벌이 멈춰야함
                slidefunc.reposition();
                if(num > 0){
                    commonjs.eventClick(event);
                    /*움직임이 + 발생한다면*/
                    _ele.css({
                        'left' : slideWrapX - num
                    });
                }else if(num < 0){
                    /*움직임이 - 발생한다면*/
                    commonjs.eventClick(event);
                    _ele.css({
                        'left' : slideWrapX - num
                    });
                }
                //if
            },
            dragEnd : function(num){
                $WrapUl.removeClass('keydown');
                if(setVal.autoPlay){
                    SimpleSlider.autoSlide();
                };
                //인터벌 옵션이 되어있다면 다시 인터벌됨
                scrollingAble = false;

                    if(num !== 0){
                        if(num > _this.width()*0.1){
                            dragging = true;
                            x_new = 0;
//                            slidefunc.slideMotion(thiscurrent);
                            if(thiscurrent < maxSlide-1 && !motioning){
                                    thiscurrent = thiscurrent + 1;
                                    slidefunc.slideMotion(thiscurrent);
                            }else if(thiscurrent == maxSlide-1 && !motioning){
    //                                thiscurrent = 0;
    //                                slidefunc.slideMotion(thiscurrent);
                                    //마지막에 도착했으면 이어지게 하려는 코드
                                    thiscurrent = maxSlide-1;
                                    slidefunc.slideMotion(thiscurrent,0);
                            }
                            //if 다음 버튼 클릭

                        }else if(num < _this.width()*-0.1){
                            dragging = true;
                            x_new = 0;
//                            slidefunc.slideMotion(thiscurrent);
                            if(thiscurrent >= 1 && !motioning){
                                thiscurrent = thiscurrent - 1;
                                slidefunc.slideMotion(thiscurrent);
                            }else if(thiscurrent == 0 && !motioning){
//                                thiscurrent = maxSlide-1;
//                                slidefunc.slideMotion(thiscurrent);
                                thiscurrent = 0;
                                slidefunc.slideMotion(thiscurrent,maxSlide-1);
                            }
                        }else{
                            dragging = true;
                            x_new = 0;
                            slidefunc.slideMotion(thiscurrent);
                        }
                        //if

                    }
                    //if

                }
                //if

//            }
        };
        //var slidefunc

        var commonjs = {
            eventClick : function (event) {
                if(event.preventDefault) {
                    event.preventDefault(); //FF
                } else {
                    event.returnValue = false; //IE
                }
            },
            dimShow : function(){
                if(_this.find('div.SlideDim').length <= 0){
                    $('<div class="SlideDim"></div>').appendTo(_this).css({
                        'background-color' : '#000',
                        'position' : 'absolute',
                        'left' : 0,
                        'top' : 0,
                        'width' : '100%',
                        'height' : '100%',
                        'z-index' : 5
                    }).stop().fadeOut(1000,function(){
                        $(this).remove();
                    });
                }else{
                    _this.find('div.SlideDim').stop().css('opacity','1').fadeOut(1000,function(){
                        $(this).remove();
                    });
                }
            }
        };
        //var commonjs

        var eventControll = {
            touchFunc : function(){

            if ("ontouchstart" in window) {
                    _this.bind('touchstart',function(event){
                       if(!motioning && !dragging && maxSlide > 1){
                            window.clearTimeout(sint);
                            $WrapUl.addClass('keydown');
                            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            x_origine = touch.pageX;
                            y_origine = touch.pageY;
                            slideWrapX = $WrapUl.position().left;
                            $(this).bind('touchmove',function(event){
                                window.clearTimeout(sint);
                                $WrapUl.addClass('keydown');
                                var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                                var x_diff = x_origine - touch.pageX;
                                var y_diff = y_origine - touch.pageY;
                                x_new = x_diff;
                                y_new = y_diff;
                                if(Math.abs(y_diff) < 15){
    //                                console.log("터치이동 " + x_new +  "  / " + y_new);
                                    //가로 스와이핑을 해도 됨 (세로 안움직임)
                                    scrollingAble = true;
    //                                $(this).bind('touchmove', handler);
                                    if(!dragging){
                                        slidefunc.dragAction(event,x_new);
                                        if(event.preventDefault) {
                                            event.preventDefault(); //FF
                                        } else {
                                            event.returnValue = false; //IE
                                        }
                                    }
                                }else{
                                    //세로 움직였으니 드래깅은 초기화
    //                                console.log("스와이핑" + Math.abs(y_diff))
                                    scrollingAble = false;
    //                                $(this).unbind('touchmove', handler);

                                    $(this).unbind("touchmove");
                                    if(!dragging)slidefunc.dragEnd(x_new);
    //                                slidefunc.slideMotion(thiscurrent);
                                }
                            });
                           }//if 드래긔 기능 가능하다면, 드래그 스타트, 드래그 엔드 기능
                    });
                    _this.bind('touchend',function(event){
//                        console.log("터치엔드")
                        $(this).unbind("touchmove");
                        if(!dragging)slidefunc.dragEnd(x_new);
//                        $(this).unbind('touchmove', handler);
                    });

                }else{
//                    _this.mousedown(function(event) {
//                        _this.bind("mousemove");
//                        x_origine = event.pageX;
//                        slideWrapX = $WrapUl.position().left;
//                        $(this).mousemove(function(event){
//                            var x_diff = x_origine - event.pageX;
//                            x_new = x_diff;
//                            if(!dragging)slidefunc.dragAction(x_new);
//                        });
//                    });
//                    _this.mouseleave(function(event) {
//                        $(this).unbind("mousemove");
//                        if(!dragging)slidefunc.dragEnd(x_new);
//                      });
//                    _this.mouseup(function(event) {
//                        $(this).unbind("mousemove");
//                        if(!dragging)slidefunc.dragEnd(x_new);
//                    });
                }
                document.onselectstart = function() { return false; }
                //touch 기능 여부
                }
        }
        $(window).resize(function(){
            //리사이징 상황의 행동 입력
            SimpleSlider.sortSlide();
            slidefunc.slideMotion(thiscurrent);
        });
        eventControll.touchFunc();
    }

})(window.jQuery, window);