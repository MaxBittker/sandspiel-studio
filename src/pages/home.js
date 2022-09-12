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
          elements.
        </p>
        <p>
          Thank you for testing out Sandspiel Studio while it{"'"}s in
          development! We{"'"}re working hard to make it powerful and
          fun, and we{"'"}re very excited to see what you{"'"}ll invent with it!
        </p>
        <p>
          If you want to support the project, or join our private discord
          server,{" "}
          <a href="https://sandspiel.gumroad.com/l/studio-early-access">
            sign up here
          </a>
          !
        </p>
      </div>
    </>
  );
}
