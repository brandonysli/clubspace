import ContentLoader from "react-content-loader";

export default function FilterLoading() {
  return (
    <div className="flex flex-col items-center justify-start w-full h-auto ml-0 bg-white xl:ml-2">
      <div className="w-full min-w-[300px] h-full relative xl:flex hidden">
        <ContentLoader
          speed={2}
          width="100%"
          height="100%"
          viewBox="0 0 750 1800"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb">
          <rect x="0" y="0" rx="24" ry="24" width="100%" height="100%" />
        </ContentLoader>
      </div>
    </div>
  );
}
