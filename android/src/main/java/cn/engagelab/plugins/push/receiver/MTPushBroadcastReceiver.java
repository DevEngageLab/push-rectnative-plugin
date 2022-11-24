//package cn.engagelab.plugins.push.receiver;
//
//import android.content.BroadcastReceiver;
//import android.content.Context;
//import android.content.Intent;
//import android.os.Bundle;
//
//import cn.engagelab.plugins.push.common.MTLogger;
//import cn.engagelab.plugins.push.helper.MTPushHelper;
//
//import com.engagelab.privates.core.api.MTCorePrivatesApi;
//import com.engagelab.privates.push.api.MTPushPrivatesApi;
//
//
//public class MTPushBroadcastReceiver extends BroadcastReceiver {
//
//  public static Bundle NOTIFICATION_BUNDLE;
//
//  @Override
//  public void onReceive(Context context, Intent data) {
//    if (MTPushPrivatesApi.ACTION_NOTIFICATION_OPENED.equals(data.getAction())) {
//      MTLogger.d("JPushBroadcastReceiver ACTION_NOTIFICATION_OPENED");
//      try {
//        NOTIFICATION_BUNDLE = data.getExtras();
//        MTPushHelper.launchApp(context);
//      } catch (Throwable throwable) {
//        MTLogger.e("JPushBroadcastReceiver ACTION_NOTIFICATION_OPENED error:" + throwable.getMessage());
//      }
//    }
//  }
//
//}
