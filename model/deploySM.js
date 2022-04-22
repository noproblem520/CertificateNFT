let Web3 = require('web3');
// let abi = require('./compile_code.json')
let compile_code_javaNFT = require('../public/build/javaNFT.json');
let compile_code_kotlinNFT = require('../public/build/kotlinNFT.json');
let compile_code_credit_hours = require('../public/build/credit_hours.json');


const w3 = new Web3(new Web3.providers.HttpProvider( "http://127.0.0.1:7545"));

// Ganache
my_address = "0x078bA65c45cA69A5e6f86A4e1e471eab974972Fd";
private_key = "ed8dd95aa184241ebaf244810ac20c7ed63a059683776a8422232ed8ba24683f";


// 0xa6AC7C69163935A6DEBd909b8c8376f18cEa79Ba
function deployCredits(){
    var myContract = new w3.eth.Contract(compile_code_credit_hours["abi"]);
    
    var deployData = myContract.deploy({
        data : compile_code_credit_hours["bytecode"]
    }).encodeABI();
    
    signAndSend(deployData);
    
}

// 0x945D54580ADb5D42Fa1eE9F368eE36E5f536a134
function deployJavaNFT(_baseURI, _goal, erc1155Addr){
    var myContract = new w3.eth.Contract(compile_code_javaNFT["abi"], {
        from:myContract,
    });
    
    var deployData = myContract.deploy({
        arguments: [_baseURI, _goal, erc1155Addr],
        data : compile_code_javaNFT["bytecode"]
    }).encodeABI();
    
    signAndSend(deployData);
}


// 0x129D6cE3713f2FBf07a9885F7aFF3E4fb22aecF5
function deployKotlinNFT(_baseURI, _goal, erc1155Addr){
    var myContract = new w3.eth.Contract(compile_code_kotlinNFT["abi"], {
        from:myContract,
    });
    
    var deployData = myContract.deploy({
        arguments: [_baseURI, _goal, erc1155Addr],
        data : compile_code_kotlinNFT["bytecode"]
    }).encodeABI();
    
    signAndSend(deployData);
}

function signAndSend(deployData){
    var tx = {
        gas : 0,
        gasLimit : 6721975,
        data : deployData
    }

    w3.eth.accounts.signTransaction(tx, private_key).then (signed => {
        w3.eth.sendSignedTransaction(signed.rawTransaction).then((result)=>{
            console.log(result.contractAddress);
        });
    });
}



// deployKotlinNFT("kotlinNFT/", 20, "0xa6AC7C69163935A6DEBd909b8c8376f18cEa79Ba");