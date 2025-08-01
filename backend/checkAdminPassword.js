require('dotenv').config();
const sequelize = require('./Database');
const User = require('./model/User');
const bcrypt = require('bcryptjs');

async function checkAdminPassword() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Find the admin user
    const adminUser = await User.findOne({
      where: { email: 'test@example5.com' }
    });

    if (adminUser) {
      console.log('Admin user found:');
      console.log('ID:', adminUser.id);
      console.log('Name:', adminUser.name);
      console.log('Email:', adminUser.email);
      console.log('Is Admin:', adminUser.isAdmin);
      console.log('Created:', adminUser.createdAt);
      
      // Reset password to a known value
      const newPassword = 'admin123';
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await adminUser.update({ password: hashedPassword });
      console.log('\nPassword reset to: admin123');
      console.log('You can now login with:');
      console.log('Email: test@example5.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user not found');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkAdminPassword(); 