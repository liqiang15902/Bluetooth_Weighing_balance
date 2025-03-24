<template name="moreSelect">
	<view class="city-box">
		<view class="city-box-title" :style="'background:' + colorValue">
			<view class="close-btn" @tap="closeCity">关闭</view>
			<!-- <text>{{title}}(最多{{maxCount}}个)</text> -->
			<view class="query-btn" @tap="queryCity">确定</view>
		</view>
		<view class="choosed-box" v-if="chooseCityList.length > 0">
			<view class="city-single" v-for="(item,index) in chooseCityList" :key="index">
				<text :style="'color:' + colorValue" style="font-size: 1%;">{{item.name}}</text>
				<image @tap="delCity(index)" src="../static/static/icon/close-icon.png" mode=""></image>
			</view>
		</view> 
		<view class="city-data" v-if="level == 1">
			<view class="level-one-data">
				<scroll-view scroll-y="true" :style="'height:' + (1000-viewHeight) + 'upx'" @scroll="scroll"
					:scroll-top="scrollTop" scroll-with-animation="true">
					<view class="county-single" v-for="(zItem,zIndex) in cityData" :key="zIndex"
						@tap="chooseOneCity(zItem)">
						<view v-if="cityIdArr.includes(zItem.id)" class="city-name" :style="'color:' + colorValue">
							{{zItem.name}}</view>
						<view v-else class="city-name">{{zItem.name}}</view>

						<view v-if="cityIdArr.includes(zItem.id)" class="selected-box" :style="'background:' + colorValue + ';border:1px solid ' +colorValue">
						 <image src="../static/static/icon/checked-box.png" mode=""></image>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "more-select",
		data() {
			return {
				viewHeight: 0,
				oneIndex: 0,
				twoIndex: 0
			};
		},
		props: {
			maxCount: {
				type: Number,
				default: 10
			},
			title: {
				type: String,
				default: "选择方法"
			},
			level: {
				type: Number,
				default: 2
			},
			chooseCityList: {
				type: Array,
				default: () => []
			},
			cityData: {
				type: Array,
				default: () => []
			},
			cityIdArr: {
				type: Array,
				default: () => []
			},
			scrollTop: {
				type: Number,
				default: 0
			},
			cityIndex: {
				type: Number,
				default: 0
			},
			colorValue: {
				type: String,
				default: "#016CE1"
			},
			oldScrollTop: {
				type: Number,
				default: 0
			}

		},
		mounted() {
			// this.getDescBox()
			// console.log(this.cityData)
		},
		methods: {
			scroll(e) {
				this.$emit('scrollCity', e.detail.scrollTop)
			},
			closeCity() {
				this.$emit('closeCity', true)
			},
			queryCity() {
				this.$emit('queryCity', true)
			},
			switchCity(index) {
				this.$emit('switchCity', index)
			},
			switchOne(index) {
				this.oneIndex = index
			},
			chooseTwo(index) {
				this.twoIndex = index
			},
			getViewHeight() {
				uni.createSelectorQuery().in(this).select('.choosed-box').boundingClientRect(result => {
					if (result) {
						this.viewHeight = result.height 
					} else {
						this.viewHeight = 0
					}
				}).exec();
			},
			chooseOneCity(item) {
				console.log(item)
				let parms = {
					id: item.id,
					name: item.name
				}
				this.$emit('chooseCity', parms)
			},
		
			delCity(index) {
				this.$emit('delCity', index)
			}
		}
	}
</script>

<style lang="scss">
	.city-box {
		width: 650rpx;
		height: 2000rpx;
		background: rgba($color: #EEEEEE, $alpha: 1);
		margin-left: 40px;
	
		.city-box-title {
			width: 650rpx;
			height: 100upx;
			background: #016CE1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			color: #FFFFFF;
	
			.close-btn {
				margin-left: 36upx;
				font-size: 28upx;
			}
	
			.query-btn {
				margin-right: 36upx;
				font-size: 28upx;
			}
	
			text {
				font-size: 32upx;
			}
		}
	
		.level-one-data {
			width: 700upx;
			margin: 0 auto;
	
			// background: red;
			.county-single {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 90upx;
				margin-left: 20upx;
				margin-right: 20upx;
				border-bottom: 1px solid rgba($color: #999999, $alpha: .15);
	
				.city-name {
					font-size: 28upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #232425;
				}
	
				image {
					width: 42upx;
					height: 42upx;
				}
	
				.no-select-box {
					width: 42upx;
					height: 42upx;
					border: 1px solid red;
					border-radius: 7upx;
				}
	
				
			}
		}
	
		.city-data {
			display: flex;
			border-top: 1px solid rgba($color: #EEEEEE, $alpha: .15);
			
			.county-single {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 40upx;
				margin-left: 20upx;
				margin-right: 20upx;
				border-bottom: 1px solid rgba($color: #999999, $alpha: .15);
				
				.city-name {
					font-size: 14upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #232425;
				}
				
				image {
					width: 20upx;
					height: 20upx;
	
				}
			}
	
			.county-data {
				width: 450upx;
	
	
	
			}
	
			.province-scroll {
				height: 795upx;
			}
	
			.province-scroll-short {
				height: 900upx;
			}
	
			.two-data {
				width: 280upx;
				background-color: #FFFFFF;
	
				.two-single {
					display: flex;
					align-items: center;
					justify-content: space-between;
					height: 90upx;
					padding-left: 20upx;
					// margin-left: 20upx;
					// margin-right: 20upx;
					// border-bottom: 1px solid rgba($color: #999999, $alpha: .15);
	
					.city-name {
						font-size: 28upx;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #232425;
					}
	
					image {
						width: 42upx;
						height: 42upx;
	
					}
				}
			}
	
			.province-data {
				width: 300upx;
				background: #FFFFFF;
	
	
	
				.province-single {
					width: 300upx;
					display: flex;
					height: 90upx;
					align-items: center;
					font-size: 28upx;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #232425;
	
	
					text {
						margin-left: 30upx;
					}
				}
	
	
			}
		}
	
		.city-active {
			background: #EEEEEE;
			color: #016CE1;
			font-weight: bold;
		}
	
		.choosed-box {
			width: 650upx;
			background: #FFFFFF;
			padding: 30upx 0 0 0;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
	
			.city-single {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 10upx;
				margin-bottom: 10upx;
				padding: 5rpx 10upx;
				// width: 125upx;
				height: 20upx;
				background: rgba($color: #016CE1, $alpha: 0.16);
				border-radius: 26upx;
				font-size: 28upx;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: #016CE1;
	
				image {
					width: 32upx;
					height: 32upx;
					margin-left: 6upx;
				}
			}
		}
	}
	
	.one-text {
		width: 220upx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.selected-box {
		width: 30upx;
		height: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		image{
			width: 30upx;
			height: 30upx;
		}
		border-radius: 7upx;
	}
</style>
