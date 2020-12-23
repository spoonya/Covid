/// <reference path="../../../node_modules/@types/leaflet/index.d.ts" />

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as Api from '../data/api.data';
import prettifyNumber from '../helpers/pretiffy.number.helper';

interface FeatureProps {
  FIPS: String;
  ISO2: String;
  ISO3: String;
  UN: String;
  NAME: String;
  AREA: String;
  POP2005: String;
  REGION: String;
  SUBREGION: String;
  LON: Number;
  LAT: Number;
  units: String;
  count: String;
  saturation: Number;
}

interface Geometry {
  type: String;
  coordinates: [number, number][];
}

interface Feature {
  type: String;
  properties: FeatureProps;
  geometry: Geometry;
}

interface FeatureLayer extends L.Layer {
  feature: any;
}

const ApiData = new Api.ApiData();

export default class Map {
  protected map: L.Map;

  private borderLayer: L.GeoJSON;

  constructor(parent: HTMLElement) {
    const options = {
      worldCopyJump: true,
      minZoom: 3,
    };

    this.map = L.map(parent, options).setView([44.37256049721892, 2.039828672758004], 3);

    this.borderLayer = L.geoJSON();

    this.borderLayer.options.style = (borderFeature) => {
      const fillColor = `hsl(${borderFeature?.properties.saturation}, 100%, 50%)`;

      return {
        color: 'white',
        fillColor,
      };
    };

    this.borderLayer.options.onEachFeature = (borderFeature, layer) => {
      const popupText = `<b>Name:</b> ${borderFeature.properties.NAME}<br><b>${borderFeature.properties.units}:</b> ${borderFeature.properties.count}`;

      layer.bindPopup(popupText);
    };
  }

  async init() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(this.map);

    const countries = await ApiData.getCovidCountries();
    const req = await fetch('/static/borders.json');
    const borders = await req.json();

    borders.features = borders.features.filter((feature: Feature) => {
      const countryInfo = countries.filter((countryObj) => countryObj.countryInfo.iso3 === feature.properties.ISO3)[0];
      return !!countryInfo;
    });

    this.borderLayer.addData(borders);

    this.borderLayer.addTo(this.map);
    this.update();

    document.addEventListener('changedata', this.update.bind(this));
  }

  async update(): Promise<void> {
    const rate = window.localStorage.getItem('rate');
    const period = window.localStorage.getItem('period');

    let units = rate === 'ABS' ? 'cases' : 'cases per 100k people';
    if (period === 'LAST') units = `new ${units}`;

    const casesKey = period === 'ALL' ? 'cases' : 'todayCases';

    const countries = await ApiData.getCovidCountries();
    const data = countries.map((item) => {
      let value = item[casesKey];

      if (rate === '100K' && item.population !== 0) value = Math.ceil((value * 10e5) / item.population) / 10 || 0;
      if (item.population === 0) value = 0;

      return {
        name: item.country,
        iso3: item.countryInfo.iso3,
        value,
      };
    });

    const maxCases = Math.log1p(
      Math.max.apply(
        null,
        data.map((country) => country.value),
      ),
    );

    this.borderLayer.eachLayer((layer) => {
      const currentLayer = layer as FeatureLayer;
      const countryName = currentLayer.feature.properties.ISO3;
      const country = data.filter((countryObj) => countryObj.iso3 === countryName)[0];

      const saturation = 100 - (Math.log1p(country.value) / maxCases) * 100;
      const popupText = `
      <b>Country: </b>${currentLayer.feature.properties.NAME}<br>
      <b>${units}: </b> ${prettifyNumber(country.value)}
      `;

      (layer as L.Path).setStyle({
        color: 'white',
        fillColor: `hsl(${saturation}, 100%, 50%)`,
      });
      layer.unbindPopup();
      layer.bindPopup(popupText);
    });
  }
}
