import { Model, QueryInterface, DataTypes } from 'sequelize';
import { Teams } from '../../Interfaces/Teams';

export default {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable<Model<Teams>>('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'team_name',
      },
    });

    await queryInterface.bulkInsert('teams', [
      { id: 1, team_name: 'Avaí/Kindermann' },
      { id: 2, team_name: 'Bahia' },
      { id: 3, team_name: 'Botafogo' },
      { id: 4, team_name: 'Corinthians' },
      { id: 5, team_name: 'Cruzeiro' },
      { id: 6, team_name: 'Ferroviária' },
      { id: 7, team_name: 'Flamengo' },
      { id: 8, team_name: 'Grêmio' },
      { id: 9, team_name: 'Internacional' },
      { id: 10, team_name: 'Minas Brasília' },
      { id: 11, team_name: 'Napoli-SC' },
      { id: 12, team_name: 'Palmeiras' },
      { id: 13, team_name: 'Real Brasília' },
      { id: 14, team_name: 'Santos' },
      { id: 15, team_name: 'São José-SP' },
      { id: 16, team_name: 'São Paulo' },
    ]);
  },
  
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('teams');
  },
};
