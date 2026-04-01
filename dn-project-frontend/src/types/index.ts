export interface RegisterData {
    first_name: string;
    last_name: string;
    cpf: string;
    phone: string;
    email: string;
    password: string;
    confirm_password?: string;
    birth_date: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    cpf: string;
    phone: string;
    birth_date: string;
}

export interface ListingPhoto {
    ID: number;
    url: string;
    order: number;
    listing_id: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
}

export interface Vehicles {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    brand: string;
    model: string;
    year: number;
    mileage: number;
    color: string;
    fuel_type: string;
    transmission: string;
    condition: string;
    listing_id: number;
}

export interface User {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    first_name: string;
    last_name: string;
    email: string;
    cpf: string;
    phone: string;
    birth_date: string;
    listings: Listing[];
}

export interface Listing {
    ID: number;
    title: string;
    listing_type: string;
    description: string;
    price: number;
    active: string;
    user_id: number;
    views_count: number;
    listing_photos: ListingPhoto[];
    vehicles: Vehicles
    user: User;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
}


