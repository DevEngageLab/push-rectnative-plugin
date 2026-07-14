package cn.engagelab.plugins.push;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

public class MTPushEventModule extends NativeMTPushEventModuleSpec {
    public static final String NAME = "MTPushEventModule";
    private static @Nullable MTPushEventModule instance;

    public MTPushEventModule(ReactApplicationContext reactContext) {
        super(reactContext);
        instance = this;
    }

    @Override
    public String getName() {
        return NAME;
    }

    public static void emitConnectEvent(WritableMap payload) { if (instance != null) instance.emitOnConnect(payload); }
    public static void emitNotificationEvent(WritableMap payload) { if (instance != null) instance.emitOnNotification(payload); }
    public static void emitLocalNotificationEvent(WritableMap payload) { if (instance != null) instance.emitOnLocalNotification(payload); }
    public static void emitCustomMessageEvent(WritableMap payload) { if (instance != null) instance.emitOnCustomMessage(payload); }
    public static void emitTagAliasEvent(WritableMap payload) { if (instance != null) instance.emitOnTagAlias(payload); }
    public static void emitMobileNumberEvent(WritableMap payload) { if (instance != null) instance.emitOnMobileNumber(payload); }
    public static void emitInappMessageEvent(WritableMap payload) { if (instance != null) instance.emitOnInappMessage(payload); }
    public static void emitPlatformTokenEvent(WritableMap payload) { if (instance != null) instance.emitOnPlatformToken(payload); }
    public static void emitVoipMessageEvent(WritableMap payload) { if (instance != null) instance.emitOnVoipMessage(payload); }
}
