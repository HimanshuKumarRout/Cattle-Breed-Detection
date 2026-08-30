import { useState, useEffect, useMemo } from 'react';
import { getBreeds } from '../services/api';

// Static breed data with min/max milk yield numbers for precise filtering
const STATIC_BREEDS = [
    {"breed_id": 1, "breed_name": "Alambadi Cow", "animal_type": "Cow", "region": "Tamil Nadu, India", "primary_use": "Draught", "avg_milk_liters_per_day": "2-3", "min_milk_yield": 2.0, "max_milk_yield": 3.0, "daily_food_req": "15-20 kg/day", "food_items": "Green Sorghum (Jowar), Dry Paddy Straw, Legume Fodder & Mineral Salt", "daily_expenditure": "\u20b9100-140", "lifespan_years": "15-18", "description": "Hardy draught breed from Tamil Nadu adapted to dry semi-arid conditions. Known for endurance and strength in agricultural work.", "coat_color_notes": "Grey to dark grey with white markings", "horn_notes": "Long curved horns spreading outward"},
    {"breed_id": 2, "breed_name": "Amritmahal Cow", "animal_type": "Cow", "region": "Karnataka, India", "primary_use": "Draught", "avg_milk_liters_per_day": "1-2", "min_milk_yield": 1.0, "max_milk_yield": 2.0, "daily_food_req": "15-20 kg/day", "food_items": "Green Napier/Sorghum, Jowar Stover, Groundnut Cake & Salt", "daily_expenditure": "\u20b990-130", "lifespan_years": "18-20", "description": "Elite draught breed from Karnataka known for speed and endurance. Originally bred for the Mysore army for hauling equipment.", "coat_color_notes": "Grey to white with darker head and neck", "horn_notes": "Long lyre-shaped upward curving horns"},
    {"breed_id": 3, "breed_name": "Banni Buffalo", "animal_type": "Buffalo", "region": "Gujarat, India", "primary_use": "Dairy", "avg_milk_liters_per_day": "10-14", "min_milk_yield": 10.0, "max_milk_yield": 14.0, "daily_food_req": "30-40 kg/day", "food_items": "Banni Pasture Grass, Green Lucerne/Maize, Wheat Straw, Cottonseed Cake & Mineral Mix", "daily_expenditure": "\u20b9220-300", "lifespan_years": "20-25", "description": "High-yielding buffalo breed from the Banni grasslands of Kutch. Well adapted to arid conditions with excellent milk fat content.", "coat_color_notes": "Jet black with occasional white markings on forehead", "horn_notes": "Medium curved sickle-shaped horns"},
    {"breed_id": 4, "breed_name": "Bargur Cow", "animal_type": "Cow", "region": "Tamil Nadu, India", "primary_use": "Draught", "avg_milk_liters_per_day": "2-3", "min_milk_yield": 2.0, "max_milk_yield": 3.0, "daily_food_req": "12-18 kg/day", "food_items": "Hill Pasture Grass, Forest Fodder, Paddy Straw, Rice Bran & Salt", "daily_expenditure": "\u20b980-120", "lifespan_years": "15-18", "description": "Agile draught breed from the Bargur hills of Erode district. Known for its speed and hill-terrain adaptability.", "coat_color_notes": "Brown to reddish brown with white patches", "horn_notes": "Medium curved horns"},
    {"breed_id": 5, "breed_name": "Dangi Cow", "animal_type": "Cow", "region": "Maharashtra, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "1-3", "min_milk_yield": 1.0, "max_milk_yield": 3.0, "daily_food_req": "15-22 kg/day", "food_items": "Native Hill Grass, Paddy Straw, Groundnut Cake & Mineral Mixture", "daily_expenditure": "\u20b9100-140", "lifespan_years": "15-18", "description": "Hardy breed from the hilly Dangs region. Tolerant to heavy rainfall and humid conditions. Used for both draught and limited milk production.", "coat_color_notes": "White with red or black spots", "horn_notes": "Short stumpy horns"},
    {"breed_id": 6, "breed_name": "Deoni Cow", "animal_type": "Cow", "region": "Maharashtra / Karnataka, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "3-5", "min_milk_yield": 3.0, "max_milk_yield": 5.0, "daily_food_req": "20-28 kg/day", "food_items": "Green Jowar/Maize, Wheat Straw, Cottonseed Cake & Arhar Husk", "daily_expenditure": "\u20b9130-180", "lifespan_years": "15-18", "description": "Dual-purpose breed from the Deccan plateau. Decent milk yield and good draught capability. Known as \"Dongari\" or \"Dongerpati\" cattle.", "coat_color_notes": "White body with black or red spots on head and neck", "horn_notes": "Medium sized curved horns"},
    {"breed_id": 7, "breed_name": "Gir Cow", "animal_type": "Cow", "region": "Gujarat, India", "primary_use": "Dairy", "avg_milk_liters_per_day": "6-10", "min_milk_yield": 6.0, "max_milk_yield": 10.0, "daily_food_req": "25-35 kg/day", "food_items": "Green Berseem/Lucerne, Jowar Fodder, Wheat Straw, Cottonseed Cake & Mineral Mix", "daily_expenditure": "\u20b9180-240", "lifespan_years": "12-15", "description": "One of the principal dairy breeds of India. Highly heat tolerant with excellent disease resistance. Exported worldwide to tropical countries.", "coat_color_notes": "Reddish to spotted red-white with distinctive curved forehead", "horn_notes": "Long pendulous ears; curved horns"},
    {"breed_id": 8, "breed_name": "Hallikar Cow", "animal_type": "Cow", "region": "Karnataka, India", "primary_use": "Draught", "avg_milk_liters_per_day": "1-2", "min_milk_yield": 1.0, "max_milk_yield": 2.0, "daily_food_req": "15-22 kg/day", "food_items": "Green Sorghum, Ragi (Finger Millet) Straw, Groundnut Cake & Mineral Salt", "daily_expenditure": "\u20b9100-140", "lifespan_years": "18-20", "description": "Premier draught breed of South India known for compact muscular build. Progenitor of several other South Indian breeds.", "coat_color_notes": "Grey to dark grey", "horn_notes": "Long lyre-shaped horns curving backward"},
    {"breed_id": 9, "breed_name": "Jaffrabadi Buffalo", "animal_type": "Buffalo", "region": "Gujarat, India", "primary_use": "Dairy", "avg_milk_liters_per_day": "8-12", "min_milk_yield": 8.0, "max_milk_yield": 12.0, "daily_food_req": "35-45 kg/day", "food_items": "Green Maize/Napier, Wheat Straw, Cottonseed Cake & Rice Bran", "daily_expenditure": "\u20b9250-320", "lifespan_years": "20-25", "description": "Heaviest Indian buffalo breed from Gir forests of Gujarat. Known for high milk yield with excellent fat percentage.", "coat_color_notes": "Black", "horn_notes": "Heavy massive horns curving downward then upward"},
    {"breed_id": 10, "breed_name": "Kangayam Cow", "animal_type": "Cow", "region": "Tamil Nadu, India", "primary_use": "Draught", "avg_milk_liters_per_day": "2-4", "min_milk_yield": 2.0, "max_milk_yield": 4.0, "daily_food_req": "18-25 kg/day", "food_items": "Green Sorghum, Paddy Straw, Cottonseed & Sesame Cake", "daily_expenditure": "\u20b9120-160", "lifespan_years": "18-20", "description": "Powerful draught breed from Tamil Nadu. Known for compact muscular body and endurance in heavy agricultural work.", "coat_color_notes": "Grey to white with red or brown tinge", "horn_notes": "Short sturdy horns"},
    {"breed_id": 11, "breed_name": "Kankrej Cow", "animal_type": "Cow", "region": "Gujarat / Rajasthan, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "5-8", "min_milk_yield": 5.0, "max_milk_yield": 8.0, "daily_food_req": "25-32 kg/day", "food_items": "Green Sorghum/Berseem, Bajra Stover, Mustard Cake & Mineral Mix", "daily_expenditure": "\u20b9160-220", "lifespan_years": "15-18", "description": "Large dual-purpose breed. Known for heavy build and fast trotting gait. Popular for both milk production and draught work.", "coat_color_notes": "Silver-grey to steel grey with darker forequarters", "horn_notes": "Strong lyre-shaped horns"},
    {"breed_id": 12, "breed_name": "Kasaragod Cow", "animal_type": "Cow", "region": "Kerala, India", "primary_use": "Dwarf Cattle", "avg_milk_liters_per_day": "2-3", "min_milk_yield": 2.0, "max_milk_yield": 3.0, "daily_food_req": "8-12 kg/day", "food_items": "Native Coastal Grass, Rice Gruel, Paddy Straw, Coconut Cake", "daily_expenditure": "\u20b950-80", "lifespan_years": "15-18", "description": "Small-sized cattle breed from the Kasaragod district of Kerala. Well adapted to the tropical coastal climate and resistant to local diseases.", "coat_color_notes": "Reddish brown to black", "horn_notes": "Short small horns"},
    {"breed_id": 13, "breed_name": "Kenkatha Cow", "animal_type": "Cow", "region": "Uttar Pradesh / Madhya Pradesh, India", "primary_use": "Draught", "avg_milk_liters_per_day": "2-4", "min_milk_yield": 2.0, "max_milk_yield": 4.0, "daily_food_req": "15-20 kg/day", "food_items": "Riverine Pasture Grass, Jowar Kadbi, Mustard Cake & Salt", "daily_expenditure": "\u20b990-130", "lifespan_years": "15-18", "description": "Compact draught breed from the Ken river valley of Bundelkhand. Hardy and well-suited to rocky terrain.", "coat_color_notes": "Grey to dark grey with lighter underbelly", "horn_notes": "Short thick horns"},
    {"breed_id": 14, "breed_name": "Kherigarh Cow", "animal_type": "Cow", "region": "Uttar Pradesh, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "3-5", "min_milk_yield": 3.0, "max_milk_yield": 5.0, "daily_food_req": "18-24 kg/day", "food_items": "Green Maize/Jowar, Wheat Straw, Mustard Cake & Wheat Bran", "daily_expenditure": "\u20b9110-150", "lifespan_years": "15-18", "description": "Medium-sized dual-purpose breed from the Kheri district of UP. Known for reasonable milk yield and good draught capability.", "coat_color_notes": "White to light grey", "horn_notes": "Medium lyre-shaped horns"},
    {"breed_id": 15, "breed_name": "Malnad gidda Cow", "animal_type": "Cow", "region": "Karnataka, India", "primary_use": "Dairy (small-scale)", "avg_milk_liters_per_day": "1-3", "min_milk_yield": 1.0, "max_milk_yield": 3.0, "daily_food_req": "8-14 kg/day", "food_items": "Western Ghats Grazing Grass, Rice Straw, Coconut/Groundnut Cake", "daily_expenditure": "\u20b950-90", "lifespan_years": "18-20", "description": "Smallest Indian cattle breed from the Western Ghats of Karnataka. Extremely hardy with strong disease resistance adapted to heavy rainfall and hilly terrain.", "coat_color_notes": "Varied: black brown red or white", "horn_notes": "Short small horns or polled"},
    {"breed_id": 16, "breed_name": "Mehsana Buffalo", "animal_type": "Buffalo", "region": "Gujarat, India", "primary_use": "Dairy", "avg_milk_liters_per_day": "8-12", "min_milk_yield": 8.0, "max_milk_yield": 12.0, "daily_food_req": "30-38 kg/day", "food_items": "Green Lucerne/Sorghum, Wheat Straw, Cottonseed Cake & Rice Bran", "daily_expenditure": "\u20b9200-270", "lifespan_years": "20-25", "description": "Important dairy buffalo from North Gujarat. Cross between Murrah and Surti. Consistent milk producer with good fat content.", "coat_color_notes": "Black to brownish black", "horn_notes": "Sickle-shaped curving upward and backward"},
    {"breed_id": 17, "breed_name": "Nagori Cow", "animal_type": "Cow", "region": "Rajasthan, India", "primary_use": "Draught", "avg_milk_liters_per_day": "2-4", "min_milk_yield": 2.0, "max_milk_yield": 4.0, "daily_food_req": "20-26 kg/day", "food_items": "Green Bajra/Jowar, Dry Stover, Guar Meal & Mineral Salt", "daily_expenditure": "\u20b9130-170", "lifespan_years": "15-18", "description": "Tall well-built draught breed from the Nagaur district of Rajasthan. Prized for fast trotting ability and endurance in desert conditions.", "coat_color_notes": "White to light grey with darker extremities", "horn_notes": "Medium upward-pointing horns"},
    {"breed_id": 18, "breed_name": "Nagpuri Buffalo", "animal_type": "Buffalo", "region": "Maharashtra, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "5-7", "min_milk_yield": 5.0, "max_milk_yield": 7.0, "daily_food_req": "25-32 kg/day", "food_items": "Green Sugarcane Tops/Napier, Jowar Kadbi, Cottonseed Cake", "daily_expenditure": "\u20b9160-220", "lifespan_years": "20-25", "description": "Distinctive buffalo breed from the Nagpur region. Known for extremely long horns and adaptation to hot dry climate of Vidarbha.", "coat_color_notes": "Black", "horn_notes": "Very long flat curved sickle-shaped horns (can exceed 60cm)"},
    {"breed_id": 19, "breed_name": "Nili ravi Buffalo", "animal_type": "Buffalo", "region": "Punjab, India / Pakistan", "primary_use": "Dairy", "avg_milk_liters_per_day": "8-14", "min_milk_yield": 8.0, "max_milk_yield": 14.0, "daily_food_req": "32-42 kg/day", "food_items": "Green Berseem/Maize, Wheat Straw, Mustard Cake & Rice Bran", "daily_expenditure": "\u20b9220-290", "lifespan_years": "20-25", "description": "Premier dairy buffalo breed from the Punjab region. One of the highest milk-yielding buffalo breeds in the world.", "coat_color_notes": "Black with white markings on forehead and legs", "horn_notes": "Small tightly curled horns"},
    {"breed_id": 20, "breed_name": "Nimari Cow", "animal_type": "Cow", "region": "Madhya Pradesh, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "2-4", "min_milk_yield": 2.0, "max_milk_yield": 4.0, "daily_food_req": "18-24 kg/day", "food_items": "Green Narmada Basin Fodder, Jowar Kadbi, Cottonseed Cake", "daily_expenditure": "\u20b9110-150", "lifespan_years": "15-18", "description": "Medium-sized dual-purpose breed from the Nimar valley (Narmada basin). Suitable for both draught and moderate milk production.", "coat_color_notes": "Red to reddish brown with darker extremities", "horn_notes": "Medium lyre-shaped horns"},
    {"breed_id": 21, "breed_name": "Pulikulam Cow", "animal_type": "Cow", "region": "Tamil Nadu, India", "primary_use": "Draught / Sport", "avg_milk_liters_per_day": "1-2", "min_milk_yield": 1.0, "max_milk_yield": 2.0, "daily_food_req": "12-16 kg/day", "food_items": "Open Grazing Grass, Paddy Straw, Rice Bran & Mineral Salt", "daily_expenditure": "\u20b970-110", "lifespan_years": "15-18", "description": "Small agile breed from the Madurai-Sivaganga region. Traditionally used in the Jallikattu bull-taming sport. Known for agility and tenacity.", "coat_color_notes": "Grey to dark grey", "horn_notes": "Sharp curved horns"},
    {"breed_id": 22, "breed_name": "Rathi Cow", "animal_type": "Cow", "region": "Rajasthan, India", "primary_use": "Dairy", "avg_milk_liters_per_day": "6-8", "min_milk_yield": 6.0, "max_milk_yield": 8.0, "daily_food_req": "22-30 kg/day", "food_items": "Green Lucerne/Sorghum, Bajra Stover, Cottonseed Cake & Guar Meal", "daily_expenditure": "\u20b9150-200", "lifespan_years": "15-18", "description": "One of the best dairy breeds of Rajasthan from the Bikaner region. Adapted to arid conditions with efficient feed conversion.", "coat_color_notes": "Brown with white patches", "horn_notes": "Short to medium curved horns"},
    {"breed_id": 23, "breed_name": "Sahiwal Cow", "animal_type": "Cow", "region": "Punjab, India / Pakistan", "primary_use": "Dairy", "avg_milk_liters_per_day": "8-12", "min_milk_yield": 8.0, "max_milk_yield": 12.0, "daily_food_req": "28-36 kg/day", "food_items": "Green Berseem/Maize, Wheat Straw, Cottonseed Cake & Mineral Mix", "daily_expenditure": "\u20b9190-250", "lifespan_years": "15-18", "description": "One of the best dairy breeds of the Indian subcontinent. Highly heat-tolerant and tick-resistant. Exported globally to tropical countries.", "coat_color_notes": "Reddish to reddish brown with occasional white patches", "horn_notes": "Short stumpy horns (often polled)"},
    {"breed_id": 24, "breed_name": "Shurti Buffalo", "animal_type": "Buffalo", "region": "Karnataka, India", "primary_use": "Dairy", "avg_milk_liters_per_day": "4-6", "min_milk_yield": 4.0, "max_milk_yield": 6.0, "daily_food_req": "22-28 kg/day", "food_items": "Green Napier/Sugarcane Tops, Paddy Straw, Groundnut Cake & Rice Bran", "daily_expenditure": "\u20b9140-190", "lifespan_years": "20-25", "description": "Small to medium dairy buffalo from the North Karnataka region. Adapted to medium rainfall zone and maintained by small farmers.", "coat_color_notes": "Black to brownish black", "horn_notes": "Medium flat horns curving backward"},
    {"breed_id": 25, "breed_name": "Tharparkar Cow", "animal_type": "Cow", "region": "Rajasthan, India / Sindh, Pakistan", "primary_use": "Dairy", "avg_milk_liters_per_day": "6-10", "min_milk_yield": 6.0, "max_milk_yield": 10.0, "daily_food_req": "24-32 kg/day", "food_items": "Green Desert Fodder/Sorghum, Bajra Stover, Cottonseed Cake & Mineral Mix", "daily_expenditure": "\u20b9160-220", "lifespan_years": "18-20", "description": "Hardy dual-purpose breed from the Thar desert. Among the best milkers of Indian zebu breeds. Well adapted to extreme heat and scarce water.", "coat_color_notes": "White to grey", "horn_notes": "Medium lyre-shaped horns curving upward"},
    {"breed_id": 26, "breed_name": "Umblachery Cow", "animal_type": "Cow", "region": "Tamil Nadu, India", "primary_use": "Draught", "avg_milk_liters_per_day": "1-2", "min_milk_yield": 1.0, "max_milk_yield": 2.0, "daily_food_req": "12-18 kg/day", "food_items": "Delta Grazing Grass, Paddy Straw, Rice Bran & Mineral Salt", "daily_expenditure": "\u20b980-120", "lifespan_years": "15-18", "description": "Compact draught breed from the Cauvery delta region. Known for ability to work in waterlogged paddy fields. Important for rice cultivation.", "coat_color_notes": "Reddish brown calves turning grey as adults", "horn_notes": "Short curved horns"},
    {"breed_id": 27, "breed_name": "Manda", "animal_type": "Buffalo", "region": "Odisha, India", "primary_use": "Draught", "avg_milk_liters_per_day": "2.43-3", "min_milk_yield": 2.43, "max_milk_yield": 3.0, "daily_food_req": "22-28 kg/day", "food_items": "Koraput Plateau Grass, Paddy Straw, Oil Cake & Mineral Salt", "daily_expenditure": "\u20b9130-180", "lifespan_years": "15-20", "description": "Indigenous buffalo breed adapted to the Eastern Ghats and Koraput plateau; valued for hardiness, draught ability and milk.", "coat_color_notes": "Mostly ash grey or grey; lighter lower legs; sometimes silver-white", "horn_notes": "Broad horns extending backward and inward in a half-circle"},
    {"breed_id": 28, "breed_name": "Punganur", "animal_type": "Cow", "region": "Andhra Pradesh, India", "primary_use": "Dairy", "avg_milk_liters_per_day": "2", "min_milk_yield": 2.0, "max_milk_yield": 2.0, "daily_food_req": "6-10 kg/day", "food_items": "Dry Fodder, Crop Residues, Rice Bran, Cottonseed & Mineral Mix", "daily_expenditure": "\u20b940-70", "lifespan_years": "15-20", "description": "Punganur is a small indigenous dwarf cattle breed native to the Chittoor region of Andhra Pradesh. It is known for its short stature, low maintenance requirements, ability to thrive on dry fodder, and relatively high-fat milk. Bullocks have traditionally been used for light agricultural work and cart pulling", "coat_color_notes": "White, grey, light brown to dark brown or red; white animals with brown, red or black patches may occur", "horn_notes": "Small, black, crescent-shaped horns; generally curve backward and forward in males, and laterally/forward in females"},
    {"breed_id": 29, "breed_name": "Motu", "animal_type": "Cow", "region": "Odisha, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "1.5-3", "min_milk_yield": 1.5, "max_milk_yield": 3.0, "daily_food_req": "12-16 kg/day", "food_items": "Malkangiri Pasture Grass, Paddy Straw, Rice Bran & Salt", "daily_expenditure": "\u20b970-110", "lifespan_years": "12-15", "description": "Motu is an indigenous cattle breed of Odisha, mainly found in the Malkangiri region. It is adapted to local climatic conditions and traditionally used for milk production and agricultural draught work.", "coat_color_notes": "Usually grey to white; bulls may be darker", "horn_notes": "Medium-sized, curved horns"},
    {"breed_id": 30, "breed_name": "Chilika", "animal_type": "Cow", "region": "Odisha, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "1-2.5", "min_milk_yield": 1.0, "max_milk_yield": 2.5, "daily_food_req": "10-15 kg/day", "food_items": "Coastal Chilika Grazing Fodder, Paddy Straw, Salt & Rice Bran", "daily_expenditure": "\u20b960-100", "lifespan_years": "12-15", "description": "Chilika cattle are indigenous to the coastal Chilika region of Odisha. They are hardy animals adapted to local environmental conditions and are mainly maintained for milk and agricultural purposes.", "coat_color_notes": "Generally white or grey", "horn_notes": "Short to medium, curved horns"},
    {"breed_id": 31, "breed_name": "Kalahandi", "animal_type": "Cow", "region": "Odisha, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "1.5-3", "min_milk_yield": 1.5, "max_milk_yield": 3.0, "daily_food_req": "12-18 kg/day", "food_items": "Local Scrub Fodder, Jowar/Paddy Straw, Oil Cake & Mineral Salt", "daily_expenditure": "\u20b975-115", "lifespan_years": "12-16", "description": "Kalahandi cattle are an indigenous breed from western Odisha. They are hardy and well adapted to drought-prone environments, primarily used for draught power and secondary milk production.", "coat_color_notes": "Usually grey or white with darker shades", "horn_notes": "Medium-sized, upward and outward curved horns"},
    {"breed_id": 32, "breed_name": "Binjharpuri", "animal_type": "Cow", "region": "Odisha, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "2-4", "min_milk_yield": 2.0, "max_milk_yield": 4.0, "daily_food_req": "15-20 kg/day", "food_items": "Delta Green Fodder, Paddy Straw, Mustard Cake & Rice Bran", "daily_expenditure": "\u20b995-135", "lifespan_years": "12-17", "description": "Binjharpuri is an indigenous cattle breed native to Jajpur and surrounding areas of Odisha. It is valued for its adaptability, draught ability, and moderate milk production.", "coat_color_notes": "White to grey; bulls may have darker forequarters", "horn_notes": "Medium-sized, curved outward and upward"},
    {"breed_id": 33, "breed_name": "Ghumsuri", "animal_type": "Cow", "region": "Odisha, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "1.5-3", "min_milk_yield": 1.5, "max_milk_yield": 3.0, "daily_food_req": "12-16 kg/day", "food_items": "Ghumusar Forest Grass, Paddy Straw, Groundnut Cake & Salt", "daily_expenditure": "\u20b970-110", "lifespan_years": "12-18", "description": "Ghumsuri cattle are indigenous to the Ghumusar region of Odisha. The breed is hardy, adapted to local conditions, and traditionally used for draught work and milk production", "coat_color_notes": "Usually grey, white, or brownish-grey", "horn_notes": "Medium-sized, curved horns"},
    {"breed_id": 34, "breed_name": "Khariar", "animal_type": "Cow", "region": "Odisha, India", "primary_use": "Dual Purpose", "avg_milk_liters_per_day": "1.5-3", "min_milk_yield": 1.5, "max_milk_yield": 3.0, "daily_food_req": "12-17 kg/day", "food_items": "Western Odisha Dry Grass, Paddy/Jowar Straw, Oil Cake & Mineral Salt", "daily_expenditure": "\u20b975-115", "lifespan_years": "12-19", "description": "Khariar cattle are indigenous to the Khariar region of western Odisha. They are known for their hardiness, adaptability to dry conditions, and use in agricultural draught work with secondary milk production.", "coat_color_notes": "Generally grey or white", "horn_notes": "Medium-sized, curved outward and upward"},
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
    'Madhya Pradesh',
    'Odisha',
    'Andhra Pradesh'
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
                        Comprehensive search across 34 indigenous cattle and buffalo breeds by Milk Yield (Liters/day), Region, Purpose, & Type.
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

                            {breed.daily_food_req && (
                                <div className="breed-card-detail">
                                    <span className="label">🌾 Daily Fodder</span>
                                    <span className="value">{breed.daily_food_req}</span>
                                </div>
                            )}

                            {breed.food_items && (
                                <div className="breed-card-detail">
                                    <span className="label">🥗 Diet Items</span>
                                    <span className="value" title={breed.food_items} style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>{breed.food_items}</span>
                                </div>
                            )}

                            {breed.daily_expenditure && (
                                <div className="breed-card-detail">
                                    <span className="label">💰 Daily Cost</span>
                                    <span className="value">{breed.daily_expenditure}/day</span>
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
                            {selectedBreed.description && (
                                <p className="modal-description">{selectedBreed.description}</p>
                            )}

                            <div className="modal-stats-grid">
                                <div className="modal-stat-box">
                                    <span className="stat-icon">🥛</span>
                                    <span className="stat-label">Average Milk Yield</span>
                                    <span className="stat-value">{selectedBreed.avg_milk_liters_per_day ? `${selectedBreed.avg_milk_liters_per_day} Liters / day` : 'N/A'}</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">📍</span>
                                    <span className="stat-label">Native Region</span>
                                    <span className="stat-value">{selectedBreed.region || 'N/A'}</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">🚜</span>
                                    <span className="stat-label">Primary Purpose</span>
                                    <span className="stat-value">{selectedBreed.primary_use || 'N/A'}</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">⏳</span>
                                    <span className="stat-label">Average Lifespan</span>
                                    <span className="stat-value">{selectedBreed.lifespan_years ? `${selectedBreed.lifespan_years} Years` : 'N/A'}</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">🌾</span>
                                    <span className="stat-label">Daily Fodder Amount</span>
                                    <span className="stat-value">{selectedBreed.daily_food_req || 'N/A'}</span>
                                </div>
                                <div className="modal-stat-box">
                                    <span className="stat-icon">💰</span>
                                    <span className="stat-label">Daily Est. Cost</span>
                                    <span className="stat-value">{selectedBreed.daily_expenditure ? `${selectedBreed.daily_expenditure} / day` : 'N/A'}</span>
                                </div>
                            </div>

                            {(selectedBreed.food_items || selectedBreed.coat_color_notes || selectedBreed.horn_notes) && (
                                <div className="modal-details-extra" style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                                    {selectedBreed.food_items && (
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <strong style={{ color: 'var(--color-primary, #6366f1)' }}>🌾 Recommended Diet & Food Items: </strong>
                                            <span>{selectedBreed.food_items}</span>
                                        </div>
                                    )}
                                    {selectedBreed.coat_color_notes && (
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <strong style={{ color: 'var(--color-primary, #6366f1)' }}>🎨 Coat & Appearance: </strong>
                                            <span>{selectedBreed.coat_color_notes}</span>
                                        </div>
                                    )}
                                    {selectedBreed.horn_notes && (
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <strong style={{ color: 'var(--color-primary, #6366f1)' }}>🐂 Horns & Features: </strong>
                                            <span>{selectedBreed.horn_notes}</span>
                                        </div>
                                    )}
                                </div>
                            )}
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

