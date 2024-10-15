import { Model, QueryInterface, DataTypes } from 'sequelize';
import Users from '../../Interfaces/Users';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<Users>>('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    });
  },

  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('users');
  },
};
