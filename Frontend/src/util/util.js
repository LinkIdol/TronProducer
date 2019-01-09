import {Notification} from 'element-ui';

export default {
    checkEnv() {
        window.onload = function () {
            if (!window.tronWeb) {
                console.log(!window.tronWeb)
                Notification({
                    title: '提示',
                    message: '请先安装波场钱包插件',
                    duration: 0
                });
            } else {
                if (!window.tronWeb.ready) {
                    Notification({
                        title: '提示',
                        message: '波场钱包请先登录',
                        duration: 0
                    });
                }
            }
        }
    },
    strToHex(str) {
        if (str === "")
            return "";
        var hexCharCode = [];
        hexCharCode.push("0x");
        for (var i = 0; i < str.length; i++) {
            hexCharCode.push((str.charCodeAt(i)).toString(16));
        }
        return hexCharCode.join("");
    },
    async signMessage(message) {
        const privateKey = 'da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0';
        let hexStr = this.strToHex(message);
        let sign = await window.tronWeb.trx.signMessage(hexStr, privateKey);
        return sign;
    },
    setCookie(name, value, days = 30) {
        let d = new Date;
        d.setTime(d.getTime() + 24*60*60*1000*days);
        document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    },
    getCookie(name) {
        let v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    },
    delCookie(name)
    {
        this.setCookie(name, '', -1);
    },
    formatDateTime(dateTime, fmt) {
        let o = {
            "M+": dateTime.getMonth() + 1, //月份
            "d+": dateTime.getDate(), //日
            "h+": dateTime.getHours(), //小时
            "m+": dateTime.getMinutes(), //分
            "s+": dateTime.getSeconds(), //秒
            "q+": Math.floor((dateTime.getMonth() + 3) / 3), //季度
            "S": dateTime.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateTime.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    uniqueid() {
        let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
        do {
            let ascicode = Math.floor((Math.random() * 42) + 48);
            if (ascicode < 58 || ascicode > 64) {
                idstr += String.fromCharCode(ascicode);
            }
        } while (idstr.length < 32);
        return (idstr);
    }

}

/*window.addEventListener('load', () => {
    if (typeof tronPay !== 'undefined') {
        tronWeb = tronPay.tronWeb || tronWeb
        if (tronWeb.isTronPay && tronWeb.ready) {
            this.$store.commit('updateLogin', true)
            let address = window.tronWeb.defaultAddress.base58;
            API.login({
                address: address,
                sign: ''
            }).then(res => {
                console.log(res);
            });
            /!*window.tronWeb.trx.getAccount(address).then((res) => {
                console.log(res);
            })*!/
        } else {
            this.$notify({
                title: '提示',
                message: '波场钱包请先解锁',
                duration: 0
            });
            this.$store.commit('updateLogin', false)
        }
    } else {
        this.$notify({
            title: '提示',
            message: '请先安装波场钱包插件',
            duration: 0
        });
        this.$store.commit('updateLogin', false)
    }
})*/

/*
// 环境检查
const waitForGlobal = async () => {
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
      app.$mount('#app')
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
}

waitForGlobal().then()*/

/*api.setTronWeb(window.tronWeb)

api.contract.allOf(1).call().then(resp => {
  console.log(resp)
})

api.contract.ownerOf(1).call().then(resp => {
  console.log(resp)
})

api.contract.tokenExists(1).call().then(resp => {
  console.log(resp)
})*/

