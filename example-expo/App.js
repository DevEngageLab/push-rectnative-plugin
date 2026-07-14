import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import MTPush from 'mtpush-react-native';

function DemoButton({ title, onPress }) {
  return (
    <TouchableHighlight
      onPress={onPress}
      underlayColor="#e4083f"
      activeOpacity={0.5}>
      <View style={styles.setBtnStyle}>
        <Text style={styles.textStyle}>{title}</Text>
      </View>
    </TouchableHighlight>
  );
}

function formatResult(title, result) {
  if (typeof result === 'undefined') {
    return title;
  }
  return `${title}: ${JSON.stringify(result)}`;
}

export default function App() {
  const [resultText, setResultText] = useState('等待操作结果');
  const listenersRef = useRef([]);

  function recordResult(title, result) {
    const text = formatResult(title, result);
    console.log(text);
    setResultText(text);
  }

  function showResult(title, result) {
    recordResult(title, result);
    Alert.alert('MTPush', JSON.stringify(result));
  }

  useEffect(() => {
    MTPush.setLoggerEnable(true);
    // MTPush.setTcpSSL(true);
    // MTPush.setEnableResetOnDeviceChange(true);
    // MTPush.setCollectControl({gaid: true, aid: true});
    // MTPush.testConfigGoogle(true);
    // MTPush.setSiteName('USA_Virginia');
    MTPush.init({
      appKey: '8344af5668f374579426ce6d',
      channel: 'dev',
      production: false,
    });

    const listeners = [];

    const connectListener = result => recordResult('connectListener', result);
    MTPush.addConnectEventListener(connectListener);
    listeners.push(connectListener);

    const notificationListener = result =>
      showResult('notificationListener', result);
    MTPush.addNotificationListener(notificationListener);
    listeners.push(notificationListener);

    const localNotificationListener = result =>
      recordResult('localNotificationListener', result);
    MTPush.addLocalNotificationListener(localNotificationListener);
    listeners.push(localNotificationListener);

    const customMessageListener = result =>
      showResult('customMessageListener', result);
    MTPush.addCustomMessageListener(customMessageListener);
    listeners.push(customMessageListener);

    MTPush.pageEnterTo('HomePage');

    const inappMessageListener = result =>
      showResult('inappMessageListener', result);
    MTPush.addInappMessageListener(inappMessageListener);
    listeners.push(inappMessageListener);

    const notiInappMessageListener = result =>
      showResult('notiInappMessageListener', result);
    MTPush.addNotiInappMessageListener(notiInappMessageListener);
    listeners.push(notiInappMessageListener);

    const addTagAliasListener = result =>
      recordResult('addTagAliasListener', result);
    MTPush.addTagAliasListener(addTagAliasListener);
    listeners.push(addTagAliasListener);

    const mobileNumberListener = result =>
      recordResult('mobileNumberListener', result);
    MTPush.addMobileNumberListener(mobileNumberListener);
    listeners.push(mobileNumberListener);

    listenersRef.current = listeners;

    return () => {
      MTPush.pageLeave('HomePage');
      listenersRef.current.forEach(listener => {
        MTPush.removeListener(listener);
      });
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.resultBox}>
        <Text style={styles.resultTitle}>操作结果</Text>
        <Text style={styles.resultText}>{resultText}</Text>
      </View>

      <DemoButton
        title="setLoggerEnable"
        onPress={() => MTPush.setLoggerEnable(true)}
      />

      <DemoButton
        title="setEnableResetOnDeviceChange"
        onPress={() => MTPush.setEnableResetOnDeviceChange(true)}
      />

      <DemoButton
        title="getRegisterID"
        onPress={() =>
          MTPush.getRegistrationID(result => recordResult('registerID', result))
        }
      />

      <DemoButton
        title="setMobileNumber"
        onPress={() =>
          MTPush.setMobileNumber({
            mobileNumber: '13888888888',
            sequence: 1,
          })
        }
      />

      <DemoButton
        title="setBadge"
        onPress={() => MTPush.setBadge({ badge: 3, appBadge: 3 })}
      />

      <DemoButton
        title="setBadgeWithCallback"
        onPress={() =>
          MTPush.setBadgeWithCallback({ badge: 5, appBadge: 5 }, result => {
            if (result.code !== 0) {
              recordResult('setBadgeWithCallback error', result);
              Alert.alert('MTPush', '设置Badge失败: ' + result.message);
            } else {
              recordResult('setBadgeWithCallback success');
              Alert.alert('MTPush', '设置Badge成功');
            }
          })
        }
      />

      <DemoButton
        title="addLocalNotification"
        onPress={() =>
          MTPush.addLocalNotification({
            messageID: '123456789',
            title: 'title123',
            content: 'content123',
            extras: { key123: 'value123' },
          })
        }
      />

      <DemoButton
        title="removeLocalNotification"
        onPress={() => MTPush.removeLocalNotification({ messageID: '123456789' })}
      />

      <DemoButton
        title="addTags"
        onPress={() => MTPush.addTags({ sequence: 1, tags: ['1', '2', '3'] })}
      />

      <DemoButton
        title="updateTags"
        onPress={() => MTPush.updateTags({ sequence: 2, tags: ['4', '5', '6'] })}
      />

      <DemoButton
        title="deleteTag"
        onPress={() => MTPush.deleteTag({ sequence: 3, tags: ['4', '5', '6'] })}
      />

      <DemoButton
        title="deleteTags"
        onPress={() => MTPush.deleteTags({ sequence: 4 })}
      />

      <DemoButton
        title="queryTag"
        onPress={() => MTPush.queryTag({ sequence: 4, tag: '1' })}
      />

      <DemoButton
        title="queryTags"
        onPress={() => MTPush.queryTags({ sequence: 5 })}
      />

      <DemoButton
        title="setAlias"
        onPress={() => MTPush.setAlias({ sequence: 6, alias: 'xxx' })}
      />

      <DemoButton
        title="deleteAlias"
        onPress={() => MTPush.deleteAlias({ sequence: 7 })}
      />

      <DemoButton
        title="queryAlias"
        onPress={() => MTPush.queryAlias({ sequence: 8 })}
      />

      <DemoButton
        title="goToAppNotificationSetting"
        onPress={() => MTPush.goToAppNotificationSettings()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  setBtnStyle: {
    alignItems: 'center',
    backgroundColor: '#3e83d7',
    borderColor: '#3e83d7',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    width: 320,
  },
  resultBox: {
    backgroundColor: '#ffffff',
    borderColor: '#c7d7ec',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    minHeight: 96,
    padding: 12,
    width: 320,
  },
  resultTitle: {
    color: '#1f2937',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultText: {
    color: '#334155',
    fontSize: 14,
    lineHeight: 20,
  },
  textStyle: {
    color: '#ffffff',
    fontSize: 25,
    textAlign: 'center',
  },
});
