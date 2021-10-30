module.exports = (sequelize, DataTypes) => {
  return sequelize.define('host', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    domain: {
      type: new DataTypes.STRING(256),
      allowNull: false,
    },
    ip: {
      type: new DataTypes.STRING(45),
      allowNull: false,
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'hosts',
  });
};
