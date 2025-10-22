import { pool } from '../config/database.js'

const getItems = async (req, res) => {
	try {
		const selectQuery = 'SELECT * FROM items ORDER BY id ASC'
		const results = await pool.query(selectQuery)
		res.status(200).json(results.rows)
	} catch (error) {
		res.status(409).json( { error: error.message } )
	}
}

const getItemById = async (req, res) => {
	try {
		const selectQuery = `
			SELECT id,
					name,
					make,
					model,
					year,
					price,
					currency,
					pricePoint,
					image,
					category_images,
					images,
					description,
					tags,
					owner,
					location,
					condition,
					submittedBy,
					submittedOn,
					isFeatured,
					createdAt
			FROM items
			WHERE id = $1
		`
		
		const itemId = parseInt(req.params.itemId)
		const results = await pool.query(selectQuery, [itemId])

		if (results.rows.length === 0) {
			return res.status(404).json({ error: 'Item not found' })
		}

		res.status(200).json(results.rows[0])
	} catch (error) {
		res.status(409).json({ error: error.message })
	}
}

const createItem = async (req, res) => {
	try {
		const {
			name,
			make,
			model,
			year,
			price,
			currency = 'USD',
			pricePoint,
			image,
			category_images = {},
			images = [],
			description,
			tags = [],
			owner = {},
			location,
			condition,
			submittedBy,
			isFeatured = false
		} = req.body

		const query = `
			INSERT INTO items (
				name,
				make,
				model,
				year,
				price,
				currency,
				pricePoint,
				image,
				category_images,
				images,
				description,
				tags,
				owner,
				location,
				condition,
				submittedBy,
				isFeatured,
				submittedOn
			)
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW())
			RETURNING *`

		const values = [
			name,
			make,
			model,
			year,
			price,
			currency,
			pricePoint,
			image,
			JSON.stringify(category_images),
			JSON.stringify(images),
			description,
			tags,
			JSON.stringify(owner),
			location,
			condition,
			submittedBy,
			isFeatured
		]

		const results = await pool.query(query, values)

		res.status(201).json(results.rows[0])
	} catch (error) {
		res.status(409).json( { error: error.message } )
	}
}

const updateItem = async (req, res) => {
	try {
		const id = parseInt(req.params.id)
		
		const currentItem = await pool.query('SELECT * FROM items WHERE id = $1', [id])
		
		if (currentItem.rows.length === 0) {
			return res.status(404).json({ error: 'Item not found' })
		}

		const existingData = currentItem.rows[0]
		const updates = req.body

		const validColumns = [
			'name', 'make', 'model', 'year', 'price', 'currency', 
			'pricePoint', 'image', 'category_images', 'images', 
			'description', 'tags', 'owner', 'location', 'condition', 
			'submittedBy', 'isFeatured'
		]

		const setValues = []
		const queryValues = []
		let valueCounter = 1

		validColumns.forEach(column => {
			if (updates[column] !== undefined) {
				setValues.push(`${column} = $${valueCounter}`)
				
				if (['category_images', 'images', 'owner'].includes(column)) {
					queryValues.push(JSON.stringify(updates[column]))
				} else {
					queryValues.push(updates[column])
				}
				
				valueCounter++
			}
		})

		setValues.push(`submittedOn = NOW()`)

		if (setValues.length === 1) {
			return res.status(400).json({ error: 'No valid fields to update' })
		}

		const query = `
			UPDATE items 
			SET ${setValues.join(', ')}
			WHERE id = $${valueCounter}
			RETURNING *`

		queryValues.push(id)

		const results = await pool.query(query, queryValues)

		if (results.rows.length === 0) {
			return res.status(404).json({ error: 'Item not found' })
		}

		res.status(200).json(results.rows[0])
	} catch (error) {
		res.status(409).json({ error: error.message })
	}
}

const deleteItem = async (req, res) => {
	try {
		const id = parseInt(req.params.id)
		const results = await pool.query('DELETE FROM items WHERE id = $1', [id])
		res.status(200).json(results.rows[0])
	} catch (error) {
		res.status(409).json( { error: error.message } )
	}
}

export default {
	getItems,
	getItemById,
	createItem,
	updateItem,
	deleteItem
}