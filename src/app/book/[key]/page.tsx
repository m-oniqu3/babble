import BookDetails from "@/src/components/books/BookDetails";
import { getBookDetails } from "@/src/utils/book";

type Props = {
  params: { key: string };
};

async function BookDetailsPage({ params }: Props) {
  if (!params.key) {
    return <div>Invalid book ID</div>;
  }

  const details = await getBookDetails(params.key);

  if (!details) {
    return <div>Could not fetch book details</div>;
  }

  if (!details.book) {
    return <div>Could not find book</div>;
  }

  return <BookDetails details={details} />;
}

export default BookDetailsPage;
