import { Model, QueryInterface, DataTypes } from 'sequelize';
import { Teams } from '../../Interfaces/Teams';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<Teams>>('teams', {
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
    },);
  },
  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('teams');
  },
};