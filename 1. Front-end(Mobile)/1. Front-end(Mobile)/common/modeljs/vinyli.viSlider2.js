
;(function($, exports, undefined){
    "use strict";
    if(!$.fn.viSlider2){
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
    $.fn.viSlider2 = function(option){
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
            sint;
        _this.addClass('viSimpleSlider');
        var $WrapUl = _this.find('>ul');
        var intTime = 3000;

        var SimpleSlider = {
            mkSlide : function(e){
                $WrapUl.empty();
//                $WrapUl.width(maxSlide*_this.width());
                for(var i = 0; i < maxSlide; i++){
                    var thisLink = setVal.stru.dataList[i].link;
                    //orgImg[i] = setVal.stru.dataList[i].pc_img;
                    mImg[i] = setVal.stru.dataList[i].m_img;
                    if(setVal.stru.dataList[i].link.length > 1){
                        //링크값이 있다면
                        $('<li></li>').appendTo($WrapUl).html('<a href="' + setVal.stru.dataList[i].link + '" class="coverDiv" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:9"></a><img src=""/>');
                    }else{
                        $('<li></li>').appendTo($WrapUl).html('<div class="coverDiv" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1"></div><img src=""/>');
                    };
                    var thisLi = $WrapUl.find('li').eq(i);
                    /*if(setVal.stru.dataList[i].movie !== undefined){
                        $('<iframe width="100%" height="100%" border="0"></iframe>').appendTo(thisLi);
                        thisLi.find('>iframe').attr('src',setVal.stru.dataList[i].movie + '?controls=0&disablekb=1&rel=0&showinfo=0');
                        thisLi.find('>img').hide();
                    }*/
                    if(setVal.h3option){
                        //메인 슬라이드라 h3 노출을 위해서
                        $('<h3></h3>').prependTo(thisLi).html(setVal.stru.dataList[i].title);
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
                        var insertImg = mImg[index];
                        thisLi.find('>img').attr('src',insertImg);
                        //if
//                        console.log("값" + insertImg)
                    });
                }
                $(window).resize(function(){
                    Xposition = [];
                   imgInsert();
                });
                imgInsert();
                if(maxSlide > 1){
                    SimpleSlider.mkIndicate();
                }
                SimpleSlider.sortSlide();
//                if(setVal.autoPlay){
//                    SimpleSlider.autoSlide();
//                }
            },
            cloneslide : function(){
                _this.find('>ul').find('>li').eq(0).clone().appendTo(_this.find('>ul')).addClass('clone first').css('left',Xposition[1] + _this.find('>ul').find('>li').eq(1).width());
                _this.find('>ul').find('>li').eq(1).clone().appendTo(_this.find('>ul')).addClass('clone last').css('left',-_this.find('>ul').find('>li').eq(0).width());
//                _this.find('>ul').find('>li').eq(1).clone().prependTo(_this.find('>ul'));
            },
            autoSlide : function(){
                window.clearInterval(sint);
                sint = window.setInterval(function(){
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
                //m
                var insertImg = mImg[0];
                //if
                var img = new Image();
                img.onload = function(){
                    if(setVal.rszImgRepl && ($('#rsp_check').css('background-color') == 'rgb(255, 255, 255)' || $('#rsp_check').css('background-color') == 'white')){
                        var cutVal = 0;
                    }else{
                        var cutVal = setVal.cut;
                    }
                 var imgW = img.width;

                    slideWrapH = Math.floor(_this.width()*(img.height/img.width));

                    _this.height(slideWrapH);
                    _this.css({paddingTop:0});
                };
                img.src = insertImg;
                /*$(window).resize(function(){
                   imgInsert();
                });*/
            }
        };
        var makeDepth = {
            mkArrow : function(e){
                $('<a href="#"></a>').appendTo(_this).addClass('arrowBtn prev').html('<img src="../../images/model_view/hybridcommon/Btn_arrow_left.png">');
                $('<a href="#"></a>').appendTo(_this).addClass('arrowBtn next').html('<img src="../../images/model_view/hybridcommon/Btn_arrow_right.png">');
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
        if(maxSlide == 2)SimpleSlider.cloneslide();
        //두개밖에 없을 때는 이어지는게 어려워서 양쪽 슬라이드를 클론하여 배치함

        if(setVal.arrow && maxSlide > 1)makeDepth.mkArrow();
        //화살표 옵션 - 화살표 만들기
        if(setVal.autoPlay){
            SimpleSlider.autoSlide();
            _this.hover(function(e){
                window.clearInterval(sint);
            },function(e){
                SimpleSlider.autoSlide();
            });
        }
        //오토 슬라이딩 옵션 - 슬라이딩 실행

        /*function playMovie(ele){

        }*/
        var scrollingAble = false;
        var slidefunc = {
            slideMotion : function(targetIndex,loop){
                /* 이어지기 만드는 중 */
                var _loop = loop;
                slidefunc.reposition();
                /* 이어지기 만드는 중 */
//                console.log(targetIndex + ' / ' + _loop);
                var _ele = $WrapUl,
                    _elewidth = $WrapUl.find('li').eq(targetIndex).width();
                if(_loop == 0){
//                    console.log("체1")
                    thiscurrent = 0;
                    motioning = true;
                    _ele.stop().animate({
                        'left' : -(Xposition[maxSlide-1] + $WrapUl.find('li').eq(maxSlide-1).width())
                    },800,'easeOutQuint',function(){
                        motioning = false;
                        dragging = false;
//                        if(maxSlide > 2){
                            _ele.find('li').eq(0).css({'left' : 0});
                            _ele.css('left',0);
//                        }
                    });
                }else if(_loop == maxSlide-1){
//                    console.log("체2")
                    thiscurrent = maxSlide-1;
                    motioning = true;
                    _ele.stop().animate({
                        'left' : $WrapUl.find('li').eq(maxSlide-1).width()
                    },800,'easeOutQuint',function(){
                        motioning = false;
                        dragging = false;
//                        if(maxSlide > 2){
                            _ele.find('li').eq(maxSlide-1).css({'left' : Xposition[maxSlide-1]});
                            _ele.css('left',-Xposition[maxSlide-1]);
//                        }
                    });
                }else{
//                    console.log("체3")
                    motioning = true;
                    _ele.stop().animate({
                        'left' : -targetIndex*_elewidth
                    },800,'easeOutQuint',function(){
                        motioning = false;
                        dragging = false;
                    });
                }
                _this.find('div.indicate').find('>a').find('img').attr('src','../../images/model_view/hybridcommon/slide_indicate_normal.png')
                _this.find('div.indicate').find('>a').eq(thiscurrent).find('img').attr('src','../../images/model_view/hybridcommon/slide_indicate_active.png');
//                $WrapUl.find('li').removeClass('current').eq(thiscurrent).addClass('current');
            },
            //slideMotion
            reposition : function(){
                /*자리배치 맞추기*/
//                console.log("maxSlide " + maxSlide);
                if(maxSlide > 2){
                    //슬라이드가 2개 이상이여야 함
                    if(thiscurrent > 1){
                        var moveLi = Xposition[maxSlide-1] + $WrapUl.find('li').eq(maxSlide-1).width();
                        //첫번째 슬라이드가 맨뒤에가 붙어있는 것
                        $WrapUl.find('li').eq(0).css({'left' : moveLi});
                    }else{
                        //첫번째 슬라이드 다시 처음으로 돌아오는 것
                        $WrapUl.find('li').eq(0).css({'left' : 0});
                    }
                    if(thiscurrent < maxSlide-2){
                        //마지막 슬라이드가 처음의 앞으로 붙는 것
                        var moveLi = - $WrapUl.find('li').eq(maxSlide-1).width();
                        $WrapUl.find('li').eq(maxSlide-1).css({'left' : moveLi});
                    }else{
                        //마지막 슬라이드 다시 처음으로
                        var moviLi = Xposition[maxSlide-2] + $WrapUl.find('li').eq(maxSlide-1).width();
                        $WrapUl.find('li').eq(maxSlide-1).css({'left' : moviLi});
                    }
                }else{
                    //슬라이드가 2개만 있을 때
                    if(thiscurrent == 0){
                        //처음으로 돌아가야 한다면
                        var moveLi = Xposition[maxSlide-1] + $WrapUl.find('li').eq(maxSlide-1).width();
                        //첫번째 슬라이드가 맨뒤에가 붙어있는 것
//                        $WrapUl.find('li').eq(0).css({'left' : moveLi});
                    }else{
                        //첫번째 슬라이드 다시 처음으로 돌아오는 것
//                        $WrapUl.find('li').eq(0).css({'left' : 0});
                    }
                }
            },
            dragAction : function(event,num){
                var _ele = $WrapUl,
                    moveX;
                $('html,body').stop();
                window.clearInterval(sint);
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
            windResize : function(){
                $(window).resize(function(){
                    //리사이징 상황의 행동 입력
//                    var elmnt = document.getElementById("wrap");
//                    Xposition = [];
                    SimpleSlider.sortSlide();
                    slidefunc.slideMotion(thiscurrent);
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
                       if(!motioning && !dragging && maxSlide > 1){
                            window.clearInterval(sint);
                            $WrapUl.addClass('keydown');
                            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];
                            x_origine = touch.pageX;
                            y_origine = touch.pageY;
                            slideWrapX = $WrapUl.position().left;
                            $(this).bind('touchmove',function(event){
                                window.clearInterval(sint);
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
        commonjs.windResize();
        eventControll.touchFunc();
    }

})(window.jQuery, window);