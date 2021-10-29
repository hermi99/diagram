var topologyData = {
   nodes: [{
     "id": 0,
     "x": 410,
     "y": 100,
     "name": "12K-1"
   }, {
     "id": 1,
     "x": 410,
     "y": 280,
     "name": "12K-2"
   }, {
     "id": 2,
     "x": 660,
     "y": 280,
     "name": "Of-9k-03"
   }, {
     "id": 3,
     "x": 660,
     "y": 100,
     "name": "Of-9k-02"
   }, {
     "id": 4,
     "x": 180,
     "y": 190,
     "name": "Of-9k-01"
   }],
   links: [{
     "source": 0,
     "target": 1
   }, {
     "source": 1,
     "target": 2
   }, {
     "source": 1,
     "target": 3
   }, {
     "source": 4,
     "target": 1
   }, {
     "source": 2,
     "target": 3
   }, {
     "source": 2,
     "target": 0
   }, {
     "source": 3,
     "target": 0
   }, {
     "source": 3,
     "target": 0
   }, {
     "source": 3,
     "target": 0
   }, {
     "source": 0,
     "target": 4
   }, {
     "source": 0,
     "target": 4
   }],
   nodeSet: [{
     "id": 10,
     nodes: ["0", "4"],
     "x": 300,
     "y": 140

   }, {
     "id": 11,
     nodes: ["10", "2"],
     "x": 500,
     "y": 140

   }]
 };



(function(nx){

	// instantiate next app
	const app = new nx.ui.Application();

	var topology = new nx.graphic.Topology({
	  // width 100% if true
	  'adaptive': false,
	  // show icons' nodes, otherwise display dots
	  'showIcon': true,
	  // special configuration for nodes
	  'nodeConfig': {
	    'label': 'model.name',
	    'iconType': "router",
	    'color': '#0how00'
	  },
	  // special configuration for links
	  'linkConfig': {
	    'linkType': 'curve'
	  },
	  // property name to identify unique nodes
	  'identityKey': 'name', // helps to link source and target
	  // canvas size
	  'width': 1000,
	  'height': 600,
	  // "engine" that process topology prior to rendering
	  'dataProcessor': 'force',
	  // moves the labels in order to avoid overlay
	  'enableSmartLabel': true,
	  // smooth scaling. may slow down, if true
	  'enableGradualScaling': true,
	  // if true, two nodes can have more than one link
	  'supportMultipleLink': true,
	  // enable scaling
	  "scalable": true
	});

  topology.on("ready", function(){
    // load topology data
	topology.data(topologyData);
  });


	//console.log(topology.getNode("San Francisco"));
	var pathHops = [
	  "San Francisco",
	  "Los Angeles",
	  "Houston",
	  "New Jersey"
	];

	topology.on("topologyGenerated", function() {

	  // path layer - need to draw paths
	  var pathLayer = topology.getLayer("paths");
	  // node dictionary to get nodes by name (by default only 'id' is available)
	  var nodesDict = topology.getLayer("nodes").nodeDictionary();

	  var linkList = getLinkList(topology, nodesDict, pathHops);

	  var pathInst = new nx.graphic.Topology.Path({
	    "pathWidth": 3,
	    "links": linkList,
	    "arrow": "cap"
	  });

	  pathLayer.addPath(pathInst);
	  // pathLayer.removePath(pathInst);

	});

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




	// bind the topology object to the app
	topology.attach(app);

	// app must run inside a specific container. In our case this is the one with id="topology-container"
	app.container(document.getElementById("topology-container"));

})(nx);