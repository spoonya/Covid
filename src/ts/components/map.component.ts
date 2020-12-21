/// <reference path="../../../node_modules/@types/leaflet/index.d.ts" />

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as Api from '../data/api.data';
import REQUESTS from '../constants/api.requests.const';
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

  init() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(this.map);

    this.update();
  }

  async update(): Promise<void> {
    this.borderLayer.clearLayers();

    const countries = await ApiData.getCovidCountries(REQUESTS.countries);

    const maxCases = Math.log2(
      Math.max.apply(
        null,
        countries.map((country) => country.cases),
      ),
    );

    const req = await fetch('/static/borders.json');
    const borders = await req.json();

    borders.features
      .filter((feature: Feature) => {
        const countryInfo = countries.filter(
          (countryObj) => countryObj.countryInfo.iso3 === feature.properties.ISO3,
        )[0];
        return !!countryInfo;
      })
      .forEach((feature: Feature) => {
        const countryInfo = countries.filter(
          (countryObj) => countryObj.countryInfo.iso3 === feature.properties.ISO3,
        )[0];

        feature.properties.units = 'Cases';
        feature.properties.count = prettifyNumber(countryInfo.cases);
        feature.properties.saturation = 100 - (Math.log2(countryInfo.cases) / maxCases) * 100;
      });

    this.borderLayer.addData(borders);

    this.borderLayer.addTo(this.map);
  }
}
