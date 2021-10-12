//----------------------------------------------------------------------- (0. 파라미터 받기 정의)
var tNum = cNum = -1,
    loc, sv = 0, openpopup, modelopen, dymlink, sval = '', keyword = '';
var QueryString = function () {
      var query_string = {};
      var query = window.location.search.substring(1);
        vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      } 
    if("cnum" in query_string)cNum = query_string.cnum;
    if("cNum" in query_string)cNum = query_string.cNum;
    if("page" in query_string)cNum = query_string.page;
    if("tnum" in query_string)tNum = query_string.tnum;
    if("catId" in query_string)catId = query_string.catId;
    if("orderNum" in query_string)orderNum = query_string.orderNum;
    if("loc" in query_string)loc = Number(query_string.loc);
    if("sv" in query_string)sv = Number(query_string.sv);
    if("openpopup" in query_string)openpopup = String(query_string.openpopup);
    if("modelopen" in query_string)modelopen = String(query_string.modelopen);
    if("dymlink" in query_string)dymlink = String(query_string.dymlink);
    if("sval" in query_string)sval = String(query_string.sval);
    if("keyword" in query_string)keyword = String(query_string.keyword);
        return query_string;
}();

//----------------------------------------------------------------------- 셋타임이 내장된 리사이즈 함수
function resizeModule(fn){
    "use strict";
    var setID;
    $(window).resize(function(){
        window.clearTimeout(setID);
        setID = window.setTimeout(function(){
            if(typeof(fn) == 'function')fn();
//            console.log('s : ' + setID)
        },100);        
    });
};
//----------------------------------------------------------------------- 외부 html 파일 불러와서 엘리먼트에 파싱
function parseHTML(urlval, typeval, param, ele){
//    console.log(" ajaxcalling 모듈 실행 : " + urlval);
    $.ajax({
         type: typeval,
         url: urlval,
         dataType: "html",
         data : param,
         success: function(data){
            ele.html(data);
        },error: function(XMLHttpRequest, textStatus, errorThrown) { 
             console.log(urlval + " error : " + textStatus);
        },timeout: 100000
    });	
}
//ajaxcallingHTML(json경로, 타입, 콜백함수)
//----------------------------------------------------------------------- 외부 html 형식 파일 불러와서 콜백하는 함수
function ajaxcallingHTML(urlval, typeval, param, callback){    
    "use strict";
    var p = param;
    $.ajax({
         type: typeval,
         url: urlval,
         dataType: "html",
         data : param,
         success: function(data){
            callback(data,p);
        },error: function(XMLHttpRequest, textStatus, errorThrown) { 
             console.log(urlval + " error : " + textStatus);
        },timeout: 100000
    });	
}
//ajaxcallingHTML(json경로, 타입, 콜백함수)

//----------------------------------------------------------------------- 외부 json 형식 파일 불러와서 콜백하는 함수
function ajaxcallingJSON(urlval, typeval, param, callback){    
    "use strict";
    $.ajax({
         type: typeval,
         url: urlval,
         dataType: "JSON",
         data : param,
         success: function(data){
            callback(data);
        },error: function(XMLHttpRequest, textStatus, errorThrown) { 
             console.log(urlval + " error : " + textStatus);
        },timeout: 100000
    });	
}
//ajaxcallingJSON(json경로, 타입, 콜백함수)
//----------------------------------------------------------------------- 외부 파일 불러와서 콜백하는 함수
function ajaxcalling(urlval, typeval, param, callback){    
    "use strict";
    $.ajax({
         type: typeval,
         url: urlval,
         data : param,
         success: function(data){
            callback(data);
        },error: function(XMLHttpRequest, textStatus, errorThrown) { 
             console.log(urlval + " error : " + textStatus);
        },timeout: 100000
    });	
}
//ajaxcalling(json경로, 타입, 콜백함수)


function ajaxcalling_jsonp(urlval, typeval, param, typeData, jsonpCall, callback){
    "use strict";
    $.ajax({
         type: typeval,
         url: urlval,
         data : param,
         dataType:typeData,        
         jsonpCallback : jsonpCall,
//         jsonp : jsonpCall,
         success: function(data){
            callback(data);
        },error: function(XMLHttpRequest, textStatus, errorThrown) { 
             console.log(urlval + " error : " + textStatus);
        },timeout: 100000
    });	
}
//ajaxcalling_jsonp(json경로, 타입, datatype, callback네임, 콜백함수)


//----------------------------------------------------------------------- 공통 실행 함수
var commonjs = {
    eventClick : function (event) {
        if(event.preventDefault) {
            event.preventDefault(); //FF
        } else {
            event.returnValue = false; //IE
        }
    },
    agentCheck : function(){
        if(navigator.userAgent.match(/Mobile|iP(hone|od)|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/)){
            return "MOBILE";
        }else{
            return "PC";
        }
    },
    ieCheck : function(){
        var agent = navigator.userAgent.toLowerCase();
        if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
            return true;
        }else{
            return false;
        }
    },
    randomArray : function(array){
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    scrollToBody : function(num,speed,fn){          
        if($('body').scrollTop() !== num){
            $('html,body').animate({
                scrollTop: num
            }, speed, 'easeInOutCirc', fn);
        }
        //if
    },
    scrollToDiv : function(ele,num,speed,fn){            
        if(ele.scrollTop() !== num){
            ele.animate({
                scrollTop: num
            }, speed, 'easeInOutCirc', fn);
        }
        //if
        },
    isMobile : function(){
        if($('#rsp_check').css('background-color') == 'rgb(255, 255, 255)' || $('#rsp_check').css('background-color') == 'white'){
            //m
            return true;
        }else{
            //pc
            return false;
        }
    }
};