const {expect} = require("chai");
const {ethers} = require("hardhat");

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), `ether`)
};

const ether = tokens;

describe("RealEstate", () => {
    let realEstate, escrow;
    let seller, deployer, buyer, inspector, lender;
    let nftID = 1;
    let purchasePrice = ether(100)
    let escrowAmount = ether(20)
    
    beforeEach(async () => {
        //setup Accounts
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        seller = deployer;
        buyer = accounts[1];
        inspector = accounts[2];
        lender = accounts[3];

        //load Contracts
        const RealEstate = await ethers.getContractFactory("RealEstate");
        const Escrow = await ethers.getContractFactory("Escrow");

        //deploy Contracts
        realEstate = await RealEstate.deploy()
        escrow = await Escrow.deploy(
            realEstate.address,
            nftID,
            purchasePrice,
            escrowAmount,
            seller.address,
            buyer.address,
            inspector.address,
            lender.address
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
        it("Executes a successful transaction", async () => {
            //expects seller to be NFT owner
            expect(await realEstate.ownerOf(nftID)).to.equal(seller.address)

            //check escrow balance
            balance = await escrow.getBalance()
            console.log("escrow balance: ", ethers.utils.formatEther(balance));
            
            //buyer deposits earnest
            transaction = await escrow.connect(buyer).depositEarnest({value: escrowAmount});
            console.log("Buyer deposits escrow");
            
            //check escrow balance
            balance = await escrow.getBalance()
            console.log("escrow balance: ", ethers.utils.formatEther(balance));

            //inspector update status
            transaction = await escrow.connect(inspector).updateInspectionStatus(true)
            await transaction.wait()
            console.log("Inspector updates status");
            
            //transaction
            transaction = await escrow.connect(buyer).finalizeSale()
            await transaction.wait()
            console.log("Buyer finalizes sale")

            //expects buyer to be NFT owner after sale
            expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address)
        })
    })

})