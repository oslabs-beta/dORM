import { Model } from 'https://denoland';

const people = new Model('people', {
  _id: {
    autoIncrement: true,
    dataType: 'serial',
    nullable: false,
    primary_Key: true,
  },
  name: {
    datatype: 'varchar',
    nullable: false,
  },
  mass: {
    datatype: 'varchar',
    nullable: true,
  },
  hair_color: {
    datatype: 'varchar',
    nullable: true,
  },
  skin_color: {
    datatype: 'varchar',
    nullable: true,
  },
  eye_color: {
    datatype: 'varchar',
    nullable: true,
  },
  birth_year: {
    datatype: 'varchar',
    nullable: true,
  },
  gender: {
    datatype: 'varchar',
    nullable: true,
  },
  species_id: {
    datatype: 'bigint',
    nullable: true,
    references: {
      table: 'species',
      column: '_id',
    },
  },
  homeworld_id: {
    datatype: 'bigint',
    nullable: true,
    references: {
      table: 'planets',
      column: '_id',
    },
  },
  height: {
    datatype: 'integer',
    nullable: true,
  },
});
