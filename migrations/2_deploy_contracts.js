const Dbooks = artifacts.require("Dbooks");

module.exports = function(deployer) {
  deployer.deploy(Dbooks);
};
