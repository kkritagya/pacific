# Backend Tests

This directory contains comprehensive tests for the Pacific Records backend API.

## Test Structure

### Test Files

- **`setup.js`** - Global test configuration and utilities
- **`auth.test.js`** - Authentication tests (register, login, profile management)
- **`product.test.js`** - Product management tests (CRUD operations)
- **`cart.test.js`** - Shopping cart functionality tests
- **`order.test.js`** - Order management tests
- **`admin.test.js`** - Admin functionality tests
- **`artist.test.js`** - Artist management tests
- **`integration.test.js`** - End-to-end integration tests

### Test Utilities

The `setup.js` file provides global test utilities:

- `testUtils.createTestUser()` - Create test users
- `testUtils.createTestProduct()` - Create test products
- `testUtils.createTestArtist()` - Create test artists
- `testUtils.generateToken()` - Generate JWT tokens for testing

## Running Tests

### Prerequisites

1. Install dependencies:
```bash
npm install
```

2. Set up test environment variables in `.env`:
```
NODE_ENV=test
JWT_SECRET=test-secret-key
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=your_test_db_name
DB_PORT=5432
```

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test -- auth.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="should register"
```

## Test Coverage

### Authentication Tests (`auth.test.js`)
- User registration
- User login
- Profile management
- Password changes
- Token validation
- Error handling

### Product Tests (`product.test.js`)
- Product listing with filters
- Product creation
- Product updates
- Product deletion
- Category management
- Search functionality

### Cart Tests (`cart.test.js`)
- Adding items to cart
- Updating cart quantities
- Removing items from cart
- Clearing entire cart
- Cart validation

### Order Tests (`order.test.js`)
- Order creation from cart
- Order history
- Order status updates
- Order cancellation
- Order validation

### Admin Tests (`admin.test.js`)
- Admin authentication
- User management
- Order management
- Dashboard statistics
- Admin-only access control

### Artist Tests (`artist.test.js`)
- Artist CRUD operations
- Discography management
- Artist search
- Profile management

### Integration Tests (`integration.test.js`)
- Complete user journeys
- End-to-end workflows
- Data consistency
- Error handling
- Edge cases

## Test Database

Tests use a separate test database that is:
- Created fresh for each test run
- Cleared between individual tests
- Configured with test-specific settings

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Cleanup**: Database is reset between tests
3. **Realistic Data**: Tests use realistic but minimal test data
4. **Error Testing**: Both success and error cases are tested
5. **Authentication**: Proper token handling and validation
6. **Edge Cases**: Boundary conditions and error scenarios

## Debugging Tests

To debug failing tests:

1. Run tests in watch mode: `npm run test:watch`
2. Use `console.log()` in test files
3. Check test database state
4. Verify environment variables
5. Check for missing dependencies

## Adding New Tests

When adding new functionality:

1. Create corresponding test file
2. Follow existing naming conventions
3. Test both success and failure cases
4. Use test utilities for common operations
5. Ensure proper cleanup

## Test Environment

- **Framework**: Jest
- **HTTP Testing**: Supertest
- **Database**: PostgreSQL with Sequelize
- **Authentication**: JWT tokens
- **Environment**: Node.js

## Continuous Integration

Tests are designed to run in CI/CD environments:
- No external dependencies
- Fast execution
- Reliable results
- Clear error reporting 