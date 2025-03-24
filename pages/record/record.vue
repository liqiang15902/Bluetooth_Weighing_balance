<template>
	<view class="">
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			<view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<view style="margin-left: -30rpx;">
					<image src="/static/huace.png" mode="heightFix"  class="logo"></image>
				</view>
				<view style="font-weight: 400;color:#2e3a60;">天平使用记录</view>
				<view class=""></view>
			</view>
		</view>
			<view class="" style="margin-top: 20rpx;">
						<view class="" style="display: flex;align-items: center;padding: 0 40rpx;margin-top: 20rpx;">
						<label>请选择时间<text style="margin:0 4px">:</text></label>
						<view >
							<uni-datetime-picker v-model="datetimerange" type="datetimerange" rangeSeparator="至" @change="change"/>
						</view>
						</view>
						<view style="display: flex;align-items: center;padding: 0 40rpx;margin-top: 20rpx;">
							<label class="" style="font-size: 20rpx;">设备ID<text style="margin:0 4px">:</text></label>
							<input type="text" v-model="equipName"
								style="border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;width: 525rpx;" />
							<!-- <view style="margin-left: 10rpx;" @click.stop="ScaneqNQRcode">
								<image src="../../static/erweima.png" style="width: 50rpx;height: 50rpx;" mode=""></image>
							</view> -->
						</view>
						
						<view style="display: flex;align-items: center;padding: 0 40rpx;margin-top: 20rpx;">
							<label class="" style="font-size: 20rpx;">样品号<text style="margin:0 4px">:</text></label>
							<input type="text" v-model="shortNO"
								style="border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;width: 525rpx;" />
							<!-- <view style="margin-left: 10rpx;" @click.stop="ScaneqNQRcode">
								<image src="../../static/erweima.png" style="width: 50rpx;height: 50rpx;" mode=""></image>
							</view> -->  
						</view>   
						
		<!-- 表格内容 -->
		
		<view class="c-column" style="width: 100%;height: 50vh;margin-top: 100rpx;">
			<view class="c-row" style="margin: -50rpx 5px 10rpx 5px;">		
				<button type="default" @click="getform" style="color:#fff;background-color: #303962;">查询</button>
			</view>
			<c-table class="c-filling" ref="table" :initTable="initTable"
				 />
		</view>
		</view>
		</view>
		
	</view>
</template>

<script>
	import tTable from '@/pages/index/table.vue'
	export default {
		data(){
			return {
				webserve:'http://fddlims12.cticert.com:8085/FDD/services/generic.asmx',
				webaccount:'SYSADM',
				webpassword:'XF-,8>TJ$PN,',
				text:'',
				equipName:'',
				shortNO:'',
				startTime:'',
				endTime:'',
				datetimerange: ["2022-06-07 20:10:10", "2023-06-10 10:10:10"],
				statusBarHeight:'',
				initTable: {
					resizable: true,
					border: true,
					editConfig: {
						trigger: "click",
						mode: "cell",
						showUpdateStatus: true,
						enabled: true,
						showIcon: false
					},
					columns: [{
							field: "createdate",
							minWidth: 80,
							title: "日期",
				
						},
						{
							field: "status",
							width: 80,
							title: "仪器状态",
				
						},
						{
							field: "createtime",
							title: "起止时间",
							maxWidth:180,
							minWidth:80
				
						},
						{
							field: "testnos",
							title: "测试项目",
							maxWidth:180,
							minWidth:80
						},
						{
							field:'ordno',
							title: "样品编号",
							maxWidth:180,
							minWidth:120										
						},
						{	
							field:'fullname',
							title: "使用人",
							width: 80,
							
						},
						{	field:'remark',
							title: "备注",
							width: 120,
						
						},
						// {
						// 	field: "addOPtion",
						// 	title: '操作',
						// 	width: 80,
						// 	slots: {
						// 		default: 'operate'
						// 	},
						// 	fixed: "right"
						// }						
					],
					loading: false, //加载遮罩
					//注册表格事件列点击事件，行点击事件
					initEventsList: ["cell-click","header-cell-click"],
					// initEventsList: ["header-cell-click"],
					//插槽内容
					initSlotString:`
					<template #operate="{ row }">
						<vxe-button @click="slotEvents(row)">保存</vxe-button>
					</template>`
				},
			}
		},
		created() {
			let that = this
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
				key: 'webserve',
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
		methods:{
			getBracketStr(text) {
				let regex = /\[(.+?)\]/g;
				let options = text.match(regex)
				console.log(options)
				// let option = options[0]		        
				//     result = option.substring(1, option.length - 1)
				return options
			},
			change(e){
				console.log(e)
				this.startTime = e[0]
				this.endTime = e[1]
			},
			getform(){
				let that = this
				console.log(this.startTime,this.endTime)
				uni.request({
					method: "post",
					sslVerify: false,
					url:  `${this.webserve}`, //接口地址，后面加上 /方法名即可  
					contentType: "application/json",
					header: {
						'Content-Type': 'application/soap+xml; charset=utf-8',
						'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
					},
					data:`<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
            <actionID>CTI.GetEquipmentWeightRecordReset</actionID>
            <parameters xsi:type="xsd:groups">
                <anyType xsi:type="xsd:string">${this.equipName}</anyType>
                <anyType xsi:type="xsd:string">${this.startTime}</anyType>
<anyType xsi:type="xsd:string">${this.endTime}</anyType>
                <anyType xsi:type="xsd:string">${this.shortNO}</anyType>
            </parameters>
           <UserName>${this.webaccount}</UserName>
           <Password>${this.webpassword}</Password>
        </RunActionDirect>
    </soap12:Body>
</soap12:Envelope>`,
					success: function(res) {
						console.log(res)
						if (res.statusCode == 200) {						
							that.getBracketStr(res.data)
							console.log(that.getBracketStr(res.data))
							console.log(eval('(' + that.getBracketStr(res.data)[0] + ')'))
							that.$nextTick(function(){
								that.data = eval('(' + that.getBracketStr(res.data)[0] + ')')
								that.$refs.table.setTableProps({
									loading: false,
									data: that.data,
									
								})
							})
						} else {
							uni.showToast({
								title: '网络错误500！',
								duration: 2000 //单位毫秒
							});
						}
				
					},
					fail: function(err) {
						console.log(err)
						uni.showToast({
							title: '请求失败？！',
							duration: 2000, //单位毫秒, 
							icon: 'loading'
						});
				
					}
				});
			}
		}
	}
</script>

<style scoped>
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
	}
</style>