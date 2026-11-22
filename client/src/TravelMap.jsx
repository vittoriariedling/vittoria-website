import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import * as d3 from 'd3';
import useApi from './useApi';
import PageStatus from './PageStatus';
import { usePage } from './site/context';
import { Confetti, Flower, G, Sprig } from './garden/shapes';
import { TravelGardenLeft, TravelGardenRight } from './garden/scenes';
import { ISO_NUM_TO_CODE, NAME_TO_CODE } from './geo';
import './TravelMap.css';

/** Two-letter country code for a world-atlas feature. */
const codeOf = (d) => ISO_NUM_TO_CODE[+d.id] || NAME_TO_CODE[d.properties?.name] || '';

// topojson is loaded from a <script> tag in index.html (window.topojson).

const WORLD_TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
const US_TOPO_URL    = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';

// Sunset-garden map palette. Land fills per status live in TravelMap.css
// (keep them in sync with the legend colors here).
const MAP = {
  sea: '#fbefeb',          // --paper
  graticule: '#efdcd7',
  border: '#fbefeb',
  legend: [
    { label: 'Not yet',    fill: '#ead6d0' },
    { label: 'Visited',    fill: '#859eb5' },
    { label: 'Lived here', fill: '#c27b65' },
  ],
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

/** A small preview of a linked newsletter: photo, date, title and the first lines. */
function NewsletterClip({ slug, post, label }) {
  const to = `/study-abroad-newsletter/${slug}`;
  if (!post) {
    // Still loading (or not published): fall back to a simple link.
    return <Link to={to} className="tag-pill modal-newsletter-link">{label}</Link>;
  }
  return (
    <Link to={to} className="newsletter-clip">
      {post.previewImage?.src ? (
        <img src={post.previewImage.src} alt="" className="newsletter-clip-photo" loading="lazy" />
      ) : <span className="newsletter-clip-photo" aria-hidden="true" />}
      <span className="newsletter-clip-body">
        {post.date && <span className="newsletter-clip-date">{post.date}</span>}
        <span className="newsletter-clip-title">{post.title}</span>
        {post.previewText && <span className="newsletter-clip-text">{post.previewText}</span>}
        <span className="newsletter-clip-more">Read it →</span>
      </span>
    </Link>
  );
}

function PlaceModal({ place, posts, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const slugs = place.newsletterSlugs || [];
  const slugToLabel = s =>
    s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <div
      className="travel-modal-backdrop"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true" aria-label={place.name}
    >
      <div className="travel-modal paper">
        <button type="button" className="modal-close-btn btn-round" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {place.photo ? (
          <div className="modal-photo-wrapper photo-frame">
            <img src={place.photo} alt={place.name} className="modal-photo" />
          </div>
        ) : (
          <div className={`modal-photo-wrapper modal-photo-placeholder ${place.status}`} aria-hidden="true">
            <svg viewBox="0 0 320 120" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
              <Sprig x={70} y={116} length={96} angle={-72} leaves={5} leafLen={26} fill={G.sage} stem={3} />
              <Flower x={160} y={60} r={30} fill={G.coral} seed={7} />
              <Sprig x={250} y={116} length={90} angle={-108} leaves={5} leafLen={24} fill={G.blue} stem={3} />
              <Confetti items={[[112, 30, 6, G.sand, 10], [214, 26, 5, G.blue, 0, 4], [204, 98, 5, G.coral, 20]]} />
            </svg>
          </div>
        )}

        <div className="modal-body">
          <span className={`modal-badge ${place.status}`}>
            {place.status === 'lived' ? 'Lived here' : 'Visited'}
          </span>
          <h2 className="modal-title">{place.name}</h2>
          {place.description && <p className="modal-description">{place.description}</p>}
          {slugs.length > 0 && (
            <div className="modal-newsletter">
              <span className="eyebrow">From the newsletter</span>
              <div className="modal-newsletter-links">
                {slugs.map(slug => (
                  <NewsletterClip key={slug} slug={slug} post={posts?.[slug]} label={slugToLabel(slug)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TravelGarden() {
  return (
    <svg className="garden travel-garden" viewBox="0 0 260 300" aria-hidden="true" focusable="false">
      <Sprig x={200} y={290} length={200} angle={-100} leaves={7} leafLen={44} fill={G.blue} stem={4} />
      <Sprig x={150} y={296} length={140} angle={-62} leaves={5} leafLen={40} fill={G.sage} stem={4} />
      <Flower x={214} y={92} r={30} fill={G.coral} seed={4} />
      <Flower x={118} y={182} r={14} fill={G.sand} center={G.sand} seeds={G.sand} seed={2} />
      <Confetti items={[[86, 110, 7, G.coral, 10, 4], [244, 200, 6, G.sand, 0]]} />
    </svg>
  );
}

export default function TravelMap() {
  const svgRef = useRef(null);
  const [view, setView]                   = useState('world');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [topoWorld, setTopoWorld]         = useState(null);
  const [topoUS, setTopoUS]               = useState(null);
  const { title, intro } = usePage('travel');

  // Visited places come from the API: { countries: [...], states: [...] }
  const { data: places, loading: placesLoading, error: placesError } = useApi('/api/places');
  // Newsletter summaries, so a place's popup can preview the issues linked to it.
  const { data: postList } = useApi('/api/posts');
  const postsBySlug = useMemo(() => Object.fromEntries((postList ?? []).map(p => [p.slug, p])), [postList]);
  const { countryMap, stateMap, totalCountries, totalStates, totalContinents } = useMemo(() => {
    const countries = places?.countries ?? [];
    const states = places?.states ?? [];
    return {
      countryMap: Object.fromEntries(countries.map(c => [c.id, c])),
      stateMap: Object.fromEntries(states.map(s => [s.id, s])),
      totalCountries: countries.length,
      totalStates: states.length,
      totalContinents: new Set(countries.map(c => c.continent).filter(Boolean)).size,
    };
  }, [places]);

  useEffect(() => {
    Promise.all([d3.json(WORLD_TOPO_URL), d3.json(US_TOPO_URL)])
      .then(([world, us]) => { setTopoWorld(world); setTopoUS(us); });
  }, []);

  const getCountryStatus = useCallback(code => countryMap[code]?.status || 'unvisited', [countryMap]);
  const getStateStatus   = useCallback(p  => stateMap[p]?.status   || 'unvisited', [stateMap]);

  // ── WORLD MAP ────────────────────────────────────────────────────
  useEffect(() => {
    if (!topoWorld || !places || view !== 'world') return;
    const topojson = window.topojson;
    if (!topojson) { console.error('topojson not loaded'); return; }

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = 960, H = 500;
    svg.attr('viewBox', `0 0 ${W} ${H}`);

    const proj = d3.geoNaturalEarth1().scale(153).translate([W / 2, H / 2]);
    const path = d3.geoPath().projection(proj);
    const countries = topojson.feature(topoWorld, topoWorld.objects.countries);

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', MAP.sea);
    svg.append('path')
      .datum(d3.geoGraticule()())
      .attr('d', path).attr('fill', 'none')
      .attr('stroke', MAP.graticule).attr('stroke-width', 0.6);

    svg.append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', path)
      .attr('class', d => {
        const code = codeOf(d);
        const status = getCountryStatus(code);
        // USA is always clickable (leads to state map)
        return `country-path ${status}${code === 'US' ? ' clickable' : ''}`;
      })
      .attr('stroke', MAP.border).attr('stroke-width', 0.6)
      .style('cursor', d => {
        const code = codeOf(d);
        const status = getCountryStatus(code);
        return (status !== 'unvisited' || code === 'US') ? 'pointer' : 'default';
      })
      .on('mouseover', function(event, d) {
        const code = codeOf(d);
        const status = getCountryStatus(code);
        if (status !== 'unvisited' || code === 'US') d3.select(this).classed('hover', true);
      })
      .on('mouseout', function() { d3.select(this).classed('hover', false); })
      .on('click', (event, d) => {
        const code = codeOf(d);
        if (code === 'US') { setView('US'); return; }
        const status = getCountryStatus(code);
        if (status === 'unvisited') return;
        setSelectedPlace(countryMap[code]);
      });

  }, [topoWorld, places, view, getCountryStatus, countryMap]);

  // ── US STATE MAP ─────────────────────────────────────────────────
  useEffect(() => {
    if (!topoUS || !places || view !== 'US') return;
    const topojson = window.topojson;
    if (!topojson) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const W = 960, H = 600;
    svg.attr('viewBox', `0 0 ${W} ${H}`);

    const proj = d3.geoAlbersUsa().scale(1280).translate([W / 2, H / 2]);
    const path = d3.geoPath().projection(proj);
    const states = topojson.feature(topoUS, topoUS.objects.states);

    svg.append('rect').attr('width', W).attr('height', H).attr('fill', MAP.sea);

    svg.append('g')
      .selectAll('path')
      .data(states.features)
      .join('path')
      .attr('d', path)
      .attr('class', d => `state-path ${getStateStatus(FIPS_TO_POSTAL[+d.id])}`)
      .attr('stroke', MAP.border).attr('stroke-width', 1)
      .style('cursor', d => getStateStatus(FIPS_TO_POSTAL[+d.id]) !== 'unvisited' ? 'pointer' : 'default')
      .on('mouseover', function(event, d) {
        if (getStateStatus(FIPS_TO_POSTAL[+d.id]) !== 'unvisited') d3.select(this).classed('hover', true);
      })
      .on('mouseout', function() { d3.select(this).classed('hover', false); })
      .on('click', (event, d) => {
        const postal = FIPS_TO_POSTAL[+d.id];
        if (getStateStatus(postal) === 'unvisited') return;
        setSelectedPlace(stateMap[postal]);
      });

  }, [topoUS, places, view, getStateStatus, stateMap]);

  const closeModal = useCallback(() => setSelectedPlace(null), []);

  const renderBreadcrumb = () => {
    if (view === 'world') return <span className="breadcrumb-current">World</span>;
    return (
      <>
        <button type="button" className="breadcrumb-btn" onClick={() => setView('world')}>← World map</button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">United States</span>
      </>
    );
  };

  const hintText = () =>
    view === 'world'
      ? 'Click a highlighted country to explore it • Click the US to see individual states'
      : 'Click a highlighted state to explore it';

  return (
    <div className="page travel-page">
      <TravelGarden />
      <TravelGardenLeft />
      <TravelGardenRight />

      <div className="page-inner">
        {title && <h1 className="page-title">{title}</h1>}
        {intro && <p className="page-intro">{intro}</p>}

        <div className="travel-map-shell paper">
          <div className="map-top-bar">
            <div className="travel-breadcrumb">{renderBreadcrumb()}</div>
            <div className="travel-stats">
              <div className="travel-stat-pill"><strong>{places ? totalCountries : '–'}</strong> countries</div>
              <div className="travel-stat-pill"><strong>{places ? totalContinents : '–'}</strong> continents</div>
              <div className="travel-stat-pill"><strong>{places ? totalStates : '–'}</strong> US states</div>
            </div>
          </div>
          {placesLoading && <PageStatus loading message="Loading the map…" />}
          {placesError && <PageStatus message="Couldn't load the map right now. Please try again later." />}
          {/* Always mounted so the D3 effects have a node to draw into. */}
          <svg ref={svgRef} className="travel-svg" style={places ? undefined : { display: 'none' }} />
          {places && (
            <div className="map-bottom-bar">
              <ul className="map-legend" aria-label="Legend">
                {MAP.legend.map(({ label, fill }) => (
                  <li key={label}><span className="map-legend-swatch" style={{ background: fill }} />{label}</li>
                ))}
              </ul>
              <p className="map-hint">{hintText()}</p>
            </div>
          )}
        </div>
      </div>

      {selectedPlace && <PlaceModal place={selectedPlace} posts={postsBySlug} onClose={closeModal} />}
    </div>
  );
}
