import React, { useState } from "react";

export default function Home() {
  return (
    <>
      <div className="post splash">
        <p>
          <b>Welcome to Sandspiel Studio! 🧪</b>
        </p>
        <p>
          Sandspiel Studio is a new tool for creating {"&"} sharing Sandspiel
          elements. We
          {"'"}re very excited to see what you
          {"'"}ll invent.
        </p>
        <p>
          Check out our{" "}
          <a href="https://www.youtube.com/channel/UCnTuyZloqqOG6q1sodeLgBw/videost with it!">
            YouTube channel
          </a>{" "}
          for tutorials and updates, and if you want to support the project or
          join our private discord server,{" "}
          <a href="https://sandspiel.gumroad.com/l/studio-early-access">
            sign up here
          </a>
          !
        </p>
        <p>Please be respectful and kind towards other users.</p>
      </div>
    </>
  );
}
