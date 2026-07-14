package cn.engagelab.plugins.push;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;

public class MTPushEventModule extends ReactContextBaseJavaModule {
    public MTPushEventModule(ReactApplicationContext reactContext) { super(reactContext); }
    @Override public String getName() { return "MTPushEventModule"; }
    public static void emitConnectEvent(WritableMap payload) {}
    public static void emitNotificationEvent(WritableMap payload) {}
    public static void emitLocalNotificationEvent(WritableMap payload) {}
    public static void emitCustomMessageEvent(WritableMap payload) {}
    public static void emitTagAliasEvent(WritableMap payload) {}
    public static void emitMobileNumberEvent(WritableMap payload) {}
    public static void emitInappMessageEvent(WritableMap payload) {}
    public static void emitPlatformTokenEvent(WritableMap payload) {}
    public static void emitVoipMessageEvent(WritableMap payload) {}
}
