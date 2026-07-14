const withMtpushAndroid = require('./withMtpushAndroid');
const withMtpushIOS = require('./withMtpushIOS');

const REQUIRED_FIELDS = [
  'appKey',
  'channel',
  'process',
];

function validateProps(props) {
  const missing = REQUIRED_FIELDS.filter((key) => !props || !props[key]);
  if (missing.length > 0) {
    throw new Error(
      `[mtpush-react-native] Missing required config plugin field(s): ${missing.join(', ')}. ` +
        'Pass them via the "mtpush-react-native" entry in your app.json/app.config.js plugins array.'
    );
  }
}

function withMtpush(config, props) {
  validateProps(props);
  config = withMtpushAndroid(config, props);
  config = withMtpushIOS(config, props);
  return config;
}

module.exports = withMtpush;
