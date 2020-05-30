# KONG SiLo

This app allows you to validate a SiLo -- or silicon locked smart contract -- via NFC using an iPhone or Android. [Kong cash](https://kong.cash/) is an example of a SiLo. See the [Kong whitepaper](https://ipfs.io/ipfs/QmWUaY4bDtWpw1ACDanXn3RH64QCaormbGWLMy9wEZxw1T) for more information on how SiLos work.

# Setup

First, make sure you have the following dependencies:

    brew install node
    brew install watchman
    brew tap AdoptOpenJDK/openjdk
    brew cask install adoptopenjdk8
    npm install -g react-native-cli

If you want to build for iOS, you will also need to install the Xcode Command Line Tools. Open Xcode, then choose "Preferences..." from the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

Next, clone repo and run the following:

    watchman watch-del-all
    rm package-lock.json
    rm -rf /tmp/metro-bundler-cache-*
    rm -rf /tmp/haste-map-react-native-packager-*
    rm -rf node_modules
    npm install
    ./node_modules/.bin/rn-nodeify --hack --install
    react-native link

If you're building for iOS then you also need to set up pods:

    cd ios && pod install

*Note that /tmp may be identified by $TMPDIR on some systems*

# Testing on iOS simulator

To run on ios, either start the simulator:

    react-native run-ios

...or build to use on the device using xcodeproj in `./ios/` folder.

# Testing on Android

To run on android with the device connected:

    react-native run-android

or build using gradle; Go to ./android/ and run:

    ./gradleW assembleRelease

When running with a connected device, run:

    adb logcat *:S ReactNative:V ReactNativeJS:V

...to get the log output of the app running on the device. This is extremely helpful to localize issues.

# Notes

When updating packages, start out by running

    npm outdated

Then try to update package by package, including a full rebuilt (see above) to make sure each updated package works.

You might also have to remove .git files in some of the submodules, e.g.:

    rm -rf ./node_modules/react-native-udp/.git

On iOS you may need to enable legacy build phases:

    https://freakycoder.com/react-native-notes-14-cycle-inside-exampletests-building-could-produce-unreliable-results-issue-5b7ff4dc89ad

In case of trouble with fonts.

    https://medium.com/react-native-training/react-native-custom-fonts-ccc9aacf9e5e

See also:

    react-native link react-native-vector-icons

Port forwarding for android server.

    echo "
    rdr pass inet proto tcp from any to any port 8081 -> 127.0.0.1 port 8081
    " | sudo pfctl -ef -
