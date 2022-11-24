package cn.engagelab.plugins.push.receiver;

import android.content.Context;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import com.engagelab.privates.common.component.MTCommonReceiver;
import com.engagelab.privates.core.api.WakeMessage;
import com.engagelab.privates.push.api.CustomMessage;
import com.engagelab.privates.push.api.MobileNumberMessage;
import com.engagelab.privates.push.api.NotificationMessage;
import com.engagelab.privates.push.api.PlatformTokenMessage;

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
    MTLogger.d("onNotificationClicked:" + notificationMessage.toString());
    if (MTPushModule.reactContext != null) {
      if (!MTPushModule.isAppForeground) MTPushHelper.launchApp(context);
      WritableMap writableMap = MTPushHelper.convertNotificationToMap(MTConstants.NOTIFICATION_OPENED, notificationMessage);
      MTPushHelper.sendEvent(MTConstants.NOTIFICATION_EVENT, writableMap);
    } else {
      super.onNotificationClicked(context, notificationMessage);
    }
  }

  @Override
  public void onNotificationDeleted(Context context, NotificationMessage notificationMessage) {
    MTLogger.d("onNotificationDeleted:" + notificationMessage.toString());
    WritableMap writableMap = MTPushHelper.convertNotificationToMap(MTConstants.NOTIFICATION_DISMISSED, notificationMessage);
    MTPushHelper.sendEvent(MTConstants.NOTIFICATION_EVENT, writableMap);
  }

//  @Override
//  public void onRegister(Context context, String registrationId) {
//    MTLogger.d("onRegister:" + registrationId);
//  }
//
  @Override
  public void onConnectStatus(Context context, boolean state) {
    MTLogger.d("onConnected state:" + state);
    WritableMap writableMap = Arguments.createMap();
    writableMap.putBoolean(MTConstants.CONNECT_ENABLE, state);
    MTPushHelper.sendEvent(MTConstants.CONNECT_EVENT, writableMap);
  }
//
//  @Override
//  public void onCommandResult(Context context, CmdMessage message) {
//    MTLogger.d("onCommandResult:" + message.toString());
//    WritableMap writableMap = Arguments.createMap();
//    writableMap.putInt(MTConstants.COMMAND, message.cmd);
//    writableMap.putString(MTConstants.COMMAND_EXTRA, message.extra.toString());
//    writableMap.putString(MTConstants.COMMAND_MESSAGE, message.msg);
//    writableMap.putInt(MTConstants.COMMAND_RESULT, message.errorCode);
//    MTPushHelper.sendEvent(MTConstants.COMMAND_EVENT, writableMap);
//  }

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
