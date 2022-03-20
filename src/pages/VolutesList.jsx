import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataService from '../API/DataService';
import Loader from '../components/Loader';
import { useFetching } from '../hooks/useFetching';

const VolutesList = () => {
  const [volutes, setVolutes] = useState([]);

  const router = useNavigate();

  const [fetchData, isDataLoading, dataError] = useFetching(async () => {
    const response = await DataService.getAll();
    setVolutes(Object.values(response.data.Valute));
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {dataError && <h1>Произошла ошибка {dataError}</h1>}
      {!isDataLoading ? (
        <table>
          <thead>
            <tr>
              <th colSpan='3'>Курсы валют к рублю</th>
            </tr>
            <tr>
              <th>Код валюты</th>
              <th>Значение в рублях</th>
              <th>Разница в процентах</th>
            </tr>
          </thead>
          <tbody>
            {volutes.map(volute => (
              <tr
                key={volute.ID}
                data-description={volute.Name}
                onClick={() => router('/volute/' + volute.CharCode)}
              >
                <td>{volute.NumCode}</td>
                <td>{volute.Value}</td>
                <td
                  className={volute.Value > volute.Previous ? 'green' : 'red'}
                >
                  {((volute.Value * 100) / volute.Previous - 100).toFixed(4)}
                  {volute.Value > volute.Previous ? ' ▲' : ' ▼'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default VolutesList;
