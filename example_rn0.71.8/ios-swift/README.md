If your iOS project uses Swift code.

You can complete the configuration in the AppDelegate.swift file according to the following steps.

1. Create a bridging header file for Swift to call Objective-C code.

  In Xcode: File -> New -> File -> Header File, enter the bridging header file name, usually `YourProjectName-Bridging-Header.h`, to create the bridging file. Then in Xcode's Build Settings, find Swift Compiler - General -> Objective-C Bridging Header option, and fill in the path of the newly created bridging header file. Import "MTPushService.h" and "RCTMTPushModule.h" files using #import.
  
  Code example for the bridging file: You can also refer to the ios-swift/HelloWord-Bridging-Header.h file.
  
```
#ifndef HelloWord_Bridging_Header_h
#define HelloWord_Bridging_Header_h

//MTPush Need
#import "MTPushService.h"
#import "RCTMTPushModule.h"

#endif /* HelloWord_Bridging_Header_h */
```


2. For AppDelegate.h file configuration, you can refer to the configuration in ios-swift/AppDelegate.swift, please pay attention to the code marked with MTPush Need.

