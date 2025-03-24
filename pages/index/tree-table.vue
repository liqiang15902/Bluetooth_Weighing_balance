<template>
	<view style="width: 100%;height: 40vh;">
		<c-table ref="table" style="width: 100%;height: 100%;" :initTable="initTable" @initComplete="initComplete" />
	</view>
</template>

<script>
	/**
	 * 获取主键
	 * @param {Object} len 生成主键的长度
	 * @param {Object} radix 基数
	 */
	function $getKey(len, radix) {
		let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
		let uuid = [],
			i;
		radix = radix || chars.length;

		if (len) {
			// Compact form
			for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
		} else {
			// rfc4122, version 4 form
			let r;

			// rfc4122 requires these characters
			uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			uuid[14] = '4';

			// Fill in random data.  At i==19 set the high bits of clock sequence as
			// per rfc4122, sec. 4.1.5
			for (i = 0; i < 32; i++) {
				if (!uuid[i]) {
					r = 0 | Math.random() * 16;
					uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			}
		}
		return uuid.join('');
	}
	export default {
		data() {
			return {
				initTable: {
					columns: [{
							treeNode: true, //在这个列上显示展开图标
							field: "name",
							title: "菜单名称",
							width: 150,
						},
						{
							field: "code",
							title: "菜单代码",
							width: 100,
						},
						{
							field: "creationTime",
							title: "创建时间",
							width: 100,
						}
					],
					loading: false, //加载遮罩
					//树菜单额外配置
					treeConfig: {
						children: 'children',
						line: true,
						reserve: true
					},
					line: true,
					reserve: true,
					rowId: "id"
				},
				//树形菜单数据
				data: [{
					id: $getKey(),
					name: "一级菜单1",
					code: 996,
					creationTime: "2021-12-02",
					children: [{
						id: $getKey(),
						name: "二级菜单1",
						code: 996,
						creationTime: "2021-12-02",
					}, {
						id: $getKey(),
						name: "二级菜单2",
						code: 996,
						creationTime: "2021-12-02",

					}, {
						id: $getKey(),
						name: "二级菜单3",
						code: 996,
						creationTime: "2021-12-02",
						children: [{
							id: $getKey(),
							name: "三级菜单1",
							code: 996,
							creationTime: "2021-12-02",
						}]
					}]
				}, {
					id: $getKey(),
					name: "一级菜单2",
					code: 996,
					creationTime: "2021-12-02",

				}, {
					id: $getKey(),
					name: "一级菜单3",
					code: 996,
					creationTime: "2021-12-02",
					children: [{
						id: $getKey(),
						name: "二级菜单1",
						code: 996,
						creationTime: "2021-12-02",
					}, {
						id: $getKey(),
						name: "二级菜单2",
						code: 996,
						creationTime: "2021-12-02",

					}]
				}]
			}
		},
		created() {},
		methods: {
			//表格加载完成回调函数
			initComplete() {
				this.$refs.table.setTableProps({
					loading: true,
				})
				//模拟异步加载数据
				setTimeout(() => {
					this.$refs.table.setTableProps({
						loading: false,
						data: this.data,
					})
				}, 1000)
			},
		}
	}
</script>

<style scoped>
</style>
