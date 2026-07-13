#import "MTPushAppDelegateHelper.h"

#import <RCTMTPushModule.h>
#import <UserNotifications/UserNotifications.h>

@interface MTPushAppDelegateHelper ()

@end

@implementation MTPushAppDelegateHelper

+ (instancetype)sharedInstance
{
  static MTPushAppDelegateHelper *instance;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    instance = [MTPushAppDelegateHelper new];
  });
  return instance;
}

- (void)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  MTPushRegisterEntity *entity = [[MTPushRegisterEntity alloc] init];
  if (@available(iOS 12.0, *)) {
    entity.types = MTPushAuthorizationOptionAlert |
                   MTPushAuthorizationOptionBadge |
                   MTPushAuthorizationOptionSound |
                   MTPushAuthorizationOptionProvidesAppNotificationSettings;
  } else {
    entity.types = MTPushAuthorizationOptionAlert |
                   MTPushAuthorizationOptionBadge |
                   MTPushAuthorizationOptionSound;
  }

  [MTPushService registerForRemoteNotificationConfig:entity delegate:application.delegate];
}

- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [MTPushService registerDeviceToken:deviceToken];
}

- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [MTPushService handleRemoteNotification:userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:MT_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  completionHandler(UIBackgroundFetchResultNewData);
}

- (void)mtpNotificationCenter:(UNUserNotificationCenter *)center
      willPresentNotification:(UNNotification *)notification
        withCompletionHandler:(void (^)(NSInteger options))completionHandler
{
  NSDictionary *userInfo = notification.request.content.userInfo;
  if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [MTPushService handleRemoteNotification:userInfo];
    [[NSNotificationCenter defaultCenter] postNotificationName:MT_APNS_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  } else {
    [[NSNotificationCenter defaultCenter] postNotificationName:MT_LOCAL_NOTIFICATION_ARRIVED_EVENT object:userInfo];
  }
  completionHandler(UNNotificationPresentationOptionAlert);
}

- (void)mtpNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
        withCompletionHandler:(void (^)(void))completionHandler
{
  NSDictionary *userInfo = response.notification.request.content.userInfo;
  if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
    [MTPushService handleRemoteNotification:userInfo];
    [[RCTMTPushEventQueue sharedInstance]._notificationQueue insertObject:userInfo atIndex:0];
    [[NSNotificationCenter defaultCenter] postNotificationName:MT_APNS_NOTIFICATION_OPENED_EVENT object:userInfo];
  } else {
    [[RCTMTPushEventQueue sharedInstance]._localNotificationQueue insertObject:userInfo atIndex:0];
    [[NSNotificationCenter defaultCenter] postNotificationName:MT_LOCAL_NOTIFICATION_OPENED_EVENT object:userInfo];
  }
  completionHandler();
}

- (void)notificationCenter:(UNUserNotificationCenter *)center
   willPresentNotification:(UNNotification *)notification
     withCompletionHandler:(void (^)(NSUInteger options))completionHandler
{
  [self mtpNotificationCenter:center
      willPresentNotification:notification
        withCompletionHandler:^(NSInteger options) {
          completionHandler((NSUInteger)options);
        }];
}

- (void)notificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
     withCompletionHandler:(void (^)(void))completionHandler
{
  [self mtpNotificationCenter:center
didReceiveNotificationResponse:response
        withCompletionHandler:completionHandler];
}

- (void)networkDidReceiveMessage:(NSNotification *)notification
{
  NSDictionary *userInfo = [notification userInfo];
  [[NSNotificationCenter defaultCenter] postNotificationName:MT_CUSTOM_NOTIFICATION_EVENT object:userInfo];
}

@end
