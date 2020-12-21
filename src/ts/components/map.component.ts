/// <reference path="../../../node_modules/@types/leaflet/index.d.ts" />

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import * as Api from '../data/api.data';
import prettifyNumber from '../helpers/pretiffy.number.helper';

const ApiData = new Api.ApiData();

export default class Map {
  protected map: L.Map;

  private totalMarkers: L.LayerGroup;

  private per100Markers: L.LayerGroup;

  constructor(parent: HTMLElement) {
    const options = {
      worldCopyJump: true,
      minZoom: 3,
    };

    this.map = L.map(parent, options).setView([44.37256049721892, 2.039828672758004], 3);
    this.totalMarkers = L.layerGroup();
    this.per100Markers = L.layerGroup();
  }

  init() {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(this.map);

    this.update();
  }

  async update(): Promise<void> {
    const countries = await ApiData.getCovidCountries();

    const maxCases = Math.max.apply(
      null,
      countries.map((country) => country.cases),
    );

    await Promise.all(
      countries.map(async (country) => {
        const latlng = [country.countryInfo.lat, country.countryInfo.long];
        const maxMarkerSize = 70;
        const markerRadius = (country.cases / maxCases) * maxMarkerSize;

        L.circleMarker(latlng as L.LatLngExpression, {
          color: 'red',
          fillColor: 'red',
          radius: markerRadius,
        })
          .addTo(this.totalMarkers)
          .bindPopup(`<b>${country.country}</b><br> <b>Total cases:</b> ${prettifyNumber(country.cases)}`);
      }),
    );

    this.totalMarkers.addTo(this.map);
  }
}
