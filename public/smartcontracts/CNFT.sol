// Contract based on https://docs.openzeppelin.com/contracts/3.x/erc721
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CertificateNFT is ERC721Enumerable, Ownable {
    using Strings for uint256;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public goal = 0;
    uint256 public maxBalance = 1;

    constructor(
        string memory initBaseURI,
        uint256 initGoal,
        address erc1155Addr
    ) ERC721("java Meta", "JM") {
        setBaseURI(initBaseURI);
        setGoal(initGoal);
        transferOwnership(erc1155Addr);
    }

    //amount is to's credit hours
    function mintNFTMeta(address to, uint256 amount) public payable onlyOwner {
        require(
            amount > goal,
            string(
                abi.encodePacked(
                    "Your balance is not enough to mint the NFT. Total balance you need is:",
                    goal.toString()
                )
            )
        );
        require(balanceOf(to) + 1 <= maxBalance, "You already have one.");

        uint256 mintIndex = totalSupply();
        _safeMint(to, mintIndex);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory base = _baseURI();

        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return
            string(abi.encodePacked(base, tokenId.toString(), baseExtension));
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setGoal(uint256 _goal) public onlyOwner {
        goal = _goal;
    }

    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }
}
