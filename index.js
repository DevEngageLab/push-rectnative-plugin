import {
    DeviceEventEmitter,
    NativeModules,
    Platform
} from 'react-native'

const MTPushModule = NativeModules.MTPushModule

const listeners = {}
const ConnectEvent           = 'ConnectEvent'            //连接状态
const NotificationEvent      = 'NotificationEvent'       //通知事件
const LocalNotificationEvent = 'LocalNotificationEvent'  //本地通知事件
const CustomMessageEvent     = 'CustomMessageEvent'      //自定义消息事件
const MobileNumberEvent      = 'MobileNumberEvent'       //电话号码事件

export default class MTPush {

    /*
    * 设置调试模式，默认关闭状态
    *
    * 该接口需在 init 接口之前调用，避免出现部分日志没打印的情况
    * @param enable = boolean
    * */
    static setLoggerEnable(enable) {
        MTPushModule.setDebugMode(enable)
    }

    /*
    * 初始化推送服务
    * {"appKey":"","channel":"dev","production":1}
    * 请在componentDidMount()调用init，否则会影响通知点击事件的回调
    * */
    static init(params) {
        if (Platform.OS == "android") {
            MTPushModule.init()
        } else {
            MTPushModule.setupWithConfig(params)
        }
    }

    /*
    * 获取 RegistrationID
    *
    * 调用此 API 来取得应用程序对应的 RegistrationID。
    * 只有当应用程序成功注册到 MTPush 的服务器时才返回对应的值，否则返回空字符串
    *
    * @param {Function} callback = (result) => {"registerID":String}
    * */
    static getRegistrationID(callback) {
        if (Platform.OS == "android") {
            MTPushModule.getRegistrationID(callback)
        } else {
            MTPushModule.getRegisterId(callback)
        }
    }

    //***************************************统计***************************************

    /*
    * 设置手机号码。该接口会控制调用频率，频率为 10s 之内最多 3 次
    *
    * @param params = {"sequence":int,"mobileNumber":String}
    *
    * sequence:请求时传入的序列号，会在回调时原样返回
    * */
    static setMobileNumber(params) {
        if (Platform.OS == "android") {
            MTPushModule.setMobileNumber(params)
        } else {
            MTPushModule.setMobileNumber(params)
        }
    }

//    /*
//    *   检查当前应用的通知开关是否开启
//    * */
//    static isNotificationEnabled(callback){
//        if (Platform.OS == "android"){
//            MTPushModule.isNotificationEnabled(callback)
//        }
//    }

    //***************************************本地通知***************************************

    /*
    * 添加一个本地通知
    *
    * @param {"messageID":String,"title":String，"content":String,"extras":{String:String}}
    *
    * messageID:唯一标识通知消息的ID，可用于移除消息。
    * android用到的是int，ios用到的是String，rn这边提供接口的时候统一改成了String，然后android拿到String转int。输入messageID的时候需要int值范围在[1，2147483647]然后转成String。
    *
    * title:对应“通知标题”字段
    *
    * content:对应“通知内容”字段
    *
    * extras:对应“附加内容”字段
    *
    * */
    static addLocalNotification(params) {
        if (Platform.OS == "android") {
            MTPushModule.addLocalNotification(params)
        } else {
            MTPushModule.addNotification(params)
        }
    }

    /*
    * 移除指定的本地通知
    *
    * @param {"messageID":String}
    *
    * messageID:唯一标识通知消息的ID，可用于移除消息
    *
    * */
    static removeLocalNotification(params) {
        if (Platform.OS == "android") {
            MTPushModule.removeLocalNotification(params)
        } else {
            MTPushModule.removeNotification(params)
        }
    }

    /*
    * 移除所有的本地通知
    * */
    static clearLocalNotifications() {
        if (Platform.OS == "android") {
            MTPushModule.clearLocalNotifications()
        } else {
            MTPushModule.clearLocalNotifications()
        }
    }

    /*
    * 设置 Badge
    *
    * @param params = {"badge":int,"appBadge":int}
    *
    * badge:MTPush封装badge功能，允许应用上传 badge 值至 MTPush 服务器，由 MTPush 后台帮助管理每个用户所对应的推送 badge 值，简化了设置推送 badge 的操作。设置的值小于0时，sdk不作处理。
    *
    * appBadge:iOS 用来标记应用程序状态的一个数字，出现在程序图标右上角。设置的值小于0时，sdk不作处理。
    *
    * */
    static setBadge(params) {
        if (Platform.OS == "ios") {
            MTPushModule.setBadge(params)
        }else if (Platform.OS == "android") {
            MTPushModule.setBadgeNumber(params)
        }
    }

    //***************************************接口回调***************************************

    //连接状态
    static addConnectEventListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
                ConnectEvent, result => {
                callback(result)
            })
    }

    /*
    * 通知事件
    *
    * @param {Function} callback = (result) => {"messageID":String,"title":String，"content":String,"badge":String,"ring":String,"extras":{String:String},"notificationEventType":String}
    *
    * messageID:唯一标识通知消息的 ID
    *
    * title:对应 Portal 推送通知界面上的“通知标题”字段
    *
    * content:对应 Portal 推送通知界面上的“通知内容”字段
    *
    * badge:对应 Portal 推送通知界面上的可选设置里面的“badge”字段 (ios only)
    *
    * ring:对应 Portal 推送通知界面上的可选设置里面的“sound”字段 (ios only)
    *
    * extras:对应 Portal 推送消息界面上的“可选设置”里的附加字段
    *
    * notificationEventType：分为notificationArrived和notificationOpened两种
    *
    * 注意：应用在存活状态下点击通知不会有跳转行为，应用在被杀死状态下点击通知会启动应用
    *
    * */
    static addNotificationListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            NotificationEvent, result => {
                callback(result)
            })
    }

    /*
    * 本地通知事件
    *
    * @param {Function} callback = (result) => {"messageID":String,"title":String，"content":String,"extras":{String:String},"notificationEventType":String}
    *
    * messageID:唯一标识通知消息的ID，可用于移除消息
    *
    * title:对应“通知标题”字段
    *
    * content:对应“通知内容”字段
    *
    * extras:对应“附加内容”字段
    *
    * notificationEventType：分为notificationArrived和notificationOpened两种
    *
    * 注意：应用在存活状态下点击通知不会有跳转行为，应用在被杀死状态下点击通知会启动应用
    *
    * */
    static addLocalNotificationListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            LocalNotificationEvent, result => {
                callback(result)
            })
    }

    /*
    * 自定义消息事件
    *
    * @param {Function} callback = (result) => {"messageID":String，"content":String,"extras":{String:String}}}
    *
    * messageID:唯一标识自定义消息的 ID
    *
    * content:对应 Portal 推送消息界面上的“自定义消息内容”字段
    *
    * extras:对应 Portal 推送消息界面上的“可选设置”里的附加字段
    *
    * */
    static addCustomMessageListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            CustomMessageEvent, result => {
                callback(result)
            })
    }



    /*
    * 手机号码事件
    *
    * @param {Function} callback = (result) => {"code":int,"sequence":int}
    *
    * code:结果，0为操作成功
    *
    * sequence:请求时传入的序列号，会在回调时原样返回
    *
    * */
    static addMobileNumberListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            MobileNumberEvent, message => {
                callback(message)
            })
    }

    //移除事件
    static removeListener(callback) {
        if (!listeners[callback]) {
            return
        }
        listeners[callback].remove()
        listeners[callback] = null
    }

    //***************************************Android Only***************************************

    /*
    * 停止推送服务
    * */
    static stopPush() {
        if (Platform.OS == "android") {
            MTPushModule.stopPush()
        }
    }

    /*
    * 恢复推送服务
    * */
    static resumePush() {
        if (Platform.OS == "android") {
            MTPushModule.resumePush()
        }
    }

    /*
    * 设置允许推送时间
    *
    * 默认情况下用户在任何时间都允许推送。即任何时候有推送下来，客户端都会收到，并展示。
    * 开发者可以调用此 API 来设置允许推送的时间。
    * 如果不在该时间段内收到消息，SDK 的处理是：推送到的通知会被扔掉。
    *
    * 这是一个纯粹客户端的实现，所以与客户端时间是否准确、时区等这些，都没有关系。
    * 而且该接口仅对通知有效，自定义消息不受影响。
    * */
    static setPushTime(params) {
        if (Platform.OS == "android") {
            MTPushModule.setPushTime(params)
        }
    }

    /*
    * 设置通知静默时间
    *
    * 默认情况下用户在收到推送通知时，客户端可能会有震动，响铃等提示。
    * 但用户在睡觉、开会等时间点希望为“免打扰”模式，也是静音时段的概念。
    * 开发者可以调用此 API 来设置静音时段。如果在该时间段内收到消息，则：不会有铃声和震动。
    * */
    static setSilenceTime(params) {
        if (Platform.OS == "android") {
            MTPushModule.setSilenceTime(params)
        }
    }

    /*
    * 设置保留最近通知条数
    *
    * @param params = {"notificationMaxNumber":int}
    *
    * 通过极光推送，推送了很多通知到客户端时，如果用户不去处理，就会有很多保留在那里。
    * 调用此 API 可以限制保留的通知条数，默认为保留最近 5 条通知。
    *
    * 仅对通知有效。所谓保留最近的，意思是，如果有新的通知到达，之前列表里最老的那条会被移除。
    * 例如，设置为保留最近 5 条通知。假设已经有 5 条显示在通知栏，当第 6 条到达时，第 1 条将会被移除。
    * */
    static setLatestNotificationNumber(params) {
        if (Platform.OS == "android") {
            MTPushModule.setLatestNotificationNumber(params)
        }
    }

    /*
    * 动态配置 channel，优先级比 AndroidManifest 里配置的高
    * */
    static setChannel(params) {
        if (Platform.OS == "android") {
            MTPushModule.setChannel(params)
        } else {
            // setupWithOpion
        }
    }



}
