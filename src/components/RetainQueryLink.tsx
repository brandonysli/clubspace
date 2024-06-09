import Link, { LinkProps } from "next/link";
import { useSearchParams } from "next/navigation";
import { PropsWithChildren } from "react";

const RetainQueryLink = ({ href, ...props }: LinkProps & PropsWithChildren) => {
  const searchParams = useSearchParams();

  const queryObject = Object.fromEntries(searchParams);

  return (
    <Link
      {...props}
      href={{
        pathname: href.toString(),
        query: queryObject,
      }}
    />
  );
};

export default RetainQueryLink;
