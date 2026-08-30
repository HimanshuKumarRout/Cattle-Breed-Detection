"""
Breed metadata endpoints.
GET /breeds       - List all breeds
GET /breeds/{name} - Get breed details
"""

from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import FileResponse

from backend.app.schemas.breed import BreedDetail, BreedListItem, BreedsListResponse
from backend.app.services.breed_info import breed_info_service

PROJECT_ROOT = Path(__file__).resolve().parents[4]
INDEX_HTML = PROJECT_ROOT / "frontend" / "dist" / "index.html"

router = APIRouter(prefix="/breeds", tags=["Breeds"])


@router.get("", response_model=BreedsListResponse)
async def list_breeds(
    request: Request,
    animal_type: Optional[str] = Query(None, description="Filter by animal type (Cow/Buffalo)"),
    search: Optional[str] = Query(None, description="Search by breed name"),
    region: Optional[str] = Query(None, description="Filter by region/state"),
    primary_use: Optional[str] = Query(None, description="Filter by primary use"),
):
    """List all breeds with optional filtering. Serves SPA index.html if requested via browser navigation."""
    accept = request.headers.get("accept", "").lower()
    if "text/html" in accept and "application/json" not in accept and INDEX_HTML.exists():
        return FileResponse(str(INDEX_HTML))

    breeds = breed_info_service.get_all()

    if animal_type:
        breeds = [b for b in breeds if b['animal_type'].lower() == animal_type.lower()]

    if search:
        search_lower = search.lower()
        breeds = [b for b in breeds if search_lower in b['breed_name'].lower() or search_lower in b.get('description', '').lower()]

    if region:
        region_lower = region.lower()
        breeds = [b for b in breeds if region_lower in b['region'].lower()]

    if primary_use:
        use_lower = primary_use.lower()
        breeds = [b for b in breeds if use_lower in b['primary_use'].lower()]

    items = [BreedListItem(**b) for b in breeds]

    return BreedsListResponse(total=len(items), breeds=items)


@router.get("/{breed_name}", response_model=BreedDetail)
async def get_breed(breed_name: str, request: Request):
    """Get detailed info for a specific breed. Serves SPA index.html if requested via browser navigation."""
    accept = request.headers.get("accept", "").lower()
    if "text/html" in accept and "application/json" not in accept and INDEX_HTML.exists():
        return FileResponse(str(INDEX_HTML))

    info = breed_info_service.get_breed(breed_name)
    if info is None:
        # Try case-insensitive search
        results = breed_info_service.search(breed_name)
        if results:
            info = results[0]
        else:
            raise HTTPException(status_code=404, detail=f"Breed not found: {breed_name}")

    return BreedDetail(**info)
