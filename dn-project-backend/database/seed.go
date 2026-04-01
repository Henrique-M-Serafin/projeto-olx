package database

import (
	"github.com/Henrique-M-Serafin/dn-project/models"
	"github.com/bxcodec/faker/v4"
)

func SeedDatabase() {
	for range 10 {
		user := models.Users{
			FirstName: faker.FirstName(),
			LastName:  faker.LastName(),
			Email:     faker.Email(),
			Password:  "123456",
			CPF:       faker.CCNumber(),
			Phone:     faker.Phonenumber(),
		}
		DB.Create(&user)

		listing := models.Listing{
			Title:       faker.Word(),
			ListingType: "CAR",
			Price:       float64(faker.RandomUnixTime()),
			Description: faker.Sentence(),
			Status:      "ACTIVE",
			UserID:      user.ID,
		}
		DB.Create(&listing)
	}
}
