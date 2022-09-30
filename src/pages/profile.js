/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router.js";
import { useQuery } from "react-query";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  const userId = router.query.userid;
  const { data: session, status } = useSession();
  let [title, setTitle] = useState(session?.user?.name);

  const { isLoading, data: user } = useQuery([`user${userId}`], async () => {
    const result = await axios("/api/user", {
      params: {
        id: userId,
      },
    });
    return result.data;
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="post splash">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="post splash">
        <div className="profile">
          <span className="userCard">
            <img
              className="pfp"
              style={{ margin: 3, marginTop: 6 }}
              src={user?.image}
            ></img>
            <a>
              <b>{user?.name}</b>
            </a>
          </span>
          {session && session.userId === userId && (
            <>
              <span>
                <input
                  type="text"
                  placeholder="new username..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <button
                  className="simulation-button"
                  onClick={() => {
                    fetch("/api/updateProfile/", {
                      method: "post",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name: title,
                      }),
                    }).then((e) => window.location.reload());
                  }}
                >
                  Save Name
                </button>
              </span>
              <button onClick={signOut} style={{ marginBottom: 6 }}>
                Sign Out
              </button>
            </>
          )}
        </div>
      </div>
      <div className="post splash">User{"'"}s Creations</div>
    </>
  );
}
