'use strict';
const message = require('../../config/message');
const Service = require('egg').Service;

class UserService extends Service {
    async login(address) {
        const ctx = this.ctx;
        await this.register(address, "");
        let sql = "SELECT UserId, UserName, Address FROM `users` WHERE `address`=:address";
        try {
            let users = await ctx.model.query(sql, { raw: true, model: ctx.model.UserModel, replacements: { address: address } });
            if (users != undefined && users[0].UserId > 0) {
                sql = "UPDATE `users` SET `LastLoginDate`=UNIX_TIMESTAMP(),`LastLoginIP`=:IP; "
                    + "INSERT INTO `userloginlogs`(`UserId`,`LoginDate`,`IP`) VALUES (:UserId, UNIX_TIMESTAMP(), :IP)";
                await ctx.model.query(sql, {
                    raw: true, replacements: {
                        UserId: users[0].UserId,
                        IP: ctx.ip,
                    }
                });
                return users[0];
            }
        }
        catch (err) {
            this.logger.error(err);
        }
        return null;
    };

    async setUserName(userId, userName) {
        let user = await this.ctx.model.UserModel.findOne({ where: { UserId: userId } });
        if (user == null)
            return -1;

        await user.update({ UserName: userName }).catch(error => {
            this.logge.error('UserService.setUserName error %j', error);
            return -2;
        });

        return 0;
    }

    async getUserId(address) {
        const ctx = this.ctx;
        await this.register(address, "");
        let sql = "SELECT UserId, UserName, Address FROM `users` WHERE `address`=:address";
        try {
            let users = await ctx.model.query(sql, { raw: true, model: ctx.model.UserModel, replacements: { address: address } });
            if (users != undefined && users[0].UserId > 0) {
                return users[0].UserId;
            }
            else {
                return -1;
            }
        }
        catch (err) {
            this.logger.error(err);
            return -2;
        }
    };

    async register(address, userName) {
        const ctx = this.ctx;
        let sql = 'INSERT INTO `users` (`Address`,`UserName`,`LastLoginDate`,`LastLoginIP`,`BlockChain`,`CreateDate`) '
            + 'SELECT :address, :userName, UNIX_TIMESTAMP(), :lastLoginIP, :blockChain, UNIX_TIMESTAMP() '
            + 'FROM DUAL WHERE NOT EXISTS (SELECT `Address` FROM `users` WHERE `Address`=:address)';
        try {
            await ctx.model.query(sql, {
                raw: true, replacements: {
                    address: address,
                    userName: userName,
                    lastLoginIP: ctx.ip ? ctx.ip : "",
                    blockChain: 'tron'
                }
            });
            return 0;
        }
        catch (err) {
            this.logger.error(err);
            return -2;
        }
    };


}

module.exports = UserService;