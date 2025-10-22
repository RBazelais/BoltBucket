import 'dotenv/config'
import { pool } from './database.js'

// Create an items table tailored for the BoltBucket exemplar (cars).
// The exemplar shows categories like EXTERIOR, ROOF, WHEELS, INTERIOR and a
// price. We'll store category image groups as JSONB (exterior/roof/wheels/interior),
// keep legacy fields for backward compatibility, and add structured car fields
// (make, model, year).
const createItemsTable = async () => {
		const createTableQuery = `
			DROP TABLE IF EXISTS items;

			CREATE TABLE IF NOT EXISTS items (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				make VARCHAR(128),
				model VARCHAR(128),
				year INT,
				price NUMERIC(12,2),
				currency VARCHAR(3) DEFAULT 'USD',
				pricePoint VARCHAR(32),
				image VARCHAR(255),
				category_images JSONB DEFAULT '{}'::jsonb,
				images JSONB DEFAULT '[]'::jsonb,
				description TEXT,
				tags TEXT[] DEFAULT '{}',
				owner JSONB DEFAULT '{}'::jsonb,
				location VARCHAR(255),
				condition VARCHAR(100),
				submittedBy VARCHAR(255),
				submittedOn TIMESTAMP DEFAULT NOW(),
				isFeatured BOOLEAN DEFAULT FALSE,
				createdAt TIMESTAMP DEFAULT NOW()
			);
		`

	try {
		await pool.query(createTableQuery)
		console.log('🎉 items table created successfully')
	} catch (err) {
		console.error('⚠️ error creating items table', err)
	}
}

// Create colors table for exterior color options
const createColorsTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS colors;

        CREATE TABLE IF NOT EXISTS colors (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            hex_code VARCHAR(7) NOT NULL,
            price_adjustment NUMERIC(10,2) DEFAULT 0.00,
            is_metallic BOOLEAN DEFAULT false,
            is_available BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `

    try {
        await pool.query(createTableQuery)
        console.log('🎉 colors table created successfully')
    } catch (err) {
        console.error('⚠️ error creating colors table', err)
    }
}

const seedColorsTable = async () => {
    const colorData = [
        {
            name: 'Arctic White',
            hex_code: '#FFFFFF',
            price_adjustment: 0.00,
            is_metallic: false
        },
        {
            name: 'Midnight Black',
            hex_code: '#000000',
            price_adjustment: 0.00,
            is_metallic: false
        },
        {
            name: 'Stellar Silver',
            hex_code: '#C0C0C0',
            price_adjustment: 500.00,
            is_metallic: true
        },
        {
            name: 'Racing Red',
            hex_code: '#FF0000',
            price_adjustment: 300.00,
            is_metallic: false
        },
        {
            name: 'Ocean Blue Metallic',
            hex_code: '#0000FF',
            price_adjustment: 750.00,
            is_metallic: true
        }
    ]

    const insertQuery = `
        INSERT INTO colors (name, hex_code, price_adjustment, is_metallic)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `

    try {
        for (const color of colorData) {
            const values = [
                color.name,
                color.hex_code,
                color.price_adjustment,
                color.is_metallic
            ]
            const res = await pool.query(insertQuery, values)
            console.log(`✅ seeded color: ${res.rows[0].name}`)
        }
    } catch (err) {
        console.error('⚠️ error seeding colors table', err)
    }
}

const seedItemsTable = async () => {
    await createItemsTable()
    await createColorsTable()
    await seedColorsTable()

		const itemData = [
			{
				name: '1967 Mustang Fastback',
				make: 'Ford',
				model: 'Mustang',
				year: 1967,
				price: 35000.0,
				currency: 'USD',
				pricePoint: '$$$',
				image: '/cars/mustang/main.jpg',
				images: ['/cars/mustang/main.jpg', '/cars/mustang/side.jpg', '/cars/mustang/interior.jpg'],
				category_images: {
					exterior: ['/cars/mustang/exterior1.jpg', '/cars/mustang/exterior2.jpg'],
					roof: ['/cars/mustang/roof.jpg'],
					wheels: ['/cars/mustang/wheels1.jpg'],
					interior: ['/cars/mustang/interior1.jpg', '/cars/mustang/interior2.jpg']
				},
				description: 'Restored 1967 Ford Mustang Fastback. Classic red paint, V8, manual transmission.',
				tags: ['classic', 'muscle', 'ford'],
				owner: { name: 'Sam Carter', avatar: '/avatars/sam.jpg', contact: 'sam@example.com' },
				location: 'Los Angeles, CA',
				condition: 'Restored',
				submittedBy: 'Sam Carter',
				submittedOn: new Date().toISOString(),
				isFeatured: true
			},
			{
				name: '2023 Toyota RAV4 Prime EV',
				make: 'Toyota',
				model: 'RAV4 Prime',
				year: 2023,
				price: 38000.0,
				currency: 'USD',
				pricePoint: '$$$',
				image: '/cars/rav4/main.jpg',
				images: ['/cars/rav4/main.jpg', '/cars/rav4/side.jpg', '/cars/rav4/interior.jpg'],
				category_images: {
					exterior: ['/cars/rav4/exterior1.jpg', '/cars/rav4/exterior2.jpg'],
					roof: ['/cars/rav4/roof.jpg'],
					wheels: ['/cars/rav4/wheels.jpg'],
					interior: ['/cars/rav4/interior1.jpg']
				},
				description: '2023 Toyota RAV4 Prime (plug-in hybrid / EV mode) with excellent range and factory warranty remaining. Clean title, single owner.',
				tags: ['hybrid', 'suv', 'toyota', 'ev'],
				owner: { name: 'Taylor Brooks', avatar: '/avatars/taylor.jpg', contact: 'taylor@example.com' },
				location: 'San Jose, CA',
				condition: 'Excellent',
				submittedBy: 'Taylor Brooks',
				submittedOn: new Date().toISOString(),
				isFeatured: false
			}
		]

	const insertQuery = `
			INSERT INTO items
				(name, make, model, year, price, currency, pricePoint, image, category_images, images, description, tags, owner, location, condition, submittedBy, submittedOn, isFeatured)
			VALUES
				($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
			RETURNING *;
	`

	try {
		for (const item of itemData) {
			const values = [
				item.name,
				item.make,
				item.model,
				item.year,
				item.price,
				item.currency,
				item.pricePoint,
				item.image,
				JSON.stringify(item.category_images),
				JSON.stringify(item.images),
				item.description,
				item.tags,
				JSON.stringify(item.owner),
				item.location,
				item.condition,
				item.submittedBy,
				item.submittedOn,
				item.isFeatured
			]

			const res = await pool.query(insertQuery, values)
			console.log(`✅ seeded: ${res.rows[0].name}`)
		}
	} catch (err) {
		console.error('⚠️ error seeding items table', err)
	}
}

seedItemsTable()