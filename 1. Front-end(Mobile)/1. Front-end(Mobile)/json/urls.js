var landNum = '?landNum=' + Math.round(+new Date() / 1000);
var url_sideInfor_drive = "/json/main_side_infor.json"; // 사이드의 시승신청 클릭시 노출 정보
var url_sideInfor_drive_ie = "/json/main_side_infor_ie.json"; // ie 전용입니다.
//var url_drivetest_form = "/json/save_testdrive.aspx"; // 사이드의 시승신청 - 정보입력 후 정보 보내기
var url_drivetest_form = "https://www.toyota.co.kr/json/jsonp_save_testdrive.aspx"; // 사이드의 시승신청 - 정보입력 후 정보 보내기
var url_drivetestEvent_form = "https://www.toyota.co.kr/json/jsonp_save_testdriveEvent.aspx"; // 사이드의 시승신청 - 정보입력 후 정보 보내기

var url_serviceCenter = "/json/serviceCenter.json";//딜러페이지의 서비스센터 (딜러 정보는 위에 시승신청안에 있는 데이터를 공동 사용하고 있음)
var url_serviceCenter_ie = "/json/serviceCenter_ie.json";//딜러페이지의 서비스센터 (딜러 정보는 위에 시승신청안에 있는 데이터를 공동 사용하고 있음)

var url_dealers_index = "/json/dealers_index.aspx"; //딜러 페이지 데이터 호출 구조 변경 테스트
var url_servicecenter_index = "/json/servicecenter_index.json"; //딜러 페이지 데이터 호출 구조 변경 테스트

var url_mainContents = "/json/incfile.json" + landNum; //메인에 노출되는 컨텐츠들
//// -------------- 토요타
var url_compay_news_list = "/json/news.aspx" + landNum; // 토요타 - 컴패니 - 보도자료 목록
var url_company_contribution = "/json/socialCnt.json" + landNum; //토요타 - 사회공헌
//var url_company_contribution = "/json/contribution_detail.json"+landNum; //토요타 - 사회공헌
var url_company_contribution_detail = "/json/contribution_detail.json" + landNum; //토요타 - 사회공헌 - 디테일
var url_compay_news = "/json/notice_detail.json"; //토요타 - 컴패니 - 보도자료 디테일

var url_service_price = "/json/price.aspx" + landNum; //토요타 - 서비스 - 부품가격

var url_inside_event = "/json/event.aspx"; // 이벤트
var url_inside_benefit = '/json/benefit.json';//이달의 구매혜택
var url_inside_newsletter = "/json/newsletter.aspx"; // 뉴스레터
//var url_inside_newsletter_join = "/json/save_subscribe.aspx"; // 뉴스레터 구독 신청 폼 전송
var url_inside_newsletter_join = "https://www.toyota.co.kr/json/jsonp_save_subscribe.aspx"; // 뉴스레터 구독 신청 폼 전송
var url_inside_notice = "/json/notice.aspx"; //토요타 - 인사이드 - 공지사항 목록
var url_inside_style = "/json/style.aspx";
var url_inside_story = "/json/story.aspx";

var url_inside_gallery = "/json/gallery.aspx"; //통합 갤러리
//// -------------- 모델
var url_models = ["../../json/model_AVALON.json",
  "../../json/model_CAMRYHYBRID.json",
  "../../json/model_CAMRY.json",
  '프리우스 제외',
  '../../json/model_PRIUSV.json',
  '../../json/model_RAV4HV.json',
  '../../json/model_RAV4.json',
  "../../json/model_SIENNA.json",
  "../../json/model_TOYOTA86.json",
  "../../json/model_86.json",
  "../../json/model_PRIUSP.json",
  "../../json/model_CAMRY_WILD_HYBRID.json",
  "../../json/model_CAMRYGASOLINE.json",
  "../../json/model_CAMRYWILDHYBRID_R.json",
  "../../json/model_PRIUSC.json",
  "../../json/model_AVALON_HYBRID.json"
];

//// --------------스마트 하이브리드

var url_hybrid_qna = "/json/qna.json" + landNum;

//// --------------딜러사 페이지
var url_dealers = "/json/dealers_contents.aspx";
var url_dealers_subpage = "/json/dealers_subpage.aspx";
var url_dealers_event = "/json/dealers_event.aspx";
var url_privacy = "/json/privacy.aspx";

//// --------------유틸리티
var url_contact_form = "/json/save_contact_us.aspx"; //컨텍트 이메일 폼
//var url_contact_form = "https://www.toyota.co.kr/json/jsonp_save_contact_us.aspx"; //컨텍트 이메일 폼

// 20171206 추가
//// --------------20주년 기념 응모
var url_anniversary_apply = "/json/jsonp_save_anniversary.aspx";