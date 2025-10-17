
使用方法：修改需求里的内容，将需求和步骤内容作为指令让cursor进行执行。


需求：
1. 更新iOS MTPush SDK 到 5.2.0 版本。
2. 更新Android MTPush SDK 到 5.2.0 版本。
3. 将原生iOS、Android SDK 新增的方法，封装在插件中。
   原生SDK新增方法一：
   iOS ：
   
   ```

   ```
   
   Android:
   
   ```
   
   ```
   
    统一封装为 方法名为 "" 的对外方法。
    

请按照以下步骤完成：

1. 找到MTPushRN.podspec文件，修改MTPush的依赖版本为需要更新的版本。
2. 找到android/build.gradle文件，将com.engagelab开头的三方SDK，的依赖版本修改为需要更新的版本。
3. 在插件中封装需求中需要封装的SDK方法，并在插件示例demo中提供示例调用代码，注意rn插件新增方法还需要再index.js和index.d.ts文件中声明哦。（如果没有需求中没有需要新增的方法，则跳过该步骤）
4. 在package.json中更新插件版本号，在现有版本号上 + 0.0.1
5. 在example/package.json 中 修改示例 插件的集成版本号。 改为最新的插件版本号。涉及到更改的代码

    ```
       "dependencies": {
            ...
            "mtpush-react-native": "^x.x.x",
            ...

    ```
6. 在CHANGELOG.md中添加本次更新的内容



