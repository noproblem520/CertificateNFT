let Web3 = require('web3');
// let abi = require('./compile_code.json')
let compile_code = require('../public/build/credit_hours.json');

// HTTP provider
// const w3 = new Web3(new Web3.providers.HttpProvider( "http://192.168.88.129:23001"));

// Ganache
const w3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

// my_address = "0x33D4b0D202644f9aeD408E006aD57516006a1fB5";
// private_key = "1ffc3d69356175a4b20c16d99f945fc0bc8b125b441014907508567e6b10f3b8";

// Ganache
my_address = "0x078bA65c45cA69A5e6f86A4e1e471eab974972Fd";
private_key = "ed8dd95aa184241ebaf244810ac20c7ed63a059683776a8422232ed8ba24683f";

function NFT1_smartContract() {
    // return new w3.eth.Contract(compile_code["abi"], '0x25712d964eD1CcEd4019AdE0Dc6cd10fe717aF63');
    // Ganache
    return new w3.eth.Contract(compile_code["abi"], '0x50c566129A7D37602C52509fe5fAD8C9BA099350');
}


function deploySmartContract(_baseURI) {
    var myContract = new w3.eth.Contract(compile_code["abi"], {
        from: myContract,
    });

    var deployData = myContract.deploy({
        arguments: [_baseURI],
        data: compile_code["bytecode"]
    }).encodeABI();


    var tx = {
        gas: 0,
        gasLimit: 6721975,
        data: deployData
    }

    w3.eth.accounts.signTransaction(tx, private_key).then(signed => {
        w3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    });

}


function easyDeploy() {

}



deploySmartContract("ganacheTest/")

// deploySmartContract("ganacheTest/");
// w3.eth.getBalance(my_address).then(console.log);




async function mintAndTransfer(to, callback) {

    let nonce = await w3.eth.getTransactionCount(my_address)
    console.log(nonce)
    let contract = NFT1_smartContract();
    let data = await contract.methods.mintSamMeta(to).encodeABI();
    let tokenID = 0;
    var tx = await w3.eth.accounts.signTransaction({
        from: my_address,
        to: contract.options.address,
        gas: '500000',
        gasPrice: '0',
        nonce: nonce,
        value: '0x0',
        data: data
    }, private_key);

    await w3.eth.sendSignedTransaction(tx.rawTransaction).on('transactionHash', console.log);
    await contract.methods.totalSupply().call({ from: my_address }, (err, result) => {
        tokenID = result;
    })
    callback("Done! tokenID '" + tokenID + "' send to '" + to + "'");

};


function tokenOwner(tokenID, callback) {
    let contract = NFT1_smartContract();

    contract.methods.ownerOf(tokenID).call({ from: my_address }, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(result);
        }
    });
};



module.exports = {
    deploy: function (tokenURI, callback) {
        deploySmartContract(tokenURI);
    },
    mint: function (to, callback) {
        mintAndTransfer(to, callback);
    },
    ownerOf: function (tokenID, callback) {
        tokenOwner(tokenID, callback);
    },
    getTotalSupply: (callback) => {
        let contract = NFT1_smartContract();
        contract.methods.totalSupply().call({ from: my_address }, (err, result) => {

            callback(result);
        })
    }
}

// console.log(w3.eth.getBalance(my_address).then(result => console.log(result)));