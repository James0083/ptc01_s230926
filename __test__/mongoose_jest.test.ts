const mongoUser: string = 'dnsever';
const mongoUserPw: string = 'dnsever_pw';
const connectionString: string = `mongodb://${mongoUser}:${mongoUserPw}@localhost:27017/`;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

beforeAll(async () => {
  // Connect to MongoDB
  await mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Disconnect from MongoDB
  await mongoose.disconnect();
});

describe('MongoDB Data Save', () => {
  it('should save a user to the database', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    // Create a new user
    const user = new User(userData);

    // Save the user to the database
    const savedUser = await user.save();

    // Check if the user is saved successfully
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
  });
});
