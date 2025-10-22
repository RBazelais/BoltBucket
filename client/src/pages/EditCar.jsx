import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { getCar, updateCar } from '../services/CarsAPI'
import '../css/CreateCar.css'
import { resolveImagePath, calculatePriceFromSelections, findOptionById } from '../utilities/calcPrice'
import { getAllOptions } from '../utilities/allOptions'
import Picker from '../components/Picker'

const CATEGORIES = ['exterior', 'roof', 'wheels', 'interior']

const EditCar = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)
    
    const [allOptions, setAllOptions] = useState({
        exterior: [],
        roof: [],
        wheels: [],
        interior: []
    })
    const [customization, setCustomization] = useState({})
    const [pickerOpen, setPickerOpen] = useState(false)
    const [pickerCategory, setPickerCategory] = useState(null)
    const [pickerOptions, setPickerOptions] = useState([])
    const [selectedOptionId, setSelectedOptionId] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const carData = await getCar(id)
                setCar(carData)
                
                // Get all available options
                setAllOptions(getAllOptions())
                
                const category = carData.category_images || {}
                setCustomization({
                    exterior: category.exterior?.[0]?.id || null,
                    roof: category.roof?.[0]?.id || null,
                    wheels: category.wheels?.[0]?.id || null,
                    interior: category.interior?.[0]?.id || null
                })
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    useEffect(() => {
        if (!car) return
        const hash = (location.hash || '').replace('#', '')
        if (CATEGORIES.includes(hash)) {
            openPicker(hash)
            try { history.replaceState && history.replaceState(null, '', location.pathname) } catch (e) {}
        }
    }, [location.hash, car])

    const openPicker = (category) => {
        const opts = allOptions[category] || []
        setPickerOptions(opts)
        setSelectedOptionId(customization[category] || opts[0]?.id || null)
        setPickerCategory(category)
        setPickerOpen(true)
    }

    const closePicker = () => {
        setPickerOpen(false)
        setPickerCategory(null)
        setPickerOptions([])
        setSelectedOptionId(null)
    }

    const handleDonePicker = () => {
        if (!pickerCategory || !selectedOptionId) return
        setCustomization(prev => ({ ...prev, [pickerCategory]: selectedOptionId }))
        closePicker()
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            const payload = {
                category_images: {
                    exterior: findOptionById(allOptions.exterior, customization.exterior) ? [findOptionById(allOptions.exterior, customization.exterior)] : [],
                    roof: findOptionById(allOptions.roof, customization.roof) ? [findOptionById(allOptions.roof, customization.roof)] : [],
                    wheels: findOptionById(allOptions.wheels, customization.wheels) ? [findOptionById(allOptions.wheels, customization.wheels)] : [],
                    interior: findOptionById(allOptions.interior, customization.interior) ? [findOptionById(allOptions.interior, customization.interior)] : []
                }
            }

            await updateCar(id, payload)
            navigate(`/cars/${id}`)
        } catch (err) {
            setError(err.message)
            setSaving(false)
        }
    }

    const buildSelectedObjects = () => {
        return {
            exterior: findOptionById(allOptions.exterior || [], customization.exterior),
            roof: findOptionById(allOptions.roof || [], customization.roof),
            wheels: findOptionById(allOptions.wheels || [], customization.wheels),
            interior: findOptionById(allOptions.interior || [], customization.interior)
        }
    }

    const totalPrice = () => {
        const base = Number(car?.price) || 0
        return calculatePriceFromSelections(base, buildSelectedObjects())
    }

    const getSelectedOption = (category) => {
        return findOptionById(allOptions[category] || [], customization[category])
    }

    if (loading) return <div className="loading">Loading car...</div>
    if (error) return <div className="error">Error: {error}</div>
    if (!car) return <div className="error">Car not found</div>

    return (
        <div className="edit-car-page">
            <div className="edit-header">
                <h1>🎨 {car.name}</h1>
                <div className="total-price">
                    Total: ${Number(totalPrice()).toLocaleString()}
                </div>
            </div>

            <div className="edit-sections">
                {CATEGORIES.map(cat => (
                    <div className="edit-section" key={cat}>
                        <button
                            className="section-button"
                            onClick={() => openPicker(cat)}
                        >
                            {cat.toUpperCase()}
                        </button>
                        {getSelectedOption(cat) && (
                            <div
                                className="car-selection"
                                style={{ backgroundImage: `url("${resolveImagePath(getSelectedOption(cat).image)}")` }}
                            >
                                <div className="selection-label">
                                    {getSelectedOption(cat).label}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="action-buttons">
                <button 
                    className="save-button" 
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'SAVE'}
                </button>
                <button 
                    className="cancel-button" 
                    onClick={() => navigate(`/cars/${id}`)}
                    disabled={saving}
                >
                    CANCEL
                </button>
            </div>

            <Picker
                open={pickerOpen}
                options={pickerOptions}
                selectedId={selectedOptionId}
                onSelect={(id) => setSelectedOptionId(id)}
                onDone={handleDonePicker}
                onClose={closePicker}
            />
        </div>
    )
}

export default EditCar