var DataTypes = require('sequelize').DataTypes;
var _people = require('./people');
var _films = require('./films');
var _people_in_films = require('./people_in_films');
var _pilots = require('./pilots');
var _planets = require('./planets');
var _planets_in_films = require('./planets_in_films');
var _species = require('./species');
var _species_in_films = require('./species_in_films');
var _starship_specs = require('./starship_specs');
var _vessels = require('./vessels');
var _vessels_in_films = require('./vessels_in_films');

function initModels(sequelize) {
  var people = _people(sequelize, DataTypes);
  var people_in_films = _people_in_films(sequelize, DataTypes);
  var pilots = _pilots(sequelize, DataTypes);
  var films = _films(sequelize, DataTypes);
  var planets = _planets(sequelize, DataTypes);
  var planets_in_films = _planets_in_films(sequelize, DataTypes);
  var species = _species(sequelize, DataTypes);
  var species_in_films = _species_in_films(sequelize, DataTypes);
  var starship_specs = _starship_specs(sequelize, DataTypes);
  var vessels = _vessels(sequelize, DataTypes);
  var vessels_in_films = _vessels_in_films(sequelize, DataTypes);

  people_in_films.belongsTo(films, { as: 'film', foreignKey: 'film_id' });
  films.hasMany(people_in_films, {
    as: 'people_in_films',
    foreignKey: 'film_id',
  });
  people_in_films.belongsTo(people, { as: 'person', foreignKey: 'person_id' });
  people.hasMany(people_in_films, {
    as: 'people_in_films',
    foreignKey: 'person_id',
  });
  planets_in_films.belongsTo(films, { as: 'film', foreignKey: 'film_id' });
  films.hasMany(planets_in_films, {
    as: 'planets_in_films',
    foreignKey: 'film_id',
  });
  species_in_films.belongsTo(films, { as: 'film', foreignKey: 'film_id' });
  films.hasMany(species_in_films, {
    as: 'species_in_films',
    foreignKey: 'film_id',
  });
  vessels_in_films.belongsTo(films, { as: 'film', foreignKey: 'film_id' });
  films.hasMany(vessels_in_films, {
    as: 'vessels_in_films',
    foreignKey: 'film_id',
  });
  pilots.belongsTo(people, { as: 'person', foreignKey: 'person_id' });
  people.hasMany(pilots, { as: 'pilots', foreignKey: 'person_id' });
  people.belongsTo(planets, { as: 'homeworld', foreignKey: 'homeworld_id' });
  planets.hasMany(people, { as: 'people', foreignKey: 'homeworld_id' });
  planets_in_films.belongsTo(planets, {
    as: 'planet',
    foreignKey: 'planet_id',
  });
  planets.hasMany(planets_in_films, {
    as: 'planets_in_films',
    foreignKey: 'planet_id',
  });
  species.belongsTo(planets, { as: 'homeworld', foreignKey: 'homeworld_id' });
  planets.hasMany(species, { as: 'speciess', foreignKey: 'homeworld_id' });
  people.belongsTo(species, { as: 'species', foreignKey: 'species_id' });
  species.hasMany(people, { as: 'people', foreignKey: 'species_id' });
  species_in_films.belongsTo(species, {
    as: 'species',
    foreignKey: 'species_id',
  });
  species.hasMany(species_in_films, {
    as: 'species_in_films',
    foreignKey: 'species_id',
  });
  pilots.belongsTo(vessels, { as: 'vessel', foreignKey: 'vessel_id' });
  vessels.hasMany(pilots, { as: 'pilots', foreignKey: 'vessel_id' });
  starship_specs.belongsTo(vessels, { as: 'vessel', foreignKey: 'vessel_id' });
  vessels.hasMany(starship_specs, {
    as: 'starship_specs',
    foreignKey: 'vessel_id',
  });
  vessels_in_films.belongsTo(vessels, {
    as: 'vessel',
    foreignKey: 'vessel_id',
  });
  vessels.hasMany(vessels_in_films, {
    as: 'vessels_in_films',
    foreignKey: 'vessel_id',
  });

  return {
    films,
    people,
    people_in_films,
    pilots,
    planets,
    planets_in_films,
    species,
    species_in_films,
    starship_specs,
    vessels,
    vessels_in_films,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
