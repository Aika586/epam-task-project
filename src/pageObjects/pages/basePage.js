import { browser } from "@wdio/globals";

export default class BasePage {
  constructor(path) {
    this.path = path;
  }

  async open() {
    if (!this.path) throw new Error("No path specified for this page!");
    await browser.url(this.path);
  }
}