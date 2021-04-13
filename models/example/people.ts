const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'people',
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mass: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hair_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      skin_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      eye_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birth_year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      species_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'species',
          key: '_id',
        },
      },
      homeworld_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'planets',
          key: '_id',
        },
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'people',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'people_pk',
          unique: true,
          fields: [{ name: '_id' }],
        },
      ],
    }
  );
};
