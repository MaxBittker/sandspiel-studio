import Browse from "./browse.js";

import { useRouter } from "next/router";

function Main() {
  const router = useRouter();
  router.push(`${window.location.protocol}//${window.location.host}/browse`);
  return Browse;
}

export default Main;
