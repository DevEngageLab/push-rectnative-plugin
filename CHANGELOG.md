# Changelog

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
1. 更新iOS和Android的MTPush SDK到5.2.0版本
2. 如果需要获取Badge设置结果，可使用新的`setBadgeWithCallback`方法
3. 重新构建项目以应用新的依赖版本


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
1. 更新iOS和Android的MTPush SDK到5.1.0版本
2. 如果需要使用设备迁移功能，请在初始化前调用`setEnableResetOnDeviceChange(true)` 