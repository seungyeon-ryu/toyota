	
	const ENV = (/Android/i.test(navigator.userAgent)) ? 'and' : (/iPhone|iPad|iPod/i.test(navigator.userAgent)) ? 'ios' : 'pc';
	var latitude = '';
	var longitude = '';
	
	function getLocateInfo (lat, lng) {
		latitude = lat;
		longitude = lng;
	}

	$.fn.basic_post = function (url, data, dataType) {		
		var prom = $.Deferred();
		$.ajax({
		    url: url,
		    data: data,
		    dataType: dataType,
		    cache: false,
		    processData: false,
		    type: 'POST',
		    success: function (result) {
	        	prom.resolve(result);
	        },
	        error: function () {
	        	prom.reject.apply(null, arguments);
	        }
		});
		
		return prom;
	};

	$.fn.data_post = function(url, data, dataType){		
		var prom = $.Deferred();
		$.post(url, data, function( result ){
			prom.resolve( result );
		}, dataType).error(function(){
			prom.reject.apply(null, arguments);
		});
		
		return prom;
	};
	
	$.fn.multi_post = function(url, data, dataType){
		var prom = $.Deferred();
		$.ajax({
	        url: url,
	        type: "POST",
	        data: data,
	        async: false,
	        cache: false,
	        contentType: false,
	        processData: false,
	        dataType: dataType,
	        success:  function(result){
	        	prom.resolve( result );
	        },
	        error : function(){
	        	prom.reject.apply(null, arguments);
	        }
	    });
				
		return prom;
	};
		