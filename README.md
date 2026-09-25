# AI E-Book Builder

A complete, production-style web application for creating AI-powered e-books. This application allows users to generate, edit, and export books with AI assistance.

## Features

- **User Authentication**: Secure email/password registration and login with Laravel Sanctum
- **Book Management**: Create, edit, delete, and duplicate books
- **AI Book Generation**: Generate complete book structures with chapters using AI
- **Chapter Management**: Add, edit, delete, and reorder chapters
- **AI Editing Tools**: Improve writing, rewrite, summarize, expand, simplify, fix grammar, generate examples, and continue writing
- **Book Preview**: Professional e-book preview with table of contents
- **PDF Export**: Export books as formatted PDF documents
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Real-time Updates**: Live editing with instant saves

## Architecture

The application follows a three-tier architecture:

```
User → React Frontend → Laravel API → Python FastAPI AI Service → AI/LLM
                                          ↓
                                        MySQL Database
```

### Technology Stack

#### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API requests
- Context API for state management

#### Backend
- PHP 8.2+
- Laravel 12
- Laravel Sanctum for authentication
- MySQL database
- RESTful API design

#### AI Service
- Python 3.9+
- FastAPI
- OpenAI API integration
- Async/await for performance

## Project Structure

```
ai-ebook-builder/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/        # API service layer
│   │   ├── contexts/       # React contexts
│   │   └── App.jsx         # Main app component
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Laravel application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # API controllers
│   │   │   └── Middleware/
│   │   └── Models/         # Eloquent models
│   ├── database/
│   │   └── migrations/     # Database migrations
│   ├── routes/
│   │   └── api.php         # API routes
│   ├── composer.json
│   └── .env.example
├── ai-service/              # Python FastAPI service
│   ├── main.py             # FastAPI application
│   ├── routes/
│   │   └── ai_routes.py    # AI endpoints
│   ├── services/
│   │   └── ai_service.py   # AI logic
│   ├── models/
│   │   └── schemas.py      # Pydantic models
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

## Requirements

### Frontend
- Node.js 18+ 
- npm or yarn

### Backend
- PHP 8.2 or higher
- Composer
- MySQL 5.7+ or MariaDB 10.3+

### AI Service
- Python 3.9 or higher
- pip

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ai-ebook-builder
```

### 2. Backend Setup (Laravel)

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
composer install
```

Copy environment file:

```bash
cp .env.example .env
```

Generate application key:

```bash
php artisan key:generate
```

Configure database in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ai_ebook_builder
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Run migrations:

```bash
php artisan migrate
```

Configure AI service URL in `.env`:

```env
AI_SERVICE_URL=http://localhost:8000
```

### 3. Frontend Setup (React)

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Copy environment file:

```bash
cp .env.example .env
```

Configure API URL in `.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

### 4. AI Service Setup (Python FastAPI)

Navigate to the AI service directory:

```bash
cd ../ai-service
```

Create virtual environment (recommended):

```bash
python -m venv venv
```

Activate virtual environment:

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Copy environment file:

```bash
cp .env.example .env
```

Configure OpenAI API in `.env`:

```env
AI_API_KEY=your_openai_api_key_here
MODEL_NAME=gpt-3.5-turbo
```

## Running the Application

You need to run all three services simultaneously.

### 1. Start Laravel Backend

From the backend directory:

```bash
cd backend
php artisan serve
```

The Laravel API will be available at `http://localhost:8000`

### 2. Start React Frontend

From the frontend directory (in a new terminal):

```bash
cd frontend
npm run dev
```

The React application will be available at `http://localhost:5173`

### 3. Start Python AI Service

From the AI service directory (in a new terminal):

```bash
cd ai-service
# Make sure virtual environment is activated
python main.py
```

The AI service will be available at `http://localhost:8000`

**Note:** The AI service runs on port 8000 by default. If you need to change this, update the `AI_SERVICE_URL` in the Laravel `.env` file.

## API Endpoints

### Authentication

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user

### Books

- `GET /api/books` - Get all books for current user
- `POST /api/books` - Create new book
- `GET /api/books/{id}` - Get specific book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book
- `POST /api/books/{id}/generate` - Generate book with AI
- `POST /api/books/{id}/duplicate` - Duplicate book

### Chapters

- `GET /api/books/{bookId}/chapters` - Get all chapters for a book
- `POST /api/books/{bookId}/chapters` - Create new chapter
- `GET /api/books/{bookId}/chapters/{id}` - Get specific chapter
- `PUT /api/books/{bookId}/chapters/{id}` - Update chapter
- `DELETE /api/books/{bookId}/chapters/{id}` - Delete chapter
- `POST /api/books/{bookId}/chapters/reorder` - Reorder chapters
- `POST /api/books/{bookId}/chapters/{id}/regenerate` - Regenerate chapter with AI

### AI Tools

- `POST /api/ai/improve` - Improve writing
- `POST /api/ai/rewrite` - Rewrite content
- `POST /api/ai/summarize` - Summarize content
- `POST /api/ai/expand` - Expand content
- `POST /api/ai/simplify` - Simplify content
- `POST /api/ai/fix-grammar` - Fix grammar
- `POST /api/ai/generate-examples` - Generate examples
- `POST /api/ai/continue-writing` - Continue writing

## Database Schema

### users
- `id` (primary key)
- `name`
- `email` (unique)
- `password` (hashed)
- `created_at`, `updated_at`

### books
- `id` (primary key)
- `user_id` (foreign key)
- `title`
- `topic`
- `description`
- `target_audience`
- `language`
- `writing_style`
- `status` (draft, generating, completed)
- `cover_image`
- `introduction`
- `conclusion`
- `number_of_chapters`
- `approximate_chapter_length`
- `additional_instructions`
- `created_at`, `updated_at`

### chapters
- `id` (primary key)
- `book_id` (foreign key)
- `chapter_number`
- `title`
- `content`
- `created_at`, `updated_at`

### sections
- `id` (primary key)
- `chapter_id` (foreign key)
- `title`
- `content`
- `order`
- `created_at`, `updated_at`

## Usage

### Creating a Book

1. Register or login to the application
2. Navigate to "Create Book" from the sidebar
3. Fill in the book details (title, topic, description, etc.)
4. Click "Create Draft" to create a manual draft
5. Or click "Generate with AI" to let AI generate the book structure

### Editing a Book

1. Go to "My Books" and select a book
2. Use the editor to modify book title, description, introduction, and conclusion
3. Add, edit, or delete chapters
4. Use AI tools to improve content by selecting text and choosing an AI action

### AI Editing Tools

Select any text in the editor and use the AI tools:
- **Improve Writing**: Enhance clarity and engagement
- **Rewrite**: Change writing style
- **Summarize**: Create concise summaries
- **Expand**: Add more details and examples
- **Simplify**: Make complex content easier to understand
- **Fix Grammar**: Correct grammar and spelling
- **Generate Examples**: Add practical examples
- **Continue Writing**: Seamlessly continue the text

### Exporting

1. Go to the book preview page
2. Click "Export PDF" to download a formatted PDF
3. The PDF includes cover, table of contents, and all chapters

## Security

- Passwords are hashed using Laravel's built-in hashing
- API authentication via Laravel Sanctum tokens
- CORS configuration for cross-origin requests
- Input validation on all endpoints
- SQL injection protection via Eloquent ORM
- XSS protection via React's escaping
- Users can only access their own books

## Troubleshooting

### Common Issues

**Laravel Migration Errors**
- Ensure MySQL is running
- Check database credentials in `.env`
- Run `php artisan migrate:fresh` to reset database

**Frontend API Errors**
- Verify Laravel backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is configured correctly

**AI Service Not Responding**
- Verify Python AI service is running
- Check `AI_SERVICE_URL` in Laravel `.env`
- Ensure OpenAI API key is valid
- Check Python dependencies are installed

**Port Conflicts**
- If port 8000 is in use, change the port in the respective service
- Update environment variables accordingly

**Permission Issues**
- Ensure storage directory is writable: `chmod -R 775 storage`
- Clear Laravel cache: `php artisan cache:clear`

## Development

### Running Tests

**Laravel Tests:**
```bash
cd backend
php artisan test
```

**React Tests:**
```bash
cd frontend
npm test
```

### Code Style

**Laravel:**
```bash
cd backend
./vendor/bin/pint
```

**React:**
```bash
cd frontend
npm run lint
```

## License

This project is for educational purposes. Please ensure you have proper licenses for any AI services used.

## Support

For issues and questions, please refer to the troubleshooting section or create an issue in the repository.

## Future Enhancements

- EPUB export functionality
- Real-time collaboration
- Version history for books
- More AI models support
- Book templates
- Export to other formats (DOCX, etc.)
- Advanced formatting options
- Image generation for book covers
- Multi-language support in UI
- User analytics and insights
