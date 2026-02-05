import React, { useState } from 'react';
import { MapPin, Crosshair, Loader2 } from 'lucide-react';

interface LocationPickerProps {
    latitude?: number;
    longitude?: number;
    onLocationChange: (lat: number, lng: number) => void;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
    latitude,
    longitude,
    onLocationChange
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetCurrentLocation = () => {
        setIsLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setIsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onLocationChange(position.coords.latitude, position.coords.longitude);
                setIsLoading(false);
            },
            (err) => {
                setError('Unable to retrieve your location');
                setIsLoading(false);
            }
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Clinic Location
                </label>
                <button
                    onClick={handleGetCurrentLocation}
                    disabled={isLoading}
                    className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crosshair className="w-3 h-3" />}
                    Use Current Location
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Latitude</label>
                    <input
                        type="number"
                        step="0.000001"
                        value={latitude || ''}
                        onChange={(e) => onLocationChange(parseFloat(e.target.value), longitude || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="17.4834"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">Longitude</label>
                    <input
                        type="number"
                        step="0.000001"
                        value={longitude || ''}
                        onChange={(e) => onLocationChange(latitude || 0, parseFloat(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="78.3155"
                    />
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}

            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700">
                    This location will be used for the "Clinics Near Me" discovery feature in HealthFlo.
                </p>
            </div>
        </div>
    );
};
