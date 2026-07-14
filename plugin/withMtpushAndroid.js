const {
  withAppBuildGradle,
  withProjectBuildGradle,
  withDangerousMod,
} = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const GOOGLE_SERVICES_CLASSPATH = "classpath 'com.google.gms:google-services:4.3.15'";
const AGCONNECT_CLASSPATH = "classpath 'com.huawei.agconnect:agcp:1.9.1.301'";
const HUAWEI_MAVEN_REPO = "maven { url 'https://developer.huawei.com/repo/' }";
const GOOGLE_SERVICES_APPLY = "apply plugin: 'com.google.gms.google-services'";
const AGCONNECT_APPLY = "apply plugin: 'com.huawei.agconnect'";
const MANIFEST_PLACEHOLDER_MARKER = 'ENGAGELAB_PRIVATES_APPKEY';
const UNVERSIONED_ANDROID_GRADLE_PLUGIN =
  /classpath\s*\(\s*['"]com\.android\.tools\.build:gradle['"]\s*\)/;
const VERSIONED_ANDROID_GRADLE_PLUGIN =
  /classpath\s*(?:\(\s*)?['"]com\.android\.tools\.build:gradle:[^'"]+['"]\s*\)?/;

function replaceOrThrow(contents, pattern, replacement, description) {
  if (!pattern.test(contents)) {
    throw new Error(`[mtpush-react-native] Could not find ${description}. The Expo Android template may be unsupported.`);
  }
  return contents.replace(pattern, replacement);
}

function insertIntoBuildscriptDependencies(contents, classpathLine) {
  if (contents.includes(classpathLine)) {
    return contents;
  }
  return replaceOrThrow(
    contents,
    /(buildscript\s*{[\s\S]*?dependencies\s*{)/,
    `$1\n        ${classpathLine}`,
    'buildscript.dependencies in the project build.gradle'
  );
}

function insertMavenRepo(contents, repoLine) {
  if (contents.includes(repoLine)) {
    return contents;
  }
  let out = replaceOrThrow(
    contents,
    /(buildscript\s*{[\s\S]*?repositories\s*{)/,
    `$1\n        ${repoLine}`,
    'buildscript.repositories in the project build.gradle'
  );
  out = replaceOrThrow(
    out,
    /(allprojects\s*{\s*repositories\s*{)/,
    `$1\n        ${repoLine}`,
    'allprojects.repositories in the project build.gradle'
  );
  return out;
}

function resolveAndroidGradlePluginVersion(projectRoot) {
  let reactNativePackagePath;
  try {
    reactNativePackagePath = require.resolve('react-native/package.json', {
      paths: [projectRoot],
    });
  } catch (error) {
    throw new Error(
      '[mtpush-react-native] Cannot resolve react-native while configuring Huawei AGConnect.',
      { cause: error }
    );
  }

  const versionCatalogPath = path.join(
    path.dirname(reactNativePackagePath),
    'gradle',
    'libs.versions.toml'
  );
  if (!fs.existsSync(versionCatalogPath)) {
    throw new Error(
      `[mtpush-react-native] React Native AGP version catalog not found at: ${versionCatalogPath}`
    );
  }

  const versionCatalog = fs.readFileSync(versionCatalogPath, 'utf8');
  const match = versionCatalog.match(/^\s*agp\s*=\s*["']([^"']+)["']/m);
  if (!match) {
    throw new Error(
      `[mtpush-react-native] Cannot determine the Android Gradle Plugin version from: ${versionCatalogPath}`
    );
  }
  return match[1];
}

function ensureVersionedAndroidGradlePlugin(contents, projectRoot) {
  if (!UNVERSIONED_ANDROID_GRADLE_PLUGIN.test(contents)) {
    if (!VERSIONED_ANDROID_GRADLE_PLUGIN.test(contents)) {
      throw new Error(
        '[mtpush-react-native] Could not find the Android Gradle Plugin classpath required by Huawei AGConnect.'
      );
    }
    return contents;
  }

  const androidGradlePluginVersion = resolveAndroidGradlePluginVersion(projectRoot);
  const updatedContents = contents.replace(
    UNVERSIONED_ANDROID_GRADLE_PLUGIN,
    `classpath('com.android.tools.build:gradle:${androidGradlePluginVersion}')`
  );
  if (!VERSIONED_ANDROID_GRADLE_PLUGIN.test(updatedContents)) {
    throw new Error('[mtpush-react-native] Failed to add a version to the Android Gradle Plugin classpath.');
  }
  return updatedContents;
}

function buildManifestPlaceholders(props) {
  const optionalValue = (key) => props[key] || '';
  const lines = [
    `${MANIFEST_PLACEHOLDER_MARKER}: "${props.appKey}"`,
    `ENGAGELAB_PRIVATES_CHANNEL: "${props.channel}"`,
    `ENGAGELAB_PRIVATES_PROCESS: "${props.process}"`,
    `XIAOMI_APPID: "${optionalValue('xiaomiAppId')}"`,
    `XIAOMI_APPKEY: "${optionalValue('xiaomiAppKey')}"`,
    `MEIZU_APPID: "${optionalValue('meizuAppId')}"`,
    `MEIZU_APPKEY: "${optionalValue('meizuAppKey')}"`,
    `OPPO_APPID: "${optionalValue('oppoAppId')}"`,
    `OPPO_APPKEY: "${optionalValue('oppoAppKey')}"`,
    `OPPO_APPSECRET: "${optionalValue('oppoAppSecret')}"`,
    `VIVO_APPID: "${optionalValue('vivoAppId')}"`,
    `VIVO_APPKEY: "${optionalValue('vivoAppKey')}"`,
    `HONOR_APPID: "${optionalValue('honorAppId')}"`,
  ];
  return `manifestPlaceholders = [\n                ${lines.join(',\n                ')}\n            ]`;
}

function withMtpushProjectGradle(config, props) {
  return withProjectBuildGradle(config, (config) => {
    let contents = config.modResults.contents;
    contents = insertMavenRepo(contents, HUAWEI_MAVEN_REPO);
    if (props.googleServicesFile) {
      contents = insertIntoBuildscriptDependencies(contents, GOOGLE_SERVICES_CLASSPATH);
    }
    if (props.agconnectServicesFile) {
      contents = ensureVersionedAndroidGradlePlugin(
        contents,
        config.modRequest.projectRoot
      );
      contents = insertIntoBuildscriptDependencies(contents, AGCONNECT_CLASSPATH);
    }
    config.modResults.contents = contents;
    return config;
  });
}

function withMtpushAppGradle(config, props) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes(MANIFEST_PLACEHOLDER_MARKER)) {
      contents = replaceOrThrow(
        contents,
        /(defaultConfig\s*{)/,
        `$1\n            ${buildManifestPlaceholders(props)}`,
        'android.defaultConfig in the app build.gradle'
      );
    }

    if (props.googleServicesFile && !contents.includes(GOOGLE_SERVICES_APPLY)) {
      contents = `${contents}\n${GOOGLE_SERVICES_APPLY}\n`;
    }
    if (props.agconnectServicesFile && !contents.includes(AGCONNECT_APPLY)) {
      contents = `${contents}\n${AGCONNECT_APPLY}\n`;
    }

    if (!contents.includes(MANIFEST_PLACEHOLDER_MARKER)) {
      throw new Error('[mtpush-react-native] Failed to inject Android manifest placeholders.');
    }
    if (props.googleServicesFile && !contents.includes(GOOGLE_SERVICES_APPLY)) {
      throw new Error('[mtpush-react-native] Failed to apply the Google Services Gradle plugin.');
    }
    if (props.agconnectServicesFile && !contents.includes(AGCONNECT_APPLY)) {
      throw new Error('[mtpush-react-native] Failed to apply the Huawei AGConnect Gradle plugin.');
    }

    config.modResults.contents = contents;
    return config;
  });
}

function withMtpushServiceFiles(config, props) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const androidAppDir = path.join(config.modRequest.platformProjectRoot, 'app');

      if (props.googleServicesFile) {
        const src = path.join(config.modRequest.projectRoot, props.googleServicesFile);
        if (!fs.existsSync(src)) {
          throw new Error(`[mtpush-react-native] googleServicesFile not found at: ${src}`);
        }
        fs.copyFileSync(src, path.join(androidAppDir, 'google-services.json'));
      }

      if (props.agconnectServicesFile) {
        const src = path.join(config.modRequest.projectRoot, props.agconnectServicesFile);
        if (!fs.existsSync(src)) {
          throw new Error(`[mtpush-react-native] agconnectServicesFile not found at: ${src}`);
        }
        fs.copyFileSync(src, path.join(androidAppDir, 'agconnect-services.json'));
      }

      return config;
    },
  ]);
}

function withMtpushAndroid(config, props) {
  config = withMtpushProjectGradle(config, props);
  config = withMtpushAppGradle(config, props);
  config = withMtpushServiceFiles(config, props);
  return config;
}

module.exports = withMtpushAndroid;
