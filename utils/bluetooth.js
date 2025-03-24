const app = getApp()
module.exports = {
    /* ===========蓝牙模块开始================ */

    //  一、 初始化蓝牙
    // InitBle(bleListCallback, errCallback, statusCallback) {
    InitBle() {
        let _this = this
        uni.openBluetoothAdapter({ //初始化蓝牙模块
            success(res) {
                console.log('init ble success==', res);
                uni.showToast({
                    title: '初始化成功',
                    icon: 'success',
                    duration: 800
                })
                _this.SearchBle(bleListCallback, errCallback, statusCallback); //2.0 关于初始化是否需要获取列表根据需求来做，有可能你只需要初始化，那么把这个注释掉即可
            },
            fail(err) {
                uni.showToast({
                    title: '请检查是否已开启蓝牙',
                    icon: 'none',
                    duration: 1500
                })
            }
        })
    },

    // 搜索蓝牙
    SearchBle(bleListCallback, errCallback, statusCallback) {
        let _this = this
        uni.startBluetoothDevicesDiscovery({
            success(res) {
                console.log('start search ble==', res)
                let Loading = true
                statusCallback(Loading)
                _this.timer1 = setTimeout(() => { //加个延迟、目的是为了设备搜索完毕再获取列表，不然获取为空列表
                    _this.GetBleList(bleListCallback, errCallback, statusCallback) //3.0
                    if (this.timer1) {
                        clearTimeout(this.timer1);
                        this.timer1 = null;
                    }
                }, 5000)
            },
            fail(err) {
                console.log("search ble fail==", err);
                errCallback(err)
                uni.showToast({
                    icon: "none",
                    title: "查找设备失败！",
                    duration: 3000
                })
            }
        })
    },


    // 搜索到的蓝牙列表
    GetBleList(bleListCallback, errCallback, statusCallback) {
        var _this = this;
        uni.getBluetoothDevices({
            success(res) {
                // console.log('蓝牙设备列表==1', JSON.stringify(res.devices))
                var bluetoothArr = res.devices.filter(function(obj) {
                    return obj.name != "未知设备" && obj.name == 'mycar_ble'; //这里过滤自己想要的设备
                    // return obj.name != "未知设备" && obj.name == 'CXL';
                })
                console.log('get ble fliter list===', bluetoothArr)
                bleListCallback(bluetoothArr)
                _this.bluetoothList = bluetoothArr
                // _this.bluetoothList = []
            },
            fail(err) {
                console.log("get ble fliter fail==", err);
                errCallback(err)
                uni.showToast({
                    title: '搜索蓝牙设备失败或附件暂无开启的蓝牙设备',
                    icon: 'none',
                    duration: 2000
                })
            },
            complete() {
                console.log('searh ble complete==')
                let Loading = false
                statusCallback(Loading)
                _this.StopSearchBle()
            }
        })
    },


    //  二、 蓝牙连接  根据某一id连接设备，4.0
    ConnectBle(deviceId, successCallback, errorCallback) {
        var _this = this;
        uni.createBLEConnection({
            deviceId: deviceId, //设备id
            success(res) {
                console.log('connect success==', res)
                _this.deviceId = deviceId
                // 设置蓝牙最大传输单元。
                // uni.setBLEMTU(22,512)
                _this.NoticeConnection(deviceId); //连接成功后，开始监听异常
                _this.timer2 = setTimeout(() => { //加个延迟、目的是为了确保连接成功后，再获取服务列表--可以显示正在连接效果
                    _this.GetServiceId(deviceId, successCallback, errorCallback); //5.0
                    uni.showToast({
                        title: '连接成功',
                        icon: 'success',
                        duration: 800
                    })
                    if (this.timer2) {
                        clearTimeout(this.timer2);
                        this.timer2 = null;
                    }
                }, 3000)
            },
            fail(err) {
                console.log('connect err===', err)
                errorCallback(err)
                if (err.errMsg == 'createBLEConnection:fail already connect') {
                    uni.showToast({
                        icon: "none",
                        title: "蓝牙设备已连接",
                        duration: 3000
                    })
                } else {
                    uni.showToast({
                        icon: "none",
                        title: err.errMsg,
                        duration: 3000
                    })
                }
            },
            complete: function() {
                console.log('connect finish==')
            }
        })
    },

    //获取蓝牙设备的服务uuid,5.0    //服务uuid可能有多个
    GetServiceId(deviceId, successCallback, errorCallback) {
        var _this = this
        uni.getBLEDeviceServices({
            deviceId,
            success(res) {
                console.log('get servicesIds==', res)
                _this.serviceid_list = res.services //蓝牙服务列表放在data里面只是备用
                _this.serviceId = res.services[1].uuid //这是用来监听蓝牙下发和接收的服务uuid，关于获取第几个uuid服务，看蓝牙方面提供的协议
                _this.GetCharacteIdNotify(_this.serviceId, deviceId,
                    successCallback) //6.0  获取第2个服务uuid的特征值 (关于获取第几个uuid服务，看蓝牙方面提供的协议
            },
            fail(err) {
                errorCallback(err)
            }
        })
    },

    // 根据服务uuid获取蓝牙特征值,开始监听写入和接收
    GetCharacteIdNotify(serviceId, deviceId, successCallback) {
        let _this = this
        uni.getBLEDeviceCharacteristics({
            deviceId,
            serviceId,
            success(res) {
                console.log('get characterIds==', res.characteristics)
                _this.writeId = res.characteristics[0].uuid //写入id
                _this.notifyId = res.characteristics[1].uuid //接收id
                _this.startNoticeBle(successCallback) //7.0,开始侦听数据
            }
        })
    },

    // 开启蓝牙监听功能
    startNoticeBle(successCallback) {
        let _this = this
        uni.notifyBLECharacteristicValueChange({
            state: true, // 启用 notify 功能
            deviceId: _this.deviceId,
            serviceId: _this.serviceId,
            characteristicId: _this.notifyId,
            success(res) {
                console.log("watch and notice success===", res.errMsg, 'deviceId===', _this.deviceId)
                successCallback(res)
                // _this.GetDataFromBle();
            },
            fail: function(err) {
                console.log('watch and notice fail==', err)
            }
        })
    },



    //  三、 设备返回的数据接收
    GetDataFromBle(successCallback, errorCallback) {
        var _this = this;
        wx.onBLECharacteristicValueChange((res) => {
            // 此时可以拿到蓝牙设备返回来的数据是一个ArrayBuffer类型数据，所以需要通过一个方法转换成字符串
            // console.log('返回的十六进制', _this.ab2hex(res.value))
            _this.bleData = _this.ab2hex(res.value)
            successCallback(_this.bleData)
        })
    },

    // 向蓝牙写入数据
    BleWrite(instruction, successCallback, errorCallback) {
        // 向蓝牙设备发送一个0x00的16进制数据
        let _this = this
        let serviceId = _this.serviceId
        let characteristicId = _this.writeId
        let deviceId = _this.deviceId
        const buffer = _this.hexStringToArrayBuffer(instruction);
        // const dataView = new DataView(buffer)
        // dataView.setUint8(0, 0)
        uni.writeBLECharacteristicValue({
            deviceId, // 蓝牙设备 deviceId
            serviceId, // 蓝牙服务uuid,即第二个uuid
            characteristicId, // 蓝牙特征值的 (即 writeId)
            value: buffer, // 这里的value是ArrayBuffer类型
            success(res) {
                console.log('指令下发成功==', instruction, res, )
                _this.GetDataFromBle(successCallback, errorCallback);
            },
            fail(err) {
                console.log('写入数据失败', err)
                errorCallback(err)
                // uni.showToast({
                //  icon: "none",
                //  title: "请确保您的手机已开启蓝牙并已连接设备",
                //  duration: 3000
                // })
            }
        })
    },

    // 停止搜索蓝牙
    StopSearchBle() {
        uni.stopBluetoothDevicesDiscovery({
            success(res) {
                console.log('stop search ble===', res)
            }
        })
    },

    // 重新搜索蓝牙
    ReSearchBle(bleListCallback, errCallback, statusCallback) {
        console.log('重新扫描')
        this.SearchBle(bleListCallback, errCallback, statusCallback)
    },

    // 关闭蓝牙
    CloseBle(macId) {
        uni.closeBLEConnection({
            deviceId: macId,
            success(res) {
                uni.closeBluetoothAdapter({
                    success: function(res) {
                        console.log("断开蓝牙")
                    },
                    fail: function(err) {}
                })
            },
            fail(err) {}
        })

    },


    // 监听蓝牙连接状态
    NoticeConnection() {
        var _this = this;
        uni.onBLEConnectionStateChange((res) => {
            console.log('开始监听蓝牙状态', res)
            if (!res.connected) {
                console.log('连接已断开');
                app.globalData.isConnect = false;
                uni.showModal({
                    title: '提示',
                    content: '蓝牙已断开，请重新搜索重连！',
                    success(res) {}
                })
                // clearInterval(_this.data.timer)
            }
        })
    },



    /* ===========蓝牙模块结束================ */


    // 工具函数


    // 指令生成
    order(instruction, data) { //传入指令和内容
        // let instruction = '02',data = '00'
        let length = (instruction + data).length / 2
        let hexLength = this.ten2Hex(length) //十六进制长度
        // console.log('lenth==',length,hexLength)

        let str = instruction + data //命令字与数据包字节
        let id = 0
        let sum = 0
        for (let i = 0; i < str.length / 2; i++) {
            id += 2
            let hexstr = str.slice(id - 2, id) //将数据拆分，将其转成10进制累加
            let intstr = this.hex2int(hexstr) //十进制
            sum += intstr
        }

        let checkstr = String(sum)
        let check = checkstr.slice(checkstr.length - 2, checkstr.length) //取得累加和后两位数后，转成16进制校验码
        let hexcheck = this.ten2Hex(check)


        // console.log('最终和为==',sum,check,hexcheck)             
        let order = '550000' + '00' + hexLength + instruction + data + hexcheck +
            'AA' //     '00' 与 hexLength 共两个字节， hexLength 最大为ff,即长度暂时不要超过255,若是需要长度超过255的需要判断16进制的数据是否需要自动进位,本项目不需要再多做处理
        return order
    },



    //字符转换成16进制发送到服务器
    Char2Hex(str) {
        if (str === "") {
            return "";
        } else {
            var hexCharCode = '';
            for (var i = 0; i < str.length; i++) {
                hexCharCode += (str.charCodeAt(i)).toString(16);
            }
            return hexCharCode //  tuh:  747568
        }
    },

    //字符转换成16进制发送到服务器[转换放到新数组]
    Char2Hex2(str) {
        if (str === "") {
            return "";
        } else {
            var hexCharCode = [];
            for (var i = 0; i < str.length; i++) {
                hexCharCode.push('0x' + (str.charCodeAt(i)).toString(16));
            }
            hexCharCode.join(",");
            return hexCharCode //tuh:  ["0x74", "0x75", "0x68"]
        }
    },



    // ArrayBuffer转16进度字符串示例
    ab2hex(buffer) {
        const hexArr = Array.prototype.map.call(
            new Uint8Array(buffer),
            function(bit) {
                return ('00' + bit.toString(16)).slice(-2)
            }
        )
        return hexArr.join('')
    },

    // 16进制转buffer
    hexStringToArrayBuffer(str) {
        if (!str) {
            return new ArrayBuffer(0);
        }
        var buffer = new ArrayBuffer(str.length);
        let dataView = new DataView(buffer)
        let ind = 0;
        for (var i = 0, len = str.length; i < len; i += 2) {
            let code = parseInt(str.substr(i, 2), 16)
            dataView.setUint8(ind, code)
            ind++
        }
        return buffer;
    },

    // 10进制转16进制
    ten2Hex(number) {
        return Number(number) < 16 ? '0' + Number(number).toString(16) : Number(number).toString(16)
    },

    // 16进制转10进制整数
    hex2int(hex) {
        var len = hex.length,
            a = new Array(len),
            code;
        for (var i = 0; i < len; i++) {
            code = hex.charCodeAt(i);
            if (48 <= code && code < 58) {
                code -= 48;
            } else {
                code = (code & 0xdf) - 65 + 10;
            }
            a[i] = code;
        }

        return a.reduce(function(acc, c) {
            acc = 16 * acc + c;
            return acc;
        }, 0);
    },

    //16进制转10进制浮点数
    hex2Float(t) {

        t = t.replace(/\s+/g, "");
        if (t == "") {
            return "";
        }
        if (t == "00000000") {
            return "0";
        }
        if ((t.length > 8) || (isNaN(parseInt(t, 16)))) {
            return "Error";
        }
        if (t.length < 8) {
            t = this.FillString(t, "0", 8, true);
        }
        t = parseInt(t, 16).toString(2);
        t = this.FillString(t, "0", 32, true);
        var s = t.substring(0, 1);
        var e = t.substring(1, 9);
        var m = t.substring(9);
        e = parseInt(e, 2) - 127;
        m = "1" + m;
        if (e >= 0) {
            m = m.substr(0, e + 1) + "." + m.substring(e + 1)
        } else {
            m = "0." + this.FillString(m, "0", m.length - e - 1, true)
        }
        if (m.indexOf(".") == -1) {
            m = m + ".0";
        }
        var a = m.split(".");
        var mi = parseInt(a[0], 2);
        var mf = 0;
        for (var i = 0; i < a[1].length; i++) {
            mf += parseFloat(a[1].charAt(i)) * Math.pow(2, -(i + 1));
        }
        m = parseInt(mi) + parseFloat(mf);
        if (s == 1) {
            m = 0 - m;
        }
        return m;
    },

    //浮点数转16进制
    float2Hex(t) {
        if (t == "") {
            return "";
        }
        t = parseFloat(t);
        if (isNaN(t) == true) {
            return "Error";
        }
        if (t == 0) {
            return "00000000";
        }
        var s,
            e,
            m;
        if (t > 0) {
            s = 0;
        } else {
            s = 1;
            t = 0 - t;
        }
        m = t.toString(2);
        if (m >= 1) {
            if (m.indexOf(".") == -1) {
                m = m + ".0";
            }
            e = m.indexOf(".") - 1;
        } else {
            e = 1 - m.indexOf("1");
        }
        if (e >= 0) {
            m = m.replace(".", "");
        } else {
            m = m.substring(m.indexOf("1"));
        }
        if (m.length > 24) {
            m = m.substr(0, 24);
        } else {
            m = this.FillString(m, "0", 24, false)
        }
        m = m.substring(1);
        e = (e + 127).toString(2);
        e = this.FillString(e, "0", 8, true);
        var r = parseInt(s + e + m, 2).toString(16);
        r = this.FillString(r, "0", 8, true);
        return this.InsertString(r, " ", 2).toUpperCase();
    },

    //需要用到的函数
    InsertString(t, c, n) {
        var r = new Array();
        for (var i = 0; i * 2 < t.length; i++) {
            r.push(t.substr(i * 2, n));
        }
        return r.join(c);
    },
    //需要用到的函数
    FillString(t, c, n, b) {
        if ((t == "") || (c.length != 1) || (n <= t.length)) {
            return t;
        }
        var l = t.length;
        for (var i = 0; i < n - l; i++) {
            if (b == true) {
                t = c + t;
            } else {
                t += c;
            }
        }
        return t;
    },

}

