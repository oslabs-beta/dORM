const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'films',
    {
      _id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      episode_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      opening_crawl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      director: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      producer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      release_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'films',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'films_pk',
          unique: true,
          fields: [{ name: '_id' }],
        },
      ],
    }
  );
};
