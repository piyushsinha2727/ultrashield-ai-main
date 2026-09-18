export async function fetchWebsiteContent(url: string) {
  const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
  const html = await res.text();

  return html.slice(0, 2000);
}