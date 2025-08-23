# 🧠 QuizCraft AI - Intelligent Quiz Generator

![QuizCraft AI](https://img.shields.io/badge/QuizCraft-AI%20Powered-blue?style=for-the-badge&logo=brain)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

Transform your study materials into engaging, personalized quiz questions using the power of AI. QuizCraft AI automatically extracts content from PDFs and generates contextual questions tailored to your learning needs.

## ✨ Features

### 🎯 Core Functionality
- **PDF Upload & Processing** - Upload PDFs and automatically extract text content
- **AI-Powered Quiz Generation** - Generate contextual questions using OpenRouter AI with DeepSeek model
- **Multiple Question Types** - Support for Multiple Choice Questions (MCQ) and True/False questions
- **Difficulty Levels** - Choose from Easy, Medium, or Hard difficulty levels
- **Customizable Quiz Settings** - Configure question counts and types
- **Real-time Preview** - Instant preview of generated questions with answers highlighted
- **Export Options** - Download quizzes in JSON format for easy sharing and integration

### 🔐 User Management
- **User Authentication** - Secure login/signup system with JWT tokens
- **User Profiles** - Support for educational institutions
- **Admin Panel** - Administrative dashboard for user and system management
- **Session Management** - Automatic session handling with token refresh

### 🎨 User Experience
- **Modern UI** - Clean, responsive design with gradient backgrounds and animations
- **Drag & Drop** - Intuitive file upload with drag-and-drop support
- **Progress Tracking** - Real-time upload and processing progress indicators
- **Error Handling** - Comprehensive error messages with auto-dismiss
- **Success Feedback** - Clear success messages and animations
- **Mobile Responsive** - Optimized for all device sizes

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icon library
- **TanStack Query** - Data fetching and caching

### Backend Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Multer** - File upload handling
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### AI & External Services
- **OpenRouter API** - AI model access platform
- **DeepSeek Model** - Advanced language model for quiz generation
- **PDF-Parse** - PDF text extraction library

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- OpenRouter API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/quizcraft-ai.git
   cd quizcraft-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # OpenRouter API Configuration
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   
   # Optional: Development settings
   NODE_ENV=development
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the application**
   Open [http://localhost:8080](http://localhost:8080) in your browser

## 🔧 Configuration

### OpenRouter API Setup

1. **Create an OpenRouter Account**
   - Visit [OpenRouter.ai](https://openrouter.ai/)
   - Sign up for a new account
   - Navigate to the API Keys section

2. **Generate API Key**
   - Create a new API key
   - Copy the key (starts with `sk-or-v1-...`)

3. **Configure the Application**
   - Add your API key to the `.env` file
   - Restart the development server

### Supported AI Models
- **DeepSeek R1** - Primary model for quiz generation
- **Fallback System** - Content analysis when AI is unavailable

## 📁 Project Structure

```
quizcraft-ai/
├── client/                 # Frontend React application
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Radix UI component library
│   ├── contexts/          # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions
│   ├── pages/             # Application pages/routes
│   └── App.tsx            # Main application component
├── server/                # Backend Express application
│   ├── routes/            # API route handlers
│   │   ├── auth.ts        # Authentication endpoints
│   │   ├── quiz.ts        # Quiz generation logic
│   │   ├── pdf.ts         # PDF processing
│   │   └── admin.ts       # Admin functionality
│   └── index.ts           # Server entry point
├── shared/                # Shared TypeScript types
├── public/                # Static assets
├── netlify/               # Netlify deployment functions
└── package.json           # Project dependencies
```

## 🎮 Usage Guide

### For Students & Educators

1. **Account Creation**
   - Sign up with your email and institutional affiliation
   - Verify your account and log in

2. **Upload Study Material**
   - Drag and drop PDF files or browse to upload
   - Alternatively, paste text content directly
   - Wait for automatic text extraction

3. **Configure Quiz Settings**
   - Select difficulty level (Easy/Medium/Hard)
   - Choose question types (MCQ, True/False, or both)
   - Set the number of questions for each type

4. **Generate Quiz**
   - Click "Generate Quiz" to process your content
   - Review the generated questions in real-time
   - Copy to clipboard or download as JSON

5. **Export & Share**
   - Use the JSON output in other educational platforms
   - Share quiz files with students or colleagues

### For Administrators

1. **Admin Access**
   - Log in with admin credentials
   - Access the admin panel from the dashboard

2. **User Management**
   - View registered users and their activity
   - Monitor system usage and statistics

3. **System Configuration**
   - Manage API settings and rate limits
   - Configure system-wide preferences

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Token verification
- `POST /api/auth/forgot-password` - Password reset

### Quiz Generation
- `POST /api/generate-quiz` - Generate quiz from content
- `POST /api/extract-pdf-text` - Extract text from PDF

### Admin
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/config/api` - API configuration
- `POST /api/admin/config/system` - System settings

## 🛡️ Security Features

- **Authentication** - JWT-based token authentication
- **Input Validation** - Comprehensive input sanitization
- **File Upload Security** - File type and size validation
- **API Rate Limiting** - Protection against abuse
- **Error Handling** - Secure error messages without sensitive data exposure
- **Environment Variables** - Secure configuration management

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Netlify Deployment
The application is configured for Netlify deployment:
- Automatic builds from git repository
- Serverless functions for API endpoints
- CDN distribution for optimal performance

### Environment Variables (Production)
Set these in your deployment platform:
```env
OPENROUTER_API_KEY=your_production_api_key
NODE_ENV=production
```

## 🤝 Contributing

We welcome contributions to QuizCraft AI! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use consistent code formatting (Prettier)
- Write descriptive commit messages
- Add tests for new features
- Update documentation as needed

## 🐛 Troubleshooting

### Common Issues

**PDF Upload Fails**
- Check file size (max 10MB)
- Ensure file is a valid PDF
- Verify network connection

**Quiz Generation Errors**
- Confirm OpenRouter API key is valid
- Check API usage limits
- Verify content has sufficient text

**Authentication Issues**
- Clear browser cache and cookies
- Check token expiration
- Verify email/password combination

**Performance Issues**
- Reduce PDF file size
- Limit quiz question counts
- Check network bandwidth

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenRouter** - AI model access platform
- **DeepSeek** - Advanced language model
- **Radix UI** - Accessible component library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next generation frontend tooling

## 📞 Support

For support, questions, or feature requests:

- **GitHub Issues** - [Create an issue](https://github.com/your-username/quizcraft-ai/issues)
- **Email** - support@quizcraft-ai.com
- **Documentation** - [View full docs](https://docs.quizcraft-ai.com)

## 🔮 Roadmap

### Upcoming Features
- [ ] Multiple AI model support
- [ ] Collaborative quiz creation
- [ ] Advanced analytics dashboard
- [ ] Integration with LMS platforms
- [ ] Mobile application
- [ ] Batch processing for multiple files
- [ ] Custom question templates
- [ ] Real-time collaboration
- [ ] Advanced export formats (Word, PDF)
- [ ] Question difficulty analysis

---

**Made with ❤️ by the QuizCraft AI Team**

*Empowering education through intelligent technology*
