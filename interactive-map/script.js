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
  // Global variables
  const CENTER_POINT = [21.81, 12.36];
  const GLOBAL_ZOOM = 1.7;
  // Map: A map defines the layers that need to be displayed.
  const map = new Map({
    basemap: "arcgis-navigation",
  });
  const view = new MapView({
    map: map,
    center: CENTER_POINT,
    zoom: GLOBAL_ZOOM,
    container: "map-view", // Set the HTML container property to display the contents of the map.
    constraints: {
      snapToZoom: false,
    },
    popup: {
      dockEnabled: true,
      dockOptions: {
        // Disable the dock button from the popup
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
  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: "arcgis-imagery",
    label: "Toggle Between Basemaps",
  });
  view.ui.add(basemapToggle, "bottom-left"); // Add to the view

  // SECTION: Style markers and labels
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
  const haloColor = "#373837";
  const color = "#f0f0f0";
  const haloSize = "1.5px";

  const projectLabels = {
    symbol: {
      type: "text",
      haloColor,
      haloSize,
      color,
      font: {
        size: "12px",
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

  // SECTION: Create a PieChart
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

  // SECTION: Create a project popup template
  // Ref: https://developers.arcgis.com/javascript/latest/display-a-pop-up/
  // Create a project popup template
  const projectPopup = {
    title: "{Proj_Status} Project by {Organisation}",
    content: [
      {
        type: "text", // Text element
        text: "{Description}",
      },
      {
        type: "fields", // Table element
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
            fieldName: "Men_Trained",
            label: "Men Trained",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "Women_Trained",
            label: "Women Trained",
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
        ],
      },
      piechartElement, // PieChart element
      {
        type: "media", // Image/Chart element
        mediaInfos: [
          {
            title: "<b>Trees</b>",
            type: "image",
            caption: "trees",
            value: {
              sourceURL:
                "https://www.sunset.com/wp-content/uploads/96006df453533f4c982212b8cc7882f5-800x0-c-default.jpg",
            },
          },
          {
            title: "<b>Logo</b>",
            type: "image",
            caption: "logo",
            value: {
              sourceURL: "../images/GRM.png",
            },
          },
        ],
      },
    ],
  };

  // SECTION: Configure point clustering
  // Ref: https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster/
  // Ref: https://developers.arcgis.com/javascript/latest/sample-code/featurereduction-cluster-filter-slider/

  const clusterConfig = {
    type: "cluster",
    clusterRadius: "120px",
    // {cluster_count} is an aggregate field containing
    // the number of features comprised by the cluster
    // popupTemplate: {
    //   title: "Cluster summary",
    //   content: "This cluster represents {cluster_count} project sites.",
    //   fieldInfos: [
    //     {
    //       fieldName: "cluster_count",
    //       format: {
    //         places: 0,
    //         digitSeparator: true,
    //       },
    //     },
    //   ],
    // },
    clusterMinSize: "30px",
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
          haloSize,
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "20px",
          },
        },
        labelPlacement: "center-center",
      },
    ],
  };
  // SECTION: Create a project point layer
  // Create the projects feature layer and set the renderer, labels, popup template.
  const projectLayer = new FeatureLayer({
    url: "https://services9.arcgis.com/h8H4fa0wsbwmIt3l/arcgis/rest/services/GRM_Projects/FeatureServer/0",
    renderer: projectMarkers,
    labelingInfo: [projectLabels],
    popupTemplate: projectPopup,
    featureReduction: clusterConfig,
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
  });

  map.add(projectLayer); // Add project layer to map

  // SECTION: Zoom to a selected graphic element
  // Ref: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#goTo
  // Ref: https://developers.arcgis.com/javascript/latest/api-reference/esri-views-MapView.html#HitTestResult
  // NOTE: Need to read more about hitTest

  // Go to point at LOD 15 with custom duration
  const opts = {
    duration: 1000, // Duration of animation will be 5 seconds
  };

  const projectDataElement = document.querySelector(".project-data");

  // Get the data from the click event
  view.on("click", function (event) {
    // Get the clicked coordinates
    const mapPoint = event.mapPoint;
    console.log("view.zoom", view.zoom);
    console.log("event", event);
    console.log("mapPoint", mapPoint);
    console.log(`x: ${mapPoint.longitude}, y: ${mapPoint.latitude}`);

    view.hitTest(event).then(function (response) {
      console.log("response.results", response.results);
      // Check if clicked on graphic
      if (response.results.length >= 2) {
        const projectData = response.results[0].graphic.attributes;
        console.log("projectData", projectData);
        // Check if the graphic element is a cluster
        if (Object.keys(projectData).includes("clusterId")) {
          view.goTo(
            {
              center: [mapPoint.longitude, mapPoint.latitude],
              zoom: view.zoom + 1.3,
            },
            opts
          );
          return;
        }
        // Zoom to selected point
        view.goTo(
          {
            center: [projectData.x, projectData.y],
            zoom: 11,
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
    projectDataElement.innerHTML = `<h2>GRM Interactive Dashboard</h2>
    <p>
      A key focus of the GRM is to provide clear visibility to existing
      and planned land restoration projects. Through the integration of
      a broad range of data from restoration at multiple scales, we aim
      to increase accessibility and strengthen capacity for greater
      collaboration, knowledge sharing, and impact on the ground.
    </p>`;
    view.goTo(
      {
        center: CENTER_POINT,
        zoom: GLOBAL_ZOOM,
      },
      opts
    );
  });
});
