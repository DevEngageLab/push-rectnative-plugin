#import "MTPushEventModule.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <MTPushEventSpec/MTPushEventSpec.h>

@interface MTPushEventModule : NativeMTPushEventModuleSpecBase <NativeMTPushEventModuleSpec>
@end

static __weak MTPushEventModule *sMTPushEventModule;

@implementation MTPushEventModule

RCT_EXPORT_MODULE(MTPushEventModule)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (instancetype)init
{
  self = [super init];
  if (self) {
    sMTPushEventModule = self;
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeMTPushEventModuleSpecJSI>(params);
}

@end

@implementation MTPushEventDispatcher

+ (void)performEmit:(void (^)(MTPushEventModule *module))emit
{
  dispatch_async(dispatch_get_main_queue(), ^{
    MTPushEventModule *module = sMTPushEventModule;
    if (module != nil) {
      emit(module);
    }
  });
}

+ (void)emitConnect:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnConnect:payload]; }]; }
+ (void)emitNotification:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnNotification:payload]; }]; }
+ (void)emitLocalNotification:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnLocalNotification:payload]; }]; }
+ (void)emitCustomMessage:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnCustomMessage:payload]; }]; }
+ (void)emitTagAlias:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnTagAlias:payload]; }]; }
+ (void)emitMobileNumber:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnMobileNumber:payload]; }]; }
+ (void)emitInappMessage:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnInappMessage:payload]; }]; }
+ (void)emitNotiInappMessage:(NSDictionary *)payload { [self performEmit:^(MTPushEventModule *m) { [m emitOnNotiInappMessage:payload]; }]; }

@end
#else
@implementation MTPushEventDispatcher
+ (void)emitConnect:(NSDictionary *)payload {}
+ (void)emitNotification:(NSDictionary *)payload {}
+ (void)emitLocalNotification:(NSDictionary *)payload {}
+ (void)emitCustomMessage:(NSDictionary *)payload {}
+ (void)emitTagAlias:(NSDictionary *)payload {}
+ (void)emitMobileNumber:(NSDictionary *)payload {}
+ (void)emitInappMessage:(NSDictionary *)payload {}
+ (void)emitNotiInappMessage:(NSDictionary *)payload {}
@end
#endif
