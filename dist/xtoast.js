/**
 * Created by wudengke on 2017/3/8.
 */
;(function (define) {
    define(['jquery'], function ($) {
        return (function(){
            if($=="undefined") { console.error("XToast:I need jQuery!");return null;}
            var settings={
                debug:true,
                toastPos:"toast-right-top",
                closeBtn:true,
                escapeHtml:false,
                show:{
                    effect:"bounceInRight",
                    duration:300,
                    easing:"swing"
                },
                hide:{
                    effect:"bounceOutRight",
                    duration:1000,
                    easing:"linear"
                },
                onclick:function(e){

                },
                timeOut:5000,
                extendedTimeOut:30000
            };
            var backSettings=settings;//备份
            var $Body=$('body'),$Wrapper=$('<div id="XToast-wrapper"></div>'),toastNum=0;
            var jQueryEffect=['fadeIn',"fadeOut","slideDown","slideUp"];
            var toastPos=[
                "toast-right-top","toast-right-bottom","toast-left-top","toast-left-bottom",
                "toast-top-center","toast-bottom-center",
                "toast-top-full-width","toast-bottom-full-width"
            ];
            var XToast={
                setOptions:function(options){
                    $.extend(true,settings,options);
                    if(settings.debug){
                        this._normalizeOptions();
                    }
                },
                _init:function(){

                },
                _normalizeOptions:function(options){
                    (function checkIsBool(options){
                        for(var i=0,length=options.length;i<length;i++){
                            if($.type(settings[options[i]])!="boolean"){
                                console.warn("XToast:option "+options[i]+"`s type is`not boolean!transform to boolean");
                                settings[options[i]]=!!settings[options[i]];
                            }
                        }
                    })(["debug","closeBtn","escapeHtml"]);


                    if($.inArray(settings.toastPos,toastPos)==-1){
                        console.warn("XToast:option toastPos is invalid!use default");
                        settings.toastPos="toast-right-top";
                    }
                    if(settings.toastPos=="toast-top-full-width"){
                        if(settings.show.effect=="bounceInRight"){
                            settings.show.effect="bounceInDown";
                        }
                        if(settings.hide.effect=="bounceOutRight"){
                            settings.hide.effect="bounceOutUp";
                        }
                    }
                    if(settings.toastPos=="toast-bottom-full-width"){
                        if(settings.show.effect=="bounceInRight"){
                            settings.show.effect="bounceInUP";
                        }
                        if(settings.hide.effect=="bounceOutRight"){
                            settings.hide.effect="bounceOutDown";
                        }
                    }
                    if(settings.toastPos.indexOf("left")>-1){
                        if(settings.show.effect=="bounceInRight"){
                            settings.show.effect="bounceInLeft";
                        }
                        if(settings.hide.effect=="bounceOutRight"){
                            settings.hide.effect="bounceOutLeft";
                        }
                    }

                    /*(function checkIsNumber(options){
                        for(var i=0,length=options.length;i<length;i++){
                            var arr=options[i].split(".");
                            var option=settings[arr[0]];
                            for(var j=1;j<arr.length;j++){
                                option=option[arr[j]];
                            }
                            console.log(option)
                            if($.type(option)!="number"){
                                console.warn("XToast:option "+options[i]+"`s type is`not number!use default");

                            }
                        }
                    })(["show.duration","hide.duration","timeout","extendedTimeOut"]);*/

                    if($.type(settings.show.duration)!="number"&&isNaN(parseInt(settings.show.duration))){
                        console.warn("XToast: option show.duration is invalid! use default");
                        settings.show.duration=300;
                    }
                    if($.type(settings.hide.duration)!="number"&&isNaN(parseInt(settings.hide.duration))){
                        console.warn("XToast: option hide.duration is invalid! use default");
                        settings.hide.duration=1000;
                    }
                    if($.type(settings.timeOut)!="number"&&isNaN(parseInt(settings.timeOut))){
                        console.warn("XToast: option timeOut is invalid! use default");
                        settings.timeOut=5000;
                    }
                    if($.type(settings.extendedTimeOut)!="number"&&isNaN(parseInt(settings.extendedTimeOut))){
                        console.warn("XToast: option extendedTimeOut is invalid! use default");
                        settings.extendedTimeOut=30000;
                    }
                },
                _setWrapper:function(){
                    if($Body.children("#XToast-wrapper").length==0){
                        $Wrapper.addClass(settings.toastPos).appendTo($Body);
                    }
                },
                notify:function(type,message,title,options){
                    var $Toast,$Message,$Title;
                    if($.type(title)=="object"){
                        options=title;
                        $.extend(true,settings,options);
                    }else if($.type(title)=="string"){
                        $.extend(true,settings,options);
                        $Title=$('<h4 class="XToast-title"></h4>');
                        if(settings.escapeHtml)
                            $Title.text(title);
                        else
                            $Title.html(title);
                    }

                    $Toast=$('<div class="XToast"></div>').addClass("XToast-"+type);
                    var clearTimer=setTimeout(function(){
                        this.clear($Toast);
                    }.bind(this),settings.timeOut);
                    $Toast.data("clearTimer",clearTimer).on("click",function(){
                        XToast.clear($(this));
                    }).on("click",{index:toastNum},settings.onclick)
                    .hover(function(){
                        clearTimeout($Toast.data("clearTimer"));
                    },function(){
                        var clearTimer=setTimeout(function(){
                            this.clear($Toast);
                        }.bind(this),settings.extendedTimeOut);
                        $Toast.data("clearTimer",clearTimer)
                    }.bind(this));

                    if(settings.closeBtn)
                        $('<button class="XToast-close-btn" role="button">×</button>').on("click",function(){
                            this.clear($Toast);
                        }.bind(this)).appendTo($Toast);
                    $Message=$('<div class="XToast-message"></div>');
                    if(settings.escapeHtml)
                        $Message.text(message);
                    else
                        $Message.html(message);
                    if(!!$Title){
                        $Title.appendTo($Toast);
                    }
                    $Message.appendTo($Toast);

                    this._setWrapper();

                    if($.inArray(settings.show.effect,jQueryEffect)>-1){
                        $Toast.prependTo($Wrapper)[settings.show.effect](settings.show.duration);
                    }else{
                        $Toast.show().addClass("animated "+settings.show.effect).prependTo($Wrapper);
                    }

                    toastNum++;

                    return $Toast;
                },
                success:function(message,title,options){
                    return this.notify("success",message,title,options)
                },
                info:function(message,title,options){
                    return this.notify("info",message,title,options)
                },
                warning:function(message,title,options){
                    return this.notify("warning",message,title,options)
                },
                error:function(message,title,options){
                    return this.notify("error",message,title,options)
                },
                clear:function(index){
                    var $Toast;
                    if($.type(index)=="undefined") {
                        $Toast=$Wrapper.children(".XToast");
                    }else if(index=="last"){
                        $Toast=$Wrapper.children(".XToast").first();
                    }else if(index=="first"){
                        $Toast=$Wrapper.children(".XToast").last();
                    }else if($.type(index)=="number"){
                        index=index>toastNum?toastNum:index;
                        $Toast=$Wrapper.children(".XToast").eq(index-1);
                    }else if(index instanceof $){
                        $Toast=index;
                    }else if(index.nodeType==1&&index.getAttribute("class").indexOf("XToast")>-1){
                        $Toast=$(index);
                    }else{
                        $Toast=$Wrapper.children(".XToast").last();
                    }
                    if($.inArray(settings.hide.effect,jQueryEffect)>-1){
                        $Toast[settings.hide.effect](settings.hide.duration,function(){
                            $(this).remove();
                            toastNum--;
                        });
                    }else{
                        $Toast.on("animationend",function(){
                            $Toast.remove();
                            toastNum--;
                        }).on("webkitAnimationEnd",function(){
                            $Toast.remove();
                            toastNum--;
                        }).addClass("animated "+settings.hide.effect);
                        //不支持animationend事件的用定时器除去
                        setTimeout(function(){
                            $Toast.remove();
                            toastNum--;
                        },1000)
                    }
                }
            };

            return XToast;
        })();
    });
}(typeof define === 'function' && define.amd ? define : function (deps, factory) {
        if (typeof module !== 'undefined' && module.exports) { //Node
            module.exports = factory(require('jquery'));
        } else {
            window['XToast'] = factory(window['jQuery']);
        }
    })
);