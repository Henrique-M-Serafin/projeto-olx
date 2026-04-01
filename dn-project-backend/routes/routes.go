package routes

import (
	"github.com/Henrique-M-Serafin/dn-project/controllers"
	"github.com/Henrique-M-Serafin/dn-project/middlewares"
	"github.com/gin-gonic/gin"
)

func SetupRoutes() {
	r := gin.Default()
	r.Use(middlewares.CorsMiddleware())

	// Rotas públicas
	r.GET("/listings", controllers.GetListings)
	r.GET("/listings/type/:type", controllers.GetListingByType)
	r.GET("/listings/search", controllers.SearchListings)
	r.GET("/listings/:id", controllers.GetListingById)

	// Rotas protegidas
	auth := r.Group("/")
	auth.Use(middlewares.AuthMiddleware())
	{
		auth.POST("/listings", controllers.CreateListing)
		auth.GET("/listings/user", controllers.GetListingsByUser) // ✅ sem :user_id, pega do cookie
		auth.DELETE("/listings/:id", controllers.DeleteListing)   // ✅ nova rota para deletar listing
	}

	// Auth
	r.POST("/auth/register", controllers.Register)
	r.POST("/auth/login", controllers.Login)
	r.GET("/auth/me", middlewares.AuthMiddleware(), controllers.Me)
	r.POST("/auth/logout", controllers.Logout)

	r.Run(":8080")
}
