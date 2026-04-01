package models

import "gorm.io/gorm"

type Vehicle struct {
	gorm.Model
	Brand        string `json:"brand"`
	VehicleModel string `json:"model"`
	Year         int    `json:"year"`
	Mileage      int    `json:"mileage"`
	Color        string `json:"color"`
	FuelType     string `json:"fuel_type"`
	Transmission string `json:"transmission"`
	Condition    string `json:"condition"`
	ListingID    uint   `json:"listing_id"`
}
