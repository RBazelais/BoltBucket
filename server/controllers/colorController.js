import { pool } from '../config/database.js'

const getColors = async (req, res) => {
    try {
        const selectQuery = 'SELECT * FROM colors WHERE is_available = true ORDER BY name ASC'
        const results = await pool.query(selectQuery)
        res.status(200).json(results.rows)
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getColorById = async (req, res) => {
    try {
        const colorId = parseInt(req.params.colorId)
        const selectQuery = 'SELECT * FROM colors WHERE id = $1 AND is_available = true'
        const results = await pool.query(selectQuery, [colorId])
        
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Color not found' })
        }
        
        res.status(200).json(results.rows[0])
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default {
    getColors,
    getColorById
}