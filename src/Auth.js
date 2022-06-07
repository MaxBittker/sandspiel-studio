/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }
  if (session) {
    return (
      <div>
        <img
          className="pfp"
          style={{ float: "left", margin: 3, marginTop: 6 }}
          src={session.user?.image}
        ></img>
        <Link href={`/browse?userId=${session.userId}`}>My Posts</Link>
        <br />
        <br />
        <a
          href=""
          type="button"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}
        >
          Sign out
        </a>
        <br />
        <br />
      </div>
    );
  }
  return (
    <div>
      Not signed in <br />
      <button type="button" onClick={() => signIn()}>
        Sign in
      </button>
    </div>
  );
};

export default Home;
