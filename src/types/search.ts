export type SearchResponse = {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: Array<{
    title: string;
    author_name: Array<string> | undefined;
    key: string;
    cover_i: number | undefined;
    isbn: Array<string> | undefined;
    first_publish_year: number | undefined;
    publish_date: Array<string> | undefined;
  }>;
};

// create a fake response for testing , use 5 books from open library
// export const fakeResponse: SearchResponse = {
//   numFound: 5,
//   start: 0,
//   numFoundExact: true,
//   docs: [
//     {
//       title: "The Maddest Obsession (Book 2 in the Made Series)",
//       author_name: ["Danielle Lori"],
//       key: "/works/OL22078995W",
//       cover_i: 11699161,
//       first_publish_year: 2019,
//       publish_date: ["2019"],
//     },
//     {
//       title: "The Great Gatsby",
//       author_name: ["F. Scott Fitzgerald"],
//       key: "/works/OL36128W",
//       cover_i: 26,
//       first_publish_year: 1925,
//       publish_date: ["1925"],
//     },
//     {
//       title: "To Kill a Mockingbird",
//       author_name: ["Harper Lee"],
//       key: "/works/OL262758W",
//       cover_i: 326,
//       first_publish_year: 1960,
//       publish_date: ["1960"],
//     },
//     {
//       title: "1984",
//       author_name: ["George Orwell"],
//       key: "/works/OL1815182W",
//       cover_i: 426,
//       first_publish_year: 1949,
//       publish_date: ["1949"],
//     },
//     {
//       title: "Animal Farm",
//       author_name: ["George Orwell"],
//       key: "/works/OL365547W",
//       cover_i: 826,
//       first_publish_year: 1945,
//       publish_date: ["1945"],
//     },
//   ],
// };
