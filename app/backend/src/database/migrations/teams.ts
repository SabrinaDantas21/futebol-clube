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
  },
  
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('teams');
  },
};
