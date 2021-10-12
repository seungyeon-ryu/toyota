( function( window, undefined ){

var coo, fn, win = window, doc = window.document;

coo = function(){};
coo.fn = fn = function( $name, $f, $global ){ 
	coo[$name] = $f; 
	if( $global ) win[$name] = $f;
};

//-------- Core function -------------------------------------------------------------------------------------------

fn( 'obj', function( $name, $o ){ coo[$name.toUpperCase()] = $o; });
fn( 'cls', function( $name, $o ){ coo[$name] = $o; });

fn( 'trace', function(){ 
	//win['console'] && console.log['apply'] && console.log.apply(console,arguments);
}, true );

fn( 'tpl', function ( $id, $info ) {
	var tpl,key;
	tpl = document.getElementById($id).innerHTML;
	for (key in $info) {
		tpl = tpl.replace(new RegExp("##"+key+"##","g"), $info[key]);
	}
	
	if(!coo.tpl.SQ)coo.tpl.SQ = 0;
	tpl = tpl.replace(/##\$SQ##/g, coo.tpl.SQ);
	tpl = tpl.replace(/##[^#]+##/g, "");
	coo.tpl.SQ++;
	
	return tpl;
});

fn( 'trim', function($v){
	switch( typeof $v ){
		case 'string': return $v.replace( /^\s*|\s*$/g, '' );
		case 'object':
			var i, obj;
			if( $v.splice ){ obj = [],i = $v.length; while( i-- ) obj[i] = coo.trim($v[i]); }
			else{ obj = {}; for( i in $v ) if( $v.hasOwnProperty(i) ) obj[i] = coo.trim($v[i]); }  
			return obj;
		
		default: return $v;
	}
});

fn( 'js', function($v){
	$.ajax({
	    url: $v,
	    dataType: "script",
	    async: false,
	    success: function () {},
	    error: function () { throw new Error("Could not load script " + $v); }
	});
});

fn( 'css', function($selector, $rules, $index){
	var sheet = coo.SHEET;
    $index = $index || 0;
	
	if( sheet['insertRule'] ){
		sheet.insertRule($selector + "{" + $rules + "}", $index);
	} else {
		sheet.addRule($selector, $rules, $index);
	}
});


//-------- Object -------------------------------------------------------------------------------------------

coo.obj('PARS', (function(){
	var r = null;
	if (location.search) {
	    var parts = location.search.substring(1).split('&');
	    for (var i = 0; i < parts.length; i++) {
	        var nv = parts[i].split('=');
	        if (!nv[0]) continue;
			if (!r) r = {};
	        r[nv[0]] = decodeURIComponent(nv[1]) || true;
	    }
	}
	return r;
})());

coo.obj('SHEET', (function(){
	var _sheet;
	
	_sheet = doc.createElement( 'style' );
	doc.getElementsByTagName( 'head' )[0].appendChild( _sheet );
	_sheet = _sheet.styleSheet || _sheet.sheet;

	return _sheet;
})());

coo.cls( 'VIEW', (function(){
	var _view = doc.documentElement || doc.body;
	return {
		width : function(){ return _view['clientWidth']; },
    	height : function(){ return _view['clientHeight']; }
	}
})());

// -------- Util -------------------------------------------------------------------------------------------

fn( 'extractPropArr', function($arr, $prop){
	var result = [], i=0, len = $arr.length;
	for( ; i<len; ++i ){
		result.push( $arr[i][$prop] );
	}
	return result;
});

fn( 'zerofill', function($v){
	return parseInt($v)<10?'0'+$v:$v;
});

fn('isMoblie', (function(){
	var check = false;
	(function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
})());


// 주민등록번호 유효성 검사
fn('valiRRN', function(){
	var fmt = /^\d{6}-[1234]\d{6}$/;
	if (!fmt.test(resno)) return false;
	
	// 날짜 유효성 검사
	var birthYear = (resno.charAt(7) <= "2") ? "19" : "20";
	birthYear += resno.substr(0, 2);
	var birthMonth = resno.substr(2, 2) - 1;
	var birthDate = resno.substr(4, 2);
	var birth = new Date(birthYear, birthMonth, birthDate);
		
	if ( birth.getYear() % 100 != resno.substr(0, 2) ||
	     birth.getMonth() != birthMonth ||
	     birth.getDate() != birthDate) {
	  return false;
	}
		
	// Check Sum 코드의 유효성 검사
	var i;
	var buf = new Array(13);
	for (i = 0; i < 6; i++) buf[i] = parseInt(resno.charAt(i));
	for (i = 6; i < 13; i++) buf[i] = parseInt(resno.charAt(i + 1));
		
	var multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
	for (i = 0, sum = 0; i < 12; i++) sum += (buf[i] *= multipliers[i]);
	if ((11 - (sum % 11)) % 10 != buf[12]) {
	  return false;
	}
	return true;
});

// 이메일 유효성 검사
fn('valiEmail', function($value){
	return new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$").test($value);
});

// 영문,숫자 조합 유효성 검사
fn('valiMixed', function($value){
	var chk_num = str.search(/[0-9]/g);
	var chk_eng = str.search(/[a-z]/ig);
	return (chk_num < 0 || chk_eng < 0)? false : true;
});


fn('extractPropArr', function( $arr, $prop ){
	var result = [], i=0, len = $arr.length;
	for( ; i<len; ++i ){
		result.push( $arr[i][$prop] );
	}
	return result;
});

fn('toDate', function( $org ){
	var tmp = $org.split("-");
	return new Date(tmp[0], tmp[1]*1-1, tmp[2]);
});

fn('zerofill', function($t){
	return parseInt($t)<10?'0'+$t:$t;
});

fn('windowPopup', function($url,$name,$opt){
	var o, opt={}, arr=[];
	
	$opt = $opt || {};
	
	opt.width = $opt.width || viewport().width;
	opt.height = $opt.height || viewport().height;
	opt.left = $opt.left || (screen.availWidth-opt.width)>>1;
	opt.top = $opt.top || (screen.availHeight-opt.height)>>1;
	
	opt = $.extend({
		scrollbars	: $opt.scrollbars || 1,
		location 	: 0,
		menubar		: 0,
		titlebar	: 0,
		toolbak		: 0
	}, opt);
	
	for ( o in opt ) arr.push(o+"="+opt[o]);
	
	window.open( $url, $name, arr.join(','));
});

fn('imagePopup', function($src,$wh,$ht,$ttl,$link,$sq,$target){
	var t,l,look,pop,ttl;
	ttl = $ttl || 'Image Window';
	t = (screen.availHeight-$ht)/2;
	l = (screen.availWidth-$wh)/2;
	look='menubar=0,titlebar=0,toolbak=0,location=no,scrollbars=yes,status=no,width='+$wh+',height='+$ht+',left='+l+',top='+t;
	pop=window.open(" ","",look);
	pop.document.open();
	pop.document.write('<head><title>'+ ttl +'</title><style>*{padding:0;margin:0;border:0;}</style></head><body><img style="cursor:hand;" onclick="\''+$target+'\' == \'_blank\' ? window.open(\''+$link+'\') : opener.location.href = \''+$link+'\';window.close()" src="'+$src+'">'+
		'<div style="overflow:hidden;position: relative; padding:6px; background:#3a3e49; height:25px;box-sizing:border-box;">' +
		'<span style="float:left;color:white"><a style="cursor:pointer;font-family:\'돋움\', Dotum, \'굴림\', Gulim, Helvetica, Sans-serif;font-size:12px" onclick="opener.setCookie(\'popup_'+$sq+'\',\'1\',1);window.close()">오늘하루 그만보기</a></span>'+
		'<span style="float:right;color:white"><a style="cursor:pointer;font-family:\'돋움\', Dotum, \'굴림\', Gulim, Helvetica, Sans-serif;font-size:12px" onclick="window.close()">닫기</a></span>'+
		'</div></body>');
	pop.document.close();
});

function checkForm(form) {
	var i, j, t, q = [], arr=[], name;
	for (i=0,j=form.elements.length;i<j;++i) {
		t = form.elements[i];
		
		if ( t.name == "f" || t.name === "" || t.getAttribute('optional') == 1) continue;
		
		switch (t.nodeName) {
			case "INPUT":
			case "TEXTAREA":
				if ( !trim(t.value).length ) return t.name;
			break;
			case "SELECT":
			break;
		}
	}
	
	if( !$('.agree').is(':checked')) return 'AGREE';
	
	return 0;
}







$(function(){
	$('table').attr({'cellpadding':'0', 'cellspacing':'0'});
});





/* fix ie8 substr */
if ('ab'.substr(-1) != 'b')
{
    /**
     *  Get the substring of a string
     *  @param  {integer}  start   where to start the substring
     *  @param  {integer}  length  how many characters to return
     *  @return {string}
     */
    String.prototype.substr = function(substr) {
        return function(start, length) {
            if (start < 0) start = this.length + start;
            return substr.call(this, start, length);
        }
    }(String.prototype.substr);
}

/* naturalSize plugin */
(function($){
	var
	props = ['Width', 'Height'],
	prop;
	
	while (prop = props.pop()) {
	(function (natural, prop) {
	  $.fn[natural] = (natural in new Image()) ? 
	  function () {
	  return this[0][natural];
	  } : 
	  function () {
	  var 
	  node = this[0],
	  img,
	  value;
	
	  if (node.tagName.toLowerCase() === 'img') {
	    img = new Image();
	    img.src = node.src,
	    value = img[prop];
	  }
	  return value;
	  };
	}('natural' + prop, prop.toLowerCase()));
	}
}(jQuery));

if (!Date.prototype.print) {
	Date.prototype.print = function( $sep ) {
		sep = $sep || '-';
	    var yyyy = this.getFullYear().toString();
	    var mm = (this.getMonth()+1).toString();     
	    var dd  = this.getDate().toString();             
	                        
	    return yyyy + sep + (mm[1]?mm:"0"+mm[0]) + sep + (dd[1]?dd:"0"+dd[0]);
	}; 
}

if( !Array.prototype.indexOf ){
    Array.prototype.indexOf = function($obj){
        for( var i=0; i<this.length;++i){
            if(this[i] == $obj){
                return i;
            }
        }
        return -1;
    }
}

win.$c = win.coo = coo;

})(this);

function getCookie( name ){
	var nameOfCookie = name + "=";
	var x = 0;
	while ( x != document.cookie.length )
	{
		var y = (x+nameOfCookie.length);
		if ( document.cookie.substring( x, y ) == nameOfCookie ) {
			if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 )
				endOfCookie = document.cookie.length;
			return unescape( document.cookie.substring( y, endOfCookie ) );
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if ( x == 0 ) break;
	}
	return "";
}

function setCookie(name, value, expiredays){
	var todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + expiredays);
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}
