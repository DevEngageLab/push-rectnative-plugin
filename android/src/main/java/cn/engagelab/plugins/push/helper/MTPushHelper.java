package cn.engagelab.plugins.push.helper;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Iterator;
import java.util.Map;
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
        if (message.getExtras() != null) {
//            writableMap.putString(MTConstants.EXTRAS, bundleToJson(message.getExtras()));
           convertExtras(bundleToJson(message.getExtras()), writableMap);
        }
        return writableMap;
    }

    public static WritableMap convertCustomMessage(CustomMessage customMessage) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString(MTConstants.MESSAGE_ID, customMessage.getMessageId());
        writableMap.putString(MTConstants.TITLE, customMessage.getTitle());
        writableMap.putString(MTConstants.CONTENT, customMessage.getContent());
        if (customMessage.getExtras() != null) {
//            writableMap.putString(MTConstants.EXTRAS, bundleToJson(customMessage.getExtras()));
            convertExtras(bundleToJson(customMessage.getExtras()), writableMap);
        }
        return writableMap;
    }

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


    private static String bundleToJson(final Bundle bundle) {
        if (bundle == null) return null;
        JSONObject jsonObject = new JSONObject();

        for (String key : bundle.keySet()) {
            Object obj = bundle.get(key);
            try {
                jsonObject.put(key, wrap(bundle.get(key)));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return jsonObject.toString();
    }

    public static Object wrap(Object o) {
        if (o == null) {
            return JSONObject.NULL;
        }
        if (o instanceof JSONArray || o instanceof JSONObject) {
            return o;
        }
        if (o.equals(JSONObject.NULL)) {
            return o;
        }
        try {
            if (o instanceof Collection) {
                return new JSONArray((Collection) o);
            } else if (o.getClass().isArray()) {
                return toJSONArray(o);
            }
            if (o instanceof Map) {
                return new JSONObject((Map) o);
            }
            if (o instanceof Boolean ||
                    o instanceof Byte ||
                    o instanceof Character ||
                    o instanceof Double ||
                    o instanceof Float ||
                    o instanceof Integer ||
                    o instanceof Long ||
                    o instanceof Short ||
                    o instanceof String) {
                return o;
            }
            if (o.getClass().getPackage().getName().startsWith("java.")) {
                return o.toString();
            }
        } catch (Exception ignored) {
        }
        return null;
    }

    public static JSONArray toJSONArray(Object array) throws JSONException {
        JSONArray result = new JSONArray();
        if (!array.getClass().isArray()) {
            throw new JSONException("Not a primitive array: " + array.getClass());
        }
        final int length = Array.getLength(array);
        for (int i = 0; i < length; ++i) {
            result.put(wrap(Array.get(array, i)));
        }
        return result;
    }

}
