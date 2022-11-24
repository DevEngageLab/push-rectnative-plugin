import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import MTPush from 'mtpush-react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    setBtnStyle: {
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#3e83d7',
        borderRadius: 8,
        backgroundColor: '#3e83d7',
        padding: 10
    },
    textStyle: {
        textAlign: 'center',
        fontSize: 25,
        color: '#ffffff'
    }
});

class Button extends React.Component {
    render() {
        return <TouchableHighlight
            onPress={this.props.onPress}
            underlayColor='#e4083f'
            activeOpacity={0.5}
        >
            <View
                style={styles.setBtnStyle}>
                <Text
                    style={styles.textStyle}>
                    {this.props.title}
                </Text>
            </View>
        </TouchableHighlight>
    }
}

export default class App extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        MTPush.init({"appKey":"c571017eb5459d84170c8bf0","channel":"dev","production":1});
        //连接状态
        this.connectListener = result => {
            console.log("connectListener:" + JSON.stringify(result))
        };
        MTPush.addConnectEventListener(this.connectListener);
        //通知回调
        this.notificationListener = result => {
            console.log("notificationListener:" + JSON.stringify(result))
            alert(JSON.stringify(result))
        };
        MTPush.addNotificationListener(this.notificationListener);
        //本地通知回调
        this.localNotificationListener = result => {
            console.log("localNotificationListener:" + JSON.stringify(result))
        };
        MTPush.addLocalNotificationListener(this.localNotificationListener);
        //自定义消息回调
        this.customMessageListener = result => {
            console.log("customMessageListener:" + JSON.stringify(result))
            alert(JSON.stringify(result))
        };
        MTPush.addCustomMessageListener(this.customMessageListener);
         //手机号码事件回调
         this.mobileNumberListener = result => {
             console.log("mobileNumberListener:" + JSON.stringify(result))
         };
         MTPush.addMobileNumberListener(this.mobileNumberListener);
    }

    render() {
        return (
            <View style={styles.container}>
                <Button title="setLoggerEnable"
                        onPress={() => MTPush.setLoggerEnable(true)
                        }/>

                <Button title="getRegisterID"
                        onPress={() => MTPush.getRegistrationID(result =>
                            console.log("registerID:" + JSON.stringify(result))
                        )}/>


                <Button title="setMobileNumber"
                         onPress={() => MTPush.setMobileNumber({mobileNumber: "13888888888", sequence: 1})}/>

                <Button title="setBadge"
                          onPress={() => MTPush.setBadge({"badge":3,"appBadge":3})}/>

                <Button title="addLocalNotification"
                           onPress={() => MTPush.addLocalNotification({
                                 messageID: "123456789",
                                 title: "title123",
                                 content: "content123",
                                 extras: {"key123": "value123"}
                               })}/>

                <Button title="removeLocalNotification"
                           onPress={() => MTPush.removeLocalNotification({messageID: '123456789'})}/>


            </View>
        );
    }

}
