/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('mtpush-react-native', () => ({
  __esModule: true,
  default: {
    addConnectEventListener: jest.fn(),
    addCustomMessageListener: jest.fn(),
    addInappMessageListener: jest.fn(),
    addLocalNotificationListener: jest.fn(),
    addMobileNumberListener: jest.fn(),
    addNotiInappMessageListener: jest.fn(),
    addNotificationListener: jest.fn(),
    addTagAliasListener: jest.fn(),
    deleteAlias: jest.fn(),
    deleteTag: jest.fn(),
    deleteTags: jest.fn(),
    getRegistrationID: jest.fn(),
    goToAppNotificationSettings: jest.fn(),
    init: jest.fn(),
    pageEnterTo: jest.fn(),
    pageLeave: jest.fn(),
    queryAlias: jest.fn(),
    queryTag: jest.fn(),
    queryTags: jest.fn(),
    removeListener: jest.fn(),
    removeLocalNotification: jest.fn(),
    setAlias: jest.fn(),
    setBadge: jest.fn(),
    setBadgeWithCallback: jest.fn(),
    setEnableResetOnDeviceChange: jest.fn(),
    setLoggerEnable: jest.fn(),
    setMobileNumber: jest.fn(),
    addLocalNotification: jest.fn(),
    addTags: jest.fn(),
    updateTags: jest.fn(),
  },
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
