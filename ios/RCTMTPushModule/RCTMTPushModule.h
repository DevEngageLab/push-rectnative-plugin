#import <Foundation/Foundation.h>

#if __has_include(<React/RCTBridge.h>)
#import <React/RCTEventEmitter.h>
#import <React/RCTRootView.h>
#import <React/RCTBridge.h>
#elif __has_include("RCTBridge.h")
#import "RCTEventEmitter.h"
#import "RCTRootView.h"
#import "RCTBridge.h"
#endif

#import "MTPUSHService.h"
#import "RCTMTPushEventQueue.h"

#define MT_APNS_NOTIFICATION_ARRIVED_EVENT  @"MT_APNS_NOTIFICATION_ARRIVED_EVENT"
#define MT_APNS_NOTIFICATION_OPENED_EVENT   @"MT_APNS_NOTIFICATION_OPENED_EVENT"
#define MT_LOCAL_NOTIFICATION_ARRIVED_EVENT @"MT_LOCAL_NOTIFICATION_ARRIVED_EVENT"
#define MT_LOCAL_NOTIFICATION_OPENED_EVENT  @"MT_LOCAL_NOTIFICATION_OPENED_EVENT"
#define MT_CUSTOM_NOTIFICATION_EVENT        @"MT_CUSTOM_NOTIFICATION_EVENT"

@interface RCTMTPushModule : RCTEventEmitter <RCTBridgeModule>

@end
