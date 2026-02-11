import { useState, useEffect } from "react";
import * as api from "./api";
import "./App.css";

type View = "auth" | "content";

function App() {
  const [view, setView] = useState<View>("auth");
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<{ _id: string; title: string; link: string; type: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [authTab, setAuthTab] = useState<"signIn" | "signUp">("signIn");

  // Auth form state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  // Add content form
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("link");

  const loadContent = async () => {
    setError(null);
    try {
      const data = await api.getContent();
      if (data === null) {
        setView("auth");
        setContent([]);
      } else {
        setView("content");
        setContent(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setView("auth");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.signIn(username, password);
      await loadContent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign in failed");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.signUp(username, password, email);
      await loadContent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign up failed");
    }
  };

  const handleAddContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.addContent(title, link, type);
      setTitle("");
      setLink("");
      setType("link");
      await loadContent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add");
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await api.deleteContent(id);
      await loadContent();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete");
    }
  };

  const signOut = () => {
    setView("auth");
    setContent([]);
    setUsername("");
    setPassword("");
    setEmail("");
  };

  if (loading) {
    return (
      <div className="app">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Brain</h1>
      {error && <p className="error">{error}</p>}

      {view === "auth" && (
        <section className="auth">
          <div className="tabs">
            <button
              type="button"
              className={authTab === "signIn" ? "active" : ""}
              onClick={() => setAuthTab("signIn")}
            >
              Sign in
            </button>
            <button
              type="button"
              className={authTab === "signUp" ? "active" : ""}
              onClick={() => setAuthTab("signUp")}
            >
              Sign up
            </button>
          </div>
          {authTab === "signIn" && (
            <form onSubmit={handleSignIn}>
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit">Sign in</button>
            </form>
          )}
          {authTab === "signUp" && (
            <form onSubmit={handleSignUp}>
              <input
                placeholder="Username (3–10 chars)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                minLength={3}
                maxLength={10}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password (8–20 chars)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                maxLength={20}
                required
              />
              <button type="submit">Sign up</button>
            </form>
          )}
        </section>
      )}

      {view === "content" && (
        <section className="content">
          <button type="button" className="signOut" onClick={signOut}>
            Sign out
          </button>
          <form onSubmit={handleAddContent} className="addForm">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              placeholder="Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="link">Link</option>
              <option value="note">Note</option>
            </select>
            <button type="submit">Add</button>
          </form>
          <ul className="contentList">
            {content.length === 0 ? (
              <li className="muted">No content yet. Add one above.</li>
            ) : (
              content.map((item) => (
                <li key={item._id}>
                  <span className="itemTitle">{item.title}</span>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="itemLink">
                      {item.link}
                    </a>
                  )}
                  <span className="itemType">{item.type}</span>
                  <button type="button" className="deleteBtn" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        </section>
      )}
    </div>
  );
}

export default App;
