import { useEffect, useState } from "react";

import styles from "@/styles/Home.module.css";
import "bootstrap/dist/css/bootstrap.css";
import Image from "next/image";
import Link from "next/link";

interface HeroResponse {
  results: [];
}

interface Hero {
  name: string;
  id: string;
  image: {
    url: string;
  };
}

const Home = () => {
  const [heroName, setHeroName] = useState("");
  const [heroSelected, setHeroSelected] = useState("");
  const [heroList, setHeroList] = useState([]);
  const [realTime, setRealTime] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (realTime) {
      filterHeroes();
    }
  }, [heroName, realTime]);

  const filterHeroes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERHEROES_BASE_URL}${process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN}/search/${heroName}`
      );
      const data: HeroResponse = await response.json();
      setHeroList(data.results);
    } catch (err) {
      console.log(err);
    }
  };

  const selectHero = (id: string) => {
    setLoading(true);
    setHeroSelected(id);
  };

  return (
    <div className="d-flex">
      <div className="mx-auto my-3 w-50">
        <div className={styles.searchBar}>
          <input
            className="w-50"
            value={heroName}
            placeholder="Search your superhero here..."
            onChange={(event) => setHeroName(event.target.value)}
          />
          {!realTime && (
            <button onClick={filterHeroes} className="mx-1">
              Search
            </button>
          )}
          <div className="mt-1">
            <input
              type="checkbox"
              checked={realTime}
              onClick={(event) => {
                return setRealTime(event.currentTarget.checked);
              }}
            />
            <span className="mx-2">real-time filtering</span>
          </div>
        </div>
        <div>
          <ul className="list-group mt-3">
            {heroList?.length > 0 ? (
              heroList.map((hero: Hero) => {
                return (
                  <Link
                    className="text-decoration-none"
                    href={`/profile/${encodeURIComponent(hero.id)}`}
                    key={hero.id}
                    onClick={() => selectHero(hero.id)}
                  >
                    <li className={`list-group-item ${styles.item}`}>
                      <img
                        src={hero.image.url}
                        alt="avatar"
                        className={`mx-3 ${styles.avatar}`}
                      ></img>
                      {hero.name}
                      {heroSelected === hero.name && (
                        <div className="d-flex justify-content-center">
                          <div className="spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                          </div>
                        </div>
                      )}
                    </li>
                  </Link>
                );
              })
            ) : (
              <li
                className={`list-group-item text-center fs-5 ${styles.empty}`}
              >
                <Image
                  src="/hulk.png"
                  alt="hulk search"
                  width="500"
                  height="500"
                />
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
