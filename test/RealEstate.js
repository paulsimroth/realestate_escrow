const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("RealEstate", () => {
    let realEstate, escrow;
    let seller, deployer;
    let nftID = 1;
    beforeEach(async () => {
        //setup Accounts
        accounts = await ethers.getSingers();
        deployer = accounts[0];
        seller = deployer;

        //load Contracts
        const RealEstate = await ethers.getContractFactory("RealEstate");
        const Escrow = await ethers.getContractFactory("Escrow");

        //deploy Contracts
        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy()
    })

    describe("Deployment", async () => {
        it("sends NFT to seller / deployer", async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })


})