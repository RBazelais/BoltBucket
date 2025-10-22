import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCar, deleteCar } from '../services/CarsAPI'
import '../css/CarDetails.css'
import { resolveImagePath } from '../utilities/calcPrice'

const CarDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const data = await getCar(id)
                setCar(data)
                setLoading(false)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }
        fetchCar()
    }, [id])



    const handleEdit = () => {
        navigate(`/cars/${id}/edit`)
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this car?')) {
            try {
                await deleteCar(id)
                navigate('/cars')
            } catch (err) {
                setError(err.message)
            }
        }
    }



    if (loading) return <div className="loading">Loading car...</div>
    if (error) return <div className="error">Error: {error}</div>
    if (!car) return <div className="error">Car not found</div>
    const gallery = (car.images && car.images.length > 0)
        ? car.images
        : Object.values(car.category_images || {}).flatMap(arr => Array.isArray(arr) ? arr.map(o => o.image) : [])

    return (
        <div className="car-details">
            <div className="left-column">
                <div className="details-header">
                    <span className="car-icon">🏎️</span>
                    <h1>{car.name}</h1>
                </div>

                <div className="details-price">
                    <span className="price-icon">💰</span>
                    <span className="price-amount">${Number(car.price).toLocaleString()}</span>
                </div>

                <div className="details-actions">
                    <button className="edit-btn" onClick={handleEdit}>EDIT</button>
                    <button className="delete-btn" onClick={handleDelete}>DELETE</button>
                </div>
            </div>

            <div className="right-column">
                <div className="images-grid">
                    {gallery.length === 0 ? (
                        <div className="no-images">No images available</div>
                    ) : (
                        gallery.slice(0, 16).map((img, idx) => (
                            <div className="image-card" key={idx}>
                                <img src={resolveImagePath(img)} alt={`gallery-${idx}`} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default CarDetails