import VoluteItem from '../pages/VoluteItem';
import VolutesList from '../pages/VolutesList';

export const routes = [
  { path: '/', element: <VolutesList /> },
  { path: '/volute/:CharCode', element: <VoluteItem /> },
];
