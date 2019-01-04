var Migrations = artifacts.require("./Migrations.sol");
//var KittyCore = artifacts.require("./KittyCore.sol");
//var SaleClockAuction = artifacts.require("./SaleClockAuction.sol");
var SiringClockAuction = artifacts.require("./SiringClockAuction.sol");
//var GeneScience = artifacts.require("./GeneScience.sol")


module.exports = function(deployer) {
    deployer.deploy(Migrations);
    //deployer.deploy(KittyCore);
    //deployer.deploy(SaleClockAuction);
    deployer.deploy(SiringClockAuction);
    //deployer.deploy(GeneScience);
};