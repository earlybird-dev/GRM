"use strict";
require([
  "esri/config",
  "esri/Map",
  "esri/views/MapView",
  // Locate your geolocation
  "esri/widgets/Locate",
  // Add the Basemap Toggle
  "esri/widgets/BasemapToggle",
  // Add a feature layer
  "esri/layers/FeatureLayer",
  // Display a pie chart in popups
  "esri/popup/content/support/ChartMediaInfoValue",
  "esri/popup/content/PieChartMediaInfo",
  "esri/popup/content/MediaContent",
], function (
  esriConfig,
  Map,
  MapView,
  Locate,
  BasemapToggle,
  FeatureLayer,
  ChartMediaInfoValue,
  PieChartMediaInfo,
  MediaContent
) {
  esriConfig.apiKey =
    "AAPK30b010ce8ade409994e766674699b35aGy8-P5kdFrGF0OancFBdXjLEV6HiCsd0jxVTU5Usgps-AXiWwRgN8cj-1jdzD4r8";

  // SECTION: Create a map and map view
  // Ref: https://developers.arcgis.com/javascript/latest/display-a-map/
  // Map: A map defines the layers that need to be displayed.
  const map = new Map({
    // Basemap layer
    basemap: "arcgis-navigation",
  });

  const CENTER_POINT = [21.81, 12.36];
  const GLOBAL_ZOOM = 1.7;

  const view = new MapView({
    // Map: A map defines the layers that need to be displayed.
    map: map,
    center: CENTER_POINT, // Average x,y coordinates
    // center: [-118.80543, 34.027], //Longitude, latitude

    zoom: GLOBAL_ZOOM,
    // zoom: 13,
    // scale: 72223.819286

    // Set the container property to map-view to display the contents of the map.
    container: "map-view",

    // The MapView also supports a number of touch events such as click and double-click. You can use these events to change the position of the map or to find features in layers.
    constraints: {
      snapToZoom: false,
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        // Disables the dock button from the popup
        buttonEnabled: false,
        // Ignore the default sizes that trigger responsive docking
        breakpoint: false,
      },
    },
  });

  // SECTION: Locate your geolocation
  // Ref: https://developers.arcgis.com/javascript/latest/display-your-location/
  const locate = new Locate({
    view: view,
    useHeadingEnabled: false,
    goToOverride: function (view, options) {
      //   options.target.zoom = 13;
      options.target.scale = 77777;
      return view.goTo(options.target);
    },
  });
  view.ui.add(locate, "top-left"); // Add to the view

  // SECTION: Toggle between basemaps
  // Ref: https://developers.arcgis.com/javascript/latest/change-the-basemap-layer/
  // An easy way to enable selection between two basemaps is to use the Basemap Toggle widget. Use the widget to toggle between arcgis-navigation and arcgis-imagery basemaps.
  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "arcgis-imagery",
    label: "Toggle Between Basemaps",
  });
  view.ui.add(basemapToggle, "bottom-left"); // Add to the view

  // SECTION: GRM projects feature layer (points)
  // Ref: https://developers.arcgis.com/javascript/latest/style-a-feature-layer/
  // Style project feature layer
  const projectMarkers = {
    type: "simple",
    symbol: {
      type: "picture-marker",
      url: "https://i.ibb.co/JHfPVcL/leaf.png",
      width: "20px",
      height: "20px",
      xoffset: "4px",
    },
  };

  const projectLabels = {
    symbol: {
      type: "text",
      color: "#FFFFFF",
      haloColor: "#145374",
      haloSize: "2px",
      font: {
        size: "10px",
        family: "Noto Sans",
        style: "italic",
        weight: "normal",
      },
    },

    labelPlacement: "above-center",
    labelExpressionInfo: {
      expression: "$feature.Proj_Code",
    },
  };

  // SECTION: Display popup
  // Ref: https://developers.arcgis.com/javascript/latest/display-a-pop-up/
  // Ref: https://developers.arcgis.com/javascript/latest/sample-code/popup-multipleelements/
  // Ref: https://developers.arcgis.com/javascript/latest/api-reference/esri-popup-content-PieChartMediaInfo.html
  // Create a new PieChart to display within the PopupTemplate
  // Create the ChartMediaInfoValue
  let pieChartValue = new ChartMediaInfoValue({
    fields: ["Men_Trained", "Women_Trained"],
    normalizeField: null,
    tooltipField: "<field name>",
  });

  // Create the PieChartMediaInfo media type
  let pieChart = new PieChartMediaInfo({
    title: "<b>People Trained</b>",
    caption: "By Gender",
    value: pieChartValue,
  });

  // Create the MediaContent
  let piechartElement = new MediaContent({
    mediaInfos: [pieChart],
  });

  const tableProjectPopup = {
    title: "{Proj_Status} Project by {Organisation}",
    content: [
      {
        // You can also set a descriptive text element. This element
        // uses an attribute from the featurelayer which displays a
        // sentence giving the total amount of trees value within a
        // specified census block. Text elements can only be set within the content.
        type: "text", // TextContentElement
        text: "{Description}",
      },
      {
        // It is also possible to set the fieldInfos outside of the content
        // directly in the popupTemplate. If no fieldInfos is specifically set
        // in the content, it defaults to whatever may be set within the popupTemplate.
        type: "fields",
        fieldInfos: [
          {
            fieldName: "Nation",
            label: "Nation",
          },
          {
            fieldName: "Project_Value",
            label: "Project Value",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "DirectBeneficiaries_HH",
            label: "Direct Beneficiaries",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "InDirectBeneficiaries_HH",
            label: "Indirect Beneficiaries",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B12001_calc_numNeverE",
            label: "People that Never Married",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B12001_calc_numDivorcedE",
            label: "People Divorced",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
        ],
      },
      piechartElement,
      {
        // You can set a media element within the popup as well. This
        // can be either an image or a chart. You specify this within
        // the mediaInfos. The following creates a pie chart in addition
        // to two separate images. The chart is also set up to work with
        // related tables. Similar to text elements, media can only be set within the content.
        type: "media", // MediaContentElement
        mediaInfos: [
          {
            // title: "<b>Logo</b>",
            type: "image",
            // caption: "logo",
            value: {
              sourceURL:
                "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
            },
          },
        ],
      },
    ],
  };

  // Point Clustering
  // Ref: https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster/
  // Ref: https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster-filter-slider/
  const haloColor = "#373837";
  const color = "#f0f0f0";

  const clusterConfig = {
    type: "cluster",
    clusterRadius: "100px",
    // {cluster_count} is an aggregate field containing
    // the number of features comprised by the cluster
    popupTemplate: {
      title: "Cluster summary",
      content: "This cluster represents {cluster_count} project sites.",
      fieldInfos: [
        {
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true,
          },
        },
      ],
    },
    clusterMinSize: "24px",
    clusterMaxSize: "60px",
    labelingInfo: [
      {
        deconflictionStrategy: "none",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,###')",
        },
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "20px",
          },
          border: {
            borderColor: "#000000",
            borderRadius: "1px",
          },
        },
        labelPlacement: "center-center",
      },
    ],
  };

  // Create the projects feature layer and set the renderer, labels, popup template.
  const projectLayer = new FeatureLayer({
    url: "https://services9.arcgis.com/h8H4fa0wsbwmIt3l/arcgis/rest/services/GRM_Projects/FeatureServer/0",
    renderer: projectMarkers,
    labelingInfo: [projectLabels],
    outFields: [
      "Nation",
      "Organisation",
      "Description",
      "x",
      "y",
      "Proj_Status",
      "Donor_Principal",
      "Implementing_Partners",
      "Start_Year",
      "End_Year",
      "Land_Area",
      "Trees_mgmt",
      "Tree_Density",
      "Practice",
    ],
    popupTemplate: tableProjectPopup,
    featureReduction: clusterConfig,
  });

  map.add(projectLayer);

  // SECTION: Zoom To Selected Point
  // Ref: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#goTo
  // Ref: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#HitTestResult
  // NOTE: Need to read more about hitTest

  const projectDataElement = document.querySelector(".project-data");

  // go to point at LOD 15 with custom duration
  let opts = {
    duration: 1000, // Duration of animation will be 5 seconds
  };

  // Get the screen point from the view's click event
  view.on("click", function (event) {
    // Search for graphics at the clicked location. View events can be used
    // as screen locations as they expose an x,y coordinate that conforms
    // to the ScreenPoint definition.
    view.hitTest(event).then(function (response) {
      console.log(response.results);

      if (response.results.length === 2) {
        const projectData = response.results[0].graphic.attributes;

        // do something with the result graphic
        console.log(projectData);
        if (Object.keys(projectData).includes("clusterId")) {
          return;
        }
        // Zoom to selected point
        view.goTo(
          {
            center: [projectData.x, projectData.y],
            zoom: 4,
          },
          opts
        );

        // Display project data in the project tab
        projectDataElement.innerHTML = "";
        const header = document.createElement("h2");
        header.innerHTML = "About Project";
        projectDataElement.appendChild(header);

        const ignoredFields = ["ObjectId", "Proj_Code", "x", "y"];
        Object.entries(projectData).forEach(function (item) {
          const [key, value] = item;
          if (ignoredFields.includes(key)) {
            return;
          }
          if (!value) {
            return;
          }
          const subHeader = document.createElement("h3");
          const content = document.createElement("p");
          subHeader.innerHTML = key;
          content.innerHTML = value;
          projectDataElement.appendChild(subHeader);
          projectDataElement.appendChild(content);
        });
      }
    });
  });

  // SECTION: Hide/Show Project Button
  const hideProjectButton = document.querySelector(".hide-tab-btn");
  let hide = false;
  hideProjectButton.addEventListener("click", function () {
    if (!hide) {
      document.querySelector(".body-view").classList.add("hidden");
      hideProjectButton.innerHTML = "Show Project Tab";
      hide = true;
    } else {
      document.querySelector(".body-view").classList.remove("hidden");
      hideProjectButton.innerHTML = "Hide Project Tab";
      hide = false;
    }
  });
  // SECTION: Reset Map View Button
  const resetMapViewButton = document.querySelector(".reset-view-btn");
  resetMapViewButton.addEventListener("click", function () {
    projectDataElement.innerHTML = "";
    view.goTo(
      {
        center: CENTER_POINT,
        zoom: GLOBAL_ZOOM,
      },
      opts
    );
  });
});
