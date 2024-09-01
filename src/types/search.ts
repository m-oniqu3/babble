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

export type OpenLibraryWork = {
  title: string;
  authors?: Array<{
    author: { key: string };
  }>;
  covers: number[];
  key: string;
  description?: { value: string } | string;
  subjects?: string[];
  subject_people?: string[];
  subject_places?: string[];
  subject_times?: string[];
  first_sentence?: { value: string };
};

export type Edition = {
  notes?: {
    value: string;
  };
  works: Array<{ key: string }>;
  publish_date?: string;
  publishers?: string[];
  title: string;
  full_title?: string;
  subtitle?: string;
  covers?: number[];
  key: string;
  number_of_pages?: number;
};

export type EditionsResponse = {
  size: number;
  entries: Edition[];
};

export type Ratings = {
  summary?: { average: number; count: number };
};
