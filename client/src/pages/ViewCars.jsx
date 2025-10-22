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
                cars.map(car => (
                    <div key={car.id} className="car-card">
                        <div className="car-header">
                            <span className="car-icon">🏎️</span>
                            <h2>{car.name}</h2>
                        </div>
                        
                        <div className="car-details">
                            <div className="detail-row">
                                <span className="detail-label">🎨 Exterior:</span>
                                <span className="detail-value">Arctic White</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">🏎️ Wheels:</span>
                                <span className="detail-value">Sport 19"</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">☀️ Roof:</span>
                                <span className="detail-value">Standard</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">🪑 Interior:</span>
                                <span className="detail-value">Black Leather</span>
                            </div>
                        </div>

                        <div className="car-footer">
                            <div className="car-price">
                                <span className="price-icon">💰</span>
                                <span className="price-amount">${car.price.toLocaleString()}</span>
                            </div>
                            <Link to={`/cars/${car.id}`} className="details-button">DETAILS</Link>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default ViewCars