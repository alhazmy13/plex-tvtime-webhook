import {config} from "../config";
import axios from 'axios';
import { load } from 'cheerio';
import TvTimeSearch from './models/search';
import Episode from './models/episode';
import Season from './models/season';
import Show from './models/show';

export default class TvTimeApi {
  /**
   * Search a show on TVTime
   * @param {string} showName
   * @returns {Promise<TvTimeSearch[]>}
   */
  static searchShow = async (showName: string): Promise<TvTimeSearch[]> => {
    try {
      let shows: TvTimeSearch[] = [];
      let url = `https://www.tvtime.com/search?q=${showName}&limit=20`;
      let result = await axios.get(url);
      const $ = load(result.data);

      $('.search-item').each((i, element) => {
        let filter = $(element).children('a').children("i").attr('class');
        if (filter && filter.includes("icon-tvst-genre-miniseeries")) {
          let title = $(element).children('a').children("strong").text();
          let idShow = $(element).children('a').attr('href');
          idShow = idShow?.slice(idShow.lastIndexOf("/") + 1);
          shows.push({ id: Number(idShow), showTitle: title })
        }
      });
      return shows;
    } catch (err) {
      return [];
    }
  };

  /**
   * Get a show on TVTime
   * @param {string} showName
   * @returns {Promise<Show | null>}
   */
  static getShow = async (serieId: number): Promise<Show | null> => {
    try {
      let infoShows: Show;
      let url = `https://www.tvtime.com/en/show/${serieId}`;
      let result = await axios.get(url);
      const page = load(result.data)

      const header = page('div.container-fluid div.heading-info')
      const info = page('div.show-nav')
      const seasons: Season[] = []

      page('div.seasons div.season-content').each((index, item) => {
        const divSeason = load(item)

        const name = divSeason('span[itemprop="name"]').text()

        const episodes: Episode[] = []

        divSeason('ul.episode-list li').each((index, li) => {
          const episode = load(li)

          const linkEpisode = episode('div.infos div.row a:first')
          const idEpisode = linkEpisode.attr('href')?.split('/')
          const nameEpisode = episode('div.infos div.row a span.episode-name').text().trim()
          const airEpisode = episode('div.infos div.row a span.episode-air-date').text().trim()
          const watchedBtn = episode('a.watched-btn')
          const episodeWatched = watchedBtn.hasClass('active')

          episodes.push({
            id: Number(idEpisode![5]),
            name: nameEpisode,
            airDate: airEpisode,
            watched: episodeWatched
          })
        })

        seasons.push({
          name: name,
          episodes: episodes
        })
      })

      infoShows = {
        id: serieId,
        name: header.children('h1').text().trim(),
        overview: info.children().find('div.overview').text().trim(),
        seasons: seasons
      }
      return infoShows;
    } catch (err) {
      return null;
    }
  }

  /**
   * Mark episode as watched
   * @param {number} episodeId
   * @returns {Promise<boolean>}
   */
  static markAsWatched = async (episodeId: number): Promise<boolean> => {
    try {
      let url = `https://www.tvtime.com/watched_episodes?episode_id=${episodeId}`;
      let result = await axios.put(url, {}, {
        headers: {
          Host: "www.tvtime.com",
          Cookie: `symfony=${config.tvtime.token.symfony}; tvstRemember=${config.tvtime.token.tvstRemember}`
        }
      }
      );
      return result.data && result.data.result == "OK";
    } catch (err) {
      return false;
    }
  };
}