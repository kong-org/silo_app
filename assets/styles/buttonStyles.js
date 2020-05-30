import { Dimensions, StyleSheet } from 'react-native';
var {height, width} = Dimensions.get('window');
function scale(size) { return Math.floor(size * (height / 812) ** 0.5)}

const buttonStyles = StyleSheet.create({

    buttonNoNfc: {
        backgroundColor: '#000000',
        height: 62,
        marginBottom: 34,
        width: width - 2 * 34
    },
    buttonScan: {
        backgroundColor: '#000000',
        height: 62,
        marginBottom: 34,
        width: width - 2 * 34
    },
    buttonGetStarted: {
        backgroundColor: '#FFFFFF',
        height: 62,
        width: width - 2 * 34
    },
    buttonRetry: {
        backgroundColor: '#FFFFFF',
        height: 62,
        width: width - 2 * 34
    },
    buttonPlay: {
        position: "absolute",
        left: 100,
        top: 100
    },
    switchVerificationType: {
    }

})

export default buttonStyles;
