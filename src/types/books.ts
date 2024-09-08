export type BookSnippet = {
  title: string;
  cover: string | null;
  key: string;
  authors: {
    author: { key: string };
  }[];
};
