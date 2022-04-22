// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract credit_hours is ERC1155PresetMinterPauser, Ownable {
    uint256 public constant kotlin_credits = 0;
    uint256 public constant java_credits = 1;
    uint256 private balanceOfToken = 0;
    mapping(uint256 => string) public tokenIdToCreditName;
    mapping(uint256 => address) public NFTAddress;

    constructor(string[] memory a) ERC1155PresetMinterPauser("") {
        for (uint256 i = 0; i < a.length; i++) {
            tokenIdToCreditName[i] = a[i];
            _mint(msg.sender, i, 10**18, "");
        }
    }

    function creditsToNFT(uint256 tokenID) public payable returns (bool) {
        NFTsMeta(NFTAddress[tokenID]).mintNFTMeta(
            msg.sender,
            balanceOf(msg.sender, tokenID)
        );
        return true;
    }

    function setTokenIDName(uint256 tokenID, string calldata creditName)
        public
        returns (bool)
    {
        tokenIdToCreditName[tokenID] = creditName;
        return true;
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
        require(
            from == address(0) ||
                from == 0x078bA65c45cA69A5e6f86A4e1e471eab974972Fd,
            "must the same"
        );
    }

    function setNFTAddr(uint256 tokenID, address addr)
        public
        onlyOwner
        returns (bool)
    {
        NFTAddress[tokenID] = addr;
        return true;
    }
}

interface NFTsMeta {
    function mintNFTMeta(address to, uint256 amount) external payable;
}
