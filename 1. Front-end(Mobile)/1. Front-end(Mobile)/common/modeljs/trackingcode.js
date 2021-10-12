(function trafficCheck(){
    if(commonjs.agentCheck() == "MOBILE"){
        var googleCode = 'UA-39827930-2';
    }else{
        var googleCode = 'UA-39827930-1';
    }
        /* 구글 애널리틱스 코드 시작 */
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', googleCode, 'auto', 'clientTracker');
        ga('create', 'UA-79382937-1', 'auto');
        ga('send', 'pageview');
        ga('clientTracker.send', 'pageview');
        /* 구글 애널리틱스 코드 끝 */
                
    })();
//    trafficCheck(); 