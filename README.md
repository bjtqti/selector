# selector
省市区三级联动
## 快速度使用
```javascript
  //默认设置，只需传入一个容器节点
        new Selector(document.getElementById('div'));
  //指定默认地址
        new Selector(document.getElementById('div')，
  					provence:'湖南省',
					city:'株洲市',
					district:'炎陵县'
				}）
```
### 
默认是使用本地json数据，如果要用服务器数据，请参考源码进行修改数据获取方式
