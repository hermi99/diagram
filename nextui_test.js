var topologyData = {
  nodes: [{
    "id": 0,
    "x": 350,
    "y": 0,
    "name": "Anyang-MNC167Y"
  }, {
    "id": 1,
    "x": 450,
    "y": 0,
    "name": "Anyang-MNC168S"
  }, {
    "id": 2,
    "x": 250,
    "y": 100,
    "name": "Anyang-MEA068"
  }, {
    "id": 3,
    "x": 350,
    "y": 100,
    "name": "Anyang-MEA069S"
  }, {
    "id": 4,
    "x": 450,
    "y": 100,
    "name": "Ansan-MEA231S"
  }, {
    "id": 5,
    "x": 550,
    "y": 100,
    "name": "Ansan-MEA232Y"
  }],
  links: [{
    "source": 0,
    "target": 1
  }, {
    "source": 0,
    "target": 2
  }, {
    "source": 0,
    "target": 3
  },  {
    "source": 0,
    "target": 4
  }, {
    "source": 0,
    "target": 5
  }, {
    "source": 1,
    "target": 2
  }, {
    "source": 1,
    "target": 3
  }, {
    "source": 1,
    "target": 4
  }, {
    "source": 1,
    "target": 5
  }, ]
};





//initialize a topology component
var topology = new nx.graphic.Topology({
  width: 800,
  height: 600,
  showIcon: true,
  nodeConfig: {
    label: 'model.name',
    iconType: "router",
    color: '#0how00'
  },
  linkConfig: {
    linkType: 'curve'
  },
  dataProcessor: "auto",
  layout: "auto",
  'enableSmartLabel': true,
	  // smooth scaling. may slow down, if true
	  'enableGradualScaling': true,
	  // if true, two nodes can have more than one link
	  'supportMultipleLink': true,
	  // enable scaling
	  "scalable": true

});

//set data
topology.on('ready', function() {
  topology.data(topologyData);
});

topology.on("topologyGenerated", function() {

  // path layer - need to draw paths
  var pathLayer = topology.getLayer("paths");
  // node dictionary to get nodes by name (by default only 'id' is available)
  var nodesDict = topology.getLayer("nodes").nodeDictionary();

  var linkList = getLinkList(topology, nodesDict, pathHops);

  var pathInst = new nx.graphic.Topology.Path({
      "pathWidth": 3,
      "links": linkList,
      "arrow": "cap",
      "color": "#0000ff",
  });

  pathLayer.addPath(pathInst);
  // pathLayer.removePath(pathInst);

});


//create app
var app = new nx.ui.Application();
//attach topo to app;
topology.attach(app);

var pathHops = [
    "0",
    "1",
    "2",
  ];



function getLinkList(topology, nodesDict, pathHops) {

  var linkList = [];

  for (var i = 0; i < pathHops.length - 1; i++) {

    var srcNode = nodesDict.getItem(pathHops[i]);
    var destNode = nodesDict.getItem(pathHops[i + 1]);

    var links = getLinksBetweenNodes(topology, srcNode, destNode);

    linkList.push(links[0]);
  }

  return linkList;
}

function getLinksBetweenNodes(topo, src, dest) {

  var linkSet = topo.getLinkSet(src.id(), dest.id());
  if (linkSet !== null) {
    return nx.util.values(linkSet.links());
  }
  return false;
}


app.container(document.getElementById("topology-container"));

