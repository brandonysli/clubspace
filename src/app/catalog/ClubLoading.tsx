import ContentLoader from "react-content-loader";

export default function Loading() {
  const numLoaders = 6;

  return (
    <div className="flex flex-col items-start h-full gap-4 xl:flex-row">
      <div className="flex flex-col items-stretch w-auto px-2">
        {Array.from({ length: numLoaders }).map((_, index) => (
          <div
            key={index}
            className="mb-4 h-[115px] w-full md:max-w-[392px] lg:max-w-[407px] min-w-[287px] 2xs:min-w-[297px] sm:min-w-[392px]">
            <ContentLoader
              speed={2}
              width="100%"
              height="100%"
              viewBox="0 0 770 230"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb">
              <rect x="0" y="0" rx="24" ry="24" width="100%" height="100%" />
            </ContentLoader>
          </div>
        ))}
      </div>
    </div>
  );
}
