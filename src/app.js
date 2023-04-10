import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

const findUser = username => {
  return users.find(
    user => user.username.toLowerCase() === username.toLowerCase()
  );
};

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;

  const errors = [];

  if (username === '' || username === undefined) {
    errors.push('O username é obrigatório!');
  }
  if (avatar === '' || avatar === undefined) {
    errors.push('O avatar é obrigatório!');
  }
  if (findUser(username)) {
    errors.push('Este username já está em uso!');
  }

  if (errors.length > 0) {
    return res.status(422).send(errors);
  } else {
    users.push({ username, avatar });
    return res.status(200).send('Ok');
  }
});

app.post('/tweets', (req, res) => {
  const { user } = req.headers;
  const { username, tweet } = req.body;

  const errors = [];

  if (!findUser(user)) {
    return res.status(401).send('UNAUTHORIZED');
  }

  if (username === '' || username === undefined) {
    errors.push('O campo username é obrigatório!');
  }
  if (tweet === '' || tweet === undefined) {
    errors.push('O campo tweet é obrigatório!');
  }

  if (errors.length > 0) {
    return res.status(422).send(errors);
  } else {
    tweets.push({ username, tweet });
    return res.status(200).send('Ok');
  }
});

app.get('/tweets', (req, res) => {
  const idxLastTenTweets = tweets.length - 11;
  console.log('idxLastTenTweets', idxLastTenTweets);
  console.log('tweets.length', tweets.length);

  const lastTenTweets = tweets
    .filter((_, idx) => idx > idxLastTenTweets)
    .map(item => {
      const avatar = findUser(item.username).avatar;

      return { ...item, avatar };
    });

  return res.status(200).send(lastTenTweets);
});

const PORT = 5000;
app.listen(PORT, console.log(`Rodando servidor na porta ${PORT}`));
