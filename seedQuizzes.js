// seedQuizzes.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Added bcrypt
const Quiz = require('./models/quizModel');
const User = require('./models/userModel');
const database = require('./config/database');

const quizzesToSeed = [
  {
    title: "Nginx & Express Grunnleggende",
    description: "Test kunnskapen din om å konfigurere Nginx som en reverse proxy for Express.js-applikasjoner.",
    category: "Web Utvikling",
    isPublished: true, // Added this line
    questions: [
      {
        questionText: "Hva er hovedrollen til Nginx når den brukes sammen med en Express.js-applikasjon?",
        questionType: "multiple-choice",
        options: [
          "Servere statiske filer direkte",
          "Fungere som en databaseserver",
          "Som en reverse proxy og lastbalanserer",
          "Skrive server-side applikasjonslogikk"
        ],
        correctAnswer: "2", 
        points: 1
      },
      {
        questionText: "Hvilket Nginx-direktiv brukes for å sende forespørsler til en backend Express-server?",
        questionType: "multiple-choice",
        options: ["server_name", "listen", "location", "proxy_pass"],
        correctAnswer: "3", 
        points: 1
      },
      {
        questionText: "Sant eller usant: Express.js kan håndtere SSL/TLS-terminering selv, men det anbefales ofte å overlate dette til Nginx.",
        questionType: "true-false",
        options: ["Sant", "Usant"], 
        correctAnswer: "true",
        points: 1
      }
    ]
  },
  {
    title: "Node.js og DNS-konsepter (BIND9)",
    description: "Utforsk konsepter relatert til Node.js-nettverk og DNS med BIND9.",
    category: "Nettverk",
    isPublished: true, // Added this line
    questions: [
      {
        questionText: "Hvilket Node.js-modul brukes hovedsakelig for DNS-relaterte operasjoner som oppslag?",
        questionType: "multiple-choice",
        options: ["http", "dns", "net", "fs"],
        correctAnswer: "1", 
        points: 1
      },
      {
        questionText: "Hvilken type DNS-post kobler et domenenavn til en IPv4-adresse i BIND9-konfigurasjoner?",
        questionType: "multiple-choice",
        options: ["MX", "CNAME", "A", "AAAA"],
        correctAnswer: "2", 
        points: 1
      },
      {
        questionText: "BIND9 er en populær åpen kildekode-programvare for å kjøre en DNS-server. (Sant/Usant)",
        questionType: "true-false",
        options: ["Sant", "Usant"],
        correctAnswer: "true",
        points: 1
      },
      {
        questionText: "Hva er standardporten for DNS-forespørsler?",
        questionType: "text-input",
        options: [], 
        correctAnswer: "53",
        points: 1
      }
    ]
  },
  {
    title: "Cisco Packet Tracer Grunnleggende",
    description: "En quiz om de grunnleggende funksjonene og bruksområdene til Cisco Packet Tracer.",
    category: "Nettverk",
    isPublished: true, // Added this line
    questions: [
      {
        questionText: "Cisco Packet Tracer er først og fremst et _______ verktøy.",
        questionType: "multiple-choice",
        options: ["Teksteditor", "Nettverkssimulering", "Databaseadministrasjon", "Videoredigering"],
        correctAnswer: "1", 
        points: 1
      },
      {
        questionText: "Kan du konfigurere VLAN-er på svitsjer i Cisco Packet Tracer? (Sant/Usant)",
        questionType: "true-false",
        options: ["Sant", "Usant"],
        correctAnswer: "true",
        points: 1
      },
      {
        questionText: "Hvilken modus i Packet Tracer lar deg sende testpakker (PDUer) mellom enheter for å teste tilkobling?",
        questionType: "multiple-choice",
        options: ["Realtime-modus", "Simuleringsmodus", "Logisk visning", "Fysisk visning"],
        correctAnswer: "1", 
        points: 1
      },
      {
        questionText: "Hva er filendelsen for Cisco Packet Tracer-aktivitetsfiler?",
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
