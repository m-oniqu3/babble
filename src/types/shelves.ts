export type Shelves = {
  book_count: number | null;
  cover: string | null;
  created_at: string;
  description: string | null;
  id: number;
  likes: number | null;
  name: string;
  private: boolean | null;
  user_id: string;
}[];