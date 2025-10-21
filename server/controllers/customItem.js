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
            SELECT name, pricePoint, audience, image, description, submittedBy, submittedOn
            FROM items
            WHERE id=$1
        `
        
        const itemId = parseInt(req.params.itemId)
        const results = await pool.query(selectQuery, [itemId])
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json( { error: error.message} )
    }
}

const createItem = async (req, res) => {
    try {
        const { name, pricepoint, audience, image, description, submittedby, submittedon } = req.body
        const results = await pool.query(`
            INSERT INTO items (name, pricepoint, audience, image, description, submittedby, submittedon)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [name, pricepoint, audience, image, description, submittedby, submittedon]
        )

        res.status(201).json(results.rows[0])
    } catch (error) {
        res.status(409).json( { error: error.message } )
    }
}

const updateItem = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { name, pricepoint, audience, image, description, submittedby, submittedon } = req.body
        const results = await pool.query(`
            UPDATE items SET name = $1, pricepoint = $2, audience = $3, image = $4, description = $5, submittedby = $6, submittedon= $7 WHERE id = $8`,
            [name, pricepoint, audience, image, description, submittedby, submittedon, id]
        )
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json( { error: error.message } )
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