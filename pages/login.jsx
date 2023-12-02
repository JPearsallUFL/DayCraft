import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { Container } from "react-bootstrap";

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const { user } = req.session;
    const props = {};
    if (user) {
      props.user = req.session.user;
    }
    props.isLoggedIn = !!user;
    return { props };
  },
  sessionOptions
);

export default function Login(props) {
  const router = useRouter();
  const [{ username, password }, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  function handleChange(e) {
    setForm({ username, password, ...{ [e.target.name]: e.target.value } });
  }
  async function handleLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim())
      return setError('Must include username and password')
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (res.status === 200) {
        return router.push('/');
      }
      const { error: message } = await res.json();
      setError(message);
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <>
      <Head>
        <title>DayCraft Login</title>
        <meta name="description" content="DayCraft Login Page" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

      <Container>
        <main>
          <div className="signup_form">
            <h1>Welcome back to DayCraft!</h1>
            <h2>Login Below.</h2>

            <form onSubmit={handleLogin}>
              <div className="fields">
                <label htmlFor="username">Username: </label>
                <input type="text" name="username" id="username" onChange={handleChange} value={username} />
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" onChange={handleChange} value={password} />
              </div>
              <div className="login_signup_stuff"><button>Login</button></div>
              {error && <p>{error}</p>}
            </form>
          </div>
        </main>
      </Container>
    </>
  );
}