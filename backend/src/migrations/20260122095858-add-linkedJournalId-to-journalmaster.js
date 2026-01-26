// migrations/YYYYMMDDHHMMSS-add-linkedJournalId-to-journalmaster.js

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('JournalMaster', 'linkedJournalId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'JournalMaster',
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
      comment: 'Links Petty Cash voucher to parent Journal Voucher'
    });

    // Add index for better query performance
    await queryInterface.addIndex('JournalMaster', ['linkedJournalId'], {
      name: 'idx_journalmaster_linkedJournalId'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('JournalMaster', 'idx_journalmaster_linkedJournalId');
    await queryInterface.removeColumn('JournalMaster', 'linkedJournalId');
  }
};
