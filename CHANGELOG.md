# Changelog

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