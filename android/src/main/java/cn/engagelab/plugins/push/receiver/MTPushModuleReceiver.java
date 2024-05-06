package cn.engagelab.plugins.push.receiver;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;

import com.engagelab.privates.push.api.AliasMessage;
import com.engagelab.privates.push.api.TagMessage;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import com.engagelab.privates.common.component.MTCommonReceiver;
import com.engagelab.privates.core.api.WakeMessage;
import com.engagelab.privates.push.api.CustomMessage;
import com.engagelab.privates.push.api.MobileNumberMessage;
import com.engagelab.privates.push.api.NotificationMessage;
import com.engagelab.privates.push.api.PlatformTokenMessage;
import com.facebook.react.bridge.WritableNativeArray;

import java.sql.Array;
import java.util.ArrayList;
import java.util.List;

import cn.engagelab.plugins.push.MTPushModule;
import cn.engagelab.plugins.push.common.MTLogger;
import cn.engagelab.plugins.push.common.MTConstants;
import cn.engagelab.plugins.push.helper.MTPushHelper;

/**
 * 开发者继承MTCommonReceiver，可以获得sdk的方法回调
 * <p>
 * 所有回调均在主线程
 */
public class MTPushModuleReceiver extends MTCommonReceiver {

  public static NotificationMessage NOTIFICATION_BUNDLE;

  @Override
  public void onNotificationStatus(Context context, boolean enable) {
    MTLogger.d("onNotificationStatus:" + enable);
  }

  @Override
  public void onCustomMessage(Context context, CustomMessage customMessage) {
    MTLogger.d("onCustomMessage:" + customMessage.toString());
    WritableMap writableMap = MTPushHelper.convertCustomMessage(customMessage);
    MTPushHelper.sendEvent(MTConstants.CUSTOM_MESSAGE_EVENT, writableMap);
  }

  @Override
  public void onNotificationArrived(Context context, NotificationMessage notificationMessage) {
    MTLogger.d("onNotificationArrived:" + notificationMessage.toString());
    WritableMap writableMap = MTPushHelper.convertNotificationToMap(MTConstants.NOTIFICATION_ARRIVED, notificationMessage);
    if(notificationMessage.getStyle()!=1){
      MTPushHelper.sendEvent(MTConstants.NOTIFICATION_EVENT, writableMap);
    }else {
      MTPushHelper.sendEvent(MTConstants.LOCAL_NOTIFICATION_EVENT, writableMap);
    }
  }

  @Override
  public void onNotificationClicked(Context context, NotificationMessage notificationMessage) {
    Log.i("TAG", "onNotificationClicked:" + notificationMessage.toString());
    MTLogger.d("onNotificationClicked:" + notificationMessage.toString());
    if (MTPushModule.reactContext != null) {
      if (!MTPushModule.isAppForeground) {
        Log.i("TAG", "onNotificationClicked: - is not AppForeground");
        MTPushHelper.launchApp(context);
      }
      WritableMap writableMap = MTPushHelper.convertNotificationToMap(MTConstants.NOTIFICATION_OPENED, notificationMessage);
      MTPushHelper.sendEvent(MTConstants.NOTIFICATION_EVENT, writableMap);
    } else {
      Log.i("TAG", "onNotificationClicked: - reactContext null");
      MTLogger.e("onNotificationClicked: - reactContext null");
      if (!MTPushModule.isAppForeground) {
        Log.i("TAG", "onNotificationClicked: - is not AppForeground");
        NOTIFICATION_BUNDLE = notificationMessage;
      }
      super.onNotificationClicked(context, notificationMessage);
    }
  }

  @Override
  public void onNotificationDeleted(Context context, NotificationMessage notificationMessage) {
    MTLogger.d("onNotificationDeleted:" + notificationMessage.toString());
    WritableMap writableMap = MTPushHelper.convertNotificationToMap(MTConstants.NOTIFICATION_DISMISSED, notificationMessage);
    MTPushHelper.sendEvent(MTConstants.NOTIFICATION_EVENT, writableMap);
  }

  @Override
  public void onConnectStatus(Context context, boolean state) {
    MTLogger.d("onConnected state:" + state);
    WritableMap writableMap = Arguments.createMap();
    writableMap.putBoolean(MTConstants.CONNECT_ENABLE, state);
    MTPushHelper.sendEvent(MTConstants.CONNECT_EVENT, writableMap);
  }

  @Override
  public void onTagMessage(Context context, TagMessage tagMessage) {
    MTLogger.d("onTagMessage:" + tagMessage.toString());
    WritableMap writableMap = Arguments.createMap();
    writableMap.putInt(MTConstants.CODE,tagMessage.getCode());
    WritableArray writableArray = new WritableNativeArray();
    writableMap.putInt(MTConstants.SEQUENCE,tagMessage.getSequence());
    if (tagMessage.getQueryTag().equals("1")) {
      writableMap.putBoolean(MTConstants.TAG_ENABLE, tagMessage.isQueryTagValid());
    }else {
      for (String value : tagMessage.getTags()) {
        writableArray.pushString(value);
      }
      writableMap.putArray(MTConstants.TAGS,writableArray);
    }
    MTPushHelper.sendEvent(MTConstants.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onAliasMessage(Context context, AliasMessage aliasMessage) {
    MTLogger.d("onAliasMessage:" + aliasMessage.toString());
    WritableMap writableMap = Arguments.createMap();
    writableMap.putInt(MTConstants.CODE,aliasMessage.getCode());
    writableMap.putString(MTConstants.ALIAS,aliasMessage.getAlias());
    writableMap.putInt(MTConstants.SEQUENCE,aliasMessage.getSequence());
    MTPushHelper.sendEvent(MTConstants.TAG_ALIAS_EVENT, writableMap);
  }

  @Override
  public void onMobileNumber(Context context, MobileNumberMessage mobileNumberMessage) {
    MTLogger.d("onMobileNumberOperatorResult:" + mobileNumberMessage.toString());
    WritableMap writableMap = Arguments.createMap();
    writableMap.putInt(MTConstants.CODE, mobileNumberMessage.getCode());
    writableMap.putInt(MTConstants.SEQUENCE, mobileNumberMessage.getSequence());
    MTPushHelper.sendEvent(MTConstants.MOBILE_NUMBER_EVENT, writableMap);
  }

  @Override
  public void onWake(Context context, WakeMessage wakeMessage) {
    MTLogger.d("onWake:" + wakeMessage.toString());
  }

}
