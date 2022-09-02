import { useRouter } from "next/router.js";
import Browse from "../browse.js";

function Post() {
  const router = useRouter();
  console.log(router.query);
  let href = `${window.location.protocol}//${window.location.host}/?id=${router.query.id}`;
  if (router.query.edit !== undefined) {
    href += `&edit=${router.query.edit}`;
  }
  router.push(href);
  return <Browse />;
}
export default Post;
