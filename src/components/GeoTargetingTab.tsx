import React, { useState } from 'react';
import { Globe, MapPin, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const GeoTargetingTab: React.FC = () => {
  const [geoEnabled, setGeoEnabled] = useState(false);
  const [locations, setLocations] = useState<Array<{
    country: string;
    state: string;
    city: string;
    postalCode: string;
  }>>([]);
  const [currentLocation, setCurrentLocation] = useState({
    country: '',
    state: '',
    city: '',
    postalCode: ''
  });
  const [saving, setSaving] = useState(false);

  const handleAddLocation = () => {
    if (!currentLocation.country && !currentLocation.city) {
      alert('Please enter at least a country or city');
      return;
    }

    setLocations([...locations, currentLocation]);
    setCurrentLocation({ country: '', state: '', city: '', postalCode: '' });
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Geo-targeting settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">1. Advanced Geo-Targeting</h2>
        <p className="text-gray-400">Target specific locations for your content optimization</p>
      </div>

      {/* Enable Toggle */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-lg font-bold text-white">Enable Geo-Targeting for Content</h3>
              <p className="text-sm text-gray-400">Optimize content for specific geographical locations</p>
            </div>
          </div>
          <button
            onClick={() => setGeoEnabled(!geoEnabled)}
            className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
              geoEnabled
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/50'
                : 'bg-gray-600'
            }`}
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center ${
              geoEnabled ? 'translate-x-8' : ''
            }`}>
              {geoEnabled ? <CheckCircle className="w-4 h-4 text-green-600" /> : <div className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>

      {/* Location Input Form */}
      {geoEnabled && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-400" />
            Add Target Locations
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Country</label>
              <input
                type="text"
                value={currentLocation.country}
                onChange={(e) => setCurrentLocation({...currentLocation, country: e.target.value})}
                placeholder="e.g., United States"
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">State/Province</label>
              <input
                type="text"
                value={currentLocation.state}
                onChange={(e) => setCurrentLocation({...currentLocation, state: e.target.value})}
                placeholder="e.g., California"
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">City</label>
              <input
                type="text"
                value={currentLocation.city}
                onChange={(e) => setCurrentLocation({...currentLocation, city: e.target.value})}
                placeholder="e.g., Los Angeles"
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Postal Code (Optional)</label>
              <input
                type="text"
                value={currentLocation.postalCode}
                onChange={(e) => setCurrentLocation({...currentLocation, postalCode: e.target.value})}
                placeholder="e.g., 90001"
                className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <button
            onClick={handleAddLocation}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all"
          >
            Add Location
          </button>
        </div>
      )}

      {/* Location List */}
      {geoEnabled && locations.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">Target Locations ({locations.length})</h3>
          <div className="space-y-3">
            {locations.map((loc, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-black/30 border border-white/10 rounded-lg">
                <div>
                  <p className="text-white font-medium">
                    {[loc.city, loc.state, loc.country].filter(Boolean).join(', ')}
                  </p>
                  {loc.postalCode && <p className="text-sm text-gray-400">Postal Code: {loc.postalCode}</p>}
                </div>
                <button
                  onClick={() => handleRemoveLocation(i)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <><Loader className="w-5 h-5 animate-spin" />Saving...</> : 'Save Geo-Targeting Settings'}
          </button>
        </div>
      )}

      {/* Info */}
      {geoEnabled && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <p className="font-semibold mb-2">How Geo-Targeting Works:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Content is optimized with local keywords and phrases</li>
                <li>Schema markup includes location data</li>
                <li>Meta descriptions reference target locations</li>
                <li>Internal links prioritize geo-relevant content</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoTargetingTab;
