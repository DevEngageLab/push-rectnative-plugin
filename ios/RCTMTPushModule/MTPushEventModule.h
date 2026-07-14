#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface MTPushEventDispatcher : NSObject

+ (void)emitConnect:(NSDictionary *)payload;
+ (void)emitNotification:(NSDictionary *)payload;
+ (void)emitLocalNotification:(NSDictionary *)payload;
+ (void)emitCustomMessage:(NSDictionary *)payload;
+ (void)emitTagAlias:(NSDictionary *)payload;
+ (void)emitMobileNumber:(NSDictionary *)payload;
+ (void)emitInappMessage:(NSDictionary *)payload;
+ (void)emitNotiInappMessage:(NSDictionary *)payload;

@end

NS_ASSUME_NONNULL_END
