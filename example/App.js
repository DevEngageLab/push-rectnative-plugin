import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight, ScrollView} from 'react-native';
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
        MTPush.setLoggerEnable(true);
        // MTPush.setTcpSSL(true); 
        // MTPush.testConfigGoogle(true);
        // MTPush.setSiteName("USA_Virginia"); // 该接口在1.0.8版本不再需要设置。只需设置appkey就行。
        MTPush.init({"appKey":"5645a6e0c6ef00bb71facf21","channel":"dev","production":1});
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
        //tags/alias回调
        this.addTagAliasListener = result => {
            console.log("addTagAliasListener:" + JSON.stringify(result))
        };
        MTPush.addTagAliasListener(this.addTagAliasListener);
         //手机号码事件回调
         this.mobileNumberListener = result => {
             console.log("mobileNumberListener:" + JSON.stringify(result))
         };
         MTPush.addMobileNumberListener(this.mobileNumberListener);
    }

    render() {
        return (
            <ScrollView >
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

                <Button title="addTags"
                        onPress={() => MTPush.addTags({sequence: 1, tags: ["1", "2", "3"]})}/>

                <Button title="updateTags"
                        onPress={() => MTPush.updateTags({sequence: 2, tags: ["4", "5", "6"]})}/>

                <Button title="deleteTag"
                        onPress={() => MTPush.deleteTag({sequence: 3, tags: ["4", "5", "6"]})}/>

                <Button title="deleteTags"
                        onPress={() => MTPush.deleteTags({sequence: 4})}/>

                <Button title="queryTag"
                        onPress={() => MTPush.queryTag({sequence: 4, tag: "1"})}/>

                <Button title="queryTags"
                        onPress={() => MTPush.queryTags({sequence: 5})}/>

                <Button title="setAlias"
                        onPress={() => MTPush.setAlias({sequence: 6,alias:"xxx"})}/>

                <Button title="deleteAlias"
                        onPress={() => MTPush.deleteAlias({sequence: 7})}/>

                <Button title="queryAlias"
                        onPress={() => MTPush.queryAlias({sequence: 8})}/>

                {/* <Button title="uploadPlatformToken"
                        onPress={() => MTPush.uploadPlatformToken({platform:1, token: "MI-6476s-afs-afs-afaR-HT25", region: "null"})}/> */}


                {/* <Button title="setPushTime"
                           onPress={() => MTPush.setPushTime({pushTimeDays: [5,6], pushTimeStartHour: 6, pushTimeEndHour: 22})}/>

                <Button title="setSilenceTime"
                           onPress={() => MTPush.setSilenceTime({silenceTimeStartHour: 5, silenceTimeStartMinute: 1, silenceTimeEndHour: 18, silenceTimeEndMinute: 1})}/>        */}


            </ScrollView>
        );
    }

}
