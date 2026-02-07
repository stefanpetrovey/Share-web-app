# Social Media Web Application

A full-stack social media platform built with React, Node.js, Express, and PostgreSQL. Users can create posts with images, like/unlike posts, view profiles, and interact with other users.

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
<img width="1470" height="956" alt="HomePage" src="https://github.com/user-attachments/assets/ca27c0fa-6046-471b-98a6-9bcb4a422813" />
*Main feed showing all posts with like functionality and suggested users sidebar*

### Profile Page
<img width="1470" height="956" alt="ProfilePagePosts" src="https://github.com/user-attachments/assets/a47d8d8f-4f6f-4bca-9b54-8e32c666f72e" />
<img width="1470" height="956" alt="ProfilePageLiked" src="https://github.com/user-attachments/assets/3852c5f0-288c-4789-b448-494f2ebb3dcb" />
<img width="1470" height="956" alt="SearchBar" src="https://github.com/user-attachments/assets/2cc71e5e-0ffc-46ed-ac64-6ce7f3d0dbde" />
*User profile displaying posts, liked posts, stats, search bar and profile information*

### Post Page
<img width="1470" height="956" alt="PostPage" src="https://github.com/user-attachments/assets/4340d349-bec2-4c15-a521-48f22f87b182" />
<img width="1470" height="956" alt="OwnedPostPage" src="https://github.com/user-attachments/assets/192e413f-27ef-42d0-8909-9f70d15ce632" />
*Individual post view with comments section*

### Create Post
<img width="1470" height="956" alt="CreatePostPage" src="https://github.com/user-attachments/assets/933b2563-1fac-4c26-8b67-2f7c27e67a45" />
*Interface for creating new posts with text and image upload*

### Change Password
<img width="1470" height="956" alt="ChangePasswordPage" src="https://github.com/user-attachments/assets/e0b82525-7316-4727-ab35-920ab3c0ee7b" />
*Interface for creating new posts with text and image upload*

### Edit Profile
<img width="1470" height="956" alt="EditProfilePage" src="https://github.com/user-attachments/assets/d2959d72-d2c0-4337-8649-95dde01356c4" />
*Profile editing interface for updating user information and profile picture*

### Login Page
<img width="1470" height="956" alt="LoginPage" src="https://github.com/user-attachments/assets/b2131437-8e94-437b-a281-10f7ffc421da" />
*User authentication login interface*

### Registration Page
<img width="1470" height="956" alt="Registration1" src="https://github.com/user-attachments/assets/bd2b511d-4079-490f-8ea2-e0364021c96c" />
<img width="1470" height="956" alt="Registration2" src="https://github.com/user-attachments/assets/05fe73b3-e189-4ee9-913c-658cb0ef706f" />
*New user registration form*

### AboutUs Page
<img width="1470" height="956" alt="AboutUsPage" src="https://github.com/user-attachments/assets/5b550034-aac7-4f38-97b2-615e75aa0a3e" />
*User authentication login interface*

### Docker Setup
<img width="1470" height="956" alt="DockerDesktop" src="https://github.com/user-attachments/assets/7761e48b-314d-4344-8234-a0fdb5df904c" />
*Docker containers running the application and PostgreSQL database*

### API Testing (Postman)
<img width="1470" height="956" alt="PostmanTesting" src="https://github.com/user-attachments/assets/b67fcdb1-f2d1-4528-a52b-e9866bea3749" />
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
