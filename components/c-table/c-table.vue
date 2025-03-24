<template>
	<!-- vxe-table将被渲染在这里 -->
	<view :id="id" :data="data" :change:data="vxeTableModule.updateData">
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
		props: {
			initTable: { //初始化表格数据对象
				type: Object,
				default: undefined
			}
		},
		watch: {
			initTable() {
				if (!this.initTable) return
				this.setTableProps(this.initTable, "init")
			}
		},
		created() {
			//初始化表格
			this.$nextTick(() => {
				if (!this.initTable) return
				this.setTableProps(this.initTable, "init")
				this.$nextTick(() => this.$emit("initComplete"))
			})
		},
		data() {
			return {
				data: {
					props: undefined,
					setType: undefined,
					methodsName: undefined,
					methodsParam: undefined
				},
				id: "id" + $getKey(), //每次创建组件重新生成id，达到可以在一个页面显示多个表格
				tableRef: undefined,
				executionCompleteMethods: {} //执行完成的方法对象和值，用来给Promise进行验证时使用
			}
		},
		methods: {

			/**
			 * 修改组件属性
			 * @param {Object} props 组件props参数
			 * @param {String} setType 修改类型
			 */
			setTableProps(props, setType) {
				this.data = {
					id: this.id,
					props,
					setType: setType ? setType : "setProps"
				}
			},
			/**
			 * 调用组件方法
			 * @param {String} methodsName 方法名称
			 * @param {Object} methodsParam 方法参数
			 */
			callMethods(methodsName, methodsParam) {
				//生成临时主键用来给Promise进行验证时使用
				let key = $getKey();
				this.data = {
					methodsName,
					methodsParam,
					key
				}
				return new Promise((resolve, reject) => {
					this.verificationMethods(resolve, key);
				})
			},
			/**
			 * @param {Object} resolve 方法执行成功回调函数
			 * @param {String} key 方法执行的临时key
			 */
			verificationMethods(resolve, key) {
				//轮询验证
				setTimeout(() => {
					if (key in this.executionCompleteMethods) {
						resolve(this.executionCompleteMethods[key]);
						//释放内存
						delete this.executionCompleteMethods[key];
					} else {
						this.verificationMethods(resolve, key);
					}
				}, 1);
			},
			/**
			 * 调用组件方法的回调函数
			 * @param {Object} param
			 */
			callMethodsCallback(param) {
				//添加完成方法以及值
				this.executionCompleteMethods[param.key] = param.methodsParam;
				this.$emit("callMethods", param)
			},
			/**
			 * 表格事件
			 * @param {Object} param 事件参数
			 */
			tableEvents(param) {
				this.$emit("tableEvents", param)
			},
			//表格插槽事件
			slotEvents(param) {
				this.$emit("slotEvents", param)
			}
		}
	}
</script>

<script module="vxeTableModule" lang="renderjs">
	module.exports = {
		data() {
			return {
				vm: null, //vue实例
				id_r: undefined, //每次创建组件重新生成id，达到可以在一个页面显示多个表格
				tableProps: { //表格所有参数
					tablePropsObj: {
						size: " small",
						border: "default",
						align: "center",
						headerAlign: "center",
						// height: "850px",
						autoResize: true,
						stripe: true, //开启斑马纹
						showOverflow: true,
						resizable: true,
						highlightHoverRow: true,
						highlightCurrentRow: true,
						highlightCurrentColumn: true, //允许高亮显示列
						checkboxConfig: {
							highlight: true
						},
						tooltipConfig: {
							enterable: true
						},
						editConfig: {
							trigger: "click",
							mode: "cell",
							showUpdateStatus: true
						},
						keepSource: true,
						data: [],
						columns: []
					},
				}
			}
		},
		methods: {
			//更新数据
			updateData(newValue, oldValue, ownerInstance, instance) {
				if (newValue.setType == "init") this.id_r = newValue.id
				//判断需要对组件做什么操作
				//修改数据绑定
				if (newValue.setType) {
					this.setTableProps_r(newValue.props, newValue.setType, ownerInstance);
				}
				//调用方法
				if (newValue.methodsName) {
					this.callMethods_r(newValue.methodsName, newValue.methodsParam, ownerInstance, newValue.key);
				}
			},
			/**
			 * 修改组件属性
			 * @param {Object} props 组件props参数
			 * @param {String} setType 修改类型
			 */
			setTableProps_r(props, setType, ownerInstance) {
				//初始化
				if (setType == "init") {
					Object.assign(this.tableProps.tablePropsObj, props)
					//组件下拉事件无法传入的解决方案
					// this.tableProps.tablePropsObj.columns.forEach(item=>{
					//       if(item.field=="addOPtion"){
					//        item.editRender.events={}
					//        item.editRender.events.change=(e)=>{
					//         ownerInstance.callMethod('tableEvents', {
					//          param: {column:{field:e.column.field},row:e.row},
					//          eventsName:"selectChange"
					//         })
					//        }
					//       }     
					//      })
					this.loadHtml(props.initSlotString, props.initEventsList);
					this.loadScript(ownerInstance, props.staticBasePath ? props.staticBasePath : "");
				}
				//修改数据绑定
				if (setType == "setProps") {
					Object.assign(this.tableProps.tablePropsObj, props)
				}
			},
			/**
			 * 调用组件方法
			 * @param {String} methodsName 方法名称
			 * @param {Object} methodsParam 方法参数
			 * @param {String} key 本地调用方法的临时主键
			 */
			callMethods_r(methodsName, methodsParam, ownerInstance, key) {
				let data = {
					methodsName,
					key,
					methodsParam: undefined
				}
				//判断参数是否为多个
				if (methodsParam) {
					if (methodsParam._multiple) {
						data.methodsParam = this.vm.$refs.table[methodsName](...methodsParam._multiple)
					} else {
						data.methodsParam = this.vm.$refs.table[methodsName](methodsParam)
					}
				} else {
					data.methodsParam = this.vm.$refs.table[methodsName](methodsParam)
				}
				//因为必须要延时一下,否则使用下方注释代码则会出现返回上一次的数据,测试调用组件方法为:getTableData,暂时这样写,后续再进行处理
				let isPromise = obj => {
					return !!obj //有实际含义的变量才执行方法，变量null，undefined和''空串都为false
						&&
						(typeof obj === 'object' || typeof obj === 'function') // 初始promise 或 promise.then返回的
						&&
						typeof obj.then === 'function';
				}
				//判断返回值是否是Promise
				if (isPromise(data.methodsParam)) {
					data.methodsParam.then(res => {
						//过滤可以返回的值，无法被JSON.stringify的值将不进行返回
						if (typeof(res) == "object") {
							let _obj = {}
							let _arr = []
							//判断值是否允许返回
							let JSONstringify = (obj) => {
								try {
									JSON.stringify(obj)
									return true
								} catch (e) {
									return false
								}
							}
							XEUtils.lastEach(res, (item, key) => {
								if (XEUtils.isPlainObject(res)) {
									if (JSONstringify(res[key])) {
										_obj[key] = res[key]
									}
								} else if (XEUtils.isArray(res)) {
									if (JSONstringify(res[key])) {
										_arr.push(res[key])
									}
								}
							})
							if (XEUtils.isPlainObject(res)) {
								data.methodsParam = _obj
							} else if (XEUtils.isArray(res)) {
								data.methodsParam = _arr
							}
						} else {
							data.methodsParam = res
						}
						setTimeout(() => {
							ownerInstance.callMethod('callMethodsCallback', data)
						}, 1)
					})
					return
				}
				setTimeout(() => {
					ownerInstance.callMethod('callMethodsCallback', data)
				}, 1)
				// ownerInstance.callMethod('callMethodsCallback', {
				// 	methodsName,
				// 	methodsParam: vm.$refs.table[methodsName](methodsParam)
				// })
			},
			/**
			 * 加载vxeTable标签
			 * @param {Object} initSlotString 插槽的标签字符串
			 * @param {Array} initEventsList 需要表格的回调函数
			 */
			loadHtml(initSlotString, initEventsList) {
				//获取vxe-table要被渲染出来的dom节点，并向此节点内写入内容
				var tableTemplate = document.getElementById(this.id_r);
				//初始化表格时的事件字符串
				let initEventsString = ""
				if (initEventsList) {
					if (typeof(initEventsList[0]) == "string") {
						//向下兼容组件1.0写法
						initEventsList.forEach(item => {
							initEventsString +=
								` @${item}="tableEvents($event,null,'${item}')"`
						})
					} else if (typeof(initEventsList[0]) == "object") {
						//需要返回的参数字段名
						let paramNameList = ""
						//向下兼容组件1.0写法
						initEventsList.forEach(item => {
							item.paramNameList.forEach(paramName => {
								paramNameList += `'${paramName}',`
							})
							paramNameList = paramNameList.substring(0, paramNameList.length - 1)
							initEventsString +=
								` @${item.name}="tableEvents($event,[${paramNameList}],'${item.name}')"`
							paramNameList = ""
						})
					}
				}
				tableTemplate.innerHTML = `
				<style>
					.is--new {
					  background-color: #fefee9 !important;
					}
				</style>
					<div id="${this.id_r}Vue" style="width: 100%;height: 100%;">
						<template>
							<div style="width: 100%;height: 100%;">
								<vxe-grid ref="table" v-bind="tablePropsObj" ${initEventsString}>
									${initSlotString?initSlotString:''}
								</vxe-grid>
							</div>
						</template>
					</div>
								`;
			},
			//加载表格所需要的script文件，并渲染表格
			//staticBasePath 静态资源文件基础路径，特殊情况下需要写
			async loadScript(ownerInstance, staticBasePath) {
				//加载vue.js
				if (document.getElementsByClassName('vueScript').length == 0) {
					await new Promise((resolve, reject) => {
						var vueScript = document.createElement('script');
						vueScript.src = staticBasePath + 'static/c-table/js/vue-2.6.14.js';
						vueScript.className = 'vueScript';
						document.head.appendChild(vueScript);
						vueScript.onload = () => resolve()
					})
				}
				//加载xe-utils js
				if (document.getElementsByClassName('XEUtilsScript').length == 0) {
					await new Promise((resolve, reject) => {
						var XEUtilsScript = document.createElement('script');
						XEUtilsScript.src = staticBasePath + 'static/c-table/js/xe-utils3.3.1.js';
						XEUtilsScript.className = 'XEUtilsScript';
						document.head.appendChild(XEUtilsScript);
						XEUtilsScript.onload = () => resolve()
					})
				}
				//加载vxeTable js
				if (document.getElementsByClassName('vxeTableScript').length == 0) {
					await new Promise((resolve, reject) => {
						var vxeTableScript = document.createElement('script');
						vxeTableScript.src = staticBasePath + 'static/c-table/js/vxe-table3.3.11.js';
						vxeTableScript.className = 'vxeTableScript';
						document.head.appendChild(vxeTableScript);
						vxeTableScript.onload = () => resolve()
					})
				}
				//加载vxeTable css
				if (document.getElementsByClassName('vxeTableCss').length == 0) {
					await new Promise((resolve, reject) => {
						var link = document.createElement('link');
						link.rel = 'stylesheet';
						link.type = 'text/css';
						link.href = staticBasePath + 'static/c-table/css/vxe-table3.3.11.css';
						link.className = 'vxeTableCss';
						document.head.appendChild(link);
						link.onload = () => resolve()
					})
				}
				let _ownerInstance = ownerInstance;
				this.vm = new Vue({
					data: this.tableProps,
					methods: {
						/**
						 * 表格的所有回调函数
						 * @param {Object} param 回调函数的参数
						 * @param {Array} paramNameList 需要返回的参数字段名(已废弃使用，但为兼容1.0写法，所以此参数占位)
						 * @param {String} eventsName 回调函数的名称
						 */
						tableEvents(param, paramNameList, eventsName) {
							let params = {};
							let JSONstringify = (key) => {
								try {
									JSON.stringify(param[key])
									return true
								} catch (e) {
									return false
								}
							}
							//过滤可以返回的参数
							Object.keys(param).forEach(key => {
								if (JSONstringify(key)) {
									params[key] = param[key]
								}
							})
							_ownerInstance.callMethod('tableEvents', {
								param: params,
								eventsName
							})
						},
						//表格插槽回调事件
						slotEvents() {
							_ownerInstance.callMethod('slotEvents', arguments)
						}
					}
				}).$mount("#" + this.id_r + "Vue")
			},
		}
	}
</script>

<style scoped>
</style>
