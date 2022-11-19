import type { MetaFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import {
  useLoaderData,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';

import { getUser } from '~/utils/session.server';
import styles from './styles/app.css';

import Navigation from './components/Navigation';

export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'LFGroup',
  viewport: 'width=device-width,initial-scale=1',
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json(user);
};

// temporary nav jsx to test user data with login/logout
export default function App() {
  const data = useLoaderData();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Navigation user={data} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
