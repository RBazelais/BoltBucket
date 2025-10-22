import express from 'express'
import customItemController from '../controllers/customItem.js'

const router = express.Router()

router.get('/', customItemController.getItems)
router.get('/:itemId', customItemController.getItemById)
router.post('/', customItemController.createItem)
router.patch('/:id', customItemController.updateItem)
router.put('/:id', customItemController.updateItem)
router.delete('/:id', customItemController.deleteItem)

export default router