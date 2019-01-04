'use strict';
const message = require('../../config/message');
const idolAttributes = require("../../config/idolAttributes");
const Controller = require('egg').Controller;

class IdolController extends Controller {

    async setName() {
        const ctx = this.ctx;
        const { tokenId, name } = ctx.request.body;
        let msg = message.returnObj('zh');

        if (tokenId == undefined || name == undefined || parseInt(tokenId).toString() == "NaN") {
            ctx.body = msg.parameterError;
            return;
        }

        if (ctx.user.UserId == 0) {
            ctx.body = msg.notLogin;
            return;
        }

        let ret = await ctx.service.idolService.setName(parseInt(tokenId), name, ctx.user.UserId);

        if (ret == 0)
            ctx.body = msg.success;
        else if (ret == -1)
            ctx.body = msg.idolUpdateDenied
        else
            ctx.body = msg.idolUpdateFailure
    }

    async setBio() {
        const ctx = this.ctx;
        const { tokenId, bio } = ctx.request.body;
        let msg = message.returnObj('zh');

        if (tokenId == undefined || bio == undefined || parseInt(tokenId).toString() == "NaN") {
            ctx.body = msg.parameterError;
            return;
        }

        if (ctx.user.UserId == 0) {
            ctx.body = msg.notLogin;
            return;
        }

        let ret = await ctx.service.idolService.setBio(parseInt(tokenId), bio, ctx.user.UserId);

        if (ret == 0)
            ctx.body = msg.success;
        else if (ret == -1)
            ctx.body = msg.idolUpdateDenied
        else
            ctx.body = msg.idolUpdateFailure
    }


    async getIdol() {
        const ctx = this.ctx;
        const tokenId = parseInt(ctx.query.tokenId);
        let msg = message.returnObj('zh');

        if (tokenId.toString() == "NaN") {
            ctx.body = msg.parameterError;
            return;
        }

        let idol = await ctx.service.idolService.getIdol(tokenId, ctx.user.UserId);

        if (idol != null && idol.TokenId > 0) {

            if (idol.LikeId == null || idol.LikeId == 0)
                idol.IsLike = 0;
            else
                idol.IsLike = 1;

            let retObj = msg.success;
            retObj.data = idol;
            ctx.body = retObj;
        }
        else {
            ctx.body = msg.idolNotFound;
        }
    };

    async getMyIdols() {
        await this.getIdolList(this.ctx.user.UserId, this.ctx.user.UserId);
    }

    async getMarketIdols() {
        await this.getIdolList(0, this.ctx.user.UserId);
    }

    async getIdolList(ownerUserId, userId) {
        const ctx = this.ctx;
        const { category, hairColors, eyeColors, hairStyles, attributes, filters, sort } = ctx.query;

        const page = ctx.query.page == undefined ? 1 : parseInt(ctx.query.page);
        const pageSize = ctx.query.pageSize == undefined ? 10 : parseInt(ctx.query.pageSize);

        const limit = pageSize < 1 ? 10 : pageSize;
        const offset = (page < 1 ? 0 : page - 1) * limit;

        let idols = await ctx.service.idolService.getIdolList(ownerUserId, userId, category, hairColors, eyeColors, hairStyles, attributes, filters, sort, offset, limit);

        ctx.body = { code: 0, message: '', data: idols };
        ctx.stats = 200;
    }

    async like() {
        const ctx = this.ctx;
        const { tokenId } = ctx.request.body;

        let msg = message.returnObj('zh');

        if (parseInt(tokenId).toString() == "NaN") {
            ctx.body = msg.parameterError;
            return;
        }

        if (ctx.user.UserId == 0) {
            ctx.body = msg.notLogin;
            return;
        }

        let rows = await ctx.service.idolService.like(ctx.user.UserId, parseInt(tokenId));
        if (rows > 0)
            ctx.body = msg.success;
        else
            ctx.body = msg.failure;
    }

    async unlike() {
        const ctx = this.ctx;
        const { tokenId } = ctx.request.body;

        let msg = message.returnObj('zh');

        if (parseInt(tokenId).toString() == "NaN") {
            ctx.body = msg.parameterError;
            return;
        }

        if (ctx.user.UserId == 0) {
            ctx.body = msg.notLogin;
            return;
        }

        let rows = await ctx.service.idolService.unlike(ctx.user.UserId, parseInt(tokenId));
        if (rows > 0)
            ctx.body = msg.success;
        else
            ctx.body = msg.failure;
    }
}

module.exports = IdolController;
