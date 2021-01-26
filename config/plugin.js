'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  ejs: {
    enable: true,
    package: 'egg-view-ejs',
  },
};
