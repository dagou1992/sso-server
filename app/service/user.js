const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');
const rq = require('request-promise');
const { SYSTEM } = require('../constant');

const sessionMaxAge = 24 * 60 * 60 * 1000;

class UserService extends Service {
    async login({ username, password }) {
        const { ctx, app } = this;
        const { logger } = ctx;
        try {
            const user = {
                username: "admin",
                password: '123',
            };

            if (!user) {
                return { code: 200003 };
            }
            const token = uuidv4();
            if (user.password !== password) {
                return { code: 200002 };
            }
            Reflect.deleteProperty(user, 'password');
            await app.redis.set(token, JSON.stringify({ ...user, logined: [] }), 'PX', sessionMaxAge);
            ctx.cookies.set('userInfoToken', token, {
                maxAge: sessionMaxAge,
                httpOnly: false,
            });
            logger.info(`magic sso: ${username} 登录成功`);
            return { code: 100001, token, list: SYSTEM };
        } catch (error) {
            logger.error(`magic sso: ${username} login ===== ${error}`);
            return { code: 300004 };
        }
    }

    async checkUser(token) {
        const { ctx, app } = this;
        const { header: { origin } } = ctx;
        let user = await app.redis.get(token);
        if (!user) {
            this.response({ code: 200001 });
            return;
        }
        user = JSON.parse(user);
        const logined = new Set(user.logined);
        user.logined = [...logined];
        await app.redis.set(token, JSON.stringify(user), 'PX', sessionMaxAge);
        Reflect.deleteProperty(user, 'logined');
        return { data: {...user, list: SYSTEM}, code: 100001 };
    }

    async logout(token) {
        const { ctx, ctx: { logger }, app } = this;
        try {
            const user = await app.redis.get(token);
            if (user) {
                const { logined } = JSON.parse(user);
                console.log(logined)
                await Promise.all(logined.map(url => url && rq({
                    uri: `http://${url}/logout?token=${token}`,
                    method: 'GET',
                })));
                await app.redis.del(token);
                ctx.cookies.set('userInfoToken', null);
                logger.info(`magic sso: ${token} logout`);
            }
            return { code: 100001 };
        } catch (error) {
            logger.error(`magic sso: logout ===== ${error}`);
            return { code: 300004 };
        }
    }
}

module.exports = UserService;