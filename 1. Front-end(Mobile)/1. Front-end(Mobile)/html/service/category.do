<!doctype html>
<html lang="ko">
	<head>
		<meta charset="UTF-8"/>
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		<meta http-equiv=“content-language” content=“ko”>
		<meta name="viewport" content="width=750, user-scalable=no, viewport-fit=cover"/>
		<title>TOYOTA</title>

		<!-- CSS -->
		<link rel="stylesheet" href="/resources/web/common/css/font.css"/>
		<link rel="stylesheet" href="/resources/web/common/css/reset.css"/>
		<link rel="stylesheet" href="/resources/web/common/css/slick.css"/>
		<link rel="stylesheet" href="/resources/web/common/css/common.css?20210423"/>
		<link rel="stylesheet" href="/resources/web/common/css/jquery-ui.structure.css">
		<link rel="stylesheet" id="iosCss">

		<script>
			var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
			var ratio = window.devicePixelRatio || 1;
			var screen = {
				width : window.screen.width * ratio,
				height : window.screen.height * ratio
			};
			var iosCss;
			if (iOS && screen.width == 1125 && screen.height === 2436 || iOS && screen.width == 828 && screen.height === 1792 || iOS && screen.width == 1242 && screen.height === 2688) {
				iosCss = '/resources/web/common/css/ios-header.css?201910112';
				document.getElementById('iosCss').setAttribute('href', iosCss);
			}

			var appVersion 	= '1.6.6';
			var uagent 		= navigator.userAgent.toLowerCase();
			var platform 	= navigator.platform.toLowerCase();
			var isIOS 	  	= false;
			var isAndroid 	= false;
			var isPC 	  	= false;
			var osType		= '';

			if (navigator.platform) {
				if (!/(win16|win32|win64|mac)/.test(platform)) {
					isPC = false;

					if(/(iphone|ipad|ipod)/.test(uagent) > 0) {
						appVersion = '1.6.6';
						osType = 'I';
						isIOS = true;
						isAndroid = false;
					}

					else {
						appVersion = '1.6.6';
						osType = 'A';
						isIOS = false;
						isAndroid = true;
					}

				} else {
					isPC = true;
					isIOS = false;
					isAndroid = false;
				}
			}

			var interval = null;
		</script>

		<!-- public -->
		<script src="/resources/web/common/js/public/jquery-3.2.1.min.js"></script>
		<script src="/resources/web/common/js/public/jquery.cookie.js"></script>
		<script src="/resources/web/common/js/public/mobile-detect.min.js"></script>
		<script src="/resources/web/common/js/public/slick.js"></script>
		<script src="/resources/web/common/js/public/jquery-ui.js"></script>
		<script src="/resources/web/common/js/public/bodyScrollLock.js"></script>

		<!-- dev -->
		<script src="/resources/web/common/js/dev/slick.js"></script>
		<script src="/resources/web/common/js/dev/wScratchPad.js"></script>
		<script src="/resources/web/common/js/dev/common.js?201910281"></script>
		<script src="/resources/web/common/js/dev/front.js?2019041201"></script>

		<!-- favicon -->
		<link rel="shorcut icon" type="image/x-icon" href="/resources/common/images/icons/toyota_16.ico">
		<!-- loader -->
		<script type="text/javascript">
			const appValid = uagent.indexOf('uniwebview') > -1 ? true : false;
			const newAppVersion = $.cookie('appVersion');
			newriver.loaderAction();
		</script>

		<!-- Global site tag (gtag.js) - Google Analytics -->
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-135932530-2"></script>
		<script type="text/javascript">
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'UA-135932530-2');
		</script>
	</head>
	<body>
		<div id="app" class="">
			<header id="header" class="sub">
		<a href="javascript:history.back();" class="back">뒤로가기</a>
			<h1 class="logo"><a href="/main.do"><img src="/resources/web/images/common/logo2.png" alt=""></a></h1>
		</header>
	
	<form id="retForm" name="retForm" method="post">
		<input type="hidden" id="returnUrl" name="returnUrl" value="">
	</form><button type="button" id="trgAside" class="trg_aside">
		<span class="bar1"></span>
		<span class="bar2"></span>
		<span class="bar3"></span>
	</button>

	<div id="gnb">
		<div class="member">
			<div class="logout">
						<div class="txt">로그인이 필요합니다</div>
						<div class="btn_wrap">
							<a href="/auth/sign.do" class="btn60 c1" style="width: 210px;">로그인</a>
							<a href="/auth/join/agree.do" class="btn60 c1" style="width: 210px;">회원가입</a>
						</div>
						<a href="/formal/setting.do" class="btn_setting"></a>
					</div>
				</div>
		<ul>
			<li>
				<a href="javascript:void(0);">TOYOTA</a>
				<ul class="depth2">
					<li><a href="/toyota/place/list.do">전시장 안내</a></li>
					<!-- <li><a href="/toyota/campaign/list.do">캠페인</a></li> -->
					<li><a href="/toyota/news/list.do">공지/뉴스</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0);">Contents</a>
				<ul class="depth2">
					<li><a href="/toyota/travelog/list.do">트래블로그</a></li>
					<li><a href="/toyota/life/list.do">라이프 스타일</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0);">Models</a>
				<ul class="depth2">
					<li><a href="/models/model/list.do">차량 정보</a></li>
					<li><a href="/models/manual/list.do">사용자 매뉴얼</a></li>
					<li><a href="/models/demo/info.do">시승 신청</a></li>
					<!-- <li><a href="/models/promo/info.do">이 달의 금융 프로모션</a></li> -->
					<li class="appArea"><a href="uniwebview://message?action=0">VR/AR 매뉴얼</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0);">Service</a>
				<ul class="depth2">
					<li><a href="/service/center/list.do">서비스센터 예약</a></li>
					<li><a href="/service/bodyAndPaint/view.do">판금·도장 서비스</a></li>
					<li><a href="/service/product/category.do">서비스 상품</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0);">Support</a>
				<ul class="depth2">
					<li><a href="/support/sos/info.do">SOS 긴급 출동</a></li>
					<li><a href="/support/contact/info.do">1:1 문의</a></li>
					<li><a href="/support/improve/info.do">개선요청</a></li>
				</ul>
			</li>
			<li>
				<a href="javascript:void(0);">Event / Coupon</a>
				<ul class="depth2">
					<li><a href="/evncou/event/list.do">이벤트</a></li>
					<li><a href="/evncou/coupon/list.do">쿠폰 정보</a></li>
					<!-- <li><a href="/evncou/superracing/ticketApply.do">슈퍼레이스 티켓 교환코드 등록</a></li> -->
					<!-- <li><a href="/evncou/superracing/ticketStorege.do">슈퍼레이스 티켓 보관함</a></li> -->
				</ul>
			</li>
			<li>
				<a href="javascript:void(0);">My Car</a>
				<ul class="depth2">
					<li><a href="/mycar/info/info.do">내 차 정보</a></li>
					<li><a href="/mycar/tune/info.do">정비 관리</a></li>
					<li><a href="/mycar/account/info.do">차계부</a></li>

					<li class="appArea"><a href="/auth/sign.do?returnUrl=/drivinglog">운행 일지</a></li>
						<li><a href="/mycar/sc/info.do">나만의 SC</a></li>
				</ul>
			</li>
		</ul>
		<!--
		<div class="utils appArea">
			<ul>
				<li>
					<a href="/findparkinglot">주차장 찾기</a>
				</li>
				<li>
					<a href="/findgasstation">주유소 찾기</a>
				</li>
			</ul>
		</div>
		-->
	</div>
	<div class="bottom">
		<div class="btn_wrap">
			<!-- <a href="tel:080-525-8255" class="btn_guide">고객센터</a> -->
			<a href="/mycar/sc/info.do" class="btn_guide">나만의SC</a>
			<a href="/support/sos/info.do" class="btn_sos">SOS 긴급출동</a>
		</div>
	</div><div id="container">
		<div id="content" class="service"> 
			<h2 class="tit_page">서비스상품</h2>
			<div class="oil_list">
				<ul>
					<li>
						<a href="/service/product/view.do?idx=18">
						<div class="tit n-motion n-left">
								<span class="tt">Smart Maintenance Service Package</span>
								<span class="ts">SMS 패키지</span>
							</div>                                
							<div class="img n-motion n-right">
								<img src="/resources/web/images/service/category_p1.png" alt="AVALON HYBRID" onerror="src='/resources/web/images/noimg/nomodel.jpg'">
							</div>
						</a>						
					</li>
					<li>
						<a href="/service/product/view.do?idx=1">
						<div class="tit n-motion n-left">
								<span class="tt">Tire</span>
								<span class="ts">타이어</span>
							</div>                                
							<div class="img n-motion n-right">
								<img src="/resources/web/images/service/category_p2.png" alt="AVALON HYBRID" onerror="src='/resources/web/images/noimg/nomodel.jpg'">
							</div>
						</a>						
					</li>
					<li>
						<a href="/service/product/list.do?srchProduct_type=13803">
						<div class="tit n-motion n-left">
								<span class="tt">Oil</span>
								<span class="ts">오일</span>
							</div>                                
							<div class="img n-motion n-right">
								<img src="/resources/web/images/service/category_p3.png" alt="AVALON HYBRID" onerror="src='/resources/web/images/noimg/nomodel.jpg'">
							</div>
						</a>						
					</li>
					<li>
						<a href="/service/product/list.do?srchProduct_type=13804">
						<div class="tit n-motion n-left">
								<span class="tt">Filter</span>
								<span class="ts">필터</span>
							</div>                                
							<div class="img n-motion n-right">
								<img src="/resources/web/images/service/category_p4.png" alt="AVALON HYBRID" onerror="src='/resources/web/images/noimg/nomodel.jpg'">
							</div>
						</a>						
					</li>
					<li>
						<a href="/service/product/list.do?srchProduct_type=13805">
						<div class="tit n-motion n-left">
								<span class="tt">Battery</span>
								<span class="ts">배터리</span>
							</div>                                
							<div class="img n-motion n-right">
								<img src="/resources/web/images/service/category_p5.png" alt="AVALON HYBRID" onerror="src='/resources/web/images/noimg/nomodel.jpg'">
							</div>
						</a>						
					</li>
					<li>
						<a href="/service/product/list.do?srchProduct_type=13806">
						<div class="tit n-motion n-left">
								<span class="tt">Toyota Accessories</span>
								<span class="ts">차량 액세서리</span>
							</div>                                
							<div class="img n-motion n-right">
								<img src="/resources/web/images/service/category_p6.png" alt="AVALON HYBRID" onerror="src='/resources/web/images/noimg/nomodel.jpg'">
							</div>
						</a>						
					</li>
					<li>
						<a href="/service/product/list.do?srchProduct_type=13807">
						<div class="tit n-motion n-left">
								<span class="tt">Others</span>
								<span class="ts">기타</span>
							</div>                                
							<div class="img n-motion n-right">
								<img src="/resources/web/images/service/category_p7.png" alt="AVALON HYBRID" onerror="src='/resources/web/images/noimg/nomodel.jpg'">
							</div>
						</a>						
					</li>
					</ul>
			</div>
		</div>
	</div>
	<div id="loaderDim" style="display:none;">
	            <div id="loader">
					<img class="on" src="/resources/web/images/common/loading_01.png">
					<img src="/resources/web/images/common/loading_02.png">
					<img src="/resources/web/images/common/loading_03.png">
					<img src="/resources/web/images/common/loading_04.png">
					<img src="/resources/web/images/common/loading_05.png">
					<img src="/resources/web/images/common/loading_06.png">
					<img src="/resources/web/images/common/loading_07.png">
	            </div>
	        </div>
		</div>

		<script type="text/javascript">
			var referrerPage = document.referrer;
			if(referrerPage.indexOf('/auth/sign.do') > -1) {
				$('#header .back').attr('href', '/main.do');
			}

			if(!appValid) {
				$('.appArea').remove();
			}
		</script>
	</body>
</html>