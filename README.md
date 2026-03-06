# React Native + NativeWind Boilerplate

> Tested & working setup for **React Native 0.80.0** with **NativeWind v4**, New Architecture enabled, supporting iOS & Android.

---

## Tech Stack

| Package                          | Version   | Notes                                   |
| -------------------------------- | --------- | --------------------------------------- |
| `react-native`                   | `0.80.0`  | ✅ Stable — do NOT use 0.84.x (nightly) |
| `react`                          | `19.1.0`  | Matches RN 0.80.0                       |
| `nativewind`                     | `^4.1.23` | Tailwind CSS for React Native           |
| `tailwindcss`                    | `^3.4.15` | v3 only — v4 not yet supported          |
| `react-native-reanimated`        | `^3.18.0` | Required by NativeWind v4               |
| `react-native-worklets`          | `latest`  | Required by reanimated 3.18+            |
| `react-native-safe-area-context` | `^5.5.1`  | Compatible with RN 0.80                 |
| `@react-native-community/cli`    | `19.0.0`  | Pinned to match RN version              |

---

## Prerequisites

- **Node.js** >= 18.x (22.x recommended)
- **OpenJDK 17** — required for Android
- **Xcode 15+** — iOS only (macOS)
- **CocoaPods** — iOS dependency manager
- **Android Studio** — Android SDK & emulator

---

## Quick Start

```bash
# 1. Create project (pin CLI + RN version)
npx @react-native-community/cli@19.0.0 init MyApp --version 0.80.0
cd MyApp

# 2. Install dependencies
npm install nativewind@^4.1.23 tailwindcss@^3.4.15
npm install react-native-reanimated@^3.18.0
npm install react-native-safe-area-context@^5.5.1
npm install react-native-worklets

# 3. Init Tailwind
npx tailwindcss init

# 4. iOS
cd ios && pod install && cd ..

# 5. Run
npx react-native start --reset-cache
npx react-native run-ios        # new terminal
npx react-native run-android    # or this
```

---

## Configuration

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `babel.config.js`

> ⚠️ `nativewind/babel` must be a **preset**, not a plugin. `reanimated/plugin` must be **last**.

```js
module.exports = {
  presets: ['module:@react-native/babel-preset', 'nativewind/babel'],
  plugins: [
    'react-native-worklets/plugin',
    'react-native-reanimated/plugin', // must be last
  ],
};
```

### `metro.config.js`

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = mergeConfig(getDefaultConfig(__dirname), {});

module.exports = withNativeWind(config, { input: './global.css' });
```

### `nativewind-env.d.ts` (TypeScript only)

```ts
/// <reference types="nativewind/types" />
```

---

## `ios/Podfile`

The default generated Podfile works as-is for RN 0.80.0. No extra build settings needed.

```ruby
require Pod::Executable.execute_command('node', ['-p',
  'require.resolve(
    "react-native/scripts/react_native_pods.rb",
    {paths: [process.argv[1]]},
  )', __dir__]).strip

platform :ios, min_ios_version_supported
prepare_react_native_project!

linkage = ENV['USE_FRAMEWORKS']
if linkage != nil
  Pod::UI.puts "Configuring Pod with #{linkage}ally linked Frameworks".green
  use_frameworks! :linkage => linkage.to_sym
end

target 'MyApp' do
  config = use_native_modules!

  use_react_native!(
    :path => config[:reactNativePath],
    :app_path => "#{Pod::Config.instance.installation_root}/.."
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
    )
  end
end
```

---

## `App.tsx` Boilerplate

> ⚠️ `global.css` must be the **first** import.

```tsx
import './global.css';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-white">
        <ScrollView className="flex-1 p-4">
          <View className="items-center justify-center py-10">
            <Text className="text-3xl font-bold text-blue-600">
              NativeWind is working! 🎉
            </Text>
            <Text className="text-gray-500 mt-2 text-base">
              React Native {require('react-native/package.json').version}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

---

## Project Structure

```
MyApp/
├── android/
├── ios/
│   └── Podfile
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Screen-level components
│   ├── navigation/        # React Navigation config
│   └── utils/             # Helpers and constants
├── App.tsx                # Entry point — import global.css first
├── global.css             # Tailwind directives
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── nativewind-env.d.ts    # TypeScript className support
└── package.json
```

---

## NativeWind Usage

### Basic Components

```tsx
// Card
<View className="bg-white rounded-2xl shadow p-4 mb-4 border border-gray-100">
  <Text className="text-lg font-bold text-gray-900">Title</Text>
  <Text className="text-sm text-gray-500 mt-1">Subtitle</Text>
</View>

// Button
<TouchableOpacity className="bg-blue-600 py-3 px-6 rounded-xl">
  <Text className="text-white font-semibold text-center">Click me</Text>
</TouchableOpacity>

// Input
<TextInput
  className="border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
  placeholder="Enter text..."
/>
```

### Conditional Classes

```tsx
// ✅ Use clsx for conditional classes
import { clsx } from 'clsx'; // npm install clsx

<View
  className={clsx('p-4 rounded-xl', isActive ? 'bg-blue-600' : 'bg-gray-100')}
/>;

// ⚠️ Never construct class names dynamically
// ❌ className={`bg-${color}-600`}   ← Tailwind can't detect this
// ✅ className={color === 'blue' ? 'bg-blue-600' : 'bg-red-600'}
```

---

## Full Clean Rebuild

Run this sequence when you hit unexplained build errors:

```bash
# 1. Clear Xcode DerivedData
rm -rf ~/Library/Developer/Xcode/DerivedData

# 2. Remove node_modules
rm -rf node_modules && rm package-lock.json

# 3. Reinstall packages
npm install

# 4. Clean and reinstall pods
cd ios
pod deintegrate
rm -rf Pods Podfile.lock
pod install
cd ..

# 5. Clear Metro cache and run
npx react-native start --reset-cache
# In a new terminal:
npx react-native run-ios
```

---

## Common Errors & Fixes

| Error                                               | Cause                    | Fix                                    |
| --------------------------------------------------- | ------------------------ | -------------------------------------- |
| `RNWorklets spec not found`                         | Wrong reanimated version | Use `reanimated@3.18.x` with RN 0.80   |
| `Cannot find module 'react-native-worklets/plugin'` | Missing package          | `npm install react-native-worklets`    |
| `folly/coro/Coroutine.h not found`                  | RN version too new       | Downgrade to RN 0.80.0                 |
| `non-modular-include-in-framework-module`           | RN/reanimated mismatch   | Use exact version matrix above         |
| `xcodebuild exited with error 65`                   | Generic Xcode failure    | Run full clean rebuild                 |
| `className` not recognized in TS                    | Missing type declaration | Add `nativewind-env.d.ts`              |
| Metro bundler cache issues                          | Stale cache              | `npx react-native start --reset-cache` |

---

## Why RN 0.80.0 and not 0.84.x?

RN **0.84.x is a nightly/canary build** — not a stable release. The broader ecosystem (reanimated, safe-area-context, CocoaPods) has not caught up to it, causing broken pod resolution and C++ header mismatches. **RN 0.80.0** is the latest stable release with full ecosystem support.
