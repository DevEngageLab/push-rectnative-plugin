# example-expo

这是 `mtpush-react-native` 适配 Expo 架构的功能 Demo，用于验证 Expo config plugin 能正确生成原生配置，并在 Android、iOS 真机上运行插件功能。

## 环境准备

进入 Demo 目录并安装依赖：

```bash
cd example-expo
npm install
```

运行前需要确认：

- Android 已连接真机或启动模拟器，并可通过 `adb devices` 识别。
- iOS 已连接并信任真机，Xcode 能识别该设备。
- `app.json` 中的 AppKey、包名和 Bundle Identifier 与对应平台配置一致。
- 厂商参数均为可选项；需要验证对应厂商通道时，再填写正确的厂商参数。
- 仅在验证 Google 或 Huawei 厂商通道时，才需要配置对应应用的 `google-services.json` 或 `agconnect-services.json`。

## 生成原生工程

首次运行，或者修改了 `app.json`、config plugin、原生依赖后，重新生成原生工程：

```bash
npx expo prebuild --clean
```

如果依赖已经安装，只生成原生工程、不自动执行 CocoaPods 安装：

```bash
npx expo prebuild --clean --no-install
```

> `--clean` 会删除并重新生成 `android/` 和 `ios/`。日常只修改 JS 代码时不需要重复执行。

## 运行 Android

```bash
npx expo run:android
```

## 运行 iOS 真机

当前 Demo 通过 `react-native-expo-signed` 在 prebuild 阶段写入手动签名配置，签名参数位于 `app.json`，不属于 `mtpush-react-native` 插件配置。

连接 iPhone 后运行：

```bash
npx expo run:ios --device
```

如果需要把 Metro 和原生构建日志分开查看，可以使用两个终端：

终端 1：

```bash
npx expo start --dev-client
```

终端 2：

```bash
npx expo run:ios --device --no-bundler
```

## 推荐执行顺序

首次运行或原生配置发生变化时：

```bash
cd example-expo
npm install
npx expo prebuild --clean
npx expo run:android
npx expo run:ios --device
```

日常修改 JS 代码后，直接启动已有原生工程即可：

```bash
npx expo run:android
npx expo run:ios --device
```
