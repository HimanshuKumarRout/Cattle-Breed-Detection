import { useState, useEffect, useMemo } from 'react';
import { getBreeds } from '../services/api';

// Static breed data with min/max milk yield numbers for precise filtering
const STATIC_BREEDS = [
    { breed_id: 1, breed_name: 'Alambadi Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-3', min_milk_yield: 2, max_milk_yield: 3, lifespan_years: '15-18', description: 'Hardy draught breed from Tamil Nadu adapted to dry semi-arid conditions.' },
    { breed_id: 2, breed_name: 'Amritmahal Cow', animal_type: 'Cow', region: 'Karnataka, India', primary_use: 'Draught', avg_milk_liters_per_day: '1-2', min_milk_yield: 1, max_milk_yield: 2, lifespan_years: '18-20', description: 'Elite draught breed from Karnataka known for speed and endurance.' },
    { breed_id: 3, breed_name: 'Banni Buffalo', animal_type: 'Buffalo', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '10-14', min_milk_yield: 10, max_milk_yield: 14, lifespan_years: '20-25', description: 'High-yielding buffalo breed from the Banni grasslands of Kutch.' },
    { breed_id: 4, breed_name: 'Bargur Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-3', min_milk_yield: 2, max_milk_yield: 3, lifespan_years: '15-18', description: 'Agile draught breed from the Bargur hills of Erode district.' },
    { breed_id: 5, breed_name: 'Dangi Cow', animal_type: 'Cow', region: 'Maharashtra, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '1-3', min_milk_yield: 1, max_milk_yield: 3, lifespan_years: '15-18', description: 'Hardy breed from the hilly Dangs region. Tolerant to heavy rainfall.' },
    { breed_id: 6, breed_name: 'Deoni Cow', animal_type: 'Cow', region: 'Maharashtra / Karnataka, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '3-5', min_milk_yield: 3, max_milk_yield: 5, lifespan_years: '15-18', description: 'Dual-purpose breed from the Deccan plateau.' },
    { breed_id: 7, breed_name: 'Gir Cow', animal_type: 'Cow', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '6-10', min_milk_yield: 6, max_milk_yield: 10, lifespan_years: '12-15', description: 'Principal dairy breed of India. Highly heat tolerant with excellent disease resistance.' },
    { breed_id: 8, breed_name: 'Hallikar Cow', animal_type: 'Cow', region: 'Karnataka, India', primary_use: 'Draught', avg_milk_liters_per_day: '1-2', min_milk_yield: 1, max_milk_yield: 2, lifespan_years: '18-20', description: 'Premier draught breed of South India known for compact muscular build.' },
    { breed_id: 9, breed_name: 'Jaffrabadi Buffalo', animal_type: 'Buffalo', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '8-12', min_milk_yield: 8, max_milk_yield: 12, lifespan_years: '20-25', description: 'Heaviest Indian buffalo breed from Gir forests of Gujarat.' },
    { breed_id: 10, breed_name: 'Kangayam Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-4', min_milk_yield: 2, max_milk_yield: 4, lifespan_years: '18-20', description: 'Powerful draught breed from Tamil Nadu known for endurance.' },
    { breed_id: 11, breed_name: 'Kankrej Cow', animal_type: 'Cow', region: 'Gujarat / Rajasthan, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '5-8', min_milk_yield: 5, max_milk_yield: 8, lifespan_years: '15-18', description: 'Large dual-purpose breed. Known for heavy build and fast trotting gait.' },
    { breed_id: 12, breed_name: 'Kasaragod Cow', animal_type: 'Cow', region: 'Kerala, India', primary_use: 'Dwarf Cattle', avg_milk_liters_per_day: '2-3', min_milk_yield: 2, max_milk_yield: 3, lifespan_years: '15-18', description: 'Small-sized cattle breed adapted to the tropical coastal climate.' },
    { breed_id: 13, breed_name: 'Kenkatha Cow', animal_type: 'Cow', region: 'Uttar Pradesh / Madhya Pradesh, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-4', min_milk_yield: 2, max_milk_yield: 4, lifespan_years: '15-18', description: 'Compact draught breed from the Ken river valley of Bundelkhand.' },
    { breed_id: 14, breed_name: 'Kherigarh Cow', animal_type: 'Cow', region: 'Uttar Pradesh, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '3-5', min_milk_yield: 3, max_milk_yield: 5, lifespan_years: '15-18', description: 'Medium-sized dual-purpose breed from the Kheri district of UP.' },
    { breed_id: 15, breed_name: 'Malnad gidda Cow', animal_type: 'Cow', region: 'Karnataka, India', primary_use: 'Dairy (small-scale)', avg_milk_liters_per_day: '1-3', min_milk_yield: 1, max_milk_yield: 3, lifespan_years: '18-20', description: 'Smallest Indian cattle breed from the Western Ghats of Karnataka.' },
    { breed_id: 16, breed_name: 'Mehsana Buffalo', animal_type: 'Buffalo', region: 'Gujarat, India', primary_use: 'Dairy', avg_milk_liters_per_day: '8-12', min_milk_yield: 8, max_milk_yield: 12, lifespan_years: '20-25', description: 'Important dairy buffalo from North Gujarat. Consistent milk producer.' },
    { breed_id: 17, breed_name: 'Nagori Cow', animal_type: 'Cow', region: 'Rajasthan, India', primary_use: 'Draught', avg_milk_liters_per_day: '2-4', min_milk_yield: 2, max_milk_yield: 4, lifespan_years: '15-18', description: 'Tall well-built draught breed from Nagaur district of Rajasthan.' },
    { breed_id: 18, breed_name: 'Nagpuri Buffalo', animal_type: 'Buffalo', region: 'Maharashtra, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '5-7', min_milk_yield: 5, max_milk_yield: 7, lifespan_years: '20-25', description: 'Distinctive buffalo breed known for extremely long horns.' },
    { breed_id: 19, breed_name: 'Nili ravi Buffalo', animal_type: 'Buffalo', region: 'Punjab, India / Pakistan', primary_use: 'Dairy', avg_milk_liters_per_day: '8-14', min_milk_yield: 8, max_milk_yield: 14, lifespan_years: '20-25', description: 'Premier dairy buffalo breed from the Punjab region.' },
    { breed_id: 20, breed_name: 'Nimari Cow', animal_type: 'Cow', region: 'Madhya Pradesh, India', primary_use: 'Dual Purpose', avg_milk_liters_per_day: '2-4', min_milk_yield: 2, max_milk_yield: 4, lifespan_years: '15-18', description: 'Medium-sized dual-purpose breed from the Nimar valley.' },
    { breed_id: 21, breed_name: 'Pulikulam Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught / Sport', avg_milk_liters_per_day: '1-2', min_milk_yield: 1, max_milk_yield: 2, lifespan_years: '15-18', description: 'Small agile breed traditionally used in Jallikattu.' },
    { breed_id: 22, breed_name: 'Rathi Cow', animal_type: 'Cow', region: 'Rajasthan, India', primary_use: 'Dairy', avg_milk_liters_per_day: '6-8', min_milk_yield: 6, max_milk_yield: 8, lifespan_years: '15-18', description: 'One of the best dairy breeds of Rajasthan.' },
    { breed_id: 23, breed_name: 'Sahiwal Cow', animal_type: 'Cow', region: 'Punjab, India / Pakistan', primary_use: 'Dairy', avg_milk_liters_per_day: '8-12', min_milk_yield: 8, max_milk_yield: 12, lifespan_years: '15-18', description: 'One of the best dairy breeds of the Indian subcontinent. Highly heat-tolerant.' },
    { breed_id: 24, breed_name: 'Shurti Buffalo', animal_type: 'Buffalo', region: 'Karnataka, India', primary_use: 'Dairy', avg_milk_liters_per_day: '4-6', min_milk_yield: 4, max_milk_yield: 6, lifespan_years: '20-25', description: 'Small to medium dairy buffalo from North Karnataka.' },
    { breed_id: 25, breed_name: 'Tharparkar Cow', animal_type: 'Cow', region: 'Rajasthan, India / Sindh, Pakistan', primary_use: 'Dairy', avg_milk_liters_per_day: '6-10', min_milk_yield: 6, max_milk_yield: 10, lifespan_years: '18-20', description: 'Hardy dual-purpose breed from the Thar desert.' },
    { breed_id: 26, breed_name: 'Umblachery Cow', animal_type: 'Cow', region: 'Tamil Nadu, India', primary_use: 'Draught', avg_milk_liters_per_day: '1-2', min_milk_yield: 1, max_milk_yield: 2, lifespan_years: '15-18', description: 'Compact draught breed from the Cauvery delta region.' },
];

const POPULAR_STATES = [
    'Gujarat',
    'Tamil Nadu',
    'Karnataka',
    'Rajasthan',
    'Maharashtra',
    'Uttar Pradesh',
    'Punjab',
    'Kerala',
    'Madhya Pradesh'
];

const POPULAR_USES = [
    'Dairy',
    'Draught',
    'Dual Purpose',
    'Dwarf Cattle'
];

function BreedExplorerPage() {
    const [breeds, setBreeds] = useState(STATIC_BREEDS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterRegion, setFilterRegion] = useState('');
    const [filterUse, setFilterUse] = useState('');
    const [milkPreset, setMilkPreset] = useState('all'); // 'all', 'high', 'med', 'low', 'custom'
    const [customMinMilk, setCustomMinMilk] = useState('');
    const [customMaxMilk, setCustomMaxMilk] = useState('');
    const [sortBy, setSortBy] = useState('name_asc');
    
    // Modal state for selected breed details
    const [selectedBreed, setSelectedBreed] = useState(null);

    useEffect(() => {
        async function fetchBreeds() {
            try {
                const data = await getBreeds({
                    animalType: filterType,
                    search: searchTerm,
                    region: filterRegion,
                    primaryUse: filterUse,
                    minMilk: milkPreset === 'custom' ? customMinMilk : (milkPreset === 'high' ? 8 : (milkPreset === 'low' ? 0 : '')),
                    maxMilk: milkPreset === 'custom' ? customMaxMilk : (milkPreset === 'med' ? 8 : (milkPreset === 'low' ? 4 : '')),
                    sortBy: sortBy
                });
                if (data.breeds && data.breeds.length > 0) {
                    setBreeds(data.breeds);
                }
            } catch {
                // Fallback to static data filtered on client side
            }
        }
        fetchBreeds();
    }, [filterType, searchTerm, filterRegion, filterUse, milkPreset, customMinMilk, customMaxMilk, sortBy]);

    // Client-side filtering & sorting fallback
    const filteredAndSortedBreeds = useMemo(() => {
        return breeds.filter(b => {
            // Text Search matching
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                const matchesName = b.breed_name.toLowerCase().includes(term);
                const matchesRegion = b.region.toLowerCase().includes(term);
                const matchesUse = b.primary_use.toLowerCase().includes(term);
                const matchesType = b.animal_type.toLowerCase().includes(term);
                const matchesDesc = b.description && b.description.toLowerCase().includes(term);
                if (!matchesName && !matchesRegion && !matchesUse && !matchesType && !matchesDesc) {
                    return false;
                }
            }

            // Animal Type Filter
            if (filterType && b.animal_type.toLowerCase() !== filterType.toLowerCase()) {
                return false;
            }

            // Region/State Filter
            if (filterRegion && !b.region.toLowerCase().includes(filterRegion.toLowerCase())) {
                return false;
            }

            // Primary Use Filter
            if (filterUse && !b.primary_use.toLowerCase().includes(filterUse.toLowerCase())) {
                return false;
            }

            // Milk Yield (Liters/day) Filter
            const maxYield = b.max_milk_yield ?? (parseFloat(b.avg_milk_liters_per_day?.split('-')[1]) || 0);
            const minYield = b.min_milk_yield ?? (parseFloat(b.avg_milk_liters_per_day?.split('-')[0]) || 0);

            if (milkPreset === 'high' && maxYield < 8) {
                return false;
            } else if (milkPreset === 'med' && (maxYield < 4 || minYield > 8)) {
                return false;
            } else if (milkPreset === 'low' && maxYield > 4) {
                return false;
            } else if (milkPreset === 'custom') {
                if (customMinMilk !== '' && maxYield < parseFloat(customMinMilk)) return false;
                if (customMaxMilk !== '' && minYield > parseFloat(customMaxMilk)) return false;
            }

            return true;
        }).sort((a, b) => {
            if (sortBy === 'name_asc') {
                return a.breed_name.localeCompare(b.breed_name);
            } else if (sortBy === 'name_desc') {
                return b.breed_name.localeCompare(a.breed_name);
            } else if (sortBy === 'milk_desc') {
                const bMax = b.max_milk_yield ?? (parseFloat(b.avg_milk_liters_per_day?.split('-')[1]) || 0);
                const aMax = a.max_milk_yield ?? (parseFloat(a.avg_milk_liters_per_day?.split('-')[1]) || 0);
                return bMax - aMax;
            } else if (sortBy === 'milk_asc') {
                const bMin = b.min_milk_yield ?? (parseFloat(b.avg_milk_liters_per_day?.split('-')[0]) || 0);
                const aMin = a.min_milk_yield ?? (parseFloat(a.avg_milk_liters_per_day?.split('-')[0]) || 0);
                return aMin - bMin;
            } else if (sortBy === 'lifespan_desc') {
                return (b.lifespan_years || '').localeCompare(a.lifespan_years || '');
            }
            return 0;
        });
    }, [breeds, searchTerm, filterType, filterRegion, filterUse, milkPreset, customMinMilk, customMaxMilk, sortBy]);

    // Count active filters
    const activeFilters = useMemo(() => {
        const filters = [];
        if (searchTerm) filters.push({ type: 'search', label: `Search: "${searchTerm}"`, clear: () => setSearchTerm('') });
        if (filterType) filters.push({ type: 'animalType', label: `Type: ${filterType}`, clear: () => setFilterType('') });
        if (filterRegion) filters.push({ type: 'region', label: `Region: ${filterRegion}`, clear: () => setFilterRegion('') });
        if (filterUse) filters.push({ type: 'use', label: `Use: ${filterUse}`, clear: () => setFilterUse('') });
        if (milkPreset !== 'all') {
            let label = `Milk: `;
            if (milkPreset === 'high') label += `High (>8 L/day)`;
            else if (milkPreset === 'med') label += `Medium (4-8 L/day)`;
            else if (milkPreset === 'low') label += `Low (<4 L/day)`;
            else if (milkPreset === 'custom') label += `Custom (${customMinMilk || 0} - ${customMaxMilk || '∞'} L)`;
            filters.push({ type: 'milk', label, clear: () => { setMilkPreset('all'); setCustomMinMilk(''); setCustomMaxMilk(''); } });
        }
        return filters;
    }, [searchTerm, filterType, filterRegion, filterUse, milkPreset, customMinMilk, customMaxMilk]);

    const resetAllFilters = () => {
        setSearchTerm('');
        setFilterType('');
        setFilterRegion('');
        setFilterUse('');
        setMilkPreset('all');
        setCustomMinMilk('');
        setCustomMaxMilk('');
        setSortBy('name_asc');
    };

    return (
        <div className="page">
            <div className="explorer-header">
                <div>
                    <h2 className="section-title">Breed Explorer & Search</h2>
                    <p className="section-subtitle">
                        Comprehensive search across 26 indigenous cattle and buffalo breeds by Milk Yield (Liters/day), Region, Purpose, & Type.
                    </p>
                </div>
            </div>

            {/* Quick Preset Filter Chips */}
            <div className="quick-tags-bar">
                <span className="quick-tags-title">Quick Search:</span>
                <button
                    className={`tag-chip ${milkPreset === 'high' ? 'active' : ''}`}
                    onClick={() => setMilkPreset(milkPreset === 'high' ? 'all' : 'high')}>
                    🥛 High Milk Yield (&gt;8 L/day)
                </button>
                <button
                    className={`tag-chip ${filterType === 'Cow' ? 'active' : ''}`}
                    onClick={() => setFilterType(filterType === 'Cow' ? '' : 'Cow')}>
                    🐄 Cows
                </button>
                <button
                    className={`tag-chip ${filterType === 'Buffalo' ? 'active' : ''}`}
                    onClick={() => setFilterType(filterType === 'Buffalo' ? '' : 'Buffalo')}>
                    🐃 Buffaloes
                </button>
                <button
                    className={`tag-chip ${filterUse === 'Dairy' ? 'active' : ''}`}
                    onClick={() => setFilterUse(filterUse === 'Dairy' ? '' : 'Dairy')}>
                    🥛 Dairy Breeds
                </button>
                <button
                    className={`tag-chip ${filterUse === 'Draught' ? 'active' : ''}`}
                    onClick={() => setFilterUse(filterUse === 'Draught' ? '' : 'Draught')}>
                    🚜 Draught Breeds
                </button>
                <button
                    className={`tag-chip ${filterRegion === 'Gujarat' ? 'active' : ''}`}
                    onClick={() => setFilterRegion(filterRegion === 'Gujarat' ? '' : 'Gujarat')}>
                    🌾 Gujarat
                </button>
                <button
                    className={`tag-chip ${filterRegion === 'Tamil Nadu' ? 'active' : ''}`}
                    onClick={() => setFilterRegion(filterRegion === 'Tamil Nadu' ? '' : 'Tamil Nadu')}>
                    🌴 Tamil Nadu
                </button>
            </div>

            {/* Main Multi-Filter Control Panel */}
            <div className="breed-filters-panel">
                <div className="filters-row primary-row">
                    {/* Search Input */}
                    <div className="search-input-wrapper" style={{ flex: 2, minWidth: '240px' }}>
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search breed name, state, characteristics, description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>✕</button>
                        )}
                    </div>

                    {/* Animal Type */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Animal Types</option>
                        <option value="Cow">🐄 Cow Only</option>
                        <option value="Buffalo">🐃 Buffalo Only</option>
                    </select>

                    {/* Region / State */}
                    <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Regions / States</option>
                        {POPULAR_STATES.map(state => (
                            <option key={state} value={state}>📍 {state}</option>
                        ))}
                    </select>

                    {/* Primary Use */}
                    <select
                        value={filterUse}
                        onChange={(e) => setFilterUse(e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Uses / Purposes</option>
                        {POPULAR_USES.map(use => (
                            <option key={use} value={use}>{use}</option>
                        ))}
                    </select>
                </div>

                <div className="filters-row secondary-row">
                    {/* Milk Yield (Liters/day) Filter */}
                    <div className="filter-group">
                        <label className="filter-label">Milk Yield (Liters/day):</label>
                        <div className="preset-button-group">
                            <button
                                className={`preset-btn ${milkPreset === 'all' ? 'active' : ''}`}
                                onClick={() => setMilkPreset('all')}>All</button>
                            <button
                                className={`preset-btn ${milkPreset === 'high' ? 'active' : ''}`}
                                onClick={() => setMilkPreset('high')}>High (&gt;8L)</button>
                            <button
                                className={`preset-btn ${milkPreset === 'med' ? 'active' : ''}`}
                                onClick={() => setMilkPreset('med')}>Med (4-8L)</button>
                            <button
                                className={`preset-btn ${milkPreset === 'low' ? 'active' : ''}`}
                                onClick={() => setMilkPreset('low')}>Low (&lt;4L)</button>
                            <button
                                className={`preset-btn ${milkPreset === 'custom' ? 'active' : ''}`}
                                onClick={() => setMilkPreset('custom')}>Custom Range</button>
                        </div>
                    </div>

                    {milkPreset === 'custom' && (
                        <div className="custom-range-inputs">
                            <input
                                type="number"
                                placeholder="Min L/day"
                                value={customMinMilk}
                                onChange={(e) => setCustomMinMilk(e.target.value)}
                                className="range-input"
                                min="0"
                                max="30"
                            />
                            <span className="range-dash">to</span>
                            <input
                                type="number"
                                placeholder="Max L/day"
                                value={customMaxMilk}
                                onChange={(e) => setCustomMaxMilk(e.target.value)}
                                className="range-input"
                                min="0"
                                max="30"
                            />
                        </div>
                    )}

                    {/* Sorting Dropdown */}
                    <div className="filter-group sort-group" style={{ marginLeft: 'auto' }}>
                        <label className="filter-label">Sort By:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select sort-select"
                        >
                            <option value="name_asc">Breed Name (A-Z)</option>
                            <option value="name_desc">Breed Name (Z-A)</option>
                            <option value="milk_desc">Highest Milk Yield 🥛</option>
                            <option value="milk_asc">Lowest Milk Yield</option>
                            <option value="lifespan_desc">Longest Lifespan</option>
                        </select>
                    </div>
                </div>

                {/* Active Filter Pills & Reset */}
                {activeFilters.length > 0 && (
                    <div className="active-filters-bar">
                        <span className="active-filters-title">Active Filters:</span>
                        {activeFilters.map(f => (
                            <span key={f.label} className="active-pill">
                                {f.label}
                                <button onClick={f.clear} className="pill-remove-btn">✕</button>
                            </span>
                        ))}
                        <button onClick={resetAllFilters} className="reset-filters-btn">
                            Reset All Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Results Count Banner */}
            <div className="results-status-bar">
                <span className="results-count">
                    Showing <strong>{filteredAndSortedBreeds.length}</strong> of {breeds.length} breeds
                </span>
                {filteredAndSortedBreeds.length === 0 && (
                    <span className="no-results-hint">
                        No breeds match your selected criteria. Try resetting or adjusting your search filters.
                    </span>
                )}
            </div>

            {/* Breeds Grid */}
            <div className="breeds-grid">
                {filteredAndSortedBreeds.map((breed) => {
                    const maxYield = breed.max_milk_yield ?? (parseFloat(breed.avg_milk_liters_per_day?.split('-')[1]) || 0);
                    const yieldPercentage = Math.min(100, Math.round((maxYield / 15) * 100));

                    return (
                        <div
                            className="card breed-card"
                            key={breed.breed_id}
                            onClick={() => setSelectedBreed(breed)}
                        >
                            <div className="breed-card-header">
                                <span className="breed-card-name">{breed.breed_name}</span>
                                <span className={`breed-type-badge ${breed.animal_type.toLowerCase()}`}>
                                    {breed.animal_type === 'Cow' ? '🐄 Cow' : '🐃 Buffalo'}
                                </span>
                            </div>

                            <div className="breed-card-detail">
                                <span className="label">📍 Region</span>
                                <span className="value region-highlight">{breed.region}</span>
                            </div>
                            
                            <div className="breed-card-detail">
                                <span className="label">🎯 Primary Use</span>
                                <span className="value badge-use">{breed.primary_use}</span>
                            </div>

                            {breed.avg_milk_liters_per_day && (
                                <div className="milk-yield-section">
                                    <div className="breed-card-detail milk-detail">
                                        <span className="label">🥛 Milk Yield</span>
                                        <span className="value milk-value">{breed.avg_milk_liters_per_day} L/day</span>
                                    </div>
                                    <div className="yield-meter-bg" title={`${breed.avg_milk_liters_per_day} Liters/day`}>
                                        <div
                                            className="yield-meter-fill"
                                            style={{ width: `${yieldPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {breed.lifespan_years && (
                                <div className="breed-card-detail">
                                    <span className="label">⏳ Lifespan</span>
                                    <span className="value">{breed.lifespan_years} years</span>
                                </div>
                            )}

                            {breed.description && (
                                <p className="breed-card-description">
                                    {breed.description}
                                </p>
                            )}

                            <div className="card-footer-action">
                                <span>Click to view full traits & details →</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Breed Detail Modal Dialog */}
            {selectedBreed && (
                <div className="modal-backdrop" onClick={() => setSelectedBreed(null)}>
                    <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedBreed(null)}>✕</button>
                        
                        <div className="modal-header">
                            <div>
                                <span className={`breed-type-badge ${selectedBreed.animal_type.toLowerCase()}`}>
                                    {selectedBreed.animal_type === 'Cow' ? '🐄 Indigenous Cow' : '🐃 Water Buffalo'}
                                </span>
                                <h2 className="modal-title">{selectedBreed.breed_name}</h2>
                            </div>
                        </div>

                        <div className="modal-body">
                            <p className="modal-description">{selectedBreed.description}</p>

                            <div className="modal-stats-grid">
                                <div className="modal-stat-box">
                                    <span className="stat-icon">🥛</span>
                                    <span className="stat-label">Average Milk Yield</span>
                                    <span className="stat-value">{selectedBreed.avg_milk_liters_per_day} Liters / day</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">📍</span>
                                    <span className="stat-label">Native Region</span>
                                    <span className="stat-value">{selectedBreed.region}</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">🚜</span>
                                    <span className="stat-label">Primary Purpose</span>
                                    <span className="stat-value">{selectedBreed.primary_use}</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">⏳</span>
                                    <span className="stat-label">Average Lifespan</span>
                                    <span className="stat-value">{selectedBreed.lifespan_years} Years</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setSelectedBreed(null)}>
                                Close Explorer View
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BreedExplorerPage;

