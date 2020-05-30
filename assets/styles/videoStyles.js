
import { Dimensions, StyleSheet } from 'react-native';
var {height, width} = Dimensions.get('screen');


const videoStyles = StyleSheet.create({

    // First launch.
    videoFirstLaunch: {
        height: 1.25 * height,
        width: 1.25 * width
    }

})

export default videoStyles;
