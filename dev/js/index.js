function init(){$arrlist=store.get("data")||[],createHtml(),refreshStore(),taskDetails()}function addTask(t){$arrlist.push(t),store.set("data",$arrlist)}function createHtml(){var t=$(".task_list");t.html(null);for(var e=0;e<$arrlist.length;e++){var a=bindHtml($arrlist[e],e);t.append(a)}bindDelete()}function bindHtml(t,e){return'<li class="task_item" data-index="'+e+'"><input type="checkbox" name="" id="" value="" /><span class="textContent">'+t.content+'</span><span class="del">删除</span><span class="details">详细</span></li>'}function bindDelete(){$(".del").on("click",function(){removeTask($(this).parent().data("index"))})}function removeTask(t){confirm("你确定要删除吗")&&($arrlist.splice(t,1),refreshStore())}function refreshStore(){store.set("data",$arrlist),createHtml()}function taskDetails(){$(".details").on("click",function(){var t=$(this).parent().data("index");addDetails($arrlist[t])})}function addDetails(t){var e='<div class="task_details"><div class="task_detail_mask"><input type="text" name="reset" id="reset" value="" style="display: none;"/><div class="remind"><label for="datetime">提醒时间</label><input type="text" id="datetimepicker" class="datetime" id="datetime" value="'+(t.datetime||"")+'"/></div><button class="update">更新</button><button class="close">X</button></div></div>';$("#container").append(e),removeDetails(),taskDetailMask()}function removeDetails(){$(".close").click(function(){$(".task_details,task_detail_mask").remove()})}function taskDetailMask(){$(".update").click(function(t){t.preventDefault();var e=$(this).parent().data("index"),a={};a.content=$(this).find(".content").text(),a.tail=$(this).find(".tail").val(),a.datetime=$(this).find(".datetime").val(),upDate(a,e),$(".task_details,task_detail_mask").remove(),console.log(e)})}function upDate(t,e){console.log(t),$arrlist[e]=t,store.set("data",$arrlist),addDetails($arrlist[e])}!function(t,e){function a(){var e=s.getBoundingClientRect().width;e/o>540&&(e=540*o);var a=e/10;s.style.fontSize=a+"px",c.rem=t.rem=a}var i,n=t.document,s=n.documentElement,r=n.querySelector('meta[name="viewport"]'),l=n.querySelector('meta[name="flexible"]'),o=0,d=0,c=e.flexible||(e.flexible={});if(r){console.warn("将根据已有的meta标签来设置缩放比例");var m=r.getAttribute("content").match(/initial\-scale=([\d\.]+)/);m&&(d=parseFloat(m[1]),o=parseInt(1/d))}else if(l){var p=l.getAttribute("content");if(p){var u=p.match(/initial\-dpr=([\d\.]+)/),f=p.match(/maximum\-dpr=([\d\.]+)/);u&&(o=parseFloat(u[1]),d=parseFloat((1/o).toFixed(2))),f&&(o=parseFloat(f[1]),d=parseFloat((1/o).toFixed(2)))}}if(!o&&!d){t.navigator.appVersion.match(/android/gi);var v=t.navigator.appVersion.match(/iphone/gi),k=t.devicePixelRatio;d=1/(o=v?k>=3&&(!o||o>=3)?3:k>=2&&(!o||o>=2)?2:1:1)}if(s.setAttribute("data-dpr",o),!r)if((r=n.createElement("meta")).setAttribute("name","viewport"),r.setAttribute("content","initial-scale="+d+", maximum-scale="+d+", minimum-scale="+d+", user-scalable=no"),s.firstElementChild)s.firstElementChild.appendChild(r);else{var $=n.createElement("div");$.appendChild(r),n.write($.innerHTML)}t.addEventListener("resize",function(){clearTimeout(i),i=setTimeout(a,300)},!1),t.addEventListener("pageshow",function(t){t.persisted&&(clearTimeout(i),i=setTimeout(a,300))},!1),"complete"===n.readyState?n.body.style.fontSize=12*o+"px":n.addEventListener("DOMContentLoaded",function(t){n.body.style.fontSize=12*o+"px"},!1),a(),c.dpr=t.dpr=o,c.refreshRem=a,c.rem2px=function(t){var e=parseFloat(t)*this.rem;return"string"==typeof t&&t.match(/rem$/)&&(e+="px"),e},c.px2rem=function(t){var e=parseFloat(t)/this.rem;return"string"==typeof t&&t.match(/px$/)&&(e+="rem"),e}}(window,window.lib||(window.lib={}));var $task=$(".task"),$arrlist=[];init(),$task.on("submit",function(t){t.preventDefault();var e={};e.content=$task.find("input").eq(0).val(),e.content&&(addTask(e),createHtml(),$task.find("input").eq(0).val(null))}),bindDelete(),upDate(),$.datetimepicker.setLocale("ch"),$("#datetimepicker").datetimepicker();