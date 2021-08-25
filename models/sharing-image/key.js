module.exports = function(sequelize, DataTypes) {
  return sequelize.define('key', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    key: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: 'key',
      is: /^[a-z0-9-]+$/i,
    },
    limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: new DataTypes.ENUM('valid', 'blocked', 'expired'),
      allowNull: false,
      defaultValue: 'valid',
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'keys',
  });
};
