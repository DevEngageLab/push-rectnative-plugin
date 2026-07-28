const {
  withEntitlementsPlist,
  withDangerousMod,
  withXcodeProject,
  withAppDelegate,
  IOSConfig,
} = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const HELPER_FILES = ['MTPushAppDelegateHelper.h', 'MTPushAppDelegateHelper.m'];
const HELPER_IMPORT = '#import "MTPushAppDelegateHelper.h"';
const USER_NOTIFICATIONS_IMPORT = '#import <UserNotifications/UserNotifications.h>';
const IOS_PUSH_ENVIRONMENTS = new Set(['development', 'production']);

function resolveIOSPushEnvironment(props = {}) {
  const environment = props.iosPushEnvironment ?? 'development';
  if (!IOS_PUSH_ENVIRONMENTS.has(environment)) {
    throw new Error(
      '[mtpush-react-native] Invalid iosPushEnvironment. Expected "development" or "production".'
    );
  }
  return environment;
}

function withMtpushPushCapability(config, props) {
  const environment = resolveIOSPushEnvironment(props);
  return withEntitlementsPlist(config, (config) => {
    config.modResults['aps-environment'] = environment;
    return config;
  });
}

function withMtpushAppDelegateHelperFiles(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const appDelegatePath = IOSConfig.Paths.getAppDelegateFilePath(config.modRequest.projectRoot);
      const targetDir = path.dirname(appDelegatePath);
      const sourceDir = path.join(__dirname, 'ios');

      for (const fileName of HELPER_FILES) {
        fs.copyFileSync(path.join(sourceDir, fileName), path.join(targetDir, fileName));
      }

      const bridgingHeaderMatch = fs
        .readdirSync(targetDir)
        .find((name) => name.endsWith('-Bridging-Header.h'));
      if (bridgingHeaderMatch) {
        const bridgingHeaderPath = path.join(targetDir, bridgingHeaderMatch);
        const contents = fs.readFileSync(bridgingHeaderPath, 'utf8');
        if (!contents.includes(HELPER_IMPORT)) {
          fs.writeFileSync(bridgingHeaderPath, `${contents}\n${HELPER_IMPORT}\n`);
        }
      }

      return config;
    },
  ]);
}

function withMtpushAppDelegateHelperXcodeRefs(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;
    const appDelegatePath = IOSConfig.Paths.getAppDelegateFilePath(config.modRequest.projectRoot);
    const groupName = path.basename(path.dirname(appDelegatePath));

    IOSConfig.XcodeUtils.addBuildSourceFileToGroup({
      filepath: `${groupName}/MTPushAppDelegateHelper.m`,
      groupName,
      project,
    });

    return config;
  });
}

function findMatchingBraceIndex(contents, openBraceIndex) {
  let depth = 0;
  for (let i = openBraceIndex; i < contents.length; i++) {
    if (contents[i] === '{') {
      depth++;
    } else if (contents[i] === '}') {
      depth--;
      if (depth === 0) {
        return i;
      }
    }
  }
  throw new Error('[mtpush-react-native] Could not find matching brace in AppDelegate.');
}

function addObjcImport(contents, importStatement) {
  if (contents.includes(importStatement)) {
    return contents;
  }

  const importMatch = contents.match(/^#import .*$/m);
  if (!importMatch) {
    throw new Error('[mtpush-react-native] Could not find an import in the Objective-C AppDelegate.');
  }
  const insertIndex = importMatch.index + importMatch[0].length;
  return `${contents.slice(0, insertIndex)}\n${importStatement}${contents.slice(insertIndex)}`;
}

function findObjcMethodBlock(contents, selectorParts) {
  const methodPattern = /^\s*[-+]\s*\([^)]*\)[\s\S]*?\{/gm;
  for (const match of contents.matchAll(methodPattern)) {
    const normalizedHeader = match[0].replace(/\s+/g, '');
    let searchIndex = 0;
    let matchesSelector = true;
    for (const selectorPart of selectorParts) {
      const partIndex = normalizedHeader.indexOf(selectorPart, searchIndex);
      if (partIndex < 0) {
        matchesSelector = false;
        break;
      }
      searchIndex = partIndex + selectorPart.length;
    }
    if (!matchesSelector) {
      continue;
    }

    const openBraceIndex = match.index + match[0].lastIndexOf('{');
    return {
      openBraceIndex,
      closeBraceIndex: findMatchingBraceIndex(contents, openBraceIndex),
    };
  }
  return null;
}

function injectIntoObjcMethod(contents, selectorParts, marker, statement) {
  if (contents.includes(marker)) {
    return contents;
  }
  const methodBlock = findObjcMethodBlock(contents, selectorParts);
  if (!methodBlock) {
    return null;
  }
  const insertIndex = methodBlock.openBraceIndex + 1;
  return `${contents.slice(0, insertIndex)}\n  ${statement}${contents.slice(insertIndex)}`;
}

function appendObjcMethods(contents, methods) {
  if (!methods.length) {
    return contents;
  }
  const implementationIndex = contents.search(/@implementation\s+AppDelegate\b/);
  const endIndex = contents.indexOf('\n@end', implementationIndex);
  if (implementationIndex < 0 || endIndex < 0) {
    throw new Error(
      '[mtpush-react-native] Could not find "@implementation AppDelegate" in the Objective-C AppDelegate.'
    );
  }
  return `${contents.slice(0, endIndex)}\n\n${methods.join('\n\n')}\n${contents.slice(endIndex)}`;
}

function injectObjcAppDelegateCode(contents) {
  contents = addObjcImport(contents, HELPER_IMPORT);
  contents = addObjcImport(contents, USER_NOTIFICATIONS_IMPORT);

  const launchMarker = 'MTPush: register APNS notification config during app launch.';
  const launchResult = injectIntoObjcMethod(
    contents,
    ['application:', 'didFinishLaunchingWithOptions:'],
    launchMarker,
    `// ${launchMarker}\n  [[MTPushAppDelegateHelper sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];`
  );
  if (launchResult === null) {
    throw new Error(
      '[mtpush-react-native] Could not find application:didFinishLaunchingWithOptions: in the Objective-C AppDelegate.'
    );
  }
  contents = launchResult;

  const methodsToAppend = [];
  const tokenMarker = 'MTPush: upload APNS device token to EngageLab.';
  const tokenResult = injectIntoObjcMethod(
    contents,
    ['application:', 'didRegisterForRemoteNotificationsWithDeviceToken:'],
    tokenMarker,
    `// ${tokenMarker}\n  [[MTPushAppDelegateHelper sharedInstance] application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];`
  );
  if (tokenResult === null) {
    methodsToAppend.push(`- (void)application:(UIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [super application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
  // ${tokenMarker}
  [[MTPushAppDelegateHelper sharedInstance] application:application didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}`);
  } else {
    contents = tokenResult;
  }

  const remoteMarker = 'MTPush: handle iOS 7+ remote notification payloads.';
  const remoteResult = injectIntoObjcMethod(
    contents,
    ['application:', 'didReceiveRemoteNotification:', 'fetchCompletionHandler:'],
    remoteMarker,
    `// ${remoteMarker}\n  [[MTPushAppDelegateHelper sharedInstance] application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:^(__unused UIBackgroundFetchResult result) {}];`
  );
  if (remoteResult === null) {
    methodsToAppend.push(`- (void)application:(UIApplication *)application
    didReceiveRemoteNotification:(NSDictionary *)userInfo
          fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  // ${remoteMarker}
  [[MTPushAppDelegateHelper sharedInstance] application:application didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}`);
  } else {
    contents = remoteResult;
  }

  if (!findObjcMethodBlock(contents, ['mtpNotificationCenter:', 'willPresentNotification:', 'withCompletionHandler:'])) {
    methodsToAppend.push(`- (void)mtpNotificationCenter:(UNUserNotificationCenter *)center
      willPresentNotification:(UNNotification *)notification
        withCompletionHandler:(void (^)(NSInteger options))completionHandler
{
  [[MTPushAppDelegateHelper sharedInstance] notificationCenter:center willPresentNotification:notification withCompletionHandler:^(NSUInteger options) {
    completionHandler((NSInteger)options);
  }];
}`);
  }

  if (!findObjcMethodBlock(contents, ['mtpNotificationCenter:', 'didReceiveNotificationResponse:', 'withCompletionHandler:'])) {
    methodsToAppend.push(`- (void)mtpNotificationCenter:(UNUserNotificationCenter *)center
      didReceiveNotificationResponse:(UNNotificationResponse *)response
        withCompletionHandler:(void (^)(void))completionHandler
{
  [[MTPushAppDelegateHelper sharedInstance] notificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}`);
  }

  const customMessageMarker = 'MTPush: forward custom message events to the RN plugin.';
  const customMessageResult = injectIntoObjcMethod(
    contents,
    ['networkDidReceiveMessage:'],
    customMessageMarker,
    `// ${customMessageMarker}\n  [[MTPushAppDelegateHelper sharedInstance] networkDidReceiveMessage:notification];`
  );
  if (customMessageResult === null) {
    methodsToAppend.push(`- (void)networkDidReceiveMessage:(NSNotification *)notification
{
  // ${customMessageMarker}
  [[MTPushAppDelegateHelper sharedInstance] networkDidReceiveMessage:notification];
}`);
  } else {
    contents = customMessageResult;
  }

  return appendObjcMethods(contents, methodsToAppend);
}

function injectSwiftAppDelegateCode(contents) {
  if (!contents.includes('import UserNotifications')) {
    const importMatches = [...contents.matchAll(/^import\s+\S+.*$/gm)];
    if (!importMatches.length) {
      throw new Error(
        '[mtpush-react-native] Could not find an import in AppDelegate.swift. The Expo iOS template may be unsupported.'
      );
    }
    const lastImport = importMatches[importMatches.length - 1];
    const insertIndex = lastImport.index + lastImport[0].length;
    contents = `${contents.slice(0, insertIndex)}\nimport UserNotifications${contents.slice(insertIndex)}`;
  }

  const launchMarker = 'MTPush: register APNS notification config during app launch.';
  if (!contents.includes(launchMarker)) {
    const launchAnchor = /(reactNativeFactory = factory\n)/;
    if (!launchAnchor.test(contents)) {
      throw new Error(
        '[mtpush-react-native] Could not find the React Native factory initialization in AppDelegate.swift. The Expo iOS template may be unsupported.'
      );
    }
    contents = contents.replace(
      launchAnchor,
      `$1\n    // ${launchMarker}\n    MTPushAppDelegateHelper.sharedInstance().application(\n      application,\n      didFinishLaunchingWithOptions: launchOptions\n    )\n`
    );
  }

  if (!contents.includes('mtpNotificationCenter(')) {
    const classDeclMatch = contents.match(/class AppDelegate\s*:[^{]*\{/);
    if (!classDeclMatch) {
      throw new Error('[mtpush-react-native] Could not find "class AppDelegate" declaration in AppDelegate.swift');
    }
    const openBraceIndex = classDeclMatch.index + classDeclMatch[0].length - 1;
    const closeBraceIndex = findMatchingBraceIndex(contents, openBraceIndex);

    const injectedMethods = `
  public override func application(
    _ application: UIApplication,
    didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data
  ) {
    super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
    // MTPush: upload APNS device token to EngageLab.
    MTPushAppDelegateHelper.sharedInstance().application(
      application,
      didRegisterForRemoteNotificationsWithDeviceToken: deviceToken
    )
  }

  public override func application(
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
    MTPushAppDelegateHelper.sharedInstance().networkDidReceiveMessage(notification)
  }
`;

    contents = contents.slice(0, closeBraceIndex) + injectedMethods + contents.slice(closeBraceIndex);
  }

  const requiredMarkers = [
    'import UserNotifications',
    launchMarker,
    'mtpNotificationCenter(',
    'networkDidReceiveMessage(_ notification:',
  ];
  const missingMarkers = requiredMarkers.filter((marker) => !contents.includes(marker));
  if (missingMarkers.length) {
    throw new Error(
      `[mtpush-react-native] Failed to inject AppDelegate.swift code: ${missingMarkers.join(', ')}`
    );
  }

  return contents;
}

function withMtpushAppDelegateCode(config) {
  return withAppDelegate(config, (config) => {
    const { language } = config.modResults;
    let contents = config.modResults.contents;
    if (language === 'swift') {
      contents = injectSwiftAppDelegateCode(contents);
    } else if (language === 'objc' || language === 'objcpp') {
      contents = injectObjcAppDelegateCode(contents);
    } else {
      throw new Error(
        `[mtpush-react-native] Unsupported AppDelegate language: ${language}`
      );
    }
    config.modResults.contents = contents;
    return config;
  });
}

function withMtpushIOS(config, props) {
  config = withMtpushPushCapability(config, props);
  config = withMtpushAppDelegateHelperFiles(config);
  config = withMtpushAppDelegateHelperXcodeRefs(config);
  config = withMtpushAppDelegateCode(config);
  return config;
}

module.exports = withMtpushIOS;
