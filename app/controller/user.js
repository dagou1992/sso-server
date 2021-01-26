'use strict';

const Controller = require('egg').Controller;

const sessionMaxAge = 24 * 60 * 60 * 1000;

class UserController extends Controller {
    async login() {
        const { ctx } = this;
        const { request, logger } = ctx;
        try {
            const result = await ctx.service.user.login(request.body);
            this.response(result);
        } catch (error) {
            logger.error(`magic-sso: login ===== ${error}`);
            this.response({ code: 300004 });
        }
    }

    async logout() {
        const { ctx } = this;
        const { logger, request } = ctx;
        const { token } = request.query;
        try {
          const result = await ctx.service.user.logout(token); 
          this.response(result);     
        } catch (error) {
            logger.error(`magic-sso: logout ===== ${error}`);
            this.response({ code: 300004 });
        }

    }

    async checkUser() {
        const { ctx } = this;
        const { logger, request } = ctx;
        const { token } = request.query;
        try {
            const result = await ctx.service.user.checkUser(token);
            this.response(result);
        } catch (error) {
            logger.error(`checkUser-${error}`);
            this.response({ code: 300004 });
        }
    }
    response(res) {
        this.ctx.body = res;
    }
}

module.exports = UserController;
