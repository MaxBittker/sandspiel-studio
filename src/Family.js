import React from "react";

import useStore from "./store";
import { imageURLBase } from "./ExtraUI";

const PostLink = ({ post }) => {
  return (
    <a
      href={`${window.location.protocol}//${window.location.host}/post/${post.id}`}
      style={{ fontSize: "1rem" }}
    >
      <span className="title">{post.id}</span>
      <img src={`${imageURLBase}${post.id}.png`}></img>
    </a>
  );
};
const Family = ({}) => {
  const parent = useStore((state) => state.parent);
  const children = useStore((state) => state.children);
  return (
    <div className="family">
      {parent && (
        <>
          <div className="post-group">
            <span className="group-title"> Parent:</span>

            <PostLink post={parent} />
          </div>
        </>
      )}
      {children && (
        <>
          <div className="post-group">
            <span className="group-title"> Children:</span>

            <div className="children">
              {children.map((child) => {
                return <PostLink key={child.id} post={child} />;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Family;
