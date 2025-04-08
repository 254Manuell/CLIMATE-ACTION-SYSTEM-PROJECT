"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Card } from '@/components/ui/card'
import debounce from 'lodash/debounce'

interface LocationSearchProps {
  onLocationSelect: (location: { lat: number; lng: number; name: string }) => void;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  type: string;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchValue, setSearchValue] = useState('')
  const [predictions, setPredictions] = useState<NominatimResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchLocation = async (query: string) => {
    if (!query) {
      setPredictions([])
      return
    }

    setIsLoading(true)
    try {
      // Search within Nairobi bounds (approximately)
      const viewbox = '36.6619,-1.4036,37.0219,-1.1795'
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `format=json&q=${encodeURIComponent(query)}&` +
        `viewbox=${viewbox}&bounded=1&limit=5&countrycodes=ke`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'CAS_AirQualityApp/1.0' // Required by Nominatim's terms
          }
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const results: NominatimResult[] = await response.json()
      setPredictions(results)
    } catch (error) {
      console.error('Error searching location:', error)
      setPredictions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce the search to avoid too many API calls
  const debouncedSearch = debounce(searchLocation, 300)

  const handleInputChange = (value: string) => {
    setSearchValue(value)
    debouncedSearch(value)
  }

  const handlePlaceSelect = (place: NominatimResult) => {
    onLocationSelect({
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      name: place.display_name.split(',')[0] // Get just the place name
    })
    setPredictions([])
    setSearchValue(place.display_name.split(',')[0])
  }

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for a location in Nairobi..."
          value={searchValue}
          onChange={(e) => handleInputChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={() => searchLocation(searchValue)}
          disabled={isLoading}
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {predictions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 p-2 max-h-60 overflow-auto">
          <div className="space-y-1">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="p-2 hover:bg-accent rounded-md cursor-pointer"
                onClick={() => handlePlaceSelect(prediction)}
              >
                {prediction.display_name}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
