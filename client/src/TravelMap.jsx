import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import { visitedCountries, visitedStates } from './assets/travelData.js';
import './TravelMap.css';

// Add to index.html before </body>:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js"></script>

const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const US_TOPO_URL    = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

const ISO_NUM_TO_ALPHA3 = {
  4:"AFG",8:"ALB",12:"DZA",24:"AGO",32:"ARG",36:"AUS",40:"AUT",
  50:"BGD",56:"BEL",68:"BOL",76:"BRA",100:"BGR",116:"KHM",120:"CMR",
  124:"CAN",144:"LKA",152:"CHL",156:"CHN",170:"COL",180:"COD",
  188:"CRI",191:"HRV",192:"CUB",196:"CYP",203:"CZE",208:"DNK",
  218:"ECU",818:"EGY",231:"ETH",246:"FIN",250:"FRA",266:"GAB",
  276:"DEU",288:"GHA",300:"GRC",320:"GTM",332:"HTI",340:"HND",
  348:"HUN",356:"IND",360:"IDN",364:"IRN",368:"IRQ",372:"IRL",
  376:"ISR",380:"ITA",388:"JAM",392:"JPN",400:"JOR",398:"KAZ",
  404:"KEN",408:"PRK",410:"KOR",414:"KWT",418:"LAO",422:"LBN",
  430:"LBR",434:"LBY",442:"LUX",484:"MEX",504:"MAR",508:"MOZ",
  524:"NPL",528:"NLD",540:"NCL",554:"NZL",566:"NGA",578:"NOR",
  586:"PAK",591:"PAN",598:"PNG",600:"PRY",604:"PER",608:"PHL",
  616:"POL",620:"PRT",634:"QAT",642:"ROU",643:"RUS",
  682:"SAU",686:"SEN",694:"SLE",706:"SOM",710:"ZAF",724:"ESP",
  729:"SDN",752:"SWE",756:"CHE",760:"SYR",764:"THA",788:"TUN",
  792:"TUR",800:"UGA",804:"UKR",784:"ARE",826:"GBR",840:"USA",
  858:"URY",862:"VEN",704:"VNM",887:"YEM",894:"ZMB",716:"ZWE",
  499:"MNE",688:"SRB",703:"SVK",705:"SVN",233:"EST",428:"LVA",440:"LTU",
};

const FIPS_TO_POSTAL = {
  1:"AL",2:"AK",4:"AZ",5:"AR",6:"CA",8:"CO",9:"CT",10:"DE",
  11:"DC",12:"FL",13:"GA",15:"HI",16:"ID",17:"IL",18:"IN",19:"IA",
  20:"KS",21:"KY",22:"LA",23:"ME",24:"MD",25:"MA",26:"MI",27:"MN",
  28:"MS",29:"MO",30:"MT",31:"NE",32:"NV",33:"NH",34:"NJ",35:"NM",
  36:"NY",37:"NC",38:"ND",39:"OH",40:"OK",41:"OR",42:"PA",44:"RI",
  45:"SC",46:"SD",47:"TN",48:"TX",49:"UT",50:"VT",51:"VA",53:"WA",
  54:"WV",55:"WI",56:"WY",
};

const countryMap     = Object.fromEntries(visitedCountries.map(c => [c.id, c]));
const stateMap       = Object.fromEntries(visitedStates.map(s => [s.id, s]));
const totalCountries = visitedCountries.length;
const totalStates    = visitedStates.length;
const continentsSet  = new Set(visitedCountries.map(c => c.continent));

function drawLegend(svg, W, H) {
  const items = [
    { label: 'Not yet',    fill: '#f5c8d5' },
    { label: 'Visited',    fill: '#f997a9' },
    { label: 'Lived here', fill: '#cd496f' },
  ];
  const swW = 18, swH = 12, rowH = 24;
  const boxW = 118, boxH = items.length * rowH + 8;
  const bx = W - boxW - 18;
  const by = H - boxH - 16;

  const g = svg.append('g').attr('class', 'map-legend');
  g.append('rect')
    .attr('x', bx - 10).attr('y', by - 8)
    .attr('width', boxW + 20).attr('height', boxH + 16)
    .attr('rx', 10)
    .attr('fill', 'rgba(255,245,248,0.93)')
    .attr('stroke', '#f5c2cf').attr('stroke-width', 1);

  items.forEach(({ label, fill }, i) => {
    const y = by + i * rowH;
    g.append('rect')
      .attr('x', bx).attr('y', y)
      .attr('width', swW).attr('height', swH)
      .attr('rx', 3).attr('fill', fill)
      .attr('stroke', 'rgba(205,73,111,0.3)').attr('stroke-width', 0.5);
    g.append('text')
      .attr('x', bx + swW + 8).attr('y', y + swH / 2)
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#4a2035')
      .attr('font-family', 'Quicksand, sans-serif')
      .attr('font-size', 13)
      .text(label);
  });
}

function PlaceModal({ place, onClose }) {
  if (!place) return null;
  const slugs = place.newsletterSlugs || [];
  const slugToLabel = s =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div
      className="travel-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label={place.name}
    >
      <div className="travel-modal">
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">✕</button>
        <div className="modal-photo-wrapper">
          {place.photo
            ? <img src={place.photo} alt={place.name} className="modal-photo" />
            : <span className="modal-photo-placeholder">🗺️</span>}
        </div>
        <div className="modal-body">
          <span className={`modal-badge ${place.status}`}>
            {place.status === 'lived' ? '🏠 Lived here' : '✈️ Visited'}
          </span>
          <h2 className="modal-title">{place.name}</h2>
          {place.description && <p className="modal-description">{place.description}</p>}
          {slugs.length > 0 && (
            <div className="modal-newsletter-links">
              {slugs.map(slug => (
                <Link key={slug} to={`/study-abroad-newsletter/${slug}`} className="modal-newsletter-link">
                  📖 {slugToLabel(slug)}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TravelMap() {
  const svgRef = useRef(null);
  const [view, setView]                   = useState('world');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [topoWorld, setTopoWorld]         = useState(null);
  const [topoUS, setTopoUS]               = useState(null);

  useEffect(() => {
    Promise.all([d3.json(WORLD_TOPO_URL), d3.json(US_TOPO_URL)])
      .then(([world, us]) => { setTopoWorld(world); setTopoUS(us); });
  }, []);

  const getCountryStatus = useCallback(a3 => countryMap[a3]?.status || 'unvisited', []);
  const getStateStatus   = useCallback(p  => stateMap[p]?.status   || 'unvisited', []);

  // ── WORLD MAP ────────────────────────────────────────────────────
  useEffect(() => {
    if (!topoWorld || view !== 'world') return;
    const topojson = window.topojson;
    if (!topojson) { console.error('topojson not loaded'); return; }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = 960, H = 500;
    svg.attr('viewBox', `0 0 ${W} ${H}`);

    const proj = d3.geoNaturalEarth1().scale(153).translate([W / 2, H / 2]);
    const path = d3.geoPath().projection(proj);
    const countries = topojson.feature(topoWorld, topoWorld.objects.countries);

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#fde8ef').attr('rx', 12);
    svg.append('path')
      .datum(d3.geoGraticule()())
      .attr('d', path).attr('fill', 'none')
      .attr('stroke', '#f5c2cf').attr('stroke-width', 0.4);

    svg.append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', path)
      .attr('class', d => {
        const a3 = ISO_NUM_TO_ALPHA3[+d.id] || '';
        const status = getCountryStatus(a3);
        // USA is always clickable (leads to state map)
        return `country-path ${status}${a3 === 'USA' ? ' clickable' : ''}`;
      })
      .attr('stroke', '#fff').attr('stroke-width', 0.5)
      .style('cursor', d => {
        const a3 = ISO_NUM_TO_ALPHA3[+d.id] || '';
        const status = getCountryStatus(a3);
        return (status !== 'unvisited' || a3 === 'USA') ? 'pointer' : 'default';
      })
      .on('mouseover', function(event, d) {
        const a3 = ISO_NUM_TO_ALPHA3[+d.id] || '';
        const status = getCountryStatus(a3);
        if (status !== 'unvisited' || a3 === 'USA') d3.select(this).attr('opacity', 0.75);
      })
      .on('mouseout', function() { d3.select(this).attr('opacity', 1); })
      .on('click', (event, d) => {
        const a3 = ISO_NUM_TO_ALPHA3[+d.id] || '';
        if (a3 === 'USA') { setView('US'); return; }
        const status = getCountryStatus(a3);
        if (status === 'unvisited') return;
        setSelectedPlace(countryMap[a3]);
      });

    drawLegend(svg, W, H);
  }, [topoWorld, view, getCountryStatus]);

  // ── US STATE MAP ─────────────────────────────────────────────────
  useEffect(() => {
    if (!topoUS || view !== 'US') return;
    const topojson = window.topojson;
    if (!topojson) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = 960, H = 600;
    svg.attr('viewBox', `0 0 ${W} ${H}`);

    const proj = d3.geoAlbersUsa().scale(1280).translate([W / 2, H / 2]);
    const path = d3.geoPath().projection(proj);
    const states = topojson.feature(topoUS, topoUS.objects.states);

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#fde8ef').attr('rx', 12);

    svg.append('g')
      .selectAll('path')
      .data(states.features)
      .join('path')
      .attr('d', path)
      .attr('class', d => `state-path ${getStateStatus(FIPS_TO_POSTAL[+d.id])}`)
      .attr('stroke', '#fff').attr('stroke-width', 0.9)
      .style('cursor', d => getStateStatus(FIPS_TO_POSTAL[+d.id]) !== 'unvisited' ? 'pointer' : 'default')
      .on('mouseover', function(event, d) {
        if (getStateStatus(FIPS_TO_POSTAL[+d.id]) !== 'unvisited') d3.select(this).attr('opacity', 0.75);
      })
      .on('mouseout', function() { d3.select(this).attr('opacity', 1); })
      .on('click', (event, d) => {
        const postal = FIPS_TO_POSTAL[+d.id];
        if (getStateStatus(postal) === 'unvisited') return;
        setSelectedPlace(stateMap[postal]);
      });

    drawLegend(svg, W, H);
  }, [topoUS, view, getStateStatus]);

  const renderBreadcrumb = () => {
    if (view === 'world') return <span className="breadcrumb-current">World</span>;
    return (
      <>
        <button className="breadcrumb-btn" onClick={() => setView('world')}>← World map</button>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">United States</span>
      </>
    );
  };

  const hintText = () =>
    view === 'world'
      ? 'Click a highlighted country to explore it • Click the US to see individual states'
      : 'Click a highlighted state to explore it';

  return (
    <div className="travel-page">
      <div className="travel-page-header">
        <h1 className="travel-page-title">Places I've Been 🌍</h1>
        <p className="travel-page-description">
          Every place I've visited, lived, or fallen a little in love with —
          click a highlighted country to read more, or click the US to see individual states.
        </p>
      </div>

      <div className="travel-map-shell">
        <div className="map-top-bar">
          <div className="travel-breadcrumb">{renderBreadcrumb()}</div>
          <div className="travel-stats">
            <div className="travel-stat-pill"><strong>{totalCountries}</strong> countries</div>
            <div className="travel-stat-pill"><strong>{continentsSet.size}</strong> continents</div>
            <div className="travel-stat-pill"><strong>{totalStates}</strong> US states</div>
          </div>
        </div>
        <svg ref={svgRef} className="travel-svg" />
      </div>

      <p className="map-hint">{hintText()}</p>

      {selectedPlace && (
        <PlaceModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </div>
  );
}