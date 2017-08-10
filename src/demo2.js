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
			var $index=$arrlist.length-1-i
			var $iTem=bindHtml($arrlist[i],$index);
			$taskList.prepend($iTem);
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
	
	/*详细弹窗操作*/
	taskDetails()
	/*1、点击获取弹框 的index*/
	function taskDetails(){
		$('.details').on('click',function(){
			var $index=$(this).parent().data('index');
//			console.log($index)
//			console.log(addDetails($arrlist[]))
			addDetails($arrlist[$arrlist.length-1-$index],$index)
			
		})
	}
	
	/*2、生成弹框*/
	function addDetails(data,index){
		var $str='<ul class="task_details">'+
					'<li class="task_detail_mask">'+
						'<h4 class="title">'+(data.content || "")+'</h4>'+
						'<input type="text" name="reset" id="reset" value="" style="display: none;"/>'+
						'<textarea name="" rows="10" cols="40" class="content">'+(data.title || "")+'</textarea>'+
						'<div class="remind">'+
							'<label for="updatetime">提醒时间</label>'+
							'<input type="text" class="updatetime" id="updatetime"/>'+
						'</div>'+
						'<button class="update">更新</button>'+
						'<button class="close">X</button>'+
					'</li>'+
				'</ul>';
		$('#container').append($str);
		removeDetails();
		taskDetailMask(index);
		
	}
	/*删除弹框*/
	function removeDetails(){
		$('.close').click(function(){
			$('.task_details,task_detail_mask').remove();
//			console.log(222)
		})
	}
	
	 function taskDetailMask(index){
    	$('.task_detail_mask').click(function(ev){
    		ev.preventDefault();
    		var $newObj={};
    		$newObj.title=$(this).find('.title').text();
    		$newObj.content=$(this).find('.content').val();
    		
    		upDate($newObj,index);		//更新数据		
    		upClick();
    	})
    }
    
    function upDate(newobj,index){
    	$arrlist[index]=newobj;
    	store.set('data',$arrlist);
    	addDetails($arrlist[index])
    }
	
	/*点击更新*/
	function upClick(){
		$('.update').click(function(){
			$('.task_details,task_detail_mask').remove();
		})
	}
	
    /*双击修改文字*/
   function doubleClick(){
   	
   }
   
	
	/*提醒时间*/
	/*$.datetimepicker.setLocale('en');

	$('#updatetime').datetimepicker({
		dayOfWeekStart:1,
		lang:'en',
		disabledDates:['1986/01/08','1986/01/09','1986/01/10'],
		startDate:	'1986/01/05',
		value:'2015/04/15 05:03',
		step:10
	});*/
	
	
	/*详细提交*/
    /*//1.task_list[
     {content:1,datail:"好好学习",time:"2017/08/09 11:23"},
     {content:1},
     {content:1}
     ]*/

    //1.点击更新  获取index
    //2.新建一个对像  newobj={};
    //newobj.content=标题
    //newobj.dateil=input.val();
    //newobj.time=input.val();

    //task_list[index] = newobj

    //不行
    //$.extend();
    
   
    
    

   
   
    
		
		

	