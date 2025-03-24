<template>
	<view>
		<!--pages/login/login.wxml-->
		<!-- 登录 -->
		<view class="top_c"></view>
		<view class="login">
			<view class="login-box">
				<view class="login-title">
					<image src="/static/huace.png" mode="heightFix" style="height: 50rpx;width: 50rpx;text-align: left;" @click="severiceConfig"></image>
					<!-- <text class="login-title-text">实验室管理系统</text> -->
				</view>
				<view class="login-center">
					<view>
						<view class="user-info">
							<view class="cu-form">
								<label class="title">账号<text style="margin:0 4px">:</text></label>
								<input class="phone-input" placeholder="请输入账号" v-model="account"></input>
							</view>
							<view class="cu-form cu-form-code">
								<label class="title">密码<text style="margin:0 4px">:</text></label>
								<input class="phone-input" placeholder="请输入密码" v-model="password" type="password"
									@blur="login"></input>
								<!-- <view :class=" isShowPassword == 1 ? 'iconfont icon-C_mimayanjing_-1' : 'iconfont icon-C_mimayanjing_-'" bindtap="showPassword"></view> -->
							</view>
						</view>
						<!-- <view class="login-button" bindtap="handleLogin">
		          <text style="color:#fff;">登录</text>
		        </view> -->
				<view style="display: flex;justify-content: space-around;align-items: center;">
						<view class="" style="margin-top: 50rpx;">
							<view class="" style="display: flex;align-items: center;">
								<label class="">请选择实验室<text style="margin:0 4px">:</text></label>
								<lickmult :dataList="range" text="deptname" name="dept" v-model="value"
									@change="change" />
							</view>
						</view>
					<!-- 	<view class="" style="margin-top: 50rpx;">
							<view class="" style="display: flex;align-items: center;">
								<label class="">请选择工作组:</label>
								<lickmult :dataList="range1" text="servgrp" name="servgrpcode" v-model="value"
									@change="change1" />
							</view>
						</view> -->
						
							<view class="" style="margin-top: 50rpx;">
								<view class="" style="display: flex;align-items: center;">
									<label class="">请选择工作组<text style="margin:0 4px">:</text></label>
									<view class="show-btn" @tap="show"><input type="text" :placeholder="cityName ? cityName :'请选择'" border disabled style="border: 1px solid #e5e5e5;border-radius: 5rpx;width: 100rpx;height: 45rpx;"></view>
									<uni-popup ref="cityMore" type="top">
										<more-select :cityData="cityData" @chooseCity="chooseCity" @switchCity="switchCity" :cityIndex="cityIndex"
											@scrollCity="scrollCity" @closeCity="closeCity" @queryCity="queryCity" :oldScrollTop="oldScrollTop"
											:scrollTop="scrollTop" :chooseCityList="chooseCityList" :title="title" :cityIdArr="cityIdArr" @delCity="delCity"
											ref="moreselects" :maxCount="10" :level="1" :colorValue="colorValue"></more-select>
									</uni-popup>
								</view>
							</view>
						
				</view>
						<view class="login-button_me" @click="goIndex">
							<text style="color:#fff;font-weight: 700;font-size: 24rpx;">确定</text>
						</view>
					</view>
					<!-- <text class="call">服务专线：15071050175</text> -->
				</view>
			</view>
			<!-- <text class="copyright">{{webserve}}</text> -->
			<text class="copyright">© 2022 - 2022 华测检测认证集团股份有限公司 版权所有</text>
		</view>

	</view>
</template>
<script>
	import lickmult from '../../uni_modules/hpy-form-select/components/hpy-form-select/hpy-form-select.vue'
	import moreSelect from "@/components/more-select.vue"
	export default {
		components: {
			lickmult,
			moreSelect
			
		},
		data() {
			return {
				account: '',
				password: '',
				value: '',
				range: [],
				range1: [],
				e:{},
				e1:{},
				level: 1,
				title: '选择组别',
				chooseCityList: [],
				cityIdArr: [],
				cityData: [],
				scrollTop: 0,
				oldScrollTop: 0,
				cityIndex: 0,
				cityName: "",
				colorValue: "#016CE1",                                                     // http://fddlims12.cticert.com:8085/FDD/services/generic.asmx
				webserve:this.$webserve_gol,  //http://10.10.241.76/starlims10.fdd/services/generic.asmx 
				webaccount:'SYSADM',
				webpassword:'XF-,8>TJ$PN,'
				
				
			}
		},
		onLoad() {
			// let isLogin = uni.getStorageInfoSync('loginStatus')
			// console.log(isLogin) 
			let that = this
			uni.getStorage({
				key: 'createBy',
				success: function(res) {
					console.log(res.data,'res--data')
					that.account = res.data
					
				
			
				}
			});
			
			
			uni.removeStorage({
				key: 'laboratory',
				success: function (res) {
					console.log('success1');
					
				}
			});
			uni.removeStorage({
				key: 'havezubie',
				success: function (res) {
					console.log('success2');
					
				}
			});
			
			
			
			// uni.getStorage({
			// 	key: 'loginStatus',
			// 	success: function(res) {
			// 		console.log(res.data);
			// 		if (res.data == 'true') {
			// 			uni.navigateTo({
			// 				url: '../index/index'
			// 			})
			// 		} else {
			// 			uni.showToast({
			// 				title: '登录过期！请输入账号密码',
			// 				duration: 3000 ,//单位毫秒,
			// 				icon:'loading'
			// 			});
			// 		}

			// 	}
			// });

		},
		created() {
			let that = this
			
			console.log(that.password,that.account,that.webserve,'ervices/generic.asmx')
			// uni.getStorage({
			// 	key: 'webserve',
			// 	success: function(res) {
			// 		console.log(res.data);				
			// 		that.$nextTick(function() {
			// 			that.webserve = res.data
			// 		})
			// 	}
			// })
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
			
			// uni.clearStorage('password')
			// uni.clearStorage('account')
		},
		methods: {
			severiceConfig(){
				uni.navigateTo({
					url:'/pages/serviceConfig/serviceConfig'
				})
			},
			show() {
					console.log(this.level)
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
							"servgrpcode": item.servgrpcode,
							"servgrp": item.servgrp
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
						this.cityName += item.servgrp + ","
					})
					this.cityName = this.cityName.substring(0, this.cityName.lastIndexOf(','));
					console.log(this.cityName)
					this.$refs.cityMore.close()
				},
				
			//登录跳转到 首页   
			goIndex() {
				// console.log(this.cityName)
				if(this.cityName != ''){
					uni.setStorageSync('havezubie', this.cityName);
				}else {
					uni.removeStorageSync('havezubie')
				}
				console.log(this.e.value)
				// return
				if(this.e.value == undefined || this.e.value == ''){ 
					uni.showToast({
						title: '请选择实验室！',
						duration: 3000 ,
						icon:'loading'
					});
					return;
				}
				uni.navigateTo({
					url: '../index/index'
				})
			},
			change(e) {
				let that = this
				console.log(e)
				this.e = e
				console.log(e.value)
				uni.setStorageSync('laboratory', e.value);
				this.cityData = []
				this.chooseCityList = []
				this.cityIdArr = []
				this.cityName = []
				
				uni.request({
									method: "post",
								sslVerify: false,
								url: `${this.webserve}`, //接口地址，后面加上 /方法名即可
								contentType: "application/json",
								header: {
									'Content-Type': 'application/soap+xml; charset=utf-8',
									'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
								},
								data: `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
            <actionID>CTI.GetServgrpInfoToJson</actionID>
            <parameters xsi:type="xsd:groups">
                <anyType xsi:type="xsd:string">${e.value}</anyType>
            </parameters>
            <UserName>${this.webaccount}</UserName>
            <Password>${this.webpassword}</Password>
        </RunActionDirect>
    </soap12:Body>
</soap12:Envelope>`,
									success: function(res) {
										console.log(res)
										if(res.statusCode == 200){
											
											// let str1 = res.data.indexOf('<RunActionDirectResult xsi:type="xsd:string">')
											// 	console.log(str1,'打印出来是字符还是ascii码')
											// 	let str2 = res.data.indexOf('</RunActionDirectResult>')
											// 	let str = res.data.substring(str1 + 45 ,str2)
											// 	// console.log(str)
											// 	str = eval('(' + str + ')')
											// 	console.log(str,'strstrstrstrstr')
											
											
											
											// console.log(res.data)
											console.log(that.getBracketStr(res.data))
											that.getBracketStr(res.data)
											// console.log(that.getBracketStr(res.data)[0])
											that.$nextTick(function(){
												that.range1 = eval('(' + that.getBracketStr(res.data)[0] + ')')
											})
											
											
											
										}else {
											console.log(res,'res--res')
											uni.showToast({
												title: '网络错误！', 
												duration: 3000 ,//单位毫秒,
												icon:'loading'
											});
										}
									
									},
									fail: function(err) {
										uni.showToast({
											title: '请求失败！', 
											duration: 3000 ,//单位毫秒,
											icon:'loading'
										});
									}
								});
				
			},
			change1(e) {
				console.log(e) 
				this.e1 = e
			},
			//取出字符串里想要的内容
			getBracketStr(text) {
				let regex = /\[(.+?)\]/g;
				let options = text.match(regex)
				console.log(options)
				if(options == null){
					uni.showToast({
						title: '账号或密码错误！',
						duration: 3000 ,//单位毫秒,
						icon:'loading'
					});
				}
				
				// let option = options[0]		        
				//     result = option.substring(1, option.length - 1)
				return options
			},
			//登录
			login() {
				
				if (!this.account && this.account == "") {
					uni.showToast({
						title: '账号不能为空！',
						duration: 3000 ,//单位毫秒,
						icon:'loading'
					});
					return
				}
				if (!this.password && this.password == "") {
					uni.showToast({
						title: '密码不能为空！',
						duration: 3000 ,//单位毫秒,
						icon:'loading'
					});
					return
				}
				console.log(this.webaccount,this.webpassword,111)
				console.log(this.webserve)
				console.log(this.account,this.password,222)
				
				let that = this
				
				
				console.log(uni.getStorageSync('cookieKey'),'uni.getStorageSync')
				uni.request({
					method: "POST",
					sslVerify: false,
					url: `${this.webserve}`, //接口地址，后面加上 /方法名即可
					contentType: "application/json",
					header: {
						'Content-Type': 'application/soap+xml; charset=utf-8',
						'Cookie':uni.getStorageSync('cookieKey') ? uni.getStorageSync('cookieKey') : ''
					},
					data: `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
        <RunActionDirect xmlns="http://www.starlims.com/webservices/">
            <actionID>CTI.GetUserInfoToJson</actionID>
            <parameters xsi:type="xsd:groups">
                <anyType xsi:type="xsd:string">${this.account}</anyType>
                <anyType xsi:type="xsd:string">${this.password}</anyType>
            </parameters>
           <UserName>${this.webaccount}</UserName>
           <Password>${this.webpassword}</Password>
        </RunActionDirect>
    </soap12:Body>
</soap12:Envelope>`,
					success: function(res) {
						console.log(res)
						if(res.statusCode == 200){
							if(res.header['Set-Cookie']){
								console.log(res.header['Set-Cookie'],'rrrr')
								uni.removeStorageSync('cookieKey');
								　　uni.setStorageSync('cookieKey', res.header['Set-Cookie'])
							}
							
							// console.log(res.data)
							console.log(that.getBracketStr(res.data))
							that.getBracketStr(res.data)
							console.log(that.getBracketStr(res.data)[0])
							console.log(that.getBracketStr(res.data)[1])
							that.$nextTick(function() {
								that.range = eval('(' + that.getBracketStr(res.data)[0] + ')');
								// this.range1 = eval('(' + that.getBracketStr(res.data)[1] + ')');
								// console.log(this.range1)
								// uni.setStorageSync('loginStatus',this.account);	
								// uni.setStorageSync('userName',this.account);
								uni.setStorageSync('createBy', this.account);
								
							})
						}else {
							uni.showToast({
								title: '网络错误！', 
								duration: 3000 ,//单位毫秒,
								icon:'loading'
							});
						}
					
					},
					fail: function(err) {
						console.log(err,'err')
						uni.showToast({
							title: '请求失败！', 
							duration: 3000 ,//单位毫秒,
							icon:'loading'
						});
					}
				});
			}
		}
	}
</script>
<style>
	page {
		height: 100%;
	}

	.login {
		width: 100%;
		overflow: hidden;
	}

	.login .login-box {
		width: 80%;
		height: 60%;
		padding: 0rpx 30rpx;
		background-color: #fff;
		position: fixed;
		z-index: 3;
		top: 30%;
		left: 50%;
		border-radius: 30rpx;
		transform: translate(-50%, -50%);
		-webkit-transform: translate(-50%, -50%);
	}

	button:not([size='mini']) {
		width: 100rpx;
	}

	.login .login-center {
		/* margin-top: 50rpx; */
		color: #000;
	}

	.user-info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.cu-form {
		display: flex;
		align-items: flex-end;
		padding-bottom: 16rpx;
		min-height: 120rpx;
		border-bottom: 1rpx solid #3c8dbc;
	}

	.cu-form .phone-input {
		flex: 2.5;
	}

	.cu-form-code .title_input {
		flex: 2;
	}

	.title_input-icon {
		flex: 0.5;
		text-align: center;
		font-size: 40rpx;
	}

	.top_c {
		width: 100%;
		height: 30%;
		background-color: #0893e7;
		border-radius: 0 0 20% 20%;
	}

	.bg-green {
		color: white;
		font-size: 20rpx;
	}

	.cu-form .title {
		flex: 0.7;
		font-size: 30rpx;
	}

	/* 
	.cu-form .phone-input {
	  flex: 2.5;
	} */

	.login-button {
		position: absolute;
		bottom: 20%;
		left: 4%;
		right: 4%;
		margin-top: 20rpx;
		height: 80rpx;
		border-radius: 6rpx;
		text-align: center;
		line-height: 80rpx;
		background-color: #0893e7;
	}

	.login-button_me {
		margin-top: 200rpx;
		height: 80rpx;
		border-radius: 6rpx;
		text-align: center;
		line-height: 80rpx;
		background-color: #303962;
	}

	.login .copyright {
		position: fixed;
		width: 100%;
		line-height: 100rpx;
		font-size: 24rpx;
		z-index: 0;
		text-align: center;
		bottom: 20rpx;
		color: #999;
		left: 0;
	}

	.login-center .call {
		position: absolute;
		bottom: 0;
		right: 0;
		font-size: 30rpx;
		padding: 0 35px;
		box-sizing: border-box;
		color: #999;
		line-height: 44px;
		width: 100%;
		text-align: center;
	}

	.login-title {
		margin-top: 40rpx;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}

	.login-title-text {
		text-align: center;
		font-weight: 600;
	}

	.background {
		width: 140rpx;
		height: 50rpx;
	}

	.login-info .text-info {
		font-size: 30rpx;
	}

	.login-info .button-register {
		font-size: 30rpx;
		width: 50%;
		margin: 150rpx auto;
		background-color: #0893e7;
		color: #fff;
	}
</style>
