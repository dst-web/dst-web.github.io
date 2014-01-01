$(function(){
    var $winInner=$(".dss-win-inner"),
        $windowResizeB=$winInner.find(".dss-window-resize-b"),
        $windowResizeR=$winInner.find(".dss-window-resize-r"),
        $windowResizeT=$winInner.find(".dss-window-resize-t"),
        $windowResizeL=$winInner.find(".dss-window-resize-l"),
        $windowResizeRb=$winInner.find(".dss-window-resize-rb"),
        $windowResizeRt=$winInner.find(".dss-window-resize-rt"),
        $windowResizeLt=$winInner.find(".dss-window-resize-lt"),
        $windowResizeLb=$winInner.find(".dss-window-resize-lb"),
        resizePoit={"B":$windowResizeB,"R":$windowResizeR,"Rb":$windowResizeRb,"T":$windowResizeT,
            "L":$windowResizeL,"Rt":$windowResizeRt,"Lt":$windowResizeLt,"Lb":$windowResizeLb},
        customeTopMenuBar=$(".dss-top-tool-custome-list"),
        topIndex=$("winBox").length;
    setDrag($(".dss-title-bar"));
    initThumbIcon();
    setResize(resizePoit);
    setWinType();
    getTime();
    setInterval(function(){
        getTime();
    },1000);
    mainMenu();
    $(".dss-minwin-btn").click(function(){
        var win=$(this).parents(".dss-winBox");
        win.hide();
        var thumbAttr=$("li[thumbwin='"+win.attr("win")+"']");
        thumbAttr.removeClass("hover");
        if(thumbAttr.is(":hidden")){
            thumbAttr.show();
        }
        if(thumbAttr.attr("thumbwin").charAt(0)=="0"&&thumbAttr.attr("thumbwin").length!=1){
            thumbAttr.addClass("disabled");
            //thumbAttr.attr("min",true);
        }
        return false;
    }); //最小化窗口
    $(".dss-closewin-btn").click(function(){
        var win=$(this).parents(".dss-winBox");
        win.hide();
        if(win.attr("win").charAt(0)=="0"&&win.attr("win").length!=1){
            //console.log($("li[thumbwin='"+win.attr("win")+"']").attr("thumbwin"));
            $("li[thumbwin='"+win.attr("win")+"']").removeClass();
        }else{
            $("li[thumbwin='"+win.attr("win")+"']").hide();
        }
        return false;
    }); //关闭窗口
    $("#dss-thumb-icon").children("li").click(function(){
        topIndex=getTopIndex();
        var winAttr=$(".dss-winBox[win='"+$(this).attr("thumbwin")+"']");//通过属性选择符，选择和thumbwin值一样的winBox;
        var oldIndex=winAttr.css("z-index");
        $(this).children("div").fadeOut();
        $(this).addClass("hover").siblings().removeClass("hover");
        var sbUl=$(this).parents("ul").prev().children("li");
        for(var i=0; i<sbUl.length; i++){
            if($(".dss-winBox[win='"+sbUl.eq(i).attr("thumbwin")+"']").is(":visible")){
                sbUl.eq(i).removeClass("height").addClass("disabled")
            }
        } //若default-icon被点击，取消高亮；
        if(oldIndex==0){
            winAttr.css("z-index",topIndex).show().removeClass("dss-noCurWin").siblings().addClass("dss-noCurWin");
        }else if(oldIndex==(topIndex-1)&&winAttr.is(":visible")){
            winAttr.hide();
        }else if(winAttr.is(":hidden")||oldIndex<topIndex&&winAttr.is(":visible")){
            winAttr.css("z-index",topIndex).show().removeClass("dss-noCurWin").siblings().addClass("dss-noCurWin"); //点击thumbicon时，对应win在最前显示;
        }
        clearTimeout($(this)[0].timer);
        return false;
    }).mouseenter(function(){
        var $that=$(this);
        $that[0].show=setTimeout(function(){
            $that.children("div").fadeIn().end().siblings().children("div").fadeOut().
                children("div").children("div").removeClass("hov");
        },300)
        clearTimeout($(this)[0].timer);
    }).mouseleave(function(){
            var $that=$(this);
            $that[0].timer=setTimeout(function(){
                $that.children("div").hide();
            },300)
        });
    $("#dss-wrap-bottom-bar li").children("div").mouseenter(function(e){
        $(this).show().children("div").addClass("hov").find("strong").show().
            parents("li").siblings().find("strong").hide().
            parents("li").find("div").removeClass("hov");
        clearTimeout($(this).parents("li")[0].timer);
        clearTimeout($(this)[0].timer);
        e.stopPropagation();
    }).click(function(){
            topIndex=getTopIndex();
            $(this).hide();
            $(this).parent().addClass("hover").siblings().removeClass("hover");
            $(".dss-winBox[win='"+$(this).parent().attr("thumbwin")+"']").show()
                .css("z-index",topIndex).removeClass("dss-noCurWin").siblings().addClass("dss-noCurWin"); //点
            clearTimeout($(this)[0].timer);
            return false;
        })
        .mouseleave(function(e){
            $(this).find("div").removeClass("hov").parents("li").find("strong").hide();
            var $that=$(this);
            $that[0].timer=setTimeout(function(){
                $that.hide();
            },500)
            e.stopPropagation();
        }).find("strong").click(function(){
            var winAttr=$(".dss-winBox[win='"+$(this).parents("li").attr("thumbwin")+"']");
            if($(this).parents("ul").attr("id")=="dss-lt-default-icon"){
                winAttr.hide();
                $(this).parents("li").removeClass().children("div").hide();
                return false;
            } //当为default-icon时，点击div的关闭，不删除图标；
            $(this).parents("li").hide();
            winAttr.hide();
            return false;
        });
    $("#dss-lt-default-icon").children("li").click(function(){
        var winAttr=$(".dss-winBox[win='"+$(this).attr("thumbwin")+"']");
        var oldIndex=parseInt(winAttr.css("z-index"));
        topIndex=getTopIndex();
        if(winAttr.is(":hidden")){ //若win隱藏,win显示，并添加class为hover移除disabled；若相邻li对应win显示,添加class为disabled;
            winAttr.show().css("z-index",topIndex).removeClass("dss-noCurWin").siblings().addClass("dss-noCurWin");
            $(this).addClass("hight").removeClass("disabled").parents("ul").next().children("li").removeClass("hover");
        } else if(winAttr.is(":visible")){ //若win显示：1.最前面时，点击隐藏；2.非最前时，置前；
            //console.log("topIndex:"+topIndex,"当前："+parseInt(winAttr.css("z-index")))
             if(oldIndex==(topIndex-1)){
                winAttr.hide();
                $(this).addClass("disabled").removeClass("hight");
            }else if(oldIndex<topIndex){
                $(this).addClass("hight").removeClass("disabled").siblings().removeClass("hight")
                    .parents("ul").next().children("li").removeClass("hover");
                winAttr.css("z-index",topIndex).show().removeClass("dss-noCurWin").siblings().addClass("dss-noCurWin");
            }
        }
        var sbLi=$(this).siblings();
        for(var i=0; i<sbLi.length; i++){
            if($(".dss-winBox[win='"+sbLi.eq(i).attr("thumbwin")+"']").is(":visible")){
                sbLi.eq(i).removeClass("hight").addClass("disabled");
            }
        }
    })
        .mouseenter(function(){
            var win=$(".dss-winBox[win='"+$(this).attr("thumbwin")+"']");
            if($(this).parent().attr("id")=="dss-lt-default-icon"&&win.is(":hidden")){
                return;
            }//若为default-icon，当对应win隐藏时，不显示
            var $that=$(this);
            $that[0].show=setTimeout(function(){
                $that.children("div").fadeIn().end().siblings().children("div").fadeOut().
                    children("div").children("div").removeClass("hov");
            },500)
            clearTimeout($(this)[0].timer);
        }).mouseleave(function(){
            var $that=$(this);
            $that[0].timer=setTimeout(function(){
                $that.children("div").hide();
            },500)
        });

    customeTopMenuBar.click(function(e){
        var oDiv=$(this).find("div");
        subMenu(oDiv);
        e.stopPropagation();
    }) //topMenu 自定义菜单栏下拉
    $(document).click(function(){
        customeTopMenuBar.find("div").hide();
        $(".dss-top-site-input").hide();
        $(".dss-top-wrap-site").removeClass("dss-top-wrap-site-act");
        $(".dss-sub-cont-file").hide();
        $(".dss-top-tool2-sub").find("ul").hide();
        $(".dss-top-cont-menu").children("li").children("ul").hide();
        $("#dss-thumb-icon").children("li").children("div").hide();
        $(".dss-top-menu-cont>li").children("ul").hide();
        $(".dss-top-menu-cont").attr("onOff",false).children("li").attr("onOff",true).removeClass("hover");
    });
    $(".dss-window-content-lt i").hover(function () {
        $(this).parent().siblings().find("i").removeClass("dss-w-c-l-act");
        $(this).addClass("dss-w-c-l-act");
    }, function () {
        $(this).removeClass("dss-w-c-l-act");
    });//左侧菜单移入
    $(".dss-top-wrap-site").on("click",function(){
        var html=$(this).find("span").html();
        //console.log(html);
        $(this).find("input").val(html);
        $(this).find(".dss-top-site-input").show();
        $(this).find("input").select();
        $(this).addClass("dss-top-wrap-site-act");
        return false;
    });//topMenu地址栏
    $(".dss-top-menu-lt").children("h2").click(function(){
        subMenu($(this).next());
        setTopIndex($(this).parents(".dss-winBox"))
        return false;
    });//topMune文件菜单下拉
    $(".dss-top-tool2-sub").click(function(){
        subMenu($(this).find("ul"));
        return false;
    })
    $(".dss-sub-file>li").mouseover(function(){
        var aDiv= $(this).parent().next($(".dss-file-collec")).children("div");
        aDiv.hide();
        aDiv.eq($(this).index()+1).show();
        $(this).addClass("hover").siblings().removeClass("hover");
//console.log("当前位置"+$(this).index())
        if($(this).index()==aDiv.length-1){
            aDiv.eq(0).show();
        }
    }).mouseout(function(){
            $(this).addClass();
        })
    $(".dss-menu-rt-unfold").attr("unfoldOnOff",true).click(function(){
        var $winBox=$(this).parents(".dss-winBox"),
            $wrapfix=$winBox.find(".dss-sub-menu-fix");
        //console.log($(this).attr("unfoldOnOff"))
        if($(this).attr("unfoldOnOff")=="true"){
            $winBox.find(".dss-sub-homepage").hide().end()
                .find(".dss-wrap-top-menu-bar").next(".dss-sub-homepage").show();
            $(this).attr("unfoldOnOff",false).removeClass("dss-menu-rt-unfold-down").addClass("dss-menu-rt-unfold-up");
            $winBox.find(".dss-sub-menu-fix").empty().end().
                find(".dss-wrap-top-menu-bar").find(".dss-sub-homepage").
                clone().appendTo($wrapfix).show();
            $winBox.find(".dss-window-content-lt").css("height",$winBox.height()-270);
        }else{
            $(this).removeClass("dss-menu-rt-unfold-up").addClass("dss-menu-rt-unfold-down")
                .attr("unfoldOnOff",true).parents(".dss-winBox").find(".dss-sub-homepage").hide();
            $winBox.find(".dss-window-content-lt").css("height",$winBox.height()-150);

        }
    });//点击右侧按钮，将menu嵌入；
    $(".dss-top-menu-cont").children("li").click(function(){
        if($(this).attr("onOff")=="true"){
            $(".dss-top-menu-cont>li").children("ul").hide();
            $(this).siblings().removeClass("hover").end().
                children("ul").show().end().
                addClass("hover").attr("onOff",false).parent().attr("onOff",true);
        }else{
            $(this).removeClass("hover").children("ul").hide();
            $(".dss-top-menu-cont").children("li").andSelf().attr("onOff",true);
        }
        setTopIndex($(this).parents(".dss-winBox"));
        return false;
    }).mouseover(function(){
            var str='';
            for(var i=0; i<$(".dss-top-menu-cont>li").length; i++){
                str+=$($(".dss-top-menu-cont>li")[i]).attr("onOff");
            }
            if(str.indexOf("false")==-1){
                return ;
            }
            if($(this).parent().attr("onOff")=="true"){
                $(".dss-top-menu-cont>li").children("ul").hide();
                $(this).siblings().removeClass("hover").end().addClass("hover").attr("onOff",false).children("ul").show();
            }

        })
        .children("ul").hide().end().attr("onOff",true);

    $("#dss-return-metro").hover(function(){
        $(this).addClass("dss-re-metro-hover");
    },function(){
        $(this).removeClass();
    }).click(function(){
            $("#dss-zoom-wallpaper-grid").fadeOut(100);
            $("#dss-page").show();
        });



    function getTopIndex(){
        var win=$(".dss-winBox");
        var max=parseInt(win.eq(0).css("z-index"));
        for(var i=1;i<win.length;i++){
            if(win.eq(i).css("z-index")>parseInt(max)){
                max=win.eq(i).css("z-index");
            }
        }
        return parseInt(max)+1;;
    } //取最大Index
    function subMenu(obj){
        if(obj.is(":hidden")){
            obj.show();
        }else{
            obj.hide();
        }
    } //显示隐藏元素
    function mainMenu(){
        $(".dss-top-cont-menu").children("li").click(function(){
            $(this).siblings("li").removeClass("active").children("ul").hide().css("width",$(this).parents(".dss-wrap-top-menu-bar").width());
            if($(this).children("ul").is(":hidden")){
                $(this).addClass("active")
            }
            $(this).children("ul").show();
            setTopIndex($(this).parents(".dss-winBox"))
            return false;
        });
    }
    function setResize(obj){
        obj.B.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startY=e.pageY,
                startH=$winBox.height(),
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disY=e.pageY-startY;
                var $winBox=_this.parents(".dss-winBox");
                $winBox.css("height",disY+startH);
                //console.log(disY,$winBox.css("height"));
                if($winBox.outerHeight()<=320){
                    $winBox.css("height",320);
                }
                setCrollHeight($winBox);
                return false;
            });
            docOffEvt();

            return false;
        }); //下
        obj.R.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startX=e.pageX,
                startW=$winBox.width(),
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disX=e.pageX-startX,
                    $winBox=_this.parents(".dss-winBox");
                $winBox.css("width",disX+startW);
                if($winBox.outerWidth()<=230){
//console.log($winBox.outerWidth());
                    $winBox.css("width",230);
                }
                if(e.pageX+20==$(document).width()){
                    var winBoxWid=$winBox.width();
//console.log("box的宽度："+winBoxWid)

                }
                if(e.pageX+20>$(document).width()){
                    $winBox.css("width",winBoxWid);
                }
                return false;
            });
            docOffEvt();
            return false;
        }); //右
        obj.Rb.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startX=e.pageX,
                startY= e.pageY,
                startW=$winBox.width(),
                startH=$winBox.height(),
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disX=e.pageX-startX,
                    disY= e.pageY-startY,
                    $winBox=_this.parents(".dss-winBox");
                $winBox.css({"width":disX+startW,"height":disY+startH});
                if($winBox.outerHeight()<=320){
                    $winBox.css("height",320);
                }
                if($winBox.outerWidth()<=230){
                    //console.log($winBox.outerWidth());
                    $winBox.css("width",230);
                }
                setCrollHeight($winBox);
                return false;
            });
            docOffEvt();
            return false;
        });//右下
        obj.T.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startY= e.pageY,
                startH=$winBox.height(),
                startOffsetT=$winBox.offset().top,
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disY=startY-e.pageY,
                    $winBox=_this.parents(".dss-winBox");
                $winBox.css("height",disY+startH);
                $winBox.offset({top:(startOffsetT-disY)});
                if($winBox.outerHeight()<=320){
                    $winBox.css("height",320).offset({top:startOffsetT+(startH-320)});
                }
                if($winBox.offset().top<=0){
                    $winBox.offset({top:0}).css("height",startH+startOffsetT);
                }
                setCrollHeight($winBox);
                return false;
            });
            docOffEvt();
            return false;
        });//上
        obj.L.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startX= e.pageX,
                startW=$winBox.width(),
                startOffsetL=$winBox.offset().left,
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disX=startX-e.pageX,
                    $winBox=_this.parents(".dss-winBox");
                $winBox.css("width",disX+startW);
                $winBox.offset({left:(startOffsetL-disX)});
                if($winBox.outerWidth()<=230){
                    $winBox.css("width",230);
                    $winBox.offset({left:(startOffsetL+(startW-230))});
                }
                return false;
            });
            docOffEvt();
            return false;
        });//左
        obj.Rt.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startX= e.pageX,
                startY= e.pageY,
                startW=$winBox.width(),
                startH=$winBox.height(),
                startOffsetT=$winBox.offset().top,
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disX=e.pageX-startX,
                    disY=startY- e.pageY,
                    $winBox=_this.parents(".dss-winBox");
                $winBox.css({"width":disX+startW,"height":disY+startH});
                $winBox.offset({top:(startOffsetT-disY)});
                if($winBox.outerWidth()<=230){
                    $winBox.css("width",230);
                }
                if($winBox.outerHeight()<=320){
                    $winBox.css("height",320).offset({top:(startOffsetT+(startH-320))});
                }
                if($winBox.offset().top<=0){
                    $winBox.offset({top:0}).css("height",startH+startOffsetT);
                }
                setCrollHeight($winBox);
                return false;
            });
            docOffEvt();
            return false;
        });//右上
        obj.Lt.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startX= e.pageX,
                startY= e.pageY,
                startW=$winBox.width(),
                startH=$winBox.height(),
                startOffsetT=$winBox.offset().top,
                startOffsetL=$winBox.offset().left,
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disX=startX-e.pageX,
                    disY=startY-e.pageY,
                    $winBox=_this.parents(".dss-winBox");
                $winBox.css({"width":disX+startW,"height":disY+startH});
                $winBox.offset({left:(startOffsetL-disX),top:(startOffsetT-disY)});
                if($winBox.outerWidth()<=230){
                    $winBox.css("width",230).offset({left:(startOffsetL+(startW-230))});
                }
                if($winBox.outerHeight()<=320){
                    $winBox.css("height",320).offset({top:(startOffsetT+(startH-320))});
                }
                if($winBox.offset().top<=0){
                    $winBox.offset({top:0}).css("height",startH+startOffsetT);
                }
                setCrollHeight($winBox);
                return false;
            });
            docOffEvt();
            return false;
        });//左上
        obj.Lb.on("mousedown",function(e){
            var $winBox=$(this).parents(".dss-winBox"),
                startX= e.pageX,
                startY= e.pageY,
                startW=$winBox.width(),
                startH=$winBox.height(),
                startOffsetT=$winBox.offset().top,
                startOffsetL=$winBox.offset().left,
                _this=$(this);
            $(document).on("mousemove",function(e){
                var disX=startX-e.pageX,
                    disY=e.pageY-startY,
                    $winBox=_this.parents(".dss-winBox");
                $winBox.css({"width":disX+startW,"height":disY+startH});
                $winBox.offset({left:(startOffsetL-disX)});
                if($winBox.outerWidth()<=200){
                    $winBox.css("width",200).offset({left:(startOffsetL+(startW-200))});
                }
                if($winBox.outerHeight()<=150){
                    $winBox.css("height",150);
                }
                if($winBox.offset().top<=0){
                    $winBox.offset({top:0}).css("height",startH+startOffsetT);
                }
                setCrollHeight($winBox);
                return false;
            });
            docOffEvt();
            return false;
        });//左下
    } //缩放窗口
    function docOffEvt(){
        $(document).mouseup(function ()
        {
            $(document).unbind("mousemove");
            $(document).unbind("mouseup");
        });
    } //document解除mousemove、mouseup事件
    function setTopIndex(obj){
        topIndex++;
        obj.css("z-index",topIndex).removeClass("dss-noCurWin")
            .siblings(".dss-winBox").addClass("dss-noCurWin");
        var liAttr=$("li[thumbwin='"+obj.attr("win")+"']");
        if(obj.attr("win").charAt(0)=="0"&&obj.attr("win").length!=1){
            var aLi=liAttr.siblings();
            liAttr.addClass("hight").removeClass("disabled");
            liAttr.parent().next().children("li").removeClass("hover");
            for(var i=0; i<aLi.length; i++){
               if(aLi.eq(i).attr("class")=="hight"){
                   aLi.eq(i).addClass("disabled");
               }
            }
            $("#dss-lt-default-icon>li").removeClass("hight");
            liAttr.addClass("hight");//选取win对应的li,点击这里的时候最前面显示，并高亮
        }else{
            var thumbLi=$("#dss-thumb-icon>li");
            var sbUlLi=liAttr.parent().prev().children("li");
            thumbLi.removeClass("hover");
            liAttr.addClass("hover");//选取win对应的li,点击这里的时候最前面显示，并高亮

            //console.log(sbUlLi.eq(1).attr("class"))
            for(var m=0; m<sbUlLi.length; m++){
                 //console.log(sbUlLi.eq(m).attr("class"))
                 if(sbUlLi.eq(m).attr("class")=="hight"){
                     sbUlLi.eq(m).addClass("disabled");
                 }
            }
            sbUlLi.removeClass("hight");

        }

    }
    function setDrag(ele){
        var disX= 0,
            disY=0;
        ele.mousedown(function(e){
            var offset = $(this).parents(".dss-winBox").offset();
            disX= e.pageX-offset.left;
            disY= e.pageY-offset.top;
            var that=$(this);
            setTopIndex(that.parents(".dss-winBox"));
            $(document).mousemove(function(e){
                var l= e.pageX-disX,
                    t= e.pageY-disY;
                /* if(l<0)
                 {
                 l=0;
                 }else if(l>$(document).width()-that.parents(".dss-winBox").outerWidth())
                 {
                 l=$(document).width()-that.parents(".dss-winBox").outerWidth();
                 }
                 if(t<0)
                 {
                 t=0;
                 }else if(t>$(document).height()-that.parents(".dss-winBox").outerHeight())
                 {
                 t=$(document).height()-that.parents(".dss-winBox").outerHeight();
                 }*/
                that.parents(".dss-winBox").offset({left:l,top:t});
                return false;
            });
            docOffEvt();
            return false;
        });
        ele.parents(".dss-winBox").click(function(){
            setTopIndex($(this));
        })//点击当前在最顶层
    }//拖拽
    function setCrollHeight(obj) {
        if(!$(".dss-menu-rt-unfold")){
            (obj.find(".dss-menu-rt-unfold").attr("unfoldOnOff") == "true") ?
                obj.find(".dss-window-content-lt").css("height", obj.height() - 150) :
                obj.find(".dss-window-content-lt").css("height", obj.height() - 270);
        }else{
            obj.find(".dss-window-content-lt").css("height", obj.height() - 150)
        }

    } //设置左侧目录的高度
    function getTime(){
        var nowT=new Date(),
            y=nowT.getFullYear(),
            mon=nowT.getMonth()+1,
            d=nowT.getDate(),
            h=nowT.getHours(),
            m=nowT.getMinutes();
        h<10?h="0"+h:h;
        m<10?m="0"+m:m;
        var strD=y+"/"+mon+"/"+ d,
            strT=h+":"+m;
        $("#dss-rt-default li:last").find("em").html(strT+"<br/>"+strD)
    }  //获取系统时间
    function setWinType(){
        var icon=$(".dss-win-title-icon");
        for(var i=0; i<icon.length; i++){
            var winType=icon.eq(i).parents(".dss-winBox").attr("type");
            switch (winType){
                case "file":
                    icon.eq(i).children("i").addClass("dss-icon16-win-title");
                    break;
                case "txt":
                    icon.eq(i).children("i").removeClass().addClass("dss-icon16-txt");
                    break;
                case "help":
                    icon.eq(i).children("i").removeClass().addClass("dss-icon16-txt");
                    break;
                case "code":
                    icon.eq(i).children("i").removeClass().addClass("dss-icon16-txt");
                    break;
            }
        }
    }  //设置win的type，确定窗口图标类型
    function initThumbIcon(){
        var winBox=$(".dss-winBox");
        var defLi=$("#dss-lt-default-icon").children("li");
        for(var j=0; j<defLi.length; j++){
            defLi.eq(j).attr("thumbwin","0"+j);
        }
        for(var i=0; i<winBox.length;i++){
            //winBox.eq(i).attr("win",i);
            if(winBox.eq(i).attr("win").charAt(0)=="0"&&winBox.eq(i).attr("win").length!=1){
                winBox.eq(i).hide();
            }//隐藏默认任务栏的窗口
            $("#dss-thumb-icon>li").eq(i).attr("thumbwin",i);
            var winType=winBox.eq(i).attr("type");
            var thumbAttr=$("li[thumbwin='"+winBox.eq(i).attr("win")+"']");
            switch (winType){
                case "file":
                    thumbAttr.find("a").find("em").children("i").addClass("dss-icon32-bt-file");
                    break;
                case "txt":
                    thumbAttr.find("a").find("em").children("i").addClass("dss-icon32-note");
                    break;
            }
        }

    }//初始化thumbicon的自定义属性



    //pageTop
    setReColor();//设置色块背景色；
    $("#dss-page-cont").find(".dss-rec-b-cont").eq(0).click(function(){
        $(this).parents("#dss-page").fadeOut().prev().fadeIn();

    });
    function setReColor(){
        var aColor=["#2d89ef","#0098ab","#0a58c1","#009f00","#da532c","#93009c","#5636b0","#009cae","#2d8aef","#3e17b9"];
        var aDivRe=$("#dss-page-cont").find(".dss-rec-b-cont");
        for(var i=1; i<aDivRe.length-8; i++ ){
            aDivRe[i].style.backgroundColor=aColor[i%10];
            //aDivRe[i].style.background=aColor[Math.round(Math.random()*9)];
        }
    }
    setScrWid();
    function setScrWid(){
        var aBody=$("body"),
            dssBar=$(".dss-bar");
        $(".dss-bar-m").width(aBody.width()-66);
        dssBar.width(Math.round(aBody.width()*aBody.width()/$("#dss-page-cont").width()));
    } //设置水平滚动条的宽度，根据内容和屏幕比例；
    window.onresize=function(){
        setScrWid();
    }

    $(".dss-bar-l").add($(".dss-bar-r")).add($(".dss-bar")).hover(function(){
        $(this).addClass("dss-bg-scorll-over").removeClass("dss-bg-over");
    },function(){
        $(this).removeClass("dss-bg-scorll-over").addClass("dss-bg-over");
    });
    $(".dss-bar-l").mousedown(function(){
        var srollBar=$(".dss-bar");
        var left=srollBar.position().left;
        var speed=parseInt(srollBar.outerWidth()/50);
        srollBar.css("left",left-speed+"px");
        setLeft(srollBar.position().left);
    });//点击滚动条向左
    $(".dss-bar-r").mousedown(function(){
        var srollBar=$(".dss-bar");
        var left=srollBar.position().left;
        var speed=parseInt(srollBar.outerWidth()/50);
        srollBar.css("left",left+speed+"px");
        setLeft(srollBar.position().left);
    });//点击滚动条向右
    $(".dss-bar").mousedown(function(e){
        var disX=e.clientX-$(this).position().left;

        document.onmousemove=function (e)
        {   var e=e||window.event;
            var l=e.clientX-disX;
            setLeft(l);
        };

        document.onmouseup=function ()
        {
            document.onmousemove=null;
            document.onmouseup=null;
        };
    });//拖动滚动条
    function setLeft(l){
        if(l<0){
            l=0;
        }
        else if(l>$(".dss-bar-m").outerWidth()-$(".dss-bar").outerWidth()){
            l=$(".dss-bar-m").outerWidth()-$(".dss-bar").outerWidth();
        }
        $(".dss-bar").css("left",l);
        var scale=l/($(".dss-bar-m").outerWidth()-$(".dss-bar").outerWidth());
        $("#dss-page-cont").css("left",($("#dss-page-wrap").outerWidth()-$("#dss-page-cont").outerWidth())*scale);
    }


});