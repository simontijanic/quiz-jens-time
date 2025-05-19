# IT Quiz Nettsted

Dette prosjektet er et webbasert quiz-system inspirert av Kahoot, laget for IT-faglige spørsmål. Løsningen lar brukere ta quizer, se resultater, og for administratorer å opprette, publisere og slette quizer.

## Funksjoner
- **Kahoot-lignende grensesnitt**: Svaralternativer vises i fargerike ruter (maks 2 per rad).
- **Quiztyper**: Støtte for flervalg, sant/usant og fritekst-spørsmål.
- **Resultatvisning**: Brukeren får se hvilke svar som var riktige/feil etter innlevering.
- **Poengsystem**: Hvert spørsmål gir poeng, og total poengsum vises etter quiz.
- **Admin-funksjoner**: Opprett, rediger, slett og publiser quizer. Brukerhåndtering.
- **Sikkerhet**: Riktige svar sendes aldri til frontend før quiz er levert.
- **Brukerautentisering**: Innlogging og registrering med JWT og sessions.

## Teknologi
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **Frontend**: EJS, Bootstrap, egen CSS for Kahoot-stil
- **Autentisering**: JWT, sessions, cookies

## Kom i gang
1. Klon repoet og installer avhengigheter:
   ```
   npm install
   ```
2. Sett opp `.env`-fil med følgende variabler:
   ```
   DATABASE_URL=<din-mongodb-url>
   SESSION_SECRET=<hemmelig-nøkkel>
   SECRET_KEY=<jwt-secret>
   PORT=3000
   ```
3. Kjør seed-script for å fylle databasen med eksempelquizer og adminbruker:
   ```
   node seedQuizzes.js
   ```
4. Start serveren:
   ```
   node index.js
   ```
5. Åpne nettleseren på `http://localhost:3000`

## Standard adminbruker
- E-post: `admin@admin.no`
- Passord: `admin123`

## Mappestruktur
- `controllers/` – Logikk for quiz, bruker, admin
- `models/` – Mongoose-modeller for bruker og quiz
- `routes/` – Express-ruter for auth, quiz, admin, bruker
- `views/` – EJS-maler for alle sider
- `public/styles/` – CSS
- `utils/` – Hjelpefunksjoner og middleware

## Lisens
Dette prosjektet er kun for læringsformål.
