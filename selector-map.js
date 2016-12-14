// import data from 'region.json'

/**
 *  省市区三级联动
 *
 *  @param DomElement container
 *  @param String arg1 省辖市
 *  @param String arg2 市、县
 *  @param String arg3 区域
 *
 */
function Selector(container,arg1,arg2,arg3){
	this.container= container;
	this.data =  window.area_data||[];
	this.selected = [];
	this.init([arg1,arg2,arg3]);
}

/**
 * 初始化
 */
Selector.prototype.init = function(options){
	var selected = [];
	options.forEach(function(item){
		selected.push({name:item,id:0})
	});
	this.selected = selected;
	this.createProvence();
	this.createCity();
	this.createDistrict();
}
 

/**
 * 创建选项
 * @param Array data 城市数据
 * @param String init 城市名
 */
Selector.prototype.createOptions = function(data,init){
	var result = {};
	var options = document.createDocumentFragment();
	if(!data || data.length<1){
		var option = document.createElement('option');
		option.text = '请选择';
		option.value="";
		options.appendChild(option);
	}else{
		for(var i=0;i<data.length;i++){
			option = document.createElement('option');
			option.text=data[i].value;
			option.value = data[i].id;
			if(data[i].value===init){
				result.id=data[i].id;
				option.selected=true;
			}
			options.appendChild(option);
		}
	}
	result.items = options;
	return result;
}


/**
 * 切换省
 * @param EventObject e 事件对象
 */
Selector.prototype.handleChangeProvence=function(e){
	var id = e.target.value;
	var index = e.target.selectedIndex;
	var name = e.target.options[index].text;
	this.selected[0] = {id:id,name:name}
	this.selected[1]={};
	this.selected[2]={};
	this.createCity();
	this.createDistrict();
	this.showmap();
}

/**
 * 切换市
 * @param EventObject e 事件对象
 */
Selector.prototype.handleChangeCity=function(e){
	var id = e.target.value;
	var index = e.target.selectedIndex;
	var name = e.target.options[index].text;
	this.selected[1]={id:id,name:name};
	this.selected[2]={};
	this.createDistrict();
	this.showmap();
}

/**
 * 切换区
 * @param EventObject e 事件对象
 */
Selector.prototype.handleChangeDistrict=function(e){
	var id = e.target.value;
	var index = e.target.selectedIndex;
	var name = e.target.options[index].text;
	this.selected[2] = {id:id,name:name};
	this.showmap(name);
}

/**
 * 获取省的数据
 */
Selector.prototype.getProvenceData=function(){
	return this.data;
}

/**
 * 获取市的数据
 */
Selector.prototype.getCityData=function(){
	var data = this.data;
	var id = this.selected[0].id;
	for(var i=0;i<data.length;i++){
		if(data[i].id===id){
			return data[i].children;
		}
	}
	return false;
}

/**
 * 获取区的数据
 */
Selector.prototype.getDistrictData=function(){
	var data = this.getCityData();
	var id = this.selected[1].id;
	for(var i=0;i<data.length;i++){
		if(data[i].id===id){
			return data[i].children;
		}
	}
	return false;
}

/**
 * 创建省的下拉选项
 */
Selector.prototype.createProvence=function(){
	var data = this.getProvenceData();
	var provence = this.container.children[0];
	var name = this.selected[0].name;
	var options = this.createOptions(data,name);
	this.clearItems(provence);
	provence.appendChild(options.items);
	this.selected[0].id = options.id || data[0].id;
	this.selected[0].name = name || data[0].value;
	provence.onchange=this.handleChangeProvence.bind(this);
}

/**
 * 创建市的下拉选项
 */
Selector.prototype.createCity=function(){
	var data = this.getCityData();
	var city = this.container.children[1];
	var name = this.selected[1].name;
	var options = this.createOptions(data,name);
	this.clearItems(city);
	city.appendChild(options.items);
	this.selected[1].id = options.id ||data[0].id;
	this.selected[1].name = name||data[0].value;
	city.onchange = this.handleChangeCity.bind(this);
}

/**
 * 创建区的下拉选项
 */
Selector.prototype.createDistrict=function(){
	var data = this.getDistrictData();
	var district = this.container.children[2];
	if(!data){
		district.style.display='none';
	}else{
		var name = this.selected[2].name;
		var options = this.createOptions(data,name);
		this.clearItems(district);
		district.appendChild(options.items);
		district.style.display='block';
		this.selected[2].id = options.id||data[0].id;
		this.selected[2].name=name||data[0].value;
	}
	district.onchange = this.handleChangeDistrict.bind(this);
}

/**
 * 清除下拉项
 */
Selector.prototype.clearItems = function(node){
	if(!node){
		return false;
	}
	node.innerHTML='';
}

/**
 * 获取当前所选项的内容
 * @return Array [{name,id},...]
 */
Selector.prototype.getSeleted = function(){
	var selected = [];
	this.selected.forEach(function(item){
		if(item.name&&item.id){
			selected.push(item);
		}
	})
	return selected;
}

/**
 * 获取当前位置的经纬度
 * @return Array [{name,id},...]
 */
Selector.prototype.searchByStationName = function (fn) {
	var keyword  = this.getSeleted().pop().name; 
	var map = this.map ? this.map : this.getmap();
	var localSearch = new BMap.LocalSearch(map);
	localSearch.setSearchCompleteCallback(function(searchResult) {　　　　
		var poi = searchResult.getPoi(0);　　　　
		var point = poi.point.lng + "," + poi.point.lat; //获取经度和纬度　
		fn && fn(point);
	});　　
	localSearch.search(keyword);
}

/**
 * 在地图上显示
 */
Selector.prototype.showmap = function (keyword) {
	// 百度地图API功能
	if(!keyword){
		keyword  = this.getSeleted().pop().name; 
	}
	var map = this.map ? this.map : this.getmap();
	var localSearch = new BMap.LocalSearch(map);
	map.clearOverlays();//清空原来的标注
	localSearch.setSearchCompleteCallback(function(searchResult) {　　　　
		var poi = searchResult.getPoi(0);　　　　
		var new_point = new BMap.Point(poi.point.lng, poi.point.lat); 
		var marker = new BMap.Marker(new_point);  // 创建标注，为要查询的地址对应的经纬度
        map.addOverlay(marker);
		var point = poi.point.lng + "," + poi.point.lat; //获取经度和纬度　
		map.centerAndZoom(new_point, 16);  // 初始化地图,设置中心点坐标和地图级别
		map.panTo(new_point);
	});　　
	//map.centerAndZoom(keyword, 11);
	localSearch.search(keyword);

}

/**
 * 获取地图实例
 */
Selector.prototype.getmap = function(){
	var map = new BMap.Map("container");
	this.map = map;
	return map;
}