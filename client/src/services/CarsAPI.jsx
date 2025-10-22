// Base URLs for our APIs
const BASE_URL = '/api/items'
const COLORS_URL = '/api/colors'

// Category types for car customization
const CATEGORIES = {
    EXTERIOR: 'exterior',
    ROOF: 'roof',
    WHEELS: 'wheels',
    INTERIOR: 'interior'
}

// Pricing configuration for customization options
const PRICING_CONFIG = {
    exterior: {
        'arctic-white': 0,          // Base color (no additional cost)
        'midnight-black': 500,      // Premium color
        'stellar-silver': 750,      // Premium metallic
        'racing-red': 1000,         // Premium special
        'ocean-blue': 750          // Premium metallic
    },
    roof: {
        'standard': 0,              // Base option
        'panoramic': 1500,          // Premium upgrade
        'convertible': 2500,        // Luxury upgrade
        'sunroof': 1000            // Mid-tier upgrade
    },
    wheels: {
        // Price adjustments based on size and style combinations
        'sport': {
            17: 0,     // Base
            18: 500,   // Mid
            19: 1000,  // Premium
            20: 1500,  // Luxury
            21: 2000   // Ultra
        },
        'luxury': {
            19: 1500,  // Base luxury
            20: 2000,  // Premium luxury
            21: 2500   // Ultra luxury
        },
        'off-road': {
            17: 500,   // Base off-road
            18: 1000,  // Premium off-road
            19: 1500   // Ultra off-road
        },
        'performance': {
            19: 2000,  // Base performance
            20: 2500,  // Premium performance
            21: 3000   // Ultra performance
        }
    },
    interior: {
        'cloth': {
            'black': 0,     // Base
            'grey': 0,      // Base
            'beige': 0      // Base
        },
        'leather': {
            'black': 1500,  // Standard leather
            'red': 1750,    // Premium leather
            'brown': 1500,  // Standard leather
            'beige': 1500,  // Standard leather
            'white': 2000   // Premium leather
        },
        'premium-leather': {
            'black': 2500,  // Premium
            'red': 3000,    // Ultra premium
            'brown': 2500,  // Premium
            'white': 3000   // Ultra premium
        },
        'alcantara': {
            'black': 3500,  // Ultra luxury
            'red': 4000,    // Special edition
            'blue': 4000    // Special edition
        }
    }
}

// Validation schemas for each category
const VALIDATION_RULES = {
    exterior: {
        allowedFormats: ['.jpg', '.png'],
        maxFileSize: 2048 * 1024, // 2MB
        required: ['colorId', 'imageUrl'],
        validColorIds: Object.keys(PRICING_CONFIG.exterior),
        validatePrice: (colorId) => {
            const price = PRICING_CONFIG.exterior[colorId]
            if (typeof price !== 'number') {
                throw new Error(`Invalid price for exterior color: ${colorId}`)
            }
            return price
        }
    },
    roof: {
        allowedTypes: Object.keys(PRICING_CONFIG.roof),
        required: ['roofType', 'imageUrl'],
        validatePrice: (roofType) => {
            const price = PRICING_CONFIG.roof[roofType]
            if (typeof price !== 'number') {
                throw new Error(`Invalid price for roof type: ${roofType}`)
            }
            return price
        }
    },
    wheels: {
        allowedSizes: [17, 18, 19, 20, 21],
        allowedStyles: Object.keys(PRICING_CONFIG.wheels),
        required: ['size', 'style', 'imageUrl'],
        validatePrice: (style, size) => {
            const styleConfig = PRICING_CONFIG.wheels[style]
            if (!styleConfig || typeof styleConfig[size] !== 'number') {
                throw new Error(`Invalid price for wheel combination: ${style} size ${size}`)
            }
            return styleConfig[size]
        }
    },
    interior: {
        allowedMaterials: Object.keys(PRICING_CONFIG.interior),
        allowedColors: ['black', 'red', 'brown', 'beige', 'white', 'blue'],
        required: ['material', 'color', 'imageUrl'],
        validatePrice: (material, color) => {
            const materialConfig = PRICING_CONFIG.interior[material]
            if (!materialConfig || typeof materialConfig[color] !== 'number') {
                throw new Error(`Invalid price for interior combination: ${material} in ${color}`)
            }
            return materialConfig[color]
        }
    }
}

// Validation helper functions
const validateOption = (category, data) => {
    const rules = VALIDATION_RULES[category]
    if (!rules) {
        throw new Error(`Invalid category: ${category}`)
    }

    // Check required fields
    const missingFields = rules.required.filter(field => !data[field])
    if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Category-specific validation
    switch (category) {
        case 'exterior':
            if (!rules.validColorIds.includes(data.colorId)) {
                throw new Error(`Invalid color ID. Must be one of: ${rules.validColorIds.join(', ')}`)
            }
            break

        case 'roof':
            if (!rules.allowedTypes.includes(data.roofType)) {
                throw new Error(`Invalid roof type. Must be one of: ${rules.allowedTypes.join(', ')}`)
            }
            break

        case 'wheels':
            if (!rules.allowedSizes.includes(data.size)) {
                throw new Error(`Invalid wheel size. Must be one of: ${rules.allowedSizes.join(', ')}`)
            }
            if (!rules.allowedStyles.includes(data.style)) {
                throw new Error(`Invalid wheel style. Must be one of: ${rules.allowedStyles.join(', ')}`)
            }
            break

        case 'interior':
            if (!rules.allowedMaterials.includes(data.material)) {
                throw new Error(`Invalid material. Must be one of: ${rules.allowedMaterials.join(', ')}`)
            }
            if (!rules.allowedColors.includes(data.color)) {
                throw new Error(`Invalid interior color. Must be one of: ${rules.allowedColors.join(', ')}`)
            }
            break
    }

    // Validate image URL format
    if (!data.imageUrl?.match(/\.(jpg|jpeg|png)$/i)) {
        throw new Error('Invalid image format. Must be JPG or PNG')
    }

    return true
}

// Get all cars
export const getAllCars = async () => {
    try {
        const response = await fetch(BASE_URL)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching cars:', error)
        throw error
    }
}

// Get a specific car by ID
export const getCar = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Error fetching car with id ${id}:`, error)
        throw error
    }
}

// Create a new car
export const createCar = async (carData) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error creating car:', error)
        throw error
    }
}

// Update an existing car (partial update)
export const updateCar = async (id, carData) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(carData)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Error updating car with id ${id}:`, error)
        throw error
    }
}

// Delete a car
export const deleteCar = async (id) => {
    try {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Error deleting car with id ${id}:`, error)
        throw error
    }
}

// Get all available exterior colors
export const getExteriorColors = async () => {
    try {
        const response = await fetch(COLORS_URL)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching exterior colors:', error)
        throw error
    }
}

// Calculate price adjustment for customization
const calculatePriceAdjustment = (category, options) => {
    const rules = VALIDATION_RULES[category]
    if (!rules || !rules.validatePrice) {
        throw new Error(`No price validation rules for category: ${category}`)
    }

    switch (category) {
        case 'exterior':
            return rules.validatePrice(options.colorId)
        case 'roof':
            return rules.validatePrice(options.type)
        case 'wheels':
            return rules.validatePrice(options.style, options.size)
        case 'interior':
            return rules.validatePrice(options.material, options.color)
        default:
            throw new Error(`Unknown category: ${category}`)
    }
}

// Update car's exterior color
export const updateExteriorColor = async (carId, colorData) => {
    try {
        const data = {
            colorId: colorData.colorId,
            imageUrl: `/cars/colors/${colorData.colorId}.jpg`
        }
        validateOption('exterior', data)
        
        // Calculate price adjustment
        const priceAdjustment = calculatePriceAdjustment('exterior', colorData)
        
        return await updateCar(carId, {
            category_images: {
                exterior: data.imageUrl
            },
            price_adjustments: {
                exterior: priceAdjustment
            }
        })
    } catch (error) {
        console.error('Error updating exterior color:', error)
        throw error
    }
}

// Update car's interior
export const updateInterior = async (carId, interiorData) => {
    try {
        const data = {
            material: interiorData.material,
            color: interiorData.color,
            imageUrl: `/cars/interior/${interiorData.material}-${interiorData.color}.jpg`
        }
        validateOption('interior', data)

        // Calculate price adjustment
        const priceAdjustment = calculatePriceAdjustment('interior', interiorData)

        return await updateCar(carId, {
            category_images: {
                interior: data.imageUrl
            },
            price_adjustments: {
                interior: priceAdjustment
            }
        })
    } catch (error) {
        console.error('Error updating interior:', error)
        throw error
    }
}

// Update car's wheels
export const updateWheels = async (carId, wheelData) => {
    try {
        const data = {
            size: wheelData.size,
            style: wheelData.style,
            imageUrl: `/cars/wheels/${wheelData.style}-${wheelData.size}.jpg`
        }
        validateOption('wheels', data)

        return await updateCar(carId, {
            category_images: {
                wheels: data.imageUrl
            }
        })
    } catch (error) {
        console.error('Error updating wheels:', error)
        throw error
    }
}

// Update car's roof
export const updateRoof = async (carId, roofData) => {
    try {
        const data = {
            roofType: roofData.type,
            imageUrl: `/cars/roof/${roofData.type}.jpg`
        }
        validateOption('roof', data)

        return await updateCar(carId, {
            category_images: {
                roof: data.imageUrl
            }
        })
    } catch (error) {
        console.error('Error updating roof:', error)
        throw error
    }
}

// Get all customization options for a specific category
export const getCustomizationOptions = async (carId, category) => {
    try {
        const car = await getCar(carId)
        if (!car?.category_images?.[category]) {
            throw new Error(`No ${category} options found for this car`)
        }
        return car.category_images[category]
    } catch (error) {
        console.error(`Error fetching ${category} options:`, error)
        throw error
    }
}

// Update car price based on customization
export const updateCarPrice = async (carId, newPrice) => {
    try {
        return await updateCar(carId, {
            price: newPrice
        })
    } catch (error) {
        console.error('Error updating car price:', error)
        throw error
    }
}

// Get customization preview
export const getCustomizationPreview = async (carId, updates) => {
    try {
        const response = await fetch(`${BASE_URL}/${carId}/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        })
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error getting customization preview:', error)
        throw error
    }
}
