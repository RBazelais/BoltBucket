export const calculatePriceFromSelections = (basePrice = 0, selectedOptions = {}) => {
    let total = Number(basePrice) || 0
    Object.values(selectedOptions).forEach(opt => {
        if (!opt) return
        if (Array.isArray(opt)) {
        opt.forEach(item => { if (item?.price) total += Number(item.price) })
        } else if (typeof opt === 'object' && opt.price !== undefined) {
        total += Number(opt.price)
        }
    })
    return total
}

export const findOptionById = (options = [], id) => {
    if (!options || !id) return null
    return options.find(o => o.id === id) || null
}

export const formatUSD = (amount) => {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
    } catch (e) {
        return `$${Number(amount).toLocaleString()}`
    }
}

export const resolveImagePath = (path) => {
    if (!path) return path
    return path
}
