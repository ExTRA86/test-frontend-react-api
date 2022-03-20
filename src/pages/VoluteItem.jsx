import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DataService from '../API/DataService';
import Loader from '../components/Loader';
import { useFetching } from '../hooks/useFetching';

const VoluteItem = () => {
  const [currentVolute, setCurrentVolute] = useState([]);

  let currentUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';
  let volute = [];
  const params = useParams();
  const router = useNavigate();

  const [fetchVolute, isVoluteLoading, voluteError] = useFetching(async n => {
    if (n > 0) {
      const response = await DataService.getCurrent(currentUrl);
      currentUrl = response.data.PreviousURL;
      volute.push(response.data.Valute[params.CharCode]);
      volute[volute.length - 1].Date = response.data.Date.slice(0, 10);
      fetchVolute(n - 1);
    }
    setCurrentVolute(volute);
  });

  useEffect(() => {
    fetchVolute(10);
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {voluteError && <h1>Произошла ошибка {voluteError}</h1>}
      {currentVolute.length > 9 ? (
        <div>
          <table className='table__item'>
            <thead>
              <tr>
                <th colSpan='4'>
                  Курс {currentVolute[0].Name} ({currentVolute[0].CharCode}) к
                  рублю
                </th>
              </tr>
              <tr>
                <th>Код валюты</th>
                <th>Значение в рублях</th>
                <th>Разница в процентах</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {currentVolute.map(volute => (
                <tr key={volute.Date}>
                  <td>{volute.NumCode}</td>
                  <td>{volute.Value}</td>
                  <td
                    className={volute.Value > volute.Previous ? 'green' : 'red'}
                  >
                    {((volute.Value * 100) / volute.Previous - 100).toFixed(4)}
                    {volute.Value > volute.Previous ? ' ▲' : ' ▼'}
                  </td>
                  <td>{volute.Date}</td>
                </tr>
              ))}
              <tr className='table__tr-button'>
                <th></th>
                <th></th>
                <th></th>
                <th>
                  <button onClick={() => router('/')}>Назад</button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default VoluteItem;
