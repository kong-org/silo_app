import { Dimensions, StyleSheet } from 'react-native';
var {height, width} = Dimensions.get('window');
function scale(size) { return Math.floor(size * (height / 812) ** 0.5)}


const textStyles = StyleSheet.create({

    // First launch.
    textFirstLaunchTopText: {
        color: '#FFFFFF',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(30),
        lineHeight: scale(28),
        marginBottom: scale(30)
    },
    textFirstLaunchQuestion: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(20),
        lineHeight: scale(28),
        marginBottom: scale(10)
    },
    textFirstLaunchDescription: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginBottom: scale(10)
    },

    // Home.
    textHomeQuestion: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(20),
        lineHeight: scale(28),
        marginBottom: scale(10)
    },
    textHomeDescription: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginBottom: scale(24)
    },
    textHomeHoldScan: {
        color: '#000000',
        // fontFamily: 'Futura-Bold'
        fontFamily: 'Oswald-Bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        lineHeight: scale(28), 
        paddingTop: 0.025 * height   
    },

    // Settings.
    textSettingsDescriptionHeading: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(20),
        lineHeight: scale(28),
        marginBottom: scale(20)
    },
    textSettingsDescription: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28)
    },
    textSettingsFAQ: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(17),
        lineHeight: scale(28)
    },
    textSettingsTellMeMore: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(17),
        lineHeight: scale(28)
    },
    textSettingsSettingsHeading: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(17),
        lineHeight: scale(28),
        marginBottom: scale(20)
    },
    textSettingsNodeIpValue: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginBottom: scale(8),
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: '#979797'
    },
    textSettingsScan: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        textAlign: 'left',
        fontSize: scale(16),
        lineHeight: scale(28)
    },    
    textSettingsScanDescription: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28)
    },
    textSettingsScanCompatibility: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginTop: scale(20)
    },
    textSettingsReset: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28)
    },
    textSettingsVersion: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(12),
        lineHeight: scale(30),
        marginBottom: scale(20)
    },

    // FAQ.
    textFAQQuestion: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(20),
        lineHeight: scale(28),
        marginBottom: scale(20)
    },
    textFAQAnswer: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28)
    },

    // Processing.
    textProcessingScanned: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(30),
        textAlign: 'center',
        marginBottom: scale(8)
    },
    textProcessingScannedIOSFull: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(30),
        marginBottom: scale(36)
    },    
    textProcessingStatus: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(32),
        marginTop: scale(16),
        textAlign: 'center'
    },

    // Fail.
    textFailWarning: {
        color: '#FF5333',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(42),
        lineHeight: scale(60),
        textAlign: 'left',
        marginTop: scale(21),
        marginBottom: scale(21)
    },
    textFailDescription: {
        color: '#FFFFFF',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        textAlign: 'left'
    },
    textFailBackLink: {
        color: '#FFFFFF',
        fontSize: scale(17),
        // fontFamily: 'InputMono-Bold',
        fontFamily: 'RobotoMono-Bold',
        marginBottom: -3,
        marginLeft: 15
    },

    // Button text.
    textButtonGetStarted: {
        color: '#000000',
        // fontFamily: 'Futura',
        fontFamily: 'Oswald-Regular',
        fontSize: scale(15),
        fontWeight: 'bold'
    },
    textButtonNoNfc: {
        // fontFamily: 'Futura',
        fontFamily: 'Oswald-Regular',
        fontSize: scale(15),
        fontWeight: 'bold'
    },
    textButtonScan: {
        // fontFamily: 'Futura',
        fontFamily: 'Oswald-Regular',
        fontSize: scale(15),
        fontWeight: 'bold'
    },
    textButtonRetry: {
        color: '#000000',
        // fontFamily: 'Futura',
        fontFamily: 'Oswald-Regular',
        fontSize: scale(15),
        fontWeight: 'bold'
    },
    textButtonVerify: {
        // fontFamily: 'Futura',
        fontFamily: 'Oswald-Regular',
        fontSize: scale(14),
        fontWeight: 'bold'
    },
    textButtonDetails: {
        // fontFamily: 'Futura',
        fontFamily: 'Oswald-Regular',
        fontSize: scale(14),
        fontWeight: 'bold'
    },

    // Results.
    textResultsBackLink: {
        color: '#FFFFFF',
        fontSize: scale(17),
        // fontFamily: 'InputMono-Bold',
        fontFamily: 'RobotoMono-Bold',
        marginBottom: -3,
        marginLeft: 15,
        lineHeight: scale(28)
    },
    textResultsFaceValue: {
        color: '#FFFFFF',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        textAlign: 'left',
        fontSize: scale(22),
        lineHeight: scale(28)
    },
    textVerificationResult: {
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(42),
        lineHeight: scale(51),
        marginTop: scale(21),
        marginBottom: scale(21),
        textAlign: 'left'
    },
    textResultsHeading: {
        color: '#000000',
        // fontFamily: 'Futura-CondensedExtraBold',
        fontFamily: 'Oswald-Bold',
        fontSize: scale(20),
        lineHeight: scale(28),
        marginBottom: scale(5),
        marginRight: 34
    },
    textResultsChecksWithoutBottomMargin: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginRight: 34
    },
    textResultsBlockchainNode: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginRight: 34
    },
    textResultsVerificationInstruction: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginRight: 34
    },
    textResultsChecksWithBottomMargin: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginRight: 34,
        marginBottom: 10
    },
    textResultsChecksWithTopAndBottomMargin: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginRight: 34,
        marginTop: 10,
        marginBottom: 10
    },
    textResultsChecksWithLargeBottomMargin: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginRight: 34,
        marginBottom: 24
    },
    textResultsNodeIpValue: {
        color: '#000000',
        // fontFamily: 'InputMono-Regular',
        fontFamily: 'RobotoMono-Regular',
        fontSize: scale(16),
        lineHeight: scale(28),
        marginBottom: scale(8),
        textDecorationLine: 'underline',
        textDecorationStyle: 'dotted',
        textDecorationColor: '#979797'
    },

})

export default textStyles;
