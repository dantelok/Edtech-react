import { ApolloServer } from 'apollo-server';
import { gql } from 'apollo-server';
import bcrypt from 'bcrypt'; // For password hashing
import jwt from 'jsonwebtoken'; // For generating JWT tokens
import mongoose from 'mongoose'; // For MongoDB integration

// Secret for JWT (in a real app, store this securely)
const JWT_SECRET = 'mysecretkey';

// Connect to MongoDB
const uri = 'mongodb+srv://dantelok93:IQ7acVrsTwvyGkHj@edtech.t5mpu.mongodb.net/'

console.log('MongDB start connecting...')
await mongoose.connect(uri, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,  // Increase timeout to 30 seconds
  bufferCommands: false  // Disable buffering if not connected
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schemas and models

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Event Schema and Model
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  start: String,
  end: String,
  allDay: Boolean,
  repeat: String,
});
const Event = mongoose.model('Event', eventSchema);

// GraphQL Schema
const typeDefs = gql`
  type Event {
    id: ID!
    title: String!
    description: String
    start: String!
    end: String!
    allDay: Boolean!
    repeat: String
  }

  type User {
    id: ID!
    email: String!
  }

  type AuthPayload {
    token: String
  }

  type Query {
    getEvents: [Event!]!
    getUsers: [User!]!  # Optional, to see the list of users
  }

  type Mutation {
    signUp(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload

    createEvent(
      title: String!
      description: String
      start: String!
      end: String!
      allDay: Boolean!
      repeat: String
    ): Event!

    updateEvent(
      id: ID!
      title: String!
      description: String
      start: String!
      end: String!
      allDay: Boolean!
      repeat: String
    ): Event!

    deleteEvent(id: ID!): Boolean!
  }
`;

// Resolvers for handling authentication, event queries, and mutations
const resolvers = {
  Query: {
    // Fetch all events from MongoDB
    getEvents: async () => {
      return await Event.find();
    },

    // Fetch all users from MongoDB
    getUsers: async () => {
      return await User.find();
    },
  },
  Mutation: {
    // SignUp Mutation
    signUp: async (_, { email, password }) => {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });

      // Save the new user to the database
      await newUser.save();

      // Generate a JWT token
      const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET);

      return { token };
    },

    // Login Mutation
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('User not found');
      }

      // Compare the password with the hashed password stored
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);

      return { token };
    },

    // Create Event Mutation
    createEvent: async (_, { title, description, start, end, allDay, repeat }) => {
      const newEvent = new Event({
        title,
        description,
        start,
        end,
        allDay,
        repeat,
      });

      // Save the event to MongoDB
      await newEvent.save();
      return newEvent;
    },

    // Update Event Mutation
    updateEvent: async (_, { id, title, description, start, end, allDay, repeat }) => {
      const updatedEvent = await Event.findByIdAndUpdate(id, {
        title,
        description,
        start,
        end,
        allDay,
        repeat,
      }, { new: true });

      if (!updatedEvent) {
        throw new Error(`Event with id ${id} not found`);
      }

      return updatedEvent;
    },

    // Delete Event Mutation
    deleteEvent: async (_, { id }) => {
      const deletedEvent = await Event.findByIdAndDelete(id);
      return !!deletedEvent;
    },
  },
};

// Apollo Server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Check for a JWT token in the request headers
    const token = req.headers.authorization || '';

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return { userId: decoded.userId, email: decoded.email };
      } catch (err) {
        throw new Error('Invalid token');
      }
    }
  }
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
server.start().then(() => {
  server.applyMiddleware({ app, path: "/api/graphql" });
});