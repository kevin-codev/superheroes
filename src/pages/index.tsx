import { useEffect, useState } from "react";

import styles from "@/styles/Home.module.css";

import "bootstrap/dist/css/bootstrap.css";
import Link from "next/link";
import useDebounce from "@/hooks/useDebounce";

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
  const [heroList, setHeroList] = useState([]);
  const [realTime, setRealTime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const debounceSearch = useDebounce(heroName, 500);

  useEffect(() => {
    if (realTime && debounceSearch === heroName) {
      filterHeroes();
    }
  }, [heroName, realTime, debounceSearch]);

  useEffect(() => {
    const { Modal } = require("bootstrap");
    const myModal = new Modal("#heroSelectModal");
    if (loading) {
      myModal.show();
    }
    return () => {
      myModal.hide();
    };
  }, [loading]);

  const filterHeroes = async () => {
    setSearching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPERHEROES_BASE_URL}${process.env.NEXT_PUBLIC_FB_ACCESS_TOKEN}/search/${heroName}`
      );
      const data: HeroResponse = await response.json();
      setHeroList(data.results);
      setSearching(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="heroSelectModal"
        tabIndex={-1}
        aria-labelledby="heroSelectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="heroSelectModalLabel">
                Loading Character Info...
              </h5>
            </div>
            <div className="d-flex">
              <div className="spinner-border mx-auto my-5" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <button onClick={filterHeroes} disabled={searching} className="mx-1 rounded">
                {searching ?
                <div className="spinner-grow spinner-grow-sm mx-3" role="status">
                  <span className="sr-only"></span>
                </div> : "Search"
                }
              </button>
            )}
            <div className="mt-1">
              <input
                type="checkbox"
                checked={realTime}
                onChange={(event) => {
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
                      onClick={() => setLoading(true)}
                    >
                      <li className={`list-group-item ${styles.item}`}>
                        <img
                          src={hero.image.url}
                          alt="avatar"
                          className={`mx-3 ${styles.avatar}`}
                        ></img>
                        {hero.name}
                      </li>
                    </Link>
                  );
                })
              ) : (
                <li
                  className={`list-group-item text-center fs-5 ${styles.empty}`}
                >
                  <img src="/hulk.png" alt="hulk search" className="w-100" />
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
