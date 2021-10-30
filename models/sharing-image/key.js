module.exports = (sequelize, DataTypes) => {
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
    email: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      unique: 'email',
      is: /@/i,
    },
    limit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: new DataTypes.ENUM('valid', 'blocked', 'pending'),
      allowNull: false,
      defaultValue: 'valid',
    },
  }, {
    sequelize,
    paranoid: true,
    tableName: 'keys',
  });
};
