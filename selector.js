// import data from 'region.json'

/**
 *  省市区三级联动
 *
 *  @param DomElement container
 *
 */
function Selector(container,option){
	this.container= container;
	this.data =  window.area_data||[];
	this.config = option||{};
	this.init();
}

/**
 * 初始化
 */
Selector.prototype.init = function(){
	this.createProvence();
	this.createCity();
	this.createDistrict();
}
 

/**
 * 创建选项
 * @param Array data 城市数据
 * @param String init 默认城市名
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
	this.provenceId = id;
	this.createCity();
	this.createDistrict();
}

/**
 * 切换市
 * @param EventObject e 事件对象
 */
Selector.prototype.handleChangeCity=function(e){
	var id = e.target.value;
	this.cityId = id;
	this.createDistrict();
}

/**
 * 切换区
 * @param EventObject e 事件对象
 */
Selector.prototype.handleChangeDistrict=function(e){
	var id = e.target.value;
	this.districtId = id;
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
	var id = this.provenceId;
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
	var id = this.cityId;
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
	var name = this.config.provence;
	var options = this.createOptions(data,name);
	this.clearItems(provence);
	provence.appendChild(options.items);
	if(data){
		this.provenceId = options.id || data[0].id;
	}
	this.data = data;
	provence.onchange=this.handleChangeProvence.bind(this);
}

/**
 * 创建市的下拉选项
 */
Selector.prototype.createCity=function(){
	var data = this.getCityData();
	var city = this.container.children[1];
	var name = this.config.city;
	var options = this.createOptions(data,name);
	this.clearItems(city);
	city.appendChild(options.items);
	if(data){
		this.cityId = options.id ||data[0].id;
	}
	city.onchange = this.handleChangeCity.bind(this);
}

/**
 * 创建区的下拉选项
 */
Selector.prototype.createDistrict=function(){
	var data = this.getDistrictData();
	var district = this.container.children[2];
	var name = this.config.district;
	var options = this.createOptions(data,name);
	this.clearItems(district);
	district.appendChild(options.items);
	if(!data){
		district.style.display='none';
	}else{
		district.style.display='block';
		this.districtId = options.id||data[0].id;
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

Selector.prototype.getDistrictId = function(){
	//console.log(this.districtId)
	return this.districtId;
}