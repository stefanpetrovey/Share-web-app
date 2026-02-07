# Social Media Web Application

A full-stack social media platform built with React, Node.js, Express, and MySQL. Users can create posts with images, like/unlike posts, view profiles, and interact with other users.

## 🚀 Features

- **User Authentication**: Secure login and registration system with JWT tokens
- **User Profiles**: Customizable profiles with profile pictures, bio, and join date
- **Create Posts**: Share text posts with optional image uploads
- **Like System**: Like and unlike posts with real-time updates
- **User Discovery**: Suggested users section to discover and view other profiles
- **Responsive Design**: Mobile-friendly interface that works on all devices
- **Profile Customization**: Edit profile information and change password

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home-page.png)
*Main feed showing all posts with like functionality and suggested users sidebar*

### Profile Page
![Profile Page](screenshots/profile-page.png)
*User profile displaying posts, liked posts, stats, and profile information*

### Post Detail Page
![Post Detail](screenshots/post-detail.png)
*Individual post view with comments section*

### Create Post
![Create Post](screenshots/create-post.png)
*Interface for creating new posts with text and image upload*

### Edit Profile
![Edit Profile](screenshots/edit-profile.png)
*Profile editing interface for updating user information and profile picture*

### Login Page
![Login](screenshots/login.png)
*User authentication login interface*

### Registration Page
![Registration](screenshots/registration.png)
*New user registration form*

### Docker Setup
![Docker](screenshots/docker-setup.png)
*Docker containers running the application and PostgreSQL database*

### API Testing (Postman)
![Postman API](screenshots/postman-api.png)
*API endpoints tested with Postman showing request/response examples*

## 🛠️ Tech Stack

### Frontend
- **React** - UI library for building interactive interfaces
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Material-UI Icons** - Icon components
- **CSS3** - Custom styling with responsive design

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **Sequelize** - ORM for database management
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── Home.js
│   │   │   ├── Profile.js
│   │   │   ├── Login.js
│   │   │   ├── Registration.js
│   │   │   ├── Post.js
│   │   │   └── ...
│   │   ├── helpers/       # Helper functions and context
│   │   └── utils/         # Utility functions
│   └── package.json
│
├── server/                # Backend Node.js application
│   ├── config/           # Database configuration
│   ├── middleware/       # Authentication middleware
│   ├── models/           # Sequelize models
│   ├── routes/           # API route handlers
│   │   ├── Posts.js
│   │   ├── Users.js
│   │   ├── Likes.js
│   │   └── Comments.js
│   ├── uploads/          # User uploaded files
│   └── package.json
│
├── docker-compose.yml    # Docker composition file
├── Dockerfile           # Docker configuration
└── README.md           # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- Docker & Docker Compose (optional)

### Installation

#### Docker Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/stefanpetrovey/Share-web-app.git
   cd Share-web-app
   ```

2. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - PostgreSQL: localhost:5433

## 📡 API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `GET /auth/validate` - Validate JWT token
- `GET /auth/basicinfo/:id` - Get user basic information

### Posts
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `GET /posts/byUserId/:id` - Get posts by user ID
- `POST /posts` - Create a new post (with image upload)
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post

### Likes
- `POST /likes` - Like/unlike a post
- `GET /likes/:postId` - Get likes for a post

### Comments
- `GET /comments/:postId` - Get comments for a post
- `POST /comments` - Create a comment
- `DELETE /comments/:id` - Delete a comment

### Users
- `GET /users` - Get all users
- `PUT /users/changepassword` - Change user password
- `PUT /users/editprofile` - Update user profile

## 🎨 Features in Detail

### User Authentication
- Secure registration with password hashing using bcrypt
- JWT-based authentication for protected routes
- Session persistence with localStorage
- Password change functionality

### Post Management
- Create posts with text content and optional images
- Image upload and storage system
- Delete own posts
- Real-time like count updates

### Profile System
- View user profiles with stats
- Display user bio
- Profile picture support
- Edit profile information
- View user's posts and liked posts

### Social Features
- Like/unlike posts with visual feedback
- Suggested users sidebar for discovery
- View all users modal
- User profile navigation
- Search bar

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation
- SQL injection prevention with Sequelize ORM

## 🎯 Future Enhancements

- [ ] Real-time notifications
- [ ] Direct messaging between users
- [ ] Follow/unfollow system
- [ ] Post sharing functionality
- [ ] Advanced search and filtering
- [ ] Hashtag system
- [ ] Infinite scroll pagination
- [ ] User blocking/reporting

## 👤 Author
Stefan Petrov

## 🙏 Acknowledgments

- Material-UI for icons
- React community for excellent documentation
- Express.js team for the robust framework
- PostgreSQL and Sequelize teams
