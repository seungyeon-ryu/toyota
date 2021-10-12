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

	var guide = function(){
		var _ = this;

		_.init();
	}

	guide.prototype.getElements = function(){
		var _ = this;

		_.$guide = $('#guide');
		_.$demohtml = _.$guide.find('.demo-html');
		_.$democss = _.$guide.find('.demo-css');
		_.$demojs = _.$guide.find('.demo-js');

		_.nodewrap = '<pre class="code-wrap">';
		_.nodehtml = '<code class="code-html">';
		_.nodecss = '<code class="code-css">';
		_.nodejs = '<code class="code-js">';
	}

	guide.prototype.compress = function(c){
		var	c = c.substring(c.indexOf('\n')+1).substring(0, c.lastIndexOf('\n'))
			, t = c.split('\n')[0].match(/\t/g).length
			, a = eval('/\\t{'+t+'}/')
			, r = ''
			, i = 0;

		for(i = 0; i < c.split('\n').length; i++){
			r += i === 0 ? '' : '\n';
			r += c.split('\n')[i].replace(a, '');
		}

		return r;
	}

	guide.prototype.setsources = function(target, node){
		var _ = this;

		if(target.length){
			target.each(function(){
				this.$wrap = $(this).after(_.nodewrap).next();
				this.$node = this.$wrap.html(node).children();
				this.$html = this.$node.text(_.compress($(this).html()));

				$(this).remove();

				hljs.highlightBlock(this.$html[0]);
			});
		}
	}

	guide.prototype.init = function(){
		var _ = this;

		$(document).ready(function(){
			_.getElements();
			_.setsources(_.$demohtml, _.nodehtml);
			_.setsources(_.$democss, _.nodecss);
			_.setsources(_.$demojs, _.nodejs);
		});
	}

	window.guide = new guide();
}));