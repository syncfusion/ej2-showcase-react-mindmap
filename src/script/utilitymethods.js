/**
 *  Home page handler
 */
 import { NodeConstraints, Node } from '@syncfusion/ej2-diagrams';
import { getConnector,getNode, workingData  } from '../App';
 export class PaperSize {
 }
 export class UtilityMethods {
     constructor() {
         this.fillColorCode = ['#C4F2E8', '#F7E0B3', '#E5FEE4', '#E9D4F1', '#D4EFED', '#DEE2FF'];
         this.borderColorCode = ['#8BC1B7', '#E2C180', '#ACCBAA', '#D1AFDF', '#90C8C2', '#BBBFD6'];

     }
     //To save the diagram
     download (data, filename) {
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
            window.navigator.msSaveOrOpenBlob(blob, filename + '.json');
        }
        else {
            var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
            var a = document.createElement('a');
            a.href = dataStr;
            a.download =  filename + '.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    }
    //To navigate the child to the specified direction
    navigateChild (direction) {
        var diagram=document.getElementById("diagram").ej2_instances[0];
        var node = null;
        if (direction === 'top' || direction === 'bottom') {
            var sameLevelNodes = this.getSameLevelNodes();
            var index = sameLevelNodes.indexOf(diagram.selectedItems.nodes[0]);
            node = direction === 'top' ? sameLevelNodes[index - 1] : sameLevelNodes[index + 1];
        }
        else {
            node = this.getMinDistanceNode(diagram, direction);
        }
        if (node) {
            diagram.clearSelection();
            diagram.select([node]);
        }
    }
    //get nodes that are in same level
    getSameLevelNodes() {
        var diagram=document.getElementById("diagram").ej2_instances[0];
        var sameLevelNodes = [];
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
            if (node.data.branch !== 'Root') {
                var orientation_1 = node.addInfo.orientation.toString();
                var connector = getConnector(diagram.connectors, node.inEdges[0]);
                var parentNode = getNode(diagram.nodes, connector.sourceID);
                for (var i = 0; i < parentNode.outEdges.length; i++) {
                    connector = getConnector(diagram.connectors, parentNode.outEdges[i]);
                    var childNode = getNode(diagram.nodes, connector.targetID);
                    if (childNode) {
                        var childOrientation = childNode.addInfo.orientation.toString();
                        if (orientation_1 === childOrientation) {
                            sameLevelNodes.push(childNode);
                        }
                    }
                }
            }
        }
        return sameLevelNodes;
    };
    //To hide toolbar, propertypanel
     hideElements(elementType, diagram, diagramType) {
         const diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
         if (diagramContainer.classList.contains(elementType)) {
            if (!(diagramType === 'mindmap-diagram' || diagramType === 'orgchart-diagram')) {
            diagramContainer.classList.remove(elementType);
            }
            (document.getElementById('btnWindowMenu')).style.backgroundColor = '';
            (document.getElementById('btnWindowMenu')).style.color = '#fff';
            (document.getElementById('btnWindowMenu')).ej2_instances[0].isPrimary = true;
        }
        else {
            diagramContainer.classList.add(elementType);
            (document.getElementById('btnWindowMenu')).style.backgroundColor = '#e3e3e3';
            (document.getElementById('btnWindowMenu')).style.color = 'black';
            (document.getElementById('btnWindowMenu')).ej2_instances[0].isPrimary = false;
        }
         if (diagram) {
             diagram.updateViewPort();
         }
     }

    //To enable arrange menu items.
     enableArrangeMenuItems(selectedItem) {
         const contextMenu = this.arrangeContextMenu;
         let selectedItems = selectedItem.selectedDiagram.selectedItems.nodes;
         selectedItems = selectedItems.concat(selectedItem.selectedDiagram.selectedItems.connectors);
         for (const menuItem of contextMenu.items) {
             contextMenu.enableItems([menuItem.text], false);
         }
         if (selectedItem.diagramType === 'GeneralDiagram') {
             if (selectedItems.length > 1) {
                 contextMenu.enableItems(['Align Objects', 'Distribute Objects', 'Match Size', 'Lock', 'Unlock', 'Group'], true);
             }
             else if (selectedItems.length === 1) {
                 contextMenu.enableItems(['Send To Back', 'Bring To Front', 'Send Backward', 'Bring Forward']);
                 const object = selectedItems[0];
                 if (object instanceof Node) {
                     if (object.children && object.children.length > 0) {
                         contextMenu.enableItems(['Ungroup']);
                     }
                     if (object.constraints & NodeConstraints.Drag) {
                         contextMenu.enableItems(['Lock'], true);
                     }
                     else {
                         contextMenu.enableItems(['Unlock'], true);
                     }
                 }
             }
         }
     }

    //To remove the child node
     removeChild(selectedItem) {
        var diagram = document.getElementById("diagram").ej2_instances[0];
         if (diagram.selectedItems.nodes.length > 0) {
            diagram.historyManager.startGroupAction();
            this.removeSubChild(diagram.selectedItems.nodes[0]);
            diagram.historyManager.endGroupAction();
            diagram.doLayout();
        }
     }
      //Remove the subchild Elements
     removeSubChild(node){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        for (var i = node.outEdges.length - 1; i >= 0; i--) {
            var connector =  getConnector( diagram.connectors, node.outEdges[i]);
            var childNode =  getNode( diagram.nodes, connector.targetID);
            if (childNode != null && childNode.outEdges.length > 0) {
                this.removeSubChild(childNode);
            }
            else {
                for (var data = workingData.length - 1; data >= 0; data--) {
                    if (workingData[data].id === childNode.data.id) {
                        workingData.splice(data, 1);
                    }
                }
                diagram.remove(childNode);
            }
        }
        for (var j = node.inEdges.length - 1; j >= 0; j--) {
            // eslint-disable-next-line no-redeclare
            var connector = getConnector( diagram.connectors, node.inEdges[j]);
            // eslint-disable-next-line no-redeclare
            var childNode =  getNode( diagram.nodes, connector.sourceID);
            var index = childNode.outEdges.indexOf(connector.id);
            if (childNode.outEdges.length > 1 && index === 0) {
                index = childNode.outEdges.length;
            }
            if (index > 0) {
                var node1 = childNode.outEdges[index - 1];
                var connectors =  diagram.getObject(node1);
                var node2 =  getNode( diagram.nodes, connectors.targetID);
                diagram.select([node2]);
            }
            else {
                diagram.select([childNode]);
            }
        }
        for (var x = workingData.length - 1; x >= 0; x--) {
            if (workingData[x].id === node.data.id && node.data.branch !='Root') {
                workingData.splice(x, 1);
            }
        }
        if(node.data.branch !=='Root')
        {
            diagram.remove(node);
        }
     }
 //To get the fileName
    fileName(){
        return document.getElementById('diagramName').innerHTML;
    }
    //To get the minimum distance node
     getMinDistanceNode(diagram, direction) {
        var node = diagram.selectedItems.nodes[0];
        var parentBounds = node.wrapper.bounds;
        var childBounds = null;
        var oldChildBoundsTop = 0;
        var childNode = null;
        var lastChildNode = null;
        var leftOrientationFirstChild = null, rightOrientationFirstChild = null;
        if (node.data.orientation === "Root") {
            var edges = node.outEdges;
            for (var i = 0; i < edges.length; i++) {
                var connector = getConnector(diagram.connectors, edges[i]);
                childNode = getNode(diagram.nodes, connector.targetID);
                var addInfo = childNode.addInfo;
                if (addInfo.orientation.toString().toLowerCase() === direction) {
                    if (direction === 'left' && leftOrientationFirstChild === null) {
                        leftOrientationFirstChild = childNode;
                    }
                    if (direction === 'right' && rightOrientationFirstChild === null) {
                        rightOrientationFirstChild = childNode;
                    }
                    childBounds = childNode.wrapper.bounds;
                    if (parentBounds.top >= childBounds.top && (childBounds.top >= oldChildBoundsTop || oldChildBoundsTop === 0)) {
                        oldChildBoundsTop = childBounds.top;
                        lastChildNode = childNode;
                    }
                }
            }
            if (!lastChildNode) {
                lastChildNode = direction === 'left' ? leftOrientationFirstChild : rightOrientationFirstChild;
            }
        }
        else {
            var edges = [];
            var selecttype = '';
            var orientation_2 = node.addInfo.orientation.toString();
            if (orientation_2.toLowerCase() === 'left') {
                edges = direction === 'left' ? node.outEdges : node.inEdges;
                selecttype = direction === 'left' ? 'target' : 'source';
            }
            else {
                edges = direction === 'right' ? node.outEdges : node.inEdges;
                selecttype = direction === 'right' ? 'target' : 'source';
            }
            for (var i = 0; i < edges.length; i++) {
                var connector = getConnector(diagram.connectors, edges[i]);
                childNode = getNode(diagram.nodes, selecttype === 'target' ? connector.targetID : connector.sourceID);
                if (childNode.data.orientation === "Root") {
                    lastChildNode = childNode;
                    break;
                }
                else {
                    childBounds = childNode.wrapper.bounds;
                    if (selecttype === 'target') {
                        if (parentBounds.top >= childBounds.top && (childBounds.top >= oldChildBoundsTop || oldChildBoundsTop === 0)) {
                            oldChildBoundsTop = childBounds.top;
                            lastChildNode = childNode;
                        }
                    }
                    else {
                        lastChildNode = childNode;
                    }
                }
            }
        }
        return lastChildNode;
    };
}