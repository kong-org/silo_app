import { Dimensions, Platform, StyleSheet } from 'react-native';
var {height, width} = Dimensions.get('screen');
function scale(size) { return Math.floor(size * (height / 812) ** 0.5)}


const viewStyles = StyleSheet.create({

    // First launch.
    viewFirstLaunchVideo: {
        backgroundColor: '#000000',
        height: height,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewFirstLaunchOverlayImage: {
        alignItems: 'center',
        marginTop: 30
    },
    viewFirstLaunchOverlay: {
        position: 'absolute',
        height: 0.9 * height,
        paddingBottom: Platform.OS == 'ios' ? 0 : 0.10 * height,
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    // Home.
    viewHome: {
        backgroundColor: '#000000',
        flex: 1,
        height: height,
        width: width,
        justifyContent: 'space-between',
    },
    viewHomeTop: {
        height: 0.5 * height,
        width: width,    
    },
    viewHomeTopLeftCorner: {
        width: 0.25 * width,
        marginTop: 56,
        marginLeft: 34
    },    
    viewHomeTopImage: {
        
    },
    viewHomeBottom: {       
        height: 0.5 * height,
        justifyContent: 'flex-end',
        paddingBottom: Platform.OS == 'android' ? 80 : 0,
        marginLeft: 34,
        marginRight: 34
    },
    viewHomeHoldScan: {
        borderTopWidth: 1,
        borderTopColor: '#CECECE',
        paddingTop: 0.03 * height,
        paddingBottom: 0.03 * height,
        alignItems: 'center',
        justifyContent: 'center'    
    },

    // Processing.
    viewProcessingResults: {
        flex: Platform.OS == 'ios' ? 0.45 : 1,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewProcessingBottom: {
        position: 'absolute',
        bottom: 0.05 * height,
        justifyContent: 'space-between'
    },

    // Fail.
    viewFail: {
        height: height
    },
    viewFailTop: {
        width: width,
        height: Platform.OS == 'ios' && (height == 812 || height == 896) ? 88 : 64,
        alignItems: 'flex-start',
        marginLeft: 34,
        marginRight: 34
    },
    viewFailTopBackLinks: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    viewFailTopSeparator: {
        borderTopColor: '#464646',
        borderTopWidth: 1,
        marginTop: 26,
        marginLeft: 34,
        marginRight: 34
    },
    viewFailMiddle: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 34,
        marginRight: 34
    },
    viewFailBottom: {
        justifyContent: 'flex-end',
        marginBottom: Platform.OS == 'android' ? 80 : 40,
        marginLeft: 34
    },

    // Results.
    viewResultsTop: {
        width: width,
        height: Platform.OS == 'ios' && (height == 812 || height == 896) ? 88 : 64,
        alignItems: 'flex-start',
        marginLeft: 34,
        marginRight: 34
    },
    viewResultsTopBackLinks: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    viewResultsTopSeparator: {
        borderTopColor: '#464646',
        borderTopWidth: 1,
        marginTop: 26,
        marginLeft: 34,
        marginRight: 34
    },
    viewResultsScrollViewTop: {
        alignItems: 'flex-start',
        height: 1/2 * height - (Platform.OS == 'ios' && (height == 812 || height == 896) ? 88 : 64) - 26,
        justifyContent: 'center'
    },
    viewResultsScrollViewBottom: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    },
    viewResultsSummary: {
        height: 1/2 * height,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        marginLeft: 34,
        marginTop: 34
    },
    viewResultsListDoubleRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 34,
    },
    viewResultsListDoubleRowMarginBottom: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 34,
        marginBottom: 10
    },
    viewResultsListLastRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginRight: 34,
        marginBottom: 34 + (Platform.OS == 'android' ? 90 : 0)
    },
    viewResultsLongList: {
        marginTop: - (Platform.OS == 'android' ? 100 : 0),
        marginLeft: 34
    },
    viewResultsLongListUnregistered: {
        flex: 1,
        flexDirection: 'column',
        //alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginLeft: 34,
        //marginRight: 34,
        marginTop: - (Platform.OS == 'android' ? 86 : 0),
        marginBottom: 34 + (Platform.OS == 'android' ? 80 : 0)
        //height: height - (Platform.OS == 'ios' && (height == 812 || height == 896) ? 88 : 64) - (Platform.OS == 'android' ? 86 : 0),
    },
    viewResultsBorder: {
        borderTopColor: '#CECECE',
        borderTopWidth: 1,
        marginTop: 20,
        marginBottom: 20
    },
     viewResultsListImage: {
        alignItems: 'flex-end',
        paddingBottom: 15
    },

    // FAQ.
    viewGradientFAQ: {
        flex: 1,
        height: height
    },
    viewFAQ: {
        flex: 1,
        flexDirection: 'column',
        textAlign: 'left',
        marginBottom: 34
    },
    viewFAQContentContainers: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    },
    viewFAQBorder: {
        borderTopColor: '#CECECE',
        borderTopWidth: 1,
        marginTop: 20,
        marginBottom: 20
    },
    viewFAQTopLeftCorner: {
        marginTop: 56,
        marginBottom: 14,
        marginLeft: 34,
        marginRight: 34
    },
    viewFAQDescription: {
        marginLeft: 34,
        marginRight: 34
    },

    // Info.
    viewInfoTopBar: {
        marginTop: 56,
        marginLeft: 34,
        marginBottom: 14
    },

    // Settings.
    viewGradientSettings: {
        flex: 1,
        height: height
    },
    viewSettings: {
        flex: 1,
        flexDirection: 'column',
        textAlign: 'left'
    },
    viewSettingsContentContainers: {
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingBottom: Platform.OS == 'android' ? 80 : 80
    },
    viewSettingsBorder: {
        borderTopColor: '#CECECE',
        borderTopWidth: 1,
        marginTop: 20,
        marginBottom: 20
    },
    viewSettingsBody: {
        marginLeft: 34,
        marginRight: 34
    },
    viewSettingsTopLeftCorner: {
        marginTop: 56,
        marginBottom: 14,
        marginLeft: 34,
        marginRight: 34
    },
    viewSettingsRows: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: -20,
        marginBottom: -20,
    },
    viewSettingsSwitchRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -20,
        marginBottom: 0,
    },
    viewSettingsRowText: {
        width: 0.95 * width - 2 * 34
    },

})

export default viewStyles;
