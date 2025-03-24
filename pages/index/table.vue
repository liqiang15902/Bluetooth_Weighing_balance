<template>
	<view class="c-column" style="width: 100%;height: 40vh;">
		<view class="c-row" style="margin: 5px;">
			<button type="default" @click="addRow">新增</button>
			<button type="default" @click="removeRow">删除</button>
			<button type="default" @click="saveRow">保存</button>
		</view>
		<c-table class="c-filling" ref="table" :initTable="initTable" @tableEvents="tableEvents"
			@slotEvents="slotEvents" @initComplete="initComplete" />
	</view>
</template>

<script>
	export default {
		props:['data'],
		data() {
			return {
				initTable: {
					resizable:true,
					 border:true,
					
					columns: [
						{			
							field: "shortordno",
							width: 60,
							title: "样品短号",
							
						},
						{
							field: "servgrp",
							width: 60,
							title: "组别",
							
						},
						{					
							field: "methodname",
							title: "检测方法",
							width: 80,
							
						},
						{
							field: "weightdemand",
							title: "称量要求",
							width: 80,
						},
						{
							
							title: "样品质量(g)",
							width: 120,
							children:[
								{
									field: "orderweight",
									title: "样品质量(g)",
									width: 60,
									editRender: {
									        name: "input",
									        props: {
									         type: "input"
									        }
									       }
								},
								{
									field: "Gender",
									title: "备注",
									width: 60,
									editRender: {
										name: "$select",
										options: [
											{
													label: '备注',
													value: '-1'
												},{
												label: '女',
												value: '0'
											},
											{
												label: '男',
												value: '1'
											}
										]
									}
								},
							],
							
						},
						{
							
							title: "平行样质量(g)",
							width: 120,
							children:[
								{
									field: "orderweight",
									title: "平行样质量(g)",
									width: 60,
									editRender: {
									        name: "input",
									        props: {
									         type: "input"
									        }
									       }
								},
								{
									field: "Gender",
									title: "备注",
									width: 60,
									editRender: {
										name: "$select",
										options: [
											{
													label: '备注',
													value: '-1'
												},{
												label: '女',
												value: '0'
											},
											{
												label: '男',
												value: '1'
											}
										]
									}
								},
							]
						},
						{
							
							title: "加标样质量(g)",
							width: 120,
							children:[
								{
									field: "orderweight",
									title: "加标样质量(g)",
									width: 60,
									editRender: {
									        name: "input",
									        props: {
									         type: "input"
									        }
									       }
								},
								{
									field: "Gender",
									title: "备注",
									width: 60,
									editRender: {
										name: "$select",
										options: [
											{
													label: '备注',
													value: '-1'
												},{
												label: '女',
												value: '0'
											},
											{
												label: '男',
												value: '1'
											}
										]
									}
								},
							]
						},
						{
							field: "addOPtion",
							title: '操作',
							width: 80,
							editRender: {
								name: "$select",
								options: [
									{
											label: '添加',
											value: '-1'
										},{
										label: '添加平行样',
										value: '0'
									},
									{
										label: '添加质控样',
										value: '1'
									},
									{
										label: '添加加标样',
										value: '2'
									},
									{
										label: '添加空白',
										value: '3'
									},
									{
										label: '添加空白加标样',
										value: '4'
									},
								]
							},
							fixed: "right"
						},
						{
							field: "group",
							width: 60,
							title: "组别",
							
						}
					],
					loading: false, //加载遮罩
					//注册表格事件列点击事件，行点击事件
					initEventsList: ["header-cell-click", "cell-click"],
					//插槽内容
					initSlotString: `
					<template #operate="{ row }">
						<vxe-button @click="slotEvents(row)">添加</vxe-button>
						
					</template>
					`
				},
				


				// data: [{
				// 	shortordno:'组别1',
				// 	method: "浔阳江头夜送客，枫叶荻花秋瑟瑟。主人下马客在船，举酒欲饮无管弦。醉不成欢惨将别，别时茫茫江浸月。",
				// 	testno: '忽闻水上琵琶声，主人忘归客不发。寻声暗问弹者谁，琵琶声停欲语迟。移船相近邀相见，添酒回灯重开宴。千呼万唤始出来',
				// 	Gender: -1,
				// 	YPquality:'',
				// 	PXYquality:'',
				// 	JBYquality:'',
				// 	addOPtion:-1
				// }, {
				// 	shortordno:'组别2',
				// 	Name: "犹抱琵琶半遮面。转轴拨弦三两声，未成曲调先有情。弦弦掩抑声声思，似诉平生不得志。低眉信手续续弹，说尽心中无限事",
				// 	Sex: "弟走从军阿姨死，暮去朝来颜色故。门前冷落鞍马稀，老大嫁作商人妇。商人重利轻别离，前月浮梁买茶去。去来江口守空船",
				// 	Gender: -1,
				// 	YPquality:'',
				// 	PXYquality:'',
				// 	JBYquality:'',
				// 	addOPtion:-1
				// }, {
				// 	shortordno:'组别3',
				// 	Name: "轻拢慢捻抹复挑，初为《霓裳》后《六幺》。大弦嘈嘈如急雨，小弦切切如私语。嘈嘈切切错杂弹，大珠小珠落玉盘。间关莺语",
				// 	Sex: "沉吟放拨插弦中，整顿衣裳起敛容。自言本是京城女，家在虾蟆陵下住。十三学得琵琶成，名属教坊第一部。曲罢曾教善才服",
				// 	Gender: -1,
				// 	YPquality:'',
				// 	PXYquality:'',
				// 	JBYquality:'',
				// 	addOPtion:-1
				// }, {
				// 	shortordno:'组别4',
				// 	Name: "花底滑，幽咽泉流冰下难。冰泉冷涩弦凝绝，凝绝不通声暂歇。别有幽愁暗恨生，此时无声胜有声。银瓶乍破水浆迸，铁骑突出",
				// 	Sex: "刀枪鸣。曲终收拨当心画，四弦一声如裂帛。东船西舫悄无言，唯见江心秋月白。",
				// 	Gender: -1,
				// 	YPquality:'',
				// 	PXYquality:'',
				// 	JBYquality:'',
				// 	addOPtion:-1
				// }]
			}
		},
		created() {
			console.log(this.data)
			
		},
		methods: {
			//表格加载完成回调函数
			initComplete() {
				this.$refs.table.setTableProps({
					loading: true,
				})
				//模拟异步加载数据
				setTimeout(() => {
					console.log(this.data)
					this.$refs.table.setTableProps({
						loading: false,
						data: this.data,
						
					})
				}, 1000)
			},
			addRow() {
				this.$refs.table.callMethods("insert", {
					Sex: 18,
					Gender: "1",
				})
			},
			removeRow() {
				this.$refs.table.callMethods("removeCheckboxRow")
			},
			async saveRow() {
				let validateRES = await this.$refs.table.callMethods("validate")
				//判断校验是否通过
				if (validateRES != undefined) return
				uni.showToast({
					title: "校验通过"
				})
				this.$refs.table.callMethods("getRecordset").then(res => {
					console.log(res);
				})
			},
			tableEvents(p) {
				console.log(p);
			},
			slotEvents(p) {
				console.log(p);
			}
		}
	}
</script>

<style scoped>
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
