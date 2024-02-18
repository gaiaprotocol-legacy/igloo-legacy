// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

contract Igloo is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using AddressUpgradeable for address payable;

    uint256 private baseDivider;
    uint256 private constant ACC_FEE_PRECISION = 1e4;

    enum KeyType {
        CREATOR, // Creator keys are used independently. 5% of transaction fees are received by the key owner.
        GROUP, // Group keys are shared among multiple holders. 5% of transaction fees are distributed among the key holders in proportion to their key ratio.
        HYBRID // Hybrid keys combine features of both creator and group keys. 2.5% of transaction fees go to the key owner, and the remaining 2.5% are distributed among all key holders in proportion to their key ratio.
    }

    address payable public protocolFeeDestination;
    uint256 public protocolFeePercent;
    uint256 public creatorFeePercent;
    uint256 public groupHolderFeePercent;
    uint256 public hybridOwnerFeePercent;
    uint256 public hybridHolderFeePercent;

    event SetProtocolFeeDestination(address indexed destination);
    event SetProtocolFeePercent(uint256 percent);
    event SetCreatorFeePercent(uint256 percent);
    event SetGroupHolderFeePercent(uint256 percent);
    event SetHybridOwnerFeePercent(uint256 percent);
    event SetHybridHolderFeePercent(uint256 percent);

    function initialize(
        uint256 _baseDivider,
        address payable _protocolFeeDestination,
        uint256 _protocolFeePercent,
        uint256 _creatorFeePercent,
        uint256 _groupHolderFeePercent,
        uint256 _hybridOwnerFeePercent,
        uint256 _hybridHolderFeePercent
    ) public initializer {
        __Ownable_init();
        __ReentrancyGuard_init();

        baseDivider = _baseDivider;
        protocolFeeDestination = _protocolFeeDestination;
        protocolFeePercent = _protocolFeePercent;
        creatorFeePercent = _creatorFeePercent;
        groupHolderFeePercent = _groupHolderFeePercent;
        hybridOwnerFeePercent = _hybridOwnerFeePercent;
        hybridHolderFeePercent = _hybridHolderFeePercent;

        emit SetProtocolFeeDestination(_protocolFeeDestination);
        emit SetProtocolFeePercent(_protocolFeePercent);
        emit SetCreatorFeePercent(_creatorFeePercent);
        emit SetGroupHolderFeePercent(_groupHolderFeePercent);
        emit SetHybridOwnerFeePercent(_hybridOwnerFeePercent);
        emit SetHybridHolderFeePercent(_hybridHolderFeePercent);
    }

    function setProtocolFeeDestination(address payable _feeDestination) public onlyOwner {
        protocolFeeDestination = _feeDestination;
        emit SetProtocolFeeDestination(_feeDestination);
    }

    function setProtocolFeePercent(uint256 _feePercent) public onlyOwner {
        protocolFeePercent = _feePercent;
        emit SetProtocolFeePercent(_feePercent);
    }

    function setCreatorFeePercent(uint256 _feePercent) public onlyOwner {
        creatorFeePercent = _feePercent;
        emit SetCreatorFeePercent(_feePercent);
    }

    function setGroupHolderFeePercent(uint256 _feePercent) public onlyOwner {
        groupHolderFeePercent = _feePercent;
        emit SetGroupHolderFeePercent(_feePercent);
    }

    function setHybridOwnerFeePercent(uint256 _feePercent) public onlyOwner {
        hybridOwnerFeePercent = _feePercent;
        emit SetHybridOwnerFeePercent(_feePercent);
    }

    function setHybridHolderFeePercent(uint256 _feePercent) public onlyOwner {
        hybridHolderFeePercent = _feePercent;
        emit SetHybridHolderFeePercent(_feePercent);
    }

    struct Key {
        KeyType keyType;
        address owner;
        uint256 supply;
        uint256 accFeePerUnit;
    }

    struct Holder {
        uint256 balance;
        int256 feeDebt;
    }

    uint256 public nextKeyId;
    mapping(uint256 => Key) public keys;
    mapping(uint256 => mapping(address => Holder)) public holders;

    event KeyCreated(uint256 indexed keyId, address indexed owner, KeyType keyType);
    event KeyDeleted(uint256 indexed keyId);

    event ChangeKeyType(uint256 indexed keyId, KeyType keyType);
    event ChangeKeyOwner(uint256 indexed keyId, address indexed oldOwner, address indexed newOwner);

    event Trade(
        address indexed trader,
        uint256 indexed keyId,
        bool indexed isBuy,
        uint256 amount,
        uint256 price,
        uint256 protocolFee,
        uint256 ownerFee,
        uint256 holderFee,
        uint256 supply
    );

    event ClaimHolderFee(address indexed holder, uint256 indexed keyId, uint256 fee);

    function createKey(KeyType keyType) external returns (uint256 keyId) {
        keyId = nextKeyId++;
        keys[keyId] = Key({keyType: keyType, owner: msg.sender, supply: 0, accFeePerUnit: 0});
        emit KeyCreated(keyId, msg.sender, keyType);
    }

    function exists(uint256 keyId) public view returns (bool) {
        return keys[keyId].owner != address(0);
    }

    function deleteKey(uint256 keyId) external {
        require(keys[keyId].owner == msg.sender && keys[keyId].supply == 0, "Not key owner or supply not 0");
        delete keys[keyId];
        emit KeyDeleted(keyId);
    }

    function changeKeyType(uint256 keyId, KeyType keyType) external {
        require(keys[keyId].owner == msg.sender, "Not key owner");
        keys[keyId].keyType = keyType;
        emit ChangeKeyType(keyId, keyType);
    }

    function changeKeyOwner(uint256 keyId, address newOwner) external {
        require(keys[keyId].owner == msg.sender, "Not key owner");
        keys[keyId].owner = newOwner;
        emit ChangeKeyOwner(keyId, msg.sender, newOwner);
    }

    function getPrice(uint256 supply, uint256 amount) public view returns (uint256) {
        uint256 sum1 = supply == 0 ? 0 : ((supply - 1) * (supply) * (2 * (supply - 1) + 1)) / 6;
        uint256 sum2 = supply == 0 && amount == 1
            ? 0
            : ((supply - 1 + amount) * (supply + amount) * (2 * (supply - 1 + amount) + 1)) / 6;
        uint256 summation = sum2 - sum1;
        return (summation * 1 ether) / baseDivider;
    }

    function getBuyPrice(uint256 keyId, uint256 amount) public view returns (uint256) {
        return getPrice(keys[keyId].supply, amount);
    }

    function getSellPrice(uint256 keyId, uint256 amount) public view returns (uint256) {
        return getPrice(keys[keyId].supply - amount, amount);
    }

    function getBuyPriceAfterFee(uint256 keyId, uint256 amount) public view returns (uint256) {
        uint256 price = getBuyPrice(keyId, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 ownerFee;
        uint256 holderFee;
        if (keys[keyId].keyType == KeyType.CREATOR) {
            ownerFee = (price * creatorFeePercent) / 1 ether;
            holderFee = (price * 0) / 1 ether;
        } else if (keys[keyId].keyType == KeyType.GROUP) {
            ownerFee = (price * 0) / 1 ether;
            holderFee = (price * groupHolderFeePercent) / 1 ether;
        } else if (keys[keyId].keyType == KeyType.HYBRID) {
            ownerFee = (price * hybridOwnerFeePercent) / 1 ether;
            holderFee = (price * hybridHolderFeePercent) / 1 ether;
        }
        return price + protocolFee + ownerFee + holderFee;
    }

    function getSellPriceAfterFee(uint256 keyId, uint256 amount) public view returns (uint256) {
        uint256 price = getSellPrice(keyId, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 ownerFee;
        uint256 holderFee;
        if (keys[keyId].keyType == KeyType.CREATOR) {
            ownerFee = (price * creatorFeePercent) / 1 ether;
            holderFee = (price * 0) / 1 ether;
        } else if (keys[keyId].keyType == KeyType.GROUP) {
            ownerFee = (price * 0) / 1 ether;
            holderFee = (price * groupHolderFeePercent) / 1 ether;
        } else if (keys[keyId].keyType == KeyType.HYBRID) {
            ownerFee = (price * hybridOwnerFeePercent) / 1 ether;
            holderFee = (price * hybridHolderFeePercent) / 1 ether;
        }
        return price - protocolFee - ownerFee - holderFee;
    }

    function buyKeys(uint256 keyId, uint256 amount) external payable nonReentrant {
        require(exists(keyId), "Key does not exist");
        Key memory k = keys[keyId];

        uint256 price = getBuyPrice(keyId, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 ownerFee;
        uint256 holderFee;
        if (k.keyType == KeyType.CREATOR) {
            ownerFee = (price * creatorFeePercent) / 1 ether;
            holderFee = (price * 0) / 1 ether;
        } else if (k.keyType == KeyType.GROUP) {
            ownerFee = (price * 0) / 1 ether;
            holderFee = (price * groupHolderFeePercent) / 1 ether;
        } else if (k.keyType == KeyType.HYBRID) {
            ownerFee = (price * hybridOwnerFeePercent) / 1 ether;
            holderFee = (price * hybridHolderFeePercent) / 1 ether;
        }

        require(msg.value >= price + protocolFee + ownerFee + holderFee, "Insufficient funds");

        Holder storage holder = holders[keyId][msg.sender];

        holder.balance += amount;
        holder.feeDebt += int256((amount * k.accFeePerUnit) / ACC_FEE_PRECISION);

        k.supply += amount;
        if (holderFee > 0) k.accFeePerUnit += (holderFee * ACC_FEE_PRECISION) / k.supply;
        keys[keyId] = k;

        protocolFeeDestination.sendValue(protocolFee);
        if (ownerFee > 0) payable(k.owner).sendValue(ownerFee);
        if (msg.value > price + protocolFee + ownerFee + holderFee) {
            uint256 refund = msg.value - price - protocolFee - ownerFee - holderFee;
            payable(msg.sender).sendValue(refund);
        }

        emit Trade(msg.sender, keyId, true, amount, price, protocolFee, ownerFee, holderFee, k.supply);
    }

    function sellKeys(uint256 keyId, uint256 amount) external nonReentrant {
        require(exists(keyId), "Key does not exist");
        Key memory k = keys[keyId];

        uint256 price = getSellPrice(keyId, amount);
        uint256 protocolFee = (price * protocolFeePercent) / 1 ether;
        uint256 ownerFee;
        uint256 holderFee;
        if (k.keyType == KeyType.CREATOR) {
            ownerFee = (price * creatorFeePercent) / 1 ether;
            holderFee = (price * 0) / 1 ether;
        } else if (k.keyType == KeyType.GROUP) {
            ownerFee = (price * 0) / 1 ether;
            holderFee = (price * groupHolderFeePercent) / 1 ether;
        } else if (k.keyType == KeyType.HYBRID) {
            ownerFee = (price * hybridOwnerFeePercent) / 1 ether;
            holderFee = (price * hybridHolderFeePercent) / 1 ether;
        }

        Holder storage holder = holders[keyId][msg.sender];

        if (holderFee > 0) k.accFeePerUnit += (holderFee * ACC_FEE_PRECISION) / k.supply;
        k.supply -= amount;
        keys[keyId] = k;

        require(holder.balance >= amount, "Insufficient balance");
        holder.balance -= amount;
        holder.feeDebt -= int256((amount * k.accFeePerUnit) / ACC_FEE_PRECISION);

        uint256 netAmount = price - protocolFee - ownerFee - holderFee;
        payable(msg.sender).sendValue(netAmount);
        if (ownerFee > 0) payable(k.owner).sendValue(ownerFee);
        protocolFeeDestination.sendValue(protocolFee);

        emit Trade(msg.sender, keyId, false, amount, price, protocolFee, ownerFee, holderFee, k.supply);
    }

    function claimableHolderFee(uint256 keyId, address holder) external view returns (uint256 claimable) {
        Key memory k = keys[keyId];
        Holder memory h = holders[keyId][holder];
        int256 acc = int256((h.balance * k.accFeePerUnit) / ACC_FEE_PRECISION);
        claimable = uint256(acc - h.feeDebt);
    }

    function claimHolderFee(uint256 keyId) external nonReentrant {
        Key memory k = keys[keyId];
        Holder storage holder = holders[keyId][msg.sender];
        int256 acc = int256((holder.balance * k.accFeePerUnit) / ACC_FEE_PRECISION);
        uint256 claimable = uint256(acc - holder.feeDebt);
        holder.feeDebt = acc;
        payable(msg.sender).sendValue(claimable);
        emit ClaimHolderFee(msg.sender, keyId, claimable);
    }

    bool public migratedFromV1;

    event MigrateV1Holder(uint256 indexed keyId, address indexed holder, uint256 indexed amount);
    event EndMigration();

    receive() external payable {}

    function migrateFromV1(address creator, address[] memory v1Holders, uint256[] memory amounts) external onlyOwner {
        require(!migratedFromV1, "Already migrated");
        uint256 keyId = nextKeyId++;
        uint256 supply = 1;
        holders[keyId][creator].balance = 1;
        emit KeyCreated(keyId, creator, KeyType.CREATOR);

        for (uint256 i = 0; i < v1Holders.length; i++) {
            holders[keyId][v1Holders[i]].balance += amounts[i];
            supply += amounts[i];
            emit MigrateV1Holder(keyId, v1Holders[i], amounts[i]);
        }

        keys[keyId] = Key({keyType: KeyType.CREATOR, owner: creator, supply: supply, accFeePerUnit: 0});
    }

    function endMigration() public onlyOwner {
        require(!migratedFromV1, "Migration already ended");
        migratedFromV1 = true;
        emit EndMigration();
    }
}
