---
layout: default
title: Been
permalink: /been/
map_page: true
---

<script id="travel-data" type="application/json">{{ site.data.travel | jsonify }}</script>

<div id="main" role="main" class="travel-page">
  <section class="travel-hero">
    <div class="row">
      <div class="large-12 columns">
        <div class="travel-hero-copy">
          <h1>Been</h1>
          <p>
            Dieser Bereich ist mein offenes Reisearchiv. Statt eine geschlossene App zu nutzen,
            halte ich hier sichtbar fest, in welchen Laendern und US-Bundesstaaten ich schon war,
            wo ich gelebt habe und was spaeter noch auf meine Wunschliste kommt.
          </p>
          <p>
            Eine visuelle Sammlung von Aufenthalten, Reisen und Wunschzielen, die mit der Zeit
            weiterwaechst und meine persoenlichen Wege sichtbar macht.
          </p>

          <div class="travel-color-chips">
            <span class="travel-chip"><span class="travel-chip-swatch" style="background:#0f081e;"></span>Lived</span>
            <span class="travel-chip"><span class="travel-chip-swatch" style="background:#e013da;"></span>Been</span>
            <span class="travel-chip"><span class="travel-chip-swatch" style="background:#4d6594;"></span>Wish</span>
            <span class="travel-chip"><span class="travel-chip-swatch" style="background:#cbd1e5;"></span>Not been</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="travel-body">
    <div class="row">
      <div class="large-12 columns">
        <div class="travel-panel">
          <h3>Travel Snapshot</h3>
          <p>Eine persoenliche Reisekarte mit meinen bisherigen Aufenthalten, besuchten Orten und Zielen, die ich irgendwann noch entdecken moechte.</p>

          <div class="travel-stat-grid">
            <div class="travel-stat-card">
              <span class="travel-stat-label">Countries Visited</span>
              <span class="travel-stat-value" id="travel-stat-countries">0</span>
            </div>
            <div class="travel-stat-card">
              <span class="travel-stat-label">Wish List</span>
              <span class="travel-stat-value" id="travel-stat-wish">0</span>
            </div>
            <div class="travel-stat-card">
              <span class="travel-stat-label">US States Visited</span>
              <span class="travel-stat-value" id="travel-stat-us">0</span>
            </div>
            <div class="travel-stat-card">
              <span class="travel-stat-label">Places Lived</span>
              <span class="travel-stat-value" id="travel-stat-lived">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="large-12 columns">
        <div class="travel-panel travel-map-card">
          <h3>World Map</h3>
          <p>Die Weltkarte zeigt auf einen Blick, wo ich schon war, wo ich gelebt habe und welche Orte noch auf meiner Wunschliste stehen.</p>

          <div class="travel-map-frame">
            <div
              id="world-map-container"
              class="travel-inline-map travel-inline-map--world"
              data-map-url="{{ '/assets/maps/world.svg' | relative_url }}">
            </div>
          </div>
        </div>

        <div class="travel-panel">
          <h4>Map Detail</h4>
          <div class="travel-hover-card" id="travel-hover-card">
            <div class="travel-hover-label">Aktuell</div>
            <div class="travel-hover-name" id="travel-hover-name">Bewege die Maus ueber ein Land oder einen US-Staat</div>
            <div class="travel-hover-meta">
              <span id="travel-hover-type">Ort</span>
              <span class="travel-hover-dot"></span>
              <span id="travel-hover-status">Status erscheint hier</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="large-7 columns">
        <div class="travel-panel travel-map-card">
          <h3>United States Detail</h3>
          <p>Die USA bekommt einen eigenen Detailbereich, damit besuchte und bewohnte Bundesstaaten genauer sichtbar werden als nur in der Weltkarte.</p>

          <div class="travel-map-frame">
            <div
              id="us-map-container"
              class="travel-inline-map travel-inline-map--us"
              data-map-url="{{ '/assets/maps/us-states.svg' | relative_url }}">
            </div>
          </div>
        </div>
      </div>

      <div class="large-5 columns">
        <div class="travel-status-lists">
          <div class="travel-status-box">
            <h4>Countries Lived</h4>
            <ul class="travel-list">
              {% for entry in site.data.travel.countries.lived %}
              <li><span>{{ entry.name }}</span><span class="travel-code">{{ entry.code }}</span></li>
              {% endfor %}
            </ul>
          </div>

          <div class="travel-status-box">
            <h4>Countries Been</h4>
            <ul class="travel-list">
              {% for entry in site.data.travel.countries.been %}
              <li><span>{{ entry.name }}</span><span class="travel-code">{{ entry.code }}</span></li>
              {% endfor %}
            </ul>
          </div>

          <div class="travel-status-box">
            <h4>Countries Wish</h4>
            <ul class="travel-list">
              {% for entry in site.data.travel.countries.wish %}
              <li><span>{{ entry.name }}</span><span class="travel-code">{{ entry.code }}</span></li>
              {% endfor %}
            </ul>
          </div>

          <div class="travel-status-box">
            <h4>US States Lived</h4>
            <ul class="travel-list">
              {% for entry in site.data.travel.us_states.lived %}
              <li><span>{{ entry.name }}</span><span class="travel-code">{{ entry.code }}</span></li>
              {% endfor %}
            </ul>
          </div>

          <div class="travel-status-box">
            <h4>US States Been</h4>
            <ul class="travel-list">
              {% for entry in site.data.travel.us_states.been %}
              <li><span>{{ entry.name }}</span><span class="travel-code">{{ entry.code }}</span></li>
              {% endfor %}
            </ul>
          </div>
        </div>

        <div class="travel-panel">
          <h4>Travel Notes</h4>
          <p>
            Reisen bedeutet fuer mich mehr als Orte abzuhaken. Manche Ziele sind kurze Stopps,
            andere bleiben durch laengere Aufenthalte besonders praegend.
          </p>
          <p class="travel-source-note">
            Diese Karte sammelt genau diese Spuren: gelebte Orte, besuchte Orte und Ziele, die
            noch offen auf meiner Wunschliste stehen.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>
