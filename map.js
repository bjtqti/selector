window.onload=function(){
	var wrap = document.getElementById('selector');
	var selector = new Selector(wrap,'湖南省');
	selector.showmap();
	document.querySelector('.submit').onclick=function(){
		var keyword = selector.getSeleted().pop().name;
		selector.searchByStationName(function(point){
			alert('save ok:'+point)
		})
	};
}
