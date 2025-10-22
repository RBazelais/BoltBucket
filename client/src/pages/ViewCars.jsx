import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCars } from '../services/CarsAPI'
import '../css/ViewCars.css'

const ViewCars = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const response = await getAllCars()
                setCars(response)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }

        fetchCars()
    }, [])

    if (loading) return <div className="loading">Loading cars...</div>
    if (error) return <div className="error">Error: {error}</div>

    return (
        <div className="view-cars">
            {cars.length === 0 ? (
                <div className="no-cars">
                    <p>No cars found.</p>
                    <Link to="/create" className="button">Create New Car</Link>
                </div>
            ) : (
                cars.map(car => {
                    // helper to get label from option object
                    const getLabel = (option) => {
                        if (!option) return 'N/A'
                        // option is now an object with { id, label, image, price }
                        return option.label || 'N/A'
                    }

                    const exterior = Array.isArray(car.category_images?.exterior) && car.category_images.exterior[0] ? getLabel(car.category_images.exterior[0]) : 'N/A'
                    const roof = Array.isArray(car.category_images?.roof) && car.category_images.roof[0] ? getLabel(car.category_images.roof[0]) : 'Body Color'
                    const wheels = Array.isArray(car.category_images?.wheels) && car.category_images.wheels[0] ? getLabel(car.category_images.wheels[0]) : 'N/A'
                    const interior = Array.isArray(car.category_images?.interior) && car.category_images.interior[0] ? getLabel(car.category_images.interior[0]) : 'N/A'

                    return (
                        <div key={car.id} className="car-card">
                            <div className="card-left">
                                <span className="car-icon">🏎️</span>
                                <h3 className="car-name">{car.name}</h3>
                            </div>

                            <div className="card-center">
                                <div className="center-grid">
                                    <div className="center-col">
                                        <div className="center-item"><span>🎨 Exterior:</span><span>{exterior}</span></div>
                                        <div className="center-item"><span>😎 Roof:</span><span>{roof}</span></div>
                                    </div>
                                    <div className="center-col">
                                        <div className="center-item"><span>🛞 Wheels:</span><span>{wheels}</span></div>
                                        <div className="center-item"><span>🪑 Interior:</span><span>{interior}</span></div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-right">
                                <div className="price-block">
                                    <span className="price-icon">💰</span>
                                    <span className="price-amount">${Number(car.price).toLocaleString()}</span>
                                </div>
                                <Link to={`/cars/${car.id}`} className="details-button">DETAILS</Link>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default ViewCars