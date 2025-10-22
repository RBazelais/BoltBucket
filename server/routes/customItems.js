import express from 'express'
import customItemController from '../controllers/customItem.js'

const router = express.Router()

// GET all items
router.get('/', customItemController.getItems)

// GET specific item by ID
router.get('/:itemId', customItemController.getItemById)

// POST create new item
router.post('/', customItemController.createItem)

// PUT update existing item
router.put('/:id', customItemController.updateItem)

// DELETE item
router.delete('/:id', customItemController.deleteItem)

export default router