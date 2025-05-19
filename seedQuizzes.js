// seedQuizzes.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Added bcrypt
const Quiz = require('./models/quizModel');
const User = require('./models/userModel');
const database = require('./config/database');

const quizzesToSeed = [
  {
    title: "Nginx & Express Fundamentals",
    description: "Test your knowledge on configuring Nginx as a reverse proxy for Express.js applications.",
    category: "Web Utvikling",
    isPublished: true, // Added this line
    questions: [
      {
        questionText: "What is the primary role of Nginx when used with an Express.js application?",
        questionType: "multiple-choice",
        options: ["Serving static files directly", "Acting as a database server", "As a reverse proxy and load balancer", "Writing server-side application logic"],
        correctAnswer: "2", 
        points: 1
      },
      {
        questionText: "In an Nginx configuration, which directive is used to pass requests to a backend Express server?",
        questionType: "multiple-choice",
        options: ["server_name", "listen", "location", "proxy_pass"],
        correctAnswer: "3", 
        points: 1
      },
      {
        questionText: "True or False: Express.js can handle SSL/TLS termination itself, but it's often recommended to offload it to Nginx.",
        questionType: "true-false",
        options: ["True", "False"], 
        correctAnswer: "true",
        points: 1
      }
    ]
  },
  {
    title: "Node.js and DNS Concepts (BIND9)",
    description: "Explore concepts related to Node.js networking and DNS with BIND9.",
    category: "Nettverk",
    isPublished: true, // Added this line
    questions: [
      {
        questionText: "Which Node.js module is primarily used for DNS-related operations like lookups?",
        questionType: "multiple-choice",
        options: ["http", "dns", "net", "fs"],
        correctAnswer: "1", 
        points: 1
      },
      {
        questionText: "What type of DNS record maps a domain name to an IPv4 address in BIND9 configurations?",
        questionType: "multiple-choice",
        options: ["MX", "CNAME", "A", "AAAA"],
        correctAnswer: "2", 
        points: 1
      },
      {
        questionText: "BIND9 is a popular open-source software for running a DNS server. (True/False)",
        questionType: "true-false",
        options: ["True", "False"],
        correctAnswer: "true",
        points: 1
      },
      {
        questionText: "What is the default port for DNS queries?",
        questionType: "text-input",
        options: [], 
        correctAnswer: "53",
        points: 1
      }
    ]
  },
  {
    title: "Cisco Packet Tracer Essentials",
    description: "A quiz on the basic functionalities and uses of Cisco Packet Tracer.",
    category: "Nettverk",
    isPublished: true, // Added this line
    questions: [
      {
        questionText: "Cisco Packet Tracer is primarily a _______ tool.",
        questionType: "multiple-choice",
        options: ["Text editor", "Network simulation", "Database management", "Video editing"],
        correctAnswer: "1", 
        points: 1
      },
      {
        questionText: "Can you configure VLANs on switches in Cisco Packet Tracer? (True/False)",
        questionType: "true-false",
        options: ["True", "False"],
        correctAnswer: "true",
        points: 1
      },
      {
        questionText: "Which mode in Packet Tracer allows you to send test packets (PDUs) between devices to test connectivity?",
        questionType: "multiple-choice",
        options: ["Realtime Mode", "Simulation Mode", "Logical View", "Physical View"],
        correctAnswer: "1", 
        points: 1
      },
      {
        questionText: "What is the file extension for Cisco Packet Tracer activity files?",
        questionType: "text-input",
        options: [],
        correctAnswer: ".pka",
        points: 1
      }
    ]
  }
];

async function seedDB() {
  try {
    await database.connectDB(); // Ensure DB is connected

    // Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('Existing users cleared.');

    // Clear existing quizzes
    console.log('Clearing existing quizzes...');
    await Quiz.deleteMany({});
    console.log('Existing quizzes cleared.');

    // Create a new default user
    console.log('Creating a new seed user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt); // Default password for the seed user

    const seedUser = new User({
      fornavn: 'Seed',
      etternavn: 'User',
      epost: 'seeduser@example.com', // Unique email for the seed user
      passord: hashedPassword,
      role: 'admin' // Or 'user', depending on your needs
    });
    await seedUser.save();
    console.log(`New seed user created with ID: ${seedUser._id} and email: ${seedUser.epost}`);

    const creatorId = seedUser._id;

    const quizzesWithCreator = quizzesToSeed.map(quiz => ({
      ...quiz,
      creator: creatorId,
      questions: quiz.questions.map(q => {
        // Ensure true-false questions have default options if not provided
        if (q.questionType === 'true-false' && (!q.options || q.options.length === 0)) {
          return { ...q, options: ['True', 'False'] };
        }
        return q;
      })
    }));

    await Quiz.insertMany(quizzesWithCreator);
    console.log('Database seeded successfully with new quizzes and user!');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed.');
  }
}

seedDB();
