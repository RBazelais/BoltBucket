import React from 'react'
import '../css/CreateCar.css'

import { resolveImagePath } from '../utilities/calcPrice'

const Picker = ({
    open = false,
    options = [],
    selectedId = null,
    onSelect = () => {},
    onDone = () => {},
    onClose = () => {},
    showOverlay = false
}) => {
    if (!open) return null

    const content = (
        <div className="picker-modal" role="dialog" aria-modal="true">
            <div className="available-options">
                {options.length === 0 ? (
                <div className="picker-empty">No options available</div>
                ) : (
                    options.map((opt) => (
                    <div
                        key={opt.id}
                        id={opt.id}
                        className={`option-card ${selectedId === opt.id ? 'selected active' : ''}`}
                        style={{ backgroundImage: opt.image ? `url("${resolveImagePath(opt.image)}")` : 'none' }}
                        onClick={() => onSelect(opt.id)}
                        >
                        {!opt.image && <span className="picker-text">{opt.label}</span>}
                    </div>
                    ))
                )}
            </div>

            <button className="done-button" onClick={onDone}>
                Done
            </button>
        </div>
    )

    if (showOverlay) {
        return (
            <div className="picker-overlay" onClick={onClose}>
                {content}
            </div>
        )
    }

    return content
}

export default Picker
