const fs = require('fs');
const path = require('path');

module.exports = {
    async record (contract, eventName, str) {
        var p = path.join(__dirname, '__' + contract + eventName + '.txt');
        await fs.writeFile(p, str.toString(), function () { return });
    },

    async read(contract, eventName) {
        var p = path.join(__dirname, '__' + contract + eventName + '.txt');
        let lastTimestamp = 0;
        try {
            let data = await fs.readFileSync(p, 'utf-8');
            lastTimestamp = parseInt(data);
        }
        catch (err) {

        }
        return lastTimestamp;
    }
}