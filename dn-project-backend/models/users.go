package models

import (
	"time"

	"gorm.io/gorm"
)

type Users struct {
	gorm.Model
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email" gorm:"unique"`
	Password  string    `json:"-"`
	CPF       string    `json:"cpf" gorm:"unique"`
	Phone     string    `json:"phone"`
	BirthDate time.Time `json:"birth_date"`
	Listings  []Listing `json:"listings" gorm:"foreignKey:UserID"`
}
