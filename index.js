import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
const port = 3020;

app.use(bodyParser.json());

const SECRET_KEY = 'a123';

const user = {
  email: 'ehya@gmail.com',
  password: '12345'
};


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (email === user.email && password === user.password) {
    const token = jwt.sign({ email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  } else {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
});
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
  });
};

app.get('/api/new-private-data', authenticateToken, (req, res) => {
  res.json({ message: 'Voici des données privées accessibles uniquement aux utilisateurs authentifiés!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
