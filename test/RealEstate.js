const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("RealEstate", () => {
    let realEstate, escrow;
    let seller, deployer, buyer;
    let nftID = 1;
    
    beforeEach(async () => {
        //setup Accounts
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        seller = deployer;
        buyer = accounts[1];

        //load Contracts
        const RealEstate = await ethers.getContractFactory("RealEstate");
        const Escrow = await ethers.getContractFactory("Escrow");

        //deploy Contracts
        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy(
            realEstate.address,
            nftID,
            seller.address,
            buyer.address
        )

        transaction = await realEstate.connect(seller).approve(escrow.address, nftID)
        await transaction.wait()
    })

    describe("Deployment", async () => {
        it("sends NFT to seller / deployer", async () => {
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)
        })
    })

    describe("Selling real estate", async () => {
        it("Executes a succesfull transaction", async () => {
            //expects seller to be NFT owner
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

            transaction = await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("Buyer finalizes sale")

            //expects buyer to be NFT owner after sale
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)
        })
    })

})