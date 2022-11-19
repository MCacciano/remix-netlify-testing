import type { LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  if (user) {
    return redirect('/feed');
  }

  return redirect('/login');
};
