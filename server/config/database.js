import pg from 'pg'

const config = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // Make SSL conditional based on environment
    ...(process.env.NODE_ENV === 'production' 
        ? { ssl: { rejectUnauthorized: false } }
        : {})
}

export const pool = new pg.Pool(config)