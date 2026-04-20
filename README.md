# Acasa - Real Estate Platform

**Acasa** is a modern, full-stack real estate platform designed to help users find and manage properties with ease. It features a robust backend built with .NET 10 and a dynamic frontend powered by Angular 20.

## 🚀 Features

- **User Authentication**: Secure registration and login using ASP.NET Core Identity and JWT tokens.
- **Property Management**: Complete CRUD operations for property listings, including title, description, price, and location.
- **Advanced Filtering**: Search for properties based on specific criteria like price range, type, and location.
- **Image Handling**: Seamless image uploading and management integrated with [Cloudinary](https://cloudinary.com/).
- **Location Services**: Geocoding integration to provide accurate coordinates for properties, along with organized city and county data.
- **Saved Searches**: Users can save their favorite search parameters for quick access to new listings.
- **Interactive UI**: A responsive and intuitive user interface built with Angular.

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 10
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: JWT Bearer Authentication & Identity
- **Image Storage**: CloudinaryDotNet
- **API Documentation**: Scalar & OpenAPI

### Frontend
- **Framework**: Angular 20
- **Styling**: SCSS
- **Architecture**: Core / Shared / Feature-based architecture

## 🏁 Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [Node.js & npm](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- A Cloudinary account for image management.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/Acasa.git
   cd Acasa
   ```

2. **Backend Setup**:
   - Navigate to the API folder:
     ```bash
     cd Acasa.Api
     ```
   - Configure your connection string and Cloudinary credentials in `appsettings.json` (or use User Secrets).
   - Update the database:
     ```bash
     dotnet ef database update
     ```
   - Run the API:
     ```bash
     dotnet run
     ```

3. **Frontend Setup**:
   - Navigate to the Client folder:
     ```bash
     cd ../Acasa.Client
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Run the development server:
     ```bash
     ng serve
     ```
   - Open your browser at `http://localhost:4200`.

## 📖 API Documentation
Once the API is running, you can access the interactive Scalar documentation at:
- `http://localhost:<port>/scalar/v1` (check your console for the exact port)


