import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router.js";

export default function Profile() {
  const router = useRouter();
  const userId = router.query.userid;
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <div className="post splash">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      {session && session.userId === userId && (
        <div className="post splash">
          <div className="profile">
            <img
              className="pfp"
              style={{ margin: 3, marginTop: 6 }}
              src={session.user?.image}
            ></img>
            {/*<p>
              <b>{session.user.name}</b>
            </p>*/}
            <button onClick={signOut} style={{ marginBottom: 6 }}>
              Sign Out
            </button>
          </div>
        </div>
      )}
      <div className="post splash">User{"'"}s Creations</div>
    </>
  );
}
