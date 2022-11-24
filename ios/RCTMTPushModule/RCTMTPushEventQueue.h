//
//  RCTMTPushEventQueue.h
//  DoubleConversion
//
//  Created by wicked on 2019/9/26.
//

#import <Foundation/Foundation.h>


@interface RCTMTPushEventQueue : NSObject

+ (nonnull instancetype) sharedInstance;

@property NSMutableArray<NSDictionary *> * _Nullable _notificationQueue;
@property NSMutableArray<NSDictionary *> * _Nullable _localNotificationQueue;

@end

