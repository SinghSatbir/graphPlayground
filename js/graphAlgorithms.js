define(["graphHelpers", "genericHelpers"], (graphH, genericH) =>{
	return {
		colorNetwork: function (graphState = main.graphState){
			main.setData(main.singleyConnectGraph(main.getNodes(), main.getEdges(), network.body.nodes), false, false);
			let nodes = main.getNodes();
			let adjacency = graphState.state.adjacency;
			let degrees = graphState.state.degrees;

			let nodeArr = genericH.datasetToArray(nodes, "id");
			// Put vertices in array in decreasing order of degree
			let vertexOrder = nodeArr.sort((a, b) =>{
				return degrees[a] < degrees[b] ? 1 : degrees[a] === degrees[b] ? 0 : -1;
			});

			let colorIndex = {};
			let currentColor = 0;
			while(vertexOrder.length > 0){
				let root = vertexOrder.shift();
				colorIndex[root] = currentColor;

				let myGroup = [];
				myGroup.push(root);

				for(let i = 0; i < vertexOrder.length;){
					let p = vertexOrder[i];
					let conflict = false;

					for(let j = 0; j < myGroup.length; j++){
						if(graphH.isAdjacent(p, myGroup[j], adjacency)){
							i++;
							conflict = true;
							break;
						}
					}
					if(conflict){
						continue;
					}

					colorIndex[p] = currentColor;
					myGroup.push(p);
					vertexOrder.splice(i, 1);
				}

				myGroup = [];
				currentColor++;
			}

			let chromaticNumber = genericH.max(genericH.flatten(colorIndex)) + 1;
			return {colors: colorIndex, chromaticNumber: chromaticNumber};
		},

		hasEulerianCircuit: function(degrees){
			return degrees.filter((v) => {return v%2 !== 0; }).length === 0;
		},

		graphEqual: function (aEdges, bEdges){
			if(aEdges.length !== bEdges.length){
				return false;
			}

			let aNodes = graphH.interpolateNodesFromEdges(aEdges);
			let bNodes = graphH.interpolateNodesFromEdges(bEdges);
			if(aNodes.length !== bNodes.length){
				return false;
			}

			let nodesEqual = true;
			aNodes.forEach((v) => {
				if(bNodes.get(v.id) === null || !genericH.equalsObject(v, bNodes.get(v.id))){
					nodesEqual = false;
				}
			});

			return nodesEqual;
		},

	};
});