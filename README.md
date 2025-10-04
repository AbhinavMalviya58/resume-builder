# Modern Resume Builder

A feature-rich, modern resume builder application built with React and TypeScript. Create, customize, and download professional resumes with an intuitive interface and real-time preview.

![Resume Builder Screenshot](https://via.placeholder.com/1200x600/1a202c/ffffff?text=Resume+Builder+Screenshot)

## ✨ Features

- 📝 **Easy-to-Use Editor** - Intuitive form-based interface for entering resume information
- 🎨 **Multiple Templates** - Choose from various professionally designed templates
- 🔍 **ATS Optimization** - Get real-time feedback on how well your resume matches job descriptions
- 🎯 **AI-Powered Suggestions** - Get AI-generated content improvements and recommendations
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 💾 **Save & Export** - Download your resume as PDF or save your progress
- 🎨 **Customizable Styling** - Adjust colors, fonts, and layouts to match your personal brand
- 🔄 **Real-time Preview** - See changes instantly as you edit

## 🛠️ Tech Stack

### Frontend
- **React 18** - Frontend library for building user interfaces
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next Generation Frontend Tooling
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management and validation
- **React PDF** - PDF generation and rendering
- **Framer Motion** - Animation library for React
- **Lottie** - Lightweight animation library

### State Management
- **React Context API** - For global state management
- **React Query** - Data fetching and caching

### AI & APIs
- **Gemini API** - AI-powered content generation and optimization
- **PDF.js** - PDF parsing and analysis

### Development Tools
- **ESLint** - JavaScript/TypeScript linter
- **Prettier** - Code formatter
- **Husky** - Git hooks
- **Commitlint** - Lint commit messages

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AbhinavMalviya58/resume-builder.git
   cd resume-builder
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in your browser.

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── forms/           # Form components for resume sections
│   ├── templates/       # Resume template components
│   └── ...
├── contexts/            # React context providers
├── services/            # API and service layer
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── animations/          # Lottie animation files
└── App.tsx              # Main application component
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini](https://ai.google/)
- [PDF.js](https://mozilla.github.io/pdf.js/)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
