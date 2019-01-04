import store from '../store/index'

let pollTronWeb = function () {
    let tronWeb = window.tronWeb;

    setInterval(() => {
        if (tronWeb && store.state.tron.tronWebInstance) {
            if (tronWeb.trx.coinbase !== store.state.web3.coinbase) {
                let newCoinbase = tronWeb.trx.coinbase
                tronWeb.trx.getBalance(tronWeb.trx.coinbase, function (err, newBalance) {
                    if (err) {
                        console.log(err)
                    } else {
                        store.dispatch('pollWeb3', {
                            coinbase: newCoinbase,
                            balance: parseInt(newBalance, 10)
                        })
                    }
                })
            } else {
                tronWeb.trx.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
                    if (err) {
                        console.log(err)
                    } else if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
                        store.dispatch('pollWeb3', {
                            coinbase: store.state.web3.coinbase,
                            balance: polledBalance
                        })
                    }
                })
            }
        }
    }, 500)
};
/*const waitForGlobal = async () => {
    if (window.tronWeb) {
        const tronWeb = window.tronWeb
        const nodes = await tronWeb.isConnected()
        const connected = !Object.entries(nodes).map(([key, value]) => {
            if (!value) {
                console.error(`Error: ${key} is not connected`)
            }
            return value
        }).includes(false)
        if (connected) {
            store.dispatch('pollWeb3', {
                coinbase: newCoinbase,
                balance: parseInt(newBalance, 10)
            })
        } else {
            console.error('Error: TRON node is not connected')
            console.error('wait for tronLink')
            setTimeout(async () => {
                await waitForGlobal()
            }, 100)
        }
    } else {
        console.error('wait for tronLink')
        setTimeout(async () => {
            await waitForGlobal()
        }, 100)
    }
}*/
export default pollTronWeb
