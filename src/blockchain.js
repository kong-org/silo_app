//
// Authored by KONG.
//

var crypto = require('crypto');

import helpers from './helpers.js';
import hashedInterfaces from '../assets/data/hashedInterfaces.json';
import knownValues from '../assets/data/knownValues.js';
knownTokens = knownValues['knownTokens'];
knownHardwareModels = knownValues['knownHardwareModels'];
knownContractVersions = knownValues['knownContractVersions'];
knownHardwareManufacturers = knownValues['knownHardwareManufacturers'];

const blockchain = {

    _fetchChainData: function(chainDataType, chainDataVal = '0') {

        if (chainDataType == 'contractRegistration') {

            console.log('Checking registration for ' + chainDataVal);

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_call',
                        params: [{
                            to: this.state.chainSettings.registerAddress,
                            data: hashedInterfaces.getRegistrationDetails + (chainDataVal.length == 66 ? chainDataVal.slice(2) : chainDataVal)
                        }, "latest"],
                        id: 1
                    })
                }
            )
            .then((response) => response.json())
            .then((responseJson) => {

                // Only parse non-zero results.
                if (responseJson.result == '0x' || parseInt(responseJson.result, 16) == 0) {

                    var blockchainData = Object.assign({}, this.state.blockchainData, {
                        contractRegistered: false
                    });

                } else {

                    // Parse keys.
                    var contractSecondaryPublicKeyHash = '0x' + responseJson.result.slice(2, 66);
                    var contractTertiaryPublicKeyHash = '0x' + responseJson.result.slice(66, 130);

                    // Parse contract address
                    var contractAddress = '0x' + responseJson.result.slice(154, 194); // Skipping the leading 0s.

                    // Parse hardware info.
                    var hardwareManufacturer = '0x' + responseJson.result.slice(194, 258);
                    var hardwareModel = '0x' + responseJson.result.slice(258, 322);
                    var hardwareSerial = '0x' + responseJson.result.slice(322, 386);
                    var hardwareConfig = '0x' + responseJson.result.slice(386, 450);

                    // Get machine-readable version of hardware info.
                    hardwareManufacturer = knownHardwareManufacturers[hardwareManufacturer] ? knownHardwareManufacturers[hardwareManufacturer]: 'Unknown hardware manufacturer.';
                    hardwareModel = knownHardwareModels[hardwareModel] ? knownHardwareModels[hardwareModel]: 'Unknown hardware model.';

                    // Parse token amount.
                    var expectedUnscaledERC20Balance = parseInt('0x' + responseJson.result.slice(450, 514));
                    var registeredMintable = '0x' + responseJson.result.slice(514, 578);

                    // Update state.
                    var blockchainData = Object.assign({}, this.state.blockchainData, {
                        contractSecondaryPublicKeyHash: contractSecondaryPublicKeyHash,
                        contractAddress: contractAddress,
                        hardwareManufacturer: hardwareManufacturer,
                        hardwareModel: hardwareModel,
                        hardwareSerial: hardwareSerial,
                        hardwareConfig: hardwareConfig,
                        contractRegistered: true,
                        expectedUnscaledERC20Balance: expectedUnscaledERC20Balance,
                        registeredMintable: registeredMintable
                    });

                }

                console.log('BLOCKCHAIN DATA AFTER REGISTRATION CHECK');
                console.log(blockchainData);

                this.setState((prevState) => ({blockchainData}));

            })

        } else if (chainDataType == 'contractState') {

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_call',
                        params: [{
                            to: this.state.blockchainData.contractAddress,
                            data: hashedInterfaces.getContractState
                        }, "latest"],
                        id: 1
                    })
                }
            )
            .then(response => response.json())
            .then(responseJson => {

                // Get registered token address.
                var contractERC20Address = ('0x' + responseJson.result.slice(282, 322));

                // Get token information.
                var tokenSymbol = knownTokens[contractERC20Address] ? knownTokens[contractERC20Address].symbol : '-';
                var tokenName = knownTokens[contractERC20Address] ? knownTokens[contractERC20Address].name : 'Unknown Token';

                // Adjust state.
                var newData = {
                    contractPublicKeyX: responseJson.result.slice(0, 66),
                    contractPublicKeyY: '0x' + responseJson.result.slice(66, 130),
                    contractVerifierAddress: '0x' + responseJson.result.slice(154, 194),
                    contractReleaseTimestamp: parseInt(responseJson.result.slice(194, 258), 16),
                    contractERC20Address: contractERC20Address,
                    tokenSymbol: tokenSymbol,
                    tokenName: tokenName,

                    contractState: true
                };
                var blockchainData = Object.assign({}, this.state.blockchainData, newData);
                this.setState((prevState) => ({blockchainData}));

                console.log('NEW BLOCKCHAIN DATA FROM STATE CHECK');
                console.log(newData);

            })

        } else if (chainDataType == 'contractCode') {

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_getCode',
                        params: [this.state.blockchainData.contractAddress, "latest"],
                        id: 1
                    })
                }
            )
            .then(response => response.json())
            .then(responseJson => {

                // Get version info as hash of code.
                var contractVersion = '0x' + crypto.createHash('sha256').update(responseJson.result.slice(2), 'hex').digest('hex');

                // Get version information.
                var contractType = knownContractVersions[contractVersion].type ? knownContractVersions[contractVersion].type: 'Unknown Contract Type';

                var newData = {
                    contractCode: responseJson.result,
                    contractVersion: contractVersion,
                    contractType: contractType
                };

                // Update state.
                var blockchainData = Object.assign({}, this.state.blockchainData, newData);
                this.setState((prevState) => ({blockchainData}));

                console.log('NEW BLOCKCHAIN DATA FROM CODE CHECK');
                console.log(newData);

            })

        } else if (chainDataType == 'ERC20Balance') {

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_call',
                        params: [{
                            to: this.state.blockchainData.contractERC20Address,
                            data: hashedInterfaces.balanceOf + '0'.repeat(24) + this.state.blockchainData.contractAddress.slice(2)
                        }, "latest"],
                        id: 1
                    })
                }
            )
            .then(response => response.json())
            .then(responseJson => {

                var unscaledERC20Balance = parseInt(responseJson.result, 16);
                var decimals = knownTokens[this.state.blockchainData.contractERC20Address].decimals;

                if (decimals) {
                    var scaledERC20Balance = unscaledERC20Balance / (10 ** decimals);
                } else {
                    var scaledERC20Balance = unscaledERC20Balance;
                }

                var newData = {
                    unscaledERC20Balance: unscaledERC20Balance,
                    scaledERC20Balance: scaledERC20Balance
                };

                var blockchainData = Object.assign({}, this.state.blockchainData, newData);
                this.setState((prevState) => ({blockchainData}));

                console.log('NEW DATA FROM BALANCE CHECK');
                console.log(newData);

            })

        } else if (chainDataType == 'ERC20IncomingTransfer') {

            console.log('GETTING INCOMING TRANSFERS');

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_getLogs',
                        params: [{
                            'fromBlock': 'earliest',
                            'toBlock': 'latest',
                            'address': this.state.blockchainData.contractERC20Address,
                            'topics': [
                                hashedInterfaces.erc20Transfer,
                                null,
                                '0x' + '0'.repeat(24) + this.state.blockchainData.contractAddress.slice(2)
                            ]
                        }],
                        id: 1
                    })
                }

            )
            .then(response => response.json())
            .then(responseJson => {

                console.log('INCOMING TRANSFERS');
                console.log(responseJson);

                var blockchainData = Object.assign({}, this.state.blockchainData, {ERC20IncomingTransfer: responseJson.result.length == 1});
                this.setState((prevState) => ({blockchainData}));

            })

        } else if (chainDataType == 'ERC20OutgoingTransfer') {

            console.log('GETTING OUTGOING TRANSFERS');

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_getLogs',
                        params: [{
                            'fromBlock': 'earliest',
                            'toBlock': 'latest',
                            'address': this.state.blockchainData.contractERC20Address,
                            'topics': [
                                hashedInterfaces.erc20Transfer,
                                '0x000000000000000000000000' + this.state.blockchainData.contractAddress.slice(2),
                                null
                            ]
                        }],
                        id: 1
                    })
                }

            )
            .then(response => response.json())
            .then(responseJson => {

                console.log('OUTGOING TRANSFERS');
                console.log(responseJson);

                var blockchainData = Object.assign({}, this.state.blockchainData, {ERC20OutgoingTransfer: responseJson.result.length == 1});
                this.setState((prevState) => ({blockchainData}));

            })

        } else if (chainDataType == 'latestBlock') {

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_getBlockByNumber',
                        params: [
                            'latest',
                            true
                        ],
                        id: 1
                    })
                }
            )
            .then(response => response.json())
            .then(responseJson => {

                var blockHash = responseJson.result.hash.slice(2);
                var blockTime = parseInt(responseJson.result.timestamp, 16);

                var blockchainData = Object.assign({}, this.state.blockchainData, {
                    blockHash: blockHash,
                    blockTime: blockTime
                });
                this.setState((prevState) => ({blockchainData}));

            })

        }  else if (chainDataType == 'blockByHash') {

            var blockHash = '0x' + chainDataVal;

            return fetch(
                this.state.chainSettings.node,
                {
                    method: 'POST',
                    headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        jsonrpc: '2.0',
                        method: 'eth_getBlockByHash',
                        params: [
                            blockHash,
                            true
                        ],
                        id: 1
                    })
                }
            )
            .then(response => response.json())
            .then(responseJson => {

                let blockchainData = Object.assign({}, this.state.blockchainData, {
                    signedBlockTime: responseJson.result == null ? null : parseInt(responseJson.result.timestamp, 16),
                    signedBlockValid: responseJson.result != null
                });
                this.setState((prevState) => ({blockchainData}));

            })

        };

    }

}

export default blockchain;
