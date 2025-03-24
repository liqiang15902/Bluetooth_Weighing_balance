<template>
	
	<view class="content-box" style="padding-left:20rpx;position: relative;">
		<view>
			
		<view style="display: flex;align-items: center;padding:0px 10px 0 40px;position: relative;margin-top:60px">
			<label class="" style="font-size: 20rpx;">样品短号 <text style="margin:0 4px">:</text> </label>
			<input type="text" v-model="shortordno" 
				style="flex: 1;border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;margin-right:65px;" />
				
		</view>
		
		<view style="position: absolute;width: 100%;">
			<view class="" style="margin:20px 0 10rpx 23px;align-items: center;display: flex;">
				 <label>请选择时间<text style="margin:0 4px">:</text></label>
				 <view >
				 	<uni-datetime-picker v-model="datetimerange" type="datetimerange" rangeSeparator="至" @change="changedate"/>
				 </view>				
			</view>	
			<view class="" style="margin: 10rpx 0;align-items: center;justify-content: space-evenly;display: flex;">
				<button type="default" @click="lookRemainSpace" style="color:#fff;background-color: #303962;">查看剩余空间</button>
				<button type="default" @click="delete14DAYlog" style="color:#fff;background-color: #303962;">删除14天前的数据</button>
			</view>	
			<view class="" style="margin: 10rpx 0;align-items: center;justify-content: space-evenly;display: flex;">
				<button type="default" @click="lookForTable" style="color:#fff;background-color: #303962;">查询</button>
				<button type="default" @click="saveRow" style="color:#fff;background-color: #303962;">保存</button> 
				<button type="default" @click="showRow" style="color:#fff;background-color: #303962;">隐藏列</button>
				
			</view>
				
			<view class="c-column" style="width: 100%;height: 50vh;"> 
						 
					<template  v-if="isShow">
						<view style="margin: 15rpx 0;">
					<checkbox-group name="" @change="changColumns">
						<label v-for="(column,index) in columns2" :key="index">
							<checkbox v-model="column.property" :key="index" style="margin: 0 10rpx;">{{ column.title }}</checkbox>
						</label>
					</checkbox-group>								
							 </view>
			        </template>
						
				 
				<c-table class="c-filling" ref="table" :initTable="initTable" @tableEvents="tableEvents"
					@slotEvents="slotEvents" @initComplete="initComplete"  />
			</view>

		</view>
	</view>
	</view>
</template>

<script>
	

	import moment from '../../utils/moment.js'
	export default {
		
		data() {
			return {
				webserve:this.$webserve_gol,
				webaccount:'SYSADM',
				webpassword:'XF-,8>TJ$PN,',
				blueToothName:'',
				datetimerange:[],
				startTime:'',
				endTime:'',
				shortordno:'',
	
				createBy: '',
				strJson: {},			// 保存到lims的 Json 格式
				isLogin: false,   		// 是否登录
				
				
				isShow:false,
				
				lastTime: 0,
				applicationNumberid: '', 				//样品编号、
				applicationNumberidDUANHAO:'',			//短号	
				applicationNumberidPIHAO:'',			// 批号
				equipmentName: '', 						// 设备
				range: [],       						//样品号列表集合 【000001，000002】
				range1: [],        						// 组别 列表
			
				
				value: '',
				value1: '',
				data: [],		
				remark: '',
				ypname: '',        	// 样品名称，如（test） 
				zbname: '',         // 组别名称  如（食品无机1组） 
				zubie: '',     		// 组别
				dept: '',     		// 实验室对应的编号。
				shortNO:'',			//样品号
				columns2:[],		// 表格行 列表
				landscape:'',  		// 横竖屏 结果
				checkedRow:[],   	// 被选中的行
				rowIndex:-1,
				chooseColumn:null,
				initTable: {         // 初始化表格信息
					height: "850px",
					resizable: true,
					border: true,
					showOverflow: false,
					scrollY:{
						enabled:false
					},
					editConfig: {
						trigger: "click",
						mode: "cell",
						showUpdateStatus: true,
						enabled: true,
						showIcon: false
					},
					rowConfig:{
						isCurrent:true
					},
					columns: [

						{
							field: "shortordno",
							minWidth: 80,
							title: "样品短号",
						},
						{
							field: "servgrp",
							width: 80,
							title: "组别",
						},
						{
							field: "testno",
							width: 80,
							title: "测试",
							showOverflow: true,						
						},
						{
							field: "methodname",
							title: "检测方法",
							showOverflow: true,
							maxWidth:180,
							minWidth:80

						},
						{
							field: "date",
							title: "时间",
							showOverflow: true,
							maxWidth:180,
							minWidth:80
						},
						{
							field: "submitResult",
							title: "提交结果",
							showOverflow: true,
							maxWidth:180,
							minWidth:80
						},
						// {
						// 	field: "weightdemand",
						// 	title: "称量要求",
						// 	maxWidth:180,
						// 	minWidth:80
						// },
						{
							title: `主样品质量1`,
							width: 80,
							children: [{
									field: "orderweight_1",
									title: "质量",
									width: 60,
									editRender: {
										name: "input",
										props: {
											type: "input"
										}
									}
								},
								{
									field: "testcodes_1",
									title: "▲",
									showOverflow: true,
									width: 50,
									editRender: {
										placeholder: '▲',
										name: "$select",
										props: {
											type: 'float',
											digits: 2,
											min: 0,
											controls: false,
											multiple: true
										},
										options: [
										]
									},

								},
							],

						},
												
						{
							field: "addOPtion",
							title: '操作',
							width: 80,
							slots: {
								default: 'operate'
							},
							fixed: "right"
						}

					],
					loading: false, //加载遮罩
					//注册表格事件列点击事件，行点击事件
					initEventsList: ["header-cell-click", "cell-click"],
					// initEventsList: ["header-cell-click"],
					//插槽内容
					initSlotString: `
					<template #operate="{ row }">
						<vxe-button @click="slotEvents(row)">提交</vxe-button>
					</template>`
				},
			}
		},
		onLoad() {
						
			let currentBit = this.BytesCount(uni.getStorageSync('log'))
			let remainBit = (10 * 1024 * 1024 - currentBit) / 1048576
			
			let about = remainBit.toString().substr(0,3)
			console.log(about,'about')
			if(remainBit <= 1){
				uni.showModal({
					title: '提示',
					content: `内存剩余约${about}M`,
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
			
		
			
		},
		onShow(){		
			let that = this
		 uni.onWindowResize(res => {
		      // portrait 竖屏 landscape 横屏   将状态值存储到这个this.landscape变量中 
			  this.landscape = res.deviceOrientation
		     if(this.landscape == 'landscape'){
				// 横屏
				that.$nextTick(function() {					
					that.$refs.table.setTableProps({
						loading: false,
						height:'480px'
					})
				})	
			 }else {
				 // 竖屏
				that.$nextTick(function() {
					that.$refs.table.setTableProps({
						loading: false,
						height:'850px'
						
					})
				console.log(that.initTable.height)
				})
			 }	
				  
		    });
		},
			
		//第一次加载时调用
		
		created() {
			let that = this
			const blueToothName = uni.getStorageSync('blueToothName');
			this.blueToothName = blueToothName
			
			//初始化设备
			uni.getStorage({
				key: 'laboratory',
				success: function(res) {
					// console.log(res.data);				
					that.$nextTick(function() {
						that.dept = res.data
					})
				}
			})

			uni.getStorage({
				key: 'equipmentName',
				success: function(res) {
					// console.log(res.data);					
					that.$nextTick(function() {
						that.equipmentName = res.data
					})
				}
			})

			uni.getStorage({
				key: 'createBy',
				success: function(res) {
					// console.log(res.data);					
					that.$nextTick(function() {
						that.createBy = res.data
					})
				}
			})
			
		
			uni.getStorage({
				key: 'webserve',
				success: function(res) {
					console.log(res.data);				
					that.$nextTick(function() {
						that.webserve = res.data
					})
				}
			})
			uni.getStorage({
				key: 'account',
				success: function(res) {
					console.log(res.data);				
					that.$nextTick(function() {
						that.webaccount = res.data
					})
				}
			})
			uni.getStorage({
				key: 'password',
				success: function(res) {
					console.log(res.data);				
					that.$nextTick(function() {
						that.webpassword = res.data
					})
				}
			})

			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
		},
		methods: {
			// 字节计算
			BytesCount(str){
				let bytesCount = 0;
				for (var i = 0; i < str.length; i++)
				{
				  var c = str.charAt(i);
				  if (/^[\u0000-\u00ff]$/.test(c))   //匹配双字节 ,
				  {
				  bytesCount += 1;
				  }
				  else
				  {
				  bytesCount += 2;
				  }
				}
				return bytesCount
			},
			//查看剩余的 缓存空间
			lookRemainSpace(){ 	
				let currentBit = this.BytesCount(uni.getStorageSync('log'))
				let remainBit = (10 * 1024 * 1024 - currentBit) / 1048576
				console.log(remainBit,'remainBit')
				
				let about = remainBit.toString().substr(0,3)
				console.log(about,'about')
				uni.showModal({
					title: '提示',
					content: `内存剩余约${about}M`,
					success: function (res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
			},
			// 删除14天之前的缓存
			delete14DAYlog(){
				
				uni.showModal({
					title: '提示',
					content: '确定删除14天之前的缓存吗？',
					success:  (res) =>{
						if (res.confirm) {
							let localLog = JSON.parse(uni.getStorageSync('log'))
							localLog = localLog.filter(item =>{
								return moment(moment().subtract(14, "day").format("YYYY-MM-DD HH:mm:ss")).valueOf() <= moment(item.date).valueOf()
							})
							
							// 获得的删除14天前的数据再次缓存
							localLog = JSON.stringify(localLog)
							uni.setStorageSync('log',localLog)
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
					
			},
			changedate(e){
				this.startTime = e[0]
				this.endTime = e[1]
			},
			
			// 表格加载完成回调函数
			initComplete() {	
				this.$refs.table.setTableProps({
					loading: false,
				})
			
			},
			changColumns(e){
				// console.log(e) 
				let that = this
				that.initTable.columns.forEach(item =>{
					if(e.target.value.includes(item.field)){
						console.log(item)
						item.visible = false
						console.log(item)
						console.log(that.initTable.columns)
						
					}else {
						item.visible = true
						that.$nextTick(function() {
							that.$refs.table.setTableProps({
								loading: false,
								columns: that.initTable.columns,
							})						
						})
					}									
				})	
			},
			// 展现列。
			showRow() {     
				console.log(this.isShow)
				this.isShow = !this.isShow	
				let that = this
				that.columns2 = []
				this.$refs.table.callMethods("getColumns").then(res =>{			
				console.log(res) 
				
				that.$nextTick(function(){
				res.forEach(item =>{					
						if(item.property == 'shortordno' || item.property == 'orders' || item.property == 'servgrp'
						 || item.property == 'methodname' ||item.property == 'weightdemand'){
							that.columns2.push(item)
						}
					})
					console.log(that.columns2)
				})				 
			})
			},
			
			// 中文转为Unicode 码 的方法
			toUnicode(chineseStr) {

				let unicodeStr = '';
				for (let i = 0, iLength = chineseStr.length; i < iLength; i++) {
					unicodeStr += '\\u' + chineseStr.charCodeAt(i).toString(16);
				}
				return unicodeStr;
			},
			async saveRow() { 
				let that = this
				let validateRES = await this.$refs.table.callMethods("validate")
				// 判断校验是否通过
				if (validateRES != undefined) return 
				uni.showToast({
					title: "校验通过"
				})
				this.$refs.table.callMethods("getData").then(res => {
					// console.log(res)
					
					res.forEach(itm => {
						for (let key in itm) {
							if(key.startsWith('testinfo')){
								this.$delete(itm,key)
								this.$forceUpdate()
							}
							if (Array.isArray(itm[key]) && key.startsWith('testcodes')) {
								this.$set(itm, key, itm[key].toString())
							}else if((typeof itm[key]=='string')&&itm[key].constructor==String && key.startsWith('testcodes')){
								let tempKer = itm[key].replace(/,/ig,'').replace(/(.{8})/g,"$1,");
								this.$set(itm, key, tempKer)
							}
						}
					})
				
					const blueToothName = uni.getStorageSync('blueToothName')
					this.blueToothName = blueToothName
					console.log(blueToothName,"蓝牙名")
					this.strJson = {
						"dept": this.dept,
						"eqid": this.blueToothName,   // blueToothName OSTRAN
						"createby": this.createBy,
						"weight": res,
					}
					
					this.strJson.weight.forEach(element =>{
						
						this.$delete(element,'methodname')
						this.$delete(element,'_X_ID')
						this.$delete(element,'testno')
						this.$delete(element,'samplename')
						this.$delete(element,'date')
					})
					console.log(this.strJson,'this。json')					
					
				
					this.strJson = JSON.stringify(this.strJson);
					console.log(this.strJson,'this.strJson_string')
					
								
					console.log(this.webserve,this.webaccount,this.webpassword)
					uni.showLoading({
						title:'保存中',
						icon:'loading',
						mask:true
					})
					// 使用同步 本地缓存 
					// return
					//提交到 lims 接口
					uni.request({
						method: "post",
						sslVerify: false,
						url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
						contentType: "application/json",
						header: {
							'Content-Type': 'application/soap+xml; charset=utf-8'
						},
						data: `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
            <actionID>CTI.SaveOrdersWeightNew</actionID>
            <parameters xsi:type="xsd:groups">
				<anyType xsi:type="xsd:string">${this.strJson}</anyType>
            </parameters>
           <UserName>${this.webaccount}</UserName>
           <Password>${this.webpassword}</Password>
        </RunActionDirect>
    </soap12:Body>
</soap12:Envelope>`,
						success: (res) => { 
							uni.hideLoading()
							console.log(res)
							let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
							console.log(str1)
							let str2 = res.data.indexOf('</RunActionDirectResult>')
							let str = res.data.substring(str1 + 45 ,str2)
							// console.log(str,1111)
							str = eval('(' + str + ')')
							console.log(str.message,'gggggggggggg')
							console.log(str.result,'gggggggggggg')
							if (res.statusCode == 200) {
																
								if(str.result == true){
									uni.showToast({
										icon:'success',
										title: str.message,
										duration: 3000
									});
									setTimeout(()=>{
										that.lookForTable()
									},1000)
								}
								if(str.result == false){
									uni.showToast({
										icon:'error',
										title: str.message,
										duration: 3000
									});
								}
								
								
							} else if(res.statusCode == 500){
								uni.showToast({
									title: str.message,
									duration: 3000, //单位毫秒,
									icon: 'loading'
								});
							}
							else  {
								uni.showToast({
									title: '参数错误',
									duration: 2000, //单位毫秒,
									icon: 'loading'
								});
							}
						},
						fail: function(err) {
							uni.hideLoading()
							// that.lookForTable()
							console.log(err)
							uni.showToast({
								title: '请求失败！',
								duration: 2000, //单位毫秒，
								icon: 'loading'
							});
						}
					});
				

				})
			},
		 tableEvents(p) {	
				let that = this
				
				// console.log(p, 111111111111111111111); 
				if(p.eventsName == 'cell-click'){
					this.rowIndex = p.param.$rowIndex
					this.checkedRow = p.param.visibleData[p.param.$rowIndex]
					console.log(this.checkedRow)
				}
				// if(p.param.$rowIndex >= 0 || p.param.$rowIndex){
				// 	
				// }  
				
				// 点击头部 填充整列数据 
				if(p.eventsName == 'header-cell-click'){
					console.log('zoudaozhe')
					if(p.param.column.field && p.param.column.title.search('质量') != -1){
						//开始循环  data里的数据
						console.log('填充')
						this.$refs.table.callMethods("getData").then(res =>{
							console.log(res)
							let copynumber = ''
							res.forEach(item =>{
								for (let key in item) {
									
									// if(item[p.param.column.field] != '' && ){
									// 	console.log(item[p.param.column.field])
									// }
									if (item[p.param.column.field]) {
										// console.log(item[p.param.column.field])
										// this.$set(item, key, itm[key].toString())
										// console.log(item)
										copynumber = item[p.param.column.field]		
									}
									console.log(copynumber)
									that.$set(item, p.param.column.field, copynumber)
									
								}
							})
							console.log(res)
							that.$nextTick(function() {
								this.$refs.table.setTableProps({
									loading: false,
									data: res,
								})
							
							})
						})
						
					}
					if(p.param.column.title && p.param.column.title.search('主样品质量') != -1){
						console.log(p.param.column.title)
						let lastnum = p.param.column.title.substr(p.param.column.title.length - 1,1)
						console.log(lastnum)
						that.chooseColumn = {
							title: `主样品质量${lastnum}`,
							width: 80,
							children: [{
									field: `orderweight_${lastnum}`,
									title: "质量",
									width: 60,
									editRender: {
										name: "input",
										props: {
											type: "input"
										}
									}
								},
								{
									field: `testcodes_${lastnum}`,
									title: "▲",
									showOverflow: true,
									width: 50,
									editRender: {
										placeholder: '▲',
										name: "$select",
										props: {
											type: 'float',
											digits: 2,
											min: 0,
											controls: false,
											multiple: true
										},
										options: [
										]
									},

								},
							],
						}
					}
				}

				//新增天平数据  
				if (p.param.column.field && p.param.seq && p.param.column.title != '▲' && p.param.column.title.search('质量') !== -1) {
					console.log(p,'pppppppppppp')
					let _this = this;
					let curTime = new Date().getTime();
					let lastTime = _this.lastTapDiffTime;
					_this.lastTapDiffTime = curTime;
					//两次点击间隔小于500ms, 认为是双击
					let diff = curTime - lastTime;
					if (diff < 500) {
						console.log("双击")
						console.log(_this.lastTapTimeoutFunc)
						clearTimeout(_this.lastTapTimeoutFunc); 
					}else {
						console.log("dan击")
						_this.lastTapTimeoutFunc = setTimeout(function() {
							that.writeBLECharacteristicValue()
							setTimeout(() => {
								that.$refs.table.callMethods("getData").then(res =>{
									console.log(that.macValue,'没有处理的value')
									// that.macValue = that.macValue.replace(/\s*/g, "").replace('g', '').replace('SS', '')        旧的日志
									that.macValue = that.macValue.replace(/[^\d\.]/g, "")
										console.log(that.macValue)
										if (that.macValue == '') return
										// that.$set(that.data[p.param.seq - 1], p.param.column.field, that.macValue)
										that.$set(res[p.param.seq - 1], p.param.column.field, that.macValue)
										// console.log(res,'11111111111111111111111111111')
										that.$nextTick(function() {
											that.$refs.table.setTableProps({
												loading: false,
												data: res,
											})
										})
									})
								},1000)
						}, 500);
					}
				}

				// 选择备注
				if (p.param.column.field && p.param.seq && p.param.column.title == '▲') {
					// that.data = await that.$refs.table.callMethods("getData")
						console.log(that.data)
						console.log(p,'111111111111111111')
					// that.$refs.table.callMethods("getData").then(res =>{
					// console.log(res)	
						console.log(p.param.column.field, p.param.seq)
						console.log(that.data[p.param.seq - 1].testinfo_1)
						let testcodeData = that.data[p.param.seq - 1].testinfo_1 
						
															that.initTable.columns.find(item => {
																if (item.children) {
																	item.children[1].editRender.options = []
																	if ((item.children[1].field).search(
																		'testcodes') !== -1) {
																		let obj = {}
																		testcodeData.forEach(itm => {
																			obj = {
																				label: itm.testno,
																				value: itm.testcode
					 														}
																			item.children[1].editRender.options
																				.push(obj)
																		})
																	}
																}
															})
															console.log(that.initTable.columns)
															let obj = {};
															  let newcol = that.initTable.columns.reduce(function (item, next) {
															      obj[next.title] ? '' : obj[next.title] = true && item.push(next);
															      return item;
															    }, []);
															console.log(newcol,'111111111111111111111111111111111111111111111111111111111111111111111')
															that.$nextTick(function() {
															that.$refs.table.setTableProps({
																loading: false,
																columns: newcol
																
															})
																
															
														})
					}			

			},
			
		 slotEvents(p) {
			 let that = this
			 console.log(p,'pppppppp')
			 let res = []
			 res.push(p[0])
			 console.log(res,'sssssss')
			 res.forEach(itm => {
			 						for (let key in itm) {
			 							if(key.startsWith('testinfo')){
			 								this.$delete(itm,key)
			 								this.$forceUpdate()
			 							}
			 							if (Array.isArray(itm[key]) && key.startsWith('testcodes')) {
			 								this.$set(itm, key, itm[key].toString())
			 							}else if((typeof itm[key]=='string')&&itm[key].constructor==String && key.startsWith('testcodes')){
			 								let tempKer = itm[key].replace(/,/ig,'').replace(/(.{8})/g,"$1,");
			 								this.$set(itm, key, tempKer)
			 							}
			 						}
			 					})
			 				
			 					const blueToothName = uni.getStorageSync('blueToothName')
			 					this.blueToothName = blueToothName
			 					console.log(blueToothName,"蓝牙名")
			 					this.strJson = {
			 						"dept": this.dept,
			 						"eqid": this.blueToothName,   // blueToothName OSTRAN
			 						"createby": this.createBy,
			 						"weight": res,
			 					}
			 					
			 					this.strJson.weight.forEach(element =>{						
			 						this.$delete(element,'methodname')
			 						this.$delete(element,'_X_ID')
			 						this.$delete(element,'testno')
			 						this.$delete(element,'samplename')
			 					})
			 					console.log(this.strJson,'this。json')
			 					
			 									
			 					this.strJson = JSON.stringify(this.strJson);
			 					console.log(this.strJson,'this.strJson_string')
			 						
			 					console.log(this.webserve,this.webaccount,this.webpassword)
			 					uni.showLoading({
			 						title:'保存中',
			 						icon:'loading',
			 						mask:true
			 					})
			 					// 使用同步 本地缓存 
			 					// return
			 					//提交到 lims 接口
			 					uni.request({
			 						method: "post",
			 						sslVerify: false,
			 						url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
			 						contentType: "application/json",
			 						header: {
			 							'Content-Type': 'application/soap+xml; charset=utf-8'
			 						},
			 						data: `<?xml version="1.0" encoding="utf-8"?>
			 <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
			     <soap12:Body>
			         <RunActionDirect xmlns="http://www.starlims.com/webservices/">
			             <actionID>CTI.SaveOrdersWeightNew</actionID>
			             <parameters xsi:type="xsd:groups">
			 				<anyType xsi:type="xsd:string">${this.strJson}</anyType>
			             </parameters>
			            <UserName>${this.webaccount}</UserName>
			            <Password>${this.webpassword}</Password>
			         </RunActionDirect>
			     </soap12:Body>
			 </soap12:Envelope>`,
			 						success: function(res) { 
			 							uni.hideLoading()
			 							console.log(res)
			 							let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
			 							console.log(str1)
			 							let str2 = res.data.indexOf('</RunActionDirectResult>')
			 							let str = res.data.substring(str1 + 45 ,str2)
			 							// console.log(str,1111)
			 							str = eval('(' + str + ')')
			 							console.log(str.message,'gggggggggggg')
			 							console.log(str.result,'gggggggggggg')
			 							if (res.statusCode == 200) {
			 																
			 								if(str.result == true){
			 									uni.showToast({
			 										icon:'success',
			 										title: str.message,
			 										duration: 3000
			 									});
			 									setTimeout(()=>{
			 										that.lookForTable()
			 									},1000)
			 								}
			 								if(str.result == false){
			 									uni.showToast({
			 										icon:'error',
			 										title: str.message,
			 										duration: 3000
			 									});
			 								}
			 								
			 								
			 							} else if(res.statusCode == 500){
			 								uni.showToast({
			 									title: str.message,
			 									duration: 3000, //单位毫秒,
			 									icon: 'loading'
			 								});
			 							}
			 							else  {
			 								uni.showToast({
			 									title: '参数错误',
			 									duration: 2000, //单位毫秒,
			 									icon: 'loading'
			 								});
			 							}
			 						},
			 						fail: function(err) {
			 							uni.hideLoading()
			 							// that.lookForTable()
			 							console.log(err)
			 							uni.showToast({
			 								title: '请求失败！',
			 								duration: 2000, //单位毫秒，
			 								icon: 'loading'
			 							});
			 						}
			 					});
			 
			 
			 return
			 this.$refs.table.callMethods("getData").then(res =>{
				 console.log(res)
				 // console.log(p);
				 //新增 子样列
				 let that = this
			
				 let kArry = []
				 res.forEach(item =>{
				 		for(let k in item){
				 			if(k.startsWith('orderlevel')){
				 				kArry.push(k)		
				 			}	
				 		}		 
				 })
				 // for(let k in p[0]){
				 // 	if(k.startsWith('orderlevel')){
				 // 		kArry.push(k)		
				 // 	}	
				 // }
				 kArry = Array.from(new Set(kArry));
				 kArry = kArry.sort((a,b) =>b.substr(b.length-1,1) - a.substr(a.length-1,1))
				  console.log(kArry)
				 let lastNumber = kArry[0].substr( kArry[0].length - 1,1)
				 lastNumber = parseInt(lastNumber)
				 console.log(lastNumber)
				 let addNewcolumn = {
				 	title: `主样品质量${lastNumber + 1}`,
				 	width: 120,
				 	children: [{
				 			field: `orderweight_${lastNumber + 1}`,
				 			title: `质量`,
				 			width: 50,
				 			editRender: {
				 				name: "input",
				 				props: {
				 					type: "input"
				 				}
				 			}
				 		},
				 		{
				 			field: `testcodes_${lastNumber + 1}`,
				 			title: "▲",
							showOverflow: true,
				 			width: 50,
				 			editRender: {
				 				placeholder: '▲',							
				 				name: "$select",
				 				props: {
				 					type: 'float',
				 					digits: 2,
				 					min: 0,
				 					controls: false,
				 					multiple: true
				 				},
				 				options: [
				 
				 				]
				 			}
				 		}
				 	]
				 }
				 that.initTable.columns.push(addNewcolumn)
				 console.log(that.initTable.columns)
				 let obj = {};
				   let newcol = that.initTable.columns.reduce(function (item, next) {
				       obj[next.title] ? '' : obj[next.title] = true && item.push(next);
				       return item;
				     }, []);
				 console.log(newcol)
				 //添加完列，需要添加data相对应的字段 且复制为空 
				 for (let i = 0; i < res.length; i++) {
				 	that.$set(res[i], `orderweight_${lastNumber + 1}`, '')
				 	that.$set(res[i], `testcodes_${lastNumber + 1}`, '')
				 	that.$set(res[i], `orderlevel_${lastNumber + 1}`, `${lastNumber + 1}`) 
				 }
				 // console.log(res)
				 that.$refs.table.setTableProps({
				 	loading: false,
				 	columns: newcol,
				 	data:res
				 })
				 
				
			 })
						
			},
			
			//查询表格
			lookForTable() {						
					let that = this		 			
					console.log(moment(this.startTime).valueOf(),'starttime')   //ackonwledge
					console.log(moment(this.endTime).valueOf(),'endtime')					
					console.log((that.shortordno == ''  || !that.datetimerange.length ),'1111')
					if(!that.shortordno && !that.datetimerange.length) {
							uni.showToast({
								icon:'error',
								title:'时间为空',
								duration: 1000
							});
							return
					}
								   					
					that.data = JSON.parse(uni.getStorageSync('log')) 
					console.log(that.data,'that.data')  
								
					let filterDate = []		
					console.log(!this.datetimerange.length,'this.datetimerange')
					that.data.forEach(item =>{
						if(that.shortordno && !that.datetimerange.length && that.shortordno == item.shortordno){
							filterDate.push(item)
							console.log("走了1")
						}
						if(!that.shortordno && that.datetimerange.length > 0 && moment(this.startTime).valueOf() <= moment(item.date).valueOf() && moment(item.date).valueOf() <= moment(this.endTime).valueOf()){
							filterDate.push(item)
							console.log("走了2")
						}
						if(that.shortordno && that.datetimerange.length > 0 && that.shortordno == item.shortordno && moment(this.startTime).valueOf() <= moment(item.date).valueOf() && moment(item.date).valueOf() <= moment(this.endTime).valueOf()){
							filterDate.push(item)
							console.log("走了3")
						}
						
					})
					
					
					console.log(filterDate,'filterDate')
																	
					let kArry = []
					that.data.forEach(item =>{
						for(let k in item){
							if(k.startsWith('orderlevel')){
								kArry.push(k)		
							}	
						}
					})
				kArry = Array.from(new Set(kArry))	
					kArry = kArry.sort((a,b) =>b.substr(b.length-1,1) - a.substr(a.length-1,1))
					 console.log(kArry)
					let lastNumber = kArry[0].substr( kArry[0].length - 1,1)								
					lastNumber = parseInt(lastNumber)
					console.log(lastNumber)	
					that.data.forEach(item =>{
						for(let key in item){
							for(let j = lastNumber;j>1;j--){										
								if(!item.hasOwnProperty(`orderlevel_${j}`)){						
									that.$set(item,`orderlevel_${j}`,j)
									that.$set(item,`testcodes_${j}`,``)
									that.$set(item,`orderweight_${j}`,``)
								}
								// console.log(item)
							}
															
						}
					})
					// console.log(that.data)
					for(let i = 1;i<lastNumber;i++){
					
						let addNewcolumn = {
							title: `主样品质量${i + 1}`,
							width: 120,
							children: [{
									field: `orderweight_${i + 1}`,
									title: `质量`,
									width: 50,
									editRender: {
										name: "input",
										props: {
											type: "input"
										}
									}
								},
								{
									field: `testcodes_${i + 1}`,
									title: "▲",
									showOverflow: true,
									width: 50,
									editRender: {
										placeholder: '▲',													
										name: "$select",
										props: {
											type: 'float',
											digits: 2,
											min: 0,
											controls: false,
											multiple: true
										},
										options: [
						
										]
									}
								}
							]
						}
						that.initTable.columns.push(addNewcolumn)									
					}															
					
					let obj = {};
					 that.initTable.columns = that.initTable.columns.reduce(function (item, next) {
					      obj[next.title] ? '' : obj[next.title] = true && item.push(next);
					      return item;
					    }, []);
													
					this.$refs.table.setTableProps({
						loading: false,
						data:filterDate,
						columns: that.initTable.columns
					})	
				
		
			
			},
			
			change(e) {
				console.log(e)
				this.shortNO = e.data.shortordno
				this.remark = e.data.comments
				this.ypname = e.data.samplename
			},
			
			
	
		}
	}
</script>
<style scoped>
	.zhanshi {
		background-color: #03cacb;
		color: red;
		font-size: 80rpx;
		border-radius: 50%;
		width: 400rpx;
		height: 400rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.img-box {
		height: 654upx;
		margin-top: 58upx;
		margin-bottom: 92upx;
	}

	.img-box image {
		width: 654upx;
		height: 654upx;
	}

	.sb-list {
		height: 100upx;
		border-bottom: 1upx solid #F2F2F2;
	}

	.navBarBox {}

	.navBarBox .statusBar {}

	.navBarBox .navBar {
		/* padding: 3rpx 50rpx; */
		padding-bottom: 8rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.navBarBox .navBar .logo {
		width: 50rpx;
		height: 50rpx; 
		/* margin-right: 300rpx; */
	}

	@font-face {
		font-family: uniicons;
		font-weight: normal;
		font-style: normal;
		src: url('~@/static/uni.ttf') format('truetype');
	}
	/* */
	
	/* 侧滑菜单 外部按钮 */
	.drawer-head-menu {
		display: inline-block;
		position: fixed;
		top: 6px;
		left: 16px;
		z-index: 999;
		width: 64rpx;
		height: 64rpx;
		box-shadow: #E4EBF5 0 1px 6px;
	}

	/* 侧滑菜单 因为需要手势滑动，所以左侧留边20rpx*/
	.drawer-content {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		width: 65%;
		bottom: 0;
		z-index: 33;
		background-color: #FFFFFF;
		box-sizing: border-box;
		transform: translateX(calc(-100% + 20rpx));
		transition: transform 0.3s ease;
	}

	.drawer-content-visible {
		z-index: 999;
		transform: translateX(0px);
	}

	/* 侧滑菜单 遮罩层 */
	.drawer-mask {
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 0;
		background-color: rgba(0, 0, 0, 0.4);
		opacity: 0;
		transition: opacity 0.3s;
	}

	.drawer-mask-visible {
		z-index: 999;
		opacity: 1;
		overflow: hidden;
		width: 100%;
		height: 100%;
	}

	.drawer-content-visible .drawer-menu-head {
		background-color: #E4EBF5;
	}

	.drawer-menu-head {
		height: 120rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
	}

	@-webkit-keyframes drawer_iconAnima {
		0% {
			box-shadow: hsl(0, 100%, 60%) 0 2px 12px;
		}

		20% {
			box-shadow: hsl(60, 100%, 50%) 0 2px 13px;
		}

		40% {
			box-shadow: hsl(120, 100%, 50%) 0 2px 14px;
		}

		60% {
			box-shadow: hsl(180, 100%, 50%) 0 2px 15px;
		}

		80% {
			box-shadow: hsl(240, 100%, 50%) 0 2px 14px;
		}

		100% {
			box-shadow: hsl(300, 100%, 50%) 0 2px 13px;
		}
	}

	.drawer-menu-head-image {
		width: 64rpx;
		height: 64rpx;
		padding: 12rpx;
		background-color: #fff;
		box-shadow: #007AFF 0 2px 12px;
		border-radius: 24rpx;
		animation: drawer_iconAnima 6s infinite;
	}

	.drawer-menu-head-text {
		margin-left: 26rpx;
	}

	.drawer-menu-head-icon {
		position: absolute;
		color: #222;
		right: 30rpx;
		font-family: uniicons;
		font-weight: normal;
		font-size: 24px;
	}

	.drawer-content-list {
		width: calc(100% - 60rpx);
		height: calc(100% - 180rpx);
		background-color: #FFFFFF;
		padding: 20rpx 20rpx;
	}

	.drawer-content .item {
		font-size: 20px;
		line-height: 1.5;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	.lickmult {
		display: flex;
		align-items: center;
		margin-left: 30rpx;
	}

	.c-column {
		display: flex;
		flex-direction: column;
	}

	.c-filling {
		height: 10px;
		flex-grow: 1;
	}

	.c-row {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly;
	}
	.icon_close {
			position: absolute;
			right: 100px;
			background-image: url(../../static/delete.png);
			background-position: center center;
			background-repeat: no-repeat;
			background-size: cover;
			width: 30rpx;
			height: 30rpx;
		}	
</style>
