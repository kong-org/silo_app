/**
 * KONG SiLo NFC Scanner
 */

/// Load modules.
import React from 'react';
import {
    Alert,
    Animated,
    AppState,
    FlatList,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Linking
} from 'react-native';
import { Button } from 'react-native-elements';
import { WebView } from 'react-native-webview';
import { MaterialIndicator } from 'react-native-indicators';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Video from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';

var elliptic = require('elliptic').ec;

// Load settings / default values.
import packageInfo from './package.json';
import defaultSettings from './assets/data/defaultSettings.js';

// Load functions.
import nfc from './src/nfc.js';
import helpers from './src/helpers.js';
import results from './src/results.js';
import blockchain from './src/blockchain.js';
import verification from './src/verification.js';

// Import design elements.
import textStyles from './assets/styles/textStyles.js';
import viewStyles from './assets/styles/viewStyles.js';
import imageStyles from './assets/styles/imageStyles.js';
import videoStyles from './assets/styles/videoStyles.js';
import buttonStyles from './assets/styles/buttonStyles.js';
import gradientStyles from './assets/styles/gradientStyles.js';

// Import text.
import strings from './assets/text/strings.js';


// HomeScreen.
class HomeScreen extends React.Component {

    static navigationOptions = {header: null};

    constructor(props) {

        // Set state.
        super(props);
        this.state = this._getInitialState();

        // Bindings -- Helpers.
        this._goToScreen = helpers._goToScreen.bind(this);
        this._loadSettings = helpers._loadSettings.bind(this);
        this._loadVerificationType = helpers._loadVerificationType.bind(this);
        this._toggleVerificationType = helpers._toggleVerificationType.bind(this);
        this._goToFailScreen = helpers._goToFailScreen.bind(this);
        this._resetToDefaultSettings = helpers._resetToDefaultSettings.bind(this);

        // Bindings -- NFC.
        this._nfcStart = nfc._nfcStart.bind(this);
        this._nfcStartFullVerification = nfc._nfcStartFullVerification.bind(this);
        this._nfcStartQuickVerification = nfc._nfcStartQuickVerification.bind(this);

        this._nfcIOSScanStart = nfc._nfcIOSScanStart.bind(this);
        this._nfcIOSScanQuick = nfc._nfcIOSScanQuick.bind(this);
        this._nfcIOSScanFull = nfc._nfcIOSScanFull.bind(this);

        this._nfcAndroidScan = nfc._nfcAndroidScan.bind(this);
        this._nfcAndroidProcessQuickScan = nfc._nfcAndroidProcessQuickScan.bind(this);
        this._nfcAndroidProcessFullScan = nfc._nfcAndroidProcessFullScan.bind(this);        

        this._goToNfcFailScreen = nfc._goToNfcFailScreen.bind(this);

        // Bindings -- Blockchain.
        this._fetchChainData = blockchain._fetchChainData.bind(this);

        // Bindings -- Verification.
        this._verifyERC20 = verification._verifyERC20.bind(this);
        this._verifyUnknownDevice = verification._verifyUnknownDevice.bind(this);
        this._verifySignature = verification._verifySignature.bind(this);

        // Bindings -- Results.
        this._renderResults = results._renderResults.bind(this);
        this._renderResultsBodyRegistered = results._renderResultsBodyRegistered.bind(this);
        this._renderResultsBodyUnregistered = results._renderResultsBodyUnregistered.bind(this);
        this._getVerificationInstructions = results._getVerificationInstructions.bind(this);

        // Settings for result presentation.
        this.offset = 0;

    }

    _getInitialState = () => {

        return {

            pauseIntro: true,                       // Boolean pause variable for playback launch video.

            nfcData: {},                            // Dictionary with nfc data.
            curveData: {},                          // Dictionary with elliptic curve objects.
            nfcSettings: {},                        // Dictionary with nfc settings.
            chainSettings: {},                      // Dictionary with blockchain settings.
            blockchainData: {},                     // Dictionary with blockchain data.
            verificationData: {},                   // Dictionary with verification data.
            fullVerification: false,                // Boolean variable for verification settings.

            scrollOffset: new Animated.Value(0),    // For animated components of result presentation.

        }

    };

    _resetState = () => {

        // Ensure that Android phone restarts scanning.
        if (Platform.OS == 'android') {this._nfcAndroidScan()};

        // Maintain chainSettings and nfcSettings.
        this.setState({
            location: 'atHome',
            nfcData: {},
            blockchainData: {},
            verificationData: {},
            scrollOffset: new Animated.Value(0)
        });

    };

    _handleAppStateChange = (nextAppState) => {

        // Handle cases where NFC is enabled while app is running.
        if (this.state.nfcSettings.nfcEnabled == false && Platform.OS == 'android') {this._nfcStart()}

    };

    _createCurves = async() => {

        return new Promise(function(resolve, reject) {

            var curveP256 = new elliptic('p256');
            var interval = setInterval(function(){

                if (curveP256 !== undefined) {

                    clearInterval(interval);
                    resolve({curveP256: curveP256});

                };

            }, 50);

        });

    };


    _handleOpenURL(event) {
        console.log(event.url);
    }

    _onScroll = e => {

        const offset = e.nativeEvent.contentOffset.y * 3 / 4;
        this.state.scrollOffset.setValue(offset);

    };

    componentDidMount() {

        Linking.addEventListener('url', this._handleOpenURL);

        // // Detect first launch and show different screen.
        // AsyncStorage.getItem("previouslyLaunched").then(value => {

        //     this._goToScreen(!value ? 'atFirstLaunch' : 'atHome');
        //     if (!value) {AsyncStorage.setItem('previouslyLaunched', 'true')}

        // })//

        this._goToScreen('atHome');

        // Geting verification setting.
        this._loadVerificationType();

        // Add listener for scroll position.
        this.state.scrollOffset.addListener(({ value }) => (this.offset = value));

        // Start NFC.
        this._nfcStart();

        // Get node address and contract register.
        this._loadSettings();

        // Add listener for app state changes.
        AppState.addEventListener('change', this._handleAppStateChange);

        // Create curve object.
        this._createCurves().then((curveData) => {
            this.setState({curveData: curveData});
        });

    };

    componentWillUnmount() {
        Linking.removeEventListener('url', this._handleOpenURL);
    }

    _playVideo() {

        if (this.videoPlayer != null) {

            setTimeout(() => {this.setState({
                pauseIntro: false,
                showPlayButton: false
            })}, 500)

        };

    };

    _simulateSuccess() {

        // Update state.
        var nfcData = Object.assign({}, this.state.nfcData, {

            // inputRecord
            nfcReadInputCommandCode: '00',
            nfcReadInputExternalRandomNumber: '723addf4c447b23a8a5ba496da7f3994e38a435b2b62fddfeb63fedf64957899',
            nfcReadInputBlockhash: '19d34978c5cdf2025ff9a920eb08fbae4dd5e9b1fd346e1a3ccdc79ef261271f',
            nfcReadInputCombinedHash: '41dadc87121c95c6b7726ab9d1e3d3d4317be074865f1e3e2ea3cac3e73ede69',
            nfcWrittenInputExternalRandomNumber: '723addf4c447b23a8a5ba496da7f3994e38a435b2b62fddfeb63fedf64957899',
            nfcWrittenInputBlockhash: '19d34978c5cdf2025ff9a920eb08fbae4dd5e9b1fd346e1a3ccdc79ef261271f',
            nfcWrittenInputCombinedHash: '41dadc87121c95c6b7726ab9d1e3d3d4317be074865f1e3e2ea3cac3e73ede69',

            // outputRecord
            nfcReadOutputCommandCode: '00',
            nfcReadOutputExternalRandomNumber: '723addf4c447b23a8a5ba496da7f3994e38a435b2b62fddfeb63fedf64957899',
            nfcReadOutputBlockhash: '19d34978c5cdf2025ff9a920eb08fbae4dd5e9b1fd346e1a3ccdc79ef261271f',
            nfcReadOutputCombinedHash: '41dadc87121c95c6b7726ab9d1e3d3d4317be074865f1e3e2ea3cac3e73ede69',
            nfcReadOutputInternalRandomNumber: 'e0a30cca780cf2c4e7fe6ffd2256acd13df418527695e09685e496371ee0da25',
            nfcReadOutputExternalSignature: 'e73d2c9025c4d2c939d917b56ff3cd18f811947c2d4ed220bd5019e8c1d2035426ad711271572662fa5c909cb505e3b80ba08d4b1ed19c807753dfaf5c56de9a',
            nfcReadOutputInternalSignature: '6f20813b1e41e2b4b4f7106b20b369d6dc5aa08ba5843332cdf4f9ccd789901d4d580b4fedc4cd747765a88b9be0f20e5b948cd4ac996141e68360244c8ba7c0',

            // infoRecord
            nfcReadInfoPrimaryPublicKey: 'a38687c9a139290ce1867ef2a198b6bf63bf0f1a90286c31936e1c32e0f186125192e5fc38ce813c7ff232cea32ca7c7318ac626cecc2e53ed910907226bf9b5',
            nfcReadInfoSecondaryPublicKey: '42b49600d597f8ee2cfd82fcb5479805bd9aa8d45adf95c0226faca25b83118ddfb8968e95862ae6847d0d216adbcd94f1d53151a528131d61921b2c58c1846b',
            nfcReadInfoPrimaryPublicKeyHash: '247bb5261723c13757442997ffb0f77d93d803c29bee8dd1ea9de81a3e0830a3'

        });

        this.setState((prevState) => ({nfcData}));

        // Update screen.
        this._goToScreen('atProcessing', 'Simulating...');

        // Check contract registration.
        Promise.all([
            this._fetchChainData('contractRegistration', nfcData.nfcReadInfoPrimaryPublicKeyHash),
            this._fetchChainData('blockByHash', nfcData.nfcReadOutputBlockhash)
        ]).then(() => {

            this._nfcStartVerification();

        }).catch((err) => {

            this._goToFailScreen(
                'UhOh!',
                'Could not get blockchain data...'
            );

        });


    }

    _simulateFailure() {

        // Update state.
        var nfcData = Object.assign({}, this.state.nfcData, {

            // inputRecord
            nfcReadInputCommandCode: '00',
            nfcReadInputExternalRandomNumber: '723addf4c447b23a8a5ba496da7f3994e38a435b2b62fddfeb63fedf64957899',
            nfcReadInputBlockhash: '19d34978c5cdf2025ff9a920eb08fbae4dd5e9b1fd346e1a3ccdc79ef261271f',
            nfcReadInputCombinedHash: '41dadc87121c95c6b7726ab9d1e3d3d4317be074865f1e3e2ea3cac3e73ede69',
            nfcWrittenInputExternalRandomNumber: '723addf4c447b23a8a5ba496da7f3994e38a435b2b62fddfeb63fedf64957899',
            nfcWrittenInputBlockhash: '19d34978c5cdf2025ff9a920eb08fbae4dd5e9b1fd346e1a3ccdc79ef261271f',
            nfcWrittenInputCombinedHash: '41dadc87121c95c6b7726ab9d1e3d3d4317be074865f1e3e2ea3cac3e73ede69',

            // outputRecord
            nfcReadOutputCommandCode: '00',
            nfcReadOutputExternalRandomNumber: '723addf4c447b23a8a5ba496da7f3994e38a435b2b62fddfeb63fedf64957899',
            nfcReadOutputBlockhash: '19d34978c5cdf2025ff9a920eb08fbae4dd5e9b1fd346e1a3ccdc79ef261271f',
            nfcReadOutputCombinedHash: '41dadc87121c95c6b7726ab9d1e3d3d4317be074865f1e3e2ea3cac3e73ede69',
            nfcReadOutputInternalRandomNumber: 'e0a30cca780cf2c4e7fe6ffd2256acd13df418527695e09685e496371ee0da25',
            nfcReadOutputExternalSignature: 'e73d2c9025c4d2c939d917b56ff3cd18f811947c2d4ed220bd5019e8c1d2035426ad711271572662fa5c909cb505e3b80ba08d4b1ed19c807753dfaf5c56de90',
            nfcReadOutputInternalSignature: '6f20813b1e41e2b4b4f7106b20b369d6dc5aa08ba5843332cdf4f9ccd789901d4d580b4fedc4cd747765a88b9be0f20e5b948cd4ac996141e68360244c8ba7c1',

            // infoRecord
            nfcReadInfoPrimaryPublicKey: 'a38687c9a139290ce1867ef2a198b6bf63bf0f1a90286c31936e1c32e0f186125192e5fc38ce813c7ff232cea32ca7c7318ac626cecc2e53ed910907226bf9b5',
            nfcReadInfoSecondaryPublicKey: '42b49600d597f8ee2cfd82fcb5479805bd9aa8d45adf95c0226faca25b83118ddfb8968e95862ae6847d0d216adbcd94f1d53151a528131d61921b2c58c1846b',
            nfcReadInfoPrimaryPublicKeyHash: '247bb5261723c13757442997ffb0f77d93d803c29bee8dd1ea9de81a3e0830a3'

        });

        this.setState((prevState) => ({nfcData}));

        // Update screen.
        this._goToScreen('atProcessing', 'Simulating...');

        // Check contract registration.
        Promise.all([
            this._fetchChainData('contractRegistration', nfcData.nfcReadInfoPrimaryPublicKeyHash),
            this._fetchChainData('blockByHash', nfcData.nfcReadOutputBlockhash)
        ]).then(() => {

            this._nfcStartVerification();

        }).catch((err) => {

            this._goToFailScreen(
                'UhOh!',
                'Could not get blockchain data...'
            );

        });

    }

    render() {

        return (

            <React.Fragment>

                {/*

                If you wish to add a first launch view, see componentDidMount(); above. Video and image assets required below.

                { (this.state.location == 'atFirstLaunch') &&

                    <View style={viewStyles.viewFirstLaunchVideo}>

                        <Video
                            ref={p => {this.videoPlayer = p;}}
                            source={require('./assets/...')}
                            style={videoStyles.videoFirstLaunch}
                            controls={false}
                            paused={this.state.pauseIntro}
                            repeat={true}
                            onLoad={() => this._playVideo()}
                            onEnd={() => this.setState({})}
                        />

                        <View style={viewStyles.viewFirstLaunchOverlay}>

                            <React.Fragment>

                                <View style={viewStyles.viewFirstLaunchOverlayImage}>
                                    <Image source={require('./assets/img/...')}/>
                                </View>

                                { (this.state.showPlayButton) &&

                                    <TouchableOpacity onPress={() => this._playVideo()}>
                                        <Image source={require('./assets/img/play.png')}/>
                                    </TouchableOpacity>

                                }

                                <Button
                                    title={strings.textButtonGetStarted}
                                    titleStyle={textStyles.textButtonGetStarted}
                                    buttonStyle={buttonStyles.buttonGetStarted}
                                    onPress={() => this._goToScreen('atHome', '')}
                                />

                            </React.Fragment>

                        </View>

                    </View>

                }
                */}

                {/* Home view. */}
                { (this.state.location == 'atHome') &&

                    <LinearGradient colors={gradientStyles.gradientAtHome} style={viewStyles.viewHome}>

                        <View style={viewStyles.viewHomeTop}>

                            <View style={viewStyles.viewHomeTopLeftCorner}>

                                <TouchableOpacity onPress={() => this._goToScreen('atSettings')}>
                                    <Image source={require('./assets/img/settings.png')}/>
                                </TouchableOpacity>

                            </View>


                            {/*
                            // Add an image here.

                            // <View style={viewStyles.viewHomeTopImage}>

                                // { (Platform.OS == 'ios') &&

                                //     <Image source={require('./assets/img/...')} resizeMode='center' style={imageStyles.imageScan, { width: "100%", height: "100%" }} />

                                // }

                                // { (Platform.OS == 'android') &&

                                //     <Image source={require('./assets/img/...')} resizeMode='center'/>

                                // }
                                
                            // </View>
                            */}

                        </View>


                        <View style={viewStyles.viewHomeBottom}>

                            <React.Fragment>

                                <Text style={textStyles.textHomeQuestion}>{strings.textHomeHeading}</Text>
                                <Text style={textStyles.textHomeDescription}>{strings.textHomeDescription}</Text>

                                { ((Platform.OS == 'ios') && this.state.nfcSettings.nfcSupported) &&

                                    <Button
                                        title={strings.textButtonScan}
                                        titleStyle={textStyles.textButtonScan}
                                        buttonStyle={buttonStyles.buttonScan}
                                        onPress={this._nfcIOSScanStart}
                                    />

                                }

                                { ((Platform.OS == 'android') && this.state.nfcSettings.nfcSupported) &&

                                    <View style={viewStyles.viewHomeHoldScan}>    
                                        <Image source={require('./assets/img/nfc-icon.png')} style={imageStyles.nfcIcon} />
                                        <Text style={textStyles.textHomeHoldScan}>{strings.textHomeHoldScan}</Text>
                                    </View>

                                }

                                { ((Platform.OS == 'android') && this.state.nfcSettings.nfcSupported && !this.state.nfcSettings.nfcEnabled) &&

                                    <Text style={textStyles.textHomeDescription}>{strings.textHomeNfcDisabled}<Text onPress={() => nfc._goToNfcSetting()}>{strings.textHomeNfcDisabledClick}</Text> </Text>

                                }

                                { !this.state.nfcSettings.nfcSupported &&

                                    <Button
                                        title={strings.textHomeNfcNotSupported}
                                        titleStyle={textStyles.textButtonNoNfc}
                                        buttonStyle={buttonStyles.buttonNoNfc}
                                    />

                                }

                            </React.Fragment>

                        </View>

                    </LinearGradient>

                }

                {/* Settings view. */}
                { (this.state.location == 'atSettings') &&

                    <LinearGradient colors={gradientStyles.gradientAtSettings} style={viewStyles.viewGradientSettings}>

                        <KeyboardAwareScrollView style={viewStyles.viewSettings} contentContainerStyle={viewStyles.viewSettingsContentContainers}>

                            <View style={viewStyles.viewSettingsTopLeftCorner}>

                                <TouchableOpacity onPress={() => this._goToScreen('atHome')}>
                                    <Image source={require('./assets/img/back-black.png')}/>
                                </TouchableOpacity>

                            </View>

                            <View style={viewStyles.viewSettingsBody}>

                                <React.Fragment>

                                    <View style={viewStyles.viewSettingsBorder}/>

                                    {/********************
                                      * DESCRIPTION BOX. *
                                      *******************/}

                                    <Text style={textStyles.textSettingsDescriptionHeading}>{strings.textSettingsHeading}</Text>

                                    <Text style={textStyles.textSettingsDescription}>{strings.textSettingsDescription}</Text>

                                    <View style={viewStyles.viewSettingsBorder}/>

                                    {/*************
                                      * INFO BOX. *
                                      ************/}

                                    {/*
                                    <TouchableOpacity style={viewStyles.viewSettingsRows} onPress={() => this._goToScreen('atInfo')}>

                                        <React.Fragment>

                                            <View style={viewStyles.viewSettingsRowText}>
                                                <Text style={textStyles.textSettingsTellMeMore}>{strings.textSettingsTellMeMore}</Text>
                                            </View>

                                            <Image source={require('./assets/img/chevron-right.png')}/>

                                        </React.Fragment>

                                    </TouchableOpacity>

                                    <View style={viewStyles.viewSettingsBorder}/>
                                    */}

                                    {/************
                                      * FAQ BOX. *
                                      ***********/}

                                    <TouchableOpacity style={viewStyles.viewSettingsRows} onPress={() => this._goToScreen('atFAQ')}>

                                        <React.Fragment>

                                            <View style={viewStyles.viewSettingsRowText}>
                                                <Text style={textStyles.textSettingsFAQ}>{strings.textSettingsFAQ}</Text>
                                            </View>

                                            <Image source={require('./assets/img/chevron-right.png')}/>

                                        </React.Fragment>

                                    </TouchableOpacity>

                                    <View style={viewStyles.viewSettingsBorder}/>

                                    {/*****************
                                      * SCAN TYPE BOX *
                                      *****************/}

                                    <Text style={textStyles.textSettingsSettingsHeading}>{strings.textSettingsScanTypeHeading}</Text>

                                    <View style={viewStyles.viewSettingsSwitchRow}>
                                        <Text style={textStyles.textSettingsScan}>{this.state.fullVerification?strings.textSettingsScanFullVerification:strings.textSettingsScanQuickVerification}</Text>
                                        
                                        <Switch
                                            style={buttonStyles.switchVerificationType}
                                            onValueChange = {this._toggleVerificationType}
                                            value = {this.state.fullVerification}
                                            disabled = {Platform.Version < 13}
                                        />
                                    </View>

                                    <Text style={textStyles.textSettingsScanDescription}>{strings.textScanTypeDescription}</Text>

                                    { ((Platform.Version < 13) && (Platform.OS == 'ios')) &&

                                        <Text style={textStyles.textSettingsScanCompatibility}>{strings.textScanTypeDescriptionQuickOnly}</Text>

                                    }

                                    <View style={viewStyles.viewSettingsBorder}/>

                                    {/******************
                                      * BLOCKCHAIN BOX *
                                      ******************/}

                                    <Text style={textStyles.textSettingsSettingsHeading}>{strings.textSettingsSettingsHeading}</Text>

                                    <TextInput
                                        style={textStyles.textSettingsNodeIpValue}
                                        onChangeText={(text) => {

                                            var chainSettings = Object.assign({}, this.state.chainSettings, {node: text});
                                            this.setState({chainSettings}, () => {AsyncStorage.setItem('node', text, (res) => {})})

                                        }}
                                        multiline={true}
                                        value={`${this.state.chainSettings.node}`}
                                    />

                                    <Text style={textStyles.textSettingsReset} onPress={() => this._resetToDefaultSettings()}>{strings.textSettingsReset}</Text>

                                    <View style={viewStyles.viewSettingsBorder}/>

                                    {/****************
                                      * VERSION BOX. *
                                      ***************/}

                                    <View style={{paddingBottom: 20}}>

                                        <Text style={textStyles.textSettingsVersion}>{`Version ${packageInfo.version}`}</Text>

                                    </View>

                                </React.Fragment>

                            </View>

                        </KeyboardAwareScrollView>

                    </LinearGradient>

                }

                {/* Settings view. */}
                { (this.state.location == 'atFAQ') &&

                    <LinearGradient colors={gradientStyles.gradientAtFAQ} style={viewStyles.viewGradientFAQ}>

                        <KeyboardAwareScrollView style={viewStyles.viewFAQ} contentContainerStyle={viewStyles.viewFAQContentContainers}>

                            <View style={viewStyles.viewFAQTopLeftCorner}>

                                <TouchableOpacity onPress={() => this._goToScreen('atSettings')}>
                                    <Image source={require('./assets/img/back-black.png')}/>
                                </TouchableOpacity>

                            </View>

                            <View style={viewStyles.viewFAQDescription}>

                                <React.Fragment>

                                    <View style={viewStyles.viewFAQBorder}/>

                                        <Text style={textStyles.textFAQQuestion}>{strings.textFAQQuestion1}</Text>
                                        <Text style={textStyles.textFAQAnswer}>{strings.textFAQAnswer1}</Text>

                                    <View style={viewStyles.viewFAQBorder}/>

                                        <Text style={textStyles.textFAQQuestion}>{strings.textFAQQuestion3}</Text>
                                        <Text style={textStyles.textFAQAnswer}>{strings.textFAQAnswer3}</Text>

                                    <View style={viewStyles.viewFAQBorder}/>

                                        <Text style={textStyles.textFAQQuestion}>{strings.textFAQQuestion4}</Text>
                                        <Text style={textStyles.textFAQAnswer}>{strings.textFAQAnswer4}</Text>

                                    <View style={viewStyles.viewFAQBorder}/>

                                        <Text style={textStyles.textFAQQuestion}>{strings.textFAQQuestion5}</Text>
                                        <Text style={textStyles.textFAQAnswer}>{strings.textFAQAnswer5}</Text>

                                </React.Fragment>

                            </View>

                        </KeyboardAwareScrollView>

                    </LinearGradient>

                }

                {/* Info webview.*/}
                { (this.state.location == 'atInfo') &&

                    <LinearGradient colors={gradientStyles.gradientAtFAQ} style={viewStyles.viewGradientFAQ}>

                        <React.Fragment>

                            <View style={viewStyles.viewInfoTopBar}>

                                <TouchableOpacity onPress={() => this._goToScreen('atSettings')}>
                                    <Image source={require('./assets/img/back-black.png')}/>
                                </TouchableOpacity>

                            </View>

                            <WebView
                                source={{uri: 'https://kong.cash'}}
                                style={{marginTop: 20}}
                            />

                        </React.Fragment>

                    </LinearGradient>

                }

                {/* Processing view. */}
                { (this.state.location == 'atProcessing') &&

                    <LinearGradient colors={gradientStyles.gradientAtProcessing} style={viewStyles.viewProcessingResults}>

                        <View>

                            <Text style={textStyles.textProcessingScanned}>{strings.textProcessingHeading}</Text>

                        </View>

                        <View style={viewStyles.viewProcessingBottom}>

                            <MaterialIndicator color="#000000" />
                            <Text style={textStyles.textProcessingStatus}>{`${this.state.status}`}</Text>

                        </View>

                    </LinearGradient>

                }

                {/* Result view. */}
                { (this.state.location == 'atResult') &&

                    <React.Fragment>

                        {this._renderResults()}

                    </React.Fragment>

                }

                {/* Log view. */}
                { (this.state.location == 'atDetails') &&

                    <React.Fragment>

                        {this._renderResultsDetailed()}

                    </React.Fragment>

                }

                {/* Contract not found. */}
                { (this.state.location == 'atFail') &&

                    <ImageBackground source={require('./assets/img/background.png')} style={viewStyles.viewFail}>

                        <View style={viewStyles.viewFailTop}>

                            <View style={viewStyles.viewFailTopBackLinks}>

                                <TouchableOpacity onPress={this._resetState}>
                                    <Image source={require('./assets/img/x.png')}/>
                                </TouchableOpacity>

                                <Text onPress={this._resetState} style={textStyles.textFailBackLink}>
                                    BACK
                                </Text>

                            </View>

                        </View>

                        {/********************************************/}
                        <View style={viewStyles.viewFailTopSeparator}/>
                        {/********************************************/}

                        <View style={viewStyles.viewFailMiddle}>

                            <React.Fragment>

                                <Image source={require('./assets/img/sad.png')}/>
                                <Text style={textStyles.textFailWarning}>{`${this.state.failWarning}`}</Text>
                                <Text style={textStyles.textFailDescription}>{`${this.state.failDescription}`}</Text>

                            </React.Fragment>

                        </View>

                        <View style={viewStyles.viewFailBottom}>

                            <Button
                                title={strings.textButtonRetry}
                                titleStyle={textStyles.textButtonRetry}
                                buttonStyle={buttonStyles.buttonRetry}
                                onPress={this._resetState}
                            />

                        </View>

                    </ImageBackground>

                }

            </React.Fragment>

        );
    }
}


const AppNavigator = createStackNavigator({
    Home: {screen: HomeScreen}
}, {
    initialRouteName: 'Home'
});

export default createAppContainer(AppNavigator);
