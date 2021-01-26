'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.get('/css/*', controller.home.file);
  router.get('/js/*', controller.home.file);
  router.post('/login', controller.user.login);
  router.get('/logout', controller.user.logout);
  router.get('/checkUser', controller.user.checkUser);
};
