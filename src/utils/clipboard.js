// navigator.clipboard isn't supported in firefox yet (09/28/22) so we fallback to document.execCommand instead

// https://blog.logrocket.com/implementing-copy-clipboard-react-clipboard-api/
export async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
