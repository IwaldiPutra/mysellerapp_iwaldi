interface ArticleCountProps {
  total: number;
  showing: number;
}

export default function ArticleCount({ total, showing }: ArticleCountProps) {
  return (
    <p className="font-medium">
      Showing : {showing} of {total} articles
    </p>
  );
}
