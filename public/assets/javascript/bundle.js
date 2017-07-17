'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MapManager = function () {
  function MapManager(geojson, statusData, contact) {
    _classCallCheck(this, MapManager);

    //Initializing Map
    this.map = new L.map('map').setView([42.863, -74.752], 6.55);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy;<a href="https://carto.com/attribution">CARTO</a>. Interactivity by <a href="//actionblitz.org">ActionBlitz</a>'
    }).addTo(this.map);

    this.statusData = statusData;
    this.geojson = geojson;
    this.contact = contact;

    this.render();
  }

  /***
  * private method _renderBubble
  *
  */


  _createClass(MapManager, [{
    key: '_renderBubble',
    value: function _renderBubble(event) {

      var popup;
      var senator = event.target.options.statusData;
      var moreInfo = event.target.options.contact;

      var content = '<div>\n        <section className="senator-image-container">\n          <img src="' + senator.image + '" />\n        </section>\n        <section className="senator-info">\n          <div>' + senator.name + '</div>\n          <div>Party: ' + moreInfo.party + '</div>\n          <div>Senate District ' + senator.district + '</div>\n          <div class="' + (senator.status === 'FOR' ? 'votes-yes' : 'votes-no') + '">\n              ' + (senator.status === 'TARGET' ? 'High priority' : senator.status === 'FOR' ? 'Co-Sponsor' : 'No support') + '\n          </div>\n        </section>\n        <a href="' + moreInfo.contact + '" class="contact-link" target="_blank">Contact</button>\n      </div>';

      popup = L.popup({
        closeButton: true,
        className: 'senator-popup'
      });

      popup.setContent(content);
      event.target.bindPopup(popup).openPopup();
    }
  }, {
    key: '_onEachFeature',
    value: function _onEachFeature(feature, layer) {
      //
      // console.log(senators[feature.properties.NAME - 1].status)
      var that = this;

      var status = this.statusData[feature.properties.NAME - 1].status;

      // Create Circle Marker
      L.circleMarker(layer.getBounds().getCenter(), {
        radius: 7,
        fillColor: this._colorDistrict(feature),
        color: 'white',
        opacity: 1,
        fillOpacity: 0.7,

        //Data
        statusData: this.statusData[feature.properties.NAME - 1],
        contact: this.contact[feature.properties.NAME - 1]
      }).on({
        click: this._renderBubble.bind(this)
      }).addTo(this.map);

      layer.on({
        click: function click(e) {
          console.log("CLICKED ::: ", e);
          // this.map.fitBounds(layer.getBounds());
          window.location.hash = '#lat=' + e.latlng.lat + '&lon=' + e.latlng.lng;
        }
      });

      layer._leaflet_id = feature.id;
      // layer.on({
      // mouseover: handleMouseOver,
      // mouseout: handleMouseOut
      // });
    }
  }, {
    key: '_layerStyle',
    value: function _layerStyle() {
      return {
        fillColor: 'gray',
        fillOpacity: 0.01,
        color: 'gray',
        opacity: '1',
        weight: 1
      };
    }
  }, {
    key: '_chosenStyle',
    value: function _chosenStyle() {
      return {
        fillColor: 'green',
        fillOpacity: 0.5
      };
    }
  }, {
    key: '_resetLayerStyle',
    value: function _resetLayerStyle(layer) {
      layer.setStyle(this._layerStyle());
    }
  }, {
    key: '_colorDistrict',
    value: function _colorDistrict(district) {
      var status = this.statusData[district.properties.NAME - 1].status;

      switch (status) {
        case 'FOR':
          return '#1e90ff';
          break;
        case 'AGAINST':
          return '#FF4C50';
          break;
        case 'TARGET':
          return '#CC0004';
          break;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      //Call geojson
      this.districts = L.geoJSON(this.geojson, {
        style: this._layerStyle.bind(this),
        onEachFeature: this._onEachFeature.bind(this)
      });
      this.districts.addTo(this.map);
      this.districts.bringToBack();

      console.log(this.layers);
    }

    //FitBounds on the district

  }, {
    key: 'focusOnDistrict',
    value: function focusOnDistrict(latLng) {
      var target = leafletPip.pointInLayer(latLng, this.districts, true)[0];

      if (target) {
        this.map.fitBounds(target.getBounds(), { animate: false });
        this.districts.eachLayer(this._resetLayerStyle.bind(this));
        target.setStyle(this._chosenStyle());
        //Refresh whole map
      }
    }
  }]);

  return MapManager;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RepresentativeManager
 * Facilitates the retrieval of the user's Representative based on their Address
 **/
var RepresentativeManager = function () {
  function RepresentativeManager(map, status, contact) {
    _classCallCheck(this, RepresentativeManager);

    this.map = map;
    this.status = status;
    this.contact = contact;

    this.representativeContainer = $("#senator-info");

    //create listeners
    this.addEvents();
  }

  _createClass(RepresentativeManager, [{
    key: "addEvents",
    value: function addEvents() {
      var _this = this;

      //Close
      this.representativeContainer.on('click', "a.close", function () {
        return _this.representativeContainer.empty();
      });
    }
  }, {
    key: "showRepresentative",
    value: function showRepresentative(latLng) {
      this.target = leafletPip.pointInLayer(latLng, this.map.districts, true)[0];
      console.log("RepresentativeManager", this.target);

      this.render();
    }
  }, {
    key: "renderParties",
    value: function renderParties(parties) {
      var partyList = parties.split(',');
      var toString = partyList.map(function (i) {
        return "<li class='party " + i + "'><span>" + i + "</span></li>";
      }).join('');
      return "<ul class='parties'>" + toString + "</ul>";
    }
  }, {
    key: "renderThanks",
    value: function renderThanks(repToRender) {
      return "\n      <div>\n        <p class='status'>\n          " + (repToRender.status === "FOR" ? "Sen. " + repToRender.name + " is <strong>supportive</strong> of the New York Health Act (S4840). Call the senator to thank them!" : "Sen. " + repToRender.name + " is not yet supportive of the New York Health Act  (S4840). Call them to encourage and urge them to give their support to this important bill.") + "\n        </p>\n        <h4>Here's How</h4>\n        <h5>1. Call the senator at <i class=\"fa fa-phone\" aria-hidden=\"true\"></i> " + repToRender.phone + "</h5>\n        <h5>2. Thank them through their staff!</h5>\n        <p>The staffer will make sure that your message is sent to the senator.</p>\n        <sub>Sample Message</sub>\n        <blockquote>\n          Hi! My name is ______. I am a constituent of Sen. " + repToRender.name + " at zipcode _____. I am sending my thanks to the senator for supporting and co-sponsoring the New York Health Act (S4840).\n          Health care is a very important issue for me, and the senator's support means a lot. Thank you!\n        </blockquote>\n        <h5>3. Tell your friends to call!</h5>\n        <p>Share this page with your friends and urge them to call your senator!</p>\n      </div>\n    ";
    }
  }, {
    key: "renderUrge",
    value: function renderUrge(repToRender) {
      return "\n    <div>\n      <p class='status'>\n        " + (repToRender.status === "FOR" ? "Sen. " + repToRender.name + " is <strong>supportive</strong> of the New York Health Act (S4840). Call the senator to thank them!" : "Sen. " + repToRender.name + " is <strong class='not'>not yet supportive</strong> of the New York Health Act  (S4840). Call them to encourage and urge them to give their support to this important bill.") + "\n      </p>\n      <h4>Here's How</h4>\n      <h5>1. Call the senator at <i class=\"fa fa-phone\" aria-hidden=\"true\"></i> " + repToRender.phone + "</h5>\n      <h5>2. Talk to them about your support!</h5>\n      <p>You will most likely talk with a staffer. Tell them about your story. The staffer will make sure that your message is sent to the senator.</p>\n      <sub>Sample Message</sub>\n      <blockquote>\n        Hi! My name is ______. I am a constituent of Sen. " + repToRender.name + " at zipcode _____.\n        I am strongly urging the senator to support and co-sponsor the New York Health Act (S4840).\n        Health care is a very important issue for me, and the senator's support means a lot. Thank you!\n      </blockquote>\n      <h5>3. Tell your friends to call!</h5>\n      <p>Share this page with your friends and urge them to call your senator!</p>\n    </div>\n    ";
    }
  }, {
    key: "render",
    value: function render() {
      if (!this.target) return null;

      var districtNumber = parseInt(this.target.feature.properties.NAME);
      var repToRender = this.status.filter(function (i) {
        return i.district == districtNumber;
      })[0];
      var contactOfRep = this.contact.filter(function (i) {
        return i.district == districtNumber;
      })[0];

      console.log(repToRender, contactOfRep);
      this.representativeContainer.html("<div>\n        <a href=\"javascript: void(null)\" class='close'><i class=\"fa fa-times-circle-o\" aria-hidden=\"true\"></i></a>\n        <h5 class='your-senator'>Your State Senator</h5>\n        <div class='basic-info'>\n          <img src='" + contactOfRep.image + "' class='rep-pic' />\n          <h5>NY District " + repToRender.district + "</h5>\n          <h3>" + repToRender.name + "</h3>\n          <p>" + this.renderParties(contactOfRep.party) + "</p>\n        </div>\n        <div class='action-area'>\n          " + (repToRender.status === "FOR" ? this.renderThanks(repToRender) : this.renderUrge(repToRender)) + "\n        </div>\n        <div class='website'>\n          <a href='" + repToRender.contact + "' target='_blank'>More ways to contact <strong>Sen. " + repToRender.name + "</strong></a>\n        <div>\n       </div>");
    }
  }]);

  return RepresentativeManager;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Facilitates the search
*/

var SearchManager = function () {
  function SearchManager() {
    _classCallCheck(this, SearchManager);

    this.target = $("#form-area");
    this.addressForm = $("#form-area #address");

    this.searchSuggestionsContainer = $("#search-results");
    this.searchSuggestions = $("#search-results ul");
    this.chosenLocation = null;

    this.timeout = null;

    this.searchSuggestionsContainer.hide();
    this._startListener();
    this.render();
  }

  _createClass(SearchManager, [{
    key: "_startListener",
    value: function _startListener() {
      var _this = this;

      var that = this;

      // Listen to address changes
      this.addressForm.bind('keyup', function (ev) {
        var address = ev.target.value;

        clearTimeout(_this.timeout);
        _this.timeout = setTimeout(function () {
          //Filter the addresses
          $.getJSON('https://nominatim.openstreetmap.org/search/' + encodeURIComponent(address) + '?format=json', function (data) {
            that.searchSuggestionsContainer.show();
            _this.data = data;
            that.render();
          });
        }, 500);
      });

      this.target.find("form").on("submit", function () {
        return false;
      });

      //Listen to clicking of suggestions
      that.searchSuggestionsContainer.on("click", "a", function (ev) {
        console.log("Test");
        that.searchSuggestionsContainer.hide();
      });
    }
  }, {
    key: "render",
    value: function render() {
      this.searchSuggestions.empty();
      if (this.data) {
        this.searchSuggestions.append(this.data.slice(0, 10).map(function (item) {
          return "\n        <li>\n          <div class='suggestion' lon=\"" + item.lon + "\" lat=\"" + item.lat + "\">\n            <a href='#lon=" + item.lon + "&lat=" + item.lat + "'>" + item.display_name + "</a>\n          </div>\n        </li>";
        }));
      }
    }
  }]);

  return SearchManager;
}();
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StoriesListManager = function () {
  function StoriesListManager(geojson, statusData, contact, stories) {
    _classCallCheck(this, StoriesListManager);

    this.geojson = geojson;
    this.statusData = statusData;
    this.contact = contact;
    this.stories = stories;

    this.storiesList = $("#stories");
  }

  _createClass(StoriesListManager, [{
    key: "listNearbyStories",
    value: function listNearbyStories(latLng) {
      console.log("StoriesListManager", latLng);
    }
  }]);

  return StoriesListManager;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App(options) {
    _classCallCheck(this, App);

    this.Map = null;
    this.render();
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      //Loading data...
      var mapFetch = $.getJSON('/data/nys-senatemap.json');
      var senatorStatusFetch = $.getJSON('/data/status.json');
      var stateSenatorsInfo = $.getJSON('/data/state-senators.json');
      var storiesInfo = $.getJSON('/data/stories.json');
      var that = this;
      $.when(mapFetch, senatorStatusFetch, stateSenatorsInfo, storiesInfo).then(function (geojson, statusData, contact, stories) {
        that.Map = new MapManager(geojson[0], statusData[0], contact[0], stories[0]);
        that.StoryList = new StoriesListManager(geojson[0], statusData[0], contact[0], stories[0]);
        that.Search = new SearchManager();
        that.Rep = new RepresentativeManager(that.Map, statusData[0], contact[0]);
        that._listenToWindow();
      });
    }
  }, {
    key: '_listenToWindow',
    value: function _listenToWindow() {
      var _this = this;

      $(window).on('hashchange', function () {
        if (window.location.hash && window.location.hash.length > 0) {
          var hash = $.deparam(window.location.hash.substring(1));

          var latLng = new L.latLng(hash.lat, hash.lon);
          // Trigger various managers
          _this.StoryList.listNearbyStories(latLng);
          _this.Rep.showRepresentative(latLng);
          _this.Map.focusOnDistrict(latLng);
        }
      });
      $(window).trigger("hashchange");
    }
  }]);

  return App;
}();

window.AppManager = new App({});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNsYXNzZXMvbWFwLmpzIiwiY2xhc3Nlcy9yZXByZXNlbnRhdGl2ZS5qcyIsImNsYXNzZXMvc2VhcmNoLmpzIiwiY2xhc3Nlcy9zdG9yaWVzbGlzdC5qcyIsImFwcC5qcyJdLCJuYW1lcyI6WyJNYXBNYW5hZ2VyIiwiZ2VvanNvbiIsInN0YXR1c0RhdGEiLCJjb250YWN0IiwibWFwIiwiTCIsInNldFZpZXciLCJ0aWxlTGF5ZXIiLCJtYXhab29tIiwiYXR0cmlidXRpb24iLCJhZGRUbyIsInJlbmRlciIsImV2ZW50IiwicG9wdXAiLCJzZW5hdG9yIiwidGFyZ2V0Iiwib3B0aW9ucyIsIm1vcmVJbmZvIiwiY29udGVudCIsImltYWdlIiwibmFtZSIsInBhcnR5IiwiZGlzdHJpY3QiLCJzdGF0dXMiLCJjbG9zZUJ1dHRvbiIsImNsYXNzTmFtZSIsInNldENvbnRlbnQiLCJiaW5kUG9wdXAiLCJvcGVuUG9wdXAiLCJmZWF0dXJlIiwibGF5ZXIiLCJ0aGF0IiwicHJvcGVydGllcyIsIk5BTUUiLCJjaXJjbGVNYXJrZXIiLCJnZXRCb3VuZHMiLCJnZXRDZW50ZXIiLCJyYWRpdXMiLCJmaWxsQ29sb3IiLCJfY29sb3JEaXN0cmljdCIsImNvbG9yIiwib3BhY2l0eSIsImZpbGxPcGFjaXR5Iiwib24iLCJjbGljayIsIl9yZW5kZXJCdWJibGUiLCJiaW5kIiwiZSIsImNvbnNvbGUiLCJsb2ciLCJ3aW5kb3ciLCJsb2NhdGlvbiIsImhhc2giLCJsYXRsbmciLCJsYXQiLCJsbmciLCJfbGVhZmxldF9pZCIsImlkIiwid2VpZ2h0Iiwic2V0U3R5bGUiLCJfbGF5ZXJTdHlsZSIsImRpc3RyaWN0cyIsImdlb0pTT04iLCJzdHlsZSIsIm9uRWFjaEZlYXR1cmUiLCJfb25FYWNoRmVhdHVyZSIsImJyaW5nVG9CYWNrIiwibGF5ZXJzIiwibGF0TG5nIiwibGVhZmxldFBpcCIsInBvaW50SW5MYXllciIsImZpdEJvdW5kcyIsImFuaW1hdGUiLCJlYWNoTGF5ZXIiLCJfcmVzZXRMYXllclN0eWxlIiwiX2Nob3NlblN0eWxlIiwiUmVwcmVzZW50YXRpdmVNYW5hZ2VyIiwicmVwcmVzZW50YXRpdmVDb250YWluZXIiLCIkIiwiYWRkRXZlbnRzIiwiZW1wdHkiLCJwYXJ0aWVzIiwicGFydHlMaXN0Iiwic3BsaXQiLCJ0b1N0cmluZyIsImkiLCJqb2luIiwicmVwVG9SZW5kZXIiLCJwaG9uZSIsImRpc3RyaWN0TnVtYmVyIiwicGFyc2VJbnQiLCJmaWx0ZXIiLCJjb250YWN0T2ZSZXAiLCJodG1sIiwicmVuZGVyUGFydGllcyIsInJlbmRlclRoYW5rcyIsInJlbmRlclVyZ2UiLCJTZWFyY2hNYW5hZ2VyIiwiYWRkcmVzc0Zvcm0iLCJzZWFyY2hTdWdnZXN0aW9uc0NvbnRhaW5lciIsInNlYXJjaFN1Z2dlc3Rpb25zIiwiY2hvc2VuTG9jYXRpb24iLCJ0aW1lb3V0IiwiaGlkZSIsIl9zdGFydExpc3RlbmVyIiwiZXYiLCJhZGRyZXNzIiwidmFsdWUiLCJjbGVhclRpbWVvdXQiLCJzZXRUaW1lb3V0IiwiZ2V0SlNPTiIsImVuY29kZVVSSUNvbXBvbmVudCIsImRhdGEiLCJzaG93IiwiZmluZCIsImFwcGVuZCIsInNsaWNlIiwiaXRlbSIsImxvbiIsImRpc3BsYXlfbmFtZSIsIlN0b3JpZXNMaXN0TWFuYWdlciIsInN0b3JpZXMiLCJzdG9yaWVzTGlzdCIsIkFwcCIsIk1hcCIsIm1hcEZldGNoIiwic2VuYXRvclN0YXR1c0ZldGNoIiwic3RhdGVTZW5hdG9yc0luZm8iLCJzdG9yaWVzSW5mbyIsIndoZW4iLCJ0aGVuIiwiU3RvcnlMaXN0IiwiU2VhcmNoIiwiUmVwIiwiX2xpc3RlblRvV2luZG93IiwibGVuZ3RoIiwiZGVwYXJhbSIsInN1YnN0cmluZyIsImxpc3ROZWFyYnlTdG9yaWVzIiwic2hvd1JlcHJlc2VudGF0aXZlIiwiZm9jdXNPbkRpc3RyaWN0IiwidHJpZ2dlciIsIkFwcE1hbmFnZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUFNQTtBQUNKLHNCQUFZQyxPQUFaLEVBQXFCQyxV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QUFRLENBQVIsQ0FBbkQsQ0FBWDtBQUNBNEIsYUFBS3VHLGVBQUw7QUFDRCxPQVBEO0FBUUQ7OztzQ0FFaUI7QUFBQTs7QUFFaEJ4RCxRQUFFNUIsTUFBRixFQUFVUCxFQUFWLENBQWEsWUFBYixFQUEyQixZQUFJO0FBQzdCLFlBQUlPLE9BQU9DLFFBQVAsQ0FBZ0JDLElBQWhCLElBQXdCRixPQUFPQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQm1GLE1BQXJCLEdBQThCLENBQTFELEVBQ0E7QUFDRSxjQUFNbkYsT0FBTzBCLEVBQUUwRCxPQUFGLENBQVV0RixPQUFPQyxRQUFQLENBQWdCQyxJQUFoQixDQUFxQnFGLFNBQXJCLENBQStCLENBQS9CLENBQVYsQ0FBYjs7QUFFQSxjQUFNckUsU0FBUyxJQUFJL0QsRUFBRStELE1BQU4sQ0FBYWhCLEtBQUtFLEdBQWxCLEVBQXVCRixLQUFLa0UsR0FBNUIsQ0FBZjtBQUNBO0FBQ0EsZ0JBQUthLFNBQUwsQ0FBZU8saUJBQWYsQ0FBaUN0RSxNQUFqQztBQUNBLGdCQUFLaUUsR0FBTCxDQUFTTSxrQkFBVCxDQUE0QnZFLE1BQTVCO0FBQ0EsZ0JBQUt3RCxHQUFMLENBQVNnQixlQUFULENBQXlCeEUsTUFBekI7QUFDRDtBQUNGLE9BWEQ7QUFZQVUsUUFBRTVCLE1BQUYsRUFBVTJGLE9BQVYsQ0FBa0IsWUFBbEI7QUFDRDs7Ozs7O0FBR0gzRixPQUFPNEYsVUFBUCxHQUFvQixJQUFJbkIsR0FBSixDQUFRLEVBQVIsQ0FBcEIiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgTWFwTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKGdlb2pzb24sIHN0YXR1c0RhdGEsIGNvbnRhY3QpIHtcblxuICAgIC8vSW5pdGlhbGl6aW5nIE1hcFxuICAgIHRoaXMubWFwID0gbmV3IEwubWFwKCdtYXAnKS5zZXRWaWV3KFs0Mi44NjMsLTc0Ljc1Ml0sIDYuNTUpO1xuICAgIEwudGlsZUxheWVyKCdodHRwczovL2NhcnRvZGItYmFzZW1hcHMte3N9Lmdsb2JhbC5zc2wuZmFzdGx5Lm5ldC9saWdodF9hbGwve3p9L3t4fS97eX0ucG5nJywge1xuICAgICAgbWF4Wm9vbTogMTgsXG4gICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyA8YSBocmVmPVwiaHR0cDovL3d3dy5vcGVuc3RyZWV0bWFwLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiwgJmNvcHk7PGEgaHJlZj1cImh0dHBzOi8vY2FydG8uY29tL2F0dHJpYnV0aW9uXCI+Q0FSVE88L2E+LiBJbnRlcmFjdGl2aXR5IGJ5IDxhIGhyZWY9XCIvL2FjdGlvbmJsaXR6Lm9yZ1wiPkFjdGlvbkJsaXR6PC9hPidcbiAgICB9KS5hZGRUbyh0aGlzLm1hcCk7XG5cblxuICAgIHRoaXMuc3RhdHVzRGF0YSA9IHN0YXR1c0RhdGE7XG4gICAgdGhpcy5nZW9qc29uID0gZ2VvanNvbjtcbiAgICB0aGlzLmNvbnRhY3QgPSBjb250YWN0O1xuXG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIC8qKipcbiAgKiBwcml2YXRlIG1ldGhvZCBfcmVuZGVyQnViYmxlXG4gICpcbiAgKi9cbiAgX3JlbmRlckJ1YmJsZShldmVudCkge1xuXG4gICAgdmFyIHBvcHVwO1xuICAgIHZhciBzZW5hdG9yID0gZXZlbnQudGFyZ2V0Lm9wdGlvbnMuc3RhdHVzRGF0YTtcbiAgICB2YXIgbW9yZUluZm8gPSBldmVudC50YXJnZXQub3B0aW9ucy5jb250YWN0O1xuXG4gICAgdmFyIGNvbnRlbnQgPSAoXG4gICAgICBgPGRpdj5cbiAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwic2VuYXRvci1pbWFnZS1jb250YWluZXJcIj5cbiAgICAgICAgICA8aW1nIHNyYz1cIiR7c2VuYXRvci5pbWFnZX1cIiAvPlxuICAgICAgICA8L3NlY3Rpb24+XG4gICAgICAgIDxzZWN0aW9uIGNsYXNzTmFtZT1cInNlbmF0b3ItaW5mb1wiPlxuICAgICAgICAgIDxkaXY+JHtzZW5hdG9yLm5hbWV9PC9kaXY+XG4gICAgICAgICAgPGRpdj5QYXJ0eTogJHttb3JlSW5mby5wYXJ0eX08L2Rpdj5cbiAgICAgICAgICA8ZGl2PlNlbmF0ZSBEaXN0cmljdCAke3NlbmF0b3IuZGlzdHJpY3R9PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cIiR7KHNlbmF0b3Iuc3RhdHVzID09PSAnRk9SJykgPyAndm90ZXMteWVzJyA6ICd2b3Rlcy1ubyd9XCI+XG4gICAgICAgICAgICAgICR7c2VuYXRvci5zdGF0dXMgPT09ICdUQVJHRVQnID8gJ0hpZ2ggcHJpb3JpdHknIDogKHNlbmF0b3Iuc3RhdHVzID09PSAnRk9SJykgPyAnQ28tU3BvbnNvcicgOiAnTm8gc3VwcG9ydCd9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvc2VjdGlvbj5cbiAgICAgICAgPGEgaHJlZj1cIiR7bW9yZUluZm8uY29udGFjdH1cIiBjbGFzcz1cImNvbnRhY3QtbGlua1wiIHRhcmdldD1cIl9ibGFua1wiPkNvbnRhY3Q8L2J1dHRvbj5cbiAgICAgIDwvZGl2PmApO1xuXG4gICAgcG9wdXAgPSBMLnBvcHVwKHtcbiAgICAgIGNsb3NlQnV0dG9uOiB0cnVlLFxuICAgICAgY2xhc3NOYW1lOiAnc2VuYXRvci1wb3B1cCcsXG4gICAgIH0pO1xuXG4gICAgcG9wdXAuc2V0Q29udGVudChjb250ZW50KTtcbiAgICBldmVudC50YXJnZXQuYmluZFBvcHVwKHBvcHVwKS5vcGVuUG9wdXAoKTtcbiAgfVxuXG4gIF9vbkVhY2hGZWF0dXJlKGZlYXR1cmUsIGxheWVyKSB7XG4gICAgICAvL1xuICAgICAgLy8gY29uc29sZS5sb2coc2VuYXRvcnNbZmVhdHVyZS5wcm9wZXJ0aWVzLk5BTUUgLSAxXS5zdGF0dXMpXG4gICAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgICAgdmFyIHN0YXR1cyA9IHRoaXMuc3RhdHVzRGF0YVtmZWF0dXJlLnByb3BlcnRpZXMuTkFNRSAtIDFdLnN0YXR1cztcblxuICAgICAgLy8gQ3JlYXRlIENpcmNsZSBNYXJrZXJcbiAgICAgIEwuY2lyY2xlTWFya2VyKGxheWVyLmdldEJvdW5kcygpLmdldENlbnRlcigpLCB7XG4gICAgICAgIHJhZGl1czogNyxcbiAgICAgICAgZmlsbENvbG9yOiB0aGlzLl9jb2xvckRpc3RyaWN0KGZlYXR1cmUpLFxuICAgICAgICBjb2xvcjogJ3doaXRlJyxcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgZmlsbE9wYWNpdHk6IDAuNyxcblxuICAgICAgICAvL0RhdGFcbiAgICAgICAgc3RhdHVzRGF0YTogdGhpcy5zdGF0dXNEYXRhW2ZlYXR1cmUucHJvcGVydGllcy5OQU1FIC0gMV0sXG4gICAgICAgIGNvbnRhY3Q6IHRoaXMuY29udGFjdFtmZWF0dXJlLnByb3BlcnRpZXMuTkFNRSAtIDFdLFxuICAgICAgfSlcbiAgICAgIC5vbih7XG4gICAgICAgIGNsaWNrOiB0aGlzLl9yZW5kZXJCdWJibGUuYmluZCh0aGlzKSxcbiAgICAgIH0pLmFkZFRvKHRoaXMubWFwKTtcblxuXG4gICAgICBsYXllci5vbih7XG4gICAgICAgIGNsaWNrOiAoZSk9PntcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIkNMSUNLRUQgOjo6IFwiLCBlKTtcbiAgICAgICAgICAvLyB0aGlzLm1hcC5maXRCb3VuZHMobGF5ZXIuZ2V0Qm91bmRzKCkpO1xuICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gYCNsYXQ9JHtlLmxhdGxuZy5sYXR9Jmxvbj0ke2UubGF0bG5nLmxuZ31gXG4gICAgICAgIH1cbiAgICAgIH0pXG5cbiAgICAgIGxheWVyLl9sZWFmbGV0X2lkID0gZmVhdHVyZS5pZFxuICAgICAgLy8gbGF5ZXIub24oe1xuICAgICAgICAvLyBtb3VzZW92ZXI6IGhhbmRsZU1vdXNlT3ZlcixcbiAgICAgICAgLy8gbW91c2VvdXQ6IGhhbmRsZU1vdXNlT3V0XG4gICAgICAvLyB9KTtcbiAgICB9XG5cbiAgX2xheWVyU3R5bGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGxDb2xvcjogJ2dyYXknLFxuICAgICAgZmlsbE9wYWNpdHk6IDAuMDEsXG4gICAgICBjb2xvcjogJ2dyYXknLFxuICAgICAgb3BhY2l0eTogJzEnLFxuICAgICAgd2VpZ2h0OiAxXG4gICAgfTtcbiAgfVxuICBfY2hvc2VuU3R5bGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbGxDb2xvcjogJ2dyZWVuJyxcbiAgICAgIGZpbGxPcGFjaXR5OiAwLjVcbiAgICB9XG4gIH1cblxuICBfcmVzZXRMYXllclN0eWxlKGxheWVyKSB7XG4gICAgbGF5ZXIuc2V0U3R5bGUodGhpcy5fbGF5ZXJTdHlsZSgpKTtcbiAgfVxuXG4gIF9jb2xvckRpc3RyaWN0KGRpc3RyaWN0KSB7XG4gICAgdmFyIHN0YXR1cyA9IHRoaXMuc3RhdHVzRGF0YVtkaXN0cmljdC5wcm9wZXJ0aWVzLk5BTUUgLSAxXS5zdGF0dXM7XG5cbiAgICBzd2l0Y2goc3RhdHVzKSB7XG4gICAgICBjYXNlICdGT1InOlxuICAgICAgICByZXR1cm4gJyMxZTkwZmYnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ0FHQUlOU1QnOlxuICAgICAgICByZXR1cm4gJyNGRjRDNTAnO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ1RBUkdFVCc6XG4gICAgICAgIHJldHVybiAnI0NDMDAwNCc7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL0NhbGwgZ2VvanNvblxuICAgIHRoaXMuZGlzdHJpY3RzID0gTC5nZW9KU09OKHRoaXMuZ2VvanNvbiwge1xuICAgICAgc3R5bGU6IHRoaXMuX2xheWVyU3R5bGUuYmluZCh0aGlzKSxcbiAgICAgIG9uRWFjaEZlYXR1cmU6IHRoaXMuX29uRWFjaEZlYXR1cmUuYmluZCh0aGlzKVxuICAgIH0pXG4gICAgdGhpcy5kaXN0cmljdHMuYWRkVG8odGhpcy5tYXApO1xuICAgIHRoaXMuZGlzdHJpY3RzLmJyaW5nVG9CYWNrKCk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLmxheWVycyk7XG4gIH1cblxuICAvL0ZpdEJvdW5kcyBvbiB0aGUgZGlzdHJpY3RcbiAgZm9jdXNPbkRpc3RyaWN0KGxhdExuZykge1xuICAgIGNvbnN0IHRhcmdldCA9IGxlYWZsZXRQaXAucG9pbnRJbkxheWVyKGxhdExuZywgdGhpcy5kaXN0cmljdHMsIHRydWUpWzBdO1xuXG4gICAgaWYgKHRhcmdldCkge1xuICAgICAgdGhpcy5tYXAuZml0Qm91bmRzKHRhcmdldC5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcbiAgICAgIHRoaXMuZGlzdHJpY3RzLmVhY2hMYXllcih0aGlzLl9yZXNldExheWVyU3R5bGUuYmluZCh0aGlzKSk7XG4gICAgICB0YXJnZXQuc2V0U3R5bGUodGhpcy5fY2hvc2VuU3R5bGUoKSlcbiAgICAgIC8vUmVmcmVzaCB3aG9sZSBtYXBcbiAgICB9XG5cblxuXG4gIH1cbn1cbiIsIi8qKlxuICogUmVwcmVzZW50YXRpdmVNYW5hZ2VyXG4gKiBGYWNpbGl0YXRlcyB0aGUgcmV0cmlldmFsIG9mIHRoZSB1c2VyJ3MgUmVwcmVzZW50YXRpdmUgYmFzZWQgb24gdGhlaXIgQWRkcmVzc1xuICoqL1xuY2xhc3MgUmVwcmVzZW50YXRpdmVNYW5hZ2VyIHtcblxuICBjb25zdHJ1Y3RvcihtYXAsIHN0YXR1cywgY29udGFjdCkge1xuICAgIHRoaXMubWFwID0gbWFwO1xuICAgIHRoaXMuc3RhdHVzID0gc3RhdHVzO1xuICAgIHRoaXMuY29udGFjdCA9IGNvbnRhY3Q7XG5cbiAgICB0aGlzLnJlcHJlc2VudGF0aXZlQ29udGFpbmVyID0gJChcIiNzZW5hdG9yLWluZm9cIik7XG5cbiAgICAvL2NyZWF0ZSBsaXN0ZW5lcnNcbiAgICB0aGlzLmFkZEV2ZW50cygpO1xuICB9XG5cbiAgYWRkRXZlbnRzKCkge1xuICAgIC8vQ2xvc2VcbiAgICB0aGlzLnJlcHJlc2VudGF0aXZlQ29udGFpbmVyLm9uKCdjbGljaycsIFwiYS5jbG9zZVwiLCAoKSA9PiB0aGlzLnJlcHJlc2VudGF0aXZlQ29udGFpbmVyLmVtcHR5KCkpO1xuICB9XG5cbiAgc2hvd1JlcHJlc2VudGF0aXZlKGxhdExuZykge1xuICAgIHRoaXMudGFyZ2V0ID0gbGVhZmxldFBpcC5wb2ludEluTGF5ZXIobGF0TG5nLCB0aGlzLm1hcC5kaXN0cmljdHMsIHRydWUpWzBdO1xuICAgIGNvbnNvbGUubG9nKFwiUmVwcmVzZW50YXRpdmVNYW5hZ2VyXCIsIHRoaXMudGFyZ2V0KTtcblxuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXJQYXJ0aWVzKHBhcnRpZXMpIHtcbiAgICBjb25zdCBwYXJ0eUxpc3QgPSBwYXJ0aWVzLnNwbGl0KCcsJyk7XG4gICAgY29uc3QgdG9TdHJpbmcgPSBwYXJ0eUxpc3QubWFwKGk9PmA8bGkgY2xhc3M9J3BhcnR5ICR7aX0nPjxzcGFuPiR7aX08L3NwYW4+PC9saT5gKS5qb2luKCcnKTtcbiAgICByZXR1cm4gYDx1bCBjbGFzcz0ncGFydGllcyc+JHt0b1N0cmluZ308L3VsPmA7XG4gIH1cblxuICByZW5kZXJUaGFua3MocmVwVG9SZW5kZXIpIHtcbiAgICByZXR1cm4gYFxuICAgICAgPGRpdj5cbiAgICAgICAgPHAgY2xhc3M9J3N0YXR1cyc+XG4gICAgICAgICAgJHtyZXBUb1JlbmRlci5zdGF0dXMgPT09IFwiRk9SXCIgPyBgU2VuLiAke3JlcFRvUmVuZGVyLm5hbWV9IGlzIDxzdHJvbmc+c3VwcG9ydGl2ZTwvc3Ryb25nPiBvZiB0aGUgTmV3IFlvcmsgSGVhbHRoIEFjdCAoUzQ4NDApLiBDYWxsIHRoZSBzZW5hdG9yIHRvIHRoYW5rIHRoZW0hYFxuICAgICAgICAgICAgOiBgU2VuLiAke3JlcFRvUmVuZGVyLm5hbWV9IGlzIG5vdCB5ZXQgc3VwcG9ydGl2ZSBvZiB0aGUgTmV3IFlvcmsgSGVhbHRoIEFjdCAgKFM0ODQwKS4gQ2FsbCB0aGVtIHRvIGVuY291cmFnZSBhbmQgdXJnZSB0aGVtIHRvIGdpdmUgdGhlaXIgc3VwcG9ydCB0byB0aGlzIGltcG9ydGFudCBiaWxsLmB9XG4gICAgICAgIDwvcD5cbiAgICAgICAgPGg0PkhlcmUncyBIb3c8L2g0PlxuICAgICAgICA8aDU+MS4gQ2FsbCB0aGUgc2VuYXRvciBhdCA8aSBjbGFzcz1cImZhIGZhLXBob25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiAke3JlcFRvUmVuZGVyLnBob25lfTwvaDU+XG4gICAgICAgIDxoNT4yLiBUaGFuayB0aGVtIHRocm91Z2ggdGhlaXIgc3RhZmYhPC9oNT5cbiAgICAgICAgPHA+VGhlIHN0YWZmZXIgd2lsbCBtYWtlIHN1cmUgdGhhdCB5b3VyIG1lc3NhZ2UgaXMgc2VudCB0byB0aGUgc2VuYXRvci48L3A+XG4gICAgICAgIDxzdWI+U2FtcGxlIE1lc3NhZ2U8L3N1Yj5cbiAgICAgICAgPGJsb2NrcXVvdGU+XG4gICAgICAgICAgSGkhIE15IG5hbWUgaXMgX19fX19fLiBJIGFtIGEgY29uc3RpdHVlbnQgb2YgU2VuLiAke3JlcFRvUmVuZGVyLm5hbWV9IGF0IHppcGNvZGUgX19fX18uIEkgYW0gc2VuZGluZyBteSB0aGFua3MgdG8gdGhlIHNlbmF0b3IgZm9yIHN1cHBvcnRpbmcgYW5kIGNvLXNwb25zb3JpbmcgdGhlIE5ldyBZb3JrIEhlYWx0aCBBY3QgKFM0ODQwKS5cbiAgICAgICAgICBIZWFsdGggY2FyZSBpcyBhIHZlcnkgaW1wb3J0YW50IGlzc3VlIGZvciBtZSwgYW5kIHRoZSBzZW5hdG9yJ3Mgc3VwcG9ydCBtZWFucyBhIGxvdC4gVGhhbmsgeW91IVxuICAgICAgICA8L2Jsb2NrcXVvdGU+XG4gICAgICAgIDxoNT4zLiBUZWxsIHlvdXIgZnJpZW5kcyB0byBjYWxsITwvaDU+XG4gICAgICAgIDxwPlNoYXJlIHRoaXMgcGFnZSB3aXRoIHlvdXIgZnJpZW5kcyBhbmQgdXJnZSB0aGVtIHRvIGNhbGwgeW91ciBzZW5hdG9yITwvcD5cbiAgICAgIDwvZGl2PlxuICAgIGBcbiAgfVxuXG4gIHJlbmRlclVyZ2UocmVwVG9SZW5kZXIpIHtcbiAgICByZXR1cm4gYFxuICAgIDxkaXY+XG4gICAgICA8cCBjbGFzcz0nc3RhdHVzJz5cbiAgICAgICAgJHtyZXBUb1JlbmRlci5zdGF0dXMgPT09IFwiRk9SXCIgPyBgU2VuLiAke3JlcFRvUmVuZGVyLm5hbWV9IGlzIDxzdHJvbmc+c3VwcG9ydGl2ZTwvc3Ryb25nPiBvZiB0aGUgTmV3IFlvcmsgSGVhbHRoIEFjdCAoUzQ4NDApLiBDYWxsIHRoZSBzZW5hdG9yIHRvIHRoYW5rIHRoZW0hYFxuICAgICAgICAgIDogYFNlbi4gJHtyZXBUb1JlbmRlci5uYW1lfSBpcyA8c3Ryb25nIGNsYXNzPSdub3QnPm5vdCB5ZXQgc3VwcG9ydGl2ZTwvc3Ryb25nPiBvZiB0aGUgTmV3IFlvcmsgSGVhbHRoIEFjdCAgKFM0ODQwKS4gQ2FsbCB0aGVtIHRvIGVuY291cmFnZSBhbmQgdXJnZSB0aGVtIHRvIGdpdmUgdGhlaXIgc3VwcG9ydCB0byB0aGlzIGltcG9ydGFudCBiaWxsLmB9XG4gICAgICA8L3A+XG4gICAgICA8aDQ+SGVyZSdzIEhvdzwvaDQ+XG4gICAgICA8aDU+MS4gQ2FsbCB0aGUgc2VuYXRvciBhdCA8aSBjbGFzcz1cImZhIGZhLXBob25lXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiAke3JlcFRvUmVuZGVyLnBob25lfTwvaDU+XG4gICAgICA8aDU+Mi4gVGFsayB0byB0aGVtIGFib3V0IHlvdXIgc3VwcG9ydCE8L2g1PlxuICAgICAgPHA+WW91IHdpbGwgbW9zdCBsaWtlbHkgdGFsayB3aXRoIGEgc3RhZmZlci4gVGVsbCB0aGVtIGFib3V0IHlvdXIgc3RvcnkuIFRoZSBzdGFmZmVyIHdpbGwgbWFrZSBzdXJlIHRoYXQgeW91ciBtZXNzYWdlIGlzIHNlbnQgdG8gdGhlIHNlbmF0b3IuPC9wPlxuICAgICAgPHN1Yj5TYW1wbGUgTWVzc2FnZTwvc3ViPlxuICAgICAgPGJsb2NrcXVvdGU+XG4gICAgICAgIEhpISBNeSBuYW1lIGlzIF9fX19fXy4gSSBhbSBhIGNvbnN0aXR1ZW50IG9mIFNlbi4gJHtyZXBUb1JlbmRlci5uYW1lfSBhdCB6aXBjb2RlIF9fX19fLlxuICAgICAgICBJIGFtIHN0cm9uZ2x5IHVyZ2luZyB0aGUgc2VuYXRvciB0byBzdXBwb3J0IGFuZCBjby1zcG9uc29yIHRoZSBOZXcgWW9yayBIZWFsdGggQWN0IChTNDg0MCkuXG4gICAgICAgIEhlYWx0aCBjYXJlIGlzIGEgdmVyeSBpbXBvcnRhbnQgaXNzdWUgZm9yIG1lLCBhbmQgdGhlIHNlbmF0b3IncyBzdXBwb3J0IG1lYW5zIGEgbG90LiBUaGFuayB5b3UhXG4gICAgICA8L2Jsb2NrcXVvdGU+XG4gICAgICA8aDU+My4gVGVsbCB5b3VyIGZyaWVuZHMgdG8gY2FsbCE8L2g1PlxuICAgICAgPHA+U2hhcmUgdGhpcyBwYWdlIHdpdGggeW91ciBmcmllbmRzIGFuZCB1cmdlIHRoZW0gdG8gY2FsbCB5b3VyIHNlbmF0b3IhPC9wPlxuICAgIDwvZGl2PlxuICAgIGBcbiAgfVxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLnRhcmdldCkgcmV0dXJuIG51bGw7XG5cbiAgICBjb25zdCBkaXN0cmljdE51bWJlciA9IHBhcnNlSW50KHRoaXMudGFyZ2V0LmZlYXR1cmUucHJvcGVydGllcy5OQU1FKTtcbiAgICBjb25zdCByZXBUb1JlbmRlciA9IHRoaXMuc3RhdHVzLmZpbHRlcihpPT5pLmRpc3RyaWN0ID09IGRpc3RyaWN0TnVtYmVyKVswXTtcbiAgICBjb25zdCBjb250YWN0T2ZSZXAgPSB0aGlzLmNvbnRhY3QuZmlsdGVyKGk9PmkuZGlzdHJpY3QgPT0gZGlzdHJpY3ROdW1iZXIpWzBdO1xuXG4gICAgY29uc29sZS5sb2cocmVwVG9SZW5kZXIsIGNvbnRhY3RPZlJlcCk7XG4gICAgdGhpcy5yZXByZXNlbnRhdGl2ZUNvbnRhaW5lci5odG1sKFxuICAgICAgYDxkaXY+XG4gICAgICAgIDxhIGhyZWY9XCJqYXZhc2NyaXB0OiB2b2lkKG51bGwpXCIgY2xhc3M9J2Nsb3NlJz48aSBjbGFzcz1cImZhIGZhLXRpbWVzLWNpcmNsZS1vXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPjwvYT5cbiAgICAgICAgPGg1IGNsYXNzPSd5b3VyLXNlbmF0b3InPllvdXIgU3RhdGUgU2VuYXRvcjwvaDU+XG4gICAgICAgIDxkaXYgY2xhc3M9J2Jhc2ljLWluZm8nPlxuICAgICAgICAgIDxpbWcgc3JjPScke2NvbnRhY3RPZlJlcC5pbWFnZX0nIGNsYXNzPSdyZXAtcGljJyAvPlxuICAgICAgICAgIDxoNT5OWSBEaXN0cmljdCAke3JlcFRvUmVuZGVyLmRpc3RyaWN0fTwvaDU+XG4gICAgICAgICAgPGgzPiR7cmVwVG9SZW5kZXIubmFtZX08L2gzPlxuICAgICAgICAgIDxwPiR7dGhpcy5yZW5kZXJQYXJ0aWVzKGNvbnRhY3RPZlJlcC5wYXJ0eSl9PC9wPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz0nYWN0aW9uLWFyZWEnPlxuICAgICAgICAgICR7cmVwVG9SZW5kZXIuc3RhdHVzID09PSBcIkZPUlwiID8gdGhpcy5yZW5kZXJUaGFua3MocmVwVG9SZW5kZXIpIDogdGhpcy5yZW5kZXJVcmdlKHJlcFRvUmVuZGVyKSB9XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPSd3ZWJzaXRlJz5cbiAgICAgICAgICA8YSBocmVmPScke3JlcFRvUmVuZGVyLmNvbnRhY3R9JyB0YXJnZXQ9J19ibGFuayc+TW9yZSB3YXlzIHRvIGNvbnRhY3QgPHN0cm9uZz5TZW4uICR7cmVwVG9SZW5kZXIubmFtZX08L3N0cm9uZz48L2E+XG4gICAgICAgIDxkaXY+XG4gICAgICAgPC9kaXY+YFxuICAgICk7XG4gIH1cblxufVxuIiwiLyoqXG4qIEZhY2lsaXRhdGVzIHRoZSBzZWFyY2hcbiovXG5cbmNsYXNzIFNlYXJjaE1hbmFnZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGFyZ2V0ID0gJChcIiNmb3JtLWFyZWFcIik7XG4gICAgdGhpcy5hZGRyZXNzRm9ybSA9ICQoXCIjZm9ybS1hcmVhICNhZGRyZXNzXCIpO1xuXG4gICAgdGhpcy5zZWFyY2hTdWdnZXN0aW9uc0NvbnRhaW5lciA9ICQoXCIjc2VhcmNoLXJlc3VsdHNcIik7XG4gICAgdGhpcy5zZWFyY2hTdWdnZXN0aW9ucyA9ICQoXCIjc2VhcmNoLXJlc3VsdHMgdWxcIik7XG4gICAgdGhpcy5jaG9zZW5Mb2NhdGlvbiA9IG51bGw7XG5cbiAgICB0aGlzLnRpbWVvdXQgPSBudWxsO1xuXG4gICAgdGhpcy5zZWFyY2hTdWdnZXN0aW9uc0NvbnRhaW5lci5oaWRlKCk7XG4gICAgdGhpcy5fc3RhcnRMaXN0ZW5lcigpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBfc3RhcnRMaXN0ZW5lcigpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcblxuICAgIC8vIExpc3RlbiB0byBhZGRyZXNzIGNoYW5nZXNcbiAgICB0aGlzLmFkZHJlc3NGb3JtLmJpbmQoJ2tleXVwJywgKGV2KT0+e1xuICAgICAgY29uc3QgYWRkcmVzcyA9IGV2LnRhcmdldC52YWx1ZTtcblxuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dCk7XG4gICAgICB0aGlzLnRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgIC8vRmlsdGVyIHRoZSBhZGRyZXNzZXNcbiAgICAgICAgJC5nZXRKU09OKCdodHRwczovL25vbWluYXRpbS5vcGVuc3RyZWV0bWFwLm9yZy9zZWFyY2gvJyArIGVuY29kZVVSSUNvbXBvbmVudChhZGRyZXNzKSArICc/Zm9ybWF0PWpzb24nLFxuICAgICAgICAoZGF0YSkgPT4ge1xuICAgICAgICAgIHRoYXQuc2VhcmNoU3VnZ2VzdGlvbnNDb250YWluZXIuc2hvdygpO1xuICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgdGhhdC5yZW5kZXIoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LCA1MDApO1xuICAgIH0pXG5cbiAgICB0aGlzLnRhcmdldC5maW5kKFwiZm9ybVwiKS5vbihcInN1Ym1pdFwiLCAoKSA9PnsgcmV0dXJuIGZhbHNlOyB9KTtcblxuICAgIC8vTGlzdGVuIHRvIGNsaWNraW5nIG9mIHN1Z2dlc3Rpb25zXG4gICAgdGhhdC5zZWFyY2hTdWdnZXN0aW9uc0NvbnRhaW5lci5vbihcImNsaWNrXCIsIFwiYVwiLCAoZXYpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVGVzdFwiKTtcbiAgICAgIHRoYXQuc2VhcmNoU3VnZ2VzdGlvbnNDb250YWluZXIuaGlkZSgpO1xuICAgIH0pXG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy5zZWFyY2hTdWdnZXN0aW9ucy5lbXB0eSgpO1xuICAgIGlmICh0aGlzLmRhdGEpIHtcbiAgICAgIHRoaXMuc2VhcmNoU3VnZ2VzdGlvbnMuYXBwZW5kKFxuICAgICAgICB0aGlzLmRhdGEuc2xpY2UoMCwxMCkubWFwKChpdGVtKT0+YFxuICAgICAgICA8bGk+XG4gICAgICAgICAgPGRpdiBjbGFzcz0nc3VnZ2VzdGlvbicgbG9uPVwiJHtpdGVtLmxvbn1cIiBsYXQ9XCIke2l0ZW0ubGF0fVwiPlxuICAgICAgICAgICAgPGEgaHJlZj0nI2xvbj0ke2l0ZW0ubG9ufSZsYXQ9JHtpdGVtLmxhdH0nPiR7aXRlbS5kaXNwbGF5X25hbWV9PC9hPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2xpPmApXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG59XG4iLCJjbGFzcyBTdG9yaWVzTGlzdE1hbmFnZXIge1xuICBjb25zdHJ1Y3RvcihnZW9qc29uLCBzdGF0dXNEYXRhLCBjb250YWN0LCBzdG9yaWVzKSB7XG4gICAgdGhpcy5nZW9qc29uID0gZ2VvanNvbjtcbiAgICB0aGlzLnN0YXR1c0RhdGEgPSBzdGF0dXNEYXRhO1xuICAgIHRoaXMuY29udGFjdCA9IGNvbnRhY3Q7XG4gICAgdGhpcy5zdG9yaWVzID0gc3RvcmllcztcblxuICAgIHRoaXMuc3Rvcmllc0xpc3QgPSAkKFwiI3N0b3JpZXNcIik7XG4gIH1cblxuICBsaXN0TmVhcmJ5U3RvcmllcyhsYXRMbmcpIHtcbiAgICBjb25zb2xlLmxvZyhcIlN0b3JpZXNMaXN0TWFuYWdlclwiLCBsYXRMbmcpO1xuICB9XG59XG4iLCJcbmNsYXNzIEFwcCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLk1hcCA9IG51bGw7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICAvL0xvYWRpbmcgZGF0YS4uLlxuICAgIHZhciBtYXBGZXRjaCA9ICQuZ2V0SlNPTignL2RhdGEvbnlzLXNlbmF0ZW1hcC5qc29uJyk7XG4gICAgdmFyIHNlbmF0b3JTdGF0dXNGZXRjaCA9ICQuZ2V0SlNPTignL2RhdGEvc3RhdHVzLmpzb24nKTtcbiAgICB2YXIgc3RhdGVTZW5hdG9yc0luZm8gPSAkLmdldEpTT04oJy9kYXRhL3N0YXRlLXNlbmF0b3JzLmpzb24nKTtcbiAgICB2YXIgc3Rvcmllc0luZm8gPSAkLmdldEpTT04oJy9kYXRhL3N0b3JpZXMuanNvbicpO1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAkLndoZW4obWFwRmV0Y2gsIHNlbmF0b3JTdGF0dXNGZXRjaCwgc3RhdGVTZW5hdG9yc0luZm8sIHN0b3JpZXNJbmZvKS50aGVuKFxuICAgICAgKGdlb2pzb24sIHN0YXR1c0RhdGEsIGNvbnRhY3QsIHN0b3JpZXMpPT57XG4gICAgICB0aGF0Lk1hcCA9IG5ldyBNYXBNYW5hZ2VyKGdlb2pzb25bMF0sIHN0YXR1c0RhdGFbMF0sIGNvbnRhY3RbMF0sIHN0b3JpZXNbMF0pO1xuICAgICAgdGhhdC5TdG9yeUxpc3QgPSBuZXcgU3Rvcmllc0xpc3RNYW5hZ2VyKGdlb2pzb25bMF0sIHN0YXR1c0RhdGFbMF0sIGNvbnRhY3RbMF0sIHN0b3JpZXNbMF0pO1xuICAgICAgdGhhdC5TZWFyY2ggPSBuZXcgU2VhcmNoTWFuYWdlcigpO1xuICAgICAgdGhhdC5SZXAgPSBuZXcgUmVwcmVzZW50YXRpdmVNYW5hZ2VyKHRoYXQuTWFwLCBzdGF0dXNEYXRhWzBdLCBjb250YWN0WzBdKTtcbiAgICAgIHRoYXQuX2xpc3RlblRvV2luZG93KCk7XG4gICAgfSk7XG4gIH1cblxuICBfbGlzdGVuVG9XaW5kb3coKSB7XG5cbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCAoKT0+e1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5oYXNoICYmIHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDApXG4gICAgICB7XG4gICAgICAgIGNvbnN0IGhhc2ggPSAkLmRlcGFyYW0od2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpKTtcblxuICAgICAgICBjb25zdCBsYXRMbmcgPSBuZXcgTC5sYXRMbmcoaGFzaC5sYXQsIGhhc2gubG9uKTtcbiAgICAgICAgLy8gVHJpZ2dlciB2YXJpb3VzIG1hbmFnZXJzXG4gICAgICAgIHRoaXMuU3RvcnlMaXN0Lmxpc3ROZWFyYnlTdG9yaWVzKGxhdExuZyk7XG4gICAgICAgIHRoaXMuUmVwLnNob3dSZXByZXNlbnRhdGl2ZShsYXRMbmcpO1xuICAgICAgICB0aGlzLk1hcC5mb2N1c09uRGlzdHJpY3QobGF0TG5nKVxuICAgICAgfVxuICAgIH0pO1xuICAgICQod2luZG93KS50cmlnZ2VyKFwiaGFzaGNoYW5nZVwiKTtcbiAgfVxufVxuXG53aW5kb3cuQXBwTWFuYWdlciA9IG5ldyBBcHAoe30pO1xuIl19
