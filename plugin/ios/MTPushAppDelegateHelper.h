#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class UNNotification;
@class UNNotificationResponse;
@class UNUserNotificationCenter;

NS_ASSUME_NONNULL_BEGIN

@interface MTPushAppDelegateHelper : NSObject

+ (instancetype)sharedInstance;

- (void)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(nullable NSDictionary *)launchOptions;

- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken;

- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler;

- (void)notificationCenter:(UNUserNotificationCenter *)center
   willPresentNotification:(UNNotification *)notification
     withCompletionHandler:(void (^)(NSUInteger options))completionHandler;

- (void)notificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
     withCompletionHandler:(void (^)(void))completionHandler;

- (void)networkDidReceiveMessage:(NSNotification *)notification;

@end

NS_ASSUME_NONNULL_END
