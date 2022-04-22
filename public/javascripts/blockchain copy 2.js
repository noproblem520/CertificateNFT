let accounts = null;
let compile_code = null;
let w3 = null;
window.onload = async function() {
    if (typeof web3 !== 'undefined') {
        w3 = new Web3(web3.currentProvider);
    } else {
        w3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
    }
   
    // $.get('/build/credit_hours.json').then((result)=>{
    //     compile_code = result;
    // });
    // accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    // if(accounts[0] != null){
    //     document.querySelector('.showAccount').innerHTML = accounts[0];
    // }
}



function NFT1_smartContract(contractAddress){
    // return new w3.eth.Contract(compile_code["abi"], '0xa6AC7C69163935A6DEBd909b8c8376f18cEa79Ba');
    return new w3.eth.Contract(compile_code["abi"], contractAddress);
}

function changeContractABI(contractName){
    
    return new Promise((resolve,reject)=>{
        $.get('/build/'+ contractName +'.json').then((result)=>{
            // return new w3.eth.Contract(result["abi"], contractAddress);
            compile_code = result;
            resolve(result);
        });
    })
    
}

function makefile(baseURI, tokenID, to, type){
    $.ajax({
        method:"POST",
        url : "/nfts/makefile",
        data : {baseURI, tokenID, to, type}
    });
}


function makefolder(baseURI){
    $.ajax({
        method:"POST",
        url : "/nfts/makefolder",
        data : {baseURI}
    });
}


async function getBalanceOfEach721(address, length, _self){
    
    if(_self){
        $("#self_NFT721").children().remove();
    }else{
        $("#NFT721").children().remove();
    }
    

    let jsdiv_nft="";

    for(let i=0;i<length;i++){
        
        
        let fileName = $("#erc721fileName_" + i).text();
        let contractAddress = $("#erc721Addr_" + i).text();

        await changeContractABI(fileName);

        let contract = NFT1_smartContract(contractAddress);

        let amount = await contract.methods.balanceOf(address).call({from:accounts[0]}, function(err, result){
            return result;
        });
        
        
        if(amount > 0){
            let tokenID = -1;
            
            tokenID = await contract.methods.tokenOfOwnerByIndex(address, 0).call({from:accounts[0]}, function(err, result){
                return result;
            });
            let link = "";
            // await contract.methods.tokenURI(tokenID).call({from:accounts[0]}, async function(err, result){
            //     link = "http://localhost:3000/" + result;
            // });

            link = "http://localhost:3000/" + 
            await contract.methods.tokenURI(tokenID).call({from:accounts[0]});

            
            let tokenJson = await getNFT(link);
            jsdiv_nft += "<div class='nftdiv'>";
            jsdiv_nft += "<img style='padding:15px;width:250px;height:300px' class='fit-picture' src='" + tokenJson.properties.image.URL + "'></img>";
            jsdiv_nft += "<div style='margin-top:20px'>";
            jsdiv_nft += "<div>title : " + tokenJson.title + "</div>";
            jsdiv_nft += "<div>owner : " + tokenJson.owner + "</div>";
            jsdiv_nft += "<a href='" + link+ "' target='_blank'>" + link + "</a>"
            // jsdiv_nft += "<div>" + test.properties.image.URL + "</div>";
            jsdiv_nft += "</div>";
            jsdiv_nft += "</div>";
        }
    }

    
    

    if(_self){
        $("#self_NFT721").append(jsdiv_nft);
    }else{
        $("#NFT721").append(jsdiv_nft);
    }
    
}



async function getNFT(link){
    // return new Promise((resolve, reject)=>{
    let result = null;
    await $.get(link).then((res)=>{
        result = res;
    });
    // })
    return result;
}


async function mintNFT(tokenID){

    await changeContractABI("credit_hours");
    let contract = NFT1_smartContract("0xa6AC7C69163935A6DEBd909b8c8376f18cEa79Ba");
    let baseURI = "";
    let NFTTokenID = 0;
    await contract.methods.creditsToNFT(tokenID).send({from:accounts[0]});

    let fileName = $("#erc721fileName_" + tokenID).text();
    let contractAddress = $("#erc721Addr_" + tokenID).text();

    await changeContractABI(fileName);

    contract = NFT1_smartContract(contractAddress);

    await contract.methods.baseURI().call({from:accounts[0]}, (err, result)=>{
        baseURI = result ;
    });
    await contract.methods.totalSupply().call({from:accounts[0]}, (err, result)=>{
        NFTTokenID = parseInt(result) -1 ;
    });

    makefile(baseURI, NFTTokenID, accounts[0],fileName);
    
    window.location.reload();
}


async function getBalanceOfBatch(address, length, _self){

    let fileName = "credit_hours";
    let contractAddress = "0xa6AC7C69163935A6DEBd909b8c8376f18cEa79Ba";

    await changeContractABI(fileName);


    let contract = NFT1_smartContract(contractAddress);
    let arrAddr = [];
    let arrTokenID = []
    for(let i=0; i<length; i++){
        arrAddr.push(address);
        arrTokenID.push(i);
    }

    contract.methods.balanceOfBatch(arrAddr,arrTokenID).call({from:accounts[0]}, function(err, result){
        for(let i=0; i<length; i++){
            if(_self){
                $("#self_hours" + i).text(result[i]);
            }else{
                $("#hours" + i).text(result[i]);
            }
            
        }
    });
}


// function getAddrInfo2(address, erc1155length, erc721length){
//     getBalanceOfBatch(address, erc1155length, false);
//     getBalanceOfEach721_demo(address, erc721length, false);
// }

// function getAddrInfo(erc1155length, erc721length){
//     getBalanceOfBatch(accounts[0], erc1155length, true);
//     getBalanceOfEach721(accounts[0], erc721length, true);
// }
