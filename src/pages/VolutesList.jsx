import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataService from '../API/DataService';
import Loader from '../components/Loader';
import { useFetching } from '../hooks/useFetching';

const VolutesList = () => {
  const [volutes, setVolutes] = useState([]);
  const [mouseLocation, setMouseLocation] = useState({ x: 0, y: 0 });
  const [isTooltipShown, setIsTooltipShown] = useState(false);
  const [description, setDescription] = useState('');

  const router = useNavigate();

  const [fetchData, isDataLoading, dataError] = useFetching(async () => {
    const response = await DataService.getAll();
    setVolutes(Object.values(response.data.Valute));
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const voluteHover = (event, name) => {
    setDescription(name);
    setMouseLocation({
      x: event.pageX,
      y: event.pageY + 25,
    });
    setIsTooltipShown(true);
  };

  const voluteLeave = () => {
    setIsTooltipShown(false);
  };

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
                onClick={() => router('/volute/' + volute.CharCode)}
                onMouseMove={e => voluteHover(e, volute.Name)}
                onMouseLeave={voluteLeave}
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
      <div
        className='tooltip'
        style={{
          display: isTooltipShown ? 'block' : 'none',
          top: mouseLocation.y,
          left: mouseLocation.x,
        }}
      >
        {description}
      </div>
    </div>
  );
};

export default VolutesList;
