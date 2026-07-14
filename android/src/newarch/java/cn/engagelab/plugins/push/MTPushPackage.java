package cn.engagelab.plugins.push;

import androidx.annotation.Nullable;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class MTPushPackage extends BaseReactPackage {
    @Override
    public @Nullable NativeModule getModule(
            String name,
            ReactApplicationContext reactContext) {
        if (MTPushModule.class.getSimpleName().equals(name) || "MTPushModule".equals(name)) {
            return new MTPushModule(reactContext);
        }
        if (MTPushEventModule.NAME.equals(name)) {
            return new MTPushEventModule(reactContext);
        }
        return null;
    }

    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> modules = new HashMap<>();
            modules.put(
                    "MTPushModule",
                    new ReactModuleInfo(
                            "MTPushModule",
                            MTPushModule.class.getName(),
                            false,
                            false,
                            false,
                            false));
            modules.put(
                    MTPushEventModule.NAME,
                    new ReactModuleInfo(
                            MTPushEventModule.NAME,
                            MTPushEventModule.class.getName(),
                            false,
                            false,
                            false,
                            true));
            return modules;
        };
    }
}
