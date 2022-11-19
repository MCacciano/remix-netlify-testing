import bcrypt from 'bcryptjs';
import { createCookieSessionStorage, redirect } from '@remix-run/node';
import { db } from './db.server';

type LoginForm = {
  username: string;
  password: string;
};

type RegisterForm = {
  username: string;
  password: string;
  email: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error('SESSION_SECRET must be set in your .env file');

const storage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
    sameSite: 'lax',
    secrets: [sessionSecret],
    secure: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get('Cookie'));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') return null;

  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (typeof userId !== 'string') return null;

  try {
    return await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });
  } catch {
    throw logout(request);
  }
}

export async function login({ username, password }: LoginForm) {
  try {
    const user = await db.user.findUnique({ where: { username } });

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) return null;

    return { id: user.id, username };
  } catch (err) {
    throw err;
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect('/login', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  });
}

export async function register({ username, password, email }: RegisterForm) {
  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

  try {
    return await db.user.create({ data: { username, passwordHash, email } });
  } catch (err) {
    throw err;
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get('userId');

  if (!userId || typeof userId !== 'string') {
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    throw redirect(`/logon?${searchParams}`);
  }

  return userId;
}

export async function createUserSession(userId: number, redirectTo: string) {
  const session = await storage.getSession();

  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  });
}
