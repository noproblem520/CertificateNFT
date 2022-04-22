Vue.createApp({
    data() {
        return {
            newTokenID: "",
            newTokenTitle: "",
            erc1155Ary: null,
            initBaseURI: "",
            initGoal: "",
            erc1155Addr: "",
            erc1155Token: "",
            Ctitle: "",
            Clevel: "",
            fileName: "",
            erc1155TokenString: "",
            erc1155TokenAry: [],
            accounts: null,
            compile_code_NFT: null,
            compile_code_credits: null,
            toAddr: "",
            tokenID: "",
            amount: "",
            w3: null,
        };
    },
    methods: {
        safeTransfer: function (to, tokenID, amount) {
            let contract = this.erc1155_smartContract();
            contract.methods
                .safeTransferFrom(this.accounts, to, tokenID, amount, "0x")
                .send({ from: this.accounts })
                .then((err, result) => {
                    window.location.reload();
                });
        },
        // hardcode
        erc1155_smartContract: function (contractAddress) {
            return new w3.eth.Contract(
                this.compile_code_credits["abi"],
                "0xd37c5518A2Ed510db3735a91836dd3E94E8eC3C2"
            );
        },

        mintNew1155Token: async function (tokenID, title) {
            let contract = this.erc1155_smartContract();
            if (tokenID != this.erc1155Ary.length) {
                alert("tokenID must be :" + this.erc1155Ary.length);
                return false;
            }
            let $vm = this;
            contract.methods
                .mint(this.accounts, tokenID, 10 ^ 18, "0x")
                .send({ from: this.accounts }).then((receipt) => {
                    $vm.insertToken(contract._address, tokenID, title);
                })

        },
        insertToken: function (erc1155Addr, tokenID, title) {
            console.log("asdasd");
            axios.post("/nftsBackend/insertERC1155Token", { "contractAddr": erc1155Addr, "tokenID": tokenID, "title": title }).then((res) => {
                if (res.data) {
                    window.location.reload();
                } else {
                    alert("something wrong");
                }
            })
        },
        deployERC1155: async function (tokenString) {

            this.erc1155TokenAry = tokenString.split(",");
            for (let i = 0; i < this.erc1155TokenAry.length; i++) {
                this.erc1155TokenAry[i] = this.erc1155TokenAry[i].trim();
            }

            var myContract = new w3.eth.Contract(
                this.compile_code_credits["abi"]
            );

            let contractAddr = await myContract
                .deploy({
                    data: this.compile_code_credits["bytecode"],
                    arguments: [this.erc1155TokenAry],
                })
                .send(
                    {
                        from: this.accounts,
                    },
                    (err) => {
                        if (err) return false;
                    }
                );


            if (contractAddr._address != "" && contractAddr._address != null) {
                for (let i = 0; i < this.erc1155TokenAry.length; i++) {
                    axios.post("/nftsBackend/insertERC1155Token", { "contractAddr": contractAddr._address, "tokenID": i, "title": this.erc1155TokenAry[i] }).then((res) => {
                        console.log(result);
                    })
                }
            }
            window.location.reload();
        },
        deployERC721: async function (
            _initBaseURI, _initGoal, _erc1155Addr, _erc1155Token, _Ctitle, _Clevel, _fileName
        ) {
            if (_initBaseURI.substr(-1) !== "/") {
                alert("please enter / after your baseURI.");
                return false;
            }

            var myContract = new w3.eth.Contract(
                this.compile_code_NFT["abi"]
            );

            let contractAddr = await myContract
                .deploy({
                    data: this.compile_code_NFT["bytecode"],
                    arguments: [_initBaseURI, _initGoal, _erc1155Addr],
                })
                .send(
                    {
                        from: this.accounts,
                    },
                    (err) => {
                        if (err) return false;
                    }
                );

            let params = {
                "baseURI": _initBaseURI,
                "contractAddr": contractAddr._address,
                "Ctitle": _Ctitle,
                "Clevel": _Clevel,
                "erc1155Addr": _erc1155Addr,
                "erc1155Token": _erc1155Token,
                "fileName": _fileName
            }
            axios.post("/nftsBackend/deployERC721", params).then((res) => {
                console.log(res);
            });
            this.setNFTAddr(_erc1155Token, contractAddr._address)
        },
        setNFTAddr: async function (tokenID, NFTAddr) {
            let contract = this.erc1155_smartContract();
            await contract.methods.setNFTAddr(tokenID, NFTAddr).send({ from: this.accounts });
            window.location.reload();
        },
        getNFTAddr: async function () {
            let contract = this.erc1155_smartContract();
            let addr = await contract.methods.NFTAddress(1).call({ from: this.accounts });
            alert(addr);
        },
        getAccount: async function () {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            this.accounts = accounts[0];
        },
        init: async function () {
            this.getAccount();

            if (typeof web3 !== "undefined") {
                w3 = new Web3(web3.currentProvider);
            } else {
                w3 = new Web3(
                    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
                );
            }
            axios.get("/build/certificateNFT.json").then((res) => {
                this.compile_code_NFT = res.data;
            });
            axios.get("/build/credit_hours.json").then((res) => {
                this.compile_code_credits = res.data;
            });
            await axios
                .get("/nfts/results1155")
                .then((res) => {
                    this.erc1155Ary = res.data;
                })
                .catch((error) => {
                    console.error(error);
                });
            this.newTokenID = this.erc1155Ary.length;
        },
    },
    mounted() {
        this.init();
    },
}).mount("#app");
