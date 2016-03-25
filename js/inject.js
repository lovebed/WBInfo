function intToIp(INT) {
	if (INT < 0 || INT > 0xFFFFFFFF) {
		throw ("The number is not normal!");
	}
	return (INT >>> 24) + "." + (INT >> 16 & 0xFF) + "." + (INT >> 8 & 0xFF) + "." + (INT & 0xFF);
}

var lastid = 0;
var reqnum = 50;
var userId;
var retObj = {};
var NPAPI = {
	fetch: function(url, event, data, type) {
		$.ajax({
			type: 'GET',
			dataType: 'json',
			data: data,
			url: url,
			success: function(res) {
				if (res.errCode == 0) {
					retObj.QQNick = res.data.usermeta.nick;
					if(res.data.usermeta.wbuserinfo.length != 0){
						retObj.weiboId = res.data.usermeta.wbuserinfo.name;
						retObj.weiboNick = res.data.usermeta.wbuserinfo.nick;
					}
					retObj.IPLength = res.data.comments.length;
					var retArray = new Array();
					for (var i = res.data.comments.length-1; i >= 0; i--) {
						retArray.push(intToIp(res.data.comments[i].ip));
					};
					retObj.IPArray = retArray;
					// console.log(retObj);
					chrome.extension.sendMessage({PageInfo: retObj}, function(response) {
	    				// console.log(response.farewell);
					});
				} else {
					$("body").trigger("np-error", res.errCode);
				}
			},
			error: function(res) {
				// console.log(res);
			}
		});
	},
	usercomment: function() {
		var url = "http://coral.qq.com/user/" + userId + "/comment?lastid=" + lastid + "&pageflag=1&reqnum=" + reqnum;
		if (top.registerCoralEvent) { // 2013.12.18 by chuangwang
			if (top.registerCoralEvent.site) {
				url = "http://" + top.registerCoralEvent.site + ".coral.qq.com/user/" + userId + "/comment?lastid=" + lastid + "&pageflag=1&reqnum=" + reqnum;
			}

		}
		this.fetch(url, "np-user-comment-success", {}, "GET");
	}
};

var useridEle = document.getElementById("np-pop-iframe");

if (useridEle != null) {
	userId = useridEle.getAttribute("data-id");
	NPAPI.usercomment();
	// console.log(userId);
}else{
	retObj.status = "Not Correct Page!";
	chrome.extension.sendMessage({PageInfo: retObj}, function(response) {
		// console.log(response.farewell);
	});
};