module.exports = (sequelize, DataType) => {
  const Users = sequelize.define("Users", {
    id: {
      type: DataType.STRING,
      primaryKey: true,
    },
    username: {
      type: DataType.STRING(30),
      allowNull: false,
      unique: true,
      validate: {
        len: [5, 30],
      },
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
  });

  return Users;
};
