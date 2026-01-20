# Football Shirt Collection

A modern web application for football enthusiasts to track, organize, and showcase their football shirt collections. Built with React and Node.js.

![Football Shirt Collection Banner](client/public/app-screenshot.png)

## Features

### Collection Management
- **Add & Edit Shirts** - Comprehensive form with all shirt details (team, season, player, size, condition, etc.)
- **Multi-Image Upload** - Upload multiple photos per shirt with drag-and-drop reordering
- **Advanced Filtering** - Filter by team, brand, season, type, condition, color, and more
- **Grid & Table Views** - Switch between visual grid and detailed table layouts
- **Favorites** - Mark your favorite shirts for quick access
- **Search** - Full-text search across teams, players, and competitions

### Statistics & Analytics
- **Collection Overview** - Total shirts, investment value, current value, and favorites count
- **Visual Charts** - Pie charts and bar graphs for types, brands, seasons, and conditions
- **Most Valuable** - Track your most valuable shirts
- **Team Distribution** - See which teams dominate your collection

### Wishlist
- **Track Desired Shirts** - Add shirts you want to acquire
- **Priority Levels** - Set low, medium, or high priority
- **Budget Planning** - Set max budget for each wishlist item
- **Quick Add to Collection** - Convert wishlist items to collection entries

### User Experience
- **Dark Mode** - Full dark mode support
- **Multi-Language** - English and Turkish language support
- **Multi-Currency** - USD, EUR, GBP, and TRY support
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Keyboard Shortcuts** - Power user shortcuts (⌘K for command palette)
- **Onboarding** - Interactive tutorial for new users

### Authentication
- **Email/Password** - Traditional authentication
- **Google OAuth** - One-click Google sign-in
- **Secure Sessions** - JWT-based authentication

## Screenshots

### Landing Page
![Landing Page](docs/screenshots/landing-page.png)
*Modern landing page with feature highlights*

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Overview of your collection with statistics*

### Collection Grid View
![Collection Grid](docs/screenshots/collection-grid.png)
*Visual grid layout for browsing shirts*

### Collection Table View
![Collection Table](docs/screenshots/collection-table.png)
*Detailed table view with sorting and filtering*

### Shirt Details
![Shirt Details](docs/screenshots/shirt-detail.png)
*Comprehensive shirt detail page with image gallery*

### Add/Edit Shirt
![Add Shirt](docs/screenshots/add-shirt.png)
*Form for adding new shirts with image upload*

### Statistics
![Statistics](docs/screenshots/statistics.png)
*Visual analytics and charts*

### Wishlist
![Wishlist](docs/screenshots/wishlist.png)
*Track shirts you want to add*

### Dark Mode
![Dark Mode](docs/screenshots/dark-mode.png)
*Full dark mode support*

### Mobile View
![Mobile](docs/screenshots/mobile.png)
*Responsive mobile layout*

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **React Router v6** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form handling with Zod validation
- **Framer Motion** - Animations
- **Recharts** - Charts and graphs
- **i18next** - Internationalization
- **Lucide Icons** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Cloudinary** - Image storage and optimization
- **bcrypt** - Password hashing

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Google OAuth credentials (optional, for Google sign-in)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/football-shirt-collection.git
   cd football-shirt-collection
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**

   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/football-shirts
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   GOOGLE_CLIENT_ID=your-google-client-id
   ```

   Create `client/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

5. **Start the development servers**

   Start the backend:
   ```bash
   cd server
   npm run dev
   ```

   Start the frontend (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

6. **Open your browser**

   Visit `http://localhost:5173` to see the application.

## Project Structure

```
football-shirt-collection/
├── client/                    # React frontend
│   ├── public/               # Static assets
│   │   ├── manifest.json     # PWA manifest
│   │   ├── robots.txt        # SEO robots file
│   │   └── sitemap.xml       # SEO sitemap
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/         # Authentication components
│   │   │   ├── common/       # Shared components
│   │   │   ├── dashboard/    # Dashboard components
│   │   │   ├── form/         # Form components
│   │   │   ├── landing/      # Landing page sections
│   │   │   ├── layout/       # Layout components
│   │   │   ├── onboarding/   # Onboarding components
│   │   │   ├── shirt/        # Shirt-related components
│   │   │   ├── skeletons/    # Loading skeletons
│   │   │   ├── ui/           # UI primitives (shadcn)
│   │   │   └── wishlist/     # Wishlist components
│   │   ├── context/          # React contexts
│   │   ├── hooks/            # Custom hooks
│   │   ├── i18n/             # Translations
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── lib/              # Utilities
│   ├── index.html            # HTML template
│   ├── tailwind.config.js    # Tailwind configuration
│   └── vite.config.js        # Vite configuration
│
├── server/                    # Express backend
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Express middleware
│   │   ├── models/           # Mongoose models
│   │   ├── routes/           # API routes
│   │   └── server.js         # Entry point
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/google` | Google OAuth login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/username` | Set username |

### Shirts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shirts` | Get all shirts (with filters) |
| GET | `/api/shirts/:id` | Get single shirt |
| POST | `/api/shirts` | Create new shirt |
| PUT | `/api/shirts/:id` | Update shirt |
| DELETE | `/api/shirts/:id` | Delete shirt |
| GET | `/api/shirts/filter-options` | Get filter options |

### Statistics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats/overview` | Collection overview |
| GET | `/api/stats/by-type` | Stats by shirt type |
| GET | `/api/stats/by-brand` | Stats by brand |
| GET | `/api/stats/by-season` | Stats by season |
| GET | `/api/stats/by-condition` | Stats by condition |
| GET | `/api/stats/recent` | Recent additions |
| GET | `/api/stats/most-valuable` | Most valuable shirts |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/wishlist` | Get wishlist items |
| POST | `/api/wishlist` | Add to wishlist |
| PUT | `/api/wishlist/:id` | Update wishlist item |
| DELETE | `/api/wishlist/:id` | Remove from wishlist |

## Environment Variables

### Server
| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | No |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret for JWT signing | Yes |
| `JWT_EXPIRES_IN` | JWT expiration time | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |

### Client
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API URL | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | No |

## Performance

The application is optimized for performance:

- **Code Splitting** - Route-based lazy loading
- **Image Optimization** - Cloudinary transformations
- **Compression** - Gzip and Brotli compression
- **Caching** - React Query with staleTime
- **Skeletons** - Route-specific loading skeletons
- **Tree Shaking** - Optimized bundle sizes

### Lighthouse Scores
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide](https://lucide.dev/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Cloudinary](https://cloudinary.com/) - Image management

---

Made with ❤️ by football shirt collectors, for football shirt collectors.
