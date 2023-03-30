
import axios from 'axios';
import settings from '../index.js';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.settings = settings;
  }

  async fetchGallery() {
    const axiosOptions = {
      method: 'get',
      url: this.settings.apiUrl,
      params: {
        key: this.settings.apiKey,
        q: `${this.searchQuery}`,
        image_type: this.settings.imageType,
        orientation: this.settings.orientation,
        safesearch: this.settings.safeSearch,
        page: `${this.page}`,
        per_page: `${this.settings.perPage}`,
      },
    };
    try {
      const response = await axios(axiosOptions);
      const data = response.data;
      this.incrementPage();
      return data;
    } catch (error) {
      console.error(error);
    }
    
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  resetEndOfHits() {
    this.endOfHits = false;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}