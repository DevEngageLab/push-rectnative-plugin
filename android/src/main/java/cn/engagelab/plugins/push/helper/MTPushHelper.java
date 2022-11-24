package cn.engagelab.plugins.push.helper;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONObject;

import java.util.Iterator;
import java.util.Set;

import cn.engagelab.plugins.push.MTPushModule;
import cn.engagelab.plugins.push.common.MTConstants;
import cn.engagelab.plugins.push.common.MTLogger;

import com.engagelab.privates.push.api.CustomMessage;
import com.engagelab.privates.push.api.NotificationMessage;


public class MTPushHelper {

    public static void sendEvent(String eventName, WritableMap params) {
        try {
            MTPushModule.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
        }catch (Throwable throwable){
            MTLogger.e("sendEvent error:"+throwable.getMessage());
        }
    }

    public static WritableMap convertNotificationToMap(String eventType, NotificationMessage message) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MTConstants.NOTIFICATION_EVENT_TYPE, eventType);
        writableMap.putString(MTConstants.MESSAGE_ID, message.getMessageId());
        writableMap.putString(MTConstants.TITLE, message.getTitle());
        writableMap.putString(MTConstants.CONTENT, message.getContent());
        convertExtras(message.getExtras().toString(), writableMap);
        return writableMap;
    }

//    public static WritableMap convertNotificationBundleToMap(String eventType, Bundle bundle) {
//        WritableMap writableMap = Arguments.createMap();
//        writableMap.putString(MTConstants.NOTIFICATION_EVENT_TYPE, eventType);
//        writableMap.putString(MTConstants.MESSAGE_ID, bundle.getString("cn.jpush.android.MSG_ID",""));
//        writableMap.putString(MTConstants.TITLE, bundle.getString("cn.jpush.android.NOTIFICATION_CONTENT_TITLE",""));
//        writableMap.putString(MTConstants.CONTENT, bundle.getString("cn.jpush.android.ALERT",""));
//        convertExtras(bundle.getString("cn.jpush.android.EXTRA",""), writableMap);
//        return writableMap;
//    }

    public static WritableMap convertCustomMessage(CustomMessage customMessage) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MTConstants.MESSAGE_ID, customMessage.getMessageId());
        writableMap.putString(MTConstants.TITLE, customMessage.getTitle());
        writableMap.putString(MTConstants.CONTENT, customMessage.getContent());
        convertExtras(customMessage.getExtras().toString(), writableMap);
        return writableMap;
    }

//    public static WritableMap convertJPushMessageToMap(int type, JPushMessage message) {
//        WritableMap writableMap = Arguments.createMap();
//
//        writableMap.putInt(MTConstants.CODE, message.getErrorCode());
//        writableMap.putInt(MTConstants.SEQUENCE, message.getSequence());
//        switch (type) {
//            case 1:
//                Set<String> tags = message.getTags();
//                WritableArray tagsArray = Arguments.createArray();
//                if(tags==null || tags.isEmpty()){
//                    MTLogger.d("tags is empty");
//                }else {
//                    for (String tag : tags) {
//                        tagsArray.pushString(tag);
//                    }
//                }
//                writableMap.putArray(MTConstants.TAGS, tagsArray);
//                break;
//            case 2:
//                writableMap.putBoolean(MTConstants.TAG_ENABLE, message.getTagCheckStateResult());
//                writableMap.putString(MTConstants.TAG, message.getCheckTag());
//                break;
//            case 3:
//                writableMap.putString(MTConstants.ALIAS, message.getAlias());
//                break;
//        }
//        return writableMap;
//    }

    public static void convertExtras(String extras, WritableMap writableMap) {
        if (TextUtils.isEmpty(extras) || extras.equals("{}")) return;
        try {
            WritableMap extrasMap = Arguments.createMap();
            JSONObject jsonObject = new JSONObject(extras);
            Iterator<String> it = jsonObject.keys();
            while (it.hasNext()) {
                String key = it.next();
                String value = jsonObject.getString(key);
                extrasMap.putString(key, value);
            }
            writableMap.putMap(MTConstants.EXTRAS, extrasMap);
        } catch (Throwable throwable) {
            MTLogger.w("convertExtras error:" + throwable.getMessage());
        }
    }

    public static void launchApp(Context context) {
        try {
            Intent intent = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
            context.startActivity(intent);
        }catch (Throwable throwable){
            MTLogger.e("");
        }
    }

}
