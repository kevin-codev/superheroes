import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { BsCaretLeftFill } from "react-icons/bs";
import styles from "@/styles/Profile.module.css";
import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";

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

const Profile: NextPage<HeroInfo> = ({
  id,
  name,
  powerstats,
  biography,
  image,
}) => {
  return (
    <>
      <div
        className={`${styles.container} ${
          !!biography?.alignment && styles[biography.alignment]
        } d-flex`}
      >
        <Link href="/" className={`text-decoration-none ${biography?.alignment === "good" ? styles.backGood : styles.backBad}`}>
          <BsCaretLeftFill />
          Back
        </Link>
      </div>
      <div
        className={`${styles.container} ${
          !!biography?.alignment && styles[biography.alignment]
        } d-flex`}
      >
        <img
          src={image?.url}
          alt="Profile Picture"
          className={`mx-3 ${styles.avatar}`}
        ></img>
        <div className="d-grid">
          <span className={`mx-5 ${styles.heroName}`}>
            {name?.toUpperCase() ?? ''}
          </span>
          <span className="mx-5">
            Secret Identity:{" "}
            {!!biography && !!biography["full-name"]
              ? biography["full-name"]
              : name}
          </span>
          <span className="mx-5">
            A.K.A: {(!!biography && biography.aliases?.join(", ")) ?? "N/A"}
          </span>
          <span className="mx-5">
            Origin: {(!!biography && biography["place-of-birth"]) ?? "Unkown"}
          </span>
        </div>
      </div>
      <div
        className={`${styles.container} ${
          !!biography?.alignment && styles[biography.alignment]
        } d-flex justify-content-between`}
      >
        <span>Combat: {powerstats?.combat}</span>
        <span>Durability: {powerstats?.durability}</span>
        <span>Intelligence: {powerstats?.intelligence}</span>
        <span>Power: {powerstats?.power}</span>
        <span>Speed: {powerstats?.speed}</span>
        <span>Strength: {powerstats?.strength}</span>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
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

export default Profile;
