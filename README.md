# MTPush-React-Native

## Compatibility

| Package version | React Native | Expo |
| --- | --- | --- |
| `1.4.0+` | `0.76.0+` | SDK 52+ through the bundled Expo config plugin |

Expo support is available starting with `mtpush-react-native` 1.4.0. Expo projects must use a development
build generated with `expo prebuild`; this package cannot run in Expo Go.

React Native projects below 0.76.0 should use `mtpush-react-native@1.3.1` or an earlier version. These legacy
versions do not include Expo config plugin support.

## 1. Setup

Add the mtpush-react-native package to your project.

```
npm install mtpush-react-native --save
```

Version 1.4.0 and later require React Native 0.76.0 or later. React Native autolinking links the native module
automatically.


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
        classpath 'com.android.tools.build:gradle:8.5.1'
        // google push need，and google push need AndroidX. If you do not need google channel，delete it.
        // Please add android.useAndroidX=true in gradle.properties
        classpath 'com.google.gms:google-services:4.3.15'
        // huawei push need，if you do not need huawei channel，delete it.
        classpath 'com.huawei.agconnect:agcp:1.9.1.301'
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

### 3.3 Swift Project

If your iOS project uses Swift code, please refer to the guide in [example/ios-swift/README.md](example/ios-swift/README.md) for configuration instructions.

## 4. Quote

### 4.1 Android

refer to：[MainApplication.kt](example/android/app/src/main/java/com/example/MainApplication.kt)
and [MainActivity.kt](example/android/app/src/main/java/com/example/MainActivity.kt)

### 4.2 iOS

refer to：[AppDelegate.swift](example/ios/example/AppDelegate.swift)
and [MTPushAppDelegateHelper.m](example/ios/example/MTPushAppDelegateHelper.m)

### 4.3 JS

refer to：[App.tsx](example/App.tsx)

## 5. API

refer to：[index.js](https://github.com/DevEngageLab/push-rectnative-plugin/blob/master/index.js)

## 6.  Other
* Be sure to run the example project before integration.
* If you have urgent needs, please go to [EngageLab Community](https://www.engagelab.com/)
* If you want to report a problem, please call `MTPush.setLoggerEnable(true}` first to get the debug log.

## 7. Expo Setup

`mtpush-react-native` contains native code, so it only works with Expo's **Bare workflow** (i.e. a project that
has run `expo prebuild`, or an EAS Build config that runs prebuild). It does **not** work in the Managed
workflow without prebuilding, since there is no native project directory to link into.

A config plugin is bundled with the package (`app.plugin.js`) and automates everything described in section 2
(Android) and section 3 (iOS) above, so you don't need to hand-edit `android/` or `ios/` after `expo prebuild`.

### 7.1 Add the plugin

In `app.json` (or `app.config.js`), add `mtpush-react-native` to the `plugins` array with its configuration
object:

```json
{
  "expo": {
    "plugins": [
      [
        "mtpush-react-native",
        {
          "appKey": "yourAppKey",
          "channel": "yourChannel",
          "process": ":remote",
          "iosPushEnvironment": "development",

          "xiaomiAppId": "MI-xxx",
          "xiaomiAppKey": "MI-xxx",

          "meizuAppId": "MZ-xxx",
          "meizuAppKey": "MZ-xxx",

          "oppoAppId": "OP-xxx",
          "oppoAppKey": "OP-xxx",
          "oppoAppSecret": "OP-xxx",

          "vivoAppId": "xxx",
          "vivoAppKey": "xxx",

          "honorAppId": "xxx",

          "googleServicesFile": "./google-services.json",
          "agconnectServicesFile": "./agconnect-services.json"
        }
      ]
    ]
  }
}
```

### 7.2 Field reference

| Field | Required | Notes |
| --- | --- | --- |
| `appKey` | Yes | `ENGAGELAB_PRIVATES_APPKEY` |
| `channel` | Yes | `ENGAGELAB_PRIVATES_CHANNEL` |
| `process` | Yes | `ENGAGELAB_PRIVATES_PROCESS`, e.g. `:remote` |
| `iosPushEnvironment` | No | iOS `aps-environment`: `development` (default) or `production`. Use the value matching the APNs environment of the provisioning profile |
| `xiaomiAppId` / `xiaomiAppKey` | No | Xiaomi channel manifest placeholders |
| `meizuAppId` / `meizuAppKey` | No | Meizu channel manifest placeholders |
| `oppoAppId` / `oppoAppKey` / `oppoAppSecret` | No | OPPO channel manifest placeholders |
| `vivoAppId` / `vivoAppKey` | No | vivo channel manifest placeholders |
| `honorAppId` | No | Honor channel manifest placeholder |
| `googleServicesFile` | No | Path (relative to the project root) to your `google-services.json`. Required only when using the Google channel |
| `agconnectServicesFile` | No | Path (relative to the project root) to your `agconnect-services.json`. Required only when using the Huawei channel |

Only `appKey`, `channel`, and `process` are required. Vendor channel fields and service files can be omitted or
set to an empty string when the corresponding channel is not used. The plugin throws during `expo prebuild` if
any required field is missing.

`appKey`/`channel` are only injected as native manifest placeholders on Android; on both platforms you still
call `MTPush.init({ appKey, channel, production })` from JS as shown in [App.tsx](example/App.tsx) — the plugin
does not replace that call.

On iOS, the plugin enables the Push Notification capability and sets its `aps-environment` entitlement from
`iosPushEnvironment` (`development` by default). Set it to `production` for App Store, Ad Hoc, or other
distribution profiles that use the production APNs environment. It also wires up
`AppDelegate.swift` for you — equivalent to the manual `AppDelegate.swift`/`MTPushAppDelegateHelper.h`/`.m` setup
described in section 4.2, but generated automatically on every `expo prebuild`. This includes:

- Registering for APNs on launch (`didFinishLaunchingWithOptions`)
- Uploading the APNs device token (`didRegisterForRemoteNotificationsWithDeviceToken`)
- Forwarding remote notification payloads (`didReceiveRemoteNotification`)
- Forwarding foreground/tap notification center events and custom message events

There is no option to opt out of any of this on iOS. The plugin supports Swift (`AppDelegate.swift`),
Objective-C (`AppDelegate.m`), and Objective-C++ (`AppDelegate.mm`) AppDelegate files.

### 7.3 Run prebuild

```
npx expo prebuild
```

This regenerates `android/` and `ios/` with the configuration above already applied.

 
