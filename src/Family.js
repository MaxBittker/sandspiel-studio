import React from "react";

import useStore from "./store";
import { imageURLBase } from "./ExtraUI";

export const PostLink = ({ post }) => {
  return (
    <a
      href={`${window.location.protocol}//${window.location.host}/post/${post.id}`}
      style={{ fontSize: "1rem" }}
    >
      <span className="title">
        {post.title} views: {post.views}
      </span>

      <img src={`${imageURLBase}${post.id}.png`}></img>
    </a>
  );
};
const Family = ({}) => {
  const post = useStore((state) => state.post);
  const { children, parent } = post ?? {};
  const hasChildren = children && children.length ? true : null;
  const hasSiblings = parent?.children && parent.children.length ? true : null;
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
      {hasSiblings && (
        <>
          <div className="post-group">
            <span className="group-title"> Siblings:</span>

            <div className="children">
              {parent?.children.map((child) => {
                return <PostLink key={child.id} post={child} />;
              })}
            </div>
          </div>
        </>
      )}
      {hasChildren && (
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
