import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;

  const errors = [];

  if (username === '' || username === undefined) {
    errors.push('O username é obrigatório!');
  }
  if (avatar === '' || avatar === undefined) {
    errors.push('O avatar é obrigatório!');
  }

  if (errors.length > 0) {
    return res.status(422).send(errors);
  }

  if (
    username !== '' &&
    avatar !== '' &&
    avatar !== undefined &&
    username !== undefined
  ) {
    users.push({ username, avatar });
    return res.status(200).send('Ok');
  }
});

const PORT = 5000;
app.listen(PORT, console.log(`Rodando servidor na porta ${PORT}`));
