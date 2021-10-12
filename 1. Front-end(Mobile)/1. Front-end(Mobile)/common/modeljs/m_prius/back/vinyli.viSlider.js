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
            subtitle : false
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
            orgImng = [],
            dragging = false,
            tabmove = 0,
            slideLiWd,
            slideWrapH,
            slideWrapX,
            x_origine,
            x_new;
        _this.addClass('viSlider');
        
        var makeDepth = {
            clickDepth : function(num){                
                commonjs.dimShow();
                _this.find('.viSlider-tabmenu').find('li').removeClass('current');
                _this.find('.viSlider-tabmenu').find('li').eq(num).addClass('current');
                if(setVal.idca)makeDepth.mk2depth(num);
                slidefunc.mkSlide(num);
                current = 0;
                _this.find('ul.viSlider-slide').css('left',0).stop();                
                _this.find('ul.viSlider-indicate').find('li').removeClass('current').eq(0).addClass('current');
            },
            mk1depth : function(){
                $('<ul></ul>').appendTo(_this).addClass('viSlider-tabmenu');
                if(setVal.tabmenu){
                    for(var i = 0; i < setVal.stru.length; i++){
                        
                        $('<li></li>').appendTo(_this.find('.viSlider-tabmenu')).html('<a href="#" title="' + setVal.stru[i].title + '탭 메뉴 내용 보기">' + setVal.stru[i].title + '</a>')
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
                orgImng = [];
                if(!_this.find($('ul.viSlider-indicate')).length){
                    $('<ul></ul>').appendTo(_this).addClass('viSlider-indicate');
                }else{
                    _this.find('ul.viSlider-indicate').html('');
                }
                //if
                maxSlide = setVal.stru[num].subcategory.length;
                for(var i = 0; i < setVal.stru[num].subcategory.length; i++){
                    $('<li></li>').appendTo(_this.find('.viSlider-indicate')).html('<a href="#" class="thumbnail" title="' + setVal.stru[num].subcategory[i].title + ' 슬라이드 활성화"><img src="' + setVal.stru[num].subcategory[i].thumbnail + '"></a><a href="#" class="title" title="' + setVal.stru[num].subcategory[i].title + ' 슬라이드 활성화">' + setVal.stru[num].subcategory[i].title + '</a>')
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
       
        var slidefunc = {
            slideMotion : function(targetIndex){
//                console.log("슬라이드")
                var _ele = _this.find('ul.viSlider-slide'),
                    _elewidth = _this.find('ul.viSlider-slide').find('li').eq(targetIndex).width();
                _ele.stop().animate({
                    'left' : -targetIndex*_elewidth
                },400,'easeOutQuint',function(){
                    dragging = false;
                    if(tabmove !== 0){
                        if(currentDepth > 0 && tabmove == -1){
                            currentDepth--;
                            tabmove = 0;
                            x_new = 0;
                            makeDepth.clickDepth(currentDepth);
                        }else if(currentDepth < setVal.stru.length-1 && tabmove == 1){
                            currentDepth++;
                            tabmove = 0;
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
                    $('<div></div>').appendTo(_this).addClass('viSlider-slideWrap');
                    $('<ul></ul>').appendTo(_this.find('.viSlider-slideWrap')).addClass('viSlider-slide');
                }else{
                    _this.find('ul.viSlider-slide').html('');
                }
                //if
                for(var i = 0; i < setVal.stru[num].subcategory.length; i++){                    
                    var subtitle="";
                        if(setVal.subtitle){
                            subtitle = '<div class="subtitle"><h2>' + setVal.stru[num].subcategory[i].subtitle + '</h2><p>' + setVal.stru[num].subcategory[i].descript + '</p></div>';
                        }
                    $('<li></li>').appendTo(_this.find('.viSlider-slide')).css({
                        'background-image' : 'url("' + setVal.stru[num].subcategory[i].orgImage + '")',
                        backgroundSize: "cover"
                    }).append(subtitle);
                    orgImng[i] = setVal.stru[num].subcategory[i].orgImage;
                }
                //for
                slidefunc.sortSlide();
                _this.find('.viSlider-indicate').find('li').eq(current).addClass('current');
                _this.find('.viSlider-indicate').find('li').eq(0).addClass('firstli');
                _this.find('.viSlider-indicate').find('li').eq(setVal.stru[num].subcategory.length - 1).addClass('lastli');
            },
            //mkSlide
            sortSlide : function(){
                var img = new Image();
                img.onload = function(){
                    /*이미지로드 이후*/
                    var imgW = img.width;
                    slideWrapH = _this.width()*(img.height/img.width);
                    _this.height(slideWrapH);
                    _this.find('.viSlider-slide').find('li').height(slideWrapH);
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
                img.src = orgImng[0];
                _this.find('.viSlider-slide').find('li').each(function(index){
                    var _thisLi = $(this);
                    Xposition[index] = index*_this.width();
                    _thisLi.css('left',index*_this.width());
                    _thisLi.width(_this.width());
                });
                //each
            },
            //sortSlide
            dragging : function(num){
                var _ele = _this.find('ul.viSlider-slide'),
                    moveX;                        
                _ele.addClass('keydown');
                if(setVal.tablink){
                    var paddL = (slideLiWd*0.05)-(slideLiWd/num);
                    if(paddL < 1)paddL = 1;
                }
                //console.log("slideWrapX : " + slideWrapX)
                if(num > 0){
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
                }else{
                    /*움직임이 - 발생한다면*/
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
                    slidefunc.slideMotion(current);
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
                        slideWrapX = _this.find('ul.viSlider-slide').position().left;
                        $(this).bind('touchmove',function(event){
                            var touch = event.originalEvent.touches[0] || event.originalEvent.changedTouches[0];       
                            var x_diff = x_origine - touch.pageX;
                            x_new = x_diff;
                            if(!dragging)slidefunc.dragging(x_new);                          
                        });
                    });
                    _this.bind('touchend',function(event){
                        $(this).unbind("touchmove");
                        if(!dragging)slidefunc.dragEnd(x_new);                        
                    });
                }else{
                    _this.mousedown(function(event) {
    //                    console.log('마우스 다운')
                        $(this).bind("mousemove");
                        x_origine = event.pageX;
                        slideWrapX = _this.find('ul.viSlider-slide').position().left;
                        $(this).mousemove(function(event){
                            var x_diff = x_origine - event.pageX;
                            x_new = x_diff;
                            if(!dragging)slidefunc.dragging(x_new);
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
                //touch 기능 여부
                }
        }
        makeDepth.mk1depth();
        commonjs.windResize();
        if(setVal.dragable)eventControll.touchFunc();
    }
  
})(window.jQuery, window);