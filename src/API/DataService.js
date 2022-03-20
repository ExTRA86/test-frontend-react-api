import axios from 'axios';

export default class DataService {
  static async getAll() {
    const response = await axios.get(
      `https://www.cbr-xml-daily.ru/daily_json.js`,
    );
    return response;
  }

  static async getCurrent(currentUrl) {
    const response = await axios.get(currentUrl);
    return response;
  }
}
