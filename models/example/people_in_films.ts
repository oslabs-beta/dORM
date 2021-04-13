const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'people_in_films',
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      person_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      film_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'people_in_films',
      schema: 'public',
      timestamps: false,
    }
  );
};
