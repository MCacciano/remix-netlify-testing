import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getUser } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  return json(user);
};

export default function UserProfile() {
  const { id, username } = useLoaderData();

  return (
    <div>
      <h1>{username}'s Profile</h1>
    </div>
  );
}
