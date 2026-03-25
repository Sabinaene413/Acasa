export interface Property {
  id?: number;
  title: string;
  description: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  surfaceArea: number;
  images: PropertyImage[];
}

export interface PropertyImage {
  id: number;
  url: string;
}

export interface PropertyFilter {
  cityId?: number;
  countyId?: number;
  minPrice?: number;
  maxPrice?: number;
  minSurfaceArea?: number;
  maxSurfaceArea?: number;
  bedrooms?: number;
  bathrooms?: number;
}