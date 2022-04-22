Vue.createApp({
    data() {
        return {
            search_Addr: "",
            tokenJsonAry: [],
            erc721Ary: null,
            erc1155Ary: null,
            accounts: null,
            compile_code: null,
            w3: null,
        };
    },
    methods: {
        getBalanceOfEach721: async function (address) {
            this.tokenJsonAry = [];
            for (let i = 0; i < this.erc721Ary.length; i++) {
                let contractAddress = this.erc721Ary[i].address;
                await this.changeContractABI("certificateNFT");
                let contract = this.NFT1_smartContract(contractAddress);
                let amount = await contract.methods
                    .balanceOf(address)
                    .call({ from: this.accounts });
                if (amount > 0) {
                    let tokenID = -1;

                    tokenID = await contract.methods
                        .tokenOfOwnerByIndex(address, 0)
                        .call({ from: this.accounts });

                    let link = "";

                    link =
                        "http://localhost:3000/" +
                        (await contract.methods
                            .tokenURI(tokenID)
                            .call({ from: this.accounts }));

                    // let tokenJson = await this.getNFT(link);
                    let tokenJson = await axios.get(link).then((res) => {
                        return res.data;
                    });
                    tokenJson.link = link;
                    // check if blockchain's data is equal to json file
                    tokenJson.validity = tokenJson.owner.toLowerCase() != address.toLowerCase() ? false : true;

                    this.tokenJsonAry.push(tokenJson);
                }
            }
        },
        getAddrInfo: function (address) {
            this.getBalanceOfBatch(address.trim());
            this.getBalanceOfEach721(address.trim());
        },
        getBalanceOfBatch: async function (address) {
            let contractAddress = "0xd37c5518A2Ed510db3735a91836dd3E94E8eC3C2";
            await this.changeContractABI("credit_hours");

            let contract = this.NFT1_smartContract(contractAddress);
            let arrAddr = [];
            let arrTokenID = [];
            for (let i = 0; i < this.erc1155Ary.length; i++) {
                arrAddr.push(address);
                arrTokenID.push(i);
            }
            let learning_hourAry = await contract.methods
                .balanceOfBatch(arrAddr, arrTokenID)
                .call({ from: this.accounts });
            for (let i = 0; i < learning_hourAry.length; i++) {
                this.erc1155Ary[i].learning_hour = learning_hourAry[i];
            }
        },


        NFT1_smartContract: function (contractAddress) {
            return new w3.eth.Contract(this.compile_code["abi"], contractAddress);
        },

        changeContractABI: function (contractName) {
            return new Promise((resolve, reject) => {
                axios.get("/build/" + contractName + ".json").then((res) => {
                    // return new w3.eth.Contract(result["abi"], contractAddress);
                    this.compile_code = res.data;
                    resolve("success");
                });
            });
        },
        makefile: function (baseURI, tokenID, to, type) {
            axios.post("/nfts/makefile", { baseURI, tokenID, to, type }).then((res) => {
                console.log(res);
            });
        },

        mintNFT: async function (tokenID) {

            await this.changeContractABI("credit_hours");
            let contract = this.NFT1_smartContract(
                "0xd37c5518A2Ed510db3735a91836dd3E94E8eC3C2"
            );

            let NFTTokenID = 0;


            await contract.methods
                .creditsToNFT(tokenID)
                .send({ from: this.accounts });

            let fileName = this.erc721Ary[tokenID].fileName;
            let contractAddress = this.erc721Ary[tokenID].address;

            await this.changeContractABI("certificateNFT");
            contract = this.NFT1_smartContract(contractAddress);
            let baseURI = await contract.methods
                .baseURI()
                .call({ from: this.accounts });
            await contract.methods
                .totalSupply()
                .call({ from: this.accounts }, (err, result) => {
                    NFTTokenID = parseInt(result) - 1;
                });

            this.makefile(baseURI, NFTTokenID, this.accounts, fileName);
            window.location.reload();
        },
        emptySearch: function () {
            for (let i = 0; i < this.erc1155Ary.length; i++) {
                this.erc1155Ary[i].learning_hour = null;
            }
            this.tokenJsonAry = [];
        },
        getAccount: async function () {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            this.accounts = accounts[0];

        },
        init: async function () {
            axios.get("/build/credit_hours.json").then((res) => {
                this.compile_code = res.data;
            });
            this.getAccount();

            if (typeof web3 !== "undefined") {
                w3 = new Web3(web3.currentProvider);
            } else {
                w3 = new Web3(
                    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
                );
            }

            axios
                .get("/nfts/results1155")
                .then((res) => {
                    this.erc1155Ary = res.data;
                })
                .catch((error) => {
                    console.error(error);
                });
            axios
                .get("/nfts/results721")
                .then((res) => {
                    this.erc721Ary = res.data;
                })
                .catch((error) => {
                    console.error(error);
                });
        },
    },
    mounted() {
        this.init();
    },
}).mount("#app");
