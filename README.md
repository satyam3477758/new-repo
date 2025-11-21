# AgroConnect - Farm to Consumer Platform

A modern web application connecting farmers directly with consumers, eliminating intermediaries and ensuring fair pricing and transparency.

## Features

- **Direct Market Access**: Connect farmers directly with consumers
- **Product Marketplace**: Browse and purchase fresh, organic produce
- **Order Management**: Track orders with detailed delivery information
- **User Authentication**: Secure login and registration system
- **Shopping Cart**: Add products and checkout with delivery details
- **Order History**: View past orders with product details and delivery information
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Authentication)
- **Routing**: React Router
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mishrapriyanshu1975/agro-connect.git
cd agro-connect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
agro-connect/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context providers
│   ├── pages/          # Page components
│   ├── data/           # Static data and constants
│   ├── integrations/   # External service integrations
│   └── assets/         # Images and static assets
├── public/             # Public assets
└── supabase/          # Supabase functions and migrations
```

## Features in Detail

### Shopping Experience
- Browse products by category
- Filter and search functionality
- Add to cart with quantity selection
- Secure checkout with delivery details form

### Order Management
- View order history with product images
- Track order status
- View delivery details for each order
- Order confirmation and notifications

### User Features
- User registration and authentication
- Profile management
- Favorites/wishlist functionality
- Order tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any queries or support, please contact:
- Email: support@agroconnect.com
- GitHub: [@mishrapriyanshu1975](https://github.com/mishrapriyanshu1975)

## Acknowledgments

Built with modern web technologies to empower farmers and provide consumers with fresh, quality produce.
