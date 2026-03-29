# Multi-Vendor Movie Rental Project - Server

## 📄 Overview
This repository contains the backend of the Multi-Vendor Movie Rental Project.  
The project is built using **Node.js, Express, MongoDB**, and **JWT authentication**.  
It supports role-based access for **admin, vendors, and users**, and includes all necessary APIs for managing movies, users, and orders.

---

## 1️⃣ Source Code Repository
- Full backend code is available in this repository.
- ES Modules are used.
- MongoDB is used as the database.
- Folder structure follows a modular approach:  


---

## 2️⃣ Setup Instructions
1. Clone the repository:
 ```bash
 git clone <your_repo_url>

 npm install


 PORT=5000
MONGO_URI=mongodb+srv://multiVendor:U25fnrR62mLMtNhj@cluster0.gzsiij5.mongodb.net/?appName=Cluster0
JWT_SECRET=sodkfpsjdf;lejpjkf;sg;kf;ljgoijsdl;kioepjfjdopgflkfj;lgjdfl;j;lkshdflkhasdlfkjhaslkdfnsfdfj;lkjdf;lkj;lkj;lkj;lkj;lkj;lkj;lkj;lkj;lkj;lkj;lkj;lk


npm run dev

users
{
  "_id": ObjectId,
  "name": "string",
  "email": "string",
  "password": "hashed string",
  "role": "user|vendor|admin",
  "createdAt": Date
}


vendors

{
  userId: 'id',
  name: "string",
  companyName: "string",
  contactInfo: "string",
    discription: "string",
    email: 'string'
}


movies
{
  "_id": ObjectId,
  "title": "string",
  "genre": "string",
  "price": number,
  "vendorId": ObjectId,
  "status": "published|draft",
  "createdAt": Date
}


orders
{
  "_id": ObjectId,
  "userId": ObjectId,
  "movies": [ObjectId],
  "totalPrice": number,
  "createdAt": Date
}


Prisma is not used; dbConnect function handles MongoDB collection access.


5️⃣ API Documentation
Postman collection: MultiVendor.postman_collection.json
Key endpoints:
Endpoint	Method	Role	Description

/api/auth/register	           POST	Public	Register a new user
/api/auth/login	               POST	Public	Login user and get JWT token
/api/auth/me	                GET	Authenticated	Get current logged-in user
/api/vendor/movies	            POST	Vendor	Add new movie
/api/vendor/movies	            GET	Vendor	Get vendor's own movies
/api/vendor//movies/:id          PATCH Vendor Can Update own movies
/api/vendor//movies/:id          DELETE Vendor Can Delete own movies
/api/movies	GET	Public        	 Browse movies (pagination, filtering, sorting, search)
/api/orders	POST	             User	Create new order
/api/orders/:id	                 GET	User Can See Details 
/api/admin/pendding-vendors 	GET Only Pendding Vendors Apply
/api/admin/vendors 	            GET All	Vendor
/api/admin/vendors              PSOT Admin Can Post Vendor
/api/admin/vendors/:id          PATCH Admin can update user
/api/admin/vendors/:id          DELETE admin can delte user



6️⃣ API Response Strategy
All responses follow a consistent format:
{
  "success": true,
  "message": "Descriptive message",
  "data": {}
}


Error handling uses proper HTTP status codes: 400, 401, 403, 500.
Role-based middleware ensures protected routes are accessed only by authorized users.
Pagination and filtering are applied for list endpoints.