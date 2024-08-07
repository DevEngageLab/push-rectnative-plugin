# MTPush-React-Native

## 1. Setup

Add the mtpush-react-native package to your project.

```
npm install mtpush-react-native --save
```

If using React Native version higher than0.60 skip to step 2 because [Autolinking is now done automatically](https://reactnative.dev/blog/2019/07/03/version-60#native-modules-are-now-autolinked) .

If using React Native 0.60 or lower, run: 

```
react-native link mtpush-react-native
```


### 2. Android Setup

* build.gradle

```

// Top-level build file where you can add configuration options common to all sub-projects/modules.
buildscript {
    repositories {
        google()
        mavenCentral()
        // huawei push need. If you do not need huawei channel，delete it.
        maven { url 'https://developer.huawei.com/repo/' }
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:4.1.0'
        // google push need，and google push need AndroidX. If you do not need google channel，delete it.
        // Please add android.useAndroidX=true in gradle.properties
        classpath 'com.google.gms:google-services:4.3.15'
        // huawei push need，if you do not need huawei channel，delete it.
        classpath 'com.huawei.agconnect:agcp:1.6.0.300'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        // huawei push need，if you do not need huawei channel，delete it.
        maven { url 'https://developer.huawei.com/repo/' }
    }
}
```


  ```
  plugins {
    id 'com.android.application'
    id 'com.facebook.react'
    // google push need. If you do not need google channel，delete it.
    id 'com.google.gms.google-services'
    // huawei push need，if you do not need huawei channel，delete it.
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
            applicationId "yourApplicationId"           //Replace your app package name here
            ...
            manifestPlaceholders = [
                    ENGAGELAB_PRIVATES_APPKEY: "yourAppKey", //Replace your APPKey here
                    ENGAGELAB_PRIVATES_CHANNEL: "yourChannel", //Replace your channel here
                    ENGAGELAB_PRIVATES_PROCESS: ":remote", // Fill in the process where Engagelab sdk works here
                    ENGAGELAB_PRIVATES_SITE_NAME: "" // The name of the data center is optional. If not filled in, it defaults to the Singapore data center.
                     // The mi client configuration needs to be the same as that on the Xiaomi console, and the server configuration needs to be configured on the Portal console.
                    XIAOMI_APPID            : "MI-xxx",
                    XIAOMI_APPKEY           : "MI-xxx",
                    // The meizu client configuration needs to be the same as that on the Meizu console. It also needs to be configured on the Portal console.
                    MEIZU_APPID             : "MZ-xxx",
                    MEIZU_APPKEY            : "MZ-xxx",
                    // The oppo client configuration needs to be the same as that on the oppo console. You also need to configure the server configuration in the Portal console.
                    OPPO_APPID              : "OP-xxx",
                    OPPO_APPKEY             : "OP-xxx",
                    OPPO_APPSECRET          : "OP-xxx",
                    // The vivo client configuration needs to be the same as that on the vivo console, and the server configuration needs to be configured in the Portal console.
                    VIVO_APPID              : "xxx",
                    VIVO_APPKEY             : "xxx",
                    HONOR_APPID             : "xxx",
            ]
        }

        // google push need java 1.8. If you do not need google channel，delete it.
        compileOptions {
          sourceCompatibility JavaVersion.VERSION_1_8
          targetCompatibility JavaVersion.VERSION_1_8
        }
    }
  ```

  ```
  dependencies {
        ...
        implementation project(':mtpush-react-native')  // Add mtpush dependency
    }
  ```

* setting.gradle

  ```
  include ':mtpush-react-native'
  project(':mtpush-react-native').projectDir = new File(rootProject.projectDir, '../node_modules/mtpush-react-native/android')
  ```

* The huawei channel requires the `agconnect-services.json` file, which is configured in the module directory of the application. Please obtain it from [huawei channel console](https://developer.huawei.com/consumer/cn/console#/serviceCards/)
* Google channel requires the `google-services.json` file, which is configured in the module directory of the application. Please obtain it from [google channel console](https://console.firebase.google.com)
* If the meizu channel cannot obtain the token, try adding android.enableR8 = false in gradle.properties to close R8.


### 3. iOS Setup
Note: You need to open the .xcworkspace file in the ios directory to modify your package name

### 3.1 pod

```
pod install
```

* Note: If the project has been installed using pod, please execute the command first

  ```
  pod deintegrate
  ```

### 3.2 Manual

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

## 4. Quote

### 4.1 Android

refer to：[MainApplication.java](https://github.com/DevEngageLab/push-rectnative-plugin/tree/master/example/android/app/src/main/java/com/example/MainApplication.java)

### 4.2 iOS

refer to：[AppDelegate.m](https://github.com/DevEngageLab/push-rectnative-plugin/tree/master/example/ios/example/AppDelegate.mm) 

### 4.3 js

refer to：[App.js](https://github.com/DevEngageLab/push-rectnative-plugin/blob/main/example/App.js) 

## 5. API

refer to：[index.js](https://github.com/DevEngageLab/push-rectnative-plugin/blob/master/index.js)

## 6.  Other
* Be sure to run the example project before integration.
* If you have urgent needs, please go to [EngageLab Community](https://www.engagelab.com/)
* If you want to report a problem, please call `MTPush.setLoggerEnable(true}` first to get the debug log.

 

