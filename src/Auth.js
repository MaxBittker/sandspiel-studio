import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <h1>Loading...</h1>;
  }
  if (session) {
    return (
      <div>
        Signed in as {session.user?.email} <br />
        <button type="button" onClick={() => signOut()}>
          Sign out
        </button>
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
