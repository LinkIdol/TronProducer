import abi from './json/abi.json'


let Contract = function () {
    return window.tronWeb.contract(abi.abi, abi.address)
};

export default Contract
