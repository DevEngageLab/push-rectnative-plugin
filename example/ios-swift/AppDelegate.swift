import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider

@main
class AppDelegate: UIResponder, UIApplicationDelegate, MTPushRegisterDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "HelloWord",
      in: window,
      launchOptions: launchOptions
    )
    
    //************************************************ MTPush Need************************************************
    let entity = MTPushRegisterEntity()
    entity.types = 0
      MTPushService.register(forRemoteNotificationConfig: entity, delegate: self)

    return true
  }
  
  //************************************************ MTPush Need************************************************
  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    // JPush 注册devicetoken
      MTPushService.registerDeviceToken(deviceToken)
  }
  
  func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable : Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
      // 注意调用
      MTPushService.handleRemoteNotification(userInfo)
      NotificationCenter.default.post(name: NSNotification.Name(MT_APNS_NOTIFICATION_ARRIVED_EVENT), object: userInfo)
      completionHandler(.newData)
  }
  
  //MARK - MTPUSHRegisterDelegate
  
  func mtpNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping @Sendable (Int) -> Void) {
    let userInfo = notification.request.content.userInfo
    
    if (notification.request.trigger?.isKind(of: UNPushNotificationTrigger.self) == true) {
      // 注意调用
      MTPushService.handleRemoteNotification(userInfo)
      NotificationCenter.default.post(name: NSNotification.Name(MT_APNS_NOTIFICATION_ARRIVED_EVENT), object: userInfo)
      print("收到远程通知:\(userInfo)")
    } else {
      NotificationCenter.default.post(name: NSNotification.Name(MT_LOCAL_NOTIFICATION_ARRIVED_EVENT), object: userInfo)
      print("收到本地通知:\(userInfo)")
    }
    
    completionHandler(Int(UNNotificationPresentationOptions.badge.rawValue | UNNotificationPresentationOptions.sound.rawValue | UNNotificationPresentationOptions.alert.rawValue))
  }
  
  func mtpNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping @Sendable () -> Void) {
    let userInfo = response.notification.request.content.userInfo
    if (response.notification.request.trigger?.isKind(of: UNPushNotificationTrigger.self) == true) {
      // 注意调用
      MTPushService.handleRemoteNotification(userInfo)
      NotificationCenter.default.post(name: NSNotification.Name(MT_APNS_NOTIFICATION_OPENED_EVENT), object: userInfo)
      print("点击远程通知:\(userInfo)")
      
    } else {
      print("点击本地通知:\(userInfo)")
      NotificationCenter.default.post(name: NSNotification.Name(MT_LOCAL_NOTIFICATION_OPENED_EVENT), object: userInfo)
    }
    
    completionHandler()
  }
  
  func mtpNotificationCenter(_ center: UNUserNotificationCenter, openSettingsFor notification: UNNotification?) {
    
  }
  
  func mtpNotificationAuthorization(_ status: MTPushAuthorizationStatus, withInfo info: [AnyHashable : Any]?) {
    print("receive notification authorization status:\(status), info:\(String(describing: info))")
  }
  
  
  // //MARK - 自定义消息
  func networkDidReceiveMessage(_ notification: NSNotification) {
    let userInfo = notification.userInfo!
    NotificationCenter.default.post(name: NSNotification.Name(MT_CUSTOM_NOTIFICATION_EVENT), object: userInfo)
  }
  
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
