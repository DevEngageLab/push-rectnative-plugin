import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UserNotifications

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
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

    // MTPush: register APNS notification config during app launch.
    MTPushAppDelegateHelper.sharedInstance().application(
      application,
      didFinishLaunchingWithOptions: launchOptions
    )

    factory.startReactNative(
      withModuleName: "example",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

  func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    // MTPush: upload APNS device token to EngageLab.
    MTPushAppDelegateHelper.sharedInstance().application(
      application,
      didRegisterForRemoteNotificationsWithDeviceToken: deviceToken
    )
  }

  func application(
    _ application: UIApplication,
    didReceiveRemoteNotification userInfo: [AnyHashable: Any],
    fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void
  ) {
    // MTPush: handle iOS 7+ remote notification payloads.
    MTPushAppDelegateHelper.sharedInstance().application(
      application,
      didReceiveRemoteNotification: userInfo,
      fetchCompletionHandler: completionHandler
    )
  }

  @objc(mtpNotificationCenter:willPresentNotification:withCompletionHandler:)
  func mtpNotificationCenter(
    _ center: UNUserNotificationCenter,
    willPresent notification: UNNotification,
    withCompletionHandler completionHandler: @escaping (UInt) -> Void
  ) {
    // MTPush: forward foreground notification events to the RN plugin.
    MTPushAppDelegateHelper.sharedInstance().notificationCenter(
      center,
      willPresent: notification,
      withCompletionHandler: completionHandler
    )
  }

  @objc(mtpNotificationCenter:didReceiveNotificationResponse:withCompletionHandler:)
  func mtpNotificationCenter(
    _ center: UNUserNotificationCenter,
    didReceive response: UNNotificationResponse,
    withCompletionHandler completionHandler: @escaping () -> Void
  ) {
    // MTPush: forward notification tap/open events to the RN plugin.
    MTPushAppDelegateHelper.sharedInstance().notificationCenter(
      center,
      didReceive: response,
      withCompletionHandler: completionHandler
    )
  }

  @objc(networkDidReceiveMessage:)
  func networkDidReceiveMessage(_ notification: Notification) {
    // MTPush: forward custom message events to the RN plugin.
    MTPushAppDelegateHelper.sharedInstance().networkDidReceiveMessage(
      notification
    )
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
