import React from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import '../css/Navigation.css'

const Navigation = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/"><h1>Bolt Bucket 🏎️</h1></Link></li>
            </ul>

            <ul>
                <li><Link to="/create" role='button'>Customize</Link></li>
                <li><Link to="/cars" role='button'>View Cars</Link></li>
            </ul>
            
        </nav>
    )
}

export default Navigation