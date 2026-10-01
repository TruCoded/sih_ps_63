import hero from '@/assets/antarctica-hero.jpg';
import ocean from '@/assets/southern-ocean.jpg';
import station from '@/assets/polar-station.jpg';
import field from '@/assets/field-notes.jpg';

export const images = { hero, ocean, station, field };

export const records = [
  { id: 'npdc', type: 'Data portal', region: 'All regions', title: 'National Polar Data Centre', description: 'Discover polar datasets, station observations and research records at their authoritative source.', source: 'NCPOR / NPDC', url: 'https://npdc.ncpor.res.in/npdc/homepage.action', access: 'Source access terms apply', image: station },
  { id: 'cruise', type: 'Expedition records', region: 'Southern Ocean', title: 'Cruise summaries', description: 'Explore voyage objectives, ships, dates and reports through the official cruise index.', source: 'NCPOR / NPDC', url: 'https://npdc.ncpor.res.in/npdc/cruiseSummary.jsp', access: 'See source for access', image: ocean },
  { id: 'directory', type: 'Research directory', region: 'Antarctica', title: 'Polar Directory', description: 'Find expedition, project, technical report and contributor information.', source: 'NCPOR Polar Directory', url: 'https://data.ncpor.res.in/PolarDirectory/home', access: 'See source for access', image: field },
  { id: 'stations', type: 'Observations', region: 'Antarctica', title: 'Station observations', description: 'Access available observations and station information from India’s polar research network.', source: 'NCPOR', url: 'https://data.ncpor.res.in/', access: 'See source for access', image: station },
  { id: 'programme', type: 'Programme', region: 'Southern Ocean', title: 'Southern Ocean programme', description: 'Read about ocean research, expeditions and scientific work from the official programme page.', source: 'NCPOR', url: 'https://www.ncpor.res.in/pages/display/270-southern-ocean', access: 'Public programme page', image: ocean },
  { id: 'news', type: 'News & activities', region: 'All regions', title: 'NCPOR news archive', description: 'Follow institutional updates, activities and expedition announcements.', source: 'NCPOR', url: 'https://ncpor.res.in/news/archive/page%3A1?day=&month=05&year=', access: 'Public archive', image: field },
];

export function pageHead(title: string, description: string) {
  return { meta: [
    { title: `${title} — PolarConnect` },
    { name: 'description', content: description },
    { property: 'og:title', content: `${title} — PolarConnect` },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] };
}
