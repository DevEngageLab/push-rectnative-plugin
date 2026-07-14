import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import MTPush from 'mtpush-react-native';

type DemoButtonProps = {
  title: string;
  onPress: () => void;
};

type Listener = (result: unknown) => void;
type MTPushWithTagAliasListener = typeof MTPush & {
  addTagAliasListener: (callback: Listener) => void;
};
type AppState = {
  resultText: string;
};

const mtPush = MTPush as MTPushWithTagAliasListener;

class DemoButton extends React.PureComponent<DemoButtonProps> {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        underlayColor="#e4083f"
        activeOpacity={0.5}>
        <View style={styles.setBtnStyle}>
          <Text style={styles.textStyle}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    resultText: '等待操作结果',
  };

  private connectListener?: Listener;
  private notificationListener?: Listener;
  private localNotificationListener?: Listener;
  private customMessageListener?: Listener;
  private inappMessageListener?: Listener;
  private notiInappMessageListener?: Listener;
  private addTagAliasListener?: Listener;
  private mobileNumberListener?: Listener;

  private formatResult(title: string, result?: unknown) {
    if (typeof result === 'undefined') {
      return title;
    }
    return `${title}: ${JSON.stringify(result)}`;
  }

  private recordResult(title: string, result?: unknown) {
    const resultText = this.formatResult(title, result);
    console.log(resultText);
    this.setState({resultText});
  }

  private showResult(title: string, result: unknown) {
    this.recordResult(title, result);
    Alert.alert('MTPush', JSON.stringify(result));
  }

  componentDidMount() {
    MTPush.setLoggerEnable(true);
    // MTPush.setTcpSSL(true);
    // MTPush.setEnableResetOnDeviceChange(true);
    // MTPush.setCollectControl({gaid: true, aid: true});
    // MTPush.testConfigGoogle(true);
    // MTPush.setSiteName('USA_Virginia');
    this.connectListener = result => {
      this.recordResult('connectListener', result);
    };
    MTPush.addConnectEventListener(this.connectListener);

    this.notificationListener = result => {
      this.showResult('notificationListener', result);
    };
    MTPush.addNotificationListener(this.notificationListener);

    this.localNotificationListener = result => {
      this.recordResult('localNotificationListener', result);
    };
    MTPush.addLocalNotificationListener(this.localNotificationListener);

    this.customMessageListener = result => {
      this.showResult('customMessageListener', result);
    };
    MTPush.addCustomMessageListener(this.customMessageListener);

    MTPush.pageEnterTo('HomePage');
    this.inappMessageListener = result => {
      this.showResult('inappMessageListener', result);
    };
    MTPush.addInappMessageListener(this.inappMessageListener);

    this.notiInappMessageListener = result => {
      this.showResult('notiInappMessageListener', result);
    };
    MTPush.addNotiInappMessageListener(this.notiInappMessageListener);

    this.addTagAliasListener = result => {
      this.recordResult('addTagAliasListener', result);
    };
    mtPush.addTagAliasListener(this.addTagAliasListener);

    this.mobileNumberListener = result => {
      this.recordResult('mobileNumberListener', result);
    };
    MTPush.addMobileNumberListener(this.mobileNumberListener);

    // Register listeners before init. Initialization can synchronously flush a
    // cold-start notification, which would otherwise be missed by JavaScript.
    MTPush.init({
      appKey: '8344af5668f374579426ce6d',
      channel: 'dev',
      production: true,
    });
  }

  componentWillUnmount() {
    MTPush.pageLeave('HomePage');
    [
      this.connectListener,
      this.notificationListener,
      this.localNotificationListener,
      this.customMessageListener,
      this.inappMessageListener,
      this.notiInappMessageListener,
      this.addTagAliasListener,
      this.mobileNumberListener,
    ].forEach(listener => {
      if (listener) {
        MTPush.removeListener(listener);
      }
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>操作结果</Text>
          <Text style={styles.resultText}>{this.state.resultText}</Text>
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
            MTPush.getRegistrationID(result =>
              this.recordResult('registerID', result),
            )
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
          onPress={() => MTPush.setBadge({badge: 3, appBadge: 3})}
        />

        <DemoButton
          title="setBadgeWithCallback"
          onPress={() =>
            MTPush.setBadgeWithCallback(
              {badge: 5, appBadge: 5},
              result => {
                this.recordResult('setBadgeWithCallback result', result);
                if (result.code !== 0) {
                  this.recordResult('setBadgeWithCallback error', result);
                  Alert.alert('MTPush', '设置Badge失败: ' + result.message);
                } else {
                  this.recordResult('setBadgeWithCallback success');
                  Alert.alert('MTPush', '设置Badge成功');
                }
              },
            )
          }
        />

        <DemoButton
          title="addLocalNotification"
          onPress={() =>
            MTPush.addLocalNotification({
              messageID: '123456789',
              title: 'title123',
              content: 'content123',
              extras: {key123: 'value123'},
            })
          }
        />

        <DemoButton
          title="removeLocalNotification"
          onPress={() =>
            MTPush.removeLocalNotification({messageID: '123456789'})
          }
        />

        <DemoButton
          title="addTags"
          onPress={() => MTPush.addTags({sequence: 1, tags: ['1', '2', '3']})}
        />

        <DemoButton
          title="updateTags"
          onPress={() =>
            MTPush.updateTags({sequence: 2, tags: ['4', '5', '6']})
          }
        />

        <DemoButton
          title="deleteTag"
          onPress={() =>
            MTPush.deleteTag({sequence: 3, tags: ['4', '5', '6']})
          }
        />

        <DemoButton
          title="deleteTags"
          onPress={() => MTPush.deleteTags({sequence: 4})}
        />

        <DemoButton
          title="queryTag"
          onPress={() => MTPush.queryTag({sequence: 4, tag: '1'})}
        />

        <DemoButton
          title="queryTags"
          onPress={() => MTPush.queryTags({sequence: 5})}
        />

        <DemoButton
          title="setAlias"
          onPress={() => MTPush.setAlias({sequence: 6, alias: 'xxx'})}
        />

        <DemoButton
          title="deleteAlias"
          onPress={() => MTPush.deleteAlias({sequence: 7})}
        />

        <DemoButton
          title="queryAlias"
          onPress={() => MTPush.queryAlias({sequence: 8})}
        />

        <DemoButton
          title="goToAppNotificationSetting"
          onPress={() => MTPush.goToAppNotificationSettings()}
        />
      </ScrollView>
    );
  }
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
