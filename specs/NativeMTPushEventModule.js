/**
 * @flow strict-local
 * @format
 */

import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import type {
  EventEmitter,
  UnsafeObject,
} from 'react-native/Libraries/Types/CodegenTypes';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  +onConnect: EventEmitter<UnsafeObject>;
  +onNotification: EventEmitter<UnsafeObject>;
  +onLocalNotification: EventEmitter<UnsafeObject>;
  +onCustomMessage: EventEmitter<UnsafeObject>;
  +onTagAlias: EventEmitter<UnsafeObject>;
  +onMobileNumber: EventEmitter<UnsafeObject>;
  +onInappMessage: EventEmitter<UnsafeObject>;
  +onNotiInappMessage: EventEmitter<UnsafeObject>;
  +onPlatformToken: EventEmitter<UnsafeObject>;
  +onVoipMessage: EventEmitter<UnsafeObject>;
}

export default TurboModuleRegistry.get<Spec>('MTPushEventModule');
