package models

import (
	"gorm.io/gorm"
)

type Listing struct {
	gorm.Model
	Title       string         `json:"title"`
	ListingType string         `json:"listing_type"`
	Price       float64        `json:"price"`
	Description string         `json:"description"`
	Status      string         `json:"status"`
	UserID      uint           `json:"user_id"`
	ViewsCount  uint           `json:"views_count"`
	Photos      []ListingPhoto `json:"listing_photos" gorm:"foreignKey:ListingID"`
	Vehicle     Vehicle        `json:"vehicles" gorm:"foreignKey:ListingID"`
	User        Users          `json:"user" gorm:"foreignKey:UserID"`
}

type ListingPhoto struct {
	gorm.Model
	URL       string `json:"url"`
	Order     uint   `json:"order"`
	ListingID uint   `json:"listing_id"`
}
