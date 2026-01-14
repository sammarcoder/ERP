'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ZMouldings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      // Basic Information
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      machineId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZMachines',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      operatorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZEmployees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      shiftId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZShifts',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      startTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      endTime: {
        type: Sequelize.TIME,
        allowNull: false
      },

      // Shutdown/Downtime (INTEGER - minutes)
      shutdownElectricity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Electricity downtime in minutes'
      },
      shutdownMachine: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Machine breakdown time in minutes'
      },
      shutdownNamaz: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Prayer break time in minutes'
      },
      shutdownMould: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Mould issue time in minutes'
      },
      shutdownOther: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
        comment: 'Other downtime in minutes'
      },

      // Counter Readings
      counterOne: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      counterTwo: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      finalCounter: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: 'Calculated: counterTwo - counterOne'
      },

      // Mould & Production
      mouldId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZMoulds',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      selectedOutputMaterialId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZItems',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      inputQty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      outputQty: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      qualityCheckerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ZEmployees',
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

    // Add indexes for faster queries
    await queryInterface.addIndex('ZMouldings', ['date'], { name: 'zmouldings_date_idx' });
    await queryInterface.addIndex('ZMouldings', ['machineId'], { name: 'zmouldings_machine_idx' });
    await queryInterface.addIndex('ZMouldings', ['operatorId'], { name: 'zmouldings_operator_idx' });
    await queryInterface.addIndex('ZMouldings', ['shiftId'], { name: 'zmouldings_shift_idx' });
    await queryInterface.addIndex('ZMouldings', ['mouldId'], { name: 'zmouldings_mould_idx' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('ZMouldings', 'zmouldings_date_idx');
    await queryInterface.removeIndex('ZMouldings', 'zmouldings_machine_idx');
    await queryInterface.removeIndex('ZMouldings', 'zmouldings_operator_idx');
    await queryInterface.removeIndex('ZMouldings', 'zmouldings_shift_idx');
    await queryInterface.removeIndex('ZMouldings', 'zmouldings_mould_idx');
    await queryInterface.dropTable('ZMouldings');
  }
};
