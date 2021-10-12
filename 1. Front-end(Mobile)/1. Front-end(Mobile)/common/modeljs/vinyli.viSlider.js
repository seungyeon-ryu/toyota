// v 0.2.3 : 2016.3.20 - 인디케이트안의 갯수만큼 인디케이트에 total 갯수를 클래스로 표현
// v 0.2.2 : 2016.3.18 -  descript 값이 있으면 추가
// v 0.2 : 2016.3.17 - backgroundSize.js 추가, 서브타이틀(설명 포함) 추가됨
// v 0.1 : 2016.3.10
;(function($, exports, undefined){
    "use strict";
    if(!$.fn.viSlider){
        var settings = {
            stru : {},
            tabmenu : true,
            tablink : false,
            idca : true,
            arrow : true,
            dragable : true,
            subtitle : false,
            rszImgRepl : false,
            cut : 0
        }
    }
    //if
    $.fn.viSlider = function(option){
        var _this = $(this),
        setVal = $.type(option) == 'object' ? $.extend({},settings,option) : settings;
        var currentDepth = 0,
            current = 0,
            maxSlide,
            Xposition = [],
            orgImg = [],
            mImg = [],
            dragging = false,
            tabmove = 0,
            slideLiWd,
            slideWrapH,
            slideWrapX,
            x_origine,
            y_origine,
            x_new,
            y_new;
        _this.addClass('viSlider');

        var makeDepth = {
            clickDepth : function(num){
                commonjs.dimShow();
                _this.find('.viSlider-tabmenu').find('li').removeClass('current');
                _this.find('.viSlider-tabmenu').find('li').eq(num).addClass('current');
                if(setVal.idca)makeDepth.mk2depth(num);
                slidefunc.mkSlide(num);
                if(tabmove == 1){
                    //이전탭
                    current = 0;
                    _this.find('ul.viSlider-slide').css('left',0).stop();
                    _this.find('ul.viSlider-indicate').find('li').removeClass('current').eq(0).addClass('current');
                }else if(tabmove == -1){
                    //다음탭
                    current = setVal.stru[num].subcategory.length-1;
                    var movePrevlast = -current*_this.find('ul.viSlider-slide').find('li').eq(current).width();
                    _this.find('ul.viSlider-slide').css('left',movePrevlast).stop();
                    _this.find('ul.viSlider-indicate').find('li').removeClass('current').eq(current).addClass('current');
                }
                tabmove = 0;
            },
            mk1depth : function(){
                $('<ul></ul>').appendTo(_this).addClass('viSlider-tabmenu');
                if(setVal.tabmenu){
                    for(var i = 0; i < setVal.stru.length; i++){

                        $('<li></li>').appendTo(_this.find('.viSlider-tabmenu')).html('<a href="#">' + setVal.stru[i].title + '</a>')
                        .find('a').on('click',function(e){
                            var indexNum = _this.find('.viSlider-tabmenu').find('li').index($(this).parent());
                            currentDepth = indexNum;
                            $(this).parent().siblings().removeClass('current');
                            $(this).parent().addClass('current');
                            if(setVal.idca)makeDepth.mk2depth(indexNum);
                            slidefunc.mkSlide(indexNum);
                            current = 0;
//                            slidefunc.slideMotion(current);
                            _this.find('ul.viSlider-slide').css('left',0);
                            _this.find('ul.viSlider-indicate').find('li').removeClass('current').eq(0).addClass('current');
                            commonjs.eventClick(e);
                        });
                    }
                    //for
                }
                _this.find('.viSlider-tabmenu').find('li').eq(current).addClass('current');
                if(setVal.idca)makeDepth.mk2depth(current);
                if(setVal.arrow)makeDepth.mkArrow();
                slidefunc.mkSlide(current);

            },
            mk2depth : function(num){
                orgImg = [];
                if(!_this.find($('ul.viSlider-indicate')).length){
                    $('<div class="slide_dot"></div>').appendTo(_this).css('z-index','11');
                    $('<ul></ul>').appendTo(_this.find('.slide_dot')).addClass('viSlider-indicate');
                }else{
                    _this.find('ul.viSlider-indicate').html('');
                }
                //if
                maxSlide = setVal.stru[num].subcategory.length;
                for(var i = 0; i < setVal.stru[num].subcategory.length; i++){
                    $('<li></li>').appendTo(_this.find('.viSlider-indicate')).html('<a href="#" class="thumbnail" ><img src="../../images/model_view/MODEL_AvalonHybrid/thumbnail_dummy.png" class="dummy"><img src="' + setVal.stru[num].subcategory[i].thumbnail + '"></a><div class="title">' + setVal.stru[num].subcategory[i].title + '</div>')
                    .find('a').on('click',function(e){
                        current = _this.find('.viSlider-indicate').find('li').index($(this).parent());
                        $(this).parent().siblings().removeClass('current');
                        $(this).parent().addClass('current');
                        slidefunc.slideMotion(current);
                        commonjs.eventClick(e);
                    });
                }
                //for
            },
            mkArrow : function(){
                $('<a href="#"></a>').appendTo(_this).addClass('arrowBtn prev');
                $('<a href="#"></a>').appendTo(_this).addClass('arrowBtn next');
                _this.find('a.arrowBtn').each(function(BtnIndex){
                    var _thisBtn = $(this);
                    _thisBtn.on('click', function(e){
                        if(_thisBtn.hasClass('prev') && current >= 1 ){
                            current = current - 1;
                            slidefunc.slideMotion(current);
                        }else if(_thisBtn.hasClass('prev') && current == 0){
                            if(setVal.tablink && currentDepth > 0){
                                dragging = true;
                                x_new = 0;
                                tabmove = -1;
                                slidefunc.slideMotion(0);
                            }else{
                                current = setVal.stru.length-1;
                                slidefunc.slideMotion(current);
                            }
                        }
                        if(_thisBtn.hasClass('next') && current < maxSlide-1 ){
                            current = current + 1;
                            slidefunc.slideMotion(current);
                        }else if(_thisBtn.hasClass('next') && current == maxSlide-1){
                            if(setVal.tablink && currentDepth < setVal.stru.length-1){
                                dragging = true;
                                x_new = 0;
                                tabmove = 1;
                                slidefunc.slideMotion(0);
                            }else{
                                current = 0;
                                slidefunc.slideMotion(current);
                            }
                        }
                        //if
                        commonjs.eventClick(e);
                    });
                });
                //each
            }

        };
        //var makeDepth
        var scrollingAble = false;
        var slidefunc = {
            slideNomotion : function(targetIndex){
                var _ele = _this.find('ul.viSlider-slide'),
                    _elewidth = _this.find('ul.viSlider-slide').find('li').eq(targetIndex).width();
                _ele.stop().css({
                    'left' : -targetIndex*_elewidth
                });

                dragging = false;
                if(tabmove !== 0){
                    if(currentDepth > 0 && tabmove == -1){
                        currentDepth--;
//                            tabmove = 0;
                        x_new = 0;
                        makeDepth.clickDepth(currentDepth);
                    }else if(currentDepth < setVal.stru.length-1 && tabmove == 1){
                        currentDepth++;
//                            tabmove = 0;
                        x_new = 0;
                        makeDepth.clickDepth(currentDepth);
                    }
                }
                _this.find('ul.viSlider-indicate').find('li').removeClass('current').eq(current).addClass('current');
            },
            slideMotion : function(targetIndex){
                var _ele = _this.find('ul.viSlider-slide'),
                    _elewidth = _this.find('ul.viSlider-slide').find('li').eq(targetIndex).width();
                _ele.stop().animate({
                    'left' : -targetIndex*_elewidth
                },400,'easeOutQuint',function(){
                    dragging = false;
                    if(tabmove !== 0){
                        if(currentDepth > 0 && tabmove == -1){
                            currentDepth--;
//                            tabmove = 0;
                            x_new = 0;
                            makeDepth.clickDepth(currentDepth);
                        }else if(currentDepth < setVal.stru.length-1 && tabmove == 1){
                            currentDepth++;
//                            tabmove = 0;
                            x_new = 0;
                            makeDepth.clickDepth(currentDepth);
                        }
                    }else{

                    }
                });
                _this.find('ul.viSlider-indicate').find('li').removeClass('current').eq(current).addClass('current');
            },
            //slideMotion
            mkSlide : function(num){
                if(!_this.find($('ul.viSlider-slide')).length){
                    $('<div></div>').appendTo(_this).addClass('slide_cont').css('height','100%');
                    $('<ul></ul>').appendTo(_this.find('.slide_cont')).addClass('viSlider-slide').css({'position':'relative','height':'100%'});
                }else{
                    _this.find('ul.viSlider-slide').html('');
                }
                //if
                for(var i = 0; i < setVal.stru[num].subcategory.length; i++){
                    if(i<10){
                        var indexNumber = '0'+(i+1);
                    }else{
                        var indexNumber = (i+1);
                    }
                    var subtitle = "",
                        descVal = "";
                        if(setVal.subtitle){
                            if(setVal.stru[num].subcategory[i].descript == undefined ||  setVal.stru[num].subcategory[i].descript == null){
//                                subtitle = '<div class="slide_ect"><h3>' + setVal.stru[num].subcategory[i].subtitle + '</h3></div>';
                            }else{
                                descVal = '<p>' + setVal.stru[num].subcategory[i].descript + '</p>';
                            }
                                subtitle = '<div class="slide_ect" style="z-index : 10"><div class="slide_ectTitle"><h4>' + setVal.stru[num].subcategory[i].subtitle + '</h4><div class="ect_check"><span class="first">내용보기<span><img src="../../images/model_view/hybridcommon/arrow_up.png" alt=""></span></span><span class="second">내용접기<span><img src="../../images/model_view/hybridcommon/arrow_down.png" alt=""></span></span></div></div><div class="slide_ectText">' + descVal + '</div></div>';
                        }
                    $('<li></li>').appendTo(_this.find('.viSlider-slide')).css({
                        'position' : 'absolute',
                        'height' : '100%'
//                        'background-image' : 'url("' + setVal.stru[num].subcategory[i].orgImage + '")'
                    })
                        .html('<div class="coverDiv" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:9"></div><img src="" width="100%">')
                        .append(subtitle);

                        //orgImg[i] = setVal.stru[num].subcategory[i].orgImage;
                        mImg[i] = setVal.stru[num].subcategory[i].mImage;

                }
                //for
                function imgInsert(){
                    _this.find('.viSlider-slide').find('>li').each(function(index){
                        var _this = $(this);
                        //m
                        var insertImg = mImg[index];
                        //if

                        _this.find('>img').attr('src',insertImg);
                    });
                }
                imgInsert();
                $(window).resize(function(){
                   imgInsert();
                });
                slidefunc.sortSlide();
                _this.find('.viSlider-indicate').find('li').eq(current).addClass('current');
                _this.find('.viSlider-indicate').find('li').eq(0).addClass('firstli');
                _this.find('.viSlider-indicate').removeClass().addClass('viSlider-indicate total' + setVal.stru[num].subcategory.length);
                _this.find('.viSlider-indicate').find('li').eq(setVal.stru[num].subcategory.length - 1).addClass('lastli');

                _this.find('.viSlider-slide').find('li').each(function(index){
                    var _thisLi = $(this).find('.slide_ect');
                    _thisLi.find('.slide_ectTitle').find('span.first').on('click',function(e){
                        _thisLi.addClass('pop_on');
                        commonjs.eventClick(e);
                    });
                    _thisLi.find('.slide_ectTitle').find('span.second').on('click',function(e){
                        _thisLi.removeClass('pop_on');
                        commonjs.eventClick(e);
                    });
                })
                var msVersion = navigator.userAgent.match(/MSIE ([0-9]{1,}[\.0-9]{0,})/),
                msie = !!msVersion,
                ie7_and_below = msie && parseFloat(msVersion[1]) <= 8;
                /*if(!ie7_and_below) {
                    _this.find('ul.viSlider-slide').find('li').css({backgroundSize: "cover"});
                    //일반 웹 아이프레임
                }else{

                };*/

                //if 브라우저 체크
            },
            //mkSlide
            sortSlide : function(){
                var img = new Image();
                img.onload = function(){
                    /*이미지로드 이후*/
                    var imgW = img.width;
//                    slideWrapH = _this.width()*(img.height/img.width);
                    slideWrapH = Math.floor(_this.width()*(img.height/img.width)-setVal.cut);
                    /*커스텀*/
//                    var winh = $('.dim.content').height()+80;
//                    if(slideWrapH > winh){
//                        slideWrapH = winh;
//                    }
                    /*커스텀 끝*/
                    /*if($('#rsp_check').css('background-color') == 'rgb(255, 255, 255)' || $('#rsp_check').css('background-color') == 'white'){
                        //m
                        _this.height($('.sub_visual').height());
                    }else{
                    }*/
                        _this.height(slideWrapH);
//                    $('.viSlider-slide').find('li').height(slideWrapH);
//                    _this.find('.viSlider-slide').find('li').height(slideWrapH);
                    if(setVal.stru.length > 1 && setVal.tablink){
                        slideLiWd = _this.find('ul.viSlider-slide').find('li').eq(0).width();
                        $('<div class="slideTo next"></div>').appendTo(_this.find('ul.viSlider-slide').find('li').eq(maxSlide-1)).html("<div></div>").css({
                            'position' : 'absolute',
                            'left' : '100%',
                            'top' : 0,
                            'width' : '100%',
                            'height' : '100%',
                            'overflow' : 'hidden'
                        }).find('div').css({
                            'position' : 'absolute',
                            'width' : '100%',
                            'top' : '50%'
                        });
                        $('<div class="slideTo prev"></div>').appendTo(_this.find('ul.viSlider-slide').find('li').eq(0)).html("<div></div>").css({
                            'position' : 'absolute',
                            'right' : '100%',
                            'top' : 0,
                            'width' : '100%',
                            'height' : '100%',
                            'overflow' : 'hidden'
                        }).find('div').css({
                            'position' : 'absolute',
                            'top' : '50%',
                            'width' : '100%',
                            'text-align' : 'right'
                        });
                    }
                    //if
                };
                var insertImg = mImg[0];
                //if
                img.src = insertImg;
                _this.find('.viSlider-slide').find('li').each(function(index){
                    var _thisLi = $(this);
                    Xposition[index] = index*_this.width();
                    _thisLi.css('left',index*_this.width());
                    _thisLi.width(_this.width());
                });
                //each
            },
            //sortSlide
            dragging : function(event,num){
                var _ele = _this.find('ul.viSlider-slide'),
                    moveX;
                 $('html,body').stop();
                _ele.addClass('keydown');
                if(setVal.tablink){
                    var paddL = (slideLiWd*0.05)-(slideLiWd/num);
                    if(paddL < 1)paddL = 1;
                }

                //console.log("slideWrapX : " + slideWrapX)
                if(num > 0){
                    commonjs.eventClick(event);
                    /*움직임이 + 발생한다면*/
                    if(_ele.position().left > Xposition[maxSlide-1]*-1){
                        /*마지막 슬라이드라면*/
                        _ele.css({
                            'left' : slideWrapX - num
                        });

                    }else if(_ele.position().left <= Xposition[maxSlide-1]*-1 && setVal.tablink && currentDepth < setVal.stru.length-1){
                        /*마지막슬라이드이긴 하나 탭링크기능이 있고 다음 탭이 있다면*/
                        if(_ele.position().left > (Xposition[maxSlide-1] + slideLiWd*0.5)*-1){
                            /*끌어당기기 - 따라다니는 구간*/
                            _ele.css({
                                'left' : slideWrapX - num
                            });
                            _ele.find('.slideTo.next > div').css({
                                'left' : paddL
                            });
                        }
                        //if
                        if(_ele.position().left > (Xposition[maxSlide-1] + slideLiWd*0.3)*-1){
                            /*끌어당기기 - 가능하다는 구간*/
                            _ele.find('.slideTo.next').removeClass('active').find('>div').html('끌어<br>당기세요.');
                            tabmove = 0;
                        }else{
                            _ele.find('.slideTo.next').addClass('active').find('>div').html('놓으면 다음탭으로<br> 이동됩니다.');
                            tabmove = 1;
                        }
                    }else{
                        _ele.css({
                            'left' : Xposition[maxSlide-1]*-1
                        });
                    }
                }else if(num < 0){
                    /*움직임이 - 발생한다면*/
                    commonjs.eventClick(event);
                    if(_ele.position().left < 0){
                        _ele.css({
                            'left' : slideWrapX - num
                        });
                    }else if(_ele.position().left >= 0 && setVal.tablink && currentDepth > 0){
                        /*첫 슬라이드이긴 하나 탭링크기능이 있고 이전 탭이 있다면*/
                        if(_ele.position().left < (0 + slideLiWd*0.5)){
                            /*끌어당기기 - 따라다니는 구간*/
                            _ele.css({
                                'left' : slideWrapX - num
                            });
                            _ele.find('.slideTo.prev > div').css({
                                'right' : paddL
                            });
                        }
                        //if
                        if(_ele.position().left < (0 + slideLiWd*0.3)){
                            /*끌어당기기 - 가능하다는 구간*/
                            _ele.find('.slideTo.prev').removeClass('active').find('>div').html('끌어<br>당기세요.');
                            tabmove = 0;
                        }else{
                            _ele.find('.slideTo.prev').addClass('active').find('>div').html('놓으면 이전탭으로<br> 이동됩니다.');
                            tabmove = -1;
                        }
                        //if
                    }else{
                        _ele.css({
                            'left' : 0
                        });
                    }
                }
            },
            dragEnd : function(num){
                _this.find('ul.viSlider-slide').removeClass('keydown');

                scrollingAble = false;
                    if(num !== 0){
                        if(num > _this.width()*0.1){
                            current = current + Math.ceil(num/_this.width());
                            if(current >= maxSlide -1){
                                current = maxSlide -1;
                            }
                            dragging = true;
                            x_new = 0;
                            slidefunc.slideMotion(current);
                        }else{
                            dragging = true;
                            x_new = 0;
                            slidefunc.slideMotion(current);
                        }
                        //if
                        if(num < _this.width()*-0.1){
                            current = current + Math.floor(num/_this.width());
                            if(current < 0){
                                current = 0;
                            }
                            dragging = true;
                            x_new = 0;
                            slidefunc.slideMotion(current);
                        }else{
                            dragging = true;
                            x_new = 0;
                            slidefunc.slideMotion(current);
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
            windResize : function(){
                $(window).resize(function(){
                    //리사이징 상황의 행동 입력
                    Xposition = [];
                    slidefunc.sortSlide();
                    slidefunc.slideNomotion(current);
                });
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
                        var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                        x_origine = touch.pageX;
                        y_origine = touch.pageY;
                        slideWrapX = _this.find('ul.viSlider-slide').position().left;
                        $(this).bind('touchmove',function(event){
                            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            var x_diff = x_origine - touch.pageX;
                            var y_diff = y_origine - touch.pageY;
                            x_new = x_diff;
                            y_new = y_diff;
//                            console.log(y_new)

                                console.log(Math.abs(x_diff))
                            if(Math.abs(y_diff) < 15){
                                //가로 스와이핑을 해도 됨
                                scrollingAble = true;
                                if(!dragging && scrollingAble && Math.abs(x_diff) > 20)slidefunc.dragging(event,x_new);
                            }else{
//                                console.log("스와이핑" + Math.abs(y_diff))
                                scrollingAble = false;
                                $(this).unbind("touchmove");
                                if(!dragging)slidefunc.dragEnd(x_new);
                            }
                        });
                    });
                    _this.bind('touchend',function(event){
                        var sclVal = $(window).scrollTop(),
                            mg = $('#header').height() + $('.lnb_wrap').height();
                        if(sclVal > _this.offset().top - 100 - mg && sclVal < _this.offset().top + 50 - mg){
                            $('html,body').animate({
                                scrollTop: _this.offset().top - mg
                            }, 400, 'easeInOutCirc', function() {
                            });
                        }
                        //if
                        $(this).unbind("touchmove");
                        if(!dragging)slidefunc.dragEnd(x_new);
                    });
                }
                else{
                    _this.mousedown(function(event) {
                        _this.bind("mousemove");
                        x_origine = event.pageX;
                        y_origine = event.pageY;
                        slideWrapX = _this.find('ul.viSlider-slide').position().left;
                        $(this).mousemove(function(event){
                            var x_diff = x_origine - event.pageX;
                            var y_diff = y_origine - event.pageY;
                            x_new = x_diff;
                            y_new = y_diff;
                            if(Math.abs(y_diff) < 15){
                                //가로 스와이핑을 해도 됨
                                scrollingAble = true;
                                if(!dragging && scrollingAble)slidefunc.dragging(event,x_new);
                            }else{
//                                console.log("스와이핑" + Math.abs(y_diff))
                                scrollingAble = false;
                                $(this).unbind("mousemove");
                                if(!dragging)slidefunc.dragEnd(x_new);
                            }
                        });
                    });
                    _this.mouseleave(function(event) {
                        $(this).unbind("mousemove");
                        if(!dragging)slidefunc.dragEnd(x_new);
                      });
                    _this.mouseup(function(event) {
                        $(this).unbind("mousemove");
                        if(!dragging)slidefunc.dragEnd(x_new);
                    });
                }
                document.onselectstart = function() { return false; }
                //touch 기능 여부
                }
        }
        makeDepth.mk1depth();
        commonjs.windResize();
        if(setVal.dragable)eventControll.touchFunc();
    }

})(window.jQuery, window);