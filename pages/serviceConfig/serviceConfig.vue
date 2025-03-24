<template>
	<view class="">
		<view class="navBarBox">
			<!-- 状态栏占位 -->
			 <view class="statusBar" :style="{ paddingTop: statusBarHeight + 'px' }"></view>
			<!-- 真正的导航栏内容 -->
			<view class="navBar">
				<view style="margin-left: -30rpx;">
					<image src="/static/huace.png" mode="heightFix" class="logo"></image>
				</view>
				<view style="font-weight: 400;color:#2e3a60;">服务配置</view>
				<view class=""></view>
			</view>
		</view>

		<view
			style="display: flex;align-items: center;justify-content: space-around;padding: 0 40rpx;position: relative;">
			<label class="" style="font-size: 20rpx;">webservice <text style="margin:0 4px">:</text> </label>
			<input type="text" v-model="webseivice" confirm-type="search"
				style="flex: 1;border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;" />
			<text v-if="webseivice" class="icon_close" @click="close"></text>

		</view>

		<view
			style="display: flex;align-items: center;justify-content: space-around;padding: 0 40rpx;position: relative;margin:20rpx 0">
			<label class="" style="font-size: 20rpx;">账号 <text style="margin:0 4px">:</text> </label>
			<input type="text" v-model="account" confirm-type="search"
				style="flex: 1;border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;" />
			<text v-if="account" class="icon_close" @click="closeaccount"></text>

		</view>

		<view
			style="display: flex;align-items: center;justify-content: space-around;padding: 0 40rpx;position: relative;margin:20rpx 0">
			<label class="" style="font-size: 20rpx;">密码 <text style="margin:0 4px">:</text> </label>
			<input type="text" v-model="password" confirm-type="search"
				style="flex: 1;border: 1px solid #e5e5e5;border-radius: 5rpx;height: 40rpx;padding-left: 4px;" />
			<text v-if="password" class="icon_close" @click="closePassword"></text>

		</view>

		<view>
			<button @click="save">保存</button>
			<button @click="clearAppUserData">清除缓存</button>
			<!-- <button @click="getWifiIp">无线网ip</button>
			<button @click="getappneiangip">app内网ip</button>
			<button @click="getwaiwangip">公网ip</button> -->
			
			
		</view>
	</view>


</template>

<script>
	export default {
		data() {
			return {
				webseivice: this.$webserve_gol,
				statusBarHeight: '',
				account: 'SYSADM',
				password: 'XF-,8>TJ$PN,',
				
				

			}
		},
		created() {
			//获取手机状态栏高度
			this.statusBarHeight = uni.getSystemInfoSync()['statusBarHeight'];
		},
		mounted() {
			console.log(uni.getStorageSync('password'),'llllll')
			if(uni.getStorageSync('password')){
				this.password = uni.getStorageSync('password')
			}
			if(uni.getStorageSync('account')){
				this.account = uni.getStorageSync('account')
			}
			if(uni.getStorageSync('webserve') != ''){
				this.webseivice = uni.getStorageSync('webserve')
			}
		},
		methods: {
			getwaiwangip(){
				uni.request({
							url: 'https://api.ipify.org', // 这是一个提供获取客户端公网IP服务的简单API
							method: 'GET',
							success: (res) => {
								const ip = res.data
								console.log('当前设备公网IP地址：', ip);
							},
							fail: (err) => {
								 console.error('获取IP地址失败：', err);
								}
							});
			},
			 getWifiIp() {
			    const MainActivity = plus.android.runtimeMainActivity()
			    const Context = plus.android.importClass('android.content.Context')
			    plus.android.importClass('android.net.wifi.WifiManager')
			    plus.android.importClass('android.net.wifi.WifiInfo')
			    plus.android.importClass('android.net.wifi.ScanResult')
			    plus.android.importClass('java.util.ArrayList')
			    const wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)
			    const wifiInfo = wifiManager.getConnectionInfo()
			    const ipAddress = wifiInfo.getIpAddress()
			    const wifiIp = ((ipAddress & 0xff) + '.' + (ipAddress>>8 & 0xff) + '.' + (ipAddress>>16 & 0xff) + '.' + (ipAddress>>24 & 0xff))
			    console.log(wifiIp,'wifiIp--wifiIp')
			},
			getappneiangip(){
				var MainActivity = plus.android.runtimeMainActivity();
				var Context = plus.android.importClass('android.content.Context');
				plus.android.importClass("android.net.wifi.WifiManager")
				var wifiManager = MainActivity.getSystemService(Context.WIFI_SERVICE)
				//获取dhcp ip
				var intent = plus.android.newObject("android.net.DhcpInfo");
				var info = wifiManager.getDhcpInfo();
				var ipAddress = plus.android.getAttribute(info, "serverAddress");
				var ip = ((ipAddress & 0xff) + "." + (ipAddress >> 8 & 0xff) + "." + (ipAddress >> 16 & 0xff) + "." + (
								ipAddress >> 24 & 0xff))
				console.log(ip,'app内网ip')
			},
			clearAppUserData(){
				plus.android.importClass("android.app.ActivityManager");	
				var Context = plus.android.importClass("android.content.Context");	
				var am = plus.android.runtimeMainActivity().getSystemService(Context.ACTIVITY_SERVICE);	am.clearApplicationUserData();
				plus.runtime.quit();
			},
			close() {
				this.webseivice = ''
			},
			closeaccount() {
				this.account = ''
			},
			closePassword() {
				this.password = ''
			},
			save() {
				uni.showToast({
					title: '保存成功',
					icon: "none",
					duration: 2000
				});
				uni.setStorageSync('webserve', this.webseivice);
				uni.setStorageSync('account', this.account);		
				uni.setStorageSync('password', this.password);   // equity fedual fj avenue blend
				
				
				uni.removeStorage({
					key: 'laboratory',
					success: function (res) {
						console.log('success');
						
					}
				});
				uni.removeStorage({
					key: 'havezubie',
					success: function (res) {
						console.log('success');
						
					}
				});
				uni.removeStorage({
					key: 'createBy',
					success: function (res) {
						console.log('success');
						
					}
				});
				 plus.runtime.quit();
			},
			// 删除不影响  
			temp() {    	
						
					//  静态分配  				
				// 	#define MaxSize 10;
				// 	typedef struct {
				// 		int data[MaxSize];
				// 		int length;
				// 	}SqList;
									
				// 	void InitList(SqList &L){
				// 		for(int i=0;i<MaxSize;i++){
				// 			L.data[i]=0
				// 		}
				// 		L.length = 0
				// 	}		
				// 	// 插入元素 
				// 	if(i<1 || i>=L.length) 
				// 	 return false
				// 	 if(L.length>MaxSize) return false
				// 	 for(int j=L.length;j>=i;j--)
				// 		L.data[j] =L.data[j-1]
				// 		L.data[i-1] = e
				// 		L.length++
				// 		return true
				// 	// 删除元素	
				// 	if(i<1 || i>=L.length) 
				// 		return false
				// 		e = L.data[i-1]
				// 		for(int i = j;j<L.length;j++)
				// 		L.data[j-1] = L.data[j]
				// 		L.length--
				// 		return false
				// 	bool ListInsert(SqList &L,int i,int &e){
				// 		if(i>=L.length || i<1)
				// 			return false
				// 		if(L.length>MaxSize) return false
				// 			for(let j = L.length;j>=i;j++)    //将第i个元素及之后的元素后移
				// 			L.data[j] = L.data[j-1];
				// 			L.data[i-1] = e
				// 			L.length++
				// 			return true					
				// 	}
				// 	// 删除 某个位置上的元素		
				// 	bool ListDelete(SqList &L,int i,int &e){
				// 		if(i>=L.length || i<1) return false					
				// 		e=L.data[i-1]                    // 将被删的元素赋值给e
				// 		for(int j=i;j<L.length;j++)      // 删除第3个元素 4
				// 		L.data[j-1]=L.data[j]           
				// 		L.length--
				// 		return true
				// 	}
				// 	int main(){
				// 		SqList L;					
				// 		InitList(L)
				// 		ListInsert(L,3,3)
				// 		ListDelete(L,3,3)
				// 		return 0
				// 	}

				// // 动态分配
				// #define InitSize 10 
				// typedef struct {
				// 	int *data;
				// 	int MaxSize;
				// 	int length;
				// }SqList;
				// void InitList(SqList &L){
				// 	L.data = (int *)malloc(sizeof(int)*InitSize)
				// 	L.length = 0
				// 	L.MaxSize = InitSize
				// }
				// // malloc 函数的参数，指明要分配多大的连续内存空间 L.data = (int*)malloc(sizeof(int)*InitSize)		 
				// void InitList(SqList &L) {
				// 	L.data = (int *) malloc(sizeof(int) * InitSize)
				// 	L.length = 0
				// 	L.MaxSize = InitSize
				// }
				// L.data = (int *)malloc(sizeof(int)*InitSize)
				// L.data = (int *)malloc(sizeof(int)*(len + L.MaxSize))
				// void IncreaseSize(SeqList &L, int len) {
				// 	int *p = L.data;
				// 	L.data = (int * )malloc(sizeof(int)*(L.MaxSize + len))
				// 	for (int i = 0; i < L.length; i++) {
				// 		L.data[i] = p[i]
				// 	}
				// 	L.MaxSize = L.MaxSize + len;         // 这里需注意消除了p
				// 	free(p)
				// }
				// int main() {
				// 	SqList L;
				// 	InitList(L);
				// 	IncreaseSize(L, 20);
				// 	return 0;
				// }
				
			} // 结尾 

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
	}

	.icon_close {
		position: absolute;
		right: 53px;
		background-image: url(../../static/delete.png);
		background-position: center center;
		background-repeat: no-repeat;
		background-size: cover;
		width: 14rpx;
		height: 14rpx;
	}
</style>