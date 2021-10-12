// v 0.1 : 문서 on load 하는 방식에서 각 이미지 별 로딩 후 배치하는 식으로 변경 (온로드 후에도 이미지 로드가 덜되어 겹치는 문제 발생했기 때문)
// v 0
;(function($, exports, undefined){
    "use strict";
    if(!$.fn.viCardLayout){
        var settings = {
            mobileW : 960,
            liWidth : 320,
            spaceBottom : 20
        }
    }
    //if
    $.fn.viCardLayout = function(option){
        var _this = $(this),
            _thisUl = _this.find('>ul'),
            setVal = $.type(option) == 'object' ? $.extend({},settings,option) : settings;
        _this.addClass('vi-cardlayout').css('overflow','hidden');
        var maxH = 0,
            totalCol,
            widthVal = $(window).width(),
            cNum = 0,
            leftPos = [];
        
        
        var setA = {
            fncA : function(){     
                cNum = 0;
                maxH = 0;
                leftPos = [];
                widthVal = $(window).width();
                totalCol = Math.floor(_thisUl.width()/setVal.liWidth);
                if($('html').hasClass('ie8')){
                var    widthVal2 = $(window).width()+40;
                    if(widthVal2 >= 1920){
                        totalCol = 5;
                        _this.css('width','1680px');
                    }else if(widthVal2 < 1800 && widthVal2 >= 1280){
                        totalCol = 3;
                        _this.css('width','1000px');
                    }else if(widthVal2 < 1280 && widthVal2 >= 960){
                        totalCol = 2;
                        _this.css('width','660px');
                    }else if(widthVal2 < 960){
                        totalCol = 1;
                        _this.css('width','100%');
                    }
                    _this.css('margin-left',(widthVal2 - _thisUl.width())*0.5);
                    
                }
//                console.log("--------------------" + (widthVal2 - _thisUl.width()))
//                console.log('widthVal : ' + widthVal + " / ul width : " + _thisUl.width() + " / sub_contInner : " + $('.sub_contInner').width())
//                console.log('totalCol : ' + totalCol)
                for(var i = 0; i < totalCol; i++){
                    leftPos[i] = (setVal.liWidth + 20) * i;
                    
                }
                //for
//                setA.fncB(cNum);
                setA.fncB(cNum);
            },
            fncB : function(getCnum){
                var index = getCnum; // 넘어온 번째수
                var _thisLi = _thisUl.find('>li').eq(index); //타겟 li
                var topVal = 0; //
                
                
                if(widthVal <= setVal.mobileW){
                    
                    //모바일 화면으로 적용
                    _thisLi.css({
                        'position' : 'relative',
                        'left' : 0,
                        'top' : 0
//                        'top' : setVal.spaceBottom 2016-05-13 민환씨가 여백 없어도 될 것 같다고 하여 제외시켜봄
                    });
                }else{
                    //PC 화면으로 적용
//                    console.log('index : ' + index + ' / totalCol : ' + totalCol);
                    if(index > totalCol-1){
                        topVal = _thisUl.find('>li').eq(index-totalCol).position().top + _thisUl.find('li').eq(index-totalCol).height() + setVal.spaceBottom;                        
                    }
                    _thisLi.css({
                        'position' : 'absolute',
                        'left' : leftPos[index%totalCol] + "px",
                        'top' : topVal
                    });
                    //_thisLi
//                    console.log("좌표 " + leftPos[index%totalCol] + ' / t : ' + topVal)
                }
                //if
                var imgSRC = _thisLi.find('.inside_img > img').attr('src');
//                console.log(index + 'img ' + _thisLi.find('img').attr('src'))
                if(imgSRC == undefined || imgSRC == null){
                    afterLoad();
                }else{
//                    console.log("이미지" + index)
                    var img = new Image();
                        img.onload = function(){
                            afterLoad();
                        };
                        img.onerror= function(){
                            _thisLi.find('.inside_img').empty();
                            afterLoad();
                        }
                        img.src = _thisLi.find('.inside_img > img').attr('src');
                }
                function afterLoad(){
                    if(maxH < topVal + _thisLi.height())maxH = topVal + _thisLi.height();
                    if(index < _thisUl.find('>li').length-1){
//                        console.log( "INDEX : " + index +  " / 전체 li수 : " + (_thisUl.find('>li').length-1))
//                    if((_thisUl.find('>li').length-1) == 10)console.dir(_thisUl.find('>li'))
//                        console.log('cNum : ' + cNum)
                        cNum = index+1;
                        setA.fncB(cNum);
//                            console.log(maxH)
                    }else if(index == _thisUl.find('>li').length-1){
                        if(widthVal <= setVal.mobileW){
                            _thisUl.css({'height' : 'auto','margin-bottom' : '40px'});
                        }else{
                            _thisUl.height(maxH);
                        }
//                            console.log("완료");

                    }
                }
                //afterLoad
                
            }//            
        };
        setA.fncA();        
        var commonjs = {
            eventClick : function (event) {
                if(event.preventDefault) {
                    event.preventDefault(); //FF
                } else {
                    event.returnValue = false; //IE
                }
            }
        };
        //var commonjs
        $(window).resize(function(){
            //리사이징 상황의 행동 입력
            cNum = 0;
//            console.log("리사이즈 " + cNum);
            setA.fncA();
//            setA.fncB($(this).width());
        });
        
        
    }
})(window.jQuery, window);
    