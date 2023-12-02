import Head from "next/head";
import { withIronSessionSsr } from "iron-session/next";
import sessionOptions from "../config/session";
import Header from "../components/header";
import NoteInfo from "../components/note";

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

export default function NewReport(props) {

  return (
    <>
        <Head>
            <title>Daily Notes</title>
            <meta name="description" content="Daily Notes" />
        </Head>

        <Header isLoggedIn={props.isLoggedIn} username={props?.user?.username} />

        <NoteInfo/>
    </>
  );
}
