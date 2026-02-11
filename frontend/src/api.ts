const API = '';
const opts: RequestInit = { credentials: 'include', headers: { 'Content-Type': 'application/json' } };

export async function signUp(username: string, password: string, email: string) {
  const res = await fetch(`${API}/api/v1/signUp`, {
    ...opts,
    method: 'POST',
    body: JSON.stringify({ username, password, email }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || 'Sign up failed');
  return data;
}

export async function signIn(username: string, password: string) {
  const res = await fetch(`${API}/api/v1/signIn`, {
    ...opts,
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || 'Sign in failed');
  return data;
}

export async function getContent(): Promise<{ _id: string; title: string; link: string; type: string }[] | null> {
  const res = await fetch(`${API}/api/v1/content`, { ...opts });
  if (res.status === 401) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || 'Failed to load content');
  const raw = data.msg;
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
}

export async function addContent(title: string, link: string, type: string) {
  const res = await fetch(`${API}/addContent`, {
    ...opts,
    method: 'POST',
    body: JSON.stringify({ Title: title, Link: link, Type: type }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || 'Failed to add content');
  return data;
}

export async function deleteContent(id: string) {
  const res = await fetch(`${API}/api/v1/content/${id}`, { ...opts, method: 'DELETE' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || 'Failed to delete');
  return data;
}
