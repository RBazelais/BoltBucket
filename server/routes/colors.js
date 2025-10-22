import express from 'express'
import colorController from '../controllers/colorController.js'

const router = express.Router()

// GET all available colors
router.get('/', colorController.getColors)

// GET specific color by ID
router.get('/:colorId', colorController.getColorById)

export default router