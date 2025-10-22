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

		// All available options
		const allOptions = {
			exterior: [
				{ id: 'exterior1', label: 'Silver Flare Metallic', image: '/assets/images/exteriors/silver_flare_metallic.png', price: 0 },
				{ id: 'exterior2', label: 'Arctic White', image: '/assets/images/exteriors/arctic_white.png', price: 0 },
				{ id: 'exterior3', label: 'Red Mist', image: '/assets/images/exteriors/red_mist.png', price: 500 },
				{ id: 'exterior4', label: 'Hypersonic Gray', image: '/assets/images/exteriors/hypersonic_gray.png', price: 300 },
				{ id: 'exterior5', label: 'Amplify Orange', image: '/assets/images/exteriors/amplify_orange.png', price: 800 },
				{ id: 'exterior6', label: 'Caffeine Metallic', image: '/assets/images/exteriors/caffeine_metallic.png', price: 600 },
				{ id: 'exterior7', label: 'Black', image: '/assets/images/exteriors/black.png', price: 0 },
				{ id: 'exterior8', label: 'Torch Red', image: '/assets/images/exteriors/torch_red.png', price: 1000 },
				{ id: 'exterior9', label: 'Accelerate Yellow', image: '/assets/images/exteriors/accelerate_yellow.png', price: 2000 },
				{ id: 'exterior10', label: 'Elkhart Lake Blue', image: '/assets/images/exteriors/elkhart_lake_blue.png', price: 1500 }
			],
			roof: [
				{ id: 'roof1', label: 'Carbon Fiber with Body Color', image: '/assets/images/roofs/carbon_fiber_with_body_color.png', price: 4000 },
				{ id: 'roof2', label: 'Carbon Flash Body Color', image: '/assets/images/roofs/carbon_flash_body_color.avif', price: 0 },
				{ id: 'roof3', label: 'Carbon Flash Nacelles', image: '/assets/images/roofs/carbon_flash_nacelles.png', price: 3500 },
				{ id: 'roof4', label: 'Dual Roof', image: '/assets/images/roofs/dual_roof.avif', price: 2500 },
				{ id: 'roof5', label: 'Transparent Roof', image: '/assets/images/roofs/transparent_roof.avif', price: 5000 }
			],
			wheels: [
				{ id: 'wheel1', label: 'Bronze Forged', image: '/assets/images/wheels/bronze_forged.avif', price: 3500 },
				{ id: 'wheel2', label: 'Carbon Flash Spoke', image: '/assets/images/wheels/carbon_flash_spoke.avif', price: 2800 },
				{ id: 'wheel3', label: 'Carbon Flash with Red Caliper', image: '/assets/images/wheels/carbon_flash_with_red_caliper.png', price: 2000 },
				{ id: 'wheel4', label: 'Edge Blue Spoke', image: '/assets/images/wheels/edge_blue_spoke.avif', price: 2200 },
				{ id: 'wheel5', label: 'Satin Graphite with Red Stripe', image: '/assets/images/wheels/satin_graphite_with_red_stripe.png', price: 2600 },
				{ id: 'wheel6', label: 'Sterling Silver Spoke', image: '/assets/images/wheels/sterling_silver_spoke.avif', price: 1800 },
				{ id: 'wheel7', label: 'Visible Carbon Spoke', image: '/assets/images/wheels/visible_carbon_spoke.avif', price: 4000 }
			],
			interior: [
				{ id: 'interior1', label: 'Adrenaline Red', image: '/assets/images/interiors/adrenaline_red.jpg', price: 3000 },
				{ id: 'interior2', label: 'Jet Black', image: '/assets/images/interiors/jet_black.avif', price: 0 },
				{ id: 'interior3', label: 'Sky Cool Gray', image: '/assets/images/interiors/sky_cool_grey_perforated.jpg', price: 2500 },
				{ id: 'interior4', label: 'Strike Yellow', image: '/assets/images/interiors/natural_dipped.jpg', price: 3500 }
			]
		}

		const itemData = [
			{
				name: 'Accelerate Yellow Dream Machine',
				make: 'Custom',
				model: 'Sport Coupe',
				year: 2024,
				price: 50000.0,
				currency: 'USD',
				pricePoint: '$$$',
				image: '/assets/images/exteriors/accelerate_yellow.png',
				images: [],
				category_images: {
					exterior: [allOptions.exterior[8]], // Accelerate Yellow
					roof: [allOptions.roof[2]], // Carbon Flash Nacelles
					wheels: [allOptions.wheels[0]], // Bronze Forged
					interior: [allOptions.interior[0]] // Adrenaline Red
				},
				description: 'High-performance custom build with Accelerate Yellow exterior, visible carbon fiber roof, and Adrenaline Red interior.',
				tags: ['custom', 'sport', 'performance', 'yellow'],
				owner: { name: 'Alex Rivera', avatar: '', contact: 'alex@example.com' },
				location: 'Los Angeles, CA',
				condition: 'New',
				submittedBy: 'Alex Rivera',
				submittedOn: new Date().toISOString(),
				isFeatured: true
			},
			{
				name: 'Elkhart Lake Blue Special',
				make: 'Custom',
				model: 'GT Roadster',
				year: 2024,
				price: 52000.0,
				currency: 'USD',
				pricePoint: '$$$',
				image: '/assets/images/exteriors/elkhart_lake_blue.png',
				images: [],
				category_images: {
					exterior: [allOptions.exterior[9]], // Elkhart Lake Blue
					roof: [allOptions.roof[3]], // Dual Roof
					wheels: [allOptions.wheels[3]], // Edge Blue Spoke
					interior: [allOptions.interior[2]] // Sky Cool Gray
				},
				description: 'Stunning blue custom roadster with premium carbon fiber roof and Sky Cool Gray interior.',
				tags: ['custom', 'luxury', 'roadster', 'blue'],
				owner: { name: 'Jordan Chen', avatar: '', contact: 'jordan@example.com' },
				location: 'San Francisco, CA',
				condition: 'New',
				submittedBy: 'Jordan Chen',
				submittedOn: new Date().toISOString(),
				isFeatured: true
			},
			{
				name: 'Torch Red Thunder',
				make: 'Custom',
				model: 'Performance',
				year: 2024,
				price: 51000.0,
				currency: 'USD',
				pricePoint: '$$$',
				image: '/assets/images/exteriors/torch_red.png',
				images: [],
				category_images: {
					exterior: [allOptions.exterior[7]], // Torch Red
					roof: [allOptions.roof[1]], // Carbon Flash Body Color
					wheels: [allOptions.wheels[1]], // Carbon Flash Spoke
					interior: [allOptions.interior[1]] // Jet Black
				},
				description: 'Bold red performance build with carbon flash wheels and jet black interior for the ultimate driving experience.',
				tags: ['custom', 'performance', 'sport', 'red'],
				owner: { name: 'Sam Taylor', avatar: '', contact: 'sam@example.com' },
				location: 'Austin, TX',
				condition: 'New',
				submittedBy: 'Sam Taylor',
				submittedOn: new Date().toISOString(),
				isFeatured: false
			},
			{
				name: 'Arctic White Elegance',
				make: 'Custom',
				model: 'Luxury Sedan',
				year: 2024,
				price: 48000.0,
				currency: 'USD',
				pricePoint: '$$$',
				image: '/assets/images/exteriors/arctic_white.png',
				images: [],
				category_images: {
					exterior: [allOptions.exterior[1]], // Arctic White
					roof: [allOptions.roof[4]], // Transparent Roof
					wheels: [allOptions.wheels[5]], // Sterling Silver Spoke
					interior: [allOptions.interior[1]] // Jet Black
				},
				description: 'Clean and elegant white build with machined face wheels and jet black interior - perfect for luxury enthusiasts.',
				tags: ['custom', 'luxury', 'elegant', 'white'],
				owner: { name: 'Morgan Lee', avatar: '', contact: 'morgan@example.com' },
				location: 'Miami, FL',
				condition: 'New',
				submittedBy: 'Morgan Lee',
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