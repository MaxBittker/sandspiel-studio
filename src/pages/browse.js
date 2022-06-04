import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { useQueryParam, StringParam, withDefault } from "next-query-params";
import { useRouter } from "next/router";
// import { useSession, signIn, signOut } from "next-auth/react";
import Home from "../Auth";
import axios from "axios";
import { PostLink } from "../Family";

const options = ["new", "top"];

function Browse() {
  const router = useRouter();
  const [order, setOrder] = useQueryParam(
    "order",
    withDefault(StringParam, "new")
  );

  //   const { data: session, status } = useSession();

  const [data, setData] = useState([]);
  //   const [timeFrame, setTimeFrame] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("/api/query", { params: { order } });

      console.log(result);
      setData(result.data);
    };

    fetchData();
  }, [order]);

  console.log(data);
  return (
    <div className="browse family">
      <Home />
      <Dropdown
        options={options}
        onChange={(e) => setOrder(e.value)}
        value={order}
      />
      Browse
      {data.map((d) => {
        return <PostLink key={d.id} post={d} full />;
      })}
    </div>
  );
}

export default Browse;
