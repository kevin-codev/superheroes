import { AppProps } from "next/app";

export default function InputSearchBar({
  pageProps: { heroName, setHeroName, filterHeroes },
}: AppProps) {
  return (
    <input
      value={heroName}
      onChange={(event) => setHeroName(event.target.value)}
      onSubmit={filterHeroes}
    />
  );
}
