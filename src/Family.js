import React from "react";

import useStore from "./store";
import { imageURLBase } from "./ExtraUI";

import { useRouter } from "next/router";

export const PostLink = ({ post }) => {
  const router = useRouter();
  const href = `${window.location.protocol}//${window.location.host}/post/${post.id}`;
  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };
  post.stars = post?._count?.stars ?? 0;
  return (
    <a
      className="post"
      href={href}
      style={{ fontSize: "1rem" }}
      onClick={handleClick}
    >
      <span className="title">{post.title}</span>
      <span className="info">
        {"v: " + post.views}
        <br></br>
        {"☆: " + post.stars}
      </span>

      <img src={`${imageURLBase}${post.id}.png`}></img>
    </a>
  );
};
const Family = ({}) => {
  const post = useStore((state) => state.post);
  const { children, parent } = post ?? {};
  const hasChildren = children && children.length ? true : null;

  const hasSiblings =
    parent?.children && parent.children.length > 1 ? true : null;
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
              {parent?.children
                .filter((c) => c.id !== post.id)
                .map((child) => {
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
