<template>
	
	<view class="content-box" style="padding-left:20rpx;position: relative;">
		<view>
			<!-- <image @click="drawerOpen" class="drawer-head-menu" src="../../static/menu.png" mode="scaleToFill" /> -->
			<view @touchstart="touchStart" @touchend="touchEnd">
				<!-- insert delete update select -->  
				<!-- 遮罩层 --> 
				<view class="drawer-mask" :class="{ 'drawer-mask-visible': stateDrawer }" @tap="drawerClose()" />
				<!-- 内容列表 -->
				<view class="drawer-content" :class="{ 'drawer-content-visible': stateDrawer}">
					<button class="drawer-menu-head" @click="updatebtList">
						<image class="drawer-menu-head-image" src="../../static/lanya.png" mode="aspectFill"></image>
						<text class="drawer-menu-head-text">刷新蓝牙列表</text>
						<text class="drawer-menu-head-icon">&#xe470;</text>
					</button>
					<scroll-view class="drawer-content-list" scroll-y="true">
						<view v-for="(item,index) in bluetooth" :key="item.deviceId"
						
							@click="createBLEConnection(item,index)" class="sb-list">
							<view>
								{{item.name}}
							</view>
							<view class="" style="display: flex;justify-content: space-between;">
								<view v-if="isLink[index]==0" class="ft-color-red ft-28 ft-color-999999">未连接</view>
								<view v-if="isLink[index]==1" class="ft-color-red ft-28 ft-color-999999">连接中...</view>
								<view v-if="isLink[index]==2" style="color:#007AFF">
									已连接</view>
								<view v-if="isLink[index]==3">
									连接失败</view>
								<view v-if="isLink[index]==4">
									已断开</view>
								<view @click.stop="closeBLEConnection(item.deviceId,index)" class=""
									style="color:#007AFF">断开蓝牙</view>     
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
		<!-- 自定义导航栏 -->
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<view style="margin-left: -50rpx;">
					<image src="/static/huace.png" mode="heightFix" @click.stop="goRecord" class="logo"></image>
				</view>
				<view style="font-weight: 400;color:#2e3a60;z-index: 999;" @click="goLocalLog">称量App</view>
				<view><image src="/static/lanya.png" mode="scaleToFill" @click.stop="drawerOpen" class="logo"></image></view>
			</view>
		</view>
		<view style="position: absolute;width: 100%;">
			
			<view style="display: flex;align-items: center;justify-content: center;margin-right: 5px;">
			<view class="left1" style="flex:5">
				<view style="display: flex;align-items: center;justify-content: space-around;padding:0px 10px 0 0;position: relative;margin:3px 0">
					<label class="" style="font-size: 20rpx;">样品编号 <text style="margin:0 5px">:</text></label>
					<input type="text" v-model="applicationNumberid" confirm-type="search" @confirm="doSearch"
						style="flex: 1;border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;" />
						<text v-if="applicationNumberid" class="icon_close" @click="close"></text>
					<!-- <view style="margin-left: 10rpx;" @click.stop="ScanQRcode">
						<image src="../../static/erweima.png" style="width: 100rpx;height: 100rpx;" mode=""></image>
					</view> -->
				</view>
				
				<view style="display: flex;align-items: center;justify-content: space-around;padding:0px 10px 0 0;position: relative;margin:3px 0">
					<label class="" style="font-size: 20rpx;">短号 <text style="margin:0 4px 0 38px">:</text> </label> 
					<input type="text" v-model="applicationNumberidDUANHAO" confirm-type="search" @confirm="doSearchDUANHAO"
						style="flex: 1;border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;" />
						<text v-if="applicationNumberidDUANHAO" class="icon_close" @click="close2"></text>
					<!-- <view style="margin-left: 10rpx;" @click.stop="ScanQRcodeDUANHAO">
						<image src="../../static/erweima.png" style="width: 50rpx;height: 50rpx;" mode=""></image>
					</view> -->
				</view>
				
				<view style="display: flex;align-items: center;justify-content: space-around;padding:0 10px 0 0;position: relative;margin:3px 0">
					<label class="" style="font-size: 20rpx;">批号 <text style="margin:0 4px 0 38px">:</text> </label>
					<input type="text" v-model="applicationNumberidPIHAO" confirm-type="search" @confirm="doSearchPIHAO"
						style="flex: 1;border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;" />
						<text v-if="applicationNumberidPIHAO" class="icon_close" @click="close3"></text>
					<!-- <view style="margin-left: 10rpx;" @click.stop="ScanQRcodePIHAO">
						<image src="../../static/erweima.png" style="width: 50rpx;height: 50rpx;" mode=""></image> 
					</view> -->
				</view>
			</view>
			
			<view class="right1" style="flex:1;margin:0 5px 0 0;margin-right:20px;">
				<view style="margin-left: 10rpx;" @click.stop="ScanQRcode">
					<image src="../../static/erweima.png" style="width: 100rpx;height: 100rpx;" mode=""></image>
				</view>
				
			</view>
			<view class="right1" style="flex:1;margin:0 5px 0 0;margin-right:20px;">
				
				<!-- <button type="default" @click="saveRow" style="color:#fff;background-color: #303962;">保存</button> -->
				<view class="">
					<button type="default" @click="lookForTable" :class="scrollTop_filterButton > 124 ?'button_fixed':''" style="color:#fff;background-color: #303962;margin:3px 0">筛选</button>
					<button type="default" @click="seleteAll" style="color:#fff;background-color: #303962;">查询所有</button>
				</view>
			</view>
			</view>
			
			<view class="lickmult">
				<label class="">选择组别<text style="margin:0 4px">:</text></label>
				<!-- <lickmult :dataList="range1" text="servgrpname" name="servgrpname" v-model="value1" @change="change1" /> -->
				<view class="show-btn" @tap="show"><input type="text" :placeholder="cityName ? cityName :' 请选择'" border disabled style="border: 1px solid #e5e5e5;border-radius: 5rpx;width: 100rpx;height: 45rpx;"></view>
				<uni-popup ref="cityMore" type="top">
					<more-select1 :cityData="cityData" @chooseCity="chooseCity" @switchCity="switchCity" :cityIndex="cityIndex"
						@scrollCity="scrollCity" @closeCity="closeCity" @queryCity="queryCity" :oldScrollTop="oldScrollTop"
						:scrollTop="scrollTop" :chooseCityList="chooseCityList" :title="title" :cityIdArr="cityIdArr" @delCity="delCity"
						ref="moreselects" :maxCount="10" :level="1" :colorValue="colorValue"></more-select1>
				</uni-popup>
				<label class="" style="margin-left: 18rpx;">组别名称<text style="margin:0 4px">:</text></label>
				<input type="text" disabled style="border: 1px solid #e5e5e5;border-radius: 5rpx;width: 300rpx;height: 45rpx;"
					v-model="cityName">
			</view>
			
			<view class="lickmult" style="margin-top: 20rpx;">
				<label class="">选择方法<text style="margin:0 4px">:</text></label>
				<!-- <lickmult :dataList="range1" text="servgrpname" name="servgrpname" v-model="value1" @change="change1" /> -->
				<view class="show-btn" @tap="show2"><input type="text" :placeholder="cityName2 ? cityName2 :' 请选择'" border disabled style="border: 1px solid #e5e5e5;border-radius: 5rpx;width: 100rpx;height: 45rpx;"></view>
				<uni-popup ref="cityMore2" type="top">
					<more-select2 :cityData="cityData2" @chooseCity="chooseCity2" @switchCity="switchCity2" :cityIndex="cityIndex2"
						@scrollCity="scrollCity" @closeCity="closeCity" @queryCity="queryCity2" :oldScrollTop="oldScrollTop"
						:scrollTop="scrollTop" :chooseCityList="chooseCityList2" :title="title2" :cityIdArr="cityIdArr2" @delCity="delCity2"
						ref="moreselects2" :maxCount="10" :level="1" :colorValue="colorValue2"></more-select2>
				</uni-popup>
				<label class="" style="margin-left: 18rpx;">方法名称<text style="margin:0 4px">:</text></label>
				<uni-tooltip :content="cityName2">
				 <input type="text" disabled style="border: 1px solid #e5e5e5;border-radius: 5rpx;width: 300rpx;height: 45rpx;font-size:16px;"
				 	v-model="cityName2">
				</uni-tooltip>
				
			</view>
			
			
			
			<view class="lickmult" style="margin-top:20rpx;">
				<label class="">样品备注<text style="margin:0 4px 0 6px;">:</text></label>
				<input type="text" disabled style="border: 1px solid #e5e5e5;border-radius: 5rpx;width: 520rpx;height: 45rpx;"
					v-model="remark">
			</view>
			<view class="" style="margin: 10rpx 0;padding:0 100rpx 0 40rpx;"> 
			</view>
			
			<view class="lickmult" style="">
				<label class="">选择样品<text style="margin:0 4px">:</text></label>
				<lickmult :dataList="range" text="shortordno" name="samplename" v-model="value" @change="change"/>
			
				<label class="" style="margin-left: 24rpx;">样品名称<text style="margin:0 4px">:</text></label>
				<input type="text" disabled style="border: 1px solid #e5e5e5;border-radius: 5rpx;width: 308rpx;height: 45rpx;"
					v-model="ypname">			
			</view>
			

			<view style="display: flex;align-items: center;margin-top: 20rpx;">
				<label class="" style="font-size: 20rpx;">设备名称<text style="margin:0 4px">:</text></label>
				<input type="text" v-model="blueToothName"
					style="border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;width: 200rpx;" />
					
					<view style="margin-left: 30rpx;">
						<button type="default" size="mini" @click="showRow" style="color:#fff;background-color: #303962;">隐藏列</button>					
					</view>
					
					<view style="margin-left: 30rpx;">
						<button type="default" size="mini" @click="deleteColumn" style="color:#fff;background-color: #303962;">删除列</button>
					</view>
				<!-- <view style="margin-left: 10rpx;" @click.stop="ScaneqNQRcode">
					<image src="../../static/erweima.png" style="width: 50rpx;height: 50rpx;" mode=""></image>
				</view> --> 
			</view>
					
			
			<view class="c-column" style="width: 100%;height: 50vh;"> 
				<view class="c-row" style="margin:10rpx 0">
					<view class="lickmult" style="">
						<label class="">添加主样<text style="margin:0 4px">:</text></label>
						<lickmult :dataList="operaList" text="label" name="value" v-model="opreaValue"
							@change="changeOpera" /> 
					</view>
					<view class="temp_class_null">
					<!-- 	<label class="">添加子样<text style="margin:0 4px">:</text></label>
						<lickmult :dataList="operaListSon" text="label" name="value" v-model="opreaValue"
							@change="changeOperaSon" /> -->
					</view>
					  
					
				</view>
				<!-- allButtonFixed -->
				<view :class="scrollTop_filterButton > 496 ? 'allButtonFixed':''" style="margin: 5rpx 0;align-items: center;justify-content: space-evenly;display: flex;">
					<button @click="nextYangp" style="color:#fff;background-color: #303962;">下一个样品</button>
					<button type="default" @click="saveRow" style="color:#fff;background-color: #303962;font-size: 25px;">保存</button> 
					<button @click="nextYangpAndSave" style="color:#fff;background-color: #303962;font-size: 25px;">下一个并保存</button>
					<!-- <button type="default" @click="lookForTable" style="color:#fff;background-color: #303962;">查询</button>	 -->
						
					<!-- <button type="default" @click="seleteAll" style="color:#fff;background-color: #303962;">查询所有</button>	 -->
				</view>	
				 
					<template  v-if="isShow">
						<view style="margin: 15rpx 0;">
					<checkbox-group name="" @change="changColumns">
						<label v-for="(column,index) in columns2">
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
	import lickmult from '../../uni_modules/hpy-form-select/components/hpy-form-select/hpy-form-select.vue'
	import moreSelect1 from "@/components/more-select1.vue"
	import moreSelect2 from "@/components/more-select2.vue"
	import tTable from './table.vue'
	import moment from '../../utils/moment.js'
	export default {
		components: {
			lickmult,
			tTable,	
			moreSelect1,
			moreSelect2
		},
		data() {
			return {
				temporaryTableData:[],            // 存放临时的表格数据
				lastTapTimeoutFunc: null,
				lastTapDiffTime: 0,
				webserve:this.$webserve_gol,  // 'http://10.10.1.10:8085/FDD/services/generic.asmx'
				webaccount:'SYSADM',
				webpassword:'XF-,8>TJ$PN,',
				blueToothName:'',
				level: 1,
				title: '选择检测方法',
				chooseCityList: [],
				cityIdArr: [],
				cityData: [],            // 组别 List
				scrollTop: 0,
				oldScrollTop: 0,
				cityIndex: 0,
				cityName: "",
				colorValue: "#016CE1",
				title2: '选择组别',
				chooseCityList2: [],
				cityIdArr2: [],
				cityData2: [],           // 方法List
				scrollTop2: 0,
				oldScrollTop2: 0,
				cityIndex2: 0,
				cityName2: "",
				colorValue2: "#016CE1",  // 
				createBy: '',
				strJson: {},			// 保存到lims的 Json 格式
				isLogin: false,   		// 是否登录
				
				// 以下值是 连接蓝牙 相关的 字段
				stateDrawer: false,   	//抽屉状态
				startTime: null, 		// 手势滑动时间
				startPosition: 0, 		// 手势进入时 
				endPosition: 0, 		// 手势离开时  
				isShow: false,	
				statusBarHeight: 0,      // 状态栏高度
				navBarHeight: 82 + 11,     // 导航栏高度
				bluetooth: [],           // 蓝牙列表
				isLink: [],			
				serverList: [],           // 调试数据
				characteristics: [],
				readCode: '',
				readCodeMsg: '',
				serviceId: '',
				characteristicId: '',
				value_command: 'S',                         // 蓝牙发送给天平的字符指令。
				returnMessage: '',
				macAddress: "",
				macValue: '',
				// 以上是 与蓝牙相关的 字段。
				scrollTop_filterButton:'',
			
				lastTime: 0,
				applicationNumberid: '', 				//样品编号、
				applicationNumberidDUANHAO:'',			//短号	
				applicationNumberidPIHAO:'',			// 批号
				equipmentName: '', 						// 设备
				range: [],       						//样品号列表集合 【000001，000002】
				range1: [],        						// 组别 列表
				operaList: [
					{
						label: '添加平行样',
						value: '平行样质量'
					},
					{
						label: '添加加标样',
						value: '加标样质量'
					},
					// {
					// 	label: '添加空白样',
					// 	value: '空白样'
					// },
					// {
					// 	label: '添加标样',
					// 	value: '~标样质量'
					// },
					{
						label: '添加子样',
						value: '子样质量'
					},
					// {
					// 	label: '添加空白加标样',
					// 	value: '空白加标样'
					// }
				],
				opreaValue: '',
				operaListSon: [{
						label: '添加样品质量子样',
						value: '样品质量'
					},
					{
						label: '添加平行样子样',
						value: '平行样质量'
					},
					{
						label: '添加加标样子样',
						value: '加标样质量'
					},
					{
						label: '添加空白样子样',
						value: '空白样'
					},
					{
						label: '添加标样子样',
						value: '~标样质量'
					},
					{
						label: '添加子样子样',
						value: '子样质量'
					},
					{
						label: '添加空白加标样子样',
						value: '空白加标样'
					}
				],
				opreaValueSon: '',
				leijiaNumP:1,
				leijiaNumJ:1,
				leijiaNumK:1,
				leijiaNumB:1,
				leijiaNumS:1,
				leijiaNumBJ:1,
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
								type: "checkbox",
								width: 50,
								// visible:false
							},					
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
							field: "weightdemand",
							title: "称量要求",
							maxWidth:180,
							minWidth:80
						},
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
						<vxe-button @click="slotEvents(row)">添加</vxe-button>
					</template>`
				},
			}
		},
		onLoad() {
			
		},
		onShow(){		
			let that = this
			
			console.log(that.webserve,'this.webserve')
		 uni.onWindowResize(res => {
		      // portrait 竖屏 landscape 横屏   将状态值存储到这个this.landscape变量中 
			  this.landscape = res.deviceOrientation
		     if(this.landscape == 'landscape'){
				// 横屏 
				that.$nextTick(() => {					
					that.$refs.table.setTableProps({
						loading: false,
						height:'480px'
					})
				})	
			 }else {
				 // 竖屏
				that.$nextTick(() => {
					that.$refs.table.setTableProps({
						loading: false,
						height:'850px'
						
					})
				console.log(that.initTable.height)
				})
			 }
			  // console.log(res.deviceOrientation)
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
				success: (res) => {
					// console.log(res.data);				
					that.$nextTick(() => {
						that.dept = res.data
					})
				}
			})

			uni.getStorage({
				key: 'equipmentName',
				success: (res)  =>{
					// console.log(res.data);					
					that.$nextTick(() => {
						that.equipmentName = res.data
					})
				}
			})

			uni.getStorage({
				key: 'createBy',
				success: (res) => {
					// console.log(res.data);					
					that.$nextTick(() => {
						that.createBy = res.data
					})
				}
			})
			
			console.log(that.webserve,'that.webserve = res.data')
			// uni.getStorage({
			// 	key: 'webserve',
			// 	success: (res) =>{
			// 		console.log(res.data);				
			// 		that.$nextTick(() => {
			// 			that.webserve = res.data
			// 		})
			// 	}
			// })
			uni.getStorage({
				key: 'account',
				success: (res) => {
					console.log(res.data);				
					that.$nextTick(() =>{
						that.webaccount = res.data
					})
				}
			})
			uni.getStorage({
				key: 'password',
				success: (res) => {
					console.log(res.data);				
					that.$nextTick(() =>{
						that.webpassword = res.data
					})
				}
			})	
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
		},
		onPageScroll(e){
		
			if(e.scrollTop > 125){
				this.scrollTop_filterButton = e.scrollTop
			}else {
				this.scrollTop_filterButton = ''
			}
			// m
		},
		methods: {
			goLocalLog(){			
				uni.navigateTo({
					url:'/pages/localLog/index'
				})
			},  
			show2() {
					if (this.level == 1) {      
						let obj = {}
						let arrMethod = []
						let i =0
						this.data.forEach(item =>{						
						obj = {
								id:i++,
								name:item.methodname
							}
							arrMethod.push(obj)
						})
						console.log(arrMethod)
						//数组去重 带有重复的方法	 //   
						let deWeightThree = () => { 
						    let name = 'name';
						    let map = new Map();
						for (let item of arrMethod) {
							
						if (!map.has(item.name)) {
						     map.set(item.name, item);
						        }
						    }
						return [...map.values()];
						}
						let newArr3 = deWeightThree();
						console.log(newArr3)
						this.cityData2 = newArr3
					}
					this.$refs.cityMore2.open()
				},
				switchLevel2(id) {
					this.resetData2()
					this.level = id
				},
				resetData2(){
					this.cityIdArr2 = []
					this.chooseCityList2 = []
				},
				delCity2(delId) {
					this.cityIdArr2.forEach((item, index) => {
						if (this.chooseCityList2[delId].id == item) {
							this.cityIdArr2.splice(index, 1);
						}
					})
					this.chooseCityList2.splice(delId, 1);
					this.$nextTick(() => {
						this.$refs.moreselects2.getViewHeight();
					});
				},
				chooseCity2(item) {
					console.log(item)
					console.log(this.cityIdArr)
					//先判断Id是否在数组中
					if (this.cityIdArr2.includes(item.id)) {
						this.chooseCityList2.forEach((val, key) => {
							if (val.id == item.id) { //如果在数组中，反选（删除）
								this.delCity2(key)
							}
						})
						return false
					}
			
					// if (this.chooseCityList.length >= this.maxCount) {
					// 	uni.showToast({
					// 		title: '最多选择' + this.maxCount + '个',
					// 		icon: "none",
					// 		duration: 2000
					// 	});
					// 	return false
					// }
					let obj = {}
					if (this.level == 1) {
						 obj = {
							"id": item.id,
							"name": item.name
						}
					}
					
					this.cityIdArr2.push(item.id)
					this.chooseCityList2.push(obj)
					//调用子组件方法动态改变滚动栏高度
					this.$nextTick(() => {
						this.$refs.moreselects2.getViewHeight();
					});
			
				},
				switchCity2(index) {
					this.scrollTop = this.oldScrollTop
					//当视图渲染结束 重新设置为0
					this.$nextTick(() => {
						this.scrollTop = 0
					});
					this.cityIndex2 = index
				},
				scrollCity2(val) {
					//记录scroll  位置
					this.oldScrollTop = val
				},
				closeCity2() {
					this.$refs.cityMore2.close()
				},
				queryCity2() {
					this.cityName2 = ""
					this.chooseCityList2.forEach((item, index) => {
						this.cityName2 += item.name + ","
					})
					this.cityName2 = this.cityName2.substring(0, this.cityName2.lastIndexOf(','));			
					this.$refs.cityMore2.close()
				},
			// 2222222222222
			show() {
					
					if (this.level == 1) {
						console.log(this.range1)
						this.cityData = this.range1
					}
					this.$refs.cityMore.open()
				},
				switchLevel(id) {
					this.resetData()
					this.level = id
				},
				resetData(){
					this.cityIdArr = []
					this.chooseCityList = []
				},
				delCity(delId) {
					this.cityIdArr.forEach((item, index) => {
						if (this.chooseCityList[delId].servgrpcode == item) {
							this.cityIdArr.splice(index, 1);
						}
					})
					this.chooseCityList.splice(delId, 1);
					this.$nextTick(() => {
						this.$refs.moreselects.getViewHeight();
					});
				},
				chooseCity(item) {
					console.log(item)
					console.log(this.cityIdArr)
					//先判断Id是否在数组中
					if (this.cityIdArr.includes(item.servgrpcode)) {
						this.chooseCityList.forEach((val, key) => {
							if (val.servgrpcode == item.servgrpcode) { //如果在数组中，反选（删除）
								this.delCity(key)
							}
						})
						return false
					}
					let obj = {}
					if (this.level == 1) {
						 obj = {
							"servgrpcode": item.servgrpcode,
							"servgrpname": item.servgrpname
						}
					}
					
					this.cityIdArr.push(item.servgrpcode)
					this.chooseCityList.push(obj)
					//调用子组件方法动态改变滚动栏高度
					this.$nextTick(() => {
						this.$refs.moreselects.getViewHeight();
					});		
				},
				switchCity(index) {
					this.scrollTop = this.oldScrollTop
					//当视图渲染结束 重新设置为0 
					this.$nextTick(() => {
						this.scrollTop = 0
					});
					this.cityIndex = index
				},
				scrollCity(val) {
					//记录scroll  位置
					this.oldScrollTop = val
				},
				closeCity() {
					this.$refs.cityMore.close()
				},
				queryCity() {
					this.cityName = ""
					this.chooseCityList.forEach((item, index) => {
						this.cityName += item.servgrpname + ","
					})
					this.cityName = this.cityName.substring(0, this.cityName.lastIndexOf(','));
					console.log(this.cityName)
					this.zubie = this.cityName
					this.$refs.cityMore.close()
				},
				// 点击下一个样品 保存之前的数据。
				nextYangpAndSave(){
					console.log(this.shortNO)
					console.log(this.range)
					// console.log(this.value)
					for(let i = 0;i<this.range.length - 1;i++){
						if(this.range[i].shortordno.search(this.shortNO) !== -1){
							this.shortNO = this.range[i+1].shortordno
							this.value = this.range[i+1].samplename
							let e = {
								"index": i,
								"value": this.range[i+1].samplename,
								"data":{
									"comments": this.range[i+1].comments,
									"samplename": this.range[i+1].samplename,
									"shortordno":  this.range[i+1].shortordno
								}
							}
							// console.log(e) 
							console.log(this.shortNO)
							console.log(this.zbname)
							this.change(e)
							this.saveRow()
							// this.lookForTable()
							return
						}
					}
				},
			//监听下一次样品 单击事件
			nextYangp(){
				// 判断是否选择了方法
				console.log(this.cityName2,typeof this.cityName2,'cityName2')
				// console.log(this.temporaryTableData,typeof this.temporaryTableData,'temporaryTableData')
				if(this.cityName2 != ''){
						console.log(this.data,'this.data')
						this.temporaryTableData = this.temporaryTableData.filter(item =>{
							return this.cityName2.indexOf(item.methodname) !== -1	
						})
						console.log(this.temporaryTableData,typeof this.temporaryTableData,'temporaryTableData')
						let tempRange = []
						tempRange = this.temporaryTableData.map(v =>{
							return {
								shortordno:v.shortordno,
								samplename:v.samplename,
								comments:''
							}
						})
						let obj = {
							
							    "comments": "",
							    "samplename": "空",
							    "shortordno": "空"
							
						}
						this.range = tempRange
						this.range.unshift(obj)
						for(let i = 0;i<tempRange.length - 1;i++){
							if(tempRange[i].shortordno.search(this.shortNO) !== -1){
								this.shortNO = tempRange[i+1].shortordno
								this.value = tempRange[i+1].samplename
								let e = {
									"index": i,
									"value": tempRange[i+1].samplename,
									"data":{
										"comments": tempRange[i+1].comments,
										"samplename": tempRange[i+1].samplename,
										"shortordno":  tempRange[i+1].shortordno
									}
								}
								// console.log(e) 
								console.log(this.shortNO)
								console.log(this.zbname)
								this.change(e)
								this.lookForTable()
								return
							}
						}
										
									
									
				}
				
				
				
				else {
					
					console.log(this.shortNO,'shortNO')
					console.log(this.range,'range')
					// console.log(this.value)
					for(let i = 0;i<this.range.length - 1;i++){
						if(this.range[i].shortordno.search(this.shortNO) !== -1){
							this.shortNO = this.range[i+1].shortordno
							this.value = this.range[i+1].samplename
							let e = {
								"index": i,
								"value": this.range[i+1].samplename,
								"data":{
									"comments": this.range[i+1].comments,
									"samplename": this.range[i+1].samplename,
									"shortordno":  this.range[i+1].shortordno
								}
							}
							// console.log(e) 
							console.log(this.shortNO)
							console.log(this.zbname)
							this.change(e)
							this.lookForTable()
							return
						}
					}
				}
				
				
				
			},
			// 监听键盘的enter事件
			doSearch() {			
				if (this.zubie == '空' || this.zubie == undefined) {
					this.zubie = ''
				}
				if (this.shortNO == '空' || this.yname == undefined) {
					this.shortNO = ''
				}
				
				let that = this
				const havezubie = uni.getStorageSync('havezubie')
				console.log(havezubie)
				if(havezubie){
					that.zubie = havezubie
				}else {
					that.zubie = ''
				}
				console.log(this.zubie, this.shortNO)
				uni.showLoading({
					title:'查询中',
					icon:'loading',
					mask:true
				})
				uni.request({
					method: "post",
					sslVerify: false,
					url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
					contentType: "application/json",
					header: {
						'Content-Type': 'application/soap+xml; charset=utf-8',
						'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
					},
					data: `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
            <actionID>CTI.GetFoldersInfoNew</actionID>
            <parameters xsi:type="xsd:groups">
			<anyType xsi:type="xsd:string"></anyType>
			<anyType xsi:type="xsd:string"></anyType>
                <anyType xsi:type="xsd:string">${that.applicationNumberid}</anyType>
                <anyType xsi:type="xsd:string">${that.zubie}</anyType>
            </parameters>
            <UserName>${this.webaccount}</UserName>
            <Password>${this.webpassword}</Password>
        </RunActionDirect>
    </soap12:Body>
</soap12:Envelope>`,
					success: (res) =>{
						uni.hideLoading()
						console.log(res)
						if (res.statusCode == 200) {
							let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
								console.log(str1,'打印出来是字符还是ascii码')
								let str2 = res.data.indexOf('</RunActionDirectResult>')
								let str = res.data.substring(str1 + 45 ,str2)
								// console.log(str)
								str = eval('(' + str + ')')
								console.log(str,'strstrstrstrstr')
								
								console.log(res.data)
							if (!str.result) {
									uni.showToast({
										title: '暂无数据暂无数据？！',
										duration: 2000,           //单位毫秒
										icon: 'loading'
									});
									return
								}
								// console.log(that.getBracketStr(res.data))
								// console.log(eval('(' + that.getBracketStr(res.data)[0] + ')'))
								// console.log(eval('(' + that.getBracketStr(res.data)[1] + ')'))
								that.$nextTick(()=> {
									// that.range = eval('(' + that
									// 	.getBracketStr(res.data)[0] + ')'); 
									that.range = str.orders
									console.log(that.range,'rangeeeeeeeeee')
									let weixuan = {
										"comments": "",
										"samplename": "空",
										"shortordno": "空"
									}
									that.range.unshift(weixuan)
									// this.range1 = eval('(' + that
									// 	.getBracketStr(res.data)[
									// 		1] + ')');
									that.range1 = str.servgrps
									console.log(that.range1)
									let weixuan1 = {
										"servgrpcode": "空",
										"servgrpname": "空"
									}
									that.range1.unshift(weixuan1)
									// 	uni.setStorageSync('loginStatus', 'true');
								})
							// console.log(res.data)
							// if (that.getBracketStr(res.data) == null) {
							// 	uni.showToast({
							// 		title: '暂无数据暂无数据？！',
							// 		duration: 2000,           //单位毫秒
							// 		icon: 'loading'
							// 	});
							// 	return
							// }
							// console.log(that.getBracketStr(res.data))
							// // console.log(eval('(' + that.getBracketStr(res.data)[0] + ')'))
							// // console.log(eval('(' + that.getBracketStr(res.data)[1] + ')'))
							// that.$nextTick(function() {
							// 	that.range = eval('(' + that
							// 		.getBracketStr(res.data)[0] + ')'); 
							// 	console.log(this.range,'rangeeeeeeeeee')
							// 	let weixuan = {
							// 		"comments": "",
							// 		"samplename": "空",
							// 		"shortordno": "空"
							// 	}
							// 	that.range.unshift(weixuan)
							// 	this.range1 = eval('(' + that
							// 		.getBracketStr(res.data)[
							// 			1] + ')');
							// 	console.log(that.range1)
							// 	let weixuan1 = {
							// 		"servgrpcode": "空",
							// 		"servgrpname": "空"
							// 	}
							// 	that.range1.unshift(weixuan1)
							// 	// 	uni.setStorageSync('loginStatus', 'true');
							// })
							
						} else {
							uni.showToast({
								title: '网络错误500！',
								duration: 2000 //单位毫秒
							});
						}

					},
					fail: (err) =>{
						uni.hideLoading()
						console.log(err)
						uni.showToast({
							title: '请求失败？！',
							duration: 2000,  	// 单位毫秒, 
							icon: 'loading'
						});

					}
				});
			},
			doSearchDUANHAO() {
							
							if (this.zubie == '空' || this.zubie == undefined) {
								this.zubie = ''
							}
							if (this.shortNO == '空' || this.yname == undefined) {
								this.shortNO = ''
							}
							
							let that = this
							const havezubie = uni.getStorageSync('havezubie') 
							// console.log(havezubie) //  
							
							if(havezubie){
								that.zubie = havezubie
							}else {
								that.zubie = ''
							}
							console.log(this.zubie, this.shortNO)
							uni.showLoading({
								title:'查询中',
								icon:'loading',
								mask:true
							})
							uni.request({
								method: "post",
								sslVerify: false,
								url:  `${this.webserve}`, //接口地址，后面加上 方法名  
								contentType: "application/json",
								header: {
									'Content-Type': 'application/soap+xml; charset=utf-8',
									'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
								},
								data: `<?xml version="1.0" encoding="utf-8"?>
			<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
			    <soap12:Body>
			        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
			            <actionID>CTI.GetFoldersInfoNew</actionID>
			            <parameters xsi:type="xsd:groups">
						<anyType xsi:type="xsd:string"></anyType>
						<anyType xsi:type="xsd:string">${that.applicationNumberidDUANHAO}</anyType>
			                <anyType xsi:type="xsd:string"></anyType>
			                <anyType xsi:type="xsd:string">${that.zubie}</anyType>
			            </parameters>
			            <UserName>${this.webaccount}</UserName>
			            <Password>${this.webpassword}</Password>
			        </RunActionDirect>
			    </soap12:Body>
			</soap12:Envelope>`,
								success: (res) => {
									uni.hideLoading()
									console.log(res)
									if (res.statusCode == 200) {
											
										// console.log(res.data)
										// if (that.getBracketStr(res.data) == null) {
										// 	uni.showToast({
										// 		title: '暂无数据暂无数据？！',
										// 		duration: 2000,           //单位毫秒
										// 		icon: 'loading'
										// 	});
										// 	return
										// }
										// console.log(that.getBracketStr(res.data))
										// // console.log(eval('(' + that.getBracketStr(res.data)[0] + ')'))
										// // console.log(eval('(' + that.getBracketStr(res.data)[1] + ')'))
										// that.$nextTick(function() {
										// 	that.range = eval('(' + that
										// 		.getBracketStr(res.data)[0] + ')'); 
										// 	console.log(this.range,'rangeeeeeeeeee')
										// 	let weixuan = {
										// 		"comments": "",
										// 		"samplename": "空",
										// 		"shortordno": "空"
										// 	}
										// 	that.range.unshift(weixuan)
										// 	this.range1 = eval('(' + that
										// 		.getBracketStr(res.data)[
										// 			1] + ')');
										// 	console.log(that.range1)
										// 	let weixuan1 = {
										// 		"servgrpcode": "空",
										// 		"servgrpname": "空"
										// 	}
										// 	that.range1.unshift(weixuan1)
										// 	// 	uni.setStorageSync('loginStatus', 'true');
										// })
									
										let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
										console.log(str1,'打印出来是字符还是ascii码')
										let str2 = res.data.indexOf('</RunActionDirectResult>')
										let str = res.data.substring(str1 + 45 ,str2)
										
										str = eval('(' + str + ')')
										console.log(str,'strstrstrstrstr')
										
										// console.log(res.data)
									if (!str.result) {
											uni.showToast({
												title: '暂无数据暂无数据？！',
												duration: 2000,           //单位毫秒
												icon: 'loading'
											});
											return
										}
										// console.log(that.getBracketStr(res.data))
										// console.log(eval('(' + that.getBracketStr(res.data)[0] + ')'))
										// console.log(eval('(' + that.getBracketStr(res.data)[1] + ')'))
										that.$nextTick(()=> {
											// that.range = eval('(' + that
											// 	.getBracketStr(res.data)[0] + ')'); 
											that.range = str.orders
											console.log(that.range,'rangeeeeeeeeee')
											let weixuan = {
												"comments": "",
												"samplename": "空",
												"shortordno": "空"
											}
											that.range.unshift(weixuan)
											// this.range1 = eval('(' + that
											// 	.getBracketStr(res.data)[
											// 		1] + ')');
											that.range1 = str.servgrps                 // wocao
											
											console.log(that.range1)
											let weixuan1 = {
												"servgrpcode": "空",
												"servgrpname": "空"
											}
											that.range1.unshift(weixuan1)
											// 	uni.setStorageSync('loginStatus', 'true');
										})
										
									} else {
										uni.showToast({
											title: '网络错误500！',
											duration: 2000 //单位毫秒
										});
									}
			
								},
								fail: (err) => {
									uni.hideLoading()
									console.log(err)
									uni.showToast({
										title: '请求失败？！',
										duration: 2000, //单位毫秒,
										icon: 'loading'
									});
			
								}
							});
						},
						doSearchPIHAO() {
										
										if (this.zubie == '空' || this.zubie == undefined) {
											this.zubie = ''
										}
										if (this.shortNO == '空' || this.yname == undefined) {
											this.shortNO = ''
										}
										
										let that = this
										const havezubie = uni.getStorageSync('havezubie')
										console.log(havezubie)
										if(havezubie){
											that.zubie = havezubie
										}else {
											that.zubie = ''
										}
										console.log(this.zubie, this.shortNO,typeof this.zubie,typeof this.shortNO)
										uni.showLoading({
											title:'查询中',
											icon:'loading',
											mask:true
										})
										uni.request({
											method: "post",
											sslVerify: false,
											url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
											contentType: "application/json",
											header: {
												'Content-Type': 'application/soap+xml; charset=utf-8',
												'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
											},
											data: `<?xml version="1.0" encoding="utf-8"?>
						<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
						    <soap12:Body>
						        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
						            <actionID>CTI.GetFoldersInfoNew</actionID>
						            <parameters xsi:type="xsd:groups">
									<anyType xsi:type="xsd:string">${that.applicationNumberidPIHAO}</anyType>
									<anyType xsi:type="xsd:string"></anyType>
						                <anyType xsi:type="xsd:string"></anyType>
						                <anyType xsi:type="xsd:string">${that.zubie}</anyType>
						            </parameters>
						            <UserName>${this.webaccount}</UserName>
						            <Password>${this.webpassword}</Password>
						        </RunActionDirect>
						    </soap12:Body>
						</soap12:Envelope>`,
											success: (res) => {
												uni.hideLoading()
												console.log(res)
												if (res.statusCode == 200) {
													let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
														console.log(str1,'打印出来是字符还是ascii码')
														let str2 = res.data.indexOf('</RunActionDirectResult>')
														let str = res.data.substring(str1 + 45 ,str2)
														str = eval('(' + str + ')')
														console.log(str,'strstrstrstrstr')
														console.log(res.data)
													if (!str.result) {
															uni.showToast({
																title: '暂无数据暂无数据？！',
																duration: 2000,           //单位毫秒
																icon: 'loading'
															});
															return
														}
														that.$nextTick(()=> {
														
															that.range = str.orders
															console.log(that.range,'rangeeeeeeeeee')
															let weixuan = {
																"comments": "",
																"samplename": "空",
																"shortordno": "空"
															}
															that.range.unshift(weixuan)
															that.range1 = str.servgrps
															console.log(that.range1)
															let weixuan1 = {
																"servgrpcode": "空",
																"servgrpname": "空"
															}
															that.range1.unshift(weixuan1)
															// 	uni.setStorageSync('loginStatus', 'true');
														})
													
													
													// console.log(res.data)
													// if (that.getBracketStr(res.data) == null) {
													// 	uni.showToast({
													// 		title: '暂无数据暂无数据？！',
													// 		duration: 2000,           //单位毫秒
													// 		icon: 'loading'
													// 	});
													// 	return
													// }
													// console.log(that.getBracketStr(res.data))
													// // console.log(eval('(' + that.getBracketStr(res.data)[0] + ')'))
													// // console.log(eval('(' + that.getBracketStr(res.data)[1] + ')'))
													// that.$nextTick(function() {
													// 	that.range = eval('(' + that
													// 		.getBracketStr(res.data)[0] + ')'); 
													// 	console.log(this.range,'rangeeeeeeeeee')
													// 	let weixuan = {
													// 		"comments": "",
													// 		"samplename": "空",
													// 		"shortordno": "空"
													// 	}
													// 	that.range.unshift(weixuan)
													// 	this.range1 = eval('(' + that
													// 		.getBracketStr(res.data)[
													// 			1] + ')');
													// 	console.log(that.range1)
													// 	let weixuan1 = {
													// 		"servgrpcode": "空",
													// 		"servgrpname": "空"
													// 	}
													// 	that.range1.unshift(weixuan1)
													// 	// 	uni.setStorageSync('loginStatus', 'true');
													// })
													
												} else {
													uni.showToast({
														title: '网络错误500！',
														duration: 2000 //单位毫秒
													});
												}
						
											},
											fail: (err) =>{
												uni.hideLoading()
												console.log(err)
												uni.showToast({
													title: '请求失败？！',
													duration: 2000, //单位毫秒,
													icon: 'loading'
												});
						
											}
										});
									},
			
			
			// 表格加载完成回调函数    
			initComplete() {	
				// curb 
				this.$refs.table.setTableProps({
					loading: false,
				})			
			},
			changColumns(e){
				let that = this
				that.initTable.columns.forEach(item =>{
					if(e.target.value.includes(item.field)){
					item.visible = false
					}else {
						item.visible = true
						that.$nextTick(() =>{
							that.$refs.table.setTableProps({
								loading: false,
								columns: that.initTable.columns,
							})
						
						})
					}
							
				})
			},
			//删除选择的box列
			deleteRow(){
				let that = this
				this.$refs.table.callMethods("getData").then(res =>{
					console.log(res)
					// 删除要加的条件-- 看后端返回是否可以删除字段,再在判断里删除   
					for(let k in this.checkedRow){
						if(this.checkedRow[k] == 0 && k == 'isnew'){
							uni.showToast({
								title: '不能删除该行',
								duration: 1000, //单位毫秒,
								icon: 'loading'
							});
						     return
						}else if(this.checkedRow[k] == 1 && k == 'isnew'){
							// console.log('可以删除')
							console.log(this.rowIndex)
							// this.$delete(res,this.$rowIndex)
							res.splice(this.rowIndex,1)
							// console.log(res)
							that.$nextTick(() => {
								this.$refs.table.setTableProps({
									loading: false,
									data: res,
								})
							
							})
							return
						}
					}
				})
			
			},
			showRow() {
				//      
				console.log(this.isShow)
				this.isShow = !this.isShow			
				
				let that = this
				that.columns2 = []
				this.$refs.table.callMethods("getColumns").then(res =>{
									
				that.$nextTick(() =>{
				res.forEach(item =>{
					
						if(item.property == 'shortordno' || item.property == 'orders' || item.property == 'servgrp'
						 || item.property == 'methodname' ||item.property == 'weightdemand'){
							that.columns2.push(item)
						}
					})
					// console.log(that.columns2)
				})	 
			})			
			},
			removeRow() {
				this.$refs.table.callMethods("removeCheckboxRow")
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
				// uni.showToast({
				// 	title: "校验通过"
				// })
				uni.showLoading({
					title:'保存中',
					icon:'loading',
					mask:true
				})
				this.$refs.table.callMethods("getData").then(res => {
					console.log(res,'rrrrrrrsssssss')
					
					// console.log(uni.getStorageSync('log'),'unigetStorageSync')
					let allLogs = []
					if(uni.getStorageSync('log')){
						console.log(JSON.parse(uni.getStorageSync('log')),'dudududuuduududu')
						allLogs = JSON.parse(uni.getStorageSync('log'))
					}
					let localLog = JSON.stringify(res)
					
					localLog = JSON.parse(localLog)
					console.log(localLog,'localLoglocalLog')
					localLog.forEach(item =>{
						this.$set(item,'date',moment().format("YYYY-MM-DD HH:mm:ss"))
						this.$set(item,'submitResult','成功')
					})
					console.log(localLog,'nnnn')
					allLogs.unshift(...localLog)
					allLogs = JSON.stringify(allLogs)
										
					uni.setStorageSync('log',allLogs);
					console.log(JSON.parse(uni.getStorageSync('log')),'dudu11111')
					
					
					
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
						"eqid": this.blueToothName,   // this.blueToothName OSTRAN TTE20180510
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
					
					// 使用同步 本地缓存 
					// return
					//提交到 lims 接口  
					uni.request({
						method: "post",
						sslVerify: false,
						url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
						contentType: "application/json",
						header: {
							'Content-Type': 'application/soap+xml; charset=utf-8',
							'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
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
						success: (res1)=> {												
							uni.hideLoading()
							console.log(res1)
							let str1 = res1.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
							// console.log(str1)
							let str2 = res1.data.indexOf('</RunActionDirectResult>')
							let str = res1.data.substring(str1 + 45 ,str2)
							// console.log(str,1111)
							str = eval('(' + str + ')')
							console.log(str.message,'gggggggggggg')
							console.log(str.result,'gggggggggggg') 
							if (res1.statusCode == 200) {
								
								// localLog = JSON.parse(localLog)
								// console.log(localLog,'localLoglocalLog')
								// localLog.forEach(item =>{
								// 	this.$set(item,'date',moment().format("YYYY-MM-DD HH:mm:ss"))
								// 	this.$set(item,'submitResult','成功')
								// })
								// console.log(localLog,'nnnn')
								// allLogs.unshift(...localLog)
								// allLogs = JSON.stringify(allLogs)
													
								// uni.setStorageSync('log',allLogs);
								// console.log(JSON.parse(uni.getStorageSync('log')),'dudu11111')
								
								
																
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
								
								
							} else if(res1.statusCode == 500){
								// localLog = JSON.parse(localLog)
								// localLog.forEach(item =>{
								// 	this.$set(item,'date',moment().format("YYYY-MM-DD HH:mm:ss"))
								// 	this.$set(item,'submitResult','失败')
								// })
								// console.log(localLog,'n')
								// allLogs.unshift(...localLog)
								// allLogs = JSON.stringify(allLogs)
													
								// uni.setStorageSync('log',allLogs);
								// console.log(JSON.parse(uni.getStorageSync('log')),'dudu11111')
								
								
								
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
						fail: (err) => {
							uni.hideLoading()
							localLog = JSON.parse(localLog)
							localLog.forEach(item =>{
								this.$set(item,'date',moment().format("YYYY-MM-DD HH:mm:ss"))
								this.$set(item,'submitResult','失败')
							})
							console.log(localLog,'n')
							allLogs.unshift(...localLog)
							allLogs = JSON.stringify(allLogs)
												
							uni.setStorageSync('log',allLogs);
							console.log(JSON.parse(uni.getStorageSync('log')),'dudu11111')
							
							
							
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
			// 去重
		repeatTheMacvalue(a){   // 针对上海越平的
			
				// let a = '7.177.17222287.177.077.077.077.077.077.076.976.976.976.976.976.976.876.876.876.8'
				let b =	a.substring(a.lastIndexOf('.'), a.length);			
				let newStr = a.substring(0, a.length - b.length)
				let c = newStr.substring(newStr.lastIndexOf('.'), newStr.length);
				
					console.log(b)
					console.log(c)
					console.log(c+b)
					let d = c + b
					let res = d.substring(b.length)
					console.log(res)
					return res
			},
		 tableEvents(p) {	
				let that = this
				
				// console.log(p, 111111111111111111111); 
				if(p.eventsName == 'cell-click'){
					this.rowIndex = p.param.$rowIndex
					this.checkedRow = p.param.visibleData[p.param.$rowIndex]
					// console.log(this.checkedRow)
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
							that.$nextTick(() => {
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

				//新增天平数据  fensai fenxin
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
						_this.lastTapTimeoutFunc = setTimeout(() => {
							that.writeBLECharacteristicValue()
							setTimeout(() => {
								that.$refs.table.callMethods("getData").then(res =>{
									console.log(that.macValue,'没有处理的value')
									// that.macValue = that.macValue.replace(/\s*/g, "").replace('g', '').replace('SS', '')        旧的日志
									that.macValue = that.macValue.replace(/[^\d\.]/g, "")
									// that.macValue = that.repeatTheMacvalue(that.macValue)  // 针对上海越平的
										console.log(that.macValue)
										if (that.macValue == '') return
										// that.$set(that.data[p.param.seq - 1], p.param.column.field, that.macValue)
										that.$set(res[p.param.seq - 1], p.param.column.field, that.macValue)
										// console.log(res,'11111111111111111111111111111')
										that.$nextTick(() => {
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
						// console.log(that.data)                                    
						// console.log(p,'111111111111111111')
						// that.$refs.table.callMethods("getData").then(res =>{
						// console.log(res)	
						// 这里可能还有问题，还有其它解决办法。可以根据p.param.row 来判定
						console.log(p.param.column.field, p.param.seq)
						// console.log(that.data[p.param.seq - 1].testinfo_1)
						console.log(p.param.items[p.param.seq - 1],'p.param.items')
						// let testcodeData = that.data[p.param.seq - 1].testinfo_1 
						let testcodeData = p.param.items[p.param.seq - 1].testinfo_1    
						console.log(p.param,'param') 
						console.log(that.data,'thatData')
						console.log(that.data[p.param.seq - 1],'that.data[p.param.seq - 1]')
						console.log(testcodeData,'testcodeData')
						
										
						that.initTable.columns.find(item => {
							if (item.children) {
								item.children[1].editRender.options = []
								if ((item.children[1].field).search('testcodes') !== -1) {
									let obj = {}
									testcodeData.forEach(itm => {
										obj = {
											label: itm.testno,
											value: itm.testcode
										}
										item.children[1].editRender.options.push(obj)
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
						// console.log(newcol,'111111111111111111111111111111111111111111111111111111111111111111111')
						that.$nextTick(() =>{
						that.$refs.table.setTableProps({
							loading: false,
							columns: newcol
							
						})														
					})
					
				}
			},
			deleteColumn(){
				let that = this
				this.$refs.table.callMethods("getData").then(res =>{
					console.log(this.chooseColumn)
					if(this.chooseColumn == null){
						uni.showToast({
							title: '请先选择列！',
							duration: 2000, //单位毫秒,
							icon: 'loading'
						});
						return
					}
					for(let i = 0;i<this.initTable.columns.length;i++){
						if(this.initTable.columns[i].title == this.chooseColumn.title){
							this.initTable.columns.splice(i,1)
								console.log(this.initTable.columns)
						}
					}
					let lastnum = this.chooseColumn.title.substr(this.chooseColumn.title.length - 1,1)
					console.log(lastnum)
					res.forEach(item =>{
						for(let key in item){
							if(key.substr(key.length-1,1) == lastnum){
								// console.log(key)
								this.$delete(item,key)
							}
						}
					})
					// console.log(res)
					console.log(this.initTable.columns)
					that.$refs.table.setTableProps({
					loading: false,
					columns: that.initTable.columns,
					data:res
					})
					this.chooseColumn = null
				})
			},
			
			changeOperaSon(e) {
				

			},
		async returnNewOrder(a,b,c,d){
				return new Promise(resolve =>{
					uni.request({
														method: "post",
														sslVerify: false,
														url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
														contentType: "application/json",
														header: {
															'Content-Type': 'application/soap+xml; charset=utf-8',
															'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
														},
														data: `<?xml version="1.0" encoding="utf-8"?>
					<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
					    <soap12:Body>
					        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
					            <actionID>CTI.AddOrdersToJson</actionID>
					            <parameters xsi:type="xsd:groups">
								<anyType xsi:type="xsd:string">${a}</anyType>
									<anyType xsi:type="xsd:string">${b}</anyType>
					                <anyType xsi:type="xsd:string">${c}</anyType>
					                <anyType xsi:type="xsd:string">${d}</anyType>
					            </parameters>
					            <UserName>${this.webaccount}</UserName>
					            <Password>${this.webpassword}</Password>
					        </RunActionDirect>
					    </soap12:Body>
					</soap12:Envelope>`,
														success: (res) => {									
															console.log(res)
															if (res.statusCode == 200) {
										let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
										console.log(str1,'打印出来是字符还是ascii码')
										let str2 = res.data.indexOf('</RunActionDirectResult>')
										let str = res.data.substring(str1 + 45 ,str2)
										// console.log(str)
										str = eval('(' + str + ')')
										console.log(str,'strstrstrstrstr')
										console.log(str.newordno,'newordno')						
										
															
																if (!str.newordno) {
																	uni.showToast({
																		title: '暂无数据暂无数据？！',
																		duration: 2000, //单位毫秒，
																		icon: 'loading'
																	});
																	return
																}
																
											resolve(str.newordno)				
																
															} else {
																uni.showToast({
																	title: '网络错误500！',
																	duration: 2000 //单位毫秒
																});
															}
					
														},
														fail: (err) => {
															console.log(err)
															uni.showToast({
																title: '请求失败？！',
																duration: 2000, //单位毫秒,
																icon: 'loading'
															});
					
														}
													});
				})
				
			},
			
			//新增平行样或子样
			changeOpera(e) {
							
				let that = this
				uni.showModal({
					title: '注意',
					content: '是否确定添加行（一经添加，无法删除）',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							console.log(e,'选中的行数据。')
							console.log(this.checkedRow)
							if(JSON.stringify(this.checkedRow) == '[]'){
								uni.showToast({
									title: '请选择行！',
									duration: 2000, //单位毫秒,
									icon: 'loading'
								});
								return
							}
							
							let strServgrp = JSON.stringify(this.checkedRow.servgrp)
							console.log(this.checkedRow.ordno,this.checkedRow.method,strServgrp,'传入的参数')
							this.$refs.table.callMethods("getData").then(res =>{
								if (e.value == '样品质量') {						
								} else if (e.value == '平行样质量') {
									// 发送请求
														uni.showLoading({
															title:"正在添加",
															mask:true								
														})
														uni.request({
																	method: "post",
																	sslVerify: false,
																	url:  `${that.webserve}`, //接口地址，后面加上 /方法名即可
																	contentType: "application/json",
																	header: {
																		'Content-Type': 'application/soap+xml; charset=utf-8',
																		'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
																	},
																	data: `<?xml version="1.0" encoding="utf-8"?>
									<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
									    <soap12:Body>
									        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
									            <actionID>CTI.AddOrdersToJson</actionID>
									            <parameters xsi:type="xsd:groups">
												<anyType xsi:type="xsd:string">${that.checkedRow.ordno}</anyType>
													<anyType xsi:type="xsd:string">${that.checkedRow.method}</anyType>
									                <anyType xsi:type="xsd:string">${that.checkedRow.servgrp}</anyType>
									                <anyType xsi:type="xsd:string">P</anyType>
									            </parameters>
									            <UserName>${this.webaccount}</UserName>
									            <Password>${this.webpassword}</Password>
									        </RunActionDirect>
									    </soap12:Body>
									</soap12:Envelope>`,
																		success: (result) => {									
																			console.log(result)
																			if (result.statusCode == 200) {
																				uni.hideLoading()
														let str1 = result.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
														console.log(str1,'打印出来是字符还是ascii码')
														let str2 = result.data.indexOf('</RunActionDirectResult>')
														let str = result.data.substring(str1 + 45 ,str2)
														// console.log(str)
														str = eval('(' + str + ')')
														console.log(str,'strstrstrstrstr')
														console.log(str.newordno,'newordno')	
														if (!str.newordno) {
															uni.showToast({
																title: '暂无数据暂无数据？！',
																duration: 2000, //单位毫秒，
																icon: 'loading'
															});
															return
														}					
														
														console.log(that.checkedRow,'this')
														for(let k in that.checkedRow){
															// console.log(k)
															
															if(k.startsWith('ordertype')){
																 that.$set(that.checkedRow,k,'P')							 
															}	
															if(k == 'ordersort'){
																that.$set(that.checkedRow,k,that.checkedRow[k] + 1)
															}
															if(k.search('isnew') !== -1){
																that.$set(that.checkedRow,k,1)							 
															}
															if(k == 'shortordno'){
																// console.log(k)							
																that.$set(that.checkedRow,k,str.newordno)
																// this.leijiaNumP++			
															}
														}
																			
														console.log(that.checkedRow)					
														// this.$refs.table.callMethods("insert", this.checkedRow).then(res1 =>{
															// console.log(res1) 
															res.splice(that.rowIndex + 1,0,that.checkedRow)
															// res.unshift(this.checkedRow)
															console.log(res)
															that.$nextTick(() => {
																that.$refs.table.setTableProps({
																	loading: false,
																	data: res,
																})				
															})
															
															that.data = res 
															this.seleteAll()  
														// })
														console.log(that.data,'添加完后的数据')																																	
																			} else {
																				uni.showToast({
																					title: '网络错误500！',
																					duration: 2000 //单位毫秒
																				});
																			}
									
																		},
																		fail: (err) => {
																			console.log(err)
																			uni.showToast({
																				title: '请求失败？！',
																				duration: 2000, //单位毫秒,
																				icon: 'loading'
																			});
									
																		}
																	});
									
									
									
								// 	return
								// 	for(let k in this.checkedRow){
								// 		// console.log(k)
										
								// 		if(k.startsWith('ordertype')){
								// 			 this.$set(this.checkedRow,k,'P')							 
								// 		}	
								// 		if(k == 'ordersort'){
								// 			this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
								// 		}
								// 		if(k.search('isnew') !== -1){
								// 			this.$set(this.checkedRow,k,1)							 
								// 		}
								// 		if(k == 'shortordno'){
								// 			// console.log(k)							
								// 			this.$set(this.checkedRow,k,this.checkedRow[k] + '/P' + this.leijiaNumP)
								// 			// this.leijiaNumP++			
								// 		}
								// 	}					
								// 	console.log(this.checkedRow)					
								// 	// this.$refs.table.callMethods("insert", this.checkedRow).then(res1 =>{
								// 		// console.log(res1) 
								// 		res.splice(this.rowIndex + 1,0,this.checkedRow)
								// 		// res.unshift(this.checkedRow)
								// 		console.log(res)
								// 		that.$nextTick(function() {
								// 			this.$refs.table.setTableProps({
								// 				loading: false,
								// 				data: res,
								// 			})				
								// 		})
								// 		that.data = res
								// 	// })
								// 	console.log(this.data)    //  
								} else if (e.value == '加标样质量') {
														uni.showLoading({
															title:"正在添加",
															mask:true								
														})
														uni.request({
																method: "post",
																sslVerify: false,
																url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
																contentType: "application/json",
																header: {
																	'Content-Type': 'application/soap+xml; charset=utf-8',
																	'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
																},
																data: `<?xml version="1.0" encoding="utf-8"?>
							<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
							    <soap12:Body>
							        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
							            <actionID>CTI.AddOrdersToJson</actionID>
							            <parameters xsi:type="xsd:groups">
										<anyType xsi:type="xsd:string">${that.checkedRow.ordno}</anyType>
											<anyType xsi:type="xsd:string">${that.checkedRow.method}</anyType>
							                <anyType xsi:type="xsd:string">${that.checkedRow.servgrp}</anyType>
							                <anyType xsi:type="xsd:string">J</anyType>
							            </parameters>
							            <UserName>${this.webaccount}</UserName>
							            <Password>${this.webpassword}</Password>
							        </RunActionDirect>
							    </soap12:Body>
							</soap12:Envelope>`,
															success: (result) => {									
															console.log(result)
															if (result.statusCode == 200) {
															uni.hideLoading()
															let str1 = result.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
															console.log(str1,'打印出来是字符还是ascii码')
															let str2 = result.data.indexOf('</RunActionDirectResult>')
															let str = result.data.substring(str1 + 45 ,str2)
															
															str = eval('(' + str + ')')
															console.log(str,'strstrstrstrstr')
															console.log(str.newordno,'newordno')	
															if (!str.newordno) {
																uni.showToast({
																	title: '暂无数据暂无数据？！',
																	duration: 2000, //单位毫秒，
																	icon: 'loading'
																});
																return
															}																			
															// console.log(this.checkedRow,'this')
															for(let k in this.checkedRow){
																// console.log(k)
																if(k.startsWith('ordertype')){
																	 this.$set(this.checkedRow,k,'J')
																	  this.$set(this.checkedRow,'isnew',1)						 
																}
																if(k == 'ordersort'){
																	this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
																}
																if(k.search('isnew') !== -1){
																	this.$set(this.checkedRow,k,1)							 
																}
																if(k == 'shortordno'){
																	// console.log(k)							
																	this.$set(this.checkedRow,k,str.newordno)															
																}					
															}
															// console.log(this.checkedRow)		
															res.splice(this.rowIndex + 1,0,this.checkedRow)
															// res.unshift(this.checkedRow)
															console.log(res,'加标样质量')
															that.$nextTick(() => {
																this.$refs.table.setTableProps({
																	loading: false,
																	data: res,
																})				
															})
															that.data = res
															this.seleteAll()	 		
																																										
																				} else {
																					uni.showToast({
																						title: '网络错误500！',
																						duration: 2000 //单位毫秒
																					});
																				}
										
																			},
																			fail: (err) => {
																				console.log(err)
																				uni.showToast({
																					title: '请求失败？！',
																					duration: 2000, //单位毫秒,
																					icon: 'loading'
																				});
										
																			}
																		});
									
									
									
									
									
									// for(let k in this.checkedRow){
									// 	// console.log(k)
									// 	if(k.startsWith('ordertype')){
									// 		 this.$set(this.checkedRow,k,'J')
									// 		  this.$set(this.checkedRow,'isnew',1)						 
									// 	}
									// 	if(k == 'ordersort'){
									// 		this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
									// 	}
									// 	if(k.search('isnew') !== -1){
									// 		this.$set(this.checkedRow,k,1)							 
									// 	}
									// 	if(k == 'shortordno'){
									// 		// console.log(k)							
									// 		this.$set(this.checkedRow,k,this.checkedRow[k] + '/J' + this.leijiaNumJ)
									// 		this.leijiaNumJ++			
									// 	}					
									// }
									// // console.log(this.checkedRow)		
									// res.splice(this.rowIndex + 1,0,this.checkedRow)
									// // res.unshift(this.checkedRow)
									// console.log(res,'加标样质量')
									// that.$nextTick(function() {
									// 	this.$refs.table.setTableProps({
									// 		loading: false,
									// 		data: res,
									// 	})				
									// })
									// that.data = res
								} else if (e.value == '空白样') {
									
																uni.showLoading({
																	title:"正在添加",
																	mask:true								
																})
																uni.request({
																		method: "post",
																		sslVerify: false,
																		url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
																		contentType: "application/json",
																		header: {
																			'Content-Type': 'application/soap+xml; charset=utf-8',
																			'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
																		},
																		data: `<?xml version="1.0" encoding="utf-8"?>
									<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
									    <soap12:Body>
									        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
									            <actionID>CTI.AddOrdersToJson</actionID>
									            <parameters xsi:type="xsd:groups">
												<anyType xsi:type="xsd:string">${that.checkedRow.ordno}</anyType>
													<anyType xsi:type="xsd:string">${that.checkedRow.method}</anyType>
									                <anyType xsi:type="xsd:string">${that.checkedRow.servgrp}</anyType>
									                <anyType xsi:type="xsd:string">K</anyType>
									            </parameters>
									            <UserName>${this.webaccount}</UserName>
									            <Password>${this.webpassword}</Password>
									        </RunActionDirect>
									    </soap12:Body>
									</soap12:Envelope>`,
																		success: (result) => {									
																			console.log(result)
																			if (result.statusCode == 200) {
																				uni.hideLoading()
														let str1 = result.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
														console.log(str1,'打印出来是字符还是ascii码')
														let str2 = result.data.indexOf('</RunActionDirectResult>')
														let str = result.data.substring(str1 + 45 ,str2)
														// console.log(str)
														str = eval('(' + str + ')')
														console.log(str,'strstrstrstrstr')
														console.log(str.newordno,'newordno')	
														if (!str.newordno) {
															uni.showToast({
																title: '暂无数据暂无数据？！',
																duration: 2000, //单位毫秒，
																icon: 'loading'
															});
															return
														}					
														
														// console.log(this.checkedRow,'this')
														for(let k in this.checkedRow){
															// console.log(k)
															if(k.startsWith('ordertype')){
																 this.$set(this.checkedRow,k,'K')
																  this.$set(this.checkedRow,'isnew','1')							 
															}
															if(k == 'ordersort'){
																this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
															}
															if(k.search('isnew') !== -1){
																this.$set(this.checkedRow,k,1)							 
															}
															if(k == 'shortordno'){
																// console.log(k)							
																this.$set(this.checkedRow,k,str.newordno)		
															}					
														}
														console.log(this.checkedRow)					
														// this.$refs.table.callMethods("insert", this.checkedRow)
														res.splice(this.rowIndex + 1,0,this.checkedRow)
														// res.unshift(this.checkedRow)
														// console.log(res)
														that.$nextTick(() => {
															this.$refs.table.setTableProps({
																loading: false,
																data: res,
															})				
														})
														that.data = res
														// 做个记号     arithe
														this.seleteAll()	 																	
																			} else {
																				uni.showToast({
																					title: '网络错误500！',
																					duration: 2000 //单位毫秒
																				});
																			}
									
																		},
																		fail: (err) => {
																			console.log(err)
																			uni.showToast({
																				title: '请求失败？！',
																				duration: 2000, //单位毫秒,
																				icon: 'loading'
																			});						
																		}
																	});
									
									
									
									// for(let k in this.checkedRow){
									// 	if(k.startsWith('ordertype')){
									// 		 this.$set(this.checkedRow,k,'K')
									// 		  this.$set(this.checkedRow,'isnew','1')							 
									// 	}
									// 	if(k == 'ordersort'){
									// 		this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
									// 	}
									// 	if(k.search('isnew') !== -1){
									// 		this.$set(this.checkedRow,k,1)							 
									// 	}
									// 	if(k == 'shortordno'){
									// 		// console.log(k)							
									// 		this.$set(this.checkedRow,k,this.checkedRow[k] + '/K' + this.leijiaNumK)
									// 		this.leijiaNumK++			
									// 	}					
									// }
									// console.log(this.checkedRow)		//xiti zijixianzuoyibian ranhoukehouxititiaozhezuo 			
									// // this.$refs.table.callMethods("insert", this.checkedRow)
									// res.splice(this.rowIndex + 1,0,this.checkedRow)
									// that.$nextTick(function() {
									// 	this.$refs.table.setTableProps({
									// 		loading: false,
									// 		data: res,
									// 	})				
									// })
									// that.data = res    // cratic guanliaode
								} else if (e.value == '~标样质量') {
																
																uni.showLoading({
																	title:"正在添加",
																	mask:true								
																})
																uni.request({
																		method: "post",
																		sslVerify: false,
																		url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
																		contentType: "application/json",
																		header: {
																			'Content-Type': 'application/soap+xml; charset=utf-8',
																			'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
																		},
																		data: `<?xml version="1.0" encoding="utf-8"?>
									<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
									    <soap12:Body>
									        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
									            <actionID>CTI.AddOrdersToJson</actionID>
									            <parameters xsi:type="xsd:groups">
												<anyType xsi:type="xsd:string">${that.checkedRow.ordno}</anyType>
													<anyType xsi:type="xsd:string">${that.checkedRow.method}</anyType>
									                <anyType xsi:type="xsd:string">${that.checkedRow.servgrp}</anyType>
									                <anyType xsi:type="xsd:string">B</anyType>
									            </parameters>
									            <UserName>${this.webaccount}</UserName>
									            <Password>${this.webpassword}</Password>
									        </RunActionDirect>
									    </soap12:Body>
									</soap12:Envelope>`,
																		success: (result) => {									
																			console.log(result)
																			if (result.statusCode == 200) {
																				uni.hideLoading()
														let str1 = result.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
														console.log(str1,'打印出来是字符还是ascii码')
														let str2 = result.data.indexOf('</RunActionDirectResult>')
														let str = result.data.substring(str1 + 45 ,str2)
														// console.log(str)
														str = eval('(' + str + ')')
														console.log(str,'strstrstrstrstr')
														console.log(str.newordno,'newordno')	
														if (!str.newordno) {
															uni.showToast({
																title: '暂无数据暂无数据？！',
																duration: 2000, //单位毫秒，
																icon: 'loading'
															});
															return
														}					
														
														console.log(this.checkedRow,'this')
														for(let k in this.checkedRow){
															// console.log(k)
															if(k.startsWith('ordertype')){
																 this.$set(this.checkedRow,k,'B')
																  this.$set(this.checkedRow,'isnew','1')							 
															}
															if(k == 'ordersort'){
																this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
															}
															if(k.search('isnew') !== -1){
																this.$set(this.checkedRow,k,1)							 
															}
															if(k == 'ordno'){
																// console.log(k)							
																this.$set(this.checkedRow,k,str.newordno)		
															}					
														}
														// console.log(this.checkedRow)					
														// this.$refs.table.callMethods("insert", this.checkedRow)
														res.splice(this.rowIndex + 1,0,this.checkedRow)
														// res.unshift(this.checkedRow)
														// console.log(res)
														that.$nextTick(() => {
															this.$refs.table.setTableProps({
																loading: false,
																data: res,
															})				
														})
														that.data = res
																			
																																		
																			} else {
																				uni.showToast({
																					title: '网络错误500！',
																					duration: 2000 //单位毫秒
																				});
																			}				
																		},
																		fail: (err) =>{
																			console.log(err)
																			uni.showToast({
																				title: '请求失败？！',
																				duration: 2000, //单位毫秒,
																				icon: 'loading'
																			});						
																		}
																	});
								} else if (e.value == '子样质量') {
									
																uni.showLoading({
																	title:"正在添加",
																	mask:true								
																})
																uni.request({
																		method: "post",
																		sslVerify: false,
																		url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
																		contentType: "application/json",
																		header: {
																			'Content-Type': 'application/soap+xml; charset=utf-8',
																			'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
																		},
																		data: `<?xml version="1.0" encoding="utf-8"?>
									<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
									    <soap12:Body>
									        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
									            <actionID>CTI.AddOrdersToJson</actionID>
									            <parameters xsi:type="xsd:groups">
												<anyType xsi:type="xsd:string">${that.checkedRow.ordno}</anyType>
													<anyType xsi:type="xsd:string">${that.checkedRow.method}</anyType>
									                <anyType xsi:type="xsd:string">${that.checkedRow.servgrp}</anyType>
									                <anyType xsi:type="xsd:string">S</anyType>
									            </parameters>
									            <UserName>${this.webaccount}</UserName>
									            <Password>${this.webpassword}</Password>
									        </RunActionDirect>
									    </soap12:Body>
									</soap12:Envelope>`,
																		success: (result) => {									
																			console.log(result)
																			if (result.statusCode == 200) {
																				uni.hideLoading()
														let str1 = result.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
														console.log(str1,'打印出来是字符还是ascii码')
														let str2 = result.data.indexOf('</RunActionDirectResult>')
														let str = result.data.substring(str1 + 45 ,str2)
														// console.log(str)
														str = eval('(' + str + ')')
														console.log(str,'strstrstrstrstr')
														console.log(str.newordno,'newordno')	
														if (!str.newordno) {
															uni.showToast({
																title: '暂无数据暂无数据？！',
																duration: 2000, //单位毫秒，
																icon: 'loading'
															});
															return
														}					
														
														// console.log(this.checkedRow,'this')
														for(let k in this.checkedRow){
															// console.log(k)
															if(k.startsWith('ordertype')){
																 this.$set(this.checkedRow,k,'S')
																  this.$set(this.checkedRow,'isnew','1')							 
															}
															if(k == 'ordersort'){
																this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
															}
															if(k.search('isnew') !== -1){
																this.$set(this.checkedRow,k,1)							 
															}
															if(k == 'shortordno'){
																// console.log(k)							
																this.$set(this.checkedRow,k,str.newordno)		
															}					
														}
														// console.log(this.checkedRow)					
														// this.$refs.table.callMethods("insert", this.checkedRow)
														res.splice(this.rowIndex + 1,0,this.checkedRow)
														// res.unshift(this.checkedRow)
														// console.log(res)
														that.$nextTick(() =>{
															this.$refs.table.setTableProps({
																loading: false,
																data: res,
															})				
														})
														that.data = res
														this.seleteAll()					
																																		
																			} else {  
																				uni.showToast({
																					title: '网络错误500！',
																					duration: 2000 //单位毫秒
																				});
																			}				
																		},
																		fail: (err) => {
																			console.log(err)
																			uni.showToast({
																				title: '请求失败？！',
																				duration: 2000, //单位毫秒,
																				icon: 'loading'
																			});						
																		}
																	});
									
									
									// for(let k in this.checkedRow){
									// 	console.log(k)
									// 	if(k.startsWith('ordertype')){
									// 		 this.$set(this.checkedRow,k,'S')
									// 		  this.$set(this.checkedRow,'isnew','1')							 
									// 	}
									// 	if(k == 'ordersort'){
									// 		this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
									// 	}
									// 	if(k.search('isnew') !== -1){
									// 		this.$set(this.checkedRow,k,1)							 
									// 	}
									// 	if(k == 'shortordno'){
									// 		// console.log(k)							
									// 		this.$set(this.checkedRow,k,this.checkedRow[k] + '/S' + this.leijiaNumS)
									// 		this.leijiaNumS++			
									// 	}					
									// }
									// // console.log(this.checkedRow)					
									// // this.$refs.table.callMethods("insert", this.checkedRow)
									// res.splice(this.rowIndex + 1,0,this.checkedRow)
									// // res.unshift(this.checkedRow)
									// // console.log(res)
									// that.$nextTick(function() {
									// 	this.$refs.table.setTableProps({
									// 		loading: false,
									// 		data: res,
									// 	})				
									// })
									// that.data = res
								} else if (e.value == '空白加标样') {
									
									uni.showLoading({
																	title:"正在添加",
																	mask:true								
																})
																uni.request({
																		method: "post",
																		sslVerify: false,
																		url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
																		contentType: "application/json",
																		header: {
																			'Content-Type': 'application/soap+xml; charset=utf-8',
																			'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
																		},
																		data: `<?xml version="1.0" encoding="utf-8"?>
									<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
									    <soap12:Body>
									        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
									            <actionID>CTI.AddOrdersToJson</actionID>
									            <parameters xsi:type="xsd:groups">
												<anyType xsi:type="xsd:string">${that.checkedRow.ordno}</anyType>
													<anyType xsi:type="xsd:string">${that.checkedRow.method}</anyType>
									                <anyType xsi:type="xsd:string">${that.checkedRow.servgrp}</anyType>
									                <anyType xsi:type="xsd:string">BJ</anyType>
									            </parameters>
									            <UserName>${this.webaccount}</UserName>
									            <Password>${this.webpassword}</Password>
									        </RunActionDirect>
									    </soap12:Body>
									</soap12:Envelope>`,
																		success: (result) => {									
																			console.log(result)
																			if (result.statusCode == 200) {
																				uni.hideLoading()
														let str1 = result.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
														console.log(str1,'打印出来是字符还是ascii码')
														let str2 = result.data.indexOf('</RunActionDirectResult>')
														let str = result.data.substring(str1 + 45 ,str2)
														// console.log(str)
														str = eval('(' + str + ')')
														console.log(str,'strstrstrstrstr')
														console.log(str.newordno,'newordno')	
														if (!str.newordno) {
															uni.showToast({
																title: '暂无数据暂无数据？！',
																duration: 2000, //单位毫秒，
																icon: 'loading'
															});
															return
														}					
														
														// console.log(this.checkedRow,'this')
														for(let k in this.checkedRow){
															// console.log(k)
															if(k.startsWith('ordertype')){
																 this.$set(this.checkedRow,k,'BJ')
																  this.$set(this.checkedRow,'isnew','1')							 
															}	
															if(k == 'ordersort'){
																this.$set(this.checkedRow,k,this.checkedRow[k] + 1)
															}
															if(k.search('isnew') !== -1){
																this.$set(this.checkedRow,k,1)							 
															}
															if(k == 'ordno'){
																// console.log(k)							
																this.$set(this.checkedRow,k,str.newordno)		
															}				
														}
														// console.log(this.checkedRow)					
														// this.$refs.table.callMethods("insert", this.checkedRow)
														res.splice(this.rowIndex + 1,0,this.checkedRow)
														// res.unshift(this.checkedRow)
														// console.log(res)
														that.$nextTick(() => {
															this.$refs.table.setTableProps({
																loading: false,
																data: res,
															})				
														})
														that.data = res
																			
																																		
																			} else {
																				uni.showToast({
																					title: '网络错误500！',
																					duration: 2000 //单位毫秒
																				});
																			}				
																		},
																		fail: (err) => {
																			console.log(err)
																			uni.showToast({
																				title: '请求失败？！',
																				duration: 2000, //单位毫秒,
																				icon: 'loading'
																			});						
																		}
																	});
																	
								}
								
							})			
							return
							let arritm = []
							that.initTable.columns.forEach(itm => {
								if (itm.title.search(e.value) !== -1 && itm.title.substr(-4, 1) == 1) {
									arritm.push(itm)
									console.log(arritm)
								}
							})
							console.log(arritm.length)
							let columnfieldName
							let remarkName
							let ordersortName
							let ordertypeName
							if (e.value == '样品质量') {
								columnfieldName = 'orderweight__'
								remarkName = 'testcodes__'
								ordersortName = 'ordersort__'
								ordertypeName = 'ordertype__'
							} else if (e.value == '平行样质量') {
								columnfieldName = 'orderweight_P_'
								remarkName = 'testcodes_P_'
								ordersortName = 'ordersort_P_'
								ordertypeName = 'ordertype_P_'
							} else if (e.value == '加标样质量') {
								columnfieldName = 'orderweight_J_'
								remarkName = 'testcodes_J_'
								ordersortName = 'ordersort_J_'
								ordertypeName = 'ordertype_J_'
							} else if (e.value == '空白样') {
								columnfieldName = 'orderweight_K_'
								remarkName = 'testcodes_K_'
								ordersortName = 'ordersort_K_'
								ordertypeName = 'ordertype_K_'
							} else if (e.value == '~标样质量') {
								columnfieldName = 'orderweight_B_'
								remarkName = 'testcodes_B_'
								ordersortName = 'ordersort_B_'
								ordertypeName = 'ordertype_B_'
							} else if (e.value == '子样质量') {
								columnfieldName = 'orderweight_S_'
								remarkName = 'testcodes_S_'
								ordersortName = 'ordersort_S_'
								ordertypeName = 'ordertype_S_'
							} else if (e.value == '空白加标样') {
								columnfieldName = 'orderweight_BJ_'
								remarkName = 'testcodes_BJ_'
								ordersortName = 'ordersort_BJ_'
								ordertypeName = 'ordertype_BJ_'
							}
							console.log(columnfieldName, remarkName)
							//现在只知道名字叫平行样，不知道字段是什么  temp 
							
							
							let addNewcolumn = {
								title: `${e.value}${arritm.length + 1}-1(g)`,
								width: 120,
								children: [{
										field: `${columnfieldName}${arritm.length + 1}_1`,
										title: `质量${arritm.length + 1}-1(g)`,
										width: 50,
										editRender: {
											name: "input",
											props: {
												type: "input"
											}
										}
									},
									{
										field: `${remarkName}${arritm.length + 1}_1`,
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
									},
								]
							}
							that.initTable.columns.push(addNewcolumn)
							//添加列后，所有字段属性值为空
							let type = ''
							if (addNewcolumn.children[0].field.search(columnfieldName) !== -1 && addNewcolumn.children[0].field.search(
									'BJ') == -1) {
								type = addNewcolumn.children[0].field.slice(12, 13)
								if (type == '_') {
									type = '';
								}
								console.log(type)
								for (let i = 0; i < that.data.length; i++) {
									that.$set(that.data[i], `${columnfieldName}${arritm.length + 1}_1`, '')
									that.$set(that.data[i], `${remarkName}${arritm.length + 1}_1`, '')
									that.$set(that.data[i], `${ordersortName}${arritm.length + 1}_1`, `${arritm.length + 1}`)
									that.$set(that.data[i], `${ordertypeName}${arritm.length + 1}_1`, `${type}`)
								}
							} else {
								type = 'BJ'
								for (let i = 0; i < that.data.length; i++) {
									that.$set(that.data[i], `${columnfieldName}${arritm.length + 1}_1`, '')
									that.$set(that.data[i], `${remarkName}${arritm.length + 1}_1`, '')
									that.$set(that.data[i], `${ordersortName}${arritm.length + 1}_1`, `${arritm.length + 1}`)
									that.$set(that.data[i], `${ordertypeName}${arritm.length + 1}_1`, `${type}`)
								}
							}
							console.log(that.data)
							console.log(that.initTable.columns)
							that.$refs.table.setTableProps({
								loading: false,
								columns: that.initTable.columns,
								data: that.data
							})
							
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
				
				
				
				

			},

		 slotEvents(p) {
			 this.$refs.table.callMethods("getData").then(res =>{
				 console.log(res)
				 // console.log(p);
				 //新增 子样列
				 let that = this
				
				 // console.log(p[0])
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
				 
				 
				 
				 return
				 //添加平行样 ，先找到最近添加的平行样是多少，为其添加字样。 "样品质量3-1(g)" 样品质量3-2(g) 首先要先找到是质量几，再判断x_x
				 let arritm = []
				 let arritmWith = []
				 // 获取标样的长度，计算该往那个长度后面加 如  1-1 2-1 3-1
				 that.initTable.columns.forEach(itm => {
				 	if (itm.title.search(e.value) !== -1 && itm.title.substr(-4, 1) == 1) {
				 		console.log(itm.title)
				 		arritm.push(itm)
				 		console.log(arritm)
				 	}
				 
				 })
				 //计算需要加入第几位标样。 如 1-1 1-2 1-3 1-4
				 that.initTable.columns.forEach(itm => {
				 	if (itm.title.search(`${e.value}${arritm.length}-`) !== -1) {
				 		console.log(itm.title)
				 		arritmWith.push(itm)
				 		console.log(arritmWith)
				 	}
				 })
				 			
				 console.log(arritm.length)
				 console.log(arritmWith.length)
				 if (arritm.length == 0) {
				 	console.log('请添加主样')
				 	uni.showToast({
				 		title: '请添加主样！',
				 		duration: 2000, //单位毫秒,
				 		icon: 'loading'
				 	});
				 	return
				 }
				 
				 let columnfieldName
				 let remarkName
				 let ordersortName
				 let ordertypeName
				 if (e.value == '样品质量') {
				 	columnfieldName = `orderweight__${arritm.length}_`
				 	remarkName = `testcodes__${arritm.length}_`
				 	ordersortName = `ordersort__${arritm.length}_`
				 	ordertypeName = `ordertype__${arritm.length}_`
				 } else if (e.value == '平行样质量') {
				 	columnfieldName = `orderweight_P_${arritm.length}_`
				 	remarkName = `testcodes_P_${arritm.length}_`
				 	ordersortName = `ordersort_P_${arritm.length}_`
				 	ordertypeName = `ordertype_P_${arritm.length}_`
				 } else if (e.value == '加标样质量') {
				 	columnfieldName = `orderweight_J_${arritm.length}_`
				 	remarkName = `testcodes_J_${arritm.length}_`
				 	ordersortName = `ordersort_J_${arritm.length}_`
				 	ordertypeName = `ordertype_J_${arritm.length}_`
				 } else if (e.value == '空白样') {
				 	columnfieldName = `orderweight_K_${arritm.length}_`
				 	remarkName = `testcodes_K_${arritm.length}_`
				 	ordersortName = `ordersort_K_${arritm.length}_`
				 	ordertypeName = `ordertype_K_${arritm.length}_`
				 } else if (e.value == '~标样质量') {
				 	columnfieldName = `orderweight_B_${arritm.length}_`
				 	remarkName = `testcodes_B_${arritm.length}_`
				 	ordersortName = `ordersort_B_${arritm.length}_`
				 	ordertypeName = `ordertype_B_${arritm.length}_`
				 } else if (e.value == '子样质量') {
				 	columnfieldName = `orderweight_S_${arritm.length}_`
				 	remarkName = `testcodes_S_${arritm.length}_`
				 	ordersortName = `ordersort_S_${arritm.length}_`
				 	ordertypeName = `ordertype_S_${arritm.length}_`
				 } else if (e.value == '空白加标样') {
				 	columnfieldName = `orderweight_BJ_${arritm.length}_`
				 	remarkName = `testcodes_BJ_${arritm.length}_`
				 	ordersortName = `ordersort_BJ_${arritm.length}_`
				 	ordertypeName = `ordertype_BJ_${arritm.length}_`
				 }
				 console.log(columnfieldName, remarkName)
				 let addNewcolumn1 = {
				 	title: `${e.value}${arritm.length}-${arritmWith.length + 1}(g)`,
				 	width: 120,
				 	children: [{
				 			field: `${columnfieldName}${arritmWith.length + 1}`,
				 			title: `质量${arritm.length}-${arritmWith.length + 1}(g)`,
				 			width: 50,
				 			editRender: {
				 				name: "input",
				 				props: {
				 					type: "input"
				 				}
				 			}
				 		},
				 		{
				 			field: `${remarkName}${arritmWith.length + 1}`,
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
				 		},
				 	]
				 }
				 that.initTable.columns.push(addNewcolumn1)
				 //添加列后，所有字段属性值为空
				 let type = ''
				 if (addNewcolumn.children[0].field.search(columnfieldName) !== -1 && addNewcolumn.children[0].field.search(
				 		'BJ') == -1) {
				 	type = addNewcolumn.children[0].field.slice(12, 13)
				 	if (type == '_') {
				 		type = '';
				 	}
				 	console.log(type)
				 	for (let i = 0; i < that.data.length; i++) {
				 		that.$set(that.data[i], `${columnfieldName}${arritmWith.length + 1}`, '')
				 		that.$set(that.data[i], `${remarkName}${arritmWith.length + 1}`, '')
				 		that.$set(that.data[i], `${ordersortName}${arritmWith.length + 1}`, `${arritm.length}`)
				 		that.$set(that.data[i], `${ordertypeName}${arritmWith.length + 1}`, `${type}`)
				 	}
				 } else {
				 	type = 'BJ'
				 	for (let i = 0; i < that.data.length; i++) {
				 		that.$set(that.data[i], `${columnfieldName}${arritmWith.length + 1}`, '')
				 		that.$set(that.data[i], `${remarkName}${arritmWith.length + 1}`, '')
				 		that.$set(that.data[i], `${ordersortName}${arritmWith.length + 1}`, `${arritm.length}`)
				 		that.$set(that.data[i], `${ordertypeName}${arritmWith.length + 1}`, `${type}`)
				 	}
				 }
				 
				 console.log(that.data)
				 console.log(that.initTable.columns)
				 that.$refs.table.setTableProps({
				 	loading: false,
				 	columns: that.initTable.columns,
				 	data: that.data
				 })
			 })
						
			},
			// 查询所有
			seleteAll(){	
				/* let L = [1,2,3,4,5,6]
				for(var j = L.length;j>=3;j--){
					console.log(j)
					L[j] = L[j-1]
					L[2] = 9
				}
				console.log(L,'lllll')	
				return */
				
								let that = this
								if (this.zubie == '空' || this.zubie == undefined) {
									this.zubie = ''
								}
								if (this.shortNO == '空' || this.shortNO == undefined) {
									this.shortNO = ''
								}
								
								
								const havezubie = uni.getStorageSync('havezubie')
								console.log(havezubie)
								if(havezubie){
									that.zubie = havezubie
								}else {
									that.zubie = ''
								}
								console.log(this.zubie, this.shortNO,this.dept)
								console.log(that.applicationNumberid)
								console.log(this.webaccount)
								that.data = []
								uni.showLoading({
									title:'努力加载中',
									icon:'loading',
									mask:true
								})
								//1 走两个接口 1
								console.log(this.webserve,'webserve')
								uni.request({
									method: "post",
									sslVerify: false,
									url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
									contentType: "application/json",
									header: {
										'Content-Type': 'application/soap+xml; charset=utf-8',
										'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
									},
									data: `<?xml version="1.0" encoding="utf-8"?>
				<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
				    <soap12:Body>
				        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
				            <actionID>CTI.GetOrdersWeightInfoNew</actionID>
				            <parameters xsi:type="xsd:groups">
							<anyType xsi:type="xsd:string">${that.applicationNumberidPIHAO}</anyType>
							<anyType xsi:type="xsd:string">${that.applicationNumberidDUANHAO}</anyType>
				                <anyType xsi:type="xsd:string">${that.applicationNumberid}</anyType>
				                <anyType xsi:type="xsd:string">${that.shortNO}</anyType>
				 <anyType xsi:type="xsd:string">${that.zubie}</anyType>
				 <anyType xsi:type="xsd:string">${that.dept}</anyType>
				            </parameters>
				           <UserName>${this.webaccount}</UserName>
				           <Password>${this.webpassword}</Password>
				        </RunActionDirect>
				    </soap12:Body>
				</soap12:Envelope>`,
									success: (res) => {
										// console.log(res) 
										if (res.statusCode == 200) {
											uni.hideLoading()
											// console.log(res.data)
											// let str1 =  res.data.match(/xsi:type="xsd:string">(\S*)</RunActionDirectResult>/);
											// 用 indexof 筛选字段
											let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
											console.log(str1,'打印出来是字符还是ascii码')
											let str2 = res.data.indexOf('</RunActionDirectResult>')
											let str = res.data.substring(str1 + 45 ,str2)
											// console.log(str)
											str = eval('(' + str + ')')
											console.log(str,'strstrstrstrstr')
											console.log(str.weight,'表格新内容') //bold 
											
											if(!str.weight){
												uni.showToast({
													title: str.message,
													duration: 2000 //单位毫秒
												});
												return
											}
										
											that.$nextTick(() => {							
												that.data = str.weight
												that.temporaryTableData = str.weight										
																															
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
													// console.log(99999999999999999999999) 添加平行样都在一行显示
													
														
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
										
												// console.log(that.initTable.columns)								
												console.log(that.cityName2)
												if(that.cityName2 != ''){
													let newData = 	that.data.filter(item =>{
																			return that.cityName2.indexOf(item.methodname) !== -1
																			// return item.methodname.indexOf(that.cityName2) !== -1
																		})
																		console.log(newData) 
																		// this.$nextTick(function() {
																			that.$refs.table.setTableProps({
																				loading: false,
																				data: newData,
																				columns: that.initTable.columns
																			})
																		uni.hideLoading()
																		// })
																		return 
												}
												that.$refs.table.setTableProps({
													loading: false,
													data: that.data,
													columns: that.initTable.columns
												})	
												uni.hideLoading()
												return new Promise(resolve =>{
													if(this.applicationNumberidPIHAO){
														this.doSearchPIHAO()
													}else if(this.applicationNumberidDUANHAO){
														this.doSearchDUANHAO()
													}else if(this.applicationNumberid){
														this.doSearch()
													}
												})
																																	
											})
										} else {
											uni.showToast({
												title: '网络错误，没有连接vpn？！',
												duration: 2000 //单位毫秒
											});
										}
				
									},
									fail: (err) => {
										console.log(err)
										uni.showToast({
											title: '网络错误，没有VPN？！',
											duration: 2000 //单位毫秒
										});
				
									}
								});
			},
			//查询表格 
			lookForTable() {	
				
				let that = this
				if (this.zubie == '空' || this.zubie == undefined) {
					this.zubie = ''
				}
				if (this.shortNO == '空' || this.shortNO == undefined) {
					this.shortNO = ''
				}
				
				// that.temporaryTableData = []				
				// 这里暂时注释。数据目前正常。 
				// const havezubie = uni.getStorageSync("havezubie")  // 
				// console.log(havezubie)
				// if(havezubie){
				// 	that.zubie = havezubie 
				// }else {
				// 	that.zubie = ''
				// } 
				    
				 
				console.log(this.zubie, this.shortNO,this.dept,'this.zubie, this.shortNO,this.dept')
				
				that.data = []
				uni.showLoading({
					title:'努力加载中',
					icon:'loading',
					mask:true
				})
				//1 走两个接口 1   
				
				uni.request({
					method: "post",
					sslVerify: false,
					url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
					contentType: "application/json",
					header: {
						'Content-Type': 'application/soap+xml; charset=utf-8',
						'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
					},
					data: `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
            <actionID>CTI.GetOrdersWeightInfoNew</actionID>
            <parameters xsi:type="xsd:groups">
			<anyType xsi:type="xsd:string">${that.applicationNumberidPIHAO}</anyType>
			<anyType xsi:type="xsd:string">${that.applicationNumberidDUANHAO}</anyType>
                <anyType xsi:type="xsd:string">${that.applicationNumberid}</anyType>
                <anyType xsi:type="xsd:string">${that.shortNO}</anyType>
 <anyType xsi:type="xsd:string">${that.zubie}</anyType>
 <anyType xsi:type="xsd:string">${that.dept}</anyType>
            </parameters>
           <UserName>${this.webaccount}</UserName>
           <Password>${this.webpassword}</Password>
        </RunActionDirect>
    </soap12:Body>
</soap12:Envelope>`,
					success: (res) => {
						// console.log(res) 
						if (res.statusCode == 200) {
							uni.hideLoading()
							// console.log(res.data)
							// let str1 =  res.data.match(/xsi:type="xsd:string">(\S*)</RunActionDirectResult>/);
							// 用 indexof 筛选字段
							let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
							console.log(str1,'打印出来是字符还是ascii码')
							let str2 = res.data.indexOf('</RunActionDirectResult>')
							let str = res.data.substring(str1 + 45 ,str2)
							// console.log(str)
							str = eval('(' + str + ')')
							console.log(str,'strstrstrstrstr')
							console.log(str.weight,'表格新内容') //bold 
							if(!str.weight){
								uni.showToast({
									title: str.message,
									duration: 2000 //单位毫秒
								});
								return
							}
							// console.log(that.getBracketStr(res.data))
							// if (that.getBracketStr(res.data) == null) {
							// 	uni.showToast({
							// 		title: '暂无数据暂无数据？！',
							// 		duration: 2000, //单位毫秒，
							// 		icon: 'loading'
							// 	});
							// 	return
							// }
							// console.log(eval('(' + that.getBracketStr(res.data) + ')'), '表格内容') 
							that.$nextTick(() => {							
								that.data = str.weight   
								
								// that.data = eval('(' + that.getBracketStr(res.data)[0] + ')')
								//根据表格内容添加列，遍历每一个对象。查看	每个对象的field 值。
								//判断 主要判断 orderweight__2 testcodes__2
								
								
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
									// console.log(99999999999999999999999) 添加平行样都在一行显示
									
										
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
						
								// console.log(that.initTable.columns)								
								console.log(that.cityName2,'this.cityName2')
									if(that.cityName2 != ''){
									let newData = that.data.filter(item =>{
															return that.cityName2.indexOf(item.methodname) !== -1
															// return item.methodname.indexOf(that.cityName2) !== -1
														})
														// that.temporaryTableData = newData   //记录选择方法后的零时表格数据
														console.log(newData,'111111111111111111111111111111newData') 
														// this.$nextTick(function() {
															that.$refs.table.setTableProps({
																loading: false,
																data: newData,
																columns: that.initTable.columns
															})
														uni.hideLoading()
														// })
														return 
								}
								
								that.$refs.table.setTableProps({
									loading: false,
									data: that.data,
									columns: that.initTable.columns
								})	
								uni.hideLoading()
										
							})
						} else {
							uni.showToast({
								title: '网络错误，没有连接vpn？！',
								duration: 2000 //单位毫秒
							});
						}

					},
					fail: (err) => {
						console.log(err)
						uni.showToast({
							title: '网络错误，没有VPN？！',
							duration: 2000 //单位毫秒
						});

					}
				});
			},
			close(){
				this.applicationNumberid = ''
				//  timber
				this.$nextTick(() =>{
					this.zubie = ''		
				})
			},
			close2(){
				this.applicationNumberidDUANHAO = ''
				this.$nextTick(() =>{
					this.zubie = ''				
				})
			},
			close3(){
				this.applicationNumberidPIHAO = ''
				this.$nextTick(() =>{
					this.zubie = ''
					
				})
			},
			change(e) {
				console.log(e)
				this.shortNO = e.data.shortordno
				this.remark = e.data.comments
				this.ypname = e.data.samplename
			},
			//选择组别 
			change1(e) {
				console.log(e) 
				this.zbname = e.data.servgrpname
				this.zubie = e.data.servgrpname
			},
			// 跳转 到电子天平页面
			goRecord(){
				uni.navigateTo({
					url:'/pages/record/record'
				})
			},
			//取出字符串里想要的内容
			getBracketStr(text) { 
				let regex = /\[(.+?)\]/g; 
				let options = text.match(regex) 
				// console.log(options)
				// let option = options[0]		        
				//     result = option.substring(1, option.length - 1)
				return options 
			},
			//扫描设备二维码
			ScaneqNQRcode() {
				let that = this
				uni.scanCode({
					success: (res) => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
						that.$nextTick(() => {
							that.equipmentName = res.result
							uni.setStorageSync('equipmentName', that.equipmentName);
						})
					}
				})
			},
			//扫描二维码
			ScanQRcode() {
				//扫码之前 保存之前的信息。
				// this.saveRow()
				let that = this
				// 允许从相机和相册扫码
				uni.scanCode({
					success: (res) => {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);

						// that.range = obj.department
						// console.log(that.range)
						that.$nextTick(() => {
							res.result.split('=')
							 // that.applicationNumberid = res.result.split('=')[1].replace('T', '')
							that.applicationNumberid = res.result.split('=')[1].replace('T', '').substring(0,17)
							console.log(that.applicationNumberid)
							that.shortNO = ''
							const havezubie = uni.getStorageSync('havezubie')
							console.log(havezubie)
							if(havezubie){
								that.zubie = havezubie
							}else {
								that.zubie = ''
							}
							
							that.chooseCityList = []
							that.cityData = []
							that.cityName = ''
							
							that.range = []
							that.range1 = []
							 console.log(this.zubie,'zubiezubie')
							if (that.applicationNumberid !== '') {
								uni.request({
									method: "post",
									sslVerify: false,
									url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
									contentType: "application/json",
									header: {
										'Content-Type': 'application/soap+xml; charset=utf-8',
										'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
									},
									data: `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
            <actionID>CTI.GetFoldersInfoNew</actionID>
            <parameters xsi:type="xsd:groups">
			<anyType xsi:type="xsd:string"></anyType>
				<anyType xsi:type="xsd:string"></anyType>
                <anyType xsi:type="xsd:string">${that.applicationNumberid}</anyType>
                <anyType xsi:type="xsd:string">${that.zubie}</anyType>
            </parameters>
            <UserName>${this.webaccount}</UserName>
            <Password>${this.webpassword}</Password>
        </RunActionDirect>
    </soap12:Body>
</soap12:Envelope>`,
									success: (res) => {									
										console.log(res)
										if (res.statusCode == 200) {
								
									let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
										console.log(str1,'打印出来是字符还是ascii码')
										let str2 = res.data.indexOf('</RunActionDirectResult>')
										let str = res.data.substring(str1 + 45 ,str2)
										// console.log(str)
										str = eval('(' + str + ')')
										console.log(str,'strstrstrstrstr')
										
										console.log(res.data)
									if (!str.result) {
											uni.showToast({
												title: '暂无数据暂无数据？！',
												duration: 2000,           //单位毫秒
												icon: 'loading'
											});
											return
										}
										
										that.$nextTick(()=> {
											
											that.range = str.orders
											console.log(that.range,'rangeeeeeeeeee')
											let weixuan = {
												"comments": "",
												"samplename": "空",
												"shortordno": "空"
											}
											that.range.unshift(weixuan)
									
											that.range1 = str.servgrps
											console.log(that.range1)
											let weixuan1 = {
												"servgrpcode": "空",
												"servgrpname": "空"
											}
											that.range1.unshift(weixuan1)										
												that.lookForTable()
											})
										} else {
											uni.showToast({
												title: '网络错误500！',
												duration: 2000 //单位毫秒
											});
										}

									},
									fail: (err) => {
										console.log(err)
										uni.showToast({
											title: '请求失败？！',
											duration: 2000, //单位毫秒,
											icon: 'loading'
										});

									}
								});
							}
						})


					}
				});
			},
			ScanQRcodeDUANHAO() {
							//扫码之前 保存之前的信息。
							// this.saveRow()
							let that = this
							// 允许从相机和相册扫码
							uni.scanCode({
								success: (res) => {
									console.log('条码类型：' + res.scanType);
									console.log('条码内容：' + res.result);
			
									// that.range = obj.department
									// console.log(that.range)
									that.$nextTick(() => { 
										res.result.split('=')
										that.applicationNumberidDUANHAO = res.result.split('=')[1].replace('T', '').substring(0,17)
										console.log(that.applicationNumberidDUANHAO)
										that.shortNO = ''
										const havezubie = uni.getStorageSync('havezubie')
										console.log(havezubie)
										if(havezubie){
											that.zubie = havezubie
										}else {
											that.zubie = ''
										}
										
										that.chooseCityList = []
										that.cityData = []
										that.cityName = ''
										
										that.range = []
										that.range1 = []
										 
										if (that.applicationNumberidDUANHAO !== '') {
											uni.request({
												method: "post",
												sslVerify: false,
												url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
												contentType: "application/json",
												header: {
													'Content-Type': 'application/soap+xml; charset=utf-8',
													'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
												},
												data: `<?xml version="1.0" encoding="utf-8"?>
			<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
			    <soap12:Body>
			        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
			            <actionID>CTI.GetFoldersInfoNew</actionID>
			            <parameters xsi:type="xsd:groups">
						<anyType xsi:type="xsd:string"></anyType>
							<anyType xsi:type="xsd:string">${that.applicationNumberidDUANHAO}</anyType>
			                <anyType xsi:type="xsd:string"></anyType>
			                <anyType xsi:type="xsd:string">${that.zubie}</anyType>
			            </parameters>
			            <UserName>${this.webaccount}</UserName>
			            <Password>${this.webpassword}</Password>
			        </RunActionDirect>
			    </soap12:Body>
			</soap12:Envelope>`,
												success: (res) => {												
													console.log(res)
													if (res.statusCode == 200) {
			// 											
			let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
				console.log(str1,'打印出来是字符还是ascii码')
				let str2 = res.data.indexOf('</RunActionDirectResult>')
				let str = res.data.substring(str1 + 45 ,str2)
				// console.log(str)
				str = eval('(' + str + ')')
				console.log(str,'strstrstrstrstr')
				
				console.log(res.data)
			if (!str.result) {
					uni.showToast({
						title: '暂无数据暂无数据？！',
						duration: 2000,           //单位毫秒
						icon: 'loading'
					});
					return
				}			
				that.$nextTick(()=> {
					that.range = str.orders
					console.log(that.range,'rangeeeeeeeeee')
					let weixuan = {
						"comments": "",
						"samplename": "空",
						"shortordno": "空"
					}
					that.range.unshift(weixuan)
					that.range1 = str.servgrps
					console.log(that.range1)
					let weixuan1 = {
						"servgrpcode": "空",
						"servgrpname": "空"
					}
					that.range1.unshift(weixuan1)
															
															that.lookForTable()
														})
													} else {
														uni.showToast({
															title: '网络错误500！',
															duration: 2000 //单位毫秒
														});
													}
			
												},
												fail: (err) => {
													console.log(err)
													uni.showToast({
														title: '请求失败？！',
														duration: 2000, //单位毫秒,
														icon: 'loading'
													});
			
												}
											});
										}
									})
			
			
								}
							});
						},
						ScanQRcodePIHAO() {
										//扫码之前 保存之前的信息。
										// this.saveRow()
										let that = this
										// 允许从相机和相册扫码
										uni.scanCode({
											success: (res) => {
												console.log('条码类型：' + res.scanType);
												console.log('条码内容：' + res.result);
						
								
												that.$nextTick(() => {
													res.result.split('=')
													that.applicationNumberidPIHAO = res.result.split('=')[1].replace('T', '').substring(0,17)
													console.log(that.applicationNumberidPIHAO)
													that.shortNO = ''
													const havezubie = uni.getStorageSync('havezubie')
													// console.log(havezubie)
													if(havezubie){
														that.zubie = havezubie
													}else {
														that.zubie = ''
													}
													
													that.chooseCityList = []
													that.cityData = []
													that.cityName = ''
													
													that.range = []
													that.range1 = []
													 
													if (that.applicationNumberidPIHAO !== '') {
														uni.request({
															method: "post",
															sslVerify: false,
															url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
															contentType: "application/json",
															header: {
																'Content-Type': 'application/soap+xml; charset=utf-8',
																'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
															},
															data: `<?xml version="1.0" encoding="utf-8"?>
						<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
						    <soap12:Body>
						        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
						            <actionID>CTI.GetFoldersInfoNew</actionID>
						            <parameters xsi:type="xsd:groups">
									<anyType xsi:type="xsd:string">${that.applicationNumberidPIHAO}</anyType>
										<anyType xsi:type="xsd:string"></anyType>
						                <anyType xsi:type="xsd:string"></anyType>
						                <anyType xsi:type="xsd:string">${that.zubie}</anyType>
						            </parameters>
						            <UserName>${this.webaccount}</UserName>
						            <Password>${this.webpassword}</Password>
						        </RunActionDirect>
						    </soap12:Body>
						</soap12:Envelope>`,
															success: (res) => {
																
																// console.log(res)
																if (res.statusCode == 200) {
																	 
																	// console.log(res.data)
						// 											if (that.getBracketStr(res.data) == null) {
						// 												uni.showToast({
						// 													title: '暂无数据暂无数据？！',
						// 													duration: 2000, //单位毫秒，
						// 													icon: 'loading'
						// 												});
						// 												return
						// 											}
																	
						// 											that.$nextTick(function() {
						// 												that.range = eval('(' + that
						// 													.getBracketStr(res.data)[
						// 														0] + ')');
						
						// 												let weixuan = {
						// 													"comments": "",
						// 													"samplename": "空",
						// 													"shortordno": "空"
						// 												}
						// 												that.range.unshift(weixuan)
						// 												this.range1 = eval('(' + that
						// 													.getBracketStr(res.data)[
						// 														1] + ')');
						// 												console.log(that.range1)
						// 												let weixuan1 = {
						// 													"servgrpcode": "空",
						// 													"servgrpname": "空"
						// 												}
						// 												that.range1.unshift(weixuan1)
						let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
							console.log(str1,'打印出来是字符还是ascii码')
							let str2 = res.data.indexOf('</RunActionDirectResult>')
							let str = res.data.substring(str1 + 45 ,str2)
							// console.log(str)
							str = eval('(' + str + ')')
							console.log(str,'strstrstrstrstr')
							
							console.log(res.data)
						if (!str.result) {
								uni.showToast({
									title: '暂无数据暂无数据？！',
									duration: 2000,           //单位毫秒
									icon: 'loading'
								});
								return
							}
							
							that.$nextTick(()=> {
						
								that.range = str.orders
								console.log(that.range,'rangeeeeeeeeee')
								let weixuan = {
									"comments": "",
									"samplename": "空",
									"shortordno": "空"
								}
								that.range.unshift(weixuan)
							
								that.range1 = str.servgrps
								console.log(that.range1)
								let weixuan1 = {
									"servgrpcode": "空",
									"servgrpname": "空"
								}
								that.range1.unshift(weixuan1)
																		
																		that.lookForTable()
																	})
																} else {
																	uni.showToast({
																		title: '网络错误500！',
																		duration: 2000 //单位毫秒
																	});
																}
						
															},
															fail: (err) => {
																console.log(err)
																uni.showToast({
																	title: '请求失败？！',
																	duration: 2000, //单位毫秒,
																	icon: 'loading'
																});
						
															}
														});
													}
												})
						
						
											}
										});
									},
			updatebtList() {
				uni.openBluetoothAdapter({
					success: (e) => {
						console.log('初始化蓝牙成功:' + e.errMsg);
						// 初始化完毕开始搜索
						this.startBluetoothDeviceDiscovery()
					},
					fail() {
						uni.showModal({
							title: '提示！',
							content: '初始化蓝牙失败，请先打开本机蓝牙！',
							showCancel: false,
							confirmText: "确定",
							success: (res) => {
								if (res.confirm) {
									plus.runtime.quit();
								}
							}
						});

					}
				});
			},
			drawerClose() {
				this._changeDrawer('stateDrawer', false)
			},
			drawerOpen() {
				this._changeDrawer('stateDrawer', true)


			},
			_changeDrawer(param, status) {
				this[param] = status
			},
			// 手势进入时
			touchStart(e) {
				this.startTime = Date.now()
				this.startPosition = e.changedTouches[0].clientX
			},
			// 手势离开时
			touchEnd(e) {
				const endTime = Date.now()
				if (endTime - this.startTime > 2000) {
					return;
				}
				this.endPosition = e.changedTouches[0].clientX;
				var slideDistance = this.endPosition - this.startPosition;
				if (slideDistance > 100) {
					this.drawerOpen()
				}
				if (slideDistance < -100) {
					this.drawerClose()
				}
			},
			lanyaShow() {

			},
			startBluetoothDeviceDiscovery() {
				//在页面显示的时候判断是都已经初始化完成蓝牙适配器若成功，则开始查找设备
				uni.startBluetoothDevicesDiscovery({
					services: ['0000FFE0'],
					success: res => {
						console.log(res)
						this.onBluetoothDeviceFound();
					},
					fail: res => {
						uni.showToast({
							icon: "none",
							title: "查找设备失败！",
							duration: 2000
						})
					}
				});
			},
			/**
			 * 停止搜索蓝牙设备
			 */
			stopBluetoothDevicesDiscovery() {
				uni.stopBluetoothDevicesDiscovery({
					success: e => {
						console.log('停止搜索蓝牙设备:' + e.errMsg);
					},
					fail: e => {
						console.log('停止搜索蓝牙设备失败，错误码：' + e.errCode);
					}
				});
			},
			/**
			 * 发现外围设备
			 */
			onBluetoothDeviceFound() {
				console.log("监听寻找新设备");
				// this.getBluetoothDevices();
				uni.onBluetoothDeviceFound(devices => {
					console.log('开始监听寻找到新设备的事件');
					console.log(devices)
					this.getBluetoothDevices();
				});
			},
			/**
			 * 获取在蓝牙模块生效期间所有已发现的蓝牙设备。包括已经和本机处于连接状态的设备。
			 */
			getBluetoothDevices() {
				console.log("获取蓝牙设备");
				uni.getBluetoothDevices({
					success: res => {
						console.log('获取蓝牙设备成功:' + res);
						this.bluetooth = res.devices;
						this.bluetooth.forEach((item) => {
							this.isLink.push(0)
						})
						// 清蓝牙列表搜到的空白名称蓝牙 
						this.bluetooth = this.bluetooth.filter(item => item.name != '')						
						console.log(this.bluetooth,'this.bluetooth_list')
						
						
					}
				});
			},		
			//断开蓝牙连接
			closeBLEConnection(deviceId, index) {
				uni.closeBLEConnection({
					deviceId: deviceId,
					success: res => {
						this.isLink.splice(index, 1, 4)
						console.log(res)						
						uni.removeStorageSync('blueToothName')
					}
				})
			},
			// 连接蓝牙设备
			createBLEConnection(item, index) {
				this.deviceId = item.deviceId;
				if (this.isLink[index] == 2) {
					return;
				}
				
				this.isLink.splice(index, 1, 1)
				uni.createBLEConnection({
					deviceId: this.deviceId,
					success: res => {
						this.blueToothName = item.name
						uni.setStorageSync('blueToothName', item.name);	
						this.selectAllaccord('',this.blueToothName,'')								
						console.log(res)
						this.isLink.splice(index, 1, 2)
						this.stopBluetoothDevicesDiscovery();
						this.getBLEDeviceServices(this.deviceId, index);
					},
					fail: res => {
						this.isLink.splice(index, 1, 3)
						console.log(res)
					}
				})
			},
			//获取蓝牙设备所有服务(service)。
			getBLEDeviceServices(deviceId, index) {
				setTimeout(() => {
					uni.getBLEDeviceServices({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: deviceId,
						success: (res) => {
							console.log('device services:', res)
							this.serverList = res.services
							res.services.forEach((item) => {
								if (item.uuid.indexOf("FFE0") != -1) {
									this.serviceId = item.uuid;
									console.log('serverId:', this.serviceId)
									this.getBLEDeviceCharacteristics(this.deviceId)
								}
							})
						}
					})
				}, 2000)

			},
			// 获取蓝牙特征值
			getBLEDeviceCharacteristics(deviceId) {
				console.log("进入特征");
				setTimeout(() => {
					uni.getBLEDeviceCharacteristics({
						// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
						deviceId: deviceId,
						// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
						serviceId: this.serviceId,
						success: (res) => {
							console.log(res)
							this.characteristics = res.characteristics
							res.characteristics.forEach((item) => {
								if (item.uuid.indexOf("FFE1") != -1) {
									this.characteristicId = item.uuid;
									console.log('characteristicId:', this.characteristicId)
									this.notifyBLECharacteristicValueChange(this.deviceId)
								}
							})
						},
						fail: (res) => {
							console.log(res)
						}
					})
				}, 3000)
			},
			// 启用 notify 功能
			notifyBLECharacteristicValueChange(deviceId) {
				console.log('测试结果1')
				uni.notifyBLECharacteristicValueChange({
					state: true, // 启用 notify 功能  
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: this.serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: this.characteristicId,
					success: (res) => {
						console.log('notifyBLECharacteristicValueChange success', res.errMsg)
						this.onBLECharacteristicValueChange(this.deviceId);
					},
					fail: (res) => {
						console.log('notifyBLECharacteristicValueChange fail', res.errMsg)
					}
				})
			},
			// ArrayBuffer 转为16进度字符串。
			ab2hex(buffer) {
			  const hexArr = Array.prototype.map.call(
			    new Uint8Array(buffer),
			    function (bit) {
			      return ('00' + bit.toString(16)).slice(-2)
			    }
			  )
			  return hexArr.join('')
			},
			//16进制转为arraybuffer
			  hex2ArrayBuffer(hex_str) {
			      // let hex_str = 'AA5504B10000B5'
			      let typedArray = new Uint8Array(hex_str.match(/[\da-f]{2}/gi).map(function (h) {
			        return parseInt(h, 16)
			      }))
			      let buffer = typedArray.buffer
			      return buffer
			    },
		
			// ArrayBuffer 转为字符串。 cultivate
			arrayBufferToString(buffer) {
				return String.fromCharCode.apply(null, new Uint8Array(buffer))
			},
			
			// 监听低功耗蓝牙设备的特征值变化
			onBLECharacteristicValueChange(deviceId) {
				console.log(this.lastTime)
				uni.showToast({
					title: '启用监听',
					duration: 2000,
					icon: 'loading' 
				})
				 
				uni.onBLECharacteristicValueChange((res) => { 
					console.log(res,'woshiiiiishshi')
					if (!this.lastTime || new Date().getTime() - this.lastTime > 1000) this.macValue = ''
					this.lastTime = new Date().getTime()
					console.log(res.value,'监听特征值变化')
					
					console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
					// console.log(this.ab2hex(res.value),'lllllllllllllllllllllll')
					
					this.macAddress = res.deviceId;
					this.macValue += this.arrayBufferToString(res.value);
					console.log(this.macValue,'kkkkkkkkkkkkkkkkkkkkkkk')
					// this.macValue = res.value				  
					// this.readBLECharacteristicValue(this.deviceId)
				})
			},
			// 读取设备二进制数据
			readBLECharacteristicValue() {
				// console.log('进入读取');
				// setTimeout(()=>{
				uni.readBLECharacteristicValue({
					// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
					deviceId: this.deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取。
					serviceId: this.serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: this.characteristicId,
					success: (res) => {
						console.log('readBLECharacteristicValue:', res)
						this.readCode = res.errCode;
						this.readCodeMsg = res.errMsg;
						this.onBLECharacteristicValueChange(this.deviceId);
					},
					fail: (res) => {
						console.log('readBLECharacteristicValue:', res)
						this.readCode = res.errCode;
						this.readCodeMsg = res.errMsg;
						this.onBLECharacteristicValueChange(this.deviceId);
					}
				})
				// },200)

			},			
			// 字符串转为arrayBuffer 类型  
			stringToArrayBuffer(str) {
				var bytes = new Array();
				var len, c;
				len = str.length;
				for (var i = 0; i < len; i++) {
					c = str.charCodeAt(i);
					if (c >= 0x010000 && c <= 0x10FFFF) {
						bytes.push(((c >> 18) & 0x07) | 0xF0);
						bytes.push(((c >> 12) & 0x3F) | 0x80);
						bytes.push(((c >> 6) & 0x3F) | 0x80);
						bytes.push((c & 0x3F) | 0x80);
					} else if (c >= 0x000800 && c <= 0x00FFFF) {
						bytes.push(((c >> 12) & 0x0F) | 0xE0);
						bytes.push(((c >> 6) & 0x3F) | 0x80);
						bytes.push((c & 0x3F) | 0x80);
					} else if (c >= 0x000080 && c <= 0x0007FF) {
						bytes.push(((c >> 6) & 0x1F) | 0xC0);
						bytes.push((c & 0x3F) | 0x80);
					} else {
						bytes.push(c & 0xFF);
					}
				}
				var array = new Int8Array(bytes.length);
				for (var i = 0; i <= bytes.length; i++) {
					array[i] = bytes[i];
				}
				return array.buffer;
			},
			// 发送二进制数据 
			writeBLECharacteristicValue() { 
				// let buffer = new ArrayBuffer(`${this.value}\r\n`)
				// // let buffer = new ArrayBuffer(this.value)
				// const dataView = new DataView(buffer)
				// dataView.setUint8(0, 0)
				// console.log(this.value_command,'value_commandvalue_command')
				// this.value_command = 'P'  //之前输入的是S,P /// s代表的是重启，p代表的是打印 p是针对 塞德利斯 类型的。
				// hex2ArrayBuffer
				// let buffer = this.hex2ArrayBuffer(`${this.value}\r\n`)
				
				let buffer = this.stringToArrayBuffer(`${this.value_command}\r\n`)  // 字符转arraybuffer
				console.log(this.value_command,'this.valuethis.value')		
				uni.writeBLECharacteristicValue({
					// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
					deviceId: this.deviceId,
					// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
					serviceId: this.serviceId,
					// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
					characteristicId: this.characteristicId,
					// 这里的value是ArrayBuffer类型   
					value: buffer,
					success: (res) => {	
						console.log('测试结果2')
						this.returnMessage = res.errMsg;
						console.log('writeBLECharacteristicValue success', res)													
					},
					fail: (res) => {
						this.returnMessage = res.errMsg; 
						console.log('writeBLECharacteristicValue fail', res)
					}
				})
			},
			selectAllaccord(accordName,aprrtment,labName){
								console.log(accordName,aprrtment,labName,typeof accordName,typeof aprrtment,'accordName,aprrtment,labName')
								let that = this 
				
									uni.request({
										method: "post",
										sslVerify: false,
										url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可
										contentType: "application/json",
										header: {
											'Content-Type': 'application/soap+xml; charset=utf-8',
											'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
										},
										data: `<?xml version="1.0" encoding="utf-8"?>
					<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
					    <soap12:Body>
					        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
					            <actionID>CTI.GetEquipmentSetting</actionID>
					            <parameters xsi:type="xsd:groups">
								<anyType xsi:type="xsd:string">${accordName}</anyType>
								<anyType xsi:type="xsd:string">${aprrtment}</anyType>
					            <anyType xsi:type="xsd:string">${labName}</anyType>
					            </parameters>
					            <UserName>${this.webaccount}</UserName>
					            <Password>${this.webpassword}</Password>
					        </RunActionDirect>
					    </soap12:Body>
					</soap12:Envelope>`,
										success: (res)=> {
												uni.hideLoading()
											console.log(res,'reeeee')
											if (res.statusCode == 200) {
												// console.log(res.data,'gggggggg')
												// console.log(that.getBracketStr(res.data))
											if (that.getBracketStr(res.data) == null) {
													uni.showToast({
														title: '暂无数据暂无数据？！',
														duration: 2000,           //单位毫秒
														icon: 'loading'
													});												
												}
												
												let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
												console.log(str1)
												let str2 = res.data.indexOf('</RunActionDirectResult>')
												let str = res.data.substring(str1 + 45 ,str2)
												// console.log(str,1111)
												str = eval('(' + str + ')')
												console.log(str,'ssssssttttttrrrrrrr')											
												str.config.forEach(item =>{
													item.equip.forEach(itm =>{
														if(itm.eqid == aprrtment){
															that.value_command = item.instructname
														}
													})
												})
												
												
												console.log(that.value_command,'str.config.instructname')
												
											} else {
												uni.showToast({
													title: '网络错误500！',
													duration: 2000 //单位毫秒
												});
											}
					
										},
										fail: (err)=> {
											uni.hideLoading()
											console.log(err)
											uni.showToast({
												title: '请求失败？！',
												duration: 2000, //单位毫秒,
												icon: 'loading'
											});				
										}
									});
			},
			
		}
	}
</script>
<style scoped>
	.allButtonFixed {
		width:100%;
		position: fixed;
		top:0;
		left:0;
		z-index:999;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	.button_fixed {
		position: fixed;
		top:70px;
		right:0px;
		z-index:1000;
		width:150px;
		
	}
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
		/* margin-left: 30rpx; */
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
	/* 	display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-evenly; */
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
