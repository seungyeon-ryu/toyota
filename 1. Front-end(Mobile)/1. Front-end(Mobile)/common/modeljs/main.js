var intro_player, intro_video_ids = ['IozXseU8MKQ','Kd7yzeYI27g','u2OS1Uk_GNs','YnGaOEaUa2g'], intro_video_idx = 0;
var mshare_player, pshare_player, share_play_end = false, share_video_playing = false;
function onYouTubeIframeAPIReady() {
    intro_player = new YT.Player('intro', {
        events: {
            'onStateChange':function($r){
                if ($r.data == 2) {
                    $("#intro").css({'top':-2000});
                } else {
                    $("#intro").css({top:0});
                }

                if ($r.data == 0) {
                    intro_video_idx++;
                    if (intro_video_idx > 3) intro_video_idx = 0;

					if (intro_video_idx == 0) {
						$('.sub_visualModel').addClass('first_img');
						intro_player.pauseVideo();
						$(intro_player.a).css('display','none');
					} else {
						$('.sub_visualModel').removeClass('first_img');
						intro_player.loadVideoById(intro_video_ids[intro_video_idx]);
						$(intro_player.a).css('display','');
					}
                }

                if ($r.data == 1) {
					$(intro_player.a).css('display','');
                } else {
					$(intro_player.a).css('display','none');
				}
            },
            'onReady':function(){
                if (window.innerHeight > $(window).scrollTop() && window.innerWidth >= 960) {
                    intro_player.playVideo();
                }
                $(".videoIndex").show().click(function () {
                    if ($(this).hasClass('videoIndexPrev')) {
                        intro_video_idx--;
                        if (intro_video_idx < 0) intro_video_idx = 3;
                    } else {
                        intro_video_idx++;
                        if (intro_video_idx > 3) intro_video_idx = 0;
                    }

					if (intro_video_idx == 0) {
						$('.sub_visualModel').addClass('first_img');
						intro_player.pauseVideo();
						$(intro_player.a).css('display','none');
					} else {
						$('.sub_visualModel').removeClass('first_img');
						intro_player.loadVideoById(intro_video_ids[intro_video_idx]);
						$(intro_player.a).css('display','');
					}
                });
                $('.sub_visualModel').click(function(e){
                    if (e.pageY < $("#nav").height()) return;
					if (intro_video_idx != 0) {
						if (intro_player.getPlayerState() == 1) {
							intro_player.pauseVideo();
						} else {
							intro_player.playVideo();
						}
					}
                });
            }
        }
    });

    mshare_player = new YT.Player('mshare', {
        events: {
            'onStateChange':function($r){
                share_play_end = ($r.data == 0);
                share_video_playing = ($r.data == 1);
            },
            'onReady':function(){

            }
        }
    });

    pshare_player = new YT.Player('pshare', {
        events: {
            'onStateChange':function($r){
                share_play_end = ($r.data == 0);
                share_video_playing = ($r.data == 1);
            },
            'onReady':function(){

            }
        }
    });
}

(function(){
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
})();

(function(){
    var container = document.getElementById('container'),
        container_top = 0,
        model = document.getElementById('model-x'),
        vars = document.getElementById('vars'),
        page3 = document.querySelector('.page3 .vis'),
        page3on = false,
        page4 = document.querySelector('.page4'),
        page4on = false,
        pages = $('.fel'),
        sTop = 0, // 스크롤 탑
        cTop = 0, // 컨텐츠 탑
        mHeight = 0, //
        wHeight = 0,
        wWidth = 0,
        touch = false,t0,t1,
        $s = "$s",$e = "$e";

    function getV($v,$t) {
        if (!isNaN($v)) return $v*1;
        var d = $v.match(/[-\d.]+/)[0];
        if ($v.match(/%$/)) {
            d = $t*d*0.01;
        } else {
            d = d*1;
        }
        if ($v.match(/^c/)) d = $t*0.5+d;
        return d;
    }

    function getIDX(arr,r) {
        var i = arr.length;
        if (arr[i-1] <= r) return $e;
        if (arr[0] >= r) return $s;

        while(i--) {
            if (arr[i] > r && arr[i-1] < r) {
                return i;
            }
        }
    }

    var event2_tracked = false;

    function onscroll(){
        sTop = $(window).scrollTop();
        if (intro_player && sTop >  wHeight && intro_player.getPlayerState && intro_player.getPlayerState() == 1) {
            intro_player.pauseVideo();
        }

        if (!event2_tracked && sTop >  wHeight*2 ) {
            TRACK(9983,9991);
            event2_tracked = true;
        }
        pos();
    }

    function onresize() {
        wHeight = window.innerHeight;
        wWidth = window.innerWidth;
        container_top = wWidth < 960 ? 40 : 80;
        pages.each(function(){
            if (!this.p) return;
            for(var i=0,j=this.p.length; i < j ; ++i) {
                this.ol && (this.al[i] = getV(this.ol[i],wWidth));
                this.or && (this.ar[i] = getV(this.or[i],wWidth));
                this.ow && (this.aw[i] = getV(this.ow[i],wWidth));
                this.ot && (this.at[i] = getV(this.ot[i],wHeight));
                this.ob && (this.ab[i] = getV(this.ob[i],wHeight));
                this.oh && (this.ah[i] = getV(this.oh[i],wHeight));
            }
        });
        touch = true;
    }

    function tick() {
        if (cTop !== container.offsetTop) {
            cTop = container.offsetTop;
            touch = true;
        }
        if (mHeight !== model.offsetHeight) {
            mHeight = model.offsetHeight;
            touch = true;
        }
        if (touch) pos();
    }

    function interpolate(e,r) {
        var i,t,last;
        if (!e.p) return;
        last = e.p.length-1;
        i = getIDX(e.p,r);

        if (i == $e) {
            e.al && (e.style.left = e.al[last]+"px");
            e.ar && (e.style.right = e.ar[last]+"px");
            e.aw && (e.style.width = e.aw[last]+"px");
            e.at && (e.style.top = e.at[last]+"px");
            e.ab && (e.style.bottom = e.ab[last]+"px");
            e.ah && (e.style.height = e.ah[last]+"px");
            e.ax && changeImage(e,e.ax[last]);
            e.ay && overScroll(e,e.ay[last]);
            e.oa && e.jq.css('opacity',e.oa[last]);
        } else 	if (i == $s) {
            e.al && (e.style.left = e.al[0]+"px");
            e.ar && (e.style.right = e.ar[0]+"px");
            e.aw && (e.style.width = e.aw[0]+"px");
            e.at && (e.style.top = e.at[0]+"px");
            e.ab && (e.style.bottom = e.ab[0]+"px");
            e.ah && (e.style.height = e.ah[0]+"px");
            e.ax && changeImage(e,e.ax[0]);
            e.ay && overScroll(e,e.ay[0]);
            e.oa && e.jq.css('opacity',e.oa[0]);
        } else {
            t = ((r - e.p[i-1]) / (e.p[i] - e.p[i-1])) || 1;
            e.al && (e.style.left = (e.al[i-1] + (e.al[i] - e.al[i-1])*t) + "px");
            e.ar && (e.style.right = (e.ar[i-1] + (e.ar[i] - e.ar[i-1])*t) + "px");
            e.aw && (e.style.width = (e.aw[i-1] + (e.aw[i] - e.aw[i-1])*t) + "px");
            e.at && (e.style.top = (e.at[i-1] + (e.at[i] - e.at[i-1])*t) + "px");
            e.ab && (e.style.bottom = (e.ab[i-1] + (e.ab[i] - e.ab[i-1])*t) + "px");
            e.ah && (e.style.height = (e.ah[i-1] + (e.ah[i] - e.ah[i-1])*t) + "px");
            e.ax && changeImage(e,Math.round(e.ax[i-1] + (e.ax[i] - e.ax[i-1])*t) );
            e.ay && overScroll(e,e.ay[i-1] + (e.ay[i] - e.ay[i-1])*t);
            e.oa && e.jq.css('opacity',e.oa[i-1] + (e.oa[i] - e.oa[i-1])*t);
        }
    }

    function pos() {
        touch = false;
        var csTop = cTop - sTop, csBottom = mHeight - sTop,
            vTop = csTop - container_top > 0 ? csTop : csBottom < 0 ? csBottom+container_top : container_top,
            volume = mHeight - cTop,
            r = (volume - (csBottom - vTop)) / volume;
        vars.style.top = vTop+'px';

        var page3top = ox.getOffsetTop(page3), page3bottom = page3top + page3.offsetHeight;
        var page4top = ox.getOffsetTop(page4), page4bottom = page4top + page4.offsetHeight;

        if (sTop + window.innerHeight > page3top && sTop < page3bottom) {
            if (!page3on) {
                page3on = true;
                $('.page3 .iseq').iseqRepeat();
            }
        } else {
            if (page3on) {
                page3on = false;
                $('.page3 .iseq').iseqStop();
            }
        }

        if (sTop + window.innerHeight > page4top && sTop < page4bottom) {
            if (!page4on) {
                page4on = true;
                $('.page4 .iseq.on').iseqRepeat();
            }
        } else {
            if (page4on) {
                page4on = false;
                $('.page4 .iseq').iseqStop();
            }
        }
        pages.each(function(){
            if (!this.v) {
                interpolate(this,r);
                return;
            }
            if ( r < this.v[0] || this.v[1] <= r ) {
                if ( this.display != "none" ) {
                    this.display = "none";
                    this.style.display = "none";
                    this.getAttribute('data-hide') && window[this.getAttribute('data-hide')](this);
                }
            } else {
                if ( this.display != "block" ) {
                    this.display = "block";
                    this.style.display = "block";
                    this.getAttribute('data-show') && window[this.getAttribute('data-show')](this);
                }
                interpolate(this,r);
            }
        });
    }
    $(".page1").click(function(){
        ox.getScrollBody().animate({scrollTop:cTop-container_top+(mHeight - cTop)/5 },1000);
        // ox.getScrollBody().animate({scrollTop:cTop-container_top+(mHeight - cTop)/2 },1000);
    });
  var event2interval;
    if (location.hash == '#event2')  {
        event2interval = setInterval(function(){
            var gap = window.innerWidth < 960 ? 400 : 200;
            //cTop-container_top+(mHeight)*0.4
            ox.getScrollBody().scrollTop(ox.getOffsetTop($("#event2")[0])-200);
        },16);
    } else if (location.hash == '#main')  {
        event2interval = setInterval(function(){
          ox.getScrollBody().scrollTop(window.innerHeight);
        },16);
      }

    $(window).on('load',function(){
       clearInterval(event2interval);
    });
    pages.each(function(){
        var tmp;
        if (tmp = this.getAttribute("data-s")) {
            this.v = tmp.split(',');
            tmp = this.v.length;
            while (tmp--) this.v[tmp] = (this.v[tmp]-1)/4;
            // while (tmp--) this.v[tmp] = (this.v[tmp]-1)/2;
        }
        if (tmp = this.getAttribute("data-p")) {
            this.p = tmp.split(',');
            tmp = this.p.length;
            while (tmp--) this.p[tmp] = (this.p[tmp]-1)/4;
            // while (tmp--) this.p[tmp] = (this.p[tmp]-1)/2;
        }
        if (tmp = this.getAttribute("data-t")) {
            this.ot = tmp.split(',');
            if (this.p) this.at = [];
        }
        if (tmp = this.getAttribute("data-b")) {
            this.ob = tmp.split(',');
            if (this.p) this.ab = [];
        }
        if (tmp = this.getAttribute("data-l")) {
            this.ol = tmp.split(',');
            if (this.p) this.al = [];
        }
        if (tmp = this.getAttribute("data-r")) {
            this.or = tmp.split(',');
            if (this.p) this.ar = [];
        }
        if (tmp = this.getAttribute("data-h")) {
            this.oh = tmp.split(',');
            if (this.p) this.ah = [];
        }
        if (tmp = this.getAttribute("data-w")) {
            this.ow = tmp.split(',');
            if (this.p) this.aw = [];
        }
        if (tmp = this.getAttribute("data-x")) {
            if (this.p) this.ax = tmp.split(',');
        }
        if (tmp = this.getAttribute("data-y")) {
            if (this.p) this.ay = tmp.split(',');
        }
        if (tmp = this.getAttribute("data-a")) {
            this.oa = tmp.split(',');
            if(!this.aa) this.jq = $(this);
            if (this.p) {
                tmp = this.oa.length;
                while (tmp--) this.oa[tmp] = parseFloat(this.oa[tmp]);
            } else this.jq.css('opacity',this.oa[0]);
        }
    });

    function lpad(num,unit) {
        var result = num+"", len = unit - result.length;
        if (len < 1) return result;
        while (len--) {
            result = "0"+result;
        }
        return result;
    }

    function changeImage(e,idx) {
        var x = window.innerWidth < 960 ? '_m' : '' ;
        e.src = "../../images/model_view/MODEL_CamryWildHybrid/main/tnga3"+x+"/"+lpad(idx,5)+".png";
    }

    function overScroll(e,val) {
        var of,dt;
        if (wWidth < 960) {
            of = 40;
        } else {
            of = 80;
        }
        dt = (wHeight-80) - e.offsetHeight;
        if (dt > 0) {
            e.style.top = (dt>>1) + 'px';
        } else {
            e.style.top = (dt * val) + 'px';
        }
    }


    var vr = function (el) {
        var step = 0;
        var downX = 0;
        var len = 72;
        var d,u,m;
        var sensitivity = 10;
        var model = 'black';
        var light = 'off';
        var olight = '';
        var img;
        var freeze;
        var models = ['white','silver','black','red','steel','graphite','blue'];
        var cache = [];
        var lock = false;
        var intervalId = -1;
        var lightPlus = $(".page5 .vr .light");
        var wheelPlus = $(".page5 .vr .wheel");
        var doorPlus = $(".page5 .vr .door");

        // mobile
        var pos = {
            m : {
                light_pos: ['4%','5%','6%','8%'    ,'10%','13%','13%','18%','19%','75%','77%','81%','84%','86%','88%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','89%','86%','84%','83%','82%','80%','77%','4%','6%','9%' ,'13%','17%','20%','74%','77%','81%','84%','88%','89%','89%','89%','89%', '7%', '7%', '5%', '4%', '3%', '2%', '1%', '1%', '1%', '1%', '1%', '1%', '1%', '1%', '1%', '1%', '1%', '2%', '3%'],
                door_pos: ['59%','59%','59%','61%','63%','65%','xxx','xxx','xxx','xxx','xxx','xxx','28%','28%','31%','33%','36%','36%','38%','40%','43%','45%','46%','46%','48%','50%','52%','52%','52%','55%','58%','60%','61%','61%','61%','61%','61%','61%','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','34%','34%','34%','34%','34%','34%','34%','34%','36%','38%','40%','42%','44%','46%','48%','50%','50%','51%','52%','54%','55%','56%','58%'],
                wheel_pos: ['48%','49%','50%','52%','54%','57%','xxx','xxx','xxx','xxx','xxx','xxx','36%','39%','42%','45%','49%','51%','54%','57%','63%','66%','69%','69%','71%','75%','75%','75%','75%','75%','75%','75%','75%','75%','75%','75%','75%','75%','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','xxx','16%','16%','16%','16%','16%','16%','16%','16%','16%','16%','16%','16%','20%','24%','28%','30%','30%','30%','32%','36%','40%','44%','46%']
            },
            pc : {
                light_pos: ['470' ,'480' ,'500' ,'520' ,'540','580','610','630','670','1230','1260','1290','1320','1350','1370','1390','1410','1420','1430','1440','1450','1460','1460','1460','1460','1460','1460','1460','1440','1430','1410','1400','1380','1360','1340','1320','1300','1280','1280','500','520','550','590','630','660','1240','1280','1320','1350','1380','1410','1420','1440','1460','1460','1460','1460','1460','1460','1460','1460','420','420','420','420','420','420','420' ,'420','430','440','450'],
                door_pos: ['1060','1070','1080','1090','xxx','xxx','xxx','xxx','xxx','xxx' ,'xxx' ,'xxx' ,'xxx' ,'xxx' ,'780' ,'790' ,'800' ,'810' ,'820' ,'830' ,'840' ,'870' ,'890' ,'910' ,'930' ,'950' ,'970' ,'990' ,'1000','1010','1030','1050','1070','1080','1090','1100','1110','1120','1120','xxx','xxx','xxx','xxx','xxx','xxx','xxxx','xxxx','xxxx','xxxx','xxxx','780' ,'780' ,'780' ,'780' ,'790' ,'810' ,'830' ,'850' ,'870' ,'890' ,'890' ,'910','930','940','960','980','990','1000','1010','1020','1030','1040'],
                wheel_pos: ['940' ,'970' ,'1010','1040','xxx','xxx','xxx','xxx','xxx','xxx' ,'xxx' ,'xxx' ,'xxx' ,'xxx' ,'850' ,'880' ,'910' ,'940' ,'970' ,'1000','1030','1090','1100','1130','1150','1170','1180','1180','1190','1190','1200','1200','1210','1220','1220','1220','1220','1220','1220','xxx','xxx','xxx','xxx','xxx','xxx','xxxx','xxxx','xxxx','xxxx','xxxx','700' ,'700' ,'700' ,'670' ,'670' ,'670' ,'670' ,'670' ,'670' ,'670' ,'670' ,'690','710','720','740','770','790','820' ,'840','860','880','900']
            }
        };


        // pc


        if ('ontouchstart' in window) {
            d = 'touchstart';
            u = 'touchend';
            m = 'touchmove';
        } else {
            d = 'mousedown';
            u = 'mouseup';
            m = 'mousemove';
        }
        function onMove(e) {
            if (lock) return;
            var mx = e.screenX || e.originalEvent.changedTouches[0].screenX;
            var delta = mx - downX;
            var next;
            if (freeze) e.stopImmediatePropagation();
            if (Math.abs(delta) > sensitivity) {
                freeze = true;
                if (delta > 0) next = step+1;
                else next = step-1;
            } else {
                return;
            }
            downX = mx;
            if (next == -1) {
                step = len-1;
            } else if (next == len) {
                step = 0;
            } else {
                step = next;
            }
            render();
        }

        function moveTop(cb) {
            clearInterval(intervalId);
            if (step == 0) {
                cb();
                return;
            }
            var dir = step < 32 ? -1 : 1;
            intervalId = setInterval(function(){
                step += dir;
                if (step == 72) step = 0;
                render();
                if (step == 0) {
                    step = 0;
                    clearInterval(intervalId);
                    cb();
                }
            },40);
        }



        function render() {
            img.src = '../../images/model_view/MODEL_CamryWildHybrid/main/vr/'+model+'_'+light+'/'+lpad(step,5)+".png";
            var xpos = window.innerWidth < 960 ? pos.m : pos.pc;
            var t0,t1;
            t1 = window.innerWidth < 960 ? '' : 'px';
            t0 = xpos.light_pos[step];
            if (t0 == 'xxx') lightPlus.hide();
            else lightPlus.show().css({left:t0+t1});

            t0 = xpos.door_pos[step];
            if (t0 == 'xxx') doorPlus.hide();
            else doorPlus.show().css({left:t0+t1});

            t0 = xpos.wheel_pos[step];
            if (t0 == 'xxx') wheelPlus.hide();
            else wheelPlus.show().css({left:t0+t1});
        }


        el.on(d,function(e){
            freeze = false;
            downX = e.screenX || e.originalEvent.changedTouches[0].screenX;
            $(this).on(m,onMove);
        });
        el.on(u,function(e){
            $(this).off(m,onMove);
        });
        img = el.find('img')[0];

        function preload(size,cb) {
            size = size || len;
            for (var i = 0 ; i < size ; ++i) {
                if (!cache[i]) cache[i] = new Image();
                cache[i].src = '../../images/model_view/MODEL_CamryWildHybrid/main/vr/'+model+'_'+light+'/'+lpad(i,5)+".png";
            }
            if (!cb) return;
            var x = setInterval(function(){
                for (var i = 0 ; i < size ; ++i) {
                    if (!cache[i].complete) return;
                }
                clearInterval(x);
                cb();
            },100);
        }



        return {
            changeModel : function (index) {
                model = models[index];
                preload();
                render();
            },
            lightToggle : function() {
                if (light == 'off') light = 'on';
                else light = 'off';
                preload();
                render();
            },
            wheel : function() {
                lock = true;
                $(el).addClass('lock');
                moveTop(function(){
                    var olight = light, g = 1;
                    light = 'wheel';
                    preload(11,function(){
                        clearInterval(intervalId);
                        intervalId = setInterval(function(){
                            step = step + g;
                            if (step == 10) g = -1;
                            render();
                            if (step == 0) {
                                light = olight;
                                render();
                                clearInterval(intervalId);
                                lock = false;
                                $(el).removeClass('lock');
                            }
                        },60);
                    });
                });
            },
            door : function() {
                lock = true;
                $(el).addClass('lock');
                moveTop(function() {
                    clearInterval(intervalId);
                    olight = light;
                    light = 'door';
                    preload(11, function () {
                        clearInterval(intervalId);
                        intervalId = setInterval(function () {
                            step++;
                            render();
                            if (step == 10) {
                                clearInterval(intervalId);
                                var option;
                                if (window.innerWidth < 960) {
                                    option = { opacity: 0};//width: '300%', left: '-100%', top: '-30%',
                                } else {
                                    option = { opacity: 0};//width: '200%', left: '-960px', top: '-520px',
                                }

                                $(".vr .body").animate(option, function () {
                                    $(".int").show();
                                });
                            }
                        }, 60);
                    });
                });
            },
            closeInt : function() {
                $(".int").hide();
                var option;
                if (window.innerWidth < 960) {
                    option = {opacity:1}//width:'180%',left:'-40%',top:'0',
                } else {
                    option = {opacity:1}//width:'100%',left:'0',top:'0',
                }
                $(".vr .body").animate(option,function(){
                    $(".vr .body").removeAttr('style');
                    clearInterval(intervalId);
                    intervalId = setInterval(function(){
                        step--;
                        if (step == 0) {
                            light = olight;
                            clearInterval(intervalId);
                            lock = false;
                            $(el).removeClass('lock');
                        }
                        render();
                    },60);
                });
            }
        }
    };


    /*iseq*/
    (function () {
        function preload(self) {
            var i = self.len, img;
            while(i--) {
                img = new Image();
                img.src = (window.innerWidth < 960? self.iseq_m : self.iseq_pc) + lpad(self.cursor,5)+".png";
            }
        }
        $.fn.iseq = function() {
            this.each(function () { if (!this.iseq) {
                this.iseq = true;
                this.iseq_pc = this.getAttribute('data-pc');
                this.iseq_m = this.getAttribute('data-m');
                this.len = this.getAttribute('data-len');
                this.src = (window.innerWidth < 960? this.iseq_m : this.iseq_pc) + "00000.png";
                this.cursor = 0;
                preload(this);
            } });
            return this;
        };
        $.fn.iseqRepeat = function (intermediate) {
            this.each(function(){
                clearInterval(this.intervalId);
                var self = this, delay;
                this.intervalId = setInterval(function () {
                    if (delay) { delay--; return; }
                    self.cursor++;
                    if (self.cursor == self.len ) {
                        delay = intermediate;
                        self.cursor = 0;
                    }
                    self.src = (window.innerWidth < 960? self.iseq_m : self.iseq_pc) + lpad(self.cursor,5)+".png";
                }, 100);
            });
            return this;
        };
        $.fn.iseqStop = function () {
            this.each(function(){
                clearInterval(this.intervalId);
            });
            return this;
        };
    })();


    $('.iseq').iseq();
    $(".page4 ul li").click(function(){
       $(".page4 ul li").removeClass('on');
       var idx = $(this).addClass('on').index();
        $(".page4 .vis .iseq").removeClass('on').iseqStop().eq(idx).addClass('on').iseqRepeat();
        $(".page4 .cont p span").removeClass('on').eq(idx).addClass('on');
    });

    vr = vr($(".page5 .vr"));
    vr.changeModel(3);

    $(".page5 ul li").click(function(){
        $(".page5 ul li").removeClass('on');
        var idx = $(this).addClass('on').index();
        vr.changeModel(idx);
    });

    $(".page5 .vr .light").click(function(){
        vr.lightToggle();
    });

    $(".page5 .vr .wheel").click(function(){
        vr.wheel();
    });

    $(".page5 .vr .door").click(function(){
        vr.door();
    });

    $(".page5 .close").click(function(){
        vr.closeInt();
    });

    (function page2preload() {
        var x = window.innerWidth < 960 ? '_m' : '' ;
        for (var i = 0 ; i < 33 ; ++i) {
            var img = new Image();
            img.src = '../../images/model_view/MODEL_CamryWildHybrid/main/tnga3'+x+'/'+lpad(i,5)+".png";
        }
    })();

    (function(){
        var r = { value:0 };
        var jq = $(r);
        var items = $("#gallery ul li");
        var disp = $("#gallery .gallery_cont img")[0];
        var center;
        var ul = $("#gallery ul")[0];

        function render() {
            center = reg(r.value >> 0);
            var delta = (r.value >> 0) - r.value;
            var j = center-5;
            for (var i = 0 ; i < 11 ; ++i) {
                j = reg(j);
                items[j++].style.left = ((i-5+delta)*198)+"px";
            }
        }

        function reg(v) {
            if (v < 0) return v+11;
            else if (v > 10) return v-11;
            return v;
        }

        render();
        disp.src = "../../images/model_view/MODEL_CamryWildHybrid/main/gallery/"+ (window.innerWidth < 960 ? 'm/' : '')+"3.jpg";

        items.click(function(){
            var da = [3,5,7,8,10,11,13,14,15,16,17];
            var dx = da[this.className.substr(1)*1-1];
            disp.src = "../../images/model_view/MODEL_CamryWildHybrid/main/gallery/"+ (window.innerWidth < 960 ? 'm/' : '')+dx+".jpg";
            ul.className = this.className;
            var delta = $(this).index() - r.value;
            if (delta > 5) r.value += 11;
            if (delta < -5) r.value -= 11;
            jq.stop().animate({value:$(this).index()}, {step:render,complete:render});
        });

        $(".gallery_arrow_right").click(function(){
            var x = ul.className.substr(1);
            var next = reg(x*1)+1;
            $("#gallery ul li.i"+next).click();
        });

        $(".gallery_arrow_left").click(function(){
            var x = ul.className.substr(1);
            var prev = reg(x-2)+1;
            $("#gallery ul li.i"+prev).click();
        });

    })();

    window.addEventListener('scroll',onscroll);
    window.addEventListener('resize',onresize);
    setInterval(tick,24);
    onresize();
})();

$(window).load(function () {
    if (location.hash == '#gallery') {
        if (commonjs.isMobile()) {
            //모바일일 경우
            var mg = $('#header').height() + $('.lnb_title').height();
        } else {
            //pc
            var mg = $('#header').height();
        }
        commonjs.scrollToBody($("#gallery").offset().top - mg, 400);
    }
});
