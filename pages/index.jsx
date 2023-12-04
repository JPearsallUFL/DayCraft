import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import { Container } from "react-bootstrap";
import Link from "next/link"
import format from "date-fns/format";
import useLogout from "../hooks/useLogout";
import Quote from "../components/quote";

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

export default function Home(props) {
  const logout = useLogout();
  const today = format(new Date(), 'MMM do yyyy')
  return (
    <>

      <Head>
        <title>DayCraft</title>
        <meta name="description" content="Daily Planner Application" />
      </Head>

      <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />
      
      <Container className="d-flex align-items-center">
        <main>
          <div>
          <div>
            <h1>Welcome to DayCraft</h1>
            <div className="break"></div>
            <p>DayCraft is a web application that enables users to create and edit daily notes.</p>
            <Quote />
          </div>
          <div>
          {props.isLoggedIn ? (
            <>
              <Link href="/note">
                <h3>Today's Note</h3>
                <p>{today}</p>
              </Link>
            </>
            ) : (
            <>
              <Link href="/login">
                <h3>Login</h3>
              </Link>

              <Link href="/signup" >
                <h3>Create Account</h3>
              </Link>
            </>
            )}
          </div>
          </div>
        </main>
      </Container>
    </>
  );
}
