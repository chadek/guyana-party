var PLOTBYID = PLOTBYID || (function(){

	var _args = {};

	function loadInfo(organizData){

		console.log("/file/"+organizData.logo);
		var div =document.createElementById("div");
		div.style = "background: url('/file/"+ organizData.logo +"'); background-size: cover; background-position: center; height: 30vh; text-align: center; display: flex; align-items: center; justify-content: center;"
		var src = document.getElementById("logo");
		src.appendChild(div);

		document.getElementById("name").innerHTML = organizData.name;

		var typeOrga = '<i class="fi-torsos-all-female"></i>';
		document.getElementById("type") = typeOrga + organizData.type;
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