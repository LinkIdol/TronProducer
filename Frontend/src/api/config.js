console.log(process.env.NODE_ENV);
let BASE_URL = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:7001' : 'https://idolapi.newcomegame.com';
export default {
    BASE_URL,
    IMG_SERVER: 'http://img.newcomegame.com',
    PY_IMG_Prefix: (id) => {
        return `https://gan.ethgeek.cn/static/images/transferred_faces/${id}_0.png`;
    },
    UPLOAD_URL: 'https://gan.ethgeek.cn/post',
    Web3_KittyCore: '0x34d8bc4655937395cce625fc8971419e7f975587',
    Web3_SaleClockAuction: '0xde33cc4d5be256763d99baaf5f1ef61196352127',
    Web3_SiringClockAuction: '0xc8bfce74e2adc3fe64a565b35d899f6dae9c9efe',
    Web3_GeneScience: '0xdf297f92d219615d0af61f735d775ab9df70ec03',

    TronWeb_KittyCore: 'TSU62dQsgRML8J7sYim18QJD6L56UA7KmT',
    TronWeb_SaleClockAuction: 'TQmnHnW7yqfPrVEDLzf4RdA7W6wKiJjsXE',
    TronWeb_SiringClockAuction: 'TKNpyPVZFzYVaERHG8RzakZNfG6yfXenG9',
    TronWeb_GeneScience: 'TDJWBp4H15zNAuLCfJjJx5NKdwhhMZABHh',
}
