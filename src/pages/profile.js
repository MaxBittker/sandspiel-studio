/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router.js";
import { useQuery } from "react-query";
import {
  useQueryParams,
  StringParam,
  BooleanParam,
  withDefault,
  NumberParam,
} from "next-query-params";
import axios from "axios";

export default function Profile() {
  const [query, setQuery] = useQueryParams({
    admin: withDefault(BooleanParam, true),
  });
  const router = useRouter();
  const userId = router.query.userid;
  const { data: session, status } = useSession();
  let [username, setUsername] = useState(session?.user?.name);

  const { isLoading, data: user } = useQuery([`user${userId}`], async () => {
    const result = await axios("/api/user", {
      params: {
        id: userId,
      },
    });
    setUsername(result.data.name);
    return result.data;
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="post splash">
        <p>Loading...</p>
      </div>
    );
  }
  function ban() {
    fetch("/api/updateProfile/", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        banned: !user.bannedAt,
      }),
    }).then((e) => window.location.reload());
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
            {session && session.userId === userId ? (
              <span>
                <input
                  type="text"
                  placeholder={username}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                        name: username,
                      }),
                    }).then((e) => window.location.reload());
                  }}
                >
                  Save Name
                </button>
              </span>
            ) : (
              <a>
                <b>{user?.name}</b>
              </a>
            )}
          </span>

          <div className="profile-stats" style={{ marginTop: "0px" }}>
            <div>⭐{user.starsReceived}</div>
            <div>🏆{user.trophiesReceived}</div>
          </div>

          <span>
            {user.bannedAt ? (
              <span style={{ color: "red", marginRight: "1em" }}>
                ⚠ BANNED USER
              </span>
            ) : (
              ""
            )}
            {session && session.role === "admin" && query.admin && (
              <>
                <button onClick={ban} style={{ marginBottom: 6 }}>
                  {user.bannedAt ? "forgive" : "ban"} this sucker
                </button>
              </>
            )}
          </span>
          {session && session.userId === userId && (
            <div style={{ marginTop: "10px" }}>
              <button onClick={signOut} style={{ marginBottom: 6 }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="post splash">User{"'"}s Creations</div>
    </>
  );
}
