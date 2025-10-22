const RULES = {
    // Roof 'transparent_roof' is incompatible with 'convertible' cars
    incompatible: [
        { ifHas: { category: 'roof', id: 'transparent_roof' }, cannotHave: { category: 'model', value: 'Convertible' } }
    ]
}

export const isCompatible = (carData = {}) => {
    // carData could include model (string) and category selections as objects/ids
    try {
        for (const rule of RULES.incompatible) {
        const { ifHas, cannotHave } = rule
        const selected = carData[ifHas.category]
        let hasMatch = false

        if (Array.isArray(selected)) {
            hasMatch = selected.some(s => s?.id === ifHas.id)
        } else if (typeof selected === 'object' && selected?.id) {
            hasMatch = selected.id === ifHas.id
        } else if (typeof selected === 'string') {
            hasMatch = selected === ifHas.id
        }

        if (hasMatch) {
            // check cannotHave
            if (cannotHave.category === 'model') {
            if (carData.model === cannotHave.value) return false
            }
        }
        }

        return true
    } catch (e) {
        console.error('Compatibility check failed:', e)
        return false
    }
}

export const validatePayloadShape = (payload = {}) => {
    // Basic checks for create/update payload shape
    if (!payload.name || typeof payload.name !== 'string') 
        return { ok: false, error: 'Name is required' }
    if (!payload.price || isNaN(Number(payload.price))) 
        return { ok: false, error: 'Price is required and must be a number' }
    if (!payload.category_images) return { ok: false, error: 'category_images is required' }
        return { ok: true }
}
