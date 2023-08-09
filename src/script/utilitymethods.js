/**
 *  Home page handler
 */
 import { NodeConstraints, Node } from '@syncfusion/ej2-diagrams';
 import { Ajax } from '@syncfusion/ej2-base';
import { getConnector,getNode } from '../App';
 export class PaperSize {
 }
 export class UtilityMethods {
     constructor() {
         this.fillColorCode = ['#C4F2E8', '#F7E0B3', '#E5FEE4', '#E9D4F1', '#D4EFED', '#DEE2FF'];
         this.borderColorCode = ['#8BC1B7', '#E2C180', '#ACCBAA', '#D1AFDF', '#90C8C2', '#BBBFD6'];
         
     }
     
     download = function (data) {
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
            window.navigator.msSaveOrOpenBlob(blob, 'Diagram.json');
        }
        else {
            var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
            var a = document.createElement('a');
            a.href = dataStr;
            a.download = 'Diagram.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    }
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
    getSameLevelNodes() {
        var diagram=document.getElementById("diagram").ej2_instances[0];
        var sameLevelNodes = [];
        if (diagram.selectedItems.nodes.length > 0) {
            var node = diagram.selectedItems.nodes[0];
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
        return sameLevelNodes;
    };
    
     hideElements(elementType, diagram, diagramType) {
         const diagramContainer = document.getElementsByClassName('diagrambuilder-container')[0];
         if (diagramContainer.classList.contains(elementType)) {
             if (!(diagramType === 'mindmap-diagram' || diagramType === 'orgchart-diagram')) {
                 diagramContainer.classList.remove(elementType);
             }
         }
         else {
             diagramContainer.classList.add(elementType);
         }
         if (diagram) {
             diagram.updateViewPort();
         }
     }
    
     enableMenuItems(itemText, selectedItem) {
         if (selectedItem && selectedItem.selectedDiagram) {
             let selectedItems = selectedItem.selectedDiagram.selectedItems.nodes;
             selectedItems = selectedItems.concat(selectedItem.selectedDiagram.selectedItems.connectors);
             if (itemText) {
                 const commandType = itemText.replace(/[' ']/g, '');
                 if (selectedItems.length === 0 || selectedItem.diagramType !== 'GeneralDiagram') {
                    // eslint-disable-next-line
                     switch (commandType.toLowerCase()) {
                         case 'edittooltip':
                             let disable = false;
                             if (!(selectedItems.length === 1)) {
                                 disable = true;
                             }
                             return disable;
                         case 'cut':
                             return true;
                         case 'copy':
                             return true;
                         case 'delete':
                             return true;
                         case 'duplicate':
                             return true;
                     }
                 }
                 if (selectedItems.length > 1) {
                    // eslint-disable-next-line
                     switch (commandType.toLowerCase()) {
                         case 'edittooltip':
                             return true;
                     }
                 }
                 if (selectedItem.pasteData.length === 0 && itemText === 'Paste') {
                     return true;
                 }
                 if (itemText === 'Undo' && selectedItem.selectedDiagram.historyManager.undoStack.length === 0) {
                     return true;
                 }
                 if (itemText === 'Redo' && selectedItem.selectedDiagram.historyManager.redoStack.length === 0) {
                     return true;
                 }
                 if (itemText === 'Select All') {
                     if (selectedItem.selectedDiagram.nodes.length === 0 && selectedItem.selectedDiagram.connectors.length === 0) {
                         return true;
                     }
                 }
                 if (selectedItem.diagramType !== 'GeneralDiagram') {
                     if (itemText === 'Themes' || itemText === 'Paste' || itemText === 'Show Rulers' || itemText === 'Show Guides'
                         || itemText === 'Show Grid' || itemText === 'Snap To Grid' || itemText === 'Show Stencil') {
                         return true;
                     }
                 }
             }
         }
         return false;
     }
     enableArrangeMenuItems(selectedItem) {
         // const contextInstance: any = document.getElementById('arrangeContextMenu');
         // const contextMenu: ContextMenu = contextInstance.ej2_instances[0] as ContextMenu;
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
     getPaperSize(paperName) {
         const paperSize = new PaperSize();
         // eslint-disable-next-line
         switch (paperName) {
             case 'Letter':
                 paperSize.pageWidth = 816;
                 paperSize.pageHeight = 1056;
                 break;
             case 'Legal':
                 paperSize.pageWidth = 816;
                 paperSize.pageHeight = 1344;
                 break;
             case 'Tabloid':
                 paperSize.pageWidth = 1056;
                 paperSize.pageHeight = 1632;
                 break;
             case 'A3':
                 paperSize.pageWidth = 1122;
                 paperSize.pageHeight = 1587;
                 break;
             case 'A4':
                 paperSize.pageWidth = 793;
                 paperSize.pageHeight = 1122;
                 break;
             case 'A5':
                 paperSize.pageWidth = 559;
                 paperSize.pageHeight = 793;
                 break;
             case 'A6':
                 paperSize.pageWidth = 396;
                 paperSize.pageHeight = 559;
                 break;
         }
         return paperSize;
     }
     removeChild(selectedItem) {
        var diagram = document.getElementById("diagram").ej2_instances[0];
         if (diagram.selectedItems.nodes.length > 0) {
            diagram.historyManager.startGroupAction();
            this.removeSubChild(diagram.selectedItems.nodes[0]);
            diagram.historyManager.endGroupAction();
            diagram.doLayout();
        }
     }
     removeSubChild(node){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        for (var i = node.outEdges.length - 1; i >= 0; i--) {
            var connector =  getConnector( diagram.connectors, node.outEdges[i]);
            var childNode =  getNode( diagram.nodes, connector.targetID);
            if (childNode != null && childNode.outEdges.length > 0) {
                this.removeSubChild(childNode);
            }
            else {
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
                var connector1 =  diagram.getObject(node1);
                var node2 =  getNode( diagram.nodes, connector1.targetID);
                diagram.select([node2]);
            }
            else {
                diagram.select([childNode]);
            }
        }
        diagram.remove(node);
     }
  
     hideMenuItems() {
         const btnWindow = document.getElementById('btnWindowMenu');
         btnWindow.ej2_instances[0].items[1].iconCss = '';
         const btnView = document.getElementById('btnViewMenu');
         btnView.ej2_instances[0].items[7].iconCss = '';
     }
     fileName(){
        return document.getElementById('diagramName').innerHTML;
    }
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