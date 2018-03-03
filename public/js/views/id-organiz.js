var PLOTBYID = PLOTBYID || (function(){

	var _args = {};

	function loadInfo(organizData){

		console.log("/file/"+organizData.logo);
		var div =document.createElement("div");
		div.style = "background: url('/file/"+ organizData.logo +"'); background-size: cover; background-position: center; height: 30vh; text-align: center; display: flex; align-items: center; justify-content: center;"
		var src = document.getElementById("logo");
		src.appendChild(div);

		document.getElementById("name").innerHTML = organizData.name;

		var type = document.getElementById("type");
		var texttype = document.createTextNode(organizData.type);
		type.appendChild(texttype);
	}

	return {
		init : function(Args){
			_args = Args;
		},
		plotOrganiz : function(){
			queryUrl = "/organization/id/"+_args[0]+"/js";
			console.log(queryUrl);
			$.getJSON(queryUrl, function(external){
				console.log(external);
				loadInfo(external);
			});
		}
	};
}());