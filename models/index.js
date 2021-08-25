const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false,
});

(async () => {
  await sequelize.sync({alter: true});
})();

const models = {};

models['sharing-image'] = {
  key: require('./sharing-image/key')(sequelize, DataTypes),
  host: require('./sharing-image/host')(sequelize, DataTypes),
};

models['sharing-image'].key.hasMany(models['sharing-image'].host);

module.exports = models;
