import { RegisterData } from "@/types";
import api from "../api/api";

export const getListings = async () => {
    try {
        const response = await api.get('/listings');
        return response.data;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
} 

export const createListing = async (formData: FormData) => {
    try {
        const response = await api.post('/listings', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating listing:', error);
        throw error;
    }
}

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

export const register = async (data: RegisterData) => {
    try {
        console.log("Dados enviados:", data)
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

export const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
}   

export const getMe = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export const getListingByUser = async () => {
    try {
        const response = await api.get(`/listings/user`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user listings:', error);
        throw error;
    }
}

export const getListingByType = async (type: string) => {
    try {
        const response = await api.get(`/listings/type/${type}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching listings by type:', error);
        throw error;
    }
}

export const searchListings = async (term: string) => {
    const response = await api.get(`/listings/search?q=${encodeURIComponent(term)}`);
    return response.data;
}

export const deleteListing = async (listingId: number) => {
    try {
        await api.delete(`/listings/${listingId}`);
    } catch (error) {
        console.error('Error deleting listing:', error);
        throw error;
    }
}

export const getListingById = async (listingId: number) => {
    try {
        const response = await api.get(`/listings/${listingId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching listing by ID:', error);
        throw error;
    }  
}