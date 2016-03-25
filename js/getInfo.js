function btn_test(){
	chrome.tabs.executeScript({
		code: 'document.body.style.backgroundColor="red"'
	});
}

function btn_getId(){
	chrome.tabs.executeScript(null,{file: "js/jquery-1.11.2.min.js"});
	chrome.tabs.executeScript(null,{file: "js/inject.js"});
}

Array.prototype.unique = function(){
	var json = {};
	for(var i = 0; i < this.length; i++){
		if(!json[this[i]]){
			json[this[i]] = 1;
		}else{
			json[this[i]] += 1;
		}
	}
	return json;
}

var pageInfo;
var resOK = {
    farewell: "background send response back..."
};

var resError = {
    farewell: "background hasError!"
};

window.onload = function(){
	var idbtn = document.getElementById("getId");
	if (idbtn) {
		idbtn.addEventListener("click", btn_getId, true);
	};

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		// console.log(request.PageInfo);
		pageInfo = request.PageInfo;
		if (request != null && pageInfo.status == undefined){
			document.getElementById("infoArea").style.display="";
			// var mainContent = document.getElementById("testarea");
			// mainContent.innerHTML = JSON.stringify(pageInfo);
			var QQnickContent = document.getElementById("QQnick");
			QQnickContent.innerHTML = pageInfo.QQNick;
			var weiboInfoContent = document.getElementById("WeiboInfo");
			if (pageInfo.weiboId != undefined) {
				var weiboNode = document.getElementById("weiboLink");
				weiboNode.attributes["href"].value = "http://t.qq.com/" + pageInfo.weiboId;
				//target = "blank" 
				var linkTarget = document.createAttribute("target");
				linkTarget.value = "blank";
				weiboNode.setAttributeNode(linkTarget);

				weiboInfoContent.innerHTML = pageInfo.weiboNick;
			}else{
				weiboInfoContent.innerHTML = "NO Weibo!";
			};

			var IPInfoContent = document.getElementById("IPInfo");
			var IPDisplay = "";
			var IPJson = pageInfo.IPArray.unique();
			// console.log(IPJson);
			for(var oneIPInfo in IPJson){
				IPDisplay += oneIPInfo + '<span class="badge float">'+ IPJson[oneIPInfo] +'</span><br>';
			}
			IPInfoContent.innerHTML = IPDisplay;
			// sendResponse(resOK);
		}else{
			document.getElementById("statusarea").style.display="";
			// sendResponse(resError);
		}
	});
}