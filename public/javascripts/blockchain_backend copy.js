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
        // smart contract method(call)
        getNFTAddr: async function () {
            let contract = this.erc1155_smartContract();
            let addr = await contract.methods.NFTAddress(1).call({ from: this.accounts });
            alert(addr);
        },

        // smart contract method(send)
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
        // call api
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
        // deploy smart contract
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
        // metamask
        getAccount: async function () {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            this.accounts = accounts[0];
        },
        // initialize
        init: async function () {
            this.getAccount();

            // define RPC port
            if (typeof web3 !== "undefined") {
                w3 = new Web3(web3.currentProvider);
            } else {
                w3 = new Web3(
                    new Web3.providers.HttpProvider("http://127.0.0.1:7545")
                );
            }
            // call api
            axios.get("/build/certificateNFT.json").then((res) => {
                this.compile_code_NFT = res.data;
            });

            this.newTokenID = this.erc1155Ary.length;
        },
    },
    mounted() {
        this.init();
    },
}).mount("#app");
