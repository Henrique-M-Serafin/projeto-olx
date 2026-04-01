package controllers

import (
	"context"
	"net/http"
	"strconv"

	"github.com/Henrique-M-Serafin/dn-project/database"
	"github.com/Henrique-M-Serafin/dn-project/models"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/gin-gonic/gin"
)

func GetListings(c *gin.Context) {
	var listings []models.Listing
	result := database.DB.Preload("Photos").Preload("User").Preload("Vehicle").Find(&listings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(200, listings)
}

func CreateListing(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	title := c.PostForm("title")
	listingType := c.PostForm("listing_type")
	price := c.PostForm("price")
	description := c.PostForm("description")

	priceFloat, _ := strconv.ParseFloat(price, 64)

	listing := models.Listing{
		Title:       title,
		ListingType: listingType,
		Price:       priceFloat,
		Description: description,
		Status:      "ACTIVE",
		UserID:      userID.(uint),
	}
	database.DB.Create(&listing)

	// ✅ Criar o Vehicle associado ao listing
	year, _ := strconv.Atoi(c.PostForm("year"))
	mileage, _ := strconv.Atoi(c.PostForm("mileage"))

	vehicle := models.Vehicle{
		Brand:        c.PostForm("brand"),
		VehicleModel: c.PostForm("model"),
		Year:         year,
		Mileage:      mileage,
		Color:        c.PostForm("color"),
		FuelType:     c.PostForm("fuel_type"),
		Transmission: c.PostForm("transmission"),
		Condition:    c.PostForm("condition"),
		ListingID:    listing.ID,
	}
	database.DB.Create(&vehicle)

	form, _ := c.MultipartForm()
	files := form.File["photos"]
	for i, file := range files {
		src, err := file.Open()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao abrir foto"})
			return
		}
		defer src.Close()

		uploadResult, err := database.Cloudinary.Upload.Upload(
			context.Background(),
			src,
			uploader.UploadParams{
				Folder: "dn-project/listings",
			},
		)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao fazer upload"})
			return
		}

		photo := models.ListingPhoto{
			URL:       uploadResult.SecureURL,
			Order:     uint(i),
			ListingID: listing.ID,
		}
		database.DB.Create(&photo)
	}

	database.DB.Preload("Photos").Preload("Vehicle").First(&listing, listing.ID)
	c.JSON(http.StatusCreated, listing)
}

func GetListingById(c *gin.Context) {
	id := c.Param("id")
	var listing models.Listing
	result := database.DB.Preload("Photos").Preload("User").Preload("Vehicle").First(&listing, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Anúncio não encontrado"})
		return
	}
	c.JSON(http.StatusOK, listing)
}

func GetListingsByUser(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}
	var listings []models.Listing
	result := database.DB.Preload("Photos").Preload("User").Preload("Vehicle").Where("user_id = ?", userID).Find(&listings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, listings)
}

func GetListingByType(c *gin.Context) {
	listingType := c.Param("type")
	var listings []models.Listing
	result := database.DB.Preload("Photos").Preload("User").Preload("Vehicle").Where("listing_type = ?", listingType).Find(&listings)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	c.JSON(http.StatusOK, listings)
}

func SearchListings(c *gin.Context) {
	term := c.Query("q")
	if term == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Termo de busca não informado"})
		return
	}

	search := "%" + term + "%"

	var listings []models.Listing
	result := database.DB.
		Preload("Photos").
		Preload("User").
		Preload("Vehicle").
		Joins("LEFT JOIN vehicles ON vehicles.listing_id = listings.id").
		Where(
			"listings.title ILIKE ? OR listings.description ILIKE ? OR "+
				"vehicles.brand ILIKE ? OR vehicles.vehicle_model ILIKE ? OR "+
				"vehicles.color ILIKE ? OR CAST(vehicles.year AS TEXT) ILIKE ?",
			search, search, search, search, search, search,
		).
		Find(&listings)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, listings)
}

func DeleteListing(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}
	id := c.Param("id")
	var listing models.Listing
	result := database.DB.First(&listing, id)
	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Anúncio não encontrado"})
		return
	}
	if listing.UserID != userID.(uint) {
		c.JSON(http.StatusForbidden, gin.H{"error": "Acesso negado"})
		return
	}
	database.DB.Delete(&listing)
	c.JSON(http.StatusOK, gin.H{"message": "Anúncio deletado com sucesso"})
}
