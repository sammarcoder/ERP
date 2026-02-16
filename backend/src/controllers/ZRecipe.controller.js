// controllers/ZRecipe.controller.js

const ZRecipeMain = require('../models/ZRecipeMain.model');
const ZRecipeDetail = require('../models/ZRecipeDetail.model');
const ZItems = require('../models/zItems.model');
const Uom = require('../models/zUom.model');
const sequelize = require('../../config/database');
const { Op } = require('sequelize');
const { time } = require('console');

// =============================================
// GET ALL RECIPES
// =============================================
const getAll = async (req, res) => {
  try {
    const recipes = await ZRecipeMain.findAll({
      include: [
        {
          model: ZItems,
          as: 'item',
          attributes: ['id', 'itemName']
        },
        {
          model: Uom,
          as: 'uom',
          attributes: ['id', 'uom']
        },
        {
          model: ZRecipeDetail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName']
            },
            {
              model: Uom,
              as: 'uom',
              attributes: ['id', 'uom']
            }
          ]
        }
      ],
      order: [['id', 'DESC']]
    });

    res.json({
      success: true,
      data: recipes
    });

  } catch (error) {
    console.error('❌ Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipes',
      error: error.message
    });
  }
};

//  Update getById

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await ZRecipeMain.findByPk(id, {
      include: [
        {
          model: ZItems,
          as: 'item',
          attributes: [
            'id', 'itemName', 'skuUOM', 'uom1_qyt',
            'uom2', 'uom2_qty', 'uom3', 'uom3_qty'  // ✅ Added UOM qty fields
          ],
          include: [
            { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
            { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
          ]
        },
        {
          model: Uom,
          as: 'uom',
          attributes: ['id', 'uom']
        },
        {
          model: ZRecipeDetail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: [
                'id', 'itemName', 'skuUOM', 'uom1_qyt',
                'uom2', 'uom2_qty', 'uom3', 'uom3_qty'  // ✅ Added UOM qty fields
              ],
              include: [
                { model: Uom, as: 'uom1', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomTwo', attributes: ['id', 'uom'] },
                { model: Uom, as: 'uomThree', attributes: ['id', 'uom'] }
              ]
            },
            {
              model: Uom,
              as: 'uom',
              attributes: ['id', 'uom']
            }
          ]
        }
      ]
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    res.json({
      success: true,
      data: recipe
    });

  } catch (error) {
    console.error('❌ Error fetching recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipe',
      error: error.message
    });
  }
};

// =============================================
// GET RECIPE BY ITEM ID
// =============================================
const getByItemId = async (req, res) => {
  try {
    const { itemId } = req.params;

    const recipe = await ZRecipeMain.findOne({
      where: { Item_id: itemId },
      include: [
        {
          model: ZItems,
          as: 'item',
          attributes: ['id', 'itemName']
        },
        {
          model: Uom,
          as: 'uom',
          attributes: ['id', 'uom']
        },
        {
          model: ZRecipeDetail,
          as: 'details',
          include: [
            {
              model: ZItems,
              as: 'item',
              attributes: ['id', 'itemName']
            },
            {
              model: Uom,
              as: 'uom',
              attributes: ['id', 'uom']
            }
          ]
        }
      ]
    });

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found for this item'
      });
    }

    res.json({
      success: true,
      data: recipe
    });

  } catch (error) {
    console.error('❌ Error fetching recipe by item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recipe',
      error: error.message
    });
  }
};


// =============================================
// CREATE RECIPE
// =============================================
const create = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { Item_id, qty, Uom_Id, timeRequired, details = [] } = req.body;  

    // Validate required fields
    if (!Item_id) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Item is required'
      });
    }
    console.log(`Time required for recipe: ${timeRequired}`);

    // Check if recipe already exists for this item
    const existingRecipe = await ZRecipeMain.findOne({
      where: { Item_id },
      transaction
    });

    if (existingRecipe) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Recipe already exists for this item'
      });
    }

    // Create main recipe
    const recipe = await ZRecipeMain.create({
      Item_id,
      qty: qty || 1,
      Uom_Id: Uom_Id || null,
      timeRequired: timeRequired || 0, 
      status: true
    }, { transaction });

    // Create details
    if (details.length > 0) {
      const detailRecords = details.map(detail => ({
        zRp_Main_id: recipe.id,
        Item_id: detail.Item_id,
        qty: detail.qty || 1,
        Uom_Id: detail.Uom_Id || null
      }));

      await ZRecipeDetail.bulkCreate(detailRecords, { transaction });
    }

    await transaction.commit();
    committed = true;

    // Fetch complete recipe with associations
    const completeRecipe = await ZRecipeMain.findByPk(recipe.id, {
      include: [
        { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
        { model: Uom, as: 'uom', attributes: ['id', 'uom'] },
        {
          model: ZRecipeDetail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
            { model: Uom, as: 'uom', attributes: ['id', 'uom'] }
          ]
        }
      ]
    });

    console.log(`✅ Recipe created: ID=${recipe.id}, Item=${Item_id}, Details=${details.length}`);

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: completeRecipe
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('❌ Error creating recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create recipe',
      error: error.message
    });
  }
};

// =============================================
// UPDATE RECIPE
// =============================================
const update = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { id } = req.params;
    const { Item_id, qty, Uom_Id, timeRequired, details = [] } = req.body;  
    // Check if recipe exists
    const recipe = await ZRecipeMain.findByPk(id, { transaction });

    if (!recipe) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Check if item changed and new item already has recipe
    if (Item_id && Item_id !== recipe.Item_id) {
      const existingRecipe = await ZRecipeMain.findOne({
        where: { Item_id, id: { [Op.ne]: id } },
        transaction
      });

      if (existingRecipe) {
        await transaction.rollback();
        return res.status(400).json({
          success: false,
          message: 'Recipe already exists for this item'
        });
      }
    }

    // Update main recipe
    await recipe.update({
      Item_id: Item_id || recipe.Item_id,
      qty: qty !== undefined ? qty : recipe.qty,
      Uom_Id: Uom_Id !== undefined ? Uom_Id : recipe.Uom_Id,
      timeRequired: timeRequired !== undefined ? timeRequired : recipe.timeRequired  
    }, { transaction });

    // Sync details (delete existing and create new)
    await ZRecipeDetail.destroy({
      where: { zRp_Main_id: id },
      transaction
    });

    if (details.length > 0) {
      const detailRecords = details.map(detail => ({
        zRp_Main_id: id,
        Item_id: detail.Item_id,
        qty: detail.qty || 1,
        Uom_Id: detail.Uom_Id || null
      }));

      await ZRecipeDetail.bulkCreate(detailRecords, { transaction });
    }

    await transaction.commit();
    committed = true;

    // Fetch updated recipe
    const updatedRecipe = await ZRecipeMain.findByPk(id, {
      include: [
        { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
        { model: Uom, as: 'uom', attributes: ['id', 'uom'] },
        {
          model: ZRecipeDetail,
          as: 'details',
          include: [
            { model: ZItems, as: 'item', attributes: ['id', 'itemName'] },
            { model: Uom, as: 'uom', attributes: ['id', 'uom'] }
          ]
        }
      ]
    });

    console.log(`✅ Recipe updated: ID=${id}, Details=${details.length}`);

    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: updatedRecipe
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('❌ Error updating recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update recipe',
      error: error.message
    });
  }
};


// =============================================
// DELETE RECIPE
// =============================================
const remove = async (req, res) => {
  const transaction = await sequelize.transaction();
  let committed = false;

  try {
    const { id } = req.params;

    const recipe = await ZRecipeMain.findByPk(id, { transaction });

    if (!recipe) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    // Delete details first (cascade should handle this, but being explicit)
    await ZRecipeDetail.destroy({
      where: { zRp_Main_id: id },
      transaction
    });

    // Delete main
    await recipe.destroy({ transaction });

    await transaction.commit();
    committed = true;

    console.log(`✅ Recipe deleted: ID=${id}`);

    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });

  } catch (error) {
    if (!committed) {
      try {
        await transaction.rollback();
      } catch (rollbackError) {
        console.error('Rollback error:', rollbackError.message);
      }
    }

    console.error('❌ Error deleting recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete recipe',
      error: error.message
    });
  }
};

// =============================================
// TOGGLE STATUS
// =============================================
const toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const recipe = await ZRecipeMain.findByPk(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    await recipe.update({ status: !recipe.status });

    console.log(`✅ Recipe status toggled: ID=${id}, Status=${!recipe.status}`);

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: recipe
    });

  } catch (error) {
    console.error('❌ Error toggling status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle status',
      error: error.message
    });
  }
};

// =============================================
// GET USED ITEM IDS (for exclusion)
// =============================================
const getUsedItemIds = async (req, res) => {
  try {
    const { excludeId } = req.query;

    const whereClause = {};
    if (excludeId) {
      whereClause.id = { [Op.ne]: parseInt(excludeId) };
    }

    const recipes = await ZRecipeMain.findAll({
      where: whereClause,
      attributes: ['Item_id'],
      raw: true
    });

    const usedIds = recipes.map(r => r.Item_id);

    res.json({
      success: true,
      data: usedIds
    });

  } catch (error) {
    console.error('❌ Error fetching used item IDs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch used item IDs',
      error: error.message
    });
  }
};

module.exports = {
  getAll,
  getById,
  getByItemId,
  create,
  update,
  remove,
  toggleStatus,
  getUsedItemIds
};
