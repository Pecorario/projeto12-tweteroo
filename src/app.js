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

  const hasUserAndIsString = username && typeof username === 'string';
  const hasAvatarAndIsString = avatar && typeof avatar === 'string';

  if (!hasUserAndIsString || !hasAvatarAndIsString) {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  if (findUser(username)) {
    return res.status(400).send('Este username já está em uso!');
  }

  users.push({ username, avatar });
  return res.status(201).send('Ok');
});

app.post('/tweets', (req, res) => {
  const { user } = req.headers;
  const { tweet } = req.body;

  const hasTweetAndIsString = tweet && typeof tweet === 'string';

  const foundUser = findUser(user);

  if (!hasTweetAndIsString) {
    return res.status(400).send('Todos os campos são obrigatórios!');
  }

  if (!foundUser) {
    return res.status(401).send('UNAUTHORIZED');
  }

  tweets.push({ username: user, tweet });
  return res.status(201).send('Ok');
});

app.get('/tweets', (req, res) => {
  const idxLastTenTweets = tweets.length - 11;
  const { page } = req.query;

  if (!page) {
    const lastTenTweets = tweets
      .filter((_, idx) => idx > idxLastTenTweets)
      .map(item => {
        const foundUser = findUser(item.username);

        return { ...item, avatar: foundUser.avatar };
      });
    return res.status(200).send(lastTenTweets);
  } else {
    if (page >= 1) {
      const minIdxTweetsPage = tweets.length - page * 10;
      const maxIdxTweetsPage = minIdxTweetsPage + 9;

      const filteredTweets = tweets
        .filter((_, idx) => idx >= minIdxTweetsPage && idx <= maxIdxTweetsPage)
        .map(item => {
          const foundUser = findUser(item.username);

          return { ...item, avatar: foundUser.avatar };
        });

      return res.status(200).send(filteredTweets);
    }

    return res.sendStatus(400);
  }
});

app.get('/tweets/:username', (req, res) => {
  const username = req.params.username;
  const tweetsByUsername = tweets
    .filter(user => user.username === username)
    .map(item => {
      const foundUser = findUser(item.username);

      return { ...item, avatar: foundUser.avatar };
    });

  return res.status(200).send(tweetsByUsername);
});

const PORT = 5000;
app.listen(PORT, console.log(`Rodando servidor na porta ${PORT}`));
