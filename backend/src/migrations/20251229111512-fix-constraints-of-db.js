'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableName = 'order_main';

    // --- CLEANUP: Remove redundant FOREIGN KEY constraints ---
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_1\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_3\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_5\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_7\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_9\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_11\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_13\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_2\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_4\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_6\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_8\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_10\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_12\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`order_main_ibfk_14\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP FOREIGN KEY \`Order_Main_Transporter_ID_foreign_idx\`;`);

    //stk_main table foreign keys cleanup
    await queryInterface.sequelize.query(`ALTER TABLE \`stk_main\` DROP FOREIGN KEY \`stk_main_ibfk_1\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`stk_main\` DROP FOREIGN KEY \`stk_main_ibfk_2\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`stk_main\` DROP FOREIGN KEY \`stk_main_ibfk_3\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`stk_main\` DROP FOREIGN KEY \`stk_main_ibfk_4\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`stk_main\` DROP FOREIGN KEY \`Stk_main_Transporter_ID_foreign_idx\`;`);






    //stk_detail table 
    await queryInterface.sequelize.query(`ALTER TABLE \`stk_detail\` DROP FOREIGN KEY \`fk_stkdetail_batchno_zcoa\`;`);

    // --- CLEANUP: Remove redundant UNIQUE KEY constraints for 'Number' column ---
    // Note: We leave the first 'Number' index intact as it is the original primary constraint, 
    //       but we can also drop it and re-add it for maximum cleanliness.
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`Number\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`Number_2\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`Number_3\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`Number_4\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`Number_5\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`Number_6\`;`);
    await queryInterface.sequelize.query(`ALTER TABLE \`${tableName}\` DROP INDEX \`Number_7\`;`);

    // --- ADD: A single, correct UNIQUE constraint for 'Number' column ---
    await queryInterface.addConstraint(tableName, {
      fields: ['Number'],
      type: 'unique',
      name: 'unique_order_main_number'
    });

    // --- ADD: A single, correct Stock_Type_ID constraint with ON DELETE RESTRICT ---
    await queryInterface.addConstraint(tableName, {
      fields: ['Stock_Type_ID'],
      type: 'foreign key',
      references: { table: 'zvouchertype', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_order_main_stock_type_restrict'
    });

    // --- ADD: A single, correct COA_ID constraint ---
    await queryInterface.addConstraint(tableName, {
      fields: ['COA_ID'],
      type: 'foreign key',
      references: { table: 'zcoas', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // MySQL default
      name: 'fk_order_main_coa_id_restrict'
    });

    await queryInterface.addConstraint(tableName, {
      fields: ['Transporter_ID'],
      type: 'foreign key',
      references: { table: 'ztransporter', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT', // MySQL default
      name: 'fk_order_main_transporter_id_restrict'
    });





    // starting the stk main table cleanupawait queryInterface.addConstraint(tableName, {
    await queryInterface.addConstraint('stk_main', {
      fields: ['Stock_Type_ID'],
      type: 'foreign key',
      references: { table: 'zvouchertype', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_stk_main_sotck_id_restrict'
    });

    await queryInterface.addConstraint('stk_main', {
      fields: ['COA_ID'],
      type: 'foreign key',
      references: { table: 'zcoas', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_stk_main_coa_id_restrict'
    });

    await queryInterface.addConstraint('stk_main', {
      fields: ['Carriage_ID'],
      type: 'foreign key',
      references: { table: 'zcoas', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_stk_main_carrige_id_restrict'
    });

    await queryInterface.addConstraint('stk_main', {
      fields: ['Order_Main_ID'],
      type: 'foreign key',
      references: { table: 'order_main', field: 'ID' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_stk_main_order_id_restrict'
    });

    await queryInterface.addConstraint('stk_main', {
      fields: ['Transporter_ID'],
      type: 'foreign key',
      references: { table: 'ztransporter', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_stk_main_transporter_id_restrict'
    });



    //
    await queryInterface.addConstraint('stk_detail', {
      fields: ['batchno'],
      type: 'foreign key',
      references: { table: 'zcoas', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_stk_main_batch_id_restrict'
    });

    await queryInterface.addConstraint('stk_detail', {
      fields: ['Item_ID'],
      type: 'foreign key',
      references: { table: 'zitems', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
      name: 'fk_stk_main_items_id_restrict'
    });



  },

  down: async (queryInterface, Sequelize) => {
    const tableName = 'order_main';
    // --- REMOVE: The constraints we added in 'up' ---
    await queryInterface.removeConstraint(tableName, 'unique_order_main_number');
    await queryInterface.removeConstraint(tableName, 'fk_order_main_stock_type_restrict');
    await queryInterface.removeConstraint(tableName, 'fk_order_main_coa_id_restrict');
    await queryInterface.removeConstraint('stk_main', 'fk_stk_main_sotck_id_restrict');
    await queryInterface.removeConstraint('stk_main', 'fk_stk_main_coa_id_restrict');
    await queryInterface.removeConstraint('stk_main', 'fk_stk_main_carrige_id_restrict');
    await queryInterface.removeConstraint('stk_main', 'fk_stk_main_order_id_restrict');
    await queryInterface.removeConstraint('stk_main', 'fk_stk_main_transporter_id_restrict');
    await queryInterface.removeConstraint('stk_detail', 'fk_stk_main_batch_id_restrict');
    await queryInterface.removeConstraint('stk_detail', 'fk_stk_main_items_id_restrict');
    
    // Note: Re-adding the old constraints is complex and may require knowledge of their original definitions.
    // For simplicity, we are not re-adding them here. In a real scenario, you would need to store their definitions.

  }
};