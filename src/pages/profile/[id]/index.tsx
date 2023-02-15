import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";

interface PowerStats {
  intelligence?: string;
  strength?: string;
  speed?: string;
  durability?: string;
  power?: string;
  combat?: string;
}

interface Biography {
  "full-name"?: string;
  "alter-egos"?: string;
  aliases?: string[];
  "place-of-birth"?: string;
  "first-appearance"?: string;
  publisher?: string;
  alignment?: string;
}

interface HeroInfo {
  id: string;
  name: string;
  powerstats?: PowerStats;
  biography?: Biography;
  image?: {
    url?: string;
  };
}

interface HeroResponse {
  results: [];
}

const ProfilePage: NextPage<HeroInfo> = (props) => {
  return <>the name: {props.name}</>;
};

export const getStaticProps: GetStaticProps = async ({params}) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPERHEROES_BASE_URL}${process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN}/${params?.id}`
  );
  const hero: HeroInfo = await response.json();
  return {
    props: {
      ...hero,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPERHEROES_BASE_URL}${process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN}/search/a`
  );
  const data: HeroResponse = await response.json();
  const paths = data.results.map((_heroInfo: HeroInfo) => {
    return {
      params: { id: _heroInfo.id },
    };
  });
  return {
    paths,
    fallback: true,
  };
};

export default ProfilePage;
