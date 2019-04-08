/**
 * 推送
 * 
 * @author 我贼帅
 * @data 2018-10-15
 */

mui.plusReady(function(){
	console.log("tetet");
	plus.push.addEventListener('receive', function(msg) {								
			var data = JSON.parse(msg.payload);
			//this.lineArray[2].hasDot=true;
			mui.toast(data.operation+"1123", {duration: 'long', type: 'div'});
			switch(data.operation){
				case "ad":
					this.lineArray[3].hasDot=true;
					mui.toast(where, {duration: 'long', type: 'div'});
					//createLocalMsg("有新广告");
					break;
				case "msg":
					this.lineArray[1].hasDot=true;
					//createLocalMsg("您有新消息");
					mui.toast(where, {duration: 'long', type: 'div'});
					break;
			}
	});
	

	function setDot(i){
		i.hasDot=true;
	}
});


