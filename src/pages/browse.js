import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { useSession, signIn, signOut } from "next-auth/react";
import Home from "../Auth";
import axios from "axios";
import { PostLink } from "../Family";

function Browse() {
  //   const router = useRouter();
  //   const { data: session, status } = useSession();

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/query");

      console.log(result);
      setData(result.data);
    };

    fetchData();
  }, []);

  console.log(data);
  return (
    <div className="browse family">
      <Home />
      Browse
      {data.map((d) => {
        return <PostLink key={d.id} post={d} />;
      })}
    </div>
  );
}

export default Browse;
