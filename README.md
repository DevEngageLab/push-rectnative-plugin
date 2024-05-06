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

// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
        // huawei push need，不需要 huawei 通道，则删除
        maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.0'
        // google push need，and google push need AndroidX，不需要 google 通道，则删除
        // 请在gradle.properties中加入android.useAndroidX=true
        classpath 'com.google.gms:google-services:4.3.15'
        // huawei push need，不需要 huawei 通道，则删除
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        // huawei push need，不需要 huawei 通道，则删除
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
```


  ```
  plugins {
    id 'com.android.application'
    id 'com.facebook.react'
    // google push need，不需要 google 通道，则删除
    id 'com.google.gms.google-services'
    // huawei push need，不需要 huawei 通道，则删除
    id 'com.huawei.agconnect'
}

  android {
        // google/huawei push need，it needs to be the same as the one on google/huawei console.
    signingConfigs {
        debug {
            storeFile file("android.keystore")
            storePassword "123456"
            keyAlias "keyAlias"
            keyPassword "123456"
        }
        release {
            storeFile file("android.keystore")
            storePassword "123456"
            keyAlias "keyAlias"
            keyPassword "123456"
        }
    }

        defaultConfig {
            applicationId "yourApplicationId"           //在此替换你的应用包名
            ...
            manifestPlaceholders = [
                    ENGAGELAB_PRIVATES_APPKEY: "yourAppKey", //在此替换你的APPKey
                    ENGAGELAB_PRIVATES_CHANNEL: "yourChannel", //在此替换你的channel
                    ENGAGELAB_PRIVATES_PROCESS: ":remote", // 在此填写Engagelabsdk工作所在的进程
                    ENGAGELAB_PRIVATES_SITE_NAME: "" // 数据中心的名称，可不填，不填默认为新加坡数据中心
                     // mi global client 配置，需要与小米控制台上的一样，还需要在Portal控制台配置 server 配置
                    XIAOMI_GLOBAL_APPID            : "MI-您的，对应平台信息",
                    XIAOMI_GLOBAL_APPKEY           : "MI-您的，对应平台信息",
                    // mz client 配置，需要与魅族控制台上的一样，还需要在Portal控制台配置 server 配置
                    MEIZU_APPID             : "MZ-您的，对应平台信息",
                    MEIZU_APPKEY            : "MZ-您的，对应平台信息",
                    // oppo client 配置，需要与oppo控制台上的一样，还需要在Portal控制台配置 server 配置
                    OPPO_APPID              : "OP-您的，对应平台信息",
                    OPPO_APPKEY             : "OP-您的，对应平台信息",
                    OPPO_APPSECRET          : "OP-您的，对应平台信息",
                    // vivo client 配置，需要与vivo控制台上的一样，还需要在Portal控制台配置 server 配置
                    VIVO_APPID              : "您的，对应平台信息",
                    VIVO_APPKEY             : "您的，对应平台信息",
                    HONOR_APPID             : "您的，对应平台信息",
            ]
        }

        // google push need java 1.8，不需要 google 通道，则删除
        compileOptions {
          sourceCompatibility JavaVersion.VERSION_1_8
          targetCompatibility JavaVersion.VERSION_1_8
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

* huawei通道需要`agconnect-services.json`文件，配置在应用的 module 目录下，请在[huawei通道控制台](https://developer.huawei.com/consumer/cn/console#/serviceCards/)获取
* google通道需要`google-services.json`文件，配置在应用的 module 目录下，请在[google通道控制台](https://console.firebase.google.com) 获取
* meizu通道获取不到token，尝试在 gradle.properties 中添加 android.enableR8 = false 进行关闭 R8


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

 

