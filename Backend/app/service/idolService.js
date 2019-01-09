'use strict';
const TronWeb = require('tronweb');
const idolAttributes = require("../../config/idolAttributes");
const Service = require('egg').Service;
const EventBus = require('../TronEvents/eventBus');
const utility = require('../extend/utility');
let OSS = require('ali-oss');

class IdolService extends Service {
    //ERC721中事件
    //资产转移
    //修改owner
    async Transfer(events) {
        for (var i = events.length; i > 0; i--) {
            let event = events[i - 1]; //第0个是最新的

            this.logger.info("IdolService.Transfer, 开始处理 tokenId: %j", event.result.tokenId);

            let to = TronWeb.address.fromHex("41" + event.result.to.substring(2));
            //创建拍卖，转给拍卖合约，不处理
            if (to == "TQmnHnW7yqfPrVEDLzf4RdA7W6wKiJjsXE" || to == "TKNpyPVZFzYVaERHG8RzakZNfG6yfXenG9")
                continue;

            //更新数据库
            let userId = await this.ctx.service.userService.getUserId(to);
            if (userId <= 0)
                continue;

            let affectedRows = 0;

            let sql = 'INSERT INTO translogs(`Transaction`,`Block`,`Contract`,`EventName`,`Timestamp`,`Result`,`CreateDate`) VALUES(:Transaction,:Block,:Contract,:EventName,:Timestamp,:Result,UNIX_TIMESTAMP());'
                + 'UPDATE idols SET UserId=:UserId WHERE TokenId=:TokenId AND ROW_COUNT() > 0; '; //如果set字段前后的值一样，ROW_COUNT()=0

            let trans = await this.ctx.model.transaction();
            try {
                let updates = await this.ctx.model.query(sql, {
                    raw: true,
                    model: this.ctx.model.IdolModel,
                    replacements: {
                        Transaction: event.transaction,
                        Block: event.block,
                        Contract: event.contract,
                        EventName: event.name,
                        Timestamp: event.timestamp,
                        Result: JSON.stringify(event.result),
                        UserId: userId,
                        TokenId: parseInt(event.result.tokenId)
                    },
                    transaction: trans
                });

                if (updates != null && updates.length > 0) {
                    updates.forEach(function (item, i) {
                        if (item.affectedRows == undefined || item.affectedRows == 0) {
                            return true;
                        }
                        affectedRows = affectedRows + item.affectedRows;
                    });
                }
                await trans.commit();
            }
            catch (err) {
                await trans.rollback();
                this.logger.error("IdolService.Transfer error %j", err);
            }

            //affectedRows = 0，已经处理过的事件
            //affectedRows = 2，本次transfer成功
            //affectedRows = 1，日志插入成功，但update失败，说明是新的idol产生
            if (affectedRows == 0) {
                this.logger.info("IdolService.Transfer, tokenId: %j, Processed", event.result.tokenId);
            }
            else if (affectedRows == 2) {
                this.logger.info("IdolService.Transfer, tokenId: %j, Insert translogs success, update idols success", event.result.tokenId);
            }
            else if (affectedRows == 1) { //新出生的情况，放到Birth事件里面处理
                this.logger.info("IdolService.Transfer, tokenId: %j, Insert translogs success, update idols failure ", event.result.tokenId);
            }
        }
    }

    //授权，暂不处理
    async Approval(events) {

    }

    //怀孕
    //处理父母的状态，修改母猫为怀孕中IsPregnant=1，修改父母猫的cooldownIndex+1
    //event Pregnant(address owner, uint256 matronId, uint256 sireId, uint256 cooldownEndBlock);
    async Pregnant(events) {
        for (var i = events.length; i > 0; i--) {
            let event = events[i - 1]; //第0个是最新的

            this.logger.info("IdolService.Pregnant, 开始处理");

            let sql = 'INSERT INTO translogs(`Transaction`,`Block`,`Contract`,`EventName`,`Timestamp`,`Result`,`CreateDate`) VALUES(:Transaction,:Block,:Contract,:EventName,:Timestamp,:Result,UNIX_TIMESTAMP());'
                + "UPDATE idols SET IsPregnant=1, SiringWithId=:sireId, CooldownIndex=CooldownIndex+1, CooldownEndBlock=:cooldownEndBlock WHERE TokenId=:matronId AND ROW_COUNT() > 0; "
                + "UPDATE idols SET CooldownIndex=CooldownIndex+1 WHERE (TokenId=:matronId OR TokenId=:sireId) AND CooldownIndex<13 AND ROW_COUNT() > 0 ;";

            //更新父亲的CooldownEndBlock
            EventBus.eventEmitter.emit("idol_update", parseInt(event.result.sireId), this.ctx);

            let trans = await this.ctx.model.transaction();
            try {
                await this.ctx.model.query(sql, {
                    raw: true,
                    model: this.ctx.model.IdolModel,
                    replacements: {
                        Transaction: event.transaction,
                        Block: event.block,
                        Contract: event.contract,
                        EventName: event.name,
                        Timestamp: event.timestamp,
                        Result: JSON.stringify(event.result),
                        matronId: parseInt(event.result.matronId),
                        sireId: parseInt(event.result.sireId),
                        cooldownEndBlock: parseInt(event.result.cooldownEndBlock)
                    },
                    transaction: trans
                });
                await trans.commit();
            }
            catch (err) {
                await trans.rollback();
                this.logger.error("IdolService.Pregnant error %j", err);
            }
        }
    }

    //出生
    //处理母怀孕中的状态IsPregnant=0
    //插入新出生的idol
    //event Birth(address owner, uint256 kittyId, uint256 matronId, uint256 sireId, uint256 genes);
    async Birth(events) {
        for (var i = events.length; i > 0; i--) {
            let event = events[i - 1]; //第0个是最新的

            this.logger.info("IdolService.Birth, 开始处理");

            let userId = await this.ctx.service.userService.getUserId(TronWeb.address.fromHex("41" + event.result.owner.substring(2)));
            if (userId <= 0) {
                this.logger.error("Birth error: owner address error. %j", event);
                continue;
            }

            let rootTokenId = 0;
            if (parseInt(event.result.matronId) == 0) //0代root是自己
                rootTokenId = parseInt(event.result.kittyId);
            else
                rootTokenId = await this.getRootTokenId(parseInt(event.result.matronId));

            if (rootTokenId <= 0) {
                this.logger.error("Birth error: matron has no rootTokenId. %j", event);
                continue;
            }

            let sql = "";
            //新出生的0代，pic为空
            if (parseInt(event.result.matronId) == 0 && parseInt(event.result.sireId) == 0)
                sql = 'INSERT INTO translogs(`Transaction`,`Block`,`Contract`,`EventName`,`Timestamp`,`Result`,`CreateDate`) VALUES(:Transaction,:Block,:Contract,:EventName,:Timestamp,:Result,UNIX_TIMESTAMP());'
                    + 'INSERT INTO idols(TokenId, UserId, MatronId, SireId, Pic, RootTokenId, CreateDate) SELECT :kittyId, :userId, :matronId, :sireId, "", :rootTokenId, UNIX_TIMESTAMP();';
            else
                sql = 'INSERT INTO translogs(`Transaction`,`Block`,`Contract`,`EventName`,`Timestamp`,`Result`,`CreateDate`) VALUES(:Transaction,:Block,:Contract,:EventName,:Timestamp,:Result,UNIX_TIMESTAMP());'
                    + 'INSERT INTO idols(TokenId, UserId, MatronId, SireId, Pic, RootTokenId, CreateDate) SELECT :kittyId, :userId, :matronId, :sireId, Pic, :rootTokenId, UNIX_TIMESTAMP() FROM idollist WHERE `Status`=0 AND RootTokenId=:rootTokenId AND ROW_COUNT() > 0 LIMIT 1;'
                    + 'UPDATE idollist SET `Status`=1 WHERE `Status`=0 AND RootTokenId=:rootTokenId AND ROW_COUNT() > 0 LIMIT 1;'
                    + 'UPDATE idols a INNER JOIN idols b ON a.RootTokenId=b.TokenId SET a.HairColor=b.HairColor, a.EyeColor=b.EyeColor, a.HairStyle=b.HairStyle WHERE a.TokenId=:kittyId AND ROW_COUNT() > 0;'
                    + "UPDATE idols SET IsPregnant=0, SiringWithId=0 WHERE TokenId=:matronId AND ROW_COUNT() > 0; " //母猫生育，释放出来
                    + "INSERT INTO idolattributes(TokenId, Attribute) SELECT :kittyId,Attribute FROM idolattributes WHERE TokenId=:rootTokenId AND ROW_COUNT() > 0;";

            let trans = await this.ctx.model.transaction();
            try {
                await this.ctx.model.query(sql, {
                    raw: true,
                    model: this.ctx.model.IdolModel,
                    replacements: {
                        Transaction: event.transaction,
                        Block: event.block,
                        Contract: event.contract,
                        EventName: event.name,
                        Timestamp: event.timestamp,
                        Result: JSON.stringify(event.result),
                        kittyId: parseInt(event.result.kittyId),
                        userId: userId,
                        matronId: parseInt(event.result.matronId),
                        sireId: parseInt(event.result.sireId),
                        rootTokenId: rootTokenId
                    },
                    transaction: trans
                });
                await trans.commit();
                //更新新出生idol的BirthTime、代、cooldownIndex
                EventBus.eventEmitter.emit("idol_update", parseInt(event.result.kittyId), this.ctx);
            }
            catch (err) {
                await trans.rollback();
                this.logger.error("IdolService.Birth error %j", err);
            }
        }
    }

    async getRootTokenId(tokenId) {
        let sql = "SELECT RootTokenId FROM idols WHERE TokenId=:tokenId";
        let idols = await this.ctx.model.query(sql, { raw: true, model: this.ctx.model.IdolModel, replacements: { tokenId: tokenId } });
        if (idols != null && idols.length > 0) {
            let idol = idols[0];
            return idol.RootTokenId;
        }
        return 0;
    }


    //SaleAuction中事件
    //拍卖创建
    //修改idol.IsForSale=1，记录拍卖的时间和价格
    async AuctionCreated(events, isSaleorRental) {
        for (var i = events.length; i > 0; i--) {
            let event = events[i - 1]; //第0个是最新的

            this.logger.info("IdolService.AuctionCreated, 开始处理 tokenId: %j", event.result.tokenId);

            let sql = 'INSERT INTO translogs(`Transaction`,`Block`,`Contract`,`EventName`,`Timestamp`,`Result`,`CreateDate`) VALUES(:Transaction,:Block,:Contract,:EventName,:Timestamp,:Result,UNIX_TIMESTAMP());'
            if (isSaleorRental == 1) //发起拍卖
                sql += 'UPDATE idols SET IsForSale=1, StartingPrice=:StartingPrice, EndingPrice=:EndingPrice, StartedAt=:StartedAt, Duration=:Duration WHERE TokenId=:TokenId AND ROW_COUNT() > 0; '; //如果set字段前后的值一样，ROW_COUNT()=0
            else
                sql += 'UPDATE idols SET IsRental=1, StartingPrice=:StartingPrice, EndingPrice=:EndingPrice, StartedAt=:StartedAt, Duration=:Duration WHERE TokenId=:TokenId AND ROW_COUNT() > 0; ';

            let trans = await this.ctx.model.transaction();
            try {
                await this.ctx.model.query(sql, {
                    raw: true,
                    model: this.ctx.model.IdolModel,
                    replacements: {
                        Transaction: event.transaction,
                        Block: event.block,
                        Contract: event.contract,
                        EventName: event.name,
                        Timestamp: event.timestamp,
                        Result: JSON.stringify(event.result),
                        TokenId: parseInt(event.result.tokenId),
                        StartingPrice: parseInt(event.result.startingPrice),
                        EndingPrice: parseInt(event.result.endingPrice),
                        StartedAt: event.timestamp / 1000,
                        Duration: parseInt(event.result.duration)
                    },
                    transaction: trans
                });
                await trans.commit();
            }
            catch (err) {
                await trans.rollback();
                this.logger.error("IdolService.Transfer error %j", err);
            }
        }
    }

    //拍卖成功
    //修改idol.IsForSale=0
    //删除记录拍卖的时间和价格
    //或者这里不处理，都放到Transfer事件中处理
    //owner的修改放到Transfer事件中处理
    async AuctionSuccessful(events, isSaleorRental) {
        for (var i = events.length; i > 0; i--) {
            let event = events[i - 1]; //第0个是最新的

            this.logger.info("IdolService.AuctionSuccessful, 开始处理 tokenId: %j", event.result.tokenId);

            let sql = 'INSERT INTO translogs(`Transaction`,`Block`,`Contract`,`EventName`,`Timestamp`,`Result`,`CreateDate`) VALUES(:Transaction,:Block,:Contract,:EventName,:Timestamp,:Result,UNIX_TIMESTAMP());'
            if (isSaleorRental == 1) //发起拍卖
                sql += 'UPDATE idols SET IsForSale=0, StartingPrice=0, EndingPrice=0, StartedAt=0, Duration=0 WHERE TokenId=:TokenId AND ROW_COUNT() > 0; '; //购买成功，IsForSale=0，修改owner address放到Transfer事件处理
            else
                sql += 'UPDATE idols SET IsRental=0, StartingPrice=0, EndingPrice=0, StartedAt=0, Duration=0 WHERE TokenId=:TokenId AND ROW_COUNT() > 0; ';

            let trans = await this.ctx.model.transaction();
            try {
                await this.ctx.model.query(sql, {
                    raw: true,
                    model: this.ctx.model.IdolModel,
                    replacements: {
                        Transaction: event.transaction,
                        Block: event.block,
                        Contract: event.contract,
                        EventName: event.name,
                        Timestamp: event.timestamp,
                        Result: JSON.stringify(event.result),
                        TokenId: parseInt(event.result.tokenId)
                    },
                    transaction: trans
                });

                await trans.commit();
            }
            catch (err) {
                await trans.rollback();
                this.logger.error("IdolService.AuctionSuccessful error %j", err);
            }
        }
    }

    //拍卖取消
    //修改idol.IsForSale=0
    //删除记录拍卖的时间和价格
    async AuctionCancelled(events, isSaleorRental) {
        for (var i = events.length; i > 0; i--) {
            let event = events[i - 1]; //第0个是最新的

            this.logger.info("IdolService.AuctionCancelled, 开始处理 tokenId: %j", event.result.tokenId);

            let sql = 'INSERT INTO translogs(`Transaction`,`Block`,`Contract`,`EventName`,`Timestamp`,`Result`,`CreateDate`) VALUES(:Transaction,:Block,:Contract,:EventName,:Timestamp,:Result,UNIX_TIMESTAMP());';
            if (isSaleorRental == 1) //发起拍卖
                sql += 'UPDATE idols SET IsForSale=0, StartingPrice=0, EndingPrice=0, StartedAt=0, Duration=0 WHERE TokenId=:TokenId AND ROW_COUNT() > 0; '; //购买成功，IsForSale=0，修改owner address放到Transfer事件处理
            else //发起租赁
                sql += 'UPDATE idols SET IsRental=0, StartingPrice=0, EndingPrice=0, StartedAt=0, Duration=0 WHERE TokenId=:TokenId AND ROW_COUNT() > 0; ';

            let trans = await this.ctx.model.transaction();
            try {
                await this.ctx.model.query(sql, {
                    raw: true,
                    model: this.ctx.model.IdolModel,
                    replacements: {
                        Transaction: event.transaction,
                        Block: event.block,
                        Contract: event.contract,
                        EventName: event.name,
                        Timestamp: event.timestamp,
                        Result: JSON.stringify(event.result),
                        TokenId: parseInt(event.result.tokenId)
                    },
                    transaction: trans
                });
                await trans.commit();
            }
            catch (err) {
                await trans.rollback();
                this.logger.error("IdolService.AuctionCancelled error %j", err);
            }
        }
    }

    async update(tokenId, idol, address, isSaleorRental, auction) {
        this.logger.info("IdolService.update tokenId = %j", tokenId);

        //获取ownerOf的userId
        let userId = await this.ctx.service.userService.getUserId(address);
        if (userId <= 0)
            return;

        let sql = "UPDATE idols SET ";
        if (isSaleorRental == 0)
            sql += "UserId=:userId, IsForSale=0, IsRental=0, ";
        sql += "Genes=:genes, BirthTime=:birthTime, Generation=:generation, CooldownIndex=:cooldownIndex, CooldownEndBlock=:cooldownEndBlock, MatronId=:matronId, SireId=:sireId, SiringWithId=:siringWithId, IsPregnant=:isPregnant WHERE TokenId=:tokenId; ";
        try {
            await this.ctx.model.query(sql, {
                raw: true,
                replacements: {
                    genes: TronWeb.toDecimal(idol.genes._hex),
                    birthTime: TronWeb.toDecimal(idol.birthTime._hex),
                    generation: TronWeb.toDecimal(idol.generation._hex),
                    cooldownIndex: TronWeb.toDecimal(idol.cooldownIndex._hex),
                    cooldownEndBlock: TronWeb.toDecimal(idol.nextActionAt._hex),
                    matronId: TronWeb.toDecimal(idol.matronId._hex),
                    sireId: TronWeb.toDecimal(idol.sireId._hex),
                    siringWithId: TronWeb.toDecimal(idol.siringWithId._hex),
                    isPregnant: idol.isGestating ? 1 : 0, //是否怀孕
                    tokenId: tokenId,
                    userId: userId
                }
            });
        }
        catch (err) {
            this.logger.error("IdolService.update error %j", err);
        }

        if (isSaleorRental == 1 || isSaleorRental == 2)
            this.updateAuction(tokenId, isSaleorRental, auction);
    }

    async getAuctionIdols() {
        let sql = "SELECT TokenId, UserId FROM idols WHERE IsForSale=1 OR IsRental=1 "; //27是拍卖合约，26是租赁合约
        let idols = await this.ctx.model.query(sql, {
            raw: true, model: this.ctx.model.IdolModel, replacements: {}
        });

        return idols;
    }

    async updateAuction(tokenId, isSaleorRental, auction) {
        this.logger.info("IdolService.updateAuction tokenId = %j", tokenId);

        //获取seller的userId
        let userId = await this.ctx.service.userService.getUserId(TronWeb.address.fromHex(auction.seller));
        if (userId <= 0)
            return;

        let sql = "UPDATE idols SET UserId=:userId,";

        if (isSaleorRental == 1)
            sql += "IsForSale=1, IsRental=0, ";
        else
            sql += "IsForSale=0, IsRental=1, ";

        sql += "Duration=:duration, StartingPrice=:startingPrice, EndingPrice=:endingPrice, StartedAt=:startedAt WHERE TokenId=:tokenId; ";

        try {
            await this.ctx.model.query(sql, {
                raw: true,
                replacements: {
                    duration: TronWeb.toDecimal(auction.duration._hex),
                    startingPrice: TronWeb.toDecimal(auction.startingPrice._hex),
                    endingPrice: TronWeb.toDecimal(auction.endingPrice._hex),
                    startedAt: TronWeb.toDecimal(auction.startedAt._hex),
                    tokenId: tokenId,
                    userId: userId
                }
            });
        }
        catch (err) {
            this.logger.error("IdolService.updateAuction error %j", err);
        }
    }

    async setIdolPreview(userId, tokenId, url) {
        //保存idol预览图片
        sql = "UPDATE idols SET PicPreview=:url WHERE UserId=:userId AND TokenId=:tokenId AND Pic='' ";
        let affectedRows = 0;
        try {
            let updates = await this.ctx.model.query(sql, {
                raw: true,
                replacements: {
                    userId: userId,
                    tokenId: tokenId,
                    url: url
                }
            });
            if (updates != null && updates.length > 0) {
                updates.forEach(function (item, i) {
                    if (item.affectedRows == undefined || item.affectedRows == 0) {
                        return true;
                    }
                    affectedRows = affectedRows + item.affectedRows;
                });
            }
        }
        catch (err) {
            this.logger.error("IdolService.setIdolPreview error %j", err);
        }

        return affectedRows;
    }

    requestAsync(url) {
        var request = require('request');
        return new Promise((resolve, reject) => {
            request({
                url: url
            }, (err, res, body) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(body);
                }
            })
        });
    }


    async useRequestPromise(url) {
        const rp = require('request-promise');

        let options = {
            url: url,
            method: "GET",
            encoding: null,
            headers: {
                'Accept-Encoding': 'gzip, deflate'
            }
        };
        let rpbody = await rp(options);
        return rpbody;
    }

    async aa() {

        const util = require('util');
        const getPromise = util.promisify(request.get);

        let result = await getPromise({
            url: url,
            method: "GET",
            encoding: null,
            headers: {
                'Accept-Encoding': 'gzip, deflate'
            }
        });

        //1：  原生写法  无auth 参数
        getPromise(url).then(async (value) => {
            try {
                // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
                let filename = utility.randomString(false, 16);
                let file = '/idol/' + filename + '.png';
                let r1 = await client.put(file, body);
                console.log('put success: %j', r1);
            } catch (e) {
                console.error('error: %j', err);
            }

            //console.log("value" , value );
        }).catch((err) => {
            //console.log("err" , err );
        });
    }

    async setIdol(userId, tokenId, id) {
        let ctx = this.ctx;
        let idol = await this.ctx.model.IdolModel.findOne({ where: { TokenId: tokenId, UserId: userId } });
        if (idol == null || idol.Pic != "") //没有或者已经上传
            return -1;

        let url = 'http://47.74.229.37:8000/static/images/transferred_faces/' + id + '_0.png';
        let filename = utility.randomString(false, 16);
        let file = '/idol/' + filename + '.png';

        let client = new OSS({
            region: this.config.oss.region,
            accessKeyId: this.config.oss.accessKeyId,
            accessKeySecret: this.config.oss.accessKeySecret,
            bucket: this.config.oss.bucket
        });

        const request = require('request');
        //拉取GAN图片
        request({
            url: url,
            method: "GET",
            encoding: null,
            headers: {
                'Accept-Encoding': 'gzip, deflate'
            }
        }, async function (error, response, body) {
            if (error) {
                this.logger.error('IdolService.setIdol error1: %j', error);
                return;
            }
            if (response.statusCode == 200) {
                try {
                    //上传阿里云
                    let result = await client.put(file, body);
                    if (result.res.status == 200)
                        await idol.update({ Pic: file });
                    // //保存数据库
                    // let sql = "UPDATE idols SET Pic=:file WHERE UserId=:userId AND TokenId=:tokenId AND Pic='' ";
                    // let update = await ctx.model.query(sql, {
                    //     raw: true,
                    //     model: ctx.model.IdolModel,
                    //     replacements: {
                    //         userId: userId,
                    //         tokenId: tokenId,
                    //         file: file
                    //     }
                    // });
                } catch (err) {
                    ctx.logger.error('IdolService.setIdol error2: %j', err);
                }
            }
        });

        return file;
    };

    async setName(tokenId, name, userId) {
        let idol = await this.ctx.model.IdolModel.findOne({ where: { TokenId: tokenId, UserId: userId } });
        if (idol == null)
            return -1;

        let rtn = 0;
        await idol.update({ NickName: name }).catch(errors => {
            rtn = -2;
        });

        return rtn;
    };

    async setBio(tokenId, bio, userId) {
        let idol = await this.ctx.model.IdolModel.findOne({ where: { TokenId: tokenId, UserId: userId } });
        if (idol == null)
            return -1;

        let rtn = 0;
        await idol.update({ Bio: bio }).catch(errors => {
            rtn = -2;
        });

        return rtn;
    };

    async getIdol(tokenId, userId) {
        const ctx = this.ctx;
        let sql;
        if (userId > 0)
            sql = 'SELECT i.TokenId, NickName, i.UserId, Genes, BirthTime, Bio, Generation, Pic, CooldownIndex, CooldownEndBlock, MatronId, SireId,ul.Id AS LikeId, HairColor,EyeColor,HairStyle,LikeCount,users.Address,users.UserName, '
                + '(SELECT GROUP_CONCAT(Attribute) FROM idolattributes WHERE idolattributes.TokenId=i.TokenId GROUP BY TokenId) AS Attributes, ' //Attributes行列转换
                //+ '(SELECT GROUP_CONCAT(Label) FROM idollabels WHERE idollabels.TokenId=i.TokenId GROUP BY TokenId) AS Labels, ' //Labels行列转换
                + 'IsForSale,StartedAt,StartingPrice,EndingPrice,Duration,IsRental,IsPregnant '
                + 'FROM idols i '
                + 'LEFT OUTER JOIN userlikes ul ON i.TokenId=ul.TokenId AND ul.UserId=:UserId '
                + 'LEFT OUTER JOIN users ON i.UserId = users.UserId '
                + 'WHERE i.TokenId=:TokenId AND i.`Status`=0;';
        else
            sql = 'SELECT TokenId, NickName, idols.UserId, Genes, BirthTime, Bio, Generation, Pic, CooldownIndex, CooldownEndBlock, MatronId, SireId, 0 AS LikeId, HairColor,EyeColor,HairStyle,LikeCount,users.Address,users.UserName, '
                + '(SELECT GROUP_CONCAT(Attribute) FROM idolattributes WHERE idolattributes.TokenId=idols.TokenId GROUP BY TokenId) AS Attributes, ' //Attributes行列转换
                //+ '(SELECT GROUP_CONCAT(Label) FROM idollabels WHERE idollabels.TokenId=i.TokenId GROUP BY TokenId) AS Labels, ' //Labels行列转换    
                + 'IsForSale,StartedAt,StartingPrice,EndingPrice,Duration,IsRental,IsPregnant '
                + 'FROM idols '
                + 'LEFT OUTER JOIN users ON idols.UserId = users.UserId '
                + 'WHERE TokenId=:TokenId AND idols.`Status`=0;';

        let idols = await ctx.model.query(sql, { raw: true, model: ctx.model.IdolModel, replacements: { TokenId: tokenId, UserId: userId } });
        if (idols != null && idols.length > 0) {
            let idol = idols[0];
            //idol.Attributes = "smile,open mouth"; //todo
            //idol.Labels = "cute,queen"; //todo
            idol.IsReady = 0;
            if (idol.CooldownEndBlock < this.config.currentBlockNumber)
                idol.IsReady = 1;

            return idol;
        }
        return null;
    };

    async getIdolList(ownerUserId, userId, category, hairColors, eyeColors, hairStyles, attributes, filters, sort, offset, limit) {
        let isForSale = 0;
        let isRental = 0;

        if (category == "forsale")
            isForSale = 1;

        if (category == "rental")
            isRental = 1;

        //?category=new&sort=price&attributes=hasname,hasbio,cooldownready,dark skin,blush,smile,open mouth,hat,ribbon,glasses
        //&filters=iteration:1~2,cooldown:ur|ssr|sr|r|n,price:1~2,liked:0x834721d79edcf0851505bf47c605607030b086c1

        const ctx = this.ctx;
        let sql = 'SELECT SQL_CALC_FOUND_ROWS TokenId, NickName, UserId, Genes, BirthTime, Bio, Generation, Pic, CooldownIndex, CooldownEndBlock, MatronId, SireId, HairColor,EyeColor,HairStyle,LikeCount, '
            + 'IsForSale,StartedAt,StartingPrice,EndingPrice,Duration,IsRental,IsPregnant '
            + 'FROM idols '
            + 'WHERE `Status`=0 AND (0=:OwnerUserId OR UserId=:OwnerUserId) '
            + 'AND (0=:isForSale OR IsForSale=:isForSale) '
            + 'AND (0=:isRental OR IsRental=:isRental) ';


        //已做检查防止sql注入
        if (hairColors != undefined) {
            let sqlHairColors = "AND HairColor IN (";
            hairColors.split(",").forEach(color => {
                if (idolAttributes.HairColors.indexOf(color) >= 0) {
                    sqlHairColors += "'" + color + "',";
                }
            });
            sqlHairColors = sqlHairColors.substring(0, sqlHairColors.lastIndexOf(","));
            sqlHairColors += ") ";
            sql += sqlHairColors;
        }

        if (eyeColors != undefined) {
            let sqlEyeColors = "AND EyeColor IN (";
            eyeColors.split(",").forEach(color => {
                if (idolAttributes.EyeColors.indexOf(color) >= 0) {
                    sqlEyeColors += "'" + color + "',";
                }
            });
            sqlEyeColors = sqlEyeColors.trimRight(",");
            sqlEyeColors = sqlEyeColors.substring(0, sqlEyeColors.lastIndexOf(","));
            sqlEyeColors += ") ";
            sql += sqlEyeColors;
        }

        if (hairStyles != undefined) {
            let sqlHairStyles = "AND HairStyle IN (";
            hairStyles.split(",").forEach(style => {
                if (idolAttributes.HairStyles.indexOf(style) >= 0) {
                    sqlHairStyles += "'" + style + "',";
                }
            });
            sqlHairStyles = sqlHairStyles.substring(0, sqlHairStyles.lastIndexOf(","));
            sqlHairStyles += ") ";
            sql += sqlHairStyles;
        }

        let attrs;
        let cooldownready = 0; //冷却就绪
        let hasname = 0; //已命名
        let hasbio = 0; //已有简介
        let characteristics = new Array(); //特征

        if (attributes != undefined) {
            attrs = attributes.split(",");
            for (var i = 0; i < attrs.length; i++) {
                if (attrs[i] == "cooldownready") {
                    cooldownready = 1;
                    continue;
                }

                if (attrs[i] == "hasname") {
                    hasname = 1;
                    continue;
                }
                if (attrs[i] == "hasbio") {
                    hasbio = 1;
                    continue;
                }

                if (idolAttributes.Attributes.indexOf(attrs[i]) >= 0) {
                    characteristics.push(attrs[i]);
                    continue;
                }
            }
        }

        if (cooldownready == 1) {
            sql += " AND CooldownEndBlock<" + this.config.currentBlockNumber;
        }

        if (hasname === 1) {
            sql += " AND NickName IS NOT NULL AND NickName<>'' "
        }

        if (hasbio === 1) {
            sql += " AND Bio IS NOT NULL AND Bio<>'' "
        }

        //todo characteristics 特征


        let name = "";
        //代，冷却速度，价格，like
        if (filters != undefined) {
            let conditions = filters.split(",");

            let iterationStart = 0;
            let iterationEnd = 999999
            let cooldowns; //冷却速度
            let priceStart = 0;
            let priceEnd;
            let likeAddress;

            for (var i = 0; i < conditions.length; i++) {
                var conditionX = conditions[i].split(":");
                switch (conditionX[0]) {
                    case "iteration":
                        let iterations = conditionX[1].split("~");
                        iterationStart = parseInt(iterations[0]);
                        iterationEnd = iterations.length > 1 ? parseInt(iterations[1]) : 999999;
                        break;
                    case "cooldown":
                        cooldowns = conditionX[1].split("|");
                        break;
                    case "price":
                        let prices = conditionX[1].split("~");
                        priceStart = parseFloat(prices[0]);
                        if (prices.length > 1) {
                            priceEnd = parseFloat(prices[1]);
                        }
                        break;
                    case "liked":
                        likeAddress = conditionX[1];
                        break;
                    case "name":
                        name = conditionX[1];
                        break;
                }
            }

            //代
            sql += " AND Generation>=" + iterationStart + " AND Generation<=" + iterationEnd; //已做整形转换，防止sql注入

            //冷却速度
            if (cooldowns != undefined) {
                let sqlCooldowns = " AND CooldownIndex in (";
                let indexs = "";
                cooldowns.forEach(cooldown => {
                    let index = idolAttributes.Cooldowns.indexOf(cooldown);
                    if (index >= 0) {
                        switch (cooldown) {
                            //"ur", "ssr", "sr", "r", "n"
                            case "ur":
                                indexs += "0,1,2,3,";
                                break;
                            case "ssr":
                                indexs += "4,5,6,";
                                break;
                            case "sr":
                                indexs += "7,8,9,";
                                break;
                            case "r":
                                indexs += "10,11,";
                                break;
                            case "n":
                                indexs += "12,13,";
                                break;
                        }
                    }
                });
                if (indexs.length > 0) {
                    sqlCooldowns += indexs.substring(0, indexs.lastIndexOf(","));
                    sqlCooldowns += ") ";
                    sql += sqlCooldowns;
                }
            }

            //价格查询 todo

            //昵称name
            if (name != undefined) {
                sql += " AND NickName=:NickName ";
            }
        }

        //排序
        switch (sort) {
            case "id":
                sql += ' ORDER BY TokenId ';
                break;
            case "-id":
                sql += ' ORDER BY TokenId DESC ';
                break;

            case "iteration":
                sql += ' ORDER BY CreateDate ';
                break;
            case "-iteration":
                sql += ' ORDER BY CreateDate DESC ';
                break;

            //价格

            case "name":
                sql += ' ORDER BY NickName ';
                break;
            case "-name":
                sql += ' ORDER BY NickName DESC ';
                break;

            case "cooldown":
                sql += ' ORDER BY Cooldown ';
                break;
            case "-liked":  //人气，like点赞数量
                sql += ' ORDER BY LikeCount DESC ';
                break;
            case "newauction": //追加时间
                sql += ' ORDER BY CreateDate DESC ';
                break;
        }

        sql += ' LIMIT :offset, :limit; ';
        sql += 'SELECT FOUND_ROWS() AS Counts; ';
        let dbset = await ctx.model.query(sql, {
            raw: true, model: ctx.model.IdolModel, replacements:
                {
                    OwnerUserId: ownerUserId, UserId: userId, NickName: name, isForSale, isRental, offset, limit
                }
        });

        let idols = [];
        let count = 0;
        let tokenIds = "";
        if (dbset != null) {
            for (let idolIndex in dbset[0]) {
                let idol = dbset[0][idolIndex];
                idol.IsLike = 0;
                idols.push(idol); //属性
                tokenIds += idol.TokenId + ",";
            }
            count = dbset[1][0].Counts;
        }

        //查询是否点赞
        if (tokenIds !== "" && userId > 0) {
            tokenIds = tokenIds.substring(0, tokenIds.lastIndexOf(","));
            let sqlLikes = "SELECT Id,TokenId FROM userlikes WHERE UserId=:UserId AND TokenId IN(" + tokenIds + ");";
            let likes = await ctx.model.query(sqlLikes, { raw: true, model: ctx.model.UserLikeModel, replacements: { UserId: userId } });
            if (likes != null) {
                likes.forEach(like => {
                    for (var i = 0; i < idols.length; i++) {
                        if (like.TokenId == idols[i].TokenId) {
                            idols[i].IsLike = 1;
                            break;
                        }
                    }
                });
            }
        }

        let retObj = {
            count: count,
            rows: idols
        };

        return retObj;
    }

    async like(userId, tokenId) {
        let sql = 'UPDATE idols SET LikeCount=LikeCount+1 WHERE TokenId=:TokenId AND NOT EXISTS ( SELECT 1 FROM userlikes WHERE TokenId=:TokenId AND UserId=:UserId); '
            + 'INSERT INTO userlikes (UserId, TokenId, CreateDate) '
            + ' SELECT :UserId, :TokenId, UNIX_TIMESTAMP() FROM DUAL WHERE ROW_COUNT() > 0;';

        let affectedRows = 0;
        let trans = await this.ctx.model.transaction();
        try {
            let updates = await this.ctx.model.query(sql, {
                raw: true,
                model: this.ctx.model.IdolModel,
                replacements: { UserId: userId, TokenId: tokenId },
                transaction: trans
            });

            if (updates != null && updates.length > 0) {
                updates.forEach(function (item, i) {
                    if (item.affectedRows == undefined || item.affectedRows == 0) {
                        return true;
                    }
                    affectedRows = affectedRows + item.affectedRows;
                });
            }
            await trans.commit();
        }
        catch (err) {
            await trans.rollback();
            this.logger.error("IdolService.like error %j", err);
        }
        return affectedRows;
    }

    async unlike(userId, tokenId) {
        let sql = 'DELETE FROM userlikes WHERE TokenId=:TokenId AND UserId=:UserId; '
            + 'UPDATE idols SET LikeCount=LikeCount-1 WHERE TokenId=:TokenId AND LikeCount>0 AND ROW_COUNT() > 0;';

        let affectedRows = 0;
        let trans = await this.ctx.model.transaction();
        try {
            let updates = await this.ctx.model.query(sql, {
                raw: true,
                model: this.ctx.model.IdolModel,
                replacements: { UserId: userId, TokenId: tokenId },
                transaction: trans
            });

            if (updates != null && updates.length > 0) {
                updates.forEach(function (item, i) {
                    if (item.affectedRows == undefined || item.affectedRows == 0) {
                        return true;
                    }
                    affectedRows = affectedRows + item.affectedRows;
                });
            }
            await trans.commit();
        }
        catch (err) {
            await trans.rollback();
            this.logger.error("IdolService.unlike error %j", err);
        }
        return affectedRows;
    }

}

module.exports = IdolService;