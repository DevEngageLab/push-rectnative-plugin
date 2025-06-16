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
const TagAliasEvent          = 'TagAliasEvent'           //TagAlias/Pros事件
const MobileNumberEvent      = 'MobileNumberEvent'       //电话号码事件
const InappMessageEvent      = 'InappMessageEvent'       //应用内消息事件
const NotiInappMessageEvent  = 'NotiInappMessageEvent'   //增强提醒消息事件
const PlatformTokenEvent     = 'PlatformTokenEvent'  // 安卓厂商token回调

export default class MTPush {

    /*
    * 设置是否TCP加密连接，默认关闭状态
    *
    * 该接口需在 init 接口之前调用，否则无效
    * @param enable = boolean
    * */
    static setTcpSSL(enable) {
        MTPushModule.setTcpSSL(enable)
    }

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
    * 设置数据中心
    *
    * 该接口需在 init 接口之前调用，否则无效。 不调用的话默认新加坡数据中心
    * 
    * ！！！ 该接口在1.0.8版本及以上不要求设置。SDK会通过appkey主动寻找对应的数据中心。
    * 
    * @param siteName 数据中心的名称
    * */  
    static setSiteName(siteName) {
        if (Platform.OS == "android") {
            MTPushModule.configSiteName(siteName)
        } else {
            MTPushModule.setSiteName(siteName)
        }
    }

   /*
    * 调试fcm
    *
    * 该接口用来测试fcm, 仅使用在测试环境，正式环境请不要调用。
    * */  
    static testConfigGoogle(enable) {
        if (Platform.OS == "android") {
            MTPushModule.testConfigGoogle(enable)
        }
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
    * 上传厂商token 走tcp上传
    *
    * @param params = {"platform":0,"token":"dev","region":""}
    * platform 厂商，取值范围（1:mi、2:huawei、3:meizu、4:oppo、5:vivo、7:honor、8:google）
    * token    厂商返回的token，不为空
    * region    海外版小米和oppo需要设置region，根据使用地区等填如：“US”等，非海外版的填null
    * 
    * 请在componentDidMount()调用init，否则会影响通知点击事件的回调
    * 请先[init](#init)，否则调用无效
    * 由于走tcp上传，需要长连接成功即[onConnectStatus](#onConnectStatus)回调结果为ture后调用此接口
    * */
    static uploadPlatformToken(params) {
        if (Platform.OS = "android") {
            MTPushModule.uploadPlatformToken(params)
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


    /**
    * 获取 冷启动通知内容
    * 
    * @param {Function} callback = (result) => {"launchNoti":String}
    */
    static getLaunchNoti(callback) {
        if (Platform.OS == "android") {
        } else {
            MTPushModule.getLaunchNoti(callback)
        }
    }


    //*************************tags alias ********************/
    /*
    * 新增标签
    *
    * 这个接口是增加逻辑，而不是覆盖逻辑
    *
    * @param params = {"sequence":int,"tags":StringArray}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * tag:
    * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
    * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
    *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
    * */
    static addTags(params) {
        if (Platform.OS == "android") {
            MTPushModule.addTags(params)
        } else {
            MTPushModule.addTags(params)
        }
    }

    /*
    * 覆盖标签
    *
    * 需要理解的是，这个接口是覆盖逻辑，而不是增量逻辑。即新的调用会覆盖之前的设置
    *
    * @param params = {"sequence":int,"tags":StringArray}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * tag:
    * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
    * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
    *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
    * */
    static updateTags(params) {
        if (Platform.OS == "android") {
            MTPushModule.updateTags(params)
        } else {
            MTPushModule.setTags(params)
        }
    }

    /*
    * 删除指定标签
    *
    * @param params = {"sequence":int,"tag":StringArray}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * tag:
    * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
    * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
    *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
    * */
    static deleteTag(params) {
        if (Platform.OS == "android") {
            MTPushModule.deleteTags(params)
        } else {
            MTPushModule.deleteTags(params)
        }
    }

    /*
    * 清除所有标签
    *
    * @param params = {"sequence":int}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * */
    static deleteTags(params) {
        if (Platform.OS == "android") {
            MTPushModule.cleanTags(params)
        } else {
            MTPushModule.cleanTags(params)
        }
    }

    /*
    * 查询指定 tag 与当前用户绑定的状态
    *
    * @param params = {"sequence":int,"tag":String}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * tag:
    * 有效的标签组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
    * 限制：每个 tag 命名长度限制为 40 字节，最多支持设置 1000 个 tag，且单次操作总长度不得超过 5000 字节
    *（判断长度需采用 UTF-8 编码）单个设备最多支持设置 1000 个 tag。App 全局 tag 数量无限制
    * */
    static queryTag(params) {
        if (Platform.OS == "android") {
            MTPushModule.queryTag(params)
        } else {
            MTPushModule.validTag(params)
        }
    }

    /*
    * 查询所有标签
    *
    * @param params = {"sequence":int}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * */
    static queryTags(params) {
        if (Platform.OS == "android") {
            MTPushModule.getAllTags(params)
        } else {
            MTPushModule.getAllTags(params)
        }
    }

    /*
    * 设置别名
    * 需要理解的是，这个接口是覆盖逻辑，而不是增量逻辑。即新的调用会覆盖之前的设置
    *
    * @param params = {"sequence":int,"alias":String}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * alias:
    * 每次调用设置有效的别名，覆盖之前的设置
    * 有效的别名组成：字母（区分大小写）、数字、下划线、汉字、特殊字符@!#$&*+=.|
    * 限制：alias 命名长度限制为 40 字节。（判断长度需采用 UTF-8 编码）
    * */
    static setAlias(params) {
        if (Platform.OS == "android") {
            MTPushModule.setAlias(params)
        } else {
            MTPushModule.setAlias(params)
        }
    }

    /*
    * 删除别名
    *
    * @param params = {"sequence":int}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * */
    static deleteAlias(params) {
        if (Platform.OS == "android") {
            MTPushModule.deleteAlias(params)
        } else {
            MTPushModule.deleteAlias(params)
        }
    }

    /*
    * 查询别名
    *
    * @param params = {"sequence":int}
    *
    * sequence:
    * 请求时传入的序列号，会在回调时原样返回
    * */
    static queryAlias(params) {
        if (Platform.OS == "android") {
            MTPushModule.getAlias(params)
        } else {
            MTPushModule.getAlias(params)
        }
    }
   /*
    * 设置推送个性化属性/更新用户指定推送个性化属性
    * */
    static setProperties(params) {
        if (Platform.OS == "android") {
            MTPushModule.setProperties(params)
        } else {
            MTPushModule.setProperties(params)
        }
    }

     /* 应用内消息，请配置pageEnterTo 和 pageLeave 方法，请配套使用
    * 进入页面，pageName:页面名 String
    * */
     static pageEnterTo(pageName) {
        if (Platform.OS == "android") {
            
        } else {
            MTPushModule.pageEnterTo(pageName)
        }
    }

    /* 应用内消息，请配置pageEnterTo 和 pageLeave 方法，请配套使用
    * 离开页面，pageName:页面名 String 
    * */
    static pageLeave(pageName) {
        if (Platform.OS == "android") {
            
        } else {
            MTPushModule.pageLeave(pageName)
        }
    }

  //***************************************设置***************************************
  /**
   * 跳转到通知设置界面
   */
  static goToAppNotificationSettings() {
    MTPushModule.goToAppNotificationSettings()
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
    * badge:iOS MTPush封装badge功能，允许应用上传 badge 值至 MTPush 服务器，由 MTPush 后台帮助管理每个用户所对应的推送 badge 值，简化了设置推送 badge 的操作。设置的值小于0时，sdk不作处理。
    *
    * appBadge: iOS/Android 用来标记应用程序状态的一个数字，出现在程序图标右上角。设置的值小于0时，sdk不作处理。(安卓仅华为/荣耀生效)
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
    * notificationEventType：ios分为notificationArrived和notificationOpened两种,android有notificationArrived和notificationOpened和notificationDismissed三种
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
    * notificationEventType：ios分为notificationArrived和notificationOpened两种,android有notificationArrived和notificationOpened和notificationDismissed三种
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

    /*
    * tag alias事件
    *
    * @param {Function} callback = (result) => {"code":int,"sequence":int，"tags":String,"tag":String,"tagEnable":boolean,"alias":String}
    *
    * code:结果，0为操作成功
    *
    * sequence:请求时传入的序列号，会在回调时原样返回
    *
    * tags:执行tag数组操作时返回
    *
    * tag:执行查询指定tag(queryTag)操作时会返回,tagEnable:执行查询指定tag(queryTag)操作时会返回是否可用
    *
    * alias：对alias进行操作时返回
    *
    * */
    static addTagAliasListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            TagAliasEvent, result => {
                callback(result)
            })
    }

    /*
    * 应用内消息事件
    *
    * @param {Function} callback = (result) => {"mesageId":String，"title":String, "content":String, "target":String, "clickAction":String, extras":{String:String}}}
    *
    * messageID:唯一标识自定义消息的 ID
    *
    * title: 标题
    *
    * content:内容
    *
    * target:目标页面
    *
    * clickAction:跳转地址
    *
    * extras:附加字段
    *
    * */
    static addInappMessageListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            InappMessageEvent, result => {
                callback(result)
            })
    }

    /*
    * 增强提醒事件 iOS only
    *
    * @param {Function} callback = (result) => {"messageID":String,"title":String，"content":String,"badge":String,"ring":String,"extras":{String:String},"notiInappEventType":String}
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
    * notiInappEventType：有notiInappShow和notiInappClick两种
    *
    * 注意：应用在存活状态下点击通知不会有跳转行为，应用在被杀死状态下点击通知会启动应用
    *
    * */
    static addNotiInappMessageListener(callback) {
        listeners[callback] = DeviceEventEmitter.addListener(
            NotiInappMessageEvent, result => {
                callback(result)
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

     /*
    * 配置 appkey，优先级比 AndroidManifest 里配置的高
    * */
     static configAppKey(params) {
        if (Platform.OS == "android") {
            MTPushModule.configAppKey(params)
        } else {
           
        }
    }

     /*
    * 上报厂商token
    * */
     static uploadPlatformToken(params) {
        if (Platform.OS == "android") {
            MTPushModule.uploadPlatformToken(params)
        } else {
           
        }
    }

    /*
    * 清空厂商token
    * */
    static clearPlatformToken() {
        if (Platform.OS == "android") {
            MTPushModule.clearPlatformToken()
        } else {
           
        }
    }

    /*
    * 厂商token回调
    *
    * @param {Function} callback = (result) => {"platform":int,"token":String}}
    *
    * platform:厂商对应的数字标识
    *
    * token:返回的厂商token
    *
    *
    * */
        static addPlatformListener(callback) {
            listeners[callback] = DeviceEventEmitter.addListener(
                PlatformTokenEvent, result => {
                    callback(result)
                })
        }


}
