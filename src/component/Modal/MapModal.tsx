import React from 'react'
import BaseModal from './BaseModal'
import MapScreen from '../map'

export default function MapModal({ isVisible, onClose, onSubmit, visibleButton = true, latitude, longitude }: { isVisible: boolean, onClose: () => void, onSubmit?: (latitude: number, longitude: number) => void, visibleButton?: boolean, latitude?: number | null, longitude?: number | null }) {
    return (
        <BaseModal isVisible={isVisible} onClose={onClose}>
            <MapScreen onSubmit={onSubmit} onCancel={onClose} visibleButton={visibleButton} latitude={latitude} longitude={longitude} />
        </BaseModal>
    )
}