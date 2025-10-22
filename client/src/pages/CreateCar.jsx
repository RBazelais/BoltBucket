import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../services/CarsAPI'
import '../css/CreateCar.css'
import { calculatePriceFromSelections, findOptionById, formatUSD, resolveImagePath } from '../utilities/calcPrice'
import { isCompatible, validatePayloadShape } from '../utilities/validation'
import { getAllOptions } from '../utilities/allOptions'
import Picker from '../components/Picker'

const CreateCar = () => {
    const navigate = useNavigate()
    const [carName, setCarName] = useState('')
    const [isConvertible, setIsConvertible] = useState(false)
    const [allOptions, setAllOptions] = useState({
        exterior: [],
        roof: [],
        wheels: [],
        interior: []
    })
    
    // Selected option IDs for each category
    const [selectedOptions, setSelectedOptions] = useState({
        exterior: null,
        roof: null,
        wheels: null,
        interior: null
    })

    // Picker state
    const [pickerOpen, setPickerOpen] = useState(false)
    const [currentCategory, setCurrentCategory] = useState(null)

    // Fetch all seeded options from an existing car
    useEffect(() => {
        const options = getAllOptions()
        setAllOptions(options)
        
        // Set default selections (first option in each category)
        setSelectedOptions({
            exterior: options.exterior?.[0]?.id || null,
            roof: options.roof?.[0]?.id || null,
            wheels: options.wheels?.[0]?.id || null,
            interior: options.interior?.[0]?.id || null
        })
    }, [])

    const openPicker = (category) => {
        setCurrentCategory(category)
        setPickerOpen(true)
    }

    const closePicker = () => {
        setPickerOpen(false)
        setCurrentCategory(null)
    }

    const selectOption = (optionId) => {
        setSelectedOptions(prev => ({
            ...prev,
            [currentCategory]: optionId
        }))
        closePicker()
    }

    const getSelectedOption = (category) => {
        const optionId = selectedOptions[category]
        return findOptionById(allOptions[category] || [], optionId)
    }

    // build selected option objects mapping for price calculation and validation
    const buildSelectedOptionObjects = () => {
        return {
            exterior: getSelectedOption('exterior'),
            roof: getSelectedOption('roof'),
            wheels: getSelectedOption('wheels'),
            interior: getSelectedOption('interior')
        }
    }

    const calculateTotalPrice = () => {
        const basePrice = 50000 // Base price for new car
        const selectedObjects = buildSelectedOptionObjects()
        return calculatePriceFromSelections(basePrice, selectedObjects)
    }

    const handleCreate = async () => {
        if (!carName.trim()) {
            alert('Please enter a car name')
            return
        }

        try {
            const model = isConvertible ? 'Convertible' : 'Sport Coupe'
            const selectedObjects = buildSelectedOptionObjects()

            const carData = {
                name: carName,
                make: 'Custom',
                model,
                year: new Date().getFullYear(),
                price: calculateTotalPrice(),
                currency: 'USD',
                pricePoint: '$$$',
                image: getSelectedOption('exterior')?.image || '/assets/images/exteriors/accelerate_yellow.png',
                category_images: {
                    exterior: allOptions.exterior.filter(opt => opt.id === selectedOptions.exterior),
                    roof: allOptions.roof.filter(opt => opt.id === selectedOptions.roof),
                    wheels: allOptions.wheels.filter(opt => opt.id === selectedOptions.wheels),
                    interior: allOptions.interior.filter(opt => opt.id === selectedOptions.interior)
                }
            }

            // Validate payload shape quickly before sending
            const shapeCheck = validatePayloadShape({ name: carData.name, price: carData.price, category_images: carData.category_images })
            if (!shapeCheck.ok) {
                alert(`Invalid payload: ${shapeCheck.error}`)
                return
            }

            // Compatibility check (example rules)
            const compatibilityCheck = isCompatible({ model, ...selectedObjects })
            if (!compatibilityCheck) {
                alert('Selected options are incompatible with the chosen model/configuration.')
                return
            }

            const newCar = await createCar(carData)
            navigate(`/cars/${newCar.id}`)
        } catch (error) {
            console.error('Error creating car:', error)
            alert('Failed to create car. Please try again.')
        }
    }

    const totalPrice = calculateTotalPrice()

    return (
        <div className="edit-car-page">
            <div className="edit-header">
                <input
                    type="text"
                    className="car-name-input"
                    placeholder="My New Car"
                    value={carName}
                    onChange={(e) => setCarName(e.target.value)}
                />
                <div className="convertible-toggle">
                    <input
                        type="checkbox"
                        id="convertible"
                        checked={isConvertible}
                        onChange={(e) => setIsConvertible(e.target.checked)}
                    />
                    <label htmlFor="convertible">Convertible</label>
                </div>
                <div className="total-price">
                    Total: ${totalPrice.toLocaleString()}
                </div>
            </div>

            <div className="edit-sections">
                {/* EXTERIOR */}
                <div className="edit-section">
                    <button
                        className="section-button"
                        onClick={() => openPicker('exterior')}
                    >
                        EXTERIOR
                    </button>
                    <div
                        className="car-selection"
                        style={{
                            backgroundImage: getSelectedOption('exterior')
                                ? `url(${resolveImagePath(getSelectedOption('exterior').image)})`
                                : 'none'
                        }}
                    >
                        {getSelectedOption('exterior') && (
                            <div className="selection-label">
                                {getSelectedOption('exterior').label}
                            </div>
                        )}
                    </div>
                </div>

                {/* ROOF */}
                <div className="edit-section">
                    <button
                        className="section-button"
                        onClick={() => openPicker('roof')}
                    >
                        ROOF
                    </button>
                    <div
                        className="car-selection"
                        style={{
                            backgroundImage: getSelectedOption('roof')
                                ? `url(${resolveImagePath(getSelectedOption('roof').image)})`
                                : 'none'
                        }}
                    >
                        {getSelectedOption('roof') && (
                            <div className="selection-label">
                                {getSelectedOption('roof').label}
                            </div>
                        )}
                    </div>
                </div>

                {/* WHEELS */}
                <div className="edit-section">
                    <button
                        className="section-button"
                        onClick={() => openPicker('wheels')}
                    >
                        WHEELS
                    </button>
                    <div
                        className="car-selection"
                        style={{
                            backgroundImage: getSelectedOption('wheels')
                                ? `url(${resolveImagePath(getSelectedOption('wheels').image)})`
                                : 'none'
                        }}
                    >
                        {getSelectedOption('wheels') && (
                            <div className="selection-label">
                                {getSelectedOption('wheels').label}
                            </div>
                        )}
                    </div>
                </div>

                {/* INTERIOR */}
                <div className="edit-section">
                    <button
                        className="section-button"
                        onClick={() => openPicker('interior')}
                    >
                        INTERIOR
                    </button>
                    <div
                        className="car-selection"
                        style={{
                            backgroundImage: getSelectedOption('interior')
                                ? `url(${resolveImagePath(getSelectedOption('interior').image)})`
                                : 'none'
                        }}
                    >
                        {getSelectedOption('interior') && (
                            <div className="selection-label">
                                {getSelectedOption('interior').label}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="action-buttons">
                <button onClick={handleCreate} className="save-button">
                    CREATE
                </button>
                <button onClick={() => navigate('/')} className="cancel-button">
                    CANCEL
                </button>
            </div>

            {/* Bottom-left price badge */}
            <div className="price-badge" role="status" aria-live="polite">
                <div className="money-icon">💰</div>
                <div className="price-text">${totalPrice.toLocaleString()}</div>
            </div>

            {/* Picker Modal */}
            <Picker
                open={pickerOpen}
                options={allOptions[currentCategory] || []}
                selectedId={selectedOptions[currentCategory]}
                onSelect={(id) => selectOption(id)}
                onDone={() => closePicker()}
                onClose={() => closePicker()}
            />
        </div>
    )
}

export default CreateCar