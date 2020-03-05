import express, { json, Response, NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import invariant from 'tiny-invariant'

interface User {
  id: string
  username: string
  password: string
  role: string
}

interface Book {
  author: string
  country: string
  language: string
  pages: Number
  title: string
  year: Number
}

interface Request extends express.Request {
  user?: User
}

const users: User[] = [
  {
    id: '1',
    username: 'john',
    password: 'password123admin',
    role: 'admin'
  },
  {
    id: '2',
    username: 'anna',
    password: 'password123member',
    role: 'member'
  }
]

const books: Book[] = [
  {
    author: "Chinua Achebe",
    country: "Nigeria",
    language: "English",
    pages: 209,
    title: "Things Fall Apart",
    year: 1958
  },
  {
    author: "Hans Christian Andersen",
    country: "Denmark",
    language: "Danish",
    pages: 784,
    title: "Fairy tales",
    year: 1836
  },
  {
    author: "Dante Alighieri",
    country: "Italy",
    language: "Italian",
    pages: 928,
    title: "The Divine Comedy",
    year: 1315
  }
]

const authenticateJWT = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { jwt: token } = req.cookies

  if (!(token as boolean)) {
    return res.status(401).json({ error: { message: 'You need to Login' } })
  }

  invariant(process.env.JWT_SECRET, 'JWT_SECRET not defined')
  try {
    const user = await jwt.verify(token, process.env.JWT_SECRET)

    req.user = user as User
    next()
  } catch (err) {
    return res.sendStatus(403)
  }
}

const server = express()
server.use(json())
// server.use(cors({
//   origin: [
//     `${process.env.FRONT_URL as string}`,
//     'http://localhost:3000'
//   ],
//   credentials: true
// }))
server.use(cors())
server.use(cookieParser())

server.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(u => { return u.username === username && u.password === password }) ?? null

  if (user !== null) {
    invariant(process.env.JWT_SECRET, 'JWT_SECRET not defined')

    const expiration = 100
    const accessToken = jwt.sign({ username: user.username, role: user.role }, process.env.JWT_SECRET)

    res.cookie('jwt', accessToken, {
      expires: new Date(Date.now() + expiration),
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    })

    res.json({
      accessToken
    })
  } else {
    res.json({ error: { message: 'Username or password incorrect' } })
  }
})

server.get('/books', authenticateJWT, (req: Request, res) => res.json({
  user: req.user,
  books
}))

const PORT = process.env.PORT ?? 5000

server.listen(PORT, () => console.log(`Server started at port ${PORT as string}`))
