import SmartView from './smart-view.js';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { filter } from '../mock/utils/filter.js';
import { FilterType } from '../const.js';
import { StatisticFilter as StatisticFilter } from '../const.js';
import dayjs from 'dayjs';
import { movieListPresenter } from '../main.js';

console.log(Chart);
console.log(ChartDataLabels);

const createStatsTemplate = (movies, runtime, topGenre) => (
  `<section class="statistic visually-hidden">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${movies.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(runtime/60).toFixed(0)} <span class="statistic__item-description">h</span> ${runtime - (Math.floor(runtime/60).toFixed(0)*60)} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>
  </section>`
);

export default class StatsView extends SmartView {
  #currentFilter = 'all-time';

  #movies = [];

  set movies(movies) {
    this.#movies = [...movies];
  }

  get movies() {
    return filter[FilterType.HISTORY](this.#movies);
  }

  get template() {
    return createStatsTemplate(this.#movies, this.getTotalWatchingTime(), this.getTopGenre());
  }

  init() {
    this.showStatistic();
  }

  getTotalWatchingTime() {
    const wathedFilmsRuntime = this.movies.map((current) => Number((current.filmInfo.runtime).replace(/[^0-9]/g,'')));
    const totalWatchedRuntime = wathedFilmsRuntime.reduce((a, b) => a + b);
    this.getTopGenre();
    return totalWatchedRuntime;
  }

  getTopGenre() {
    console.log(this.movies);
    const wathedFilmsGenres = [].concat(...this.movies.map((current) => current.filmInfo.genre));
    const genreList = [...(new Set(wathedFilmsGenres))];
    const genreListArray = [];
    genreList.forEach((genreName) => {
      const array = [];
      wathedFilmsGenres.forEach((watchedGenre) => {
        if (watchedGenre === genreName) {
          array.push(watchedGenre);
        }
        return array;
      });
      genreListArray.push(array);
      this.genresListArray = genreListArray;
      return genreListArray;
    });
    const lengths = genreListArray.map((a)=> a.length);
    const topGenreIndex = lengths.indexOf(Math.max.apply(Math, lengths));
    const topGenre = genreListArray[topGenreIndex];
    return topGenre[0];
  }


  setStaticFilterChange() {
    this.element.querySelector('.statistic__filters').addEventListener('change', this.staticFilterChange.bind(this));
  }

  filterStatistic(filterName) {
    switch(filterName) {
      case StatisticFilter.TODAY:
      {
        this.movies = movieListPresenter.movies.filter((movie) => movie.userDetails.watching_date.isSame(dayjs(), 'day'));
        console.log(this.movies);
        break;
      }
      case StatisticFilter.WEEK:
      {
        this.movies = movieListPresenter.movies.filter((movie) => movie.userDetails.watching_date.isSame(dayjs(), 'week'));
        console.log(this.movies);
        break;
      }
      case StatisticFilter.MONTH:
      {
        this.movies = movieListPresenter.movies.filter((movie) => movie.userDetails.watching_date.isSame(dayjs(), 'month'));
        console.log(this.movies);
        break;
      }
      case StatisticFilter.YEAR:
      {
        this.movies = movieListPresenter.movies.filter((movie) => movie.userDetails.watching_date.isSame(dayjs(), 'year'));
        console.log(this.movies);
        break;
      }
      case StatisticFilter.ALL_TIME:
        this.movies = movieListPresenter.movies;
        console.log(this.movies);
        break;
    }
  }

  staticFilterChange(evt) {
    evt.preventDefault();
    this.filterStatistic(evt.target.value);
  }

  getGenreCount(genre) {
    let sameGenresLength;
    this.genresListArray.forEach((sameGenres) => {
      if (sameGenres[0] === genre) {
        sameGenresLength = sameGenres.length;
      }
    });

    return sameGenresLength;
  }

  showStatistic() {

    const BAR_HEIGHT = 50;
    const statisticCtx = document.querySelector('.statistic__chart');

    statisticCtx.height = BAR_HEIGHT * 5;

    const myChart = new Chart(statisticCtx, {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: ['Musical', 'Drama', 'Comedy', 'Cartoon', 'Western'],
        datasets: [{
          data: [this.getGenreCount('Musical'), this.getGenreCount('Drama'), this.getGenreCount('Comedy'), this.getGenreCount('Cartoon'), this.getGenreCount('Western')],
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
      },
    });
    this.setStaticFilterChange();
    return myChart;
  }
}
