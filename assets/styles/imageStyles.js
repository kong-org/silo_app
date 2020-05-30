import { Dimensions, StyleSheet } from 'react-native';
var {height, width} = Dimensions.get('window');
function scale(size) { return Math.floor(size * (height / 812) ** 0.5)}


const imageStyles = StyleSheet.create({

    imageScan: {
    },
    nfcIcon: {
    },    

})

export default imageStyles;
