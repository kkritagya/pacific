# PowerShell script to create multiple commits for the Pacific project
# This will reset the last commit and create 35-40 smaller commits

Write-Host "Starting to create multiple commits..." -ForegroundColor Green

# Reset the last commit but keep the changes
git reset --soft HEAD~1

# Commit 1: Project configuration
git add .gitignore eslint.config.js vite.config.js package.json package-lock.json
git commit -m "feat: Add project configuration and dependencies"

# Commit 2: HTML entry point
git add index.html
git commit -m "feat: Add HTML entry point"

# Commit 3: Public assets
git add public/
git commit -m "feat: Add public assets and static files"

# Commit 4: React entry point
git add src/main.jsx
git commit -m "feat: Add React entry point (main.jsx)"

# Commit 5: Global styles
git add src/index.css
git commit -m "feat: Add global CSS styles"

# Commit 6: Main App component
git add src/App.jsx src/App.css
git commit -m "feat: Add main App component with routing"

# Commit 7: Navigation component
git add src/components/Navigation.jsx src/components/Navigation.css
git commit -m "feat: Add navigation component"

# Commit 8: Protected route component
git add src/components/ProtectedRoute.jsx
git commit -m "feat: Add protected route component for authentication"

# Commit 9: Auth context
git add src/context/AuthContext.jsx
git commit -m "feat: Add authentication context for state management"

# Commit 10: Cart context
git add src/context/CartContext.jsx
git commit -m "feat: Add cart context for shopping cart management"

# Commit 11: Home page
git add src/pages/Home.jsx src/pages/Home.css
git commit -m "feat: Add home page component"

# Commit 12: Login page
git add src/pages/Login.jsx src/pages/Login.css
git commit -m "feat: Add user login page"

# Commit 13: Register page
git add src/pages/Register.jsx src/pages/Register.css
git commit -m "feat: Add user registration page"

# Commit 14: Profile page
git add src/pages/Profile.jsx src/pages/Profile.css
git commit -m "feat: Add user profile page"

# Commit 15: Artists page
git add src/pages/Artists.jsx src/pages/Artists.css
git commit -m "feat: Add artists listing page"

# Commit 16: Artist detail page
git add src/pages/ArtistDetail.jsx src/pages/ArtistDetail.css
git commit -m "feat: Add artist detail page"

# Commit 17: Merch page
git add src/pages/Merch.jsx src/pages/Merch.css
git commit -m "feat: Add merchandise page"

# Commit 18: Vinyl page
git add src/pages/Vinyl.jsx src/pages/Vinyl.css
git commit -m "feat: Add vinyl records page"

# Commit 19: Tours page
git add src/pages/Tours.jsx src/pages/Tours.css
git commit -m "feat: Add tours page"

# Commit 20: Presave page
git add src/pages/Presave.jsx src/pages/Presave.css
git commit -m "feat: Add presave page for upcoming releases"

# Commit 21: Cart page
git add src/pages/Cart.jsx src/pages/Cart.css
git commit -m "feat: Add shopping cart page"

# Commit 22: Admin login page
git add src/pages/admin/AdminLogin.jsx src/pages/admin/AdminLogin.css
git commit -m "feat: Add admin login page"

# Commit 23: Admin dashboard
git add src/pages/admin/AdminDashboard.jsx src/pages/admin/AdminDashboard.css
git commit -m "feat: Add admin dashboard page"

# Commit 24: Admin users management
git add src/pages/admin/AdminUsers.jsx src/pages/admin/AdminUsers.css
git commit -m "feat: Add admin users management page"

# Commit 25: Admin artists management
git add src/pages/admin/AdminArtists.jsx src/pages/admin/AdminArtists.css
git commit -m "feat: Add admin artists management page"

# Commit 26: Admin orders management
git add src/pages/admin/AdminOrders.jsx src/pages/admin/AdminOrders.css
git commit -m "feat: Add admin orders management page"

# Commit 27: Backend server setup
git add backend/server.js
git commit -m "feat: Add Express server setup"

# Commit 28: Database configuration
git add backend/Database/index.js
git commit -m "feat: Add database configuration and connection"

# Commit 29: User model
git add backend/model/User.js
git commit -m "feat: Add User model for authentication"

# Commit 30: Artist model
git add backend/model/Artist.js
git commit -m "feat: Add Artist model with profile and discography"

# Commit 31: Product model
git add backend/model/Product.js
git commit -m "feat: Add Product model for merchandise and vinyl"

# Commit 32: Cart model
git add backend/model/Cart.js
git commit -m "feat: Add Cart model for shopping cart functionality"

# Commit 33: Order models
git add backend/model/Order.js backend/model/OrderItem.js
git commit -m "feat: Add Order and OrderItem models for purchase management"

# Commit 34: Authentication middleware
git add backend/middleware/auth.js
git commit -m "feat: Add JWT authentication middleware"

# Commit 35: Auth controller
git add backend/Controller/authController.js
git commit -m "feat: Add authentication controller with login/register"

# Commit 36: User controller
git add backend/Controller/userController.js
git commit -m "feat: Add user controller for profile management"

# Commit 37: Artist controller
git add backend/Controller/artistController.js
git commit -m "feat: Add artist controller for artist management"

# Commit 38: Product controller
git add backend/Controller/productController.js
git commit -m "feat: Add product controller for merchandise management"

# Commit 39: Cart and Order controllers
git add backend/Controller/cartController.js backend/Controller/orderController.js
git commit -m "feat: Add cart and order controllers for e-commerce"

# Commit 40: Admin controller
git add backend/Controller/adminController.js
git commit -m "feat: Add admin controller for administrative functions"

# Commit 41: Route files
git add backend/route/
git commit -m "feat: Add all API route definitions"

# Commit 42: Admin password check
git add backend/checkAdminPassword.js
git commit -m "feat: Add admin password verification utility"

# Commit 43: Environment configuration
git add backend/.env
git commit -m "feat: Add environment configuration"

# Commit 44: Assets
git add src/assets/
git commit -m "feat: Add React assets and icons"

# Commit 45: Additional files
git add "e items∩Çó" "t model with profile and discography fields∩Çó" .bolt/
git commit -m "feat: Add additional project files and documentation"

Write-Host "Successfully created 45 commits!" -ForegroundColor Green
Write-Host "Total commits: $(git rev-list --count HEAD)" -ForegroundColor Yellow 