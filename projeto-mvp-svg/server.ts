import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Persistence (simple JSON storage for the judging system)
  const DATA_DIR = path.join(__dirname, 'data');
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  const COMPETITIONS_FILE = path.join(DATA_DIR, 'competitions.json');
  if (!fs.existsSync(COMPETITIONS_FILE)) fs.writeFileSync(COMPETITIONS_FILE, '[]');

  app.use(express.json());
  app.use(cookieParser());
  app.use(session({
    secret: process.env.SESSION_SECRET || 'secret-key-maker-svg',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: true,
      sameSite: 'none', // Needed for iframe
      httpOnly: true,
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user: any, done) => done(null, user));
  passport.deserializeUser((user: any, done) => done(null, user));

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
    }, (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }));
  }

  // Auth Routes
  app.get('/api/auth/google/url', (req, res) => {
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ error: 'Google Client ID not configured' });
    }
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${process.env.APP_URL}/api/auth/google/callback`,
      response_type: 'code',
      scope: 'profile email',
    });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    res.json({ url: authUrl });
  });

  app.get('/api/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login-failure' }),
    (req, res) => {
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Autenticação bem-sucedida! Esta janela fechará automaticamente.</p>
          </body>
        </html>
      `);
    }
  );

  app.get('/api/auth/user', (req, res) => {
    res.json({ user: req.user || null });
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  // Judging System API
  app.get('/api/competitions', (req, res) => {
    const data = JSON.parse(fs.readFileSync(COMPETITIONS_FILE, 'utf-8'));
    res.json(data);
  });

  app.post('/api/competitions', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const data = JSON.parse(fs.readFileSync(COMPETITIONS_FILE, 'utf-8'));
    const newComp = { id: Date.now(), ...req.body, createdAt: new Date() };
    data.push(newComp);
    fs.writeFileSync(COMPETITIONS_FILE, JSON.stringify(data, null, 2));
    res.json(newComp);
  });

  app.delete('/api/competitions/:id', (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ error: 'Unauthorized' });
    const data = JSON.parse(fs.readFileSync(COMPETITIONS_FILE, 'utf-8'));
    const filtered = data.filter((c: any) => c.id !== parseInt(req.params.id));
    fs.writeFileSync(COMPETITIONS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true });
  });

  // Vite setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
