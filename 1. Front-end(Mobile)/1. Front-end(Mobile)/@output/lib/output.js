(function(factory){
    'use strict';

    if(typeof define === 'function' && define.amd){
		define(['jquery'], factory);
    }else if(typeof exports !== 'undefined'){
		module.exports = factory(require('jquery'));
    }else{
		factory(jQuery);
    }
}(function($){
    'use strict';

	var output = function(){
		var _ = this;

		_.init();
	}

	output.prototype.getElements = function(){
		var _ = this;

		_.$pagelink = $('#output .navi a');
		_.$iframe = $('#outputView');
	}

	output.prototype.setbutton = function(){
		var _ = this;

		_.$pagelink.each(function(i){
			if($(this).next('ul').length){
				$(this).replaceWith($('<button type="button" class="trigger">'+this.innerHTML+'</button>'));
			}else{
				if($(this).attr('href') !== '#self'){
					$(this).addClass('c').attr('target','outputView');
					$(this).after('<span class="url">'+$(this).attr('href').replace('..','')+'</span>');
				}else{
					$(this).addClass('p').attr('title','미완성 페이지 입니다.');
				}
			}
		});
	}

	output.prototype.onClickLink = function(){
		var _ = this;

		_.$trigger = $('#output .navi .trigger');
		_.$progress = $('#output .navi .p');
		_.$complete = $('#output .navi .c');

		_.$complete.eq(0).addClass('on');

		_.$iframe.attr('src',_.$complete.eq(0).attr('href'));

		_.$trigger.on('click', function(){
			$(this).parent('li').toggleClass('close');
		});

		_.$progress.on('click', function(e){
			e.stopPropagation();
			e.preventDefault();
		});

		_.$complete.on('click', function(){
			_.$complete.removeClass('on');
			$(this).addClass('on');
		});
	}

	output.prototype.init = function(){
		var _ = this;

		$(document).ready(function(){
			_.getElements();
			_.setbutton();
			_.onClickLink();
		});
	}

	window.output = new output();
}));