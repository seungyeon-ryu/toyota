(function($){
	'use strict';

	if(typeof window.newriver === 'undefined'){
		var newriver = window.newriver = {}
	}

	$.fn.imagesLoaded = function(){
		var $imgs = this.find('img[src!=""]'), dfds = [];

		if (!$imgs.length){
			return $.Deferred().resolve().promise();
		}

		$imgs.each(function(){
			var dfd = $.Deferred(), img = new Image();
			dfds.push(dfd);
			img.onload = function(){dfd.resolve();}
			img.onerror = function(){dfd.resolve();}
			img.src = this.src;
		});

		return $.when.apply($, dfds);
	}

	newriver.init = (function(_){
		(function deviceCheck(md){
			/* check device */
			_.isDevice   = md.mobile();		/* smart device	: newriver.isDevice */
			_.isMobile   = md.phone();		/* mobile		: newriver.isMobile */
			_.isTablet   = md.tablet();		/* tablet		: newriver.isTablet */
			_.isDesktop  = !md.mobile();	/* desktop		: newriver.isDesktop */
		})(new MobileDetect(window.navigator.userAgent));

		(function setViewport(viewport){
			if(_.isDesktop){
				/* set desktop viewport */
				viewport.attr({'content':'width=750, user-scalable=no'});
			}
			if(_.isTablet){
				/* set tablet viewport */
				viewport.attr({'content':'width=750, user-scalable=no'});
			}
			if(_.isMobile){
				/* set mobile viewport */
				viewport.attr({'content':'width=750, user-scalable=no'});
			}
		})($('meta[name=viewport]'));

		var getElements = function(){
			_.$html			=	$('html');
			_.$body			=	$('body');
			_.$wrap			=	$('#wrap');
			_.$header		=	$('#header');
			_.$gnb			=	$('#gnb');
			_.$gnbdepth		=	$('#gnb > ul > li');
			_.$gnbdepth2	=	$('#gnb > ul > li > a');
			_.$container	=	$('#container');
			_.$main			=	$('#main');
			_.$contents		=	$('#contents');
			_.$footer		=	$('#footer');
			_.$motion		=	$('.n-motion');
			_.$motionTop    =   [];
			_.$motion.each(function(i, elem) {
			    var motionTop = $(elem).offset().top;

			    if (_.$motionTop) {
			    	_.$motionTop.push(motionTop);
			    } else {
			    	_.$motionTop = [motionTop];
			    }
			});
		}

		var getWindowSize = function(){
			_.winsizeW = $(window).outerWidth();
			_.winsizeH = $(window).outerHeight();
		}

		var getWindowScrl = function(){
			_.winscrlT = $(window).scrollTop();
			_.winscrlL = $(window).scrollLeft();
		}

		return {
			onLoad : function(){
				getElements();
				getWindowSize();
				getWindowScrl();

				_.headerAction();
				_.loadmotion.init();
				_.refreshAction();
				_.loaderAction();
			},
			onResize : function(){
				getWindowSize();
			},
			onScroll : function(){
				getWindowScrl();
			}
		}
	})(newriver);

	newriver.ajaxpopup = (function(_){
		var def = {
			defaults : {
				background : true,
				backgroundClose : true,
				top : false,
				left : false,
				openCallback : function(data){},
				closeCallback : function(){}
			},
			idx : 0,
			setInit : function(popup, settings){
				var defIdx = def.idx++;
				popup.opt = $.extend({}, def.defaults, settings);
				popup.$back = popup.opt.background ? _.$body.append('<div class="layer-back">').children('.layer-back:last-child') : false;
				popup.$wrap = popup.$back.append('<div class="layer-wrap">').children('.layer-wrap:last-child');
				popup.seq = defIdx;
				popup.resizeEvent = 'resize.ajaxpopup'+defIdx;
			},
			setPosition : function(popup){
				popup.$wrap.w = popup.$wrap.outerWidth();
				popup.$wrap.h = popup.$wrap.outerHeight();
				popup.$wrap.t = popup.$wrap.h > _.winsizeH * 0.8 ? _.winscrlT + _.winsizeH * 0.1 : _.winscrlT + (_.winsizeH - popup.$wrap.h) / 2;
				popup.$wrap.l = (_.winsizeW - popup.$wrap.w) / 2;

				return popup.$wrap;
			},
			setClose : function(popup){
				popup.$close = _.$body.find('[layer="close"]');
				$('.layer-back:last-child').on('click', function(e){
					var targetThis = $(e.target)[0];
					e.stopPropagation();

					if (popup.opt.backgroundClose && e.target.className.indexOf('layer-wrap') > -1) {
						popup.opt.closeCallback();
						popup.close(targetThis);
					}
				});

				popup.$close.on('click', function(e){
					var target = e.currentTarget;
					popup.opt.closeCallback();
					popup.close(target);
				});
			},
			popupClose : function(popup){
				popup.$back.remove();
				$(window).off(popup.resizeEvent);
			}
		}

		return {
			open : function(url, settings, data){
				var init = function(){
					var popup = this;

					def.setInit(popup, settings);

					$.ajax({
						url : url,
						timeout : 10000,
						data : data,
						dataType : 'html',
						success : function(result){
							popup.$wrap.append(result).imagesLoaded().then(function(){
								popup.opt.openCallback(popup.$wrap);
								def.setPosition(popup).addClass('open');
								def.setClose(popup);
								$(window).on(popup.resizeEvent, function(){
									def.setPosition(popup);
								});
							});
						},
						error : function(xhr){
							alert('['+xhr.status+'] 서버전송오류가 발생했습니다.');
						}
					});

					return popup;
				}

				init.prototype.close = function(){
					var popup = this;

					def.popupClose(popup);
				}

				init.prototype.reinit = function(){
					var popup = this;

					def.setPosition(popup);
				}

				return new init();
			}
		}
	})(newriver);

	newriver.mainpopup = (function(_){
		var def = {
			defaults : {
				id : null,
				node : null,
				top : false,
				left : false,
				width : false,
				height : false
			}
		}

		return {
			open : function(settings){
				var init = function(){
					var popup = this;

					popup.opt = $.extend({}, def.defaults, settings);

					if($.cookie(popup.opt.id)){
						return false;
					}

					newriver.ajaxpopup.open('../@popup/main.html', {
						top : popup.opt.top,
						left : popup.opt.left,
						background : false,
						openCallback : function(target){
							var id = '#'+popup.opt.id;
							popup.$mainpopup = target.children('.main_popup');
							popup.$mainpopup.attr({'id' : popup.opt.id});

							if(popup.opt.width && popup.opt.height){
								popup.$mainpopup.addClass('sizeFixed');
							}
							new Vue({
								el : id,
								data : {
									width : popup.opt.height ? popup.opt.width : 'auto',
									height : popup.opt.width ? popup.opt.height : 'auto',
									node : popup.opt.node,
									name : popup.opt.id
								},
								computed : {
									style : function(){
										return 'width:'+this.width+'px; height:'+this.height+'px;'
									}
								}
							});
						},
						closeCallback : function(){
							if($('[name='+popup.opt.id+']').prop('checked')){
								$.cookie(popup.opt.id, true, {expires : 1, path : '/'});
							}
						}
					});

					return popup;
				}

				return new init();
			}
		}
	})(newriver);

	newriver.slider = (function(_){
		return {
			tutorialSlider : function(){
				var $tutorialSlider = $('#tutorialSlider');

				$tutorialSlider.slick({
					fade : false,
					arrows : false,
					dots : true,
					infinite : false,
					slidesToShow : 1,
					slidesToScroll : 1,
					swipeToSlide : true,
				});

				$tutorialSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
					if(!$(slick.$slides[nextSlide]).find('.m-motion').hasClass('m-active')){
						$(slick.$slides[nextSlide]).find('.m-motion').addClass('m-active');
					}
				});
			},

			mainVisual : function(){
				var $mainVisual = $('#main #mainVisual');
				var $barWrap = $('#main .visual .indicator .slider-progress');
				var $bar = $('#main .slider-progress .progress');
				var $txtbox = $('#main .txt_wrap');
				var pageNum = $('.page_num');
				var speed = 15000;

				$mainVisual.on('init reInit beforeChange', function (event, slick, currentSlide, nextSlide) {
					var i = (nextSlide ? nextSlide : 0) + 1;
					function twolength(n) {
						return (n < 10 ? '0' : '') + n
					}
					pageNum.find('.total').text(twolength(slick.slideCount));
					pageNum.find('.current').text(twolength(i));
				});

				if (!$('.layer-back').length) {
					$(window).on('focus', function(){
						$mainVisual.slick('slickNext');
					});
				}


				$mainVisual.slick({
					fade : true,
					arrows : false,
					infinite : true,
					dots : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					accessibility : false,
					speed : 400,
					autoplay: true,
					autoplaySpeed : speed,
					draggable : true,
					touchThreshold: 100,
				});

				$('.slick_prev').on('click', function(){
					$mainVisual.slick('slickPrev');
				});
				$('.slick_next').on('click', function(){
					$mainVisual.slick('slickNext');
				});

				$mainVisual.on('beforeChange', function(event, slick, currentSlide, nextSlide){
					$('.slick-slide').removeClass('mv-ready');
					$(slick.$slides[currentSlide]).removeClass('mv-start').addClass('mv-stop').addClass('mv-ready');
					$(slick.$slides[nextSlide]).removeClass('mv-stop').addClass('mv-start');

					var nextVisual			=			$(slick.$slides[nextSlide]).find('.img');
					var currVisual			=			$(slick.$slides[currentSlide]).find('.img');
					var nextVisualLeft		=			- (nextVisual.outerWidth() - $('#app').outerWidth());

					if($(slick.$slides[nextSlide]).find('.promo .img').length){
						nextVisual.velocity({
							translateZ : 0,
							translateX : nextVisualLeft
						}, {
							duration : speed,
							easing: 'linear'
						});
					}

					currVisual.velocity('stop').velocity('reverse', {
						duration : 10,
						delay : 500
					});

					$bar.velocity('stop').velocity({
						width : 0
					}, {
						duration : 0
					});
				});

				$mainVisual.on('afterChange', function(event, slick, currentSlide, nextSlide){
					$bar.velocity({
						width : '100%'
					}, {
						duration : speed,
						easing: 'linear',
						complete: function(){
							$mainVisual.slick('slickNext');
						}
					});
					$('.slick-slide').removeClass('mv-stop');

					if(!$(slick.$slides[currentSlide]).find('m-motion').hasClass('m-active')){
						$('.mv-start .m-motion').each(function(index, item){
							setTimeout(function(){
								$(item).addClass('m-active');
							}, index * 100);
						});
					}
				});
			},
			mypageSlider : function(){
				var $mypageSlider = $('#mypageSlider');
				var pageNum = $('#mypageSlider .page_num2');

				$mypageSlider.on('init reInit beforeChange', function (event, slick, currentSlide, nextSlide) {
					var i = (nextSlide ? nextSlide : 0) + 1;
					function twolength(n) {
						return (n < 10 ? '0' : '') + n
					}
					pageNum.find('.total2').text(twolength(slick.slideCount));
					pageNum.find('.current2').text(twolength(i));
				});


				$mypageSlider.slick({
					fade : false,
					arrows : false,
					dots : false,
					infinite : false,
					slidesToShow : 1,
					slidesToScroll : 1,
					swipeToSlide : true,
				});

				$mypageSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
					if(!$(slick.$slides[nextSlide]).find('.m-motion').hasClass('m-active')){
						$(slick.$slides[nextSlide]).find('.m-motion').addClass('m-active');
					}
				});
			},
			lifeSlider : function(){
				var $lifeSlider = $('#main .life_slider');

				$lifeSlider.slick({
					fade : false,
					arrows : false,
					dots : false,
					infinite : true,
					centerMode : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					swipeToSlide : false,
					accessibility : false,
					speed : 500,
					autoplay: true,
					autoplaySpeed : 4000,
					draggable: true,
					variableWidth: true
				});
			},

			eventSlider : function(){
				var $eventSlider = $('.other_events');

				$eventSlider.slick({
					fade : false,
					arrows : false,
					dots : false,
					infinite : true,
					centerMode : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					swipeToSlide : false,
					accessibility : false,
					speed : 500,
					autoplay: true,
					autoplaySpeed : 4000,
					draggable: true,
					variableWidth: true
				});
			},

			showSlider : function(){
				var $showSlider = $('.show_slider');

				$showSlider.slick({
					fade : false,
					arrows : false,
					dots : true,
					infinite : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					swipeToSlide : false,
					accessibility : false,
					speed : 500,
					autoplay: true,
					autoplaySpeed : 4000,
					draggable : true,
					variableWidth : false
				});
			},

			couponSlider : function(){
				var $couponSlider = $('#couponView');
				var $couponDetail = $('#couponDetail');
				var $slicktrack = $('.cont_list');
				var $currSlide = null;

				$couponDetail.on('init', function(slick){
					$currSlide = $('.cont_list').find('.inner ul').eq(0);

					$slicktrack.css('height', $currSlide.outerHeight());
				});

				//슬라이더 작동 시 높이 변경
				$couponDetail.on('beforeChange', function(event, slick, currentSlide, nextSlide){
					var idx = $(slick.$slides[nextSlide]).find('.tab_detail .txt.on').index();
					$(slick.$slides[nextSlide]).find('.cont_list ul').length ? $currSlide = $(slick.$slides[nextSlide]).find('.cont_list ul').eq(idx) : 604;

					$slicktrack.css('height', $currSlide.outerHeight());
				});

				$couponSlider.slick({
					fade : false,
					arrows : false,
					autoplay : false,
					dots : true,
					infinite : false,
					slidesToShow : 1,
					slidesToScroll : 1,
					speed : 500,
					draggable : true,
					variableWidth : false,
					centerMode : true,
					centerPadding : '85px',
					asNavFor : $couponDetail
				});

				$couponDetail.slick({
					fade : false,
					arrows : false,
					autoplay : false,
					dots : false,
					infinite : false,
					slidesToShow : 1,
					slidesToScroll : 1,
					speed : 500,
					draggable : false,
					swipe : false,
					swipeToSlide : false,
					variableWidth : false
				});
			},

			contentsSlider : function(){
				var $contentsSlider = $('.contents_slider');

				$contentsSlider.slick({
					fade : false,
					arrows : true,
					dots : true,
					infinite : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					centerMode : true,
					swipeToSlide : false,
					accessibility : false,
					speed : 500,
					autoplay: true,
					autoplaySpeed : 4000,
					draggable: true,
					variableWidth: true
				});
			},

			contentsSlider2 : function(){
				var $contentsSlider2 = $('.contents_slider2 .slider');

				$contentsSlider2.slick({
					fade : false,
					arrows : false,
					dots : false,
					infinite : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					centerMode : true,
					swipeToSlide : false,
					accessibility : false,
					speed : 500,
					autoplay: false,
					draggable: true,
					variableWidth: true
				});

				var sliderLegnth = $('.contents_slider2 .slick-slide:not(.slick-cloned)').length;
				var barWidth = $('.indicator').outerWidth() / sliderLegnth;
				var left_val = 0;
				var li_wid = barWidth;

				$('.contents_slider2 .indicator .current_bar').css({
					width: barWidth
				});

				$contentsSlider2.on('beforeChange', function(event, slick, currentSlide, nextSlide){
					var idx = nextSlide;

					left_val = idx*li_wid;
					$(".contents_slider2 .indicator .current_bar").css({
						left: left_val
					});
			 	});
			},

			contentsSlider3 : function(){
				var $contentsSlider3 = $('.contents_slider3 .slider');

				$contentsSlider3.slick({
					fade : false,
					arrows : false,
					dots : false,
					infinite : true,
					slidesToShow : 1,
					slidesToScroll : 1,
					centerMode : true,
					swipeToSlide : false,
					accessibility : false,
					speed : 500,
					autoplay: false,
					draggable: true,
					variableWidth: true
				});

				var sliderLegnth3 = $('.contents_slider3 .slick-slide:not(.slick-cloned)').length;
				var barWidth3 = $('.indicator').outerWidth() / sliderLegnth3;
				var left_val3 = 0;
				var li_wid3 = barWidth3;

				$('.contents_slider3 .indicator .current_bar').css({
					width: barWidth3
				});

				$contentsSlider3.on('beforeChange', function(event, slick, currentSlide, nextSlide){
					var idx = nextSlide;

					left_val3 = idx*li_wid3;
					$(".contents_slider3 .indicator .current_bar").css({
						left: left_val3
					});
			 	});
			}
		}
	})(newriver);

	newriver.loadmotion = (function(_){
		return {
			init : function(){
				var f = this;
				_.$motion.each(function(idx, obj){
					obj.t = _.$motionTop[idx];
					obj.h = $(obj).outerHeight() / 6;
					obj.p = obj.t + obj.h;
					obj.e = 'load.lmotion'+idx+' scroll.lmotion'+idx;
					$(obj).attr('data-top', obj.p);

					f.scroll(obj);
					$(window).on(obj.e, function(){
						f.scroll(obj);
					});
				});
			},
			scroll : function(obj){
				if(_.winscrlT + _.winsizeH > $(obj).data('top')){
					$(obj).addClass('n-active');
				} else {
					$(obj).removeClass('n-active');
				}
			}
		}
	})(newriver);

	newriver.matchmedia = function(settings){
		var	defaults = {
			matchDesktop : function(){},
			matchMobile : function(){}
		};
		var opt = $.extend({}, defaults, settings);
		var media = window.matchMedia('(max-width: 750px)');

		function matchesAction(paramse){
			if(!paramse.matches){
				/* Desktop 실행 */
				opt.matchDesktop();
			}else{
				/* Mobile 실행 */
				opt.matchMobile();
			}
		}

		if(matchMedia){
			matchesAction(media);
			media.addListener(function(parameter){
				matchesAction(parameter);
			});
		}
	}

	newriver.tabAction = function(navi, cont){
		var _ = newriver;

		function action(tab, idx){
			tab.def.$navi.eq(idx).addClass('on').siblings().removeClass('on');
			tab.def.$cont.eq(idx).addClass('on').siblings().removeClass('on');
			tab.def.offsetTop = tab.def.$navi.offset().top;

			tab.def.idx = idx;
		}

		var tabAction = (function(){
			return {
				def : {
					idx : 0,
					$navi : $(navi).children(),
					$cont : $(cont).children()
				},
				init : function(){
					var _this = this;

					_this.def.$navi.on('click', function(){
						action(_this, $(this).index());
					});

					return _this;
				},
				setIndex : function(idx){
					action(this, idx);
					$('html, body').animate({scrollTop : this.def.offsetTop-_.$header.outerHeight()}, 300);
				}
			};
		})();

		return tabAction.init();
	}

	newriver.headerAction = function(_){
		var _ = this;
		var ts;

		var prevScrollTop = $(window).scrollTop();
		var nowScrollTop = $(window).scrollTop();

		$(document).on('touchstart', function (e){
			e.stopPropagation();
			ts = e.originalEvent.touches[0].clientY;
		});

		$(document).on('scroll touchmove', function(e){
			nowScrollTop = $(window).scrollTop();

			if (!$('#header').hasClass('sub')) { // if main
				if (nowScrollTop > prevScrollTop) { // down
					$('#baitDown').removeClass('on');
					$('#header').removeClass('bg');
				}
				else if (nowScrollTop <= 0) { // if top
					$('#header').removeClass('bg');
				}
				else if (nowScrollTop < prevScrollTop) { // up
					$('#baitDown').addClass('on');
					$('#header').addClass('bg');
				}
			}
			else if ($('#wrap').hasClass('model')){ // if model
				$('body').removeClass('hideHeader');
				$('#header').addClass('bg');
			}
			else { // if sub
				if (nowScrollTop > prevScrollTop) { // down
					$('body').addClass('hideHeader');
				}
				else if (nowScrollTop <= 0) { // if top
					$('body').removeClass('hideHeader');
					$('#header').removeClass('bg');
				}
				else if (nowScrollTop < prevScrollTop) { // up
					$('body').removeClass('hideHeader');
					$('#header').addClass('bg');
				}
				if ($('#app').hasClass('contents_view')){ // if contents
					if (nowScrollTop <= 0) { // if top
						$('body').removeClass('hideHeader');
					}
					$('#header').addClass('fullbg');
				}
			}

			prevScrollTop = nowScrollTop <= 0 ? 0 : nowScrollTop;
		});


		$('#trgAside').on('click', function(){
			var delay = 100;
			var gnb = document.querySelector("#gnb");

			if(!$('body').hasClass('asideOpen')){
				openAside();
				bodyScrollLock.disableBodyScroll(gnb);
			} else {
				closeAside();
				bodyScrollLock.enableBodyScroll(gnb);
			}

			_.$gnb.on('click', function(e){
				e.stopPropagation();
			});
		});

		_.$gnbdepth.find('> a').on('click', function(){
			$(this).closest('li').toggleClass('open');
		});

		_.$gnb.find('.depth2 li a').on('click', function(){
			closeAside();
			bodyScrollLock.enableBodyScroll(gnb);
		})

		function openAside(){
			$('body').addClass('asideOpen');
		}

		function closeAside(){
			$('body').removeClass('asideOpen');
			_.$gnbdepth.removeClass('open');
		}
	}

	newriver.loginAction = function(){
		// check input value
		checkInput($('input'));
		$('input').on('blur', function(){
			var $this = $(this);
			checkInput($this);
		});

		function checkInput(input){
			input.each(function(i, elm){
				if(!elm.value == ''){
					$(this).addClass('has_data');
				} else {
					$(this).removeClass('has_data');
				}
			});
		}

		// input delete button
		$('.btn_del').on('click', function(){
			$(this).closest('.box').find('input').val('').focus();
		});
		$('select').on('click', function(){
			if($(this).find('option').attr('selected','selected')){
				$(this).addClass('chosen');
			}
		});

		(function getMobileOperatingSystem() {
			var userAgent = navigator.userAgent || navigator.vendor || window.opera;

			if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
				var winScrTop;
				$('input, select, textarea').on('focus', function(){
					winScrTop = $(window).scrollTop();
					if ($(this).offset().top > $(document).outerHeight() - $(window).outerHeight() * 2/3){
						$(this).on('blur', function(){
							window.scrollTo(0, winScrTop);
						});
					}
				});
			} else {
				var andScrTop;
				$('input, textarea').on('focus', function(){
					andScrTop = $(window).scrollTop();
					if ($(this).offset().top > $(document).outerHeight() - $(window).outerHeight() * 2/3){
						$('#app').css('padding-bottom', '500px');
						$(window).animate({scrollTop : $(document).outerHeight()}, 300);
						$(this).on('blur', function(){
							$('#app').css('padding-bottom', '0');
							$(window).animate({scrollTop : andScrTop}, 300);
						});
					}
				});
			}
		})();
	}

	newriver.svgLine = function(){
		var pathes = $('.svg_firework').find('line');
		pathes.each(function(i, path) {
			var total_length = path.getTotalLength();
			path.style.strokeDasharray = total_length + " " + total_length;
			path.style.strokeDashoffset = total_length;
			$(path).animate({
				"strokeDashoffset" : 0
			}, i * 100);
		});
	}

	newriver.sltAction = function(){
		var sltBtn = $('#sltBtn');
		var sltTxt = $('#sltBtn .selected');
		var sltOpt = $('#sltOpt > li > button');
		sltBtn.on('click', function(){
			$(this).toggleClass('open');
			sltOpt.on('click', function(){
				$(this).closest('li').addClass('on').siblings().removeClass('on');
				var txt = $(this).text();
				sltTxt.html(txt);
			})
		})
	}

	newriver.tabClick = function(tab){
		var tab = $(tab);
		tab.on('click', function(){
			$(this).addClass('on').siblings().removeClass('on');
		})
	}

	newriver.listClick = function(list){
		var list = $(list);
		list.on('click', function(){
			$(this).closest('li').toggleClass('on');
		})
	}

	newriver.savingChart = function(savingData, dayXLabel){
		var ctx = document.getElementById("savingGraph");
		var savingGraph = new Chart(ctx, {
		  	type: 'doughnut',
			data: {
				datasets: [{
					  data: savingData,
					  type: 'doughnut',
					  backgroundColor: ['#1bb3ad', '#806fd8', '#ffb923'],
					  hoverBackgroundColor: ['#1bb3ad', '#806fd8', '#ffb923'],
					  borderWidth: 0
					}],
				labels: dayXLabel
			},
			options: {
				responsive: false,
				legend: {
					display: false
				},
				tooltips: {
				   enabled: false
				},
				cutoutPercentage: 80,
				maintainAspectRatio: true
			}
		});
	}

	newriver.couponMotion = function(){
		var tab = $('.tab_detail .txt');
		var tabWrap = $('.tab_detail');
		var contWrap = $('.cont_list');
		var conttabWrap = $('.group:not(".notab")').find('.cont_list');
		var tabLength = [];

		var contHeight = $('.cont_list .inner').find('ul').eq(0).outerHeight();
		var conttabHeight = conttabWrap.find('ul').eq(0).outerHeight();

		tabWrap.each(function(i, elm){
			var eachLength = $(elm).find('.txt').length;
			tabLength.push(eachLength)
		});

		contWrap.css({
			'height' : contHeight
		});

		conttabWrap.find('.inner').each(function(i, elm){
			$(elm).css({
				'width' : tabLength[i] * 670,
				'height' : conttabHeight
			});
		});

		tab.on('click', function(){
			var tabLength = $(this).closest('.tab_detail').find('.txt').length;
			var parIdx = $(this).closest('.slick-slide').index();
			var index = $(this).index();
			var thisWidth = $(this).outerWidth();
			var thisMargin = (670 - thisWidth) / 2;
			var beforeTabs = $(this).prevAll();
			var preveWidth = 0;
            var tabInner = $('.tabnum' + parIdx).find('.tab_detail .inner');

			$(this).addClass('on').siblings().removeClass('on');

			beforeTabs.each(function(i, elm){
				preveWidth += $(elm).outerWidth();
			});

			// 컨텐츠 좌우 이동
			var thisCont = $(this).closest('.group').find('.cont_list .inner ul').eq(index);
			$(this).closest('.group').find('.cont_list .inner').css({
				'transform' : 'translateX(' + (-670*index) + 'px)'
			});

			//탭 클릭 시 높이 변경
			$('.cont_list, .cont_list .inner').css({
				'height' : thisCont.outerHeight()
			});

			// 탭 좌우 이동
			// var num1 = - preveWidth + thisMargin + thisWidth - 80;
			var num2 = preveWidth - thisMargin;

			if (index == 0) { // first
				tabInner.animate({scrollLeft : 0}, 300);
				tabWrap.closest('.group').removeClass('last').addClass('first');
			} else if (index == tabLength - 1) { // last
				tabInner.animate({scrollLeft : num2}, 300);
				tabWrap.closest('.group').removeClass('first').addClass('last');
			} else { // middle
				tabInner.animate({scrollLeft : num2}, 300);
				tabWrap.closest('.group').removeClass('first').removeClass('last');
			}
		});
	}

	newriver.chkBottom = function(){
		$(window).on('load scroll', function(){
			var scrollHeight = $(document).height();
			var scrollPosition = $(window).height() + $(window).scrollTop();
			if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
				console.log('bottom');
			}
		})
	}

	newriver.refreshAction = function(){
		$('.btn_refresh, .btn_reload').on('touchstart', function(){
			var thisBtn = $(this);
			thisBtn.addClass('on');
			setTimeout(function(){
				thisBtn.removeClass('on');
			}, 300);
		});
	}

	newriver.loaderAction = function(){
		var loaderImg	=	$('#loader img');
		var idx			=	0;

		var loaderAction = setInterval(function(){
			var loader = loaderImg[idx++];

			$(loader).addClass('on').siblings().removeClass('on');

			if (idx >= loaderImg.length) {
				idx = 0;
			}
		},400);

		function stopLoader(){
			clearInterval(loaderAction);
			$('#loaderDim').fadeOut(300);
		}
	}

	$(window).on({
		'load' : function(){
			newriver.init.onLoad();
		},
		'resize' : function(){
			newriver.init.onResize();
		},
		'scroll' : function(){
			newriver.init.onScroll();
		}
	});

})(jQuery);