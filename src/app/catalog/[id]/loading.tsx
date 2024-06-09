import ContentLoader from "react-content-loader";

export default function Loading() {
  return (
    <div className="flex flex-row items-stretch justify-start w-auto h-auto">
      <ContentLoader
        speed={2}
        width="100%"
        height="100%"
        viewBox="0 0 1000 700"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb">
        <rect x="0" y="0" rx="16" ry="16" width="100%" height="100%" />
      </ContentLoader>
    </div>
  );
}
