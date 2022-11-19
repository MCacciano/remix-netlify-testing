import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useActionData, useSearchParams } from '@remix-run/react';

import { createUserSession, getUser, getUserId, register } from '~/utils/session.server';

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    email: string | undefined;
    password: string | undefined;
    confirmPassword: string | undefined;
  };
  fields?: {
    username: string | undefined;
    password: string | undefined;
    email: string | undefined;
    confirmPassword: string | undefined;
  };
};

const validateUsername = (username: unknown) => {
  if (typeof username !== 'string' || username.length < 3) {
    return `Username must be at least 3 characters long.`;
  }
};

const validateEmail = (email: unknown) => {
  const isEmail = /^[a-z0-9.]{1,64}@[a-z0-9.]{1,64}$/i;

  if (typeof email !== 'string' || !isEmail.test(email)) {
    return `Please enter a valid email.`;
  }
};

const validatePassword = (password: unknown, confirmPassword?: unknown) => {
  if (typeof password !== 'string' || password.length < 5) {
    return `Password must be at least 5 characters long.`;
  }

  if (confirmPassword && password !== confirmPassword) {
    return `Passwords do not match.`;
  }
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect('/');
  }
  return json(user);
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get('username');
  const email = form.get('email');
  const password = form.get('password');
  const redirectTo = form.get('redirectTo') || '/';
  const confirmPassword = form.get('confirm-password');

  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof email !== 'string' ||
    typeof confirmPassword !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({ formError: 'Form not submitted correctly' });
  }

  const fields = { username, email, password, confirmPassword };
  const fieldErrors = {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password, confirmPassword),
    confirmPassword: validatePassword(confirmPassword, password),
  };

  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fields, fieldErrors });
  }

  const user = await getUserId(request);

  if (user) {
    return badRequest({
      fields,
      formError: `User with the username ${username} already exsists`,
    });
  }

  const newUser = await register({ username, password, email });

  return createUserSession(newUser.id, redirectTo);
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData();

  console.log('actionData', actionData);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-y-4 p-10 border border-black rounded shadow-md">
        <h1 className="text-4xl font-rubik font-medium">Register</h1>
        <form method="post" action="/register" className="flex flex-col gap-y-5">
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get('redirectTo') ?? undefined}
          />
          <div className="flex flex-col items-start gap-y-1">
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              className={`w-full border border-black rounded p-1 ${
                actionData?.fieldErrors?.username ? 'border-red-600' : ''
              }`}
            />
            {actionData?.fieldErrors?.username && (
              <p className="text-red-600 text-sm">{actionData?.fieldErrors?.username}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-1">
            <label htmlFor="email-input">Email</label>
            <input
              type="email"
              id="email-input"
              name="email"
              defaultValue={actionData?.fields?.email}
              className={`w-full border border-black rounded p-1 ${
                actionData?.fieldErrors?.email ? 'border-red-600' : ''
              }`}
            />
            {actionData?.fieldErrors?.email && (
              <p className="text-red-600 text-sm">{actionData?.fieldErrors?.email}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-1">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue={actionData?.fields?.password}
              className={`w-full border border-black rounded p-1 ${
                actionData?.fieldErrors?.password ? 'border-red-600' : ''
              }`}
            />
            {actionData?.fieldErrors?.password && (
              <p className="text-red-600 text-sm">{actionData?.fieldErrors?.password}</p>
            )}
          </div>
          <div className="flex flex-col items-start gap-y-1">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              defaultValue={actionData?.fields?.passwordConfirm}
              className={`w-full border border-black rounded p-1 ${
                actionData?.fieldErrors?.confirmPassword ? 'border-red-600' : ''
              }`}
            />
            {actionData?.fieldErrors?.confirmPassword && (
              <p className="text-red-600 text-sm">{actionData?.fieldErrors?.confirmPassword}</p>
            )}
          </div>
          <button type="submit" className="bg-black text-gray-100 p-1 rounded shadow-md">
            Submit
          </button>
          <div className="flex gap-x-1">
            <p>Already registered?</p>
            <Link to="/login" className="text-blue-600 cursor-pointer">
              Log In!
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
