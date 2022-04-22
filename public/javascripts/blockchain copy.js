
let my_address = "0x078bA65c45cA69A5e6f86A4e1e471eab974972Fd";
let private_key = "ed8dd95aa184241ebaf244810ac20c7ed63a059683776a8422232ed8ba24683f";



let compile_code = null;
let w3 = null;

w3 = new Web3(new Web3.providers.HttpProvider("http://140.118.9.225:23001"));



function NFT1_smartContract(contractAddr){
    return new w3.eth.Contract(compile_code["abi"], contractAddr);
}

// TODO：save the contractAddress to the database
function deploySmartContract(_baseURI){

    var myContract = new w3.eth.Contract(compile_code["abi"], {
        from:myContract,
    });
    
    // encode transactions to ABI
    var deployData = myContract.deploy({
        arguments: [_baseURI],
        data : compile_code["bytecode"]
    }).encodeABI();
    
    
    var tx = {
        gas : 0,
        gasLimit : 6721975,
        data : deployData
    }
    
    w3.eth.accounts.signTransaction(tx, private_key).then (signed => {
        w3.eth.sendSignedTransaction(signed.rawTransaction).then((result)=>{
            // TODO：save the contractAddress to the database
            console.log("contractAddress is " + result.contractAddress)
        });
    });

}


async function mintAndTransfer(to){
    
    let nonce = await w3.eth.getTransactionCount(my_address)
    let contract = NFT1_smartContract("0x3024D80C182066756411af08D07cCe34e5D2526d");

    // encode transactions to ABI
    let data = await contract.methods.mintSamMeta(to).encodeABI();
    
    var tx = await w3.eth.accounts.signTransaction({
        from: my_address,
        to: contract.options.address,
        gas: '500000',
        gasPrice:'0',
        nonce: nonce,
        value: '0x0',
        data: data
    }, private_key);

    await w3.eth.sendSignedTransaction(tx.rawTransaction);
};


function getOwnerOf(tokenID){
    let contract = NFT1_smartContract("0x3024D80C182066756411af08D07cCe34e5D2526d");
    let owner = contract.methods.ownerOf(tokenID).call({from:my_address});
    return owner;
}




