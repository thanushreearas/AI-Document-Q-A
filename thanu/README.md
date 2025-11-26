# AI-Powered Document Q&A System

A full-stack application that allows users to upload documents and ask intelligent questions using AI. Built with React frontend and Flask backend, integrated with OpenRouter API for AI capabilities.

## 🚀 Features

- **Document Upload**: Support for PDF, DOCX, and TXT files (up to 1GB)
- **AI-Powered Q&A**: Ask questions about your documents using OpenRouter API
- **Document Summarization**: Generate intelligent summaries of uploaded documents
- **User Authentication**: Secure JWT-based authentication system
- **Responsive UI**: Blue, white, and black themed interface
- **Q&A History**: Track all your questions and answers
- **Dashboard Analytics**: Visual charts showing your activity

## 🛠 Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLite**: Local database for document storage
- **OpenRouter API**: AI model integration (gpt-oss-20b)
- **JWT**: Authentication tokens
- **PyPDF2**: PDF text extraction
- **python-docx**: DOCX text extraction

### Frontend
- **React**: User interface framework
- **Chart.js**: Data visualization
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Dropzone**: File upload interface

## 📋 Prerequisites

- Python 3.7+
- Node.js 14+
- OpenRouter API key

## 🔧 Installation

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

3. **Update configuration:**
   - The OpenRouter API key is already configured in `config.py`
   - SQLite database will be created automatically
   - Change `JWT_SECRET_KEY` and `SECRET_KEY` for production

5. **Create uploads directory:**
   ```bash
   mkdir uploads
   ```

6. **Run the Flask server:**
   ```bash
   python app.py
   ```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

The frontend will start on `http://localhost:3000`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/list` - List user documents
- `GET /api/documents/<id>` - Get document details
- `DELETE /api/documents/<id>` - Delete document

### Q&A
- `POST /api/qa/ask` - Ask question about document
- `POST /api/qa/summarize/<id>` - Generate document summary
- `GET /api/qa/history` - Get Q&A history
- `DELETE /api/qa/history/<id>` - Delete Q&A record

### Health
- `GET /api/health` - Health check endpoint

## 📱 Usage

1. **Register/Login**: Create an account or sign in
2. **Upload Documents**: Drag and drop or select PDF, DOCX, or TXT files
3. **Ask Questions**: Select a document and ask intelligent questions
4. **Generate Summaries**: Get AI-powered document summaries
5. **View History**: Track all your Q&A interactions
6. **Dashboard**: Monitor your activity with visual charts

## 🎨 UI Theme

The application uses a blue, white, and black color scheme:
- **Primary Blue**: #2563eb
- **Light Blue**: #3b82f6
- **Dark Blue**: #1d4ed8
- **Background**: #eff6ff
- **White**: #ffffff
- **Black**: #000000

## 🔒 Security Features

- JWT-based authentication
- Password hashing with Werkzeug
- File type validation
- File size limits (1GB max)
- CORS protection
- Input sanitization

## 📊 AI Integration

The system uses OpenRouter API with the following configuration:
- **Model**: gpt-oss-20b (free tier)
- **API Key**: Pre-configured in the system
- **Features**: Document Q&A, summarization, context-aware responses

## 🚀 Deployment

### Local Deployment
1. Follow installation steps above
2. Run both backend and frontend servers
3. Access the application at `http://localhost:3000`

### Production Deployment
1. Update configuration for production environment
2. SQLite database file will be created automatically
3. Configure environment variables
4. Build React app: `npm run build`
5. Deploy using your preferred hosting service

## 📝 File Structure

```
ai-document-qa/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── config.py        # Configuration
│   └── app.py          # Main Flask app
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── styles/      # CSS styles
│   │   └── utils/       # Utility functions
│   └── public/          # Static files
└── requirements.txt     # Python dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the API documentation in the code
2. Review the error messages in the console
3. Ensure all dependencies are installed correctly
4. SQLite database is created automatically
5. Check OpenRouter API key validity

## 🔄 Updates

The system is designed to be easily extensible:
- Add new document formats by extending `DocumentProcessor`
- Integrate additional AI models through the `AIService`
- Enhance UI with new React components
- Add more analytics to the dashboard

---

**Built with ❤️ using React, Flask, and AI**