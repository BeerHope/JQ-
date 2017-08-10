(function(win, lib) {
 var doc = win.document;
 var docEl = doc.documentElement;
 var metaEl = doc.querySelector('meta[name="viewport"]');
 var flexibleEl = doc.querySelector('meta[name="flexible"]');
 var dpr = 0;
 var scale = 0;
 var tid;
 var flexible = lib.flexible || (lib.flexible = {});
 if (metaEl) {
 console.warn('将根据已有的meta标签来设置缩放比例');
 var match = metaEl.getAttribute('content').match(/initial\-scale=([\d\.]+)/);
 if (match) {
  scale = parseFloat(match[1]);
  dpr = parseInt(1 / scale);
 }
 } else if (flexibleEl) {
 var content = flexibleEl.getAttribute('content');
 if (content) {
  var initialDpr = content.match(/initial\-dpr=([\d\.]+)/);
  var maximumDpr = content.match(/maximum\-dpr=([\d\.]+)/);
  if (initialDpr) {
  dpr = parseFloat(initialDpr[1]);
  scale = parseFloat((1 / dpr).toFixed(2)); 
  }
  if (maximumDpr) {
  dpr = parseFloat(maximumDpr[1]);
  scale = parseFloat((1 / dpr).toFixed(2)); 
  }
 }
 }
 if (!dpr && !scale) {
 var isAndroid = win.navigator.appVersion.match(/android/gi);
 var isIPhone = win.navigator.appVersion.match(/iphone/gi);
 var devicePixelRatio = win.devicePixelRatio;
 if (isIPhone) {
  // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
  if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {  
  dpr = 3;
  } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
  dpr = 2;
  } else {
  dpr = 1;
  }
 } else {
  // 其他设备下，仍旧使用1倍的方案
  dpr = 1;
 }
 scale = 1 / dpr;
 }
 //为html标签添加data-dpr属性
 docEl.setAttribute('data-dpr', dpr);
 if (!metaEl) {
 metaEl = doc.createElement('meta');
 metaEl.setAttribute('name', 'viewport');
 // 动态设置meta 
 metaEl.setAttribute('content', 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no');
 if (docEl.firstElementChild) {
  docEl.firstElementChild.appendChild(metaEl);
 } else {
  var wrap = doc.createElement('div');
  wrap.appendChild(metaEl);
  doc.write(wrap.innerHTML);
 }
 }
 //根据dpr和物理像素设置rem
 function refreshRem(){
 //getBoundingClientRect().width相当于物理像素
 var width = docEl.getBoundingClientRect().width;
 // width / dpr > 540等于独立像素
 if (width / dpr > 540) {
  width = 540 * dpr;
 }
 var rem = width / 10; // 将屏幕宽度分成10份， 1份为1rem. rem转化px计算公式=d*(width/10)
 docEl.style.fontSize = rem + 'px';
 flexible.rem = win.rem = rem;
 }
 // 监听窗口变化，重新设置尺寸
 win.addEventListener('resize', function() {
 clearTimeout(tid);
 tid = setTimeout(refreshRem, 300);
 }, false);
 // 当重新载入页面时，判断是否是缓存，如果是缓存，执行refreshRem()
 win.addEventListener('pageshow', function(e) {
 if (e.persisted) {
  clearTimeout(tid);
  tid = setTimeout(refreshRem, 300);
 }
 }, false);
 if (doc.readyState === 'complete') {
 doc.body.style.fontSize = 12 * dpr + 'px';
 } else {
 doc.addEventListener('DOMContentLoaded', function(e) {
  doc.body.style.fontSize = 12 * dpr + 'px';
 }, false);
 }
 refreshRem();
 flexible.dpr = win.dpr = dpr;
 flexible.refreshRem = refreshRem;
 flexible.rem2px = function(d) {
 var val = parseFloat(d) * this.rem;
 if (typeof d === 'string' && d.match(/rem$/)) {
  val += 'px';
 }
 return val;
 }
 flexible.px2rem = function(d) {
 var val = parseFloat(d) / this.rem;
 if (typeof d === 'string' && d.match(/px$/)) {
  val += 'rem';
 }
 return val;
 }
})(window, window['lib'] || (window['lib'] = {}));
var $task=$('.task')
	//			var $submit=$('.submit')
	var $arrlist=[];		//任务列表
	
	init();
	/*
		//1.创建一个对像  push数组里面
		//2.把数据存到浏览器本地
		//3.然后再从本地中把数据取出来
		
		*/
	$task.on('submit',function(ev){
		ev.preventDefault();		//阻止默认行为，表单提交
		var $obj={};
		
		$obj.content=$task.find('input').eq(0).val();
	//				console.log($obj) 
		if(!$obj.content) return;
		addTask($obj);
		createHtml();
		$task.find('input').eq(0).val(null);		//清空input输入
	
	});
	
	function init(){
		$arrlist=store.get('data')||[];	//从本地中获取数据并赋给数组，保证数据刷新后依然保留
		createHtml();
		refreshStore();
		taskDetails();
		
	}
	
	//把对象push到数组里边
	function addTask(obj){	
		$arrlist.push(obj);
		store.set('data',$arrlist);		//将数组中的数据存放到本地
	}
	
	//生成HTML
	function createHtml(){
		var $taskList=$('.task_list');
		$taskList.html(null);           //清空html
		for (var i=0;i<$arrlist.length;i++ ) {
			var $iTem=bindHtml($arrlist[i],i);
			$taskList.append($iTem);
		}
		 bindDelete();
	}
	
	//绑定html
	function bindHtml(data,index){
		var $str='';
		
		$str='<li class="task_item" data-index="'+index+'">'+
				'<input type="checkbox" name="" id="" value="" />'+
				'<span class="textContent">'+data.content+'</span>'+
				'<span class="del">删除</span>'+
				'<span class="details">详细</span>'+
			'</li>';
		return $str;
	}
	
	
	/*---------------------------删除操作开始--------------------------------------*/
	/*点击操作*/
	 bindDelete()
	function bindDelete(){
		$('.del').on('click',function(){
			var $index=$(this).parent().data('index');
			removeTask($index);
		})
	}
	
	/*删除操作*/
	function removeTask(index){
		
		var onoff=confirm("你确定要删除吗")
		if(!onoff) return;
		$arrlist.splice(index,1)
		refreshStore();
	}
	
	/*更新本地存储*/
	function refreshStore(){
		store.set('data',$arrlist);
		createHtml();
	}
	/*---------------------------删除操作结束--------------------------------------*/
	
	/*----------------------------详细操作开始-------------------------------------*/
	/*详细弹窗操作*/
//	taskDetails()
	/*1、点击获取弹框 的index*/
	function taskDetails(){
		$('.details').on('click',function(){
			var $index=$(this).parent().data('index');
			addDetails($arrlist[$index]);
		})
		
	}
	
	/*2、生成详细弹框*/
	function addDetails(data){
		var $str='<div class="task_details">'+
					'<div class="task_detail_mask">'+
//						'<h4 class="content">'+data.content+'</h4>'+
						'<input type="text" name="reset" id="reset" value="" style="display: none;"/>'+
//						'<textarea name="" rows="10" cols="40" class="tail">'+(data.tail||"")+'</textarea>'+
						'<div class="remind">'+
							'<label for="datetime">提醒时间</label>'+
							'<input type="text" id="datetimepicker" class="datetime" id="datetime" value="'+(data.datetime || "")+'"/>'+
						'</div>'+
						'<button class="update">更新</button>'+
						'<button class="close">X</button>'+
					'</div>'+
				'</div>';
		$('#container').append($str);
		removeDetails();
		taskDetailMask();
	}
	/*删除弹框*/
	function removeDetails(){
		$('.close').click(function(){
			$('.task_details,task_detail_mask').remove();
//			console.log(222)
		})
	}
/*--------------------------------------详细弹窗及关闭操作完成-----------------------------------------------------*/



/*--------------------------------------对弹窗内部详细的更新操作start----------------------*/
	/*
	 //思路:详细提交
     1.task_list[
     {content:1,datail:"好好学习",time:"2017/08/09 11:23"},
     {content:1},
     {content:1}
     ]

    //1.点击更新  获取index
    //2.新建一个对像  newobj={};
    //newobj.content=标题
    //newobj.dateil=input.val();
    //newobj.time=input.val();

    //task_list[index] = newobj

    //不行
    //$.extend();
	 */
	
	function taskDetailMask(){
    	$('.update').click(function(ev){
    		ev.preventDefault();
    		var $index=$(this).parent().data('index');
    		var $newObj={};
    		$newObj.content=$(this).find('.content').text();
    		$newObj.tail=$(this).find('.tail').val();
    		$newObj.datetime=$(this).find('.datetime').val();
    		
    		upDate($newObj,$index);		//更新数据		
    		$('.task_details,task_detail_mask').remove();
    		console.log($index)
    	})
    }
 	upDate();
    function upDate(newobj,index){
    	console.log(newobj)
    	$arrlist[index]=newobj;
    	store.set('data',$arrlist);
    	addDetails($arrlist[index])
    }
	
	/*点击更新*/
	/*function upClick(){
		$('.update').click(function(){
			$('.task_details,task_detail_mask').remove();
		})
	}*/
	
	
	
	
	
	
	

    
  
    /*双击修改文字*/
// function doubleClick(){
// 	
// }
   

/*时间插件的获取*/
$.datetimepicker.setLocale('ch');
$('#datetimepicker').datetimepicker();
	
    
   
    
    

   
   
    
		
		

	