'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ZMoulds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      cycleTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Cycle time in seconds'
      },
      totalCavities: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      effectiveCavities: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      inputMaterialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZItems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add index on inputMaterialId for faster joins
    await queryInterface.addIndex('ZMoulds', ['inputMaterialId'], {
      name: 'zmoulds_input_material_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('ZMoulds', 'zmoulds_input_material_idx');
    await queryInterface.dropTable('ZMoulds');
  }
};
