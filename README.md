# Do You Remember? - Nostalgic Social Platform 🎮📼

A nostalgic time capsule social platform where users can reminisce and share vivid nostalgic memories about the 80s, 90s, and 2000s.

## ✨ Features

### Core Functionality
- **Memory Posts**: Each post begins with "Do you remember..." followed by nostalgic content
- **Nostalgic Photo Gallery**: Beautiful curated images for each memory
- **Infinite Scroll Feed**: Chronological display of memories with smooth loading
- **User Authentication**: JWT-based login/register system
- **Comments & Likes**: Full interaction system with nested comments
- **User Profiles**: Dedicated profile pages showing user's memories and liked posts

### Content Organization
- **Decade Filtering**: Filter memories by 80s, 90s, or 2000s
- **Category Tags**: Cartoons, Music, Toys, Movies, TV Shows, Fashion, Gadgets, Games, Places
- **Search Functionality**: Find memories by keywords
- **Random Memory**: Discover unexpected nostalgic moments

### Design & UX
- **Retro Aesthetic**: Nostalgic color schemes and animations
- **Mobile Responsive**: Optimized for all devices
- **Smooth Animations**: Card hover effects, loading states, and transitions
- **Modern UI**: Clean, readable interface with retro touches

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone and setup the project:**
```bash
cd time-capsule-social-platform
npm install
```

2. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```bash
MONGODB_URI=mongodb://localhost:27017/time-capsule-social
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

3. **Start MongoDB:**
Make sure MongoDB is running locally, or use a cloud service like MongoDB Atlas.

4. **Seed the database with dummy data:**
```bash
npm run seed
```
This creates 50 users and 20+ nostalgic posts with comments and likes.

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Demo Accounts

After seeding, you can use these demo accounts:

- **Email:** `demo@example.com` | **Password:** `demo123`
- **Email:** `nostalgia@example.com` | **Password:** `90skid`

## 🛠️ Tech Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **TailwindCSS**: Utility-first styling
- **Lucide React**: Modern icon library
- **date-fns**: Date formatting utilities

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Development
- **ESLint**: Code linting
- **tsx**: TypeScript execution for scripts

## 📱 Features in Detail

### Post Creation
- Pre-populated nostalgic images to choose from
- Decade selection (80s, 90s, 2000s)
- Category tagging system
- Character limits and validation

### Feed Experience
- Infinite scroll with loading states
- Real-time like/comment interactions
- Filtering by decade and category
- Search functionality across content and tags

### User Profiles
- Personal memory collections
- Liked posts view
- User statistics (posts, likes received, etc.)
- Join date and bio information

### Social Features
- Like/unlike posts
- Comment on memories
- Nested comment replies
- User avatars and usernames

## 🎨 Design Philosophy

The platform embraces nostalgia through:
- **Color Palette**: Purple and pink gradients reminiscent of 90s aesthetics
- **Typography**: Clean, modern fonts with retro touches
- **Animations**: Subtle hover effects and transitions
- **Layout**: Card-based design with proper spacing
- **Mobile-First**: Responsive design that works on all devices

## 🚧 Future Enhancements

- [ ] Real-time notifications
- [ ] Image upload functionality
- [ ] Memory sharing via social media
- [ ] Advanced search filters
- [ ] User following system
- [ ] Memory collections/albums
- [ ] Admin dashboard
- [ ] Content moderation tools

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Posts
- `GET /api/posts` - Get posts with pagination and filters
- `POST /api/posts` - Create new memory post
- `GET /api/posts/random` - Get random memory
- `POST /api/posts/[id]/like` - Like/unlike post
- `GET /api/posts/[id]/comments` - Get post comments
- `POST /api/posts/[id]/comments` - Add comment

### Users
- `GET /api/users/[username]` - Get user profile and posts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

*Built with ❤️ for the nostalgic souls who remember the good old days*