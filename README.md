# FrameVault

A full-stack content authentication platform with blockchain-inspired timestamp verification. Built for creators to establish proof of existence for their digital works.

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://framevaultapp.vercel.app/)
[![React](https://img.shields.io/badge/react-18.2.0-blue.svg)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/supabase-postgres-green.svg)](https://supabase.io/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-3.x-blue.svg)](https://tailwindcss.com/)

## 🚀 Live Demo

**Production URL:** https://framevaultapp.vercel.app/

## 📸 Screenshots

<img width="1280" height="1280" alt="hom" src="https://github.com/user-attachments/assets/b87af423-3397-49d9-9250-c3bf007218b9" /><img width="1917" height="908" alt="Screenshot 2026-07-18 060434" src="https://github.com/user-attachments/assets/3221ea03-b6ac-4f1d-ae2b-059c963c1f90" /><img width="1280" height="1280" alt="wor" src="https://github.com/user-attachments/assets/4c37addf-f06b-44a3-ad25-af340772c74c" />


## ✨ Features

- **🔐 JWT Authentication** with social login (Google, Facebook OAuth)
- **🖼️ Secure Media Upload** supporting images, videos, audio, PDFs (10MB limit)
- **⛓️ Blockchain Timestamp Verification** with cryptographic proof of existence
- **✏️ Content Management** - Edit titles and dates after publication
- **🗑️ Soft Delete** with ownership-based security (Row Level Security)
- **🎨 Modern UI/UX** - Fully responsive design with Tailwind CSS
- **⚡ Real-time Updates** - Instant reflection of changes across platform

## 🛠️ Tech Stack

### Frontend
- **React 18** - Component-based architecture
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Supabase** - PostgreSQL database
- **Supabase Auth** - JWT authentication with OAuth providers
- **Supabase Storage** - Cloud file storage with CDN
- **Row Level Security (RLS)** - Database-level access control

### DevOps
- **Vercel** - Continuous deployment and hosting
- **GitHub Actions** - CI/CD pipeline

## 🏗️ Architecture
```
├── React Frontend (Vercel) 
│  ├── Public Pages (Home, Content View) 
│  └── Protected Routes (Dashboard, Upload) 
├── Supabase Backend 
│  ├── PostgreSQL (User data, Content metadata) 
│  ├── Auth (JWT + OAuth) 
│  └── Storage (Media files) 
└── CDN (Global media delivery)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account (free tier)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RonitAntil/framevault.git
cd framevault
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup Create .env file:**
```.env
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```
