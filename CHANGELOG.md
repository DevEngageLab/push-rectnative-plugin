# Changelog

## [1.3.0] - 2026-05-26

### Changed
- 更新 Android SDK 到 5.4.0，iOS SDK 到 5.4.0
- Android 5.4.0：AndroidId 默认不再采集，`setCollectControl` 中 `aid` 参数已废弃
- Android 5.4.0：小米厂商 SDK 从 6.0.1 升级至 7.9.2，请参考最新集成文档更新小米通道配置

## [1.2.9] - 2026-04-27

### Added
- **Android**：通知相关事件回调（如 `addNotificationListener`）的 payload 中增加 `notificationId`（整型），对应系统通知 ID，便于与 `removeLocalNotification` 等能力配合使用。

### Changed
- 更新 `index.d.ts`：通知事件回调参数类型补充可选字段 `notificationId`（Android）。
- 补充 `removeLocalNotification` 等注释说明（与通知 ID 相关表述）。

### Migration Guide
从 1.2.8 升级到 1.2.9 时：
1. 业务代码可选：在 Android 上若需区分或移除指定通知，可在通知回调中读取 `notificationId`。
2. 重新构建应用以生效原生侧改动。

## [1.2.8] - 2025-01-27

### Added
- 更新iOS MTPush SDK到5.3.0版本
- 更新Android MTPush SDK到5.3.0版本
- 新增`setCollectControl`方法（Android），用于控制是否采集AndroidId（GAID和AID）

### New Features

#### setCollectControl (Android)
设置数据采集控制，用于控制是否采集AndroidId（GAID和AID）。默认情况下 gaid 和 aid 均为 true（默认采集），通过此接口可以关闭部分或全部采集。

**使用示例：**
```javascript
// 关闭GAID和AID的采集
MTPush.setCollectControl({
    gaid: false,
    aid: false
});

// 仅关闭GAID采集，保留AID采集（AID默认为true，继续采集）
MTPush.setCollectControl({
    gaid: false
});
```

**注意事项：**
- 仅Android平台支持
- 该接口需在init接口之前调用，否则无效
- gaid参数控制是否采集Google Advertising ID，默认为true（采集）
- aid参数控制是否采集AndroidId，默认为true（采集）
- 只有显式设置为false时才会关闭对应数据采集

### Migration Guide
从1.2.7升级到1.2.8版本时，需要：
1. 如果需要控制AndroidId数据采集，可在初始化前调用`setCollectControl`方法
2. 重新构建项目以应用新的依赖版本

## [1.2.7] - 2025-01-27

### Added
- 更新iOS MTPush SDK到5.2.0版本
- 更新Android MTPush SDK到5.2.0版本
- 新增`setBadgeWithCallback`方法，用于设置Badge并获取操作结果

### Changed
- 插件版本从1.2.6升级到1.2.7
- 优化Android依赖管理

### New Features

#### setBadgeWithCallback 
设置Badge并获取操作结果。相比原有的setBadge方法，此方法提供操作成功或失败的回调。

**使用示例：**
```javascript
// 设置Badge并处理结果
MTPush.setBadgeWithCallback({badge: 5}, (result) => {
    if (result.code != 0) {
        console.log("设置Badge失败:", result.message);
    } else {
        console.log("设置Badge成功");
    }
});
```

**注意事项：**
- 仅iOS平台支持
- Android平台会调用普通setBadge方法并返回成功
- 回调参数：成功时返回null，失败时返回错误对象{code, message}

### Migration Guide
从1.2.6升级到1.2.7版本时，需要：
1. 如果需要获取Badge设置结果，可使用新的`setBadgeWithCallback`方法
2. 重新构建项目以应用新的依赖版本


## [1.2.6] - 2025-07-30

### Added
- 更新iOS MTPush SDK到5.1.0版本
- 更新Android MTPush SDK到5.1.0版本
- 新增`setEnableResetOnDeviceChange`方法，用于设置设备更换时是否重置RegistrationID

### Changed
- 插件版本从1.2.5升级到1.2.6

### New Features

#### setEnableResetOnDeviceChange
开启或者关闭设备更换时重置RegistrationID的功能。若开启时，当检测到设备发生变化时（只有当设备型号发生变化时），会自动清除注册信息，重新注册。

**使用示例：**
```javascript
// 启用设备更换时重置RegistrationID功能
MTPush.setEnableResetOnDeviceChange(true);

// 禁用设备更换时重置RegistrationID功能（默认状态）
MTPush.setEnableResetOnDeviceChange(false);
```

**注意事项：**
- 请在初始化接口前调用
- 默认为关闭状态



### Migration Guide
从1.2.5升级到1.2.6版本时，需要：
1. 如果需要使用设备迁移功能，请在初始化前调用`setEnableResetOnDeviceChange(true)` 