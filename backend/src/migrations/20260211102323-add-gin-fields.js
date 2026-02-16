

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add fields to zginmain
    await queryInterface.addColumn('zginmain', 'coa_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'zcoas',
        key: 'id'
      }
    });

    await queryInterface.addColumn('zginmain', 'gin_date', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    // Add fields to zgindetail
    await queryInterface.addColumn('zgindetail', 'batchno', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addColumn('zgindetail', 'issue_uom1_qty', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('zgindetail', 'issue_uom2_qty', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('zgindetail', 'issue_uom3_qty', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('zgindetail', 'actual_used', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('zgindetail', 'actual_used_uom1', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('zgindetail', 'actual_used_uom2', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0
    });

    await queryInterface.addColumn('zgindetail', 'actual_used_uom3', {
      type: Sequelize.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('zginmain', 'coa_id');
    await queryInterface.removeColumn('zginmain', 'gin_date');
    await queryInterface.removeColumn('zgindetail', 'batchno');
    await queryInterface.removeColumn('zgindetail', 'issue_uom1_qty');
    await queryInterface.removeColumn('zgindetail', 'issue_uom2_qty');
    await queryInterface.removeColumn('zgindetail', 'issue_uom3_qty');
    await queryInterface.removeColumn('zgindetail', 'actual_used');
    await queryInterface.removeColumn('zgindetail', 'actual_used_uom1');
    await queryInterface.removeColumn('zgindetail', 'actual_used_uom2');
    await queryInterface.removeColumn('zgindetail', 'actual_used_uom3');
  }
};
