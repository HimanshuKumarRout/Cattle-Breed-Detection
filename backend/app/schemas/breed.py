"""
Pydantic schemas for breed metadata endpoints.
"""

from typing import Optional
from pydantic import BaseModel


class BreedDetail(BaseModel):
    """Full breed detail."""
    breed_id: int
    breed_name: str
    animal_type: str
    region: str
    avg_milk_liters_per_day: str
    lifespan_years: str
    primary_use: str
    daily_food_req: Optional[str] = None
    food_items: Optional[str] = None
    daily_expenditure: Optional[str] = None
    coat_color_notes: str
    horn_notes: str
    description: str
    source_reference: str


class BreedListItem(BaseModel):
    """Breed item for list endpoints."""
    breed_id: int
    breed_name: str
    animal_type: str
    region: str
    avg_milk_liters_per_day: Optional[str] = None
    lifespan_years: Optional[str] = None
    primary_use: str
    daily_food_req: Optional[str] = None
    food_items: Optional[str] = None
    daily_expenditure: Optional[str] = None
    coat_color_notes: Optional[str] = None
    horn_notes: Optional[str] = None
    description: Optional[str] = None
    source_reference: Optional[str] = None


class BreedsListResponse(BaseModel):
    """Response for listing all breeds."""
    total: int
    breeds: list[BreedListItem]
