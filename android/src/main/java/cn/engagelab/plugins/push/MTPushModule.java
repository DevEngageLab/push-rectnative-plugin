
package cn.engagelab.plugins.push;

import android.app.Activity;
import android.app.Application;
import android.app.Notification;
import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;

import com.engagelab.privates.push.api.NotificationMessage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONObject;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Set;

import cn.engagelab.plugins.push.common.MTConstants;
import cn.engagelab.plugins.push.common.MTLogger;
import cn.engagelab.plugins.push.helper.MTPushHelper;
//import cn.engagelab.plugins.push.receiver.MTPushBroadcastReceiver;

import com.engagelab.privates.core.api.MTCorePrivatesApi;
import com.engagelab.privates.push.api.MTPushPrivatesApi;


public class MTPushModule extends ReactContextBaseJavaModule {

    public static ReactApplicationContext reactContext;

    public static boolean isAppForeground = false;

    public MTPushModule(ReactApplicationContext reactApplicationContext) {
        super(reactContext);
        reactContext = reactApplicationContext;
    }

    @Override
    public String getName() {
        return "MTPushModule";
    }

    @ReactMethod
    public void setDebugMode(boolean enable) {
        MTCorePrivatesApi.configDebugMode(reactContext,enable);
        MTLogger.setLoggerEnable(enable);
    }

    @ReactMethod
    public void init() {
        MTPushPrivatesApi.init(reactContext);
//        if (MTPushBroadcastReceiver.NOTIFICATION_BUNDLE != null) {
//            WritableMap writableMap = MTPushHelper.convertNotificationBundleToMap(MTConstants.NOTIFICATION_OPENED, MTPushBroadcastReceiver.NOTIFICATION_BUNDLE);
//            MTPushHelper.sendEvent(MTConstants.NOTIFICATION_EVENT, writableMap);
//            MTPushBroadcastReceiver.NOTIFICATION_BUNDLE = null;
//        }

    }

    @ReactMethod
    public void stopPush() {
        MTPushPrivatesApi.turnOffPush(reactContext);
    }

    @ReactMethod
    public void resumePush() {
        MTPushPrivatesApi.turnOnPush(reactContext);
    }

    @ReactMethod
    public void setChannel(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        String channel = readableMap.getString(MTConstants.CHANNEL);
        if (TextUtils.isEmpty(channel)) {
            MTLogger.w(MTConstants.PARAMS_ILLEGAL);
        } else {
            MTCorePrivatesApi.configAppChannel(reactContext, channel);
        }
    }
    @ReactMethod
    public void setBadgeNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(MTConstants.BADGE_NUMBER)) {
            int number = readableMap.getInt(MTConstants.BADGE_NUMBER);
            MTPushPrivatesApi.setNotificationBadge(reactContext,number);
        } else {
            MTLogger.w("there are no " + MTConstants.BADGE_NUMBER);
        }
    }
    @ReactMethod
    public void setPushTime(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        ReadableArray readableArray = readableMap.getArray(MTConstants.PUSH_TIME_DAYS);
        int startHour = readableMap.getInt(MTConstants.PUSH_TIME_START_HOUR);
        int endHour = readableMap.getInt(MTConstants.PUSH_TIME_END_HOUR);
        if (readableArray == null || startHour == 0 || endHour == 0) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        Set<Integer> days = new HashSet<Integer>();
        for (int i = 0; i < readableArray.size(); i++) {
            int day = readableArray.getInt(i);
            if (day > 6 || day < 0) {
                MTLogger.w(MTConstants.PARAMS_NULL);
                return;
            }
            days.add(day);
        }
        Context var10000 = reactContext;
        int context1;
        int[] var4 = new int[context1 = days.size()];
        Integer[] var10001 = new Integer[days.size()];
        days.toArray(var10001);
        System.arraycopy(var10001, 0, var4, 0, context1);
        MTPushPrivatesApi.setNotificationShowTime(var10000.getApplicationContext(), startHour, endHour, var4);
    }

    @ReactMethod
    public void setSilenceTime(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        int startHour = readableMap.getInt(MTConstants.SILENCE_TIME_START_HOUR);
        int startMinute = readableMap.getInt(MTConstants.SILENCE_TIME_START_MINUTE);
        int endHour = readableMap.getInt(MTConstants.SILENCE_TIME_END_HOUR);
        int endMinute = readableMap.getInt(MTConstants.SILENCE_TIME_END_MINUTE);
        if (startHour == 0 || startMinute == 0 || endHour == 0 || endMinute == 0) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        MTPushPrivatesApi.setNotificationSilenceTime(reactContext, startHour, startMinute, endHour, endMinute);
    }

    @ReactMethod
    public void getRegistrationID(Callback callback) {
        if (callback == null) {
            MTLogger.w(MTConstants.CALLBACK_NULL);
            return;
        }
        String registrationID = MTCorePrivatesApi.getRegistrationId(reactContext);
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MTConstants.REGISTRATION_ID, registrationID);
        callback.invoke(writableMap);
    }

    @ReactMethod
    public void setLatestNotificationNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(MTConstants.NOTIFICATION_MAX_NUMBER)) {
            int maxNumber = readableMap.getInt(MTConstants.NOTIFICATION_MAX_NUMBER);
            MTPushPrivatesApi.setNotificationCount(reactContext, maxNumber);
        } else {
            MTLogger.w("there are no " + MTConstants.NOTIFICATION_MAX_NUMBER);
        }
    }

//    @ReactMethod
//    public void setDefaultPushNotificationBuilder(ReadableMap readableMap) {
//        if (readableMap == null) {
//            MTLogger.w(MTConstants.PARAMS_NULL);
//            return;
//        }
//        BasicPushNotificationBuilder builder = new BasicPushNotificationBuilder(reactContext);
//        JPushInterface.setDefaultPushNotificationBuilder(builder);
//    }


    @ReactMethod
    public void setMobileNumber(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        int sequence = readableMap.getInt(MTConstants.SEQUENCE);
        String mobileNumber = readableMap.getString(MTConstants.MOBILE_NUMBER);
        MTPushPrivatesApi.uploadMobileNumber(reactContext, sequence, mobileNumber);
    }


    @ReactMethod
    public void addLocalNotification(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        if (!readableMap.hasKey(MTConstants.MESSAGE_ID)) {
            MTLogger.w(MTConstants.PARAMS_ILLEGAL);
            return;
        }
        String notificationID = readableMap.getString(MTConstants.MESSAGE_ID);
        if(notificationID==null || TextUtils.isEmpty(notificationID)){
            MTLogger.w(MTConstants.PARAMS_ILLEGAL);
            return;
        }
        int id = Integer.valueOf(notificationID);
        String notificationTitle = readableMap.hasKey(MTConstants.TITLE) ? readableMap.getString(MTConstants.TITLE) : reactContext.getPackageName();
        String notificationContent = readableMap.hasKey(MTConstants.CONTENT) ? readableMap.getString(MTConstants.CONTENT) : reactContext.getPackageName();
        NotificationMessage notification = new NotificationMessage();
        notification.setNotificationId(id);
//        notification.setMessageId(String.valueOf(id));
        notification.setTitle(notificationTitle);
        notification.setContent(notificationContent);
        if (readableMap.hasKey(MTConstants.EXTRAS)) {
            ReadableMap notificationExtra = readableMap.getMap(MTConstants.EXTRAS);
            JSONObject notificationExtraJson = new JSONObject(notificationExtra.toHashMap());
//            notification.setExtras(notificationExtraJson.toString());
            Bundle bundle = new Bundle();
            bundle.putString("extras",notificationExtraJson.toString());
            notification.setExtras(bundle);
            notification.setDefaults(Notification.DEFAULT_SOUND | Notification.DEFAULT_VIBRATE);
            notification.setPriority(Notification.PRIORITY_DEFAULT);
        }
        MTPushPrivatesApi.showNotification(reactContext, notification);
    }

    @ReactMethod
    public void removeLocalNotification(ReadableMap readableMap) {
        if (readableMap == null) {
            MTLogger.w(MTConstants.PARAMS_NULL);
            return;
        }
        if (readableMap.hasKey(MTConstants.MESSAGE_ID)) {
            String notificationID = readableMap.getString(MTConstants.MESSAGE_ID);
            if(notificationID==null || TextUtils.isEmpty(notificationID)){
                MTLogger.w(MTConstants.PARAMS_ILLEGAL);
                return;
            }
            int id = Integer.valueOf(notificationID);
            MTPushPrivatesApi.clearNotification(reactContext, id);
        } else {
            MTLogger.w("there are no " + MTConstants.MESSAGE_ID);
        }
    }

    @ReactMethod
    public void clearLocalNotifications() {
        MTPushPrivatesApi.clearNotification(reactContext);
    }



//    @ReactMethod
//    public void isNotificationEnabled(Callback callback){
//        Integer isEnabled = MTPushPrivatesApi.isNotificationEnabled(reactContext);
//        if (callback == null){
//            MTLogger.w(MTConstants.CALLBACK_NULL);
//            return;
//        }
//        callback.invoke(isEnabled);
//    }


    //*****************************应用前后台状态监听*****************************
    public static void registerActivityLifecycle(Application application) {
        application.registerActivityLifecycleCallbacks(new Application.ActivityLifecycleCallbacks() {
            @Override
            public void onActivityCreated(Activity activity, Bundle bundle) {
                MTLogger.d("onActivityCreated");
            }

            @Override
            public void onActivityStarted(Activity activity) {
                MTLogger.d("onActivityStarted");
            }

            @Override
            public void onActivityResumed(Activity activity) {
                MTLogger.d("onActivityResumed");
                isAppForeground = true;
            }

            @Override
            public void onActivityPaused(Activity activity) {
                MTLogger.d("onActivityPaused");
                isAppForeground = false;
            }

            @Override
            public void onActivityStopped(Activity activity) {
                MTLogger.d("onActivityStopped");
            }

            @Override
            public void onActivitySaveInstanceState(Activity activity, Bundle bundle) {
                MTLogger.d("onActivitySaveInstanceState");
            }

            @Override
            public void onActivityDestroyed(Activity activity) {
                MTLogger.d("onActivityDestroyed");
            }
        });
    }

}
