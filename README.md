# MTPush-React-Native

## 1. 安装

```
npm install mtpush-react-native --save
```

安装完成后连接原生库
进入到根目录执行<br/>
react-native link<br/>
或<br/>
react-native link mtpush-react-native<br/>

## 2. 配置

### 2.1 Android

* build.gradle

  ```
  android {
        defaultConfig {
            applicationId "yourApplicationId"           //在此替换你的应用包名
            ...
            manifestPlaceholders = [
                    ENGAGELAB_PRIVATES_APPKEY: "yourAppKey", //在此替换你的APPKey
                    ENGAGELAB_PRIVATES_CHANNEL: "yourChannel", //在此替换你的channel
                    ENGAGELAB_PRIVATES_PROCESS: ":remote", // 在此填写Engagelabsdk工作所在的进程
                    ENGAGELAB_PRIVATES_SITE_NAME: "" // 数据中心的名称，可不填，不填默认为新加坡数据中心
            ]
        }
    }
  ```

  ```
  dependencies {
        ...
        implementation project(':mtpush-react-native')  // 添加 mtpush 依赖
    }
  ```

* setting.gradle

  ```
  include ':mtpush-react-native'
  project(':mtpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/mtpush-react-native/android')
  ```


### 2.2 iOS
注意：您需要打开ios目录下的.xcworkspace文件修改您的包名

### 2.2.1 pod

```
pod install
```

* 注意：如果项目里使用pod安装过，请先执行命令

  ```
  pod deintegrate
  ```

### 2.2.2 手动方式

* Libraries

  ```
  Add Files to "your project name"
  node_modules/mtpush-react-native/ios/RCTMTPushModule.xcodeproj
  ```

* Capabilities

  ```
  Push Notification --- ON
  ```

* Build Settings

  ```
  All --- Search Paths --- Header Search Paths --- +
  $(SRCROOT)/../node_modules/mtpush-react-native/ios/RCTMTPushModule/
  ```

* Build Phases

  ```
  libz.tbd
  libresolv.tbd
  UserNotifications.framework
  libRCTMTPushModule.a
  ```

## 3. 引用

### 3.1 Android

参考：[MainApplication.java](https://github.com/DevEngageLab/push-rectnative-plugin/tree/master/example/android/app/src/main/java/com/example/MainApplication.java)

### 3.2 iOS

参考：[AppDelegate.m](https://github.com/DevEngageLab/push-rectnative-plugin/tree/master/example/ios/example/AppDelegate.m) 

### 3.3 js

参考：[App.js](https://github.com/DevEngageLab/push-rectnative-plugin/blob/main/example/App.js) 

## 4. API

详见：[index.js](https://github.com/DevEngageLab/push-rectnative-plugin/blob/master/index.js)

## 5.  其他
DevEngageLab
* 集成前务必将example工程跑通
* 如有紧急需求请前往[EngageLab社区](https://www.engagelab.com/)
* 上报问题还麻烦先调用MTPush.setLoggerEnable(true}，拿到debug日志

 

