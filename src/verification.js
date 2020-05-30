//
// Authored by KONG.
//

import helpers from './helpers.js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import knownValues from '../assets/data/knownValues.js';
knownTokens = knownValues['knownTokens'];
knownContractVersions = knownValues['knownContractVersions'];

var crypto = require('crypto');


const verification = {

    _verifyERC20: async function() {

        console.log(this.state.blockchainData);

        // Arrays for results.
        var verificationResults = [];

        /*****************************
         * Shorthand variable names. *
         ****************************/

        var tokenName = this.state.blockchainData.tokenName;
        var tokenSymbol = this.state.blockchainData.tokenSymbol;

        var contractCode = this.state.blockchainData.contractCode;
        var contractVersion = this.state.blockchainData.contractVersion;
        var contractType = this.state.blockchainData.contractType;
        var contractState = this.state.blockchainData.contractState;
        var contractRegistered = this.state.blockchainData.contractRegistered;
        var contractVerifierAddress = this.state.blockchainData.contractVerifierAddress;
        var contractReleaseTimestamp = this.state.blockchainData.contractReleaseTimestamp;

        var scaledERC20Balance = this.state.blockchainData.scaledERC20Balance;
        var unscaledERC20Balance = this.state.blockchainData.unscaledERC20Balance;
        var expectedUnscaledERC20Balance = this.state.blockchainData.expectedUnscaledERC20Balance;

        //var ERC20IncomingTransfer = this.state.blockchainData.ERC20IncomingTransfer;
        //var ERC20OutgoingTransfer = this.state.blockchainData.ERC20OutgoingTransfer;

        /**************************
         * Smart Contract Checks. *
         *************************/

        // Contract code.
        var versionInfo = knownContractVersions[contractVersion];
        var contractVersionCheck = versionInfo != undefined;

        verificationResults.push({
            key: 'contractVersionCheck',
            type: 'contracts',
            status: `${contractVersionCheck ? 'pass': 'fail'}`,
            descriptionShort: `Ownership contract ${contractVersionCheck ? 'verified': 'not verified'}.`
        });

        // Elliptic contract address.
        var ellipticCurveContractCheck = contractVerifierAddress.toUpperCase() == versionInfo.expectedECCAddress.toUpperCase();

        verificationResults.push({
            key: 'ellipticAddressCheck',
            type: 'contracts',
            status: `${ellipticCurveContractCheck ? 'pass': 'fail'}`,
            descriptionShort: `ECC contract ${ellipticCurveContractCheck ? 'verified': 'not verified'}.`
        });

        /******************************
         * Balance and timing checks. *
         *****************************/

        if ((expectedUnscaledERC20Balance <= unscaledERC20Balance) && (unscaledERC20Balance > 0)) {

            verificationResults.push({
                key: 'erc20BalanceCheck',
                type: 'value',
                status: 'pass',
                descriptionShort: `Token ownership verified.`
            });

        } else if (expectedUnscaledERC20Balance > unscaledERC20Balance) {

            var balanceCheck = false;
            verificationResults.push({
                key: 'erc20BalanceCheck',
                type: 'value',
                status: 'fail',
                descriptionShort: `Tokens owned too low ${unscaledERC20Balance} (exp. ${expectedUnscaledERC20Balance / (tokenName == 'Kong' ? (10 ** 18) : 1)}) ${tokenName}.`
            });

        } else if ((unscaledERC20Balance == 0)) {//&& (ERC20IncomingTransfer == false)) {

            var balanceCheck = false;
            verificationResults.push({
                key: 'erc20BalanceCheck',
                type: 'value',
                status: 'fail',
                descriptionShort: `Contract has not been charged with ${tokenName} tokens yet.`
            });

        }
//        else if ((unscaledERC20Balance == 0) && (ERC20IncomingTransfer == true) && (ERC20OutgoingTransfer == true)) {
//
//            var balanceCheck = false;
//            verificationResults.push({
//                key: 'erc20BalanceCheck',
//                type: 'value',
//                status: 'fail',
//                descriptionShort: `${tokenName} tokens have been claimed.`
//            });
//
//        }

        // Timing.
        var timeToUnlock = contractReleaseTimestamp - Math.floor(Date.now() / 1000);
        var contractIsLocked = contractReleaseTimestamp > Math.floor(Date.now() / 1000);
        var contractIsUnlocked = contractReleaseTimestamp <= Math.floor(Date.now() / 1000);

        // String date.
        var releaseTimeStamp = new Date(contractReleaseTimestamp * 1000);
        var releaseTimeStampFormatted = (releaseTimeStamp.getMonth() + 1) + '/' + releaseTimeStamp.getDate() + '/' + releaseTimeStamp.getFullYear();

        // Contract is locked.
        if ((timeToUnlock > 7 * 24 * 60 * 60) && contractIsLocked) {

            verificationResults.push({
                key: 'timeCheck',
                type: 'value',
                status: 'pass',
                descriptionShort: `Token lock verified.`
            });

        }

        // Contract is close to unlocking.
        if ((timeToUnlock <= 7 * 24 * 60 * 60) && (contractIsLocked)) {

            verificationResults.push({
                key: 'timeCheck',
                type: 'value',
                status: 'warning',
                descriptionShort: `Tokens become transferable on ${releaseTimeStampFormatted}.`
            });

        }

        // Contract is unlocked.
        if (contractIsUnlocked) {

            verificationResults.push({
                key: 'timeCheck',
                type: 'value',
                status: 'warning',
                descriptionShort: `Tokens are transferable.`
            });

        }

        /**************************
        * Hardware verification. *
        **************************/

        // External signature.
        var validExternalSignature = this._verifySignature(
            this.state.nfcData.nfcReadOutputCombinedHash,
            this.state.nfcData.nfcReadInfoPrimaryPublicKey,
            this.state.nfcData.nfcReadOutputExternalSignature
        );

        if (this.state.blockchainData.signedBlockValid) {
            var signedBlockDate = new Date(this.state.blockchainData.signedBlockTime * 1000);
            var signedBlockDateFormatted = signedBlockDate.toLocaleDateString("en-US");
            console.log(`GOT BLOCK DATE: ${signedBlockDate} formatted ${signedBlockDateFormatted}`);
        };

        if (this.state.fullVerification) {

            var inputOutputCheck = (
                (this.state.nfcData.nfcReadOutputExternalRandomNumber == this.state.nfcData.nfcWrittenInputExternalRandomNumber) &&
                (this.state.nfcData.nfcReadOutputBlockhash == this.state.nfcData.nfcWrittenInputBlockhash) &&
                (this.state.nfcData.nfcReadOutputCombinedHash == this.state.nfcData.nfcWrittenInputCombinedHash)
            );

            verificationResults.push({
                key: 'challenge_integrity',
                type: 'hardware',
                status: inputOutputCheck ? 'pass' : 'fail',
                descriptionShort: inputOutputCheck ? `Challenge input verified.` : 'Challenge input != output.'
            });

            verificationResults.push({
                key: 'external_signature',
                type: 'hardware',
                status: validExternalSignature ? 'pass' : 'fail',
                descriptionShort: validExternalSignature ? `Valid external signature.` : 'Invalid external signature.'
            });

        } else {

            var inputOutputCheck = (
                (this.state.nfcData.nfcReadOutputExternalRandomNumber == this.state.nfcData.nfcReadInputExternalRandomNumber) &&
                (this.state.nfcData.nfcReadOutputBlockhash == this.state.nfcData.nfcReadInputBlockhash) &&
                (this.state.nfcData.nfcReadOutputCombinedHash == this.state.nfcData.nfcReadInputCombinedHash)
            );

            verificationResults.push({
                key: 'external_signature',
                type: 'hardware',
                status: validExternalSignature ? 'impossible' : 'fail',
                descriptionShort: validExternalSignature ? `Found valid block signature (block date: ${signedBlockDateFormatted}).` : 'Invalid block signature.'
            });

        }

        /**********************
         * Summarize results. *
         *********************/

        // Value.
        var verificationResultsValue = verificationResults.filter(item => item.type == 'value');
        var verificationResultValue = (
            verificationResultsValue.filter(item => item.status == 'fail').length == 0 &&
            verificationResultsValue.filter(item => item.status == 'pass').length > 0
        ) ? 'pass' : 'fail';

        // Contracts.
        var verificationResultsContracts = verificationResults.filter(item => item.type == 'contracts');
        var verificationResultContracts = (
            verificationResultsContracts.filter(item => item.status == 'fail').length == 0 &&
            verificationResultsContracts.filter(item => item.status == 'pass').length > 0
        ) ? 'pass' : 'fail';

        // Hardware.
        var verificationResultsHardware = verificationResults.filter(item => item.type == 'hardware');

        if (
            verificationResultsHardware.filter(item => item.status == 'fail').length > 0
        ) {
            var verificationResultHardware = 'fail';
        } else if (
            verificationResultsHardware.filter(item => item.status == 'impossible').length == 0 &&
            verificationResultsHardware.filter(item => item.status == 'pass').length > 0
        ) {
            var verificationResultHardware = 'pass';
        } else if (
            verificationResultsHardware.filter(item => item.status == 'impossible').length > 0 &&
            verificationResultsHardware.filter(item => item.status == 'pass').length >= 0
        ) {
            var verificationResultHardware = 'impossible';
        };

        // Overall result.
        var verificationResult = (
            verificationResults.filter(item => item.status == 'fail').length == 0 &&
            verificationResults.filter(item => item.status == 'impossible').length >= 0 &&
            verificationResults.filter(item => item.status == 'pass').length > 0
        ) ? 'pass' : 'fail';

        // Set verification status.
        var verificationData = Object.assign({}, this.state.verificationData, {
            verificationResults: verificationResults,
            verificationResultsValue: verificationResultsValue,
            verificationResultsHardware: verificationResultsHardware,
            verificationResultsContracts: verificationResultsContracts,

            verificationResult: verificationResult,
            verificationResultValue: verificationResultValue,
            verificationResultHardware: verificationResultHardware,
            verificationResultContracts: verificationResultContracts
        });

        this.setState((prevState) => ({verificationData}));

        console.log('VERIFICATION RESULT');
        console.log(verificationData);

        this._goToScreen('atResult', '');

    },
    _verifyUnknownDevice: async function() {

        // Arrays for results.
        var verificationResults = [];

        /**************************
        * Hardware verification. *
        **************************/

        // External signature.
        var validExternalSignature = this._verifySignature(
            this.state.nfcData.nfcReadOutputCombinedHash,
            this.state.nfcData.nfcReadInfoPrimaryPublicKey,
            this.state.nfcData.nfcReadOutputExternalSignature
        );

        if (this.state.blockchainData.signedBlockValid) {
            var signedBlockDate = new Date(this.state.blockchainData.signedBlockTime * 1000);
            var signedBlockDateFormatted = signedBlockDate.toLocaleDateString("en-US");
            console.log(`GOT BLOCK DATE: ${signedBlockDate} formatted ${signedBlockDateFormatted}`);
        };

        if (this.state.fullVerification) {

            var inputOutputCheck = (
                (this.state.nfcData.nfcReadOutputExternalRandomNumber == this.state.nfcData.nfcWrittenInputExternalRandomNumber) &&
                (this.state.nfcData.nfcReadOutputBlockhash == this.state.nfcData.nfcWrittenInputBlockhash) &&
                (this.state.nfcData.nfcReadOutputCombinedHash == this.state.nfcData.nfcWrittenInputCombinedHash)
            );

            verificationResults.push({
                key: 'challenge_integrity',
                type: 'hardware',
                status: inputOutputCheck ? 'pass' : 'fail',
                descriptionShort: inputOutputCheck ? `Challenge input verified.` : 'Challenge input != output.'
            });

            // TODO: adapt to full quick verifiy
            verificationResults.push({
                key: 'external_signature',
                type: 'hardware',
                status: validExternalSignature ? 'pass' : 'fail',
                descriptionShort: validExternalSignature ? `Valid external signature.` : 'Invalid external signature.'
            });

        } else {

            var inputOutputCheck = (
                (this.state.nfcData.nfcReadOutputExternalRandomNumber == this.state.nfcData.nfcReadInputExternalRandomNumber) &&
                (this.state.nfcData.nfcReadOutputBlockhash == this.state.nfcData.nfcReadInputBlockhash) &&
                (this.state.nfcData.nfcReadOutputCombinedHash == this.state.nfcData.nfcReadInputCombinedHash)
            );

            verificationResults.push({
                key: 'external_signature',
                type: 'hardware',
                status: validExternalSignature ? 'impossible' : 'fail',
                descriptionShort: validExternalSignature ? `Found valid block signature (block date: ${signedBlockDateFormatted}).` : 'Invalid block signature.'
            });

        }

        /**********************
         * Summarize results. *
         *********************/

        // Hardware.
        var verificationResultsHardware = verificationResults.filter(item => item.type == 'hardware');

        if (
            verificationResultsHardware.filter(item => item.status == 'fail').length > 0
        ) {
            var verificationResultHardware = 'fail';
        } else if (
            verificationResultsHardware.filter(item => item.status == 'impossible').length == 0 &&
            verificationResultsHardware.filter(item => item.status == 'pass').length > 0
        ) {
            var verificationResultHardware = 'pass';
        } else if (
            verificationResultsHardware.filter(item => item.status == 'impossible').length > 0 &&
            verificationResultsHardware.filter(item => item.status == 'pass').length >= 0
        ) {
            var verificationResultHardware = 'impossible';
        };

        // Overall result.
        var verificationResult = (
            verificationResults.filter(item => item.status == 'fail').length == 0 &&
            verificationResults.filter(item => item.status == 'impossible').length >= 0 &&
            verificationResults.filter(item => item.status == 'pass').length > 0
        ) ? 'pass' : 'fail';

        // Set verification status.
        var verificationData = Object.assign({}, this.state.verificationData, {
            verificationResults: verificationResults,
            verificationResultsHardware: verificationResultsHardware,

            verificationResult: verificationResult,
            verificationResultHardware: verificationResultHardware
        });

        this.setState((prevState) => ({verificationData}));

        console.log('VERIFICATION RESULT (UNKNOWN DEVICE)');
        console.log(verificationData);

        this._goToScreen('atResult', '');

    },
    _verifySignature: function(msgHash, publicKeyLong, signatureLong) {

        console.log(`BEGIN SIGNATURE VERIFICATION (in ms): ${Date.now()}`)

        // Return false if format of variables is unexpected.
        if (msgHash.length != 66 && msgHash.length != 64) {return false};
        if (signatureLong.length != 128) {return false};
        if (publicKeyLong.length != 130 && publicKeyLong.length != 128) {return false};

        // Remove leading '0x' in msgHash.
        if (msgHash.length == 66 && msgHash.slice(0, 2) == '0x') {
            msgHash = msgHash.slice(2);
        };

        // Remove leading '04' in publicKey.
        if (publicKeyLong.length == 130 && publicKeyLong.slice(0, 2) == '04') {
            publicKeyLong = publicKeyLong.slice(2);
        };

        // Reformat key and signature so elliptic package can handle them.
        var pub = {
            x: publicKeyLong.slice(0, publicKeyLong.length/2),
            y: publicKeyLong.slice(publicKeyLong.length/2)
        };
        var key = this.state.curveData.curveP256.keyFromPublic(pub, 'hex');

        // Reformat signature to one of several acceptable formats: {r :r , s: s}
        var signature = {
            r: signatureLong.slice(0, signatureLong.length/2),
            s: signatureLong.slice(signatureLong.length/2)
        };

        // Verify.
        var verified = key.verify(msgHash, signature);
        console.log(`END SIGNATURE VERIFICATION (in ms): ${Date.now()}`)

        return verified;
    },

}

  export default verification;
