# Job Portal - Frontend

A modern React + Vite application for AI-powered job matching with blockchain-secured payments.

## Features

- **AI-Powered Job Matching**: Smart skill extraction and job recommendations
- **Blockchain Payments**: Sepolia testnet integration for secure job posting fees
- **User Authentication**: JWT-based secure login and signup
- **Wallet Integration**: MetaMask support for blockchain transactions
- **Responsive Design**: Mobile-first, professional UI with warm amber palette
- **Real-time Search**: Browse and filter job listings
- **Profile Management**: Track skills, experience, and wallet address
- **Skill Extraction AI**: Auto-extract skills from resume/bio text

## Tech Stack

- **Framework**: React with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + custom App.css
- **HTTP Client**: Axios with JWT interceptors
- **State Management**: React Context API
- **Navigation**: React Router v6
- **Web3**: ethers.js for MetaMask/blockchain integration

## Getting Started

### Prerequisites
- Node.js
- MetaMask browser extension (for blockchain features)
- Backend API running on http://localhost:8080

### Installation

```bash
git clone https://github.com/Akshatt02/Job-portal-frontend
cd Job-portal-frontend
npm install
```

### Environment Setup

Create `.env.local` for local development:

```env
# Development
VITE_API_URL=http://localhost:8080
VITE_RPC_URL=https://sepolia-rpc.publicnode.com
```

**Deployment Configuration**: Update `VITE_API_URL` to point to production backend:

```env
# Production
VITE_API_URL=https://api.yourdomain.com
VITE_RPC_URL=https://sepolia-rpc.publicnode.com
```

Environment variables are loaded at **build time** in Vite. Rebuild the application for changes to take effect.

### Development Server

```bash
npm run dev
```

Application runs on http://localhost:5173

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── pages/              # Route pages
│   ├── Landing.jsx    # Home page with CTA
│   ├── Login.jsx      # User authentication
│   ├── Signup.jsx     # Account creation
│   ├── Jobs.jsx       # Job listing & discovery
│   ├── PostJob.jsx    # Create job with blockchain payment
│   └── Profile.jsx    # User profile & skill management
├── components/         # Reusable components
│   ├── Navbar.jsx     # Navigation with wallet connect
│   ├── JobCard.jsx    # Job card component
│   └── JobModal.jsx   # Job details modal
├── context/           # React Context
│   └── AuthContext.jsx# User auth state management
├── api/               # HTTP & API config
│   └── axios.js       # Axios instance with JWT interceptor
├── web3/              # Blockchain integration
│   └── wallet.js      # MetaMask & Sepolia testnet logic
├── assets/            # Static assets
├── App.jsx            # Root component
├── App.css            # Global styles & design tokens
├── main.jsx           # Entry point
└── index.css          # Tailwind imports
```

## Authentication Flow

1. User signs up with email/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Axios interceptor adds token to all requests
5. AuthContext provides `user` state globally

Protected routes check for `user` presence and redirect to login if missing.

## Blockchain Payment Flow

1. User clicks "Pay & Post Job"
2. Frontend calls `payPlatformFee()` from `web3/wallet.js`
3. MetaMask prompts user to approve transaction
4. 0.001 Sepolia ETH sent to admin wallet
5. Transaction hash returned to frontend
6. Frontend sends job data + txHash to backend
7. Backend validates and stores job with payment proof

### Sepolia Testnet Setup

- Network: Ethereum Sepolia
- Chain ID: 11155111 (0xaa36a7)
- Get test ETH: https://www.alchemy.com/faucets/ethereum-sepolia

**Important**: Update `ADMIN_WALLET` in `src/web3/wallet.js` with your Sepolia address.

## Design System

### Color Palette
- **Primary**: Amber/Orange (#b45309, #f59e0b)
- **Muted**: Warm Bronze (#6b5b3a, #bfa985)
- **Success**: Green (#15803d)
- **Error**: Red (#991b1b)

### Key CSS Classes
- `.btn` - Primary button with gradient
- `.btn-secondary` - Muted button style
- `.input` - Form input with focus states
- `.error-box` - Error message card
- `.success-box` - Success message card
- `.skill-badge` - Professional skill tag styling
- `.nav-link` - Navigation link with hover effect

### Component-Specific Styles

All components use inline styles for dynamic values and Tailwind for responsive layouts.

## Wallet Connection Flow

When user clicks "Connect Wallet":

1. **Not Logged In**: Connects locally, shows address truncated
2. **Logged In**: Connects and saves address to user profile via `PUT /profile`
3. **Already Connected**: Shows "Wallet Connected" badge globally
4. **Disconnected**: Shows "Connect Wallet" button with pointer cursor

Wallet connection requires MetaMask to be on Sepolia Testnet.

## 📡 API Endpoints Used

### Auth
- `POST /auth/register` - Sign up
- `POST /auth/login` - Login
- `GET /me` - Get current user

### Jobs
- `GET /jobs` - List all jobs (public)
- `POST /jobs` - Create job (protected, requires blockchain payment)
- `GET /jobs/:id` - Get job details with match score (protected)

### Profile
- `GET /profile/:id` - Get user profile
- `PUT /profile` - Update user profile (protected)

### AI
- `POST /ai/extract-skills` - Extract skills from text (protected)

## Development Tips

### API Calls

```jsx
import API from "../api/axios";

// Automatically includes JWT token
const res = await API.get("/me");
const res = await API.post("/jobs", { title, description });
```

### Protected Routes

```jsx
if (!user) {
  return <Redirect to="/login" />;
}
```

## Security Notes

- JWT tokens stored in localStorage
- API calls include Authorization header
- Form validation before submission
- Blockchain transactions verified on chain
- User authentication required for sensitive operations

## Dependencies

See `package.json` for full list. Key packages:

- react, react-dom
- react-router-dom
- axios
- ethers.js
- tailwindcss

## Deployment

Build optimized production bundle:

```bash
npm run build
```

Deploy `dist/` folder to any static host (Vercel, Netlify, AWS S3, etc.)

### Deployment Checklist

1. **Update Environment Variables**: Set `VITE_API_URL` to production backend URL
2. **Rebuild**: Run `npm run build` with updated .env
3. **Test Deployment**: Verify API connectivity and blockchain features work
4. **Backend CORS**: Ensure backend allows requests from your frontend domain
   - Update backend `FRONTEND_URL` environment variable
5. **SSL/TLS**: Ensure both frontend and backend use HTTPS
6. **Domain Configuration**: Update `ADMIN_WALLET` in `wallet.js` if using different Ethereum network