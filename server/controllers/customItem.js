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

		// Our SQL query using $1, $2, etc. to safely insert values
		const query = `
			UPDATE items 
			SET name = $1,
				make = $2,
				model = $3,
				year = $4,
				price = $5,
				currency = $6,
				pricePoint = $7,
				image = $8,
				category_images = $9,
				images = $10,
				description = $11,
				tags = $12,
				owner = $13,
				location = $14,
				condition = $15,
				submittedBy = $16,
				isFeatured = $17,
				submittedOn = NOW()
			WHERE id = $18
			RETURNING *`

		// Values array matches the schema from reset.js
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
			isFeatured,
			id
		]

		const results = await pool.query(query, values)

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