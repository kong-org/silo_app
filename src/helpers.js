//
// Authored by KONG.
//

import React from 'react';
import {Animated} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import defaultSettings from '../assets/data/defaultSettings.js';


const helpers = {

    _delay: function(t, v) {

       return new Promise(function(resolve) {
           setTimeout(resolve.bind(null, v), t)
       });

    },
    _goToScreen: function(screen, statusMessage = '') {

        console.log('Going to screen ' + screen);
        console.log('Status message: ' + statusMessage);

        this.setState({
            location: screen,
            status: statusMessage,
            scrollOffset: new Animated.Value(0)
        });

    },
    _goToFailScreen: function(warning = '', description = '') {

        this.setState({
            location: 'atFail',
            failWarning: warning,
            failDescription: description
        });

    },
    _logEvent: function (logMessage) {

        // Get timestamp.
        var timeStamp = new Date();
        var timeStampString = (
            `${timeStamp.getHours()}`.padStart(2, '0') + ":" +
            `${timeStamp.getMinutes()}`.padStart(2, '0') + ":" +
            `${timeStamp.getSeconds()}`.padStart(2, '0')
        ); //+ ":" + timeStamp.getMilliseconds();

        var loggedEvents = this.state.loggedEvents;
        loggedEvents.push([timeStampString, logMessage]);

        this.setState({
            loggedEvents: loggedEvents
        });

    },
    _bytesToHex(byteArray) {

        return Array.from(byteArray, function(byte) {

            return ('0' + (byte & 0xFF).toString(16)).slice(-2);

        }).join('')

    },
    _hexToBytes: function(hex) {

        for (var bytes = [], c = 0; c < hex.length; c += 2) {
            bytes.push(parseInt(hex.substr(c, 2), 16));
        }
        return bytes;

    },
    _hexToAscii(hex) {

        var str = '';
        for (var n = 0; n < hex.length; n += 2) {
            str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
        }
        return str;

     },
    _loadSettings: function() {

        AsyncStorage.multiGet(['node'])
        .then(stores => {

            // Get stored variables.
            var node = stores[0][1] ? stores[0][1] : defaultSettings.node;

            // Update settings.
            this.setState({chainSettings: Object.assign({}, this.state.chainSettings, {
                node: node,
                registerAddress: defaultSettings.registerAddress
            })});

        });

    },
    _loadVerificationType: function() {
        AsyncStorage.getItem('fullVerification', (err, value) => {
            this.setState({fullVerification: value == "true"});
        })
    },
    _toggleVerificationType: function(value) {
        this.setState({fullVerification: value}, () => {AsyncStorage.setItem('fullVerification', JSON.stringify(value), (res) => {})})
    },
    _resetToDefaultSettings: function() {

        var chainSettings = Object.assign({}, this.state.chainSettings, {
            node: defaultSettings.node,
            registerAddress: defaultSettings.registerAddress
        });

        this.setState({
            chainSettings
        }, () => {

            AsyncStorage.multiSet([
                ['node', defaultSettings.node],
                ['registerAddress', defaultSettings.registerAddress]
            ])

        });

    }

}

export default helpers;