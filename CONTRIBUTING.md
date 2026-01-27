# Contributing to Gym Fight

Thank you for your interest in contributing to Gym Fight! This guide will help you set up your development environment and understand the project structure.

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- A code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gymfight
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create `backend/.env`:
   ```env
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/gymfight
   JWT_SECRET=development-secret-key
   ```

4. **Start MongoDB**
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Or use Docker
   docker run -d -p 27017:27017 --name gymfight-mongo mongo:7.0
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

## Project Structure

### Backend (`/backend`)

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── characterController.js
│   │   ├── combatController.js
│   │   ├── dietLogController.js
│   │   ├── exerciseController.js
│   │   ├── foodController.js
│   │   └── userController.js
│   │
│   ├── models/            # Mongoose schemas
│   │   ├── Character.js
│   │   ├── DietLog.js
│   │   ├── Exercise.js
│   │   ├── Food.js
│   │   ├── User.js
│   │   └── WorkoutLog.js
│   │
│   ├── routes/            # Express routes
│   │   ├── characterRoutes.js
│   │   ├── combatRoutes.js
│   │   ├── dietLogRoutes.js
│   │   ├── exerciseRoutes.js
│   │   ├── foodRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── middleware/        # Custom middleware
│   │   └── authMiddleware.js
│   │
│   ├── services/          # Business logic
│   │   ├── combatService.js
│   │   └── progressionService.js
│   │
│   └── database/          # DB utilities
│       ├── connection.js
│       └── seeders/
│
└── server.js             # Entry point
```

### Frontend (`/frontend`)

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── CustomExerciseForm.js
│   │   ├── CustomFoodForm.js
│   │   ├── DailySummary.js
│   │   ├── DietLog.js
│   │   ├── Navbar.js
│   │   ├── PrivateRoute.js
│   │   ├── ProgressGraphs.js
│   │   └── WorkoutLog.js
│   │
│   ├── pages/            # Page components
│   │   ├── CharacterCreationPage.js
│   │   ├── CombatPage.js
│   │   ├── DashboardPage.js
│   │   ├── FitnessTrackerPage.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   └── RPGPage.js
│   │
│   ├── api/              # API client
│   │   ├── api.js
│   │   ├── authApi.js
│   │   └── fitnessApi.js
│   │
│   ├── App.js            # Root component
│   ├── authContext.js    # Auth state management
│   └── index.js          # Entry point
│
└── public/
    └── index.html
```

## Coding Standards

### JavaScript Style
- Use ES6+ syntax
- Use `const` by default, `let` when necessary
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring where appropriate

### React Best Practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and prop names
- Extract reusable logic into custom hooks
- Handle loading and error states

### Backend Best Practices
- Use async/await for asynchronous operations
- Implement proper error handling
- Validate input data
- Use middleware for cross-cutting concerns
- Keep controllers thin, business logic in services

### Naming Conventions
- Components: PascalCase (`LoginPage.js`)
- Functions: camelCase (`getUserData()`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- Files: match component name or descriptive camelCase

## API Development

### Adding a New Endpoint

1. **Create/Update Model** (`backend/src/models/`)
   ```javascript
   const mongoose = require('mongoose');

   const MyModelSchema = new mongoose.Schema({
     field: { type: String, required: true },
     createdAt: { type: Date, default: Date.now }
   });

   module.exports = mongoose.model('MyModel', MyModelSchema);
   ```

2. **Create Controller** (`backend/src/controllers/`)
   ```javascript
   const MyModel = require('../models/MyModel');

   exports.getItems = async (req, res) => {
     try {
       const items = await MyModel.find();
       res.json(items);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   ```

3. **Create Routes** (`backend/src/routes/`)
   ```javascript
   const express = require('express');
   const router = express.Router();
   const controller = require('../controllers/myController');
   const auth = require('../middleware/authMiddleware');

   router.get('/', auth, controller.getItems);
   
   module.exports = router;
   ```

4. **Register Routes** (`backend/server.js`)
   ```javascript
   const myRoutes = require('./src/routes/myRoutes');
   app.use('/api/myroute', myRoutes);
   ```

### Adding Frontend API Calls

1. **Create API Function** (`frontend/src/api/`)
   ```javascript
   import api from './api';

   export const getMyData = async (token) => {
     const response = await api.get('/myroute', {
       headers: { Authorization: `Bearer ${token}` }
     });
     return response.data;
   };
   ```

2. **Use in Component**
   ```javascript
   import { getMyData } from '../api/myApi';

   const MyComponent = () => {
     const [data, setData] = useState(null);
     const { token } = useAuth();

     useEffect(() => {
       const fetchData = async () => {
         try {
           const result = await getMyData(token);
           setData(result);
         } catch (error) {
           console.error('Error:', error);
         }
       };
       fetchData();
     }, [token]);

     return <div>{/* Render data */}</div>;
   };
   ```

## Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## Database

### MongoDB Collections

- **users**: User accounts and authentication
- **characters**: RPG character data
- **workoutlogs**: Exercise tracking logs
- **dietlogs**: Food intake logs
- **exercises**: Exercise database (hardcoded + custom)
- **foods**: Food database (hardcoded + custom)

### Running Seeders

Populate the database with sample data:

```bash
cd backend
npm run seed
```

## Common Development Tasks

### Adding a New Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.js`
3. Add navigation link in `frontend/src/components/Navbar.js`

### Adding Authentication to a Route

```javascript
// Backend
const auth = require('../middleware/authMiddleware');
router.get('/protected', auth, controller.method);

// Frontend
<Route path="/page" element={<PrivateRoute element={<Page />} />} />
```

### Debugging Tips

1. **Backend Debugging**
   - Check console output for errors
   - Use `console.log()` or a debugger
   - Check MongoDB data with MongoDB Compass

2. **Frontend Debugging**
   - Use React DevTools browser extension
   - Check browser console for errors
   - Use Network tab to inspect API calls
   - Check Application tab for localStorage

3. **Database Debugging**
   ```bash
   # Connect to MongoDB
   mongosh
   use gymfight
   db.users.find()
   ```

## Git Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. Make your changes and commit
   ```bash
   git add .
   git commit -m "Add: description of changes"
   ```

3. Push to remote
   ```bash
   git push origin feature/my-new-feature
   ```

4. Create a pull request

### Commit Message Format
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Changes to existing feature
- `Refactor:` Code restructuring
- `Docs:` Documentation changes
- `Style:` Formatting changes
- `Test:` Adding tests

## Performance Optimization

### Backend
- Use indexes on frequently queried fields
- Implement pagination for large datasets
- Use lean() for read-only queries
- Cache frequently accessed data

### Frontend
- Use React.memo for expensive components
- Implement lazy loading for routes
- Optimize images
- Use production builds for deployment

## Security Considerations

- Never commit `.env` files
- Validate and sanitize all user input
- Use parameterized queries
- Implement rate limiting
- Keep dependencies updated
- Use HTTPS in production
- Implement CSRF protection

## Getting Help

- Check existing documentation
- Review similar code in the project
- Ask questions in issues/discussions
- Consult the README and DEPLOYMENT guides

## Resources

- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Node.js Documentation](https://nodejs.org/docs/)

---

Happy coding! 🎉
