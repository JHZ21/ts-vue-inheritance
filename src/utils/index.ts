/* */

export interface NavRow {
  label: string;
  aData: any[];
}

export interface CardData {
  img_url: string;
  title: string;
  href: string;
  readVolume: number;
  uploader: string;
  date: number;
}

interface LinkElement {
  rel: string;
  href: string;
}

export function injectLink(href: string): void {
  // <link rel="stylesheet" href="http://at.alicdn.com/t/font_1610918_9qmk8rct8ts.css">
  const new_link: LinkElement = document.createElement("link");
  new_link.rel = "stylesheet";
  new_link.href = href;
  const first_link: { parentNode: any } = document.querySelectorAll("link")[0];
  first_link.parentNode.insertBefore(new_link, first_link);
}
