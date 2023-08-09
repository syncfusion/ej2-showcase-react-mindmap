import { Node, Keys, KeyModifiers,DiagramAction } from '@syncfusion/ej2-diagrams';
import {hideUserHandle,changeUserHandlePosition,addNode,addSibilingChild,removeSelectedToolbarItem}   from "../App"
import { UtilityMethods } from './utilitymethods';
import { workingData } from '../App';
var templateType = "template1";
var connectorType = "Bezier";
var childHeight = 20;
export class DiagramClientSideEvents {
    constructor(selectedItem, page) {
        this.selectedItem = selectedItem;
        this.page = page;
    }
    //selection change event
    selectionChange(arg) {
        const diagram = this.selectedItem.selectedDiagram;
        var textareaObj = document.getElementById("multipleChildText").ej2_instances[0];
        if (arg.state === 'Changing') {
            if (arg.type === "Addition") {
                if (arg.newValue[0] instanceof Node && arg.newValue[0].addInfo) {
                    for (var _i = 0, _a = diagram.selectedItems.userHandles; _i < _a.length; _i++) {
                        var handle_1 = _a[_i];
                        handle_1.visible = true;
                    }
                    if (arg.newValue[0].addInfo.orientation === 'Left' ||
                        arg.newValue[0].addInfo.orientation === 'subLeft') {
                        hideUserHandle('leftHandle');
                        changeUserHandlePosition('leftHandle');
                    }
                    else if (arg.newValue[0].addInfo.orientation === 'Right' ||
                        arg.newValue[0].addInfo.orientation === 'subRight') {
                        hideUserHandle('rightHandle');
                        changeUserHandlePosition('rightHandle');
                    }
                    else if (arg.newValue[0].data.branch === 'Root') {
                        hideUserHandle('devare');
                    }
                   this.onClickDisable(false, arg.newValue[0]);
                }
                else {
                    hideUserHandle('leftHandle');
                    hideUserHandle('rightHandle');
                    hideUserHandle('devare');
                    this.onClickDisable(true);
                }
            } else {
                document.getElementById('mindMapContainer').style.display = '';
                document.getElementById('multipleChildPropertyContainer').style.display = 'none';
                document.getElementById('propertyHeader').innerText = "Properties";
                textareaObj.value = "";
                this.onClickDisable(true);
            }
        }

    }
    //enable and disable of toolbar items
    onClickDisable = function (args, node) {
        var toolbarObj=document.getElementById("toolbarEditor").ej2_instances[0];
        if (args === false) {
            toolbarObj.items[6].disabled = false;
            toolbarObj.items[8].disabled = false;
            if (node.addInfo.level !== 0) {
                toolbarObj.items[7].disabled = false;
            } else {
                toolbarObj.items[7].disabled = true;
            }
        }
        else if (args === true) {
            toolbarObj.items[6].disabled = true;
            toolbarObj.items[7].disabled = true;
            toolbarObj.items[8].disabled = true;
        }
        removeSelectedToolbarItem();
    };
    //created event
   created(args) {
    const diagram = this.selectedItem.selectedDiagram;
        diagram.fitToPage();
        //define the command manager
        diagram.commandManager = {
            commands: [
                {
                    name: 'leftChild',
                    canExecute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            return true;
                        }
                        return false;
                    },
                    execute: function () {
                        var selectedObject = diagram.selectedItems.nodes;
                        if (selectedObject[0]) {
                            if (selectedObject[0].inEdges) {
                                addNode('Left')
                            }
                        }
                    },
                    gesture: {
                        key: Keys.Tab,
                    }
                },
                {
                    name: 'rightChild',
                    canExecute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            return true;
                        }
                        return false;
                    },
                    execute: function () {
                        var selectedObject = diagram.selectedItems.nodes;
                        if (selectedObject[0]) {
                            if (selectedObject[0].inEdges) {
                                addNode('Right')
                            }
                        }
                    },
                    gesture: {
                        key: Keys.Tab,
                        keyModifiers: KeyModifiers.Shift
                    }

                },
                {
                    name: 'showShortCut',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        var btnWindowMenu = document.getElementById("btnWindowMenu").ej2_instances[0];
                        var node1 = document.getElementById('shortcutDiv');
                        node1.style.visibility = node1.style.visibility === "hidden" ? node1.style.visibility = "visible" : node1.style.visibility = "hidden";
                        btnWindowMenu.items[2].iconCss = node1.style.visibility === "hidden" ? '' : 'sf-icon-check-tick';
                        diagram.dataBind();
                    },
                    gesture: {
                        key: Keys.F1,
                    }

                },

                {
                    name: 'FitToPage',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        diagram.fitToPage({ mode: 'Width' });
                    },
                    gesture: {
                        key: Keys.F8,
                    }

                },
                {
                    name: 'boldLabel',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            if (node.annotations && node.annotations.length > 0) {
                                node.annotations[0].style.bold = !node.annotations[0].style.bold;
                                diagram.dataBind();
                            }
                        }
                    },
                    gesture: {
                        key: Keys.B,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'italicLabel',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            if (node.annotations && node.annotations.length > 0) {
                                node.annotations[0].style.italic = !node.annotations[0].style.italic;
                                diagram.dataBind();
                            }
                        }
                    },
                    gesture: {
                        key: Keys.I,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'underlineLabel',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            if (node.annotations && node.annotations.length > 0) {
                                node.annotations[0].style.textDecoration = node.annotations[0].style.textDecoration === 'Underline' ? 'None' : 'Underline';
                                diagram.dataBind();
                            }
                        }
                    },
                    gesture: {
                        key: Keys.U,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'deleteNode',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        if (diagram.selectedItems.nodes.length > 0 && diagram.selectedItems.nodes[0].data.branch !== 'Root') {
                        UtilityMethods.prototype.removeChild();
                        }
                    },
                    gesture: {
                        key: Keys.BackSpace
                    }
                },
                {
                    name: 'removeNode',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        if (diagram.selectedItems.nodes.length > 0 && diagram.selectedItems.nodes[0].data.branch !== 'Root') {
                            UtilityMethods.prototype.removeChild();
                        }
                    },
                    gesture: {
                        key: Keys.Delete
                    }
                },
                {
                    name: 'expandCollapse',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        if (diagram.selectedItems.nodes.length > 0) {
                            var node = diagram.selectedItems.nodes[0];
                            node.isExpanded = !node.isExpanded;
                            diagram.dataBind();
                        }
                    },
                    gesture: {
                        key: Keys.Space
                    }
                },
                {
                    name: 'expandCollapseParent',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        var node = diagram.nodes[0];
                        node.isExpanded = !node.isExpanded;
                        diagram.dataBind();
                    },
                    gesture: {
                        key: Keys.E,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    gesture: { key: Keys.Enter },
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        addSibilingChild()
                    },
                    name: 'sibilingChildTop'
                },
                {
                    name: 'newDiagram',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        diagram.clear();
                    },
                    gesture: {
                        key: Keys.N,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'saveDiagram',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        UtilityMethods.prototype.download(diagram.saveDiagram());
                    },
                    gesture: {
                        key: Keys.S,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'openDiagram',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
                    },
                    gesture: {
                        key: Keys.O,
                        keyModifiers: KeyModifiers.Control
                    }
                },
                {
                    name: 'navigationDown',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        UtilityMethods.prototype.navigateChild('bottom');
                    },
                    gesture: {
                        key: Keys.Down
                    }
                },
                {
                    name: 'navigationUp',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        UtilityMethods.prototype.navigateChild('up');
                    },
                    gesture: {
                        key: Keys.Up
                    }
                },
                {
                    name: 'navigationLeft',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        UtilityMethods.prototype.navigateChild('right');
                    },
                    gesture: {
                        key: Keys.Left
                    }
                },
                {
                    name: 'navigationRight',
                    canExecute: function () {
                        return true;
                    },
                    execute: function () {
                        UtilityMethods.prototype.navigateChild('left');
                    },
                    gesture: {
                        key: Keys.Right
                    }
                },
            ]
        };
        diagram.dataBind();
    };
    //keydown event
    keyDown(args){
        var diagram=document.getElementById("diagram").ej2_instances[0];
        if (args.key === "Enter" && args.keyModifiers === 0 && (diagram.diagramActions & DiagramAction.TextEdit)) {
        diagram.endEdit();
        }
    }
    //textedit event
    textEdit(args){
        setTimeout(() => {
            if (args.annotation) {
                var tempData = workingData.filter((a) => a.id === args.element.data.id);
                tempData[0].Label = args.annotation.content;
            }
        }, 0);
    }
    //drop event
    drop(args,diagram){
        if (args.target && args.target.inEdges) {
            var connector = diagram.getObject(
                args.element.inEdges[0]
            );
            connector.sourceID = args.target.id;
            diagram.dataBind();
            diagram.doLayout();
            //Update connector connection direction
            var srcNode = args.element;
            var targetNode = args.target;
            var srctreeInfo = srcNode.data;
            var targettreeInfo = targetNode.data;
            var canUpdate = true;
            if (srctreeInfo.branch === 'Right' && targettreeInfo.branch === 'Left') {
                this.updateDataSource(args.element, args.target);
                connector.sourcePortID = targetNode.ports[1].id;
                connector.targetPortID = srcNode.ports[0].id;
                this.updateRightTopicOutEdges(srcNode);
                canUpdate = false;
            } else if (srctreeInfo.branch === 'Left' && targettreeInfo.branch === 'Right') {
                this.updateDataSource(args.element, args.target);
                connector.sourcePortID = targetNode.ports[0].id;
                connector.targetPortID = srcNode.ports[1].id;
                this.updateLeftTopicOutEdges(srcNode);
                canUpdate = false;
            }
            if (canUpdate) {
                this.updateDataSource(args.element, args.target);
            }
        } 
    }
   //To update the datasource
    updateDataSource(source, target){
        var diagram=document.getElementById("diagram").ej2_instances[0];
        var updateData = workingData.find(function (element) {
            return element.id === source.data.id;
        });
        if (updateData) {
            var tempData = workingData.filter((a) => a.id === target.id);
            tempData[0].hasChild = true;
            target.data.hasChild = true;
            updateData.parentId = target.data.id;
            updateData.branch = target.data.branch !== "Root" ? target.data.branch : updateData.branch;
            updateData.level = target.data.level + 1;
            updateData.orientation = target.data.branch !== "Root" ? target.data.branch : updateData.branch;
            var node = diagram.getObject(source.id);
            node.data.parentId = target.data.id;
            node.data.branch = target.data.branch !== "Root" ? target.data.branch : updateData.branch;
            node.data.level = target.data.level + 1;
            node.data.orientation = target.data.branch !== "Root" ? target.data.branch : updateData.branch;
            node.addInfo.level = target.data.level + 1;
            node.addInfo.orientation = target.data.branch !== "Root" ? target.data.branch : updateData.branch;
        }
    }
    updateLeftTopicOutEdges(node){
        var diagram=document.getElementById("diagram").ej2_instances[0];
        for (var i = 0; i < node.outEdges.length; i++) {
            var outconnector = diagram.getObject(node.outEdges[i]);
            outconnector.sourcePortID = 'leftPort';
            outconnector.targetPortID = 'rightPort';
            var targetNode = diagram.getObject(outconnector.targetID);
            // eslint-disable-next-line no-loop-func
            var tempData = workingData.filter((a) => a.id === targetNode.id);
            targetNode.data.parentId = node.data.id;
            targetNode.data.branch = node.data.branch !== "Root" ? node.data.branch : targetNode.data.branch;
            targetNode.data.level = node.data.level + 1;
            targetNode.data.orientation = node.data.branch !== "Root" ? node.data.branch : targetNode.data.branch;
            targetNode.addInfo.level = node.data.level + 1;
            targetNode.addInfo.orientation = node.data.branch !== "Root" ? node.data.branch : targetNode.data.branch;
            tempData[0].parentId = node.data.id;
            tempData[0].branch = node.data.branch !== "Root" ? node.data.branch : targetNode.data.branch;
            tempData[0].level = node.data.level + 1;
            tempData[0].orientation = node.data.branch !== "Root" ? node.data.branch : targetNode.data.branch;
            if (targetNode.outEdges && targetNode.outEdges.length > 0) {
                tempData[0].hasChild = true;
                this.updateLeftTopicOutEdges(targetNode);
            }
        }
    }
    
    //dragenter event
    dragEnter(args) {
        const obj = args.element;
        const ratio = 100 / obj.width;
        obj.width = 100;
        obj.height *= ratio;
    }
    //history change event
    historyChange(args) {
        var diagram = document.getElementById("diagram").ej2_instances[0];
        var toolbarContainer = document.getElementsByClassName('db-toolbar-container')[0];
        toolbarContainer.classList.remove('db-undo');
        toolbarContainer.classList.remove('db-redo');
        if (diagram.historyManager.undoStack.length > 0) {
            toolbarContainer.classList.add('db-undo');
        }
        if (diagram.historyManager.redoStack.length > 0) {
            toolbarContainer.classList.add('db-redo');
        }
       
    }
    //To change the pattern of mindmap
    mindmapPatternChange(args) {
        var target = args.target;
        var diagram= document.getElementById('diagram').ej2_instances[0];
        var mindMapPatternTarget = args;
        diagram.historyManager.startGroupAction();
        for (var i = 0; i < diagram.nodes.length; i++) {
            var node = diagram.nodes[i];
            if (node.id !== 'textNode') {
                if (target.className === 'mindmap-pattern-style mindmap-pattern1') {
                    if (node.data.branch === 'Root') {
                        node.height = 70;
                        node.shape = { type: 'Basic', shape: 'Ellipse' };
                    }
                    else {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    }
                } else if (target.className === 'mindmap-pattern-style mindmap-pattern2') {
                    if (node.data.branch === 'Root') {
                        node.height = 50;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    }
                    else {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    }
                } else if (target.className === 'mindmap-pattern-style mindmap-pattern3') {
                    if (node.data.branch === 'Root') {
                        node.height = 50;
                        node.shape = { type: 'Path', data: 'M55.7315 17.239C57.8719 21.76 54.6613 27.788 47.1698 26.0787C46.0997 32.309 33.2572 35.323 28.9764 29.2951C25.7658 35.323 10.7829 33.816 10.7829 26.0787C3.29143 30.802 -0.989391 20.253 2.22121 17.239C-0.989317 14.2249 2.22121 6.68993 10.7829 8.39934C13.9935 -0.845086 25.7658 -0.845086 28.9764 5.18301C32.187 0.661909 45.0294 0.661908 47.1698 8.39934C52.5209 5.18301 60.0123 12.7179 55.7315 17.239Z' };
                    } else if (node.addInfo.level === 1) {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Ellipse' };
                    } else if (node.addInfo.level === 2) {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    } else if (node.addInfo.level === 3) {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Path', data: 'M24.9123 3.78029C25.0975 4.3866 24.9466 4.88753 24.8501 5.15598L24.8444 5.17188L24.8379 5.18757C24.543 5.89091 23.7879 6.37572 22.9737 6.71397C22.1386 7.06093 21.0847 7.3197 19.9302 7.51132C17.6145 7.89568 14.7099 8.03929 11.8845 7.99097C9.05877 7.94266 6.24887 7.70127 4.11982 7.29202C3.06318 7.08891 2.11594 6.83369 1.41022 6.51281C0.766274 6.22 0 5.72087 0 4.9469C0 4.01004 0.964525 3.41277 1.79867 3.05724C2.70576 2.67063 3.89493 2.37901 5.11258 2.15935C7.44304 1.73893 10.1147 1.54134 11.7304 1.52346C11.8769 1.52184 12.0122 1.59735 12.0902 1.72133V1.72133C12.2554 1.98406 12.0895 2.33011 11.7819 2.37125C6.76467 3.04222 7.47107 3.02672 5.26455 3.42478C4.10916 3.63321 3.07622 3.89464 2.39298 4.18584C1.76916 4.45172 1.91438 4.9469 1.92108 4.92166C1.95272 4.95811 2.05541 5.05272 2.36059 5.19149C2.83828 5.4087 3.58481 5.6232 4.56968 5.81251C6.52366 6.18811 9.1877 6.42238 11.9256 6.4692C14.6639 6.51602 17.4127 6.37423 19.539 6.02131C20.6055 5.8443 21.4697 5.62145 22.0872 5.36491C22.7085 5.10676 22.9449 4.87196 23.0162 4.71867C23.0759 4.54803 23.1185 4.35742 23.052 4.13951C22.9867 3.92586 22.7842 3.58431 22.1006 3.17831C20.6845 2.3372 17.4158 1.34558 10.1686 0.773902C10.0395 0.763721 9.92243 0.68718 9.86361 0.571853V0.571853C9.7338 0.317364 9.92861 0.0177825 10.2139 0.0325302C17.4619 0.407187 21.4191 0.873597 23.2463 1.95885C24.2179 2.53589 24.7233 3.16153 24.9123 3.78029Z' };
                    } else {
                        node.height = 4;
                        childHeight = 4;
                    }
                } else {
                    if (node.data.branch === 'Root') {
                        node.height = 50;
                        node.shape = { type: 'Path', data: 'M28 1.60745L32.6757 7.49196L33.1063 8.03386L33.7651 7.82174L43.5571 4.66902L41.3666 9.9757L40.8265 11.2839L42.24 11.356L52.0141 11.8539L45.233 15.0979L43.3473 16L45.233 16.9021L52.0141 20.1461L42.24 20.644L40.8265 20.716L41.3666 22.0243L43.5571 27.331L33.7651 24.1783L33.1063 23.9661L32.6757 24.508L28 30.3926L23.3243 24.508L22.8937 23.9661L22.2349 24.1783L12.4429 27.331L14.6334 22.0243L15.1734 20.7161L13.7599 20.644L3.98585 20.1461L10.767 16.9021L12.6527 16L10.767 15.0979L3.98585 11.8539L13.7599 11.356L15.1734 11.2839L14.6334 9.9757L12.4429 4.66902L22.2349 7.82174L22.8937 8.03386L23.3243 7.49196L28 1.60745Z' };
                    } else if (node.addInfo.level === 1) {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Path', data: 'M55.7315 17.239C57.8719 21.76 54.6613 27.788 47.1698 26.0787C46.0997 32.309 33.2572 35.323 28.9764 29.2951C25.7658 35.323 10.7829 33.816 10.7829 26.0787C3.29143 30.802 -0.989391 20.253 2.22121 17.239C-0.989317 14.2249 2.22121 6.68993 10.7829 8.39934C13.9935 -0.845086 25.7658 -0.845086 28.9764 5.18301C32.187 0.661909 45.0294 0.661908 47.1698 8.39934C52.5209 5.18301 60.0123 12.7179 55.7315 17.239Z' };
                    } else if (node.addInfo.level === 2) {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Rectangle' };
                    } else if (node.addInfo.level === 3) {
                        node.height = 30;
                        childHeight = 30;
                        node.shape = { type: 'Basic', shape: 'Ellipse' };
                    } else {
                        node.height = 3;
                        childHeight = 3;
                    }
                }
            }
            diagram.dataBind();
        }
        for (var i = 0; i < diagram.connectors.length; i++) {
            var connector = diagram.connectors[i];
            // eslint-disable-next-line default-case
            switch (target.className) {
                case 'mindmap-pattern-style mindmap-pattern1':
                    connector.type = 'Bezier';
                    connectorType = 'Bezier';
                    templateType = 'template1';
                    break;
                case 'mindmap-pattern-style mindmap-pattern2':
                    connector.type = 'Orthogonal';
                    connectorType = 'Orthogonal';
                    templateType = 'template4';
                    break;
                case 'mindmap-pattern-style mindmap-pattern3':
                    connector.type = 'Bezier';
                    connectorType = 'Bezier';
                    templateType = 'template2';
                    break;
                case 'mindmap-pattern-style mindmap-pattern4':
                    connector.type = 'Bezier';
                    connectorType = 'Bezier';
                    templateType = 'template3';
                    break;
            }
            diagram.dataBind();
        }
        diagram.historyManager.endGroupAction();
        diagram.doLayout();
    }
}



    
    