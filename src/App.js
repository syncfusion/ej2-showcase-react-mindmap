import { createElement, closest,formatUnit } from "@syncfusion/ej2-base";
import { DiagramComponent, randomId,SelectorConstraints,MindMap,  ToolBase, DiagramAction, DiagramTools, NodeConstraints, ConnectorConstraints, UndoRedo, DiagramContextMenu, Snapping, DataBinding, PrintAndExport, ConnectorBridging, LayoutAnimation } from "@syncfusion/ej2-react-diagrams";
import { Diagram,SnapConstraints} from "@syncfusion/ej2-react-diagrams";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { DiagramClientSideEvents } from "./script/events";
import { DialogComponent } from "@syncfusion/ej2-react-popups";
import { ToolbarComponent, ItemsDirective, ItemDirective, ContextMenuComponent ,TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import * as React from 'react';
import { Uploader } from '@syncfusion/ej2-react-inputs';
import { RadioButtonComponent, ButtonComponent, CheckBoxComponent } from "@syncfusion/ej2-react-buttons";
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { DropDownDataSources } from './script/dropdowndatasource';
import { SelectorViewModel } from "./script/selector";
import { UtilityMethods } from "./script/utilitymethods";
import { PropertyChange } from "./script/properties";
import { DataManager, Query } from "@syncfusion/ej2-data";
import { PortVisibility } from '@syncfusion/ej2-diagrams';
import { NumericTextBoxComponent,TextBoxComponent, ColorPickerComponent,SliderComponent } from "@syncfusion/ej2-react-inputs";
Diagram.Inject(UndoRedo, DiagramContextMenu, Snapping, DataBinding, PrintAndExport,MindMap, ConnectorBridging, LayoutAnimation);

export let workingData = [
    { id: '1', Label: 'Creativity',  branch: 'Root', hasChild: true, level: 0, fill: "#D0ECFF", strokeColor: "#80BFEA", orientation: 'Root' },
];
const fields = { dataSource: workingData, id: 'id', text: 'Label',parentID: 'parentId',hasChildren: 'hasChild' };
var items = new DataManager(workingData, new Query().take(7));
export class PaperSize {
}

export let connectorType = "Bezier";
export let index = 1;
export let isExpanded = false;
export let childHeight = 20;
export let  mindMapPatternTarget;
export let diagramName;
export let beforItem;
export let loadDiagram;
export let beforeOpen;
export let designContextMenuOpen;
export let editContextMenuOpen;
export let beforeClose;
export let menuClick;
export let editTool;
export let hideToolbar;
export let zoomTemplate;
export let diagramView;
export let textView;
export let zoomChange;
export let diagramViewChange;
export let textViewChange;
export let enableMenuItems;
export let dropElement;
export let footTemplate;
export let printTemplateChange;
export let getNode; 
export let addNode;
export let setUserHandle;
export let getConnector;
export let getMindMapShape;
export let setConnectorDefault;
export let  isToolbarClicked = false;
export let  levelType = "Level0";
export let nodeShape;
export let htmlAttributes = { rows: '20' };
export let templateType = "template1";  
var fillColorCode = ['#C4F2E8', '#F7E0B3', '#E5FEE4', '#E9D4F1', '#D4EFED', '#DEE2FF'];
var borderColorCode = ['#8BC1B7', '#E2C180', '#ACCBAA', '#D1AFDF', '#90C8C2', '#BBBFD6'];
var lastFillIndex = 0;
var leftArrow = 'M11.924,6.202 L4.633,6.202 L4.633,9.266 L0,4.633 L4.632,0 L4.632,3.551 L11.923,3.551 L11.923,6.202Z';
var rightArrow = 'M0,3.063 L7.292,3.063 L7.292,0 L11.924,4.633 L7.292,9.266 L7.292,5.714 L0.001,5.714 L0.001,3.063Z';
var deleteIcon = 'M 7.04 22.13 L 92.95 22.13 L 92.95 88.8 C 92.95 91.92 91.55 94.58 88.76' +
    '96.74 C 85.97 98.91 82.55 100 78.52 100 L 21.48 100 C 17.45 100 14.03 98.91 11.24 96.74 C 8.45 94.58 7.04' +
   '91.92 7.04 88.8 z M 32.22 0 L 67.78 0 L 75.17 5.47 L 100 5.47 L 100 16.67 L 0 16.67 L 0 5.47 L 24.83 5.47 z';

//To hide userhandle when elements not selected in the diagram
export function hideUserHandle(name) {
    var diagram = document.getElementById("diagram").ej2_instances[0];
    for (var i = 0, a = diagram.selectedItems.userHandles; i < a.length; i++) {
        var handle2 = a[i];
        if (handle2.name === name) {
            handle2.visible = false;
        }
    }
}
//To remove the selected toolbar item
export function removeSelectedToolbarItem ()
{
    var toolbarObj=document.getElementById("toolbarEditor").ej2_instances[0];
    for (var i = 0; i < toolbarObj.items.length; i++) {
        var item = toolbarObj.items[i];
        if (item.cssClass.indexOf('tb-item-selected') !== -1) {
            item.cssClass = item.cssClass.replace(' tb-item-selected', '');
        }
    }
    toolbarObj.dataBind();
   
};
//To get the color value for diagram node or connector fill or stroke properties
export function getColor(colorName) {
    if (window.navigator.msSaveBlob && colorName.length === 9) {
        return colorName.substring(0, 7);
    }
    return colorName;
};
//Change the Position of the UserHandle.
export function changeUserHandlePosition(change) {
var diagram = document.getElementById("diagram").ej2_instances[0]
for (var i = 0; i < diagram.selectedItems.userHandles.length; i++) {
    var handle = diagram.selectedItems.userHandles[i];
    if (handle.name === 'devare' && change === 'leftHandle') {
        applyHandle(handle, 'Left', 1, { top: 0, bottom: 0, left: 0, right: 10 }, 'Left', 'Top');

    } else if (handle.name === 'devare' && change === 'rightHandle') {
        applyHandle(handle, 'Right', 1, { top: 0, bottom: 0, left: 10, right: 0 }, 'Right', 'Top');
    }
}
}
//render the nodes in treeview
export function addTreeNode() {
    var treeObj = document.getElementById("treeView").ej2_instances[0]
    var targetNodeId = treeObj.selectedNodes[0];
    var tempData = workingData.filter((a) => a.id === targetNodeId);
    tempData[0].hasChild = true;
    var orientation = getTreeOrientation(tempData);
    var branch = orientation;
    var level = tempData[0].level + 1;
    var strokeColor = tempData[0].strokeColor;
    var fill = tempData[0].fill;
    var nodeId = 'tree_' + index;
    var item = {
        id: nodeId,
        Label: 'Node',
        parentId: targetNodeId,
        branch: branch,
        level: level,
        fill: fill,
        strokeColor: strokeColor,
        hasChild: false,
        orientation: branch
    };
    treeObj.addNodes([item], targetNodeId, null);
    index++;
    workingData.push(item);
    treeObj.beginEdit(nodeId);
}
//To get the orientation of the node 
export function getTreeOrientation(tempData) {
    var leftChildCount = 0;
    var rightChildCount = 0;
    var orientation;
    if (tempData[0].branch === "Root") {
        for (var i = 0; i < workingData.length; i++) {
            if (workingData[i].level === 1) {
                if (workingData[i].orientation === "Left") {
                    leftChildCount++;
                } else {
                    rightChildCount++;
                }
            }
        }
        orientation = leftChildCount > rightChildCount ? "Right" : "Left";
    } else {
        orientation = tempData[0].branch;
    }
    return orientation;
}
//set the value for UserHandle element
export function applyHandle(handle, side, offset, margin, horizontalAlignment, verticalAlignment) {
    handle.side = side;
    handle.offset = offset;
    handle.margin = margin;
    handle.horizontalAlignment = horizontalAlignment;
    handle.verticalAlignment = verticalAlignment;
}
//To get the orientation of the node to be added
export function getOrientation() {
    var diagram = document.getElementById("diagram").ej2_instances[0]
    var leftChildCount = 0;
    var rightChildCount = 0;
    var orientation;
    if (diagram.selectedItems.nodes[0].data.branch === "Root") {
        for (var i = 0; i < diagram.nodes.length; i++) {
            if (diagram.nodes[i].addInfo && diagram.nodes[i].addInfo.level === 1) {
                if (diagram.nodes[i].addInfo.orientation === "Left") {
                    leftChildCount++;
                } else {
                    rightChildCount++;
                }
            }
        }
        orientation = leftChildCount > rightChildCount ? "Right" : "Left";
    } else {
        var selectedNodeOrientation = diagram.selectedItems.nodes[0].addInfo.orientation.toString();
        orientation = selectedNodeOrientation;
    }
    return orientation;

}
//To show the property panel while clicking the add multiple child button in toolbar
export function addMultipleChild() {
    document.getElementById('mindMapContainer').style.display = 'none';
    document.getElementById('multipleChildPropertyContainer').style.display = '';
    document.getElementById('propertyHeader').innerText = "Add Multiple Child";
}

//To add sibling child to the child node
export function addSibilingChild(){
    var diagram = document.getElementById("diagram").ej2_instances[0];
    var selectedNode = diagram.selectedItems.nodes[0];
if (selectedNode.data.branch !== 'Root') {
    var selectedNodeOrientation = selectedNode.addInfo.orientation.toString();
    var orientation_3 = selectedNodeOrientation;
    var connectors = getConnector(diagram.connectors, selectedNode.inEdges[0]);
    diagram.startGroupAction();
    var mindmapData = getMindMapShape(getNode(diagram.nodes, connectors.sourceID));
    var node = mindmapData.node;
    index = index + 1;
    node.id = index.toString();
    if (node.addInfo) {
        node.addInfo.orientation = orientation_3;
    }
    else {
        node.addInfo = { 'orientation': orientation_3 };
    }
    var nodeData = {
        id: node.id,
        Label: 'Node',
        fill: node.style.fill,
        branch: orientation_3,
        strokeColor: node.style.strokeColor,
        parentId: selectedNode.data.id,
        level: node.addInfo.level,
        orientation: node.addInfo.orientation,
        hasChild: false,
    };
    node.data = {
        id: node.id,
        Label: 'Node',
        fill: node.style.fill,
        strokeColor: node.style.strokeColor,
        orientation: node.addInfo.orientation,
        branch: orientation_3,
        parentId: selectedNode.data.id,
        level: node.addInfo.level,
        hasChild: false,
    };
    var tempData = workingData.filter(
        (a) => a.id === selectedNode.data.id
    );
    tempData[0].hasChild = true;
    workingData.push(nodeData);
    diagram.add(node);
    var connector = setConnectorDefault(diagram, orientation_3, mindmapData.connector, connectors.sourceID, node.id);
    diagram.add(connector);
    var node1 = getNode(diagram.nodes, node.id);
    diagram.doLayout();
    diagram.endGroupAction();
    diagram.select([node1]);
    }
}
//define the left userhandle 
class LeftExtendTool extends ToolBase {
    mouseDown(args) {
        super.mouseDown(args);
        this.inAction = true;
    }
    mouseUp(args) {
        if (this.inAction) {
            var selectedElement = this.commandHandler.getSelectedObject();
            var diagram = document.getElementById("diagram").ej2_instances[0];
            if (selectedElement[0] && selectedElement[0].inEdges !== undefined){
                diagram.diagramActions |= DiagramAction.PreventHistory;
                addNode('Right');
                diagram.diagramActions &= ~ DiagramAction.PreventHistory;
            }
        }
    }
}
//define the right userhandle 
class RightExtendTool extends ToolBase {
    //mouseDown event
    mouseDown(args) {
        super.mouseDown(args);
        this.inAction = true;
    }
    //mouseDown event
    mouseUp(args) {
        if (this.inAction) {
            var diagram = document.getElementById("diagram").ej2_instances[0];
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0] && selectedObject[0].inEdges !== undefined){
                diagram.diagramActions |= DiagramAction.PreventHistory;
                addNode('Left');
                diagram.diagramActions &= ~ DiagramAction.PreventHistory;
            }
        }
    }
}
//define the delete userhandle 
class DevareClick extends ToolBase {
    //mouseDown event
    mouseDown(args) {
        super.mouseDown(args);
        this.inAction = true;
    }
    //mouseup event
    mouseUp(args) {
        var diagram=document.getElementById("diagram").ej2_instances[0];
        if (this.inAction) {
            var selectedObject = this.commandHandler.getSelectedObject();
            if (selectedObject[0]) {
                if (selectedObject[0].inEdges !== undefined) {
                    UtilityMethods.prototype.removeChild();
                }
                diagram.doLayout();
            }
        }
    }
    //Remove the subchild Elements
    removeSubChild(node) {
        for (let i = node.outEdges.length - 1; i >= 0; i--) {
            let connector =  this.diagram.getObject(node.outEdges[i]);
            let childNode =  this.diagram.getObject(connector.targetID);
            if (childNode.outEdges.length > 0) {
                this.removeSubChild(childNode);
            }
            else {
                 this.diagram.remove(childNode);
            }
        }
         this.diagram.remove(node);
    }
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.animationSettings = { effect: 'None' };
        this.dropdownListFields = { text: 'text', value: 'value' };
        this.snapSettings ={ constraints: SnapConstraints.None }
        this.scrollSettings = { canAutoScroll: true, scrollLimit: 'Infinity', minZoom: 0.25, maxZoom: 30 };
        this.rulerSettings={ showRulers: true, 
            dynamicGrid: true, horizontalRuler: {
                interval: 10,
                segmentWidth: 100,
                thickness: 25,
            },
            verticalRuler: {
                interval: 10,
                segmentWidth: 100,
                thickness: 25,
            },}
        var leftUserHandle =   this.setUserHandle('leftHandle', leftArrow, 'Left', 0.5, { top: 10, bottom: 0, left: 0, right: 10 }, 'Left', 'Top');
        // eslint-disable-next-line no-use-before-define
        var rightUserHandle =  this.setUserHandle('rightHandle', rightArrow, 'Right', 0.5, { top: 10, bottom: 0, left: 10, right: 0 }, 'Right', 'Top');
        // eslint-disable-next-line no-use-before-define
        var deleteUserHandle =  this.setUserHandle('devare', deleteIcon, 'Top', 0.5, { top: 0, bottom: 0, left: 0, right: 0 }, 'Center', 'Center');
        var handle = [leftUserHandle, rightUserHandle, deleteUserHandle];
        this.selectedItems={ constraints: SelectorConstraints.UserHandle, userHandles: handle }
        this.selectedItem = new SelectorViewModel();
        this.propertyChange = new PropertyChange();
        this.dropDownDataSources = new DropDownDataSources();
        this.diagramEvents = new DiagramClientSideEvents(this.selectedItem, this.page);
        this.diagramEvents.ddlTextPosition = this.ddlTextPosition;
        this.dlgTarget = document.body;
        this.dialogVisibility = false;
        this.isModalDialog = false;
        this.dialogAnimationSettings = { effect: 'None' };
        this.exportingButtons = this.getDialogButtons('export');
        this.printingButtons = this.getDialogButtons('print');
        loadDiagram=this.loadDiagram.bind(this);
        beforItem = this.beforeItemRender.bind(this);
        designContextMenuOpen = this.designContextMenuOpen.bind(this);
        editContextMenuOpen = this.editContextMenuOpen.bind(this);
        beforeOpen = this.arrangeMenuBeforeOpen.bind(this);
        beforeClose = this.arrangeMenuBeforeClose.bind(this);
         menuClick = this.menuClick.bind(this);
        editTool = this.toolbarEditorClick.bind(this);
        hideToolbar = this.hideToolbar.bind(this);
        zoomTemplate = this.zoomTemplate.bind(this);
        diagramView = this.diagramView.bind(this);
        textView =this.textView.bind(this);
        zoomChange = this.zoomChange.bind(this);
        diagramViewChange= this.diagramViewChange.bind(this);
        textViewChange=this.textViewChange.bind(this)
        footTemplate = this.footerTemplate.bind(this);
        printTemplateChange = this.printTemplate.bind(this);
        diagramName = this.diagramNameChange.bind(this);
        getNode=this.getNode.bind(this);
        addNode=this.addNode.bind(this);
        setUserHandle=this.setUserHandle.bind(this);
        getConnector=this.getConnector.bind(this);
        getMindMapShape= this.getMindMapShape.bind(this);
        getNode =this.getNode.bind(this);
        setConnectorDefault=this.setConnectorDefault.bind(this);
    }
    componentDidMount() {
        this.generateDiagram();
        this.uploader();
        document.onmouseover = this.menumouseover.bind(this);
        document.getElementById('closeIconDiv').onclick  =this.onHideNodeClick.bind(this);
    }
    
    render() {
        return (<div>
            <input type="file" id="fileupload" name="UploadFiles"></input>
            <ContextMenuComponent id='designContextMenu' ref={arrangeContextMenu => (this.arrangeContextMenu) = arrangeContextMenu} animationSettings={this.animationSettings} onOpen={designContextMenuOpen} cssClass="designMenu" beforeItemRender={beforItem} select={menuClick} beforeClose={() => this.arrangeMenuBeforeClose}/>
            <div className='diagrambuilder-container' >
                <div className='header navbar'>
                    <div className="db-header-container">
                        <div className="db-diagram-name-container">
                            <span id='diagramName' className="db-diagram-name" style={{
                                width: "250px", overflow: "hidden",
                                textOverflow: "ellipse", whiteSpace: "nowrap"}} onClick ={this.renameDiagram}>
                                Untitled Diagram
                            </span>
                            <input id='diagramEditable' type="text" className="db-diagram-name" onFocus={this.diagramNameKeyDown}/>
                            <span id='diagramreport' className="db-diagram-name db-save-text"/>
                        </div>
                        <div className='db-menu-container'>
                            <div className="db-menu-style">
                                <DropDownButtonComponent id="btnFileMenu" cssClass={"db-dropdown-menu"} content="File" items={this.dropDownDataSources.fileMenuItems}  select={menuClick}
                                beforeItemRender={beforItem} beforeOpen={beforeOpen} beforeClose={beforeClose}/>
                                
                            </div>
                            <div className="db-menu-style">
                                < DropDownButtonComponent id="btnEditMenu" cssClass={"db-dropdown-menu"} content="Edit"
                                    items={this.dropDownDataSources.editMenuItems} select={menuClick} 
                                    beforeItemRender={beforItem} beforeOpen={beforeOpen} beforeClose={beforeClose}/>
                            </div>
                            <div className="db-menu-style">
                                <DropDownButtonComponent id="btnViewMenu" cssClass={"db-dropdown-menu"} content="View" items={this.dropDownDataSources.viewMenuItems}  select={menuClick}
                                beforeItemRender={beforItem} beforeOpen={beforeOpen} beforeClose={beforeClose}/>
                            </div>  
                            <div className="db-menu-style">
                                <DropDownButtonComponent id="btnWindowMenu" cssClass={"db-dropdown-menu"} content="Window" items={this.dropDownDataSources.windowMenuItems}  select={menuClick}
                                beforeItemRender={beforItem} beforeOpen={beforeOpen} beforeClose={beforeClose}/>
                            </div> 
                        </div>
                    </div>
                    <div className='db-toolbar-editor' >
                        <div className='db-toolbar-container'>
                        <ToolbarComponent ref={toolbar => (this.toolbarEditor) = toolbar} id='toolbarEditor' overflowMode='Scrollable' clicked={editTool}>
                            <ItemsDirective>
                                <ItemDirective prefixIcon= 'sf-icon-undo tb-icons' tooltipText= 'Undo' disabled={true}/>
                                <ItemDirective prefixIcon="sf-icon-redo tb-icons" tooltipText="Redo" disabled={true}/>
                                <ItemDirective type="Separator"/>
                                <ItemDirective prefixIcon= 'sf-icon-pointer' tooltipText= 'Select Tool' cssClass='tb-item-middle tb-item-selected disableItem'/>
                                <ItemDirective prefixIcon= 'sf-icon-pan' tooltipText= 'Pan Tool' cssClass='tb-item-middle disableItem'/>
                                <ItemDirective type="Separator"/>
                                <ItemDirective prefixIcon= 'sf-icon-add-child' tooltipText= 'Add Child' disabled="true"/>
                                <ItemDirective prefixIcon= 'sf-icon-add-sibling' tooltipText= 'Add Sibling' disabled="true" />
                                <ItemDirective prefixIcon= 'sf-icon-multiple-child' tooltipText= 'Add Multiple Child' disabled="true"/>
                                <ItemDirective tooltipText="Diagram View" template={diagramView} align='Right'/>
                                <ItemDirective tooltipText="Text View" template={textView} align='Right'/>
                                <ItemDirective type="Separator"/>
                                <ItemDirective cssClass="tb-item-end tb-zoom-dropdown-btn" template={zoomTemplate} align='Right'/>
                            </ItemsDirective>
                        </ToolbarComponent>
                        </div>
                        <div className="db-toolbar-hide-btn">
                        <ButtonComponent  id="btnHideToolbar" isPrimary= {true} iconCss={'sf-icon-properties'} align='Right' onClick={this.hideToolbar.bind(this)}></ButtonComponent>
                        </div>
                    </div>
                </div>
                <div className='row content'>
                    <div className='main-content' role='main'>
                        <div id="treeview" className="db-diagram-container" style={{display: "none", overflow: "auto",}}>
                            <div className="control_wrapper">
                                <div id="tree">
                           
                                <TreeViewComponent  id="treeView" fields={fields} allowEditing={true} nodeEdited={this.nodeEdited.bind(this)} keyPress={this.keyPress.bind(this)}/>
                            </div>
                            <ContextMenuComponent id="contextmenu" target="#treeView" items={this.dropDownDataSources.menuItems} select={this.treemenuclick} beforeOpen={this.beforeopen} />
                                    {/* <ul id="contextmenu"></ul> */}
                            </div>
                        </div>
                        <div id="overlay" className="db-diagram-container" >
                            <div id="diagramContainerDiv" className='db-current-diagram-container'>
                                <DiagramComponent ref={diagram => (this.diagram = diagram)} id="diagram" width={"100%"} height={"100%"}
                                tool={ DiagramTools.SingleSelect} scrollSettings={this.scrollSettings} rulerSettings={this.rulerSettings}
                                snapSettings={this.snapSettings}
                                selectedItems={this.selectedItems}   getCustomTool={this.getTool} 
                                layout={{
                                    //Sets layout type
                                    type: 'MindMap', horizontalSpacing: 50,
                                    verticalSpacing: 50,
                                    orientation:"Horizontal", 
                                    getBranch: function (node) {
                                        if (node.addInfo) {
                                            var addInfo = node.addInfo;
                                            return addInfo.orientation.toString();
                                        }
                                        return 'Left';
                                    }
                                }} 
                                //Configures data source for diagram
                                dataSourceSettings={{
                                    id: 'id',
                                    parentId: 'parentId',
                                    dataSource: items,
                                    root: String(1),
                                }}
                                    selectionChange={this.diagramEvents.selectionChange.bind(this.diagramEvents)}
                                    keyDown={this.diagramEvents.keyDown.bind(this)}
                                    textEdit={this.diagramEvents.textEdit.bind(this.diagramEvents )}
                                    drop= { this.diagramEvents.textEdit.bind(this.diagramEvents) }
                                    historyChange={this.diagramEvents.historyChange.bind(this.diagramEvents)} 
                                    created={this.diagramEvents.created.bind(this)} scrollChange={this.scrollChange.bind(this)} 
                                    getConnectorDefaults={this.getConnectorDefaults.bind(this)}
                                    getNodeDefaults={this.getNodeDefaults.bind(this)}
                                />
                            </div>
                        </div>
                        <div id="shortcutDiv" style={{width:"400px",height:"460px",padding:"10px",backgroundColor:"#fff7b5",border:"1px solid #fff7b5" ,position:"absolute",margin:"27px",visibility:"visible"}}>
                            <div id="closeIconDiv"  style={{width:"22px",height:"22px",padding:"10px",border:"1px solid #fff7b5", float:"right"}} >
                                <span
                                    className="sf-icon-close"
                                    style={{fontSize:"14px", cursor: "pointer"}}
                                ></span>
                            </div>
                            <div><span className="db-html-font-medium">Quick shortcuts</span></div>
                            <div style={{paddingTop:"10px"}}>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Tab : </span>
                                    <span className="db-html-font-normal"
                                        >Add a subtopic to the left</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Shift + Tab : </span>
                                    <span className="db-html-font-normal"
                                        >Add a subtopic to the right</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Enter : </span>
                                    <span className="db-html-font-normal">Add a new sibling child</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Delete / Backspace : </span>
                                    <span className="db-html-font-normal">Delete a topic</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium"
                                        >Arrow(Up, Down, Left, Right) : </span>
                                    <span className="db-html-font-normal">Navigate between topics</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">F2 : </span>
                                    <span className="db-html-font-normal">Edit a topic</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Esc : </span>
                                    <span className="db-html-font-normal">End text editing</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Ctrl + B : </span>
                                    <span className="db-html-font-normal">To make text bold</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Ctrl + I : </span>
                                    <span className="db-html-font-normal">To make text Italic </span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Ctrl + U : </span>
                                    <span className="db-html-font-normal">Underline the text</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Space : </span>
                                    <span className="db-html-font-normal"
                                        >Expand / Collapse the selected node</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">Ctrl + E :</span>
                                    <span className="db-html-font-normal"
                                        >Expand / Collapse the whole diagram</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">F8 : </span>
                                    <span className="db-html-font-normal"
                                        >To Fit the diagram into the viewport</span>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <ul>
                                    <li>
                                    <span className="db-html-font-medium">F1 : </span>
                                    <span className="db-html-font-normal">Show/Hide shortcut Key</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className='db-property-editor-container' id="propertyPanel" style={{overflow:"auto"}}>
                            <div id="propertyHeader" className="row db-prop-header-text">
                                Properties
                            </div>
                            <div id='mindMapContainer' className="db-mindmap-prop-container">
                                <div className="row db-prop-header-text" style={{paddingTop:"8px"}}>
                                    Orientation Styles
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-6 org-pattern-parent">
                                        <div onClick ={this.diagramEvents.mindmapPatternChange.bind(this.diagramEvents)}
                                            className="mindmap-pattern-style mindmap-pattern1"></div>
                                    </div>
                                    <div className="col-xs-6 org-pattern-parent">
                                        <div onClick ={this.diagramEvents.mindmapPatternChange.bind(this.diagramEvents)}
                                            className="mindmap-pattern-style mindmap-pattern2"></div>
                                    </div>
                                </div>
                                <div className="row db-prop-row" style={{marginTop:"5px"}}>
                                    <div className="col-xs-6 org-pattern-parent">
                                        <div onClick ={this.diagramEvents.mindmapPatternChange.bind(this.diagramEvents)}
                                            className="mindmap-pattern-style mindmap-pattern3"></div>
                                    </div>
                                    <div className="col-xs-6 org-pattern-parent">
                                        <div onClick ={this.diagramEvents.mindmapPatternChange.bind(this.diagramEvents)}
                                            className="mindmap-pattern-style mindmap-pattern4"></div>
                                    </div>
                                </div>
                                <div className="db-prop-separator"></div>
                                <div className="row db-prop-header-text">
                                    MindMap Levels Styles
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-12 db-col-left">
                                        <DropDownListComponent id="mindMapLevels" dataSource={this.dropDownDataSources.mindmapLevels} fields={this.dropdownListFields} value={"Level0"} change={this.mindMapLevelsChange.bind(this)}/>
                                    </div>
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-8 db-col-right db-prop-text-style" style={{paddingTop:"5px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Shape</span>
                                        <div className="e-text-spacing">
                                            <DropDownListComponent id="mindMapShape"  value='Rectangle' placeholder="Rectangle" dataSource={this.dropDownDataSources.mindmapShapeDatasource} fields={this.dropdownListFields}  change={this.mindMapShapeChange.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="col-xs-3 db-col-left db-prop-text-style"
                                        style={{paddingTop:"5px",marginLeft:"10px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Fill Color</span>
                                        <div className="db-color-container e-text-spacing">
                                            <div className="db-color-input">
                                                <ColorPickerComponent id='mindmapFill' mode="Palette" showButtons={false} change={this.mindmapFillChange.bind(this)}></ColorPickerComponent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-3 db-col-left db-prop-text-style" style={{paddingTop:"5px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Stroke </span>
                                        <div className="db-color-container e-text-spacing">
                                            <ColorPickerComponent id='mindmapStroke' mode="Palette" showButtons={false} change={this.mindMapStrokeColorChange.bind(this)}></ColorPickerComponent>
                                        </div>
                                    </div>
                                    <div className="col-xs-5 db-col-center db-prop-text-style" style={{paddingTop:"5px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Type</span>
                                        <div className="e-text-spacing">
                                            <DropDownListComponent id="mindmapStrokeStyle" popupWidth="170px" index={0} dataSource={this.dropDownDataSources.borderStyles} fields={this.dropdownListFields} itemTemplate={this.nodeBorderItemTemplate} valueTemplate={this.nodeBorderValueTemplate} change={this.mindmapStrokeStyleChange.bind(this)}/>
                                        </div>
                                    </div>
                                    <div className="col-xs-4 db-col-right db-prop-text-style" style={{paddingTop:"5px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Thickness</span>
                                        <div className="db-text-input e-text-spacing">
                                            <NumericTextBoxComponent  id="mindmapStrokeWidth" min={0.5} step={0.5} value={1} format="###.#" change={this.mindmapStrokeWidthChange.bind(this)}></NumericTextBoxComponent>
                                        </div>
                                    </div>
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-3 db-col-right db-prop-text-style" style={{paddingTop:"6px"}}>
                                        <span className="db-prop-text-style">Opacity</span>
                                    </div>
                                    <div className="col-xs-7 db-col-left" style={{paddingRight:"10px"}}>
                                        <SliderComponent id='mindmapOpacitySlider' min={0} max={100} step={10} value={100} type="MinRange" change={this.mindmapOpacitySliderChange.bind(this)}></SliderComponent>
                                    </div>
                                    <div className="col-xs-2 db-col-right">
                                        <input type="text" readOnly={true} id="mindmapOpacityText" className="db-readonly-input"
                                            value="100%" />
                                    </div>
                                </div>
                                <div className="db-prop-separator"></div>
                                <div className="row db-prop-header-text">
                                    Connector Type
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-4 db-col-left">
                                        <RadioButtonComponent  id="bezierRadioButton" label="Bezier" value="Bezier" name="bezier" checked={true} change={this.bezierChange.bind(this)}/>
                                    </div>
                                    <div className="col-xs-4 db-col-right">
                                        <RadioButtonComponent  id="straightRadioButton" label="Straight" value="Straight" name="straight" checked={false} change={this.straightChange.bind(this)}/>
                                    </div>
                                </div>
                                <div className="db-prop-separator">
                                </div>
                                <div className="row db-prop-header-text">
                                    Text Style
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-8 db-col-left">
                                        <DropDownListComponent id="mindmapFontFamilyList" value="Arial" dataSource={this.dropDownDataSources.fontFamilyList} fields={this.dropdownListFields} change={this.mindmapFontFamilyListChange.bind(this)}/>
                                    </div>
                                    <div className="col-xs-4 db-col-right">
                                        <div className="db-text-input">
                                            <NumericTextBoxComponent  id="mindmapFontSize" min={1} step={1} value={12} format="###" change={this.mindmapFontSizeChange.bind(this)}></NumericTextBoxComponent>
                                        </div>
                                    </div>
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-9 db-col-left">
                                        <ToolbarComponent id='toolbarTextStyle' overflowMode='Scrollable' clicked={this.textStyleClicked.bind(this)}>
                                            <ItemsDirective>
                                                <ItemDirective prefixIcon="e-icons e-bold" tooltipText="Bold" cssClass="tb-item-start"/>
                                                <ItemDirective prefixIcon="e-icons e-italic" tooltipText="Italic" cssClass="tb-item-middle"/>
                                                <ItemDirective prefixIcon="e-icons e-underline" tooltipText="Underline" cssClass="tb-item-end"/>
                                            </ItemsDirective>
                                        </ToolbarComponent>
                                    </div>
                                    <div className="col-xs-3 db-col-right" id="textColorDiv">
                                        <div className="db-color-container">
                                            <div className="db-color-input">
                                                <ColorPickerComponent id='mindmapTextColor' mode="Palette" showButtons={false} change={this.mindmapTextColorChange.bind(this)} ></ColorPickerComponent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-3 db-col-right db-prop-text-style" style={{paddingTop:"6px"}}>
                                        <span className="db-prop-text-style">Opacity</span>
                                    </div>
                                    <div className="col-xs-7 db-col-left" style={{paddingRight:"10px"}}>
                                        <SliderComponent id='mindmapTextOpacitySlider' min={0} max={100} step={10} value={100} type="MinRange" change={this.mindmapTextOpacitySliderChange.bind(this)}></SliderComponent>
                                    </div>
                                    <div className="col-xs-2 db-col-right">
                                        <input type="text" id="textOpacityText" className="db-readonly-input"  readOnly={true}
                                            value="100%" />
                                    </div>
                                </div>
                                <div className="db-prop-separator"></div>
                                <div className="row db-prop-header-text">
                                    Orientation
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-6 db-col-left">
                                        <RadioButtonComponent  id="horizontal" label="Horizontal" value="Horizontal" name="Horizontal" checked={true} change={this.horizontalChange.bind(this)}/>
                                    </div>
                                    <div className="col-xs-4 db-col-right">
                                        <RadioButtonComponent  id="vertical" label="Vertical" value="Vertical" name="Vertical" checked={false} change={this.verticalChange.bind(this)}/>
                                    </div>
                                </div>
                                <div className="db-prop-separator"></div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-8 db-col-right db-prop-text-style" style={{paddingTop:"14px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Horizontal Spacing</span>
                                    </div>
                                    <div className="col-xs-4 db-col-left" style={{paddingTop:"10px"}}>
                                        <div className="db-text-input">
                                            <NumericTextBoxComponent  id="horizontalSpacingBtn" min={50} step={5} max={100} value={50} format="###" change={this.horizontalSpacingBtnChange.bind(this)}></NumericTextBoxComponent>
                                        </div>
                                    </div>
                                    <div className="col-xs-8 db-col-right db-prop-text-style" style={{paddingTop:"14px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Vertical Spacing</span>
                                    </div>
                                    <div className="col-xs-4 db-col-left" style={{paddingTop:"10px"}}>
                                        <div className="db-text-input">
                                            <NumericTextBoxComponent  id="verticalSpacingBtn" min={50} step={5} max={80} value={50} format="###" change={this.verticalSpacingBtnChange.bind(this)}></NumericTextBoxComponent>
                                        </div>
                                    </div>
                                </div>
                                <div className="row db-prop-row">
                                    <div className="col-xs-6 db-col-right db-prop-text-style" style={{paddingTop:"10px"}}>
                                        <CheckBoxComponent id="expandable" label="Expandable" checked={false} change={this.expandableChange.bind(this)}/>
                                    </div>
                                </div>
                            </div>
                            <div id='multipleChildPropertyContainer' className="db-node-prop-container" style={{display:"none"}}>
                                <div className="db-node-behaviour-prop" id="dimen">
                                    <div className="col-xs-12 db-col-right db-prop-text-style" style={{paddingTop:"10px"}}>
                                        <span className="db-prop-text-style db-spacing-text">Please enter one by one</span>
                                    </div>
                                    <div className="row db-prop-row" style={{paddingTop:"10px"}}>
                                        <div className="col-xs-12 db-col-left" style={{height:"65%",marginTop:"5px"}} >
                                            <div style={{height:"95%"}}>
                                            <TextBoxComponent  id="multipleChildText" className="multipleChildText" floatLabelType="Auto" htmlAttributes={htmlAttributes} required={true}  multiline={true}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row db-prop-row">
                                        <div className="col-xs-6 db-col-left" style={{height:"75%"}}>
                                            <ButtonComponent id="cancel" cssClass= 'e-outline' isPrimary={true} onClick={this.cancelOnClick.bind(this)}>Cancel</ButtonComponent>
                                        </div>
                                        <div className="col-xs-6 db-col-left" style={{height:"75%"}}>
                                            <ButtonComponent id="addChild" isPrimary={true} onClick={this.addOnClick.bind(this)} >Add</ButtonComponent>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        <DialogComponent ref={dialog => this.exportDialog = dialog} id="exportDialog" width={"400px"} header='Export Diagram' target={this.dlgTarget} isModal={true} animationSettings={this.dialogAnimationSettings} buttons={this.exportingButtons} showCloseIcon={true} content={footTemplate} visible={this.dialogVisibility}/>
        <DialogComponent id="printDialog" ref={dialog => this.printDialog = dialog} width={"335px"} header='Print Diagram' target={this.dlgTarget} isModal={true} animationSettings={this.dialogAnimationSettings} buttons={this.printingButtons} content={printTemplateChange} visible={this.dialogVisibility}/>
        
        </div>);
    }
    //To rename the title of the diagram
    renameDiagram() {
        document.getElementsByClassName('db-diagram-name-container')[0].classList.add('db-edit-name');
        const element = document.getElementById('diagramEditable');
        element.value = document.getElementById('diagramName').innerHTML;
        element.focus();
        element.select();
    }

    diagramNameKeyDown(args) {
        if (args.which === 13) {
            document.getElementById('diagramName').innerHTML = document.getElementById('diagramEditable').value;
            document.getElementsByClassName('db-diagram-name-container')[0].classList.remove('db-edit-name');
        }
    }
    diagramNameChange() {
        document.getElementById('diagramName').innerHTML = document.getElementById('diagramEditable').value;
        document.getElementsByClassName('db-diagram-name-container')[0].classList.remove('db-edit-name');
        this.selectedItem.exportSettings.fileName = document.getElementById('diagramName').innerHTML;
    }
    generateDiagram() {
        this.selectedItem.selectedDiagram = this.diagram;
        
    }
    // To change the mindmap level
    mindMapLevelsChange(args){
        isToolbarClicked = false;
        levelType = args.value;
    }
    //To change the mindmap shapes
    mindMapShapeChange(args)
    {
        nodeShape = args.value;
        PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'shape', propertyValue: args });
    }
    //To change the fill color of the nodes
      mindmapFillChange(args){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        if (isToolbarClicked) {
            diagram.selectedItems.nodes[0].style.fill = args.currentValue.hex;
            diagram.dataBind();
        } else {
            PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'fill', propertyValue: args });
        }
        
    }
     //To change the stroke color of the nodes/connectors
     mindMapStrokeColorChange(args){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        if (isToolbarClicked) {
            diagram.selectedItems.nodes[0].style.strokeColor = args.currentValue.hex;
            diagram.dataBind();
        } else {
            PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'stroke', propertyValue: args });
        }
    }
    //To change the stroke style
    mindmapStrokeStyleChange(args){
        PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'strokeStyle', propertyValue: args });
    }
    //To change the stoke width
    mindmapStrokeWidthChange(args){
        PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'strokeWidth', propertyValue: args });
    }
    //To change the opacity value
    mindmapOpacitySliderChange(args){
        PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'opacity', propertyValue: args });
    }
    cancelOnClick(){
         document.getElementById('mindMapContainer').style.display = '';
         document.getElementById('multipleChildPropertyContainer').style.display = 'none';
         document.getElementById('propertyHeader').innerText = "Properties";
    }
    //To add the child to the node
    addOnClick()
    {
        var textareaObj = document.getElementById("multipleChildText").ej2_instances[0];
        var diagram = document.getElementById("diagram").ej2_instances[0];
         var childText = textareaObj.value.split('\n');
         var orientation = this.getOrientation();
         for (var i = 0; i < childText.length; i++) {
             addNode(orientation, childText[i], true);
             orientation = diagram.selectedItems.nodes[0].data.branch !== "Root" ? orientation : orientation === "Left" ? "Right" : "Left";
         }
         document.getElementById('mindMapContainer').style.display = '';
         document.getElementById('multipleChildPropertyContainer').style.display = 'none';
         document.getElementById('propertyHeader').innerText = "Properties";
         textareaObj.value = "";
    }
    getOrientation() {
    var leftChildCount = 0;
    var rightChildCount = 0;
    var orientation;
    var diagram = document.getElementById("diagram").ej2_instances[0];
    if (diagram.selectedItems.nodes[0].data.branch === "Root") {
        for (var i = 0; i < diagram.nodes.length; i++) {
            if (diagram.nodes[i].addInfo && diagram.nodes[i].addInfo.level === 1) {
                if (diagram.nodes[i].addInfo.orientation === "Left") {
                    leftChildCount++;
                } else {
                    rightChildCount++;
                }
            }
        }
        orientation = leftChildCount > rightChildCount ? "Right" : "Left";
    } else {
        var selectedNodeOrientation = diagram.selectedItems.nodes[0].addInfo.orientation.toString();
        orientation = selectedNodeOrientation;
    }
    return orientation;

}
//To change the connector to bezier
    bezierChange(){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        var straightRadioButton = document.getElementById("straightRadioButton").ej2_instances[0];
        straightRadioButton.checked = false;
        straightRadioButton.dataBind();
        connectorType = "Bezier";
        for (var i = 0; i < diagram.connectors.length; i++) {
            diagram.connectors[i].type = "Bezier";
            diagram.dataBind();
        }
    }
    //To change the connector to straight
    straightChange(){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        var bezierRadioButton = document.getElementById("bezierRadioButton").ej2_instances[0];
        bezierRadioButton.checked = false;
        bezierRadioButton.dataBind();
        connectorType = "Straight";
        for (var i = 0; i < diagram.connectors.length; i++) {
            diagram.connectors[i].type = "Straight";
            diagram.dataBind();
        }
    }
    //To change the mindmap orientation to horizontal
    horizontalChange(){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        var horizontalButton = document.getElementById("horizontal").ej2_instances[0];
        var verticalButton = document.getElementById("vertical").ej2_instances[0];
        verticalButton.checked = false;
        //horizontalButton.dataBind();
        if(horizontalButton.checked){
            diagram.layout.orientation = "Horizontal";
            diagram.dataBind();
        }
    }
    //To change the mindmap orientation to  vertical
    verticalChange(){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        var horizontalButton = document.getElementById("horizontal").ej2_instances[0];
        var verticalButton = document.getElementById("vertical").ej2_instances[0];
        horizontalButton.checked = false;
        // verticalButton.dataBind();
        if(verticalButton.checked){
            diagram.layout.orientation = "Vertical";
            diagram.dataBind();
        }
    }
    //To change fontfamily of the text
    mindmapFontFamilyListChange(args){
        PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'fontFamily', propertyValue: args });
    }
    //To change font size of the text
    mindmapFontSizeChange(args){
         PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'fontSize', propertyValue: args });
    }
    //To change font color of the text
    mindmapTextColorChange(args){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        if (isToolbarClicked) {
            diagram.selectedItems.nodes[0].annotations[0].style.color = args.currentValue.hex;
            diagram.dataBind();
        } else {
            PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'fontColor', propertyValue: args });
        }
    }
    //To change opacity value of the text
    mindmapTextOpacitySliderChange(args){
        PropertyChange.prototype.mindMapPropertyChange({ propertyName: 'textOpacity', propertyValue: args });
    }
    textStyleClicked(args) {
            PropertyChange.prototype.mindMapPropertyChange({ propertyName: args.item.tooltipText.toLowerCase(), propertyValue: false });
}
// Horizontal spacing
    horizontalSpacingBtnChange(args){
        var diagram = document.getElementById("diagram").ej2_instances[0];
         diagram.layout.horizontalSpacing = Number(args.value);
         diagram.dataBind();
    }
    // vertical spacing
    verticalSpacingBtnChange(args){
         var diagram = document.getElementById("diagram").ej2_instances[0];
         diagram.layout.verticalSpacing = Number(args.value);
         diagram.dataBind();
    }

    expandableChange(args){
          var diagram = document.getElementById("diagram").ej2_instances[0];
         isExpanded = args.checked;
         for (var i = 0; i < diagram.nodes.length; i++) {
             if (diagram.nodes[i].outEdges.length > 0) {
                 diagram.nodes[i].expandIcon.shape = args.checked ? "Minus" : "None";
                 diagram.nodes[i].collapseIcon.shape = args.checked ? "Plus" : "None";
             }
         }
    }
      nodeBorderItemTemplate(data) {
        return (<div className='db-ddl-template-style'><span className={data.className}/></div>);
    }
    ;
    // set the value to value template
    nodeBorderValueTemplate(data) {
        return (<div className='db-ddl-template-style'><span className={data.className}/></div>);
    }
    ;
    //To open the file
    uploader(){
        let uploadObj = new Uploader({
        asyncSettings: {
            saveUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Save',
            removeUrl: 'https://aspnetmvc.syncfusion.com/services/api/uploadbox/Remove'
        },
        success: this.onUploadSuccess,
        showFileList:false
      });
      uploadObj.appendTo('#fileupload');
      }
    
        onUploadSuccess(args) {
        var file1 = args.file;
        var file = file1.rawFile;
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = loadDiagram;
      }
      
      //Load the diagraming object.
      loadDiagram(event) {
        let diagrm = document.getElementById('diagram').ej2_instances[0];
        diagrm.loadDiagram(event.target.result);
      }
      //To add node 
     addNode(orientation, label, canSelect) {
        var selectedNode = this.diagram.selectedItems.nodes[0];
        if (selectedNode.data.branch !== 'Root') {
            var selectedNodeOrientation = selectedNode.addInfo.orientation.toString();
            orientation = selectedNodeOrientation;
        }
        this.diagram.startGroupAction();
        var mindmapData = this.getMindMapShape(selectedNode);
        var node = mindmapData.node;
        this.addMindMapLevels('Level' + node.addInfo.level);
        index = index + 1;
        node.id = index.toString();
        if (node.addInfo) {
            node.addInfo.orientation = orientation;
        }
        else {
            node.addInfo = { 'orientation': orientation };
        }
        selectedNode.expandIcon.shape = isExpanded ? 'Minus' : 'None';
        selectedNode.collapseIcon.shape = isExpanded ? 'Plus' : 'None';
        var nodeData = {
            id: node.id,
            Label: label ? label : "Node",
            fill: node.style.fill,
            branch: orientation,
            strokeColor: node.style.strokeColor,
            parentId: selectedNode.data.id,
            level: node.addInfo.level,
            orientation: node.addInfo.orientation,
            hasChild: false,
        };
        node.data = {
            id: node.id,
            Label: label ? label : "Node",
            fill: node.style.fill,
            strokeColor: node.style.strokeColor,
            orientation: node.addInfo.orientation,
            branch: orientation,
            parentId: selectedNode.data.id,
            level: node.addInfo.level,
            hasChild: false,
        };
        var tempData = workingData.filter(
            (a) => a.id === selectedNode.data.id
        );
        tempData[0].hasChild = true;
        workingData.push(nodeData);
        this.diagram.add(node);
        var connector = this.setConnectorDefault(this.diagram, orientation, mindmapData.connector, selectedNode.id, node.id);
        this.diagram.add(connector);
        var node1 = this.getNode(this.diagram.nodes, node.id);
        this.diagram.doLayout();
        this.diagram.endGroupAction();
        if (!canSelect) {
            this.diagram.select([node1]);
        }
    
        this.diagram.dataBind();
    }

  
     setUserHandle(name, pathData, side, offset, margin, horizontalAlignment, verticalAlignment) {
        var userhandle = {
            name: name,
            pathData: pathData,
            backgroundColor: 'black',
            pathColor: 'white',
            side: side,
            offset: offset,
            margin: margin,
            horizontalAlignment: horizontalAlignment,
            verticalAlignment: verticalAlignment,
        };
        return userhandle;
    }
    //To select the mindmap levels
     addMindMapLevels(level) {
        var mindMap = document.getElementById('mindMapLevels');
        var dropDownList = mindMap.ej2_instances[0];
        var dropDownDataSource = dropDownList.dataSource;
        var isExist = false;
        for (var i = 0; i < dropDownDataSource.length; i++) {
            var data = dropDownDataSource[i];
            if (data.text === level) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            dropDownDataSource.push({ text: level, value: level });
        }
        dropDownList.dataSource = dropDownDataSource;
        dropDownList.dataBind();
    };
    getConnector(connectors, name) {
        for (var i = 0; i < connectors.length; i++) {
            if (connectors[i].id === name) {
                return connectors[i];
            }
        }
        return null;
    };
     getNode(nodes, name) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === name) {
                return nodes[i];
            }
        }
        return null;
    };
    //To get mindmap shape
     getMindMapShape(parentNode) {
        var element = {};
        var node = {};
        var connector = {};
        var addInfo = parentNode.addInfo;
        if (templateType === 'template1') {
            var annotations = {
                //verticalAlignment: 'Bottom', offset: { x: 0.5, y: 0 },
                content: ''
            };
            node = {
                minWidth: 100, maxWidth: 100, shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [annotations], style: { fill: '#000000', strokeColor: '#000000' },
                addInfo: { level: addInfo.level + 1 },
                offsetX: 200, offsetY: 200
            };
            connector = { type: 'Bezier', style: { strokeWidth: 3 } };
        }
        else {
            node = {
                minWidth: 100, maxWidth: 100, shape: { type: 'Basic', shape: 'Rectangle' },
                annotations: [{ content: '' }],
                style: { fill: '#000000', strokeColor: '#000000' },
                addInfo: { level: addInfo.level + 1 },
                offsetX: 200, offsetY: 200
            };
            if (templateType === 'template2') {
                connector = { type: 'Orthogonal', style: { strokeColor: '#000000' } };
            }
            else if (templateType === 'template3') {
                connector = { type: 'Straight', style: { strokeColor: '#000000' } };
            }
            else {
                connector = { type: 'Bezier', style: { strokeColor: '#000000' } };
            }
        }
        if (addInfo.level < 1) {
            node.style.fill = fillColorCode[lastFillIndex];
            node.style.strokeColor = borderColorCode[lastFillIndex];
            ;
            if (lastFillIndex + 1 >= fillColorCode.length) {
                lastFillIndex = 0;
            }
            else {
                lastFillIndex++;
            }
        }
        else {
            node.style.strokeColor = node.style.fill = parentNode.style.fill;
        }
        connector.type = connectorType;
        connector.style.strokeColor = node.style.fill;
        connector.targetDecorator = { shape: 'None' };
        //connector.constraints = ej.diagrams.ConnectorConstraints.PointerEvents | ej.diagrams.ConnectorConstraints.Select | ej.diagrams.ConnectorConstraints.Delete;
        node.constraints = NodeConstraints.Default & ~NodeConstraints.Drag;
        node.ports = [{ id: 'leftPort', offset: { x: 0, y: 0.5 } }, { id: 'rightPort', offset: { x: 1, y: 0.5 } }];
        element.node = node;
        element.connector = connector;
        return element;
    };
    
     setConnectorDefault(diagram, orientation, connector, sourceID, targetID) {
        connector.id = 'connector' + randomId();
        connector.sourceID = sourceID;
        connector.targetID = targetID;
        connector.sourcePortID = 'rightPort';
        connector.targetPortID = 'leftPort';
        if (orientation === 'Right') {
            connector.sourcePortID = 'leftPort';
            connector.targetPortID = 'rightPort';
        }
        connector.style.strokeWidth = 3;
        return connector;
    };
    beforeItemRender(args) {
        const shortCutText = this.getShortCutKey(args.item.text);
        if (shortCutText) {
            const shortCutSpan = createElement('span');
           // const text = args.item.text;
            shortCutSpan.textContent = shortCutText;
            shortCutSpan.style.pointerEvents = 'none';
            args.element.appendChild(shortCutSpan);
            shortCutSpan.setAttribute('class', 'db-shortcut');
        }
        const status = this.enableMenuItems(args.item.text, this.selectedItem);
        if (status) {
            args.element.classList.add('e-disabled');
        }
        else {
            if (args.element.classList.contains('e-disabled')) {
                args.element.classList.remove('e-disabled');
            }
        }
    }
     getTool(action) {
        var tool;
        var  diagram = document.getElementById("diagram").ej2_instances[0];
        if (action === 'leftHandle') {
            tool = new LeftExtendTool(diagram.commandHandler);
        } else if (action === 'rightHandle') {
            tool = new RightExtendTool(diagram.commandHandler);
        } else if (action === 'devare') {
            tool = new DevareClick(diagram.commandHandler);
        }
        return tool;
    }
    //To render the context menu items of design menu item
    designContextMenuOpen(args) {
        if (args.element.classList.contains('e-menu-parent')) {
            const popup = document.querySelector('#btnDesignMenu-popup');
            args.element.style.left = formatUnit(parseInt(args.element.style.left, 10) - parseInt(popup.style.left, 10));
            args.element.style.top = formatUnit(parseInt(args.element.style.top, 10) - parseInt(popup.style.top, 10));
        }
    }
      //To render the context menu items of edit menu item
    editContextMenuOpen(args) {
        if (args.element.classList.contains('e-menu-parent')) {
            var popup = document.querySelector('#btnEditMenu-popup');
            args.element.style.left = formatUnit(parseInt(args.element.style.left, 10) - parseInt(popup.style.left, 10));
            args.element.style.top = formatUnit(parseInt(args.element.style.top, 10) - parseInt(popup.style.top, 10));
        }
    }
    //To render export dialog
    footerTemplate() {
        return (<div id="exportDialogContent">
                <div className="row">
                    <div className="row">
                        File Name
                </div>
                    <div className="row db-dialog-child-prop-row">
                        <input type="text" id="exportfileName" value={UtilityMethods.prototype.fileName()}  autoComplete="off"/>
                    </div>
                </div>
                <div className="row db-dialog-prop-row">
                    <div className="col-xs-6 db-col-left">
                        <div className="row">
                            Format
                    </div>
                        <div className="row db-dialog-child-prop-row">
                            <DropDownListComponent id="exportFormat" ref={dropdown => this.ddlTextPosition = dropdown} value={this.selectedItem.exportSettings.format} dataSource={this.dropDownDataSources.fileFormats} fields={this.dropdownListFields}/>

                        </div>
                    </div>
                </div>
            </div>);
    }
       //To render print dialog
    printTemplate() {
        return (<div id="printDialogContent">
                <div className="row db-dialog-prop-row">
                    <div className="row">
                        Print Settings
                </div>
                    <div className="row db-dialog-child-prop-row">
                        <DropDownListComponent ref={dropdown => this.ddlTextPosition = dropdown} dataSource={this.dropDownDataSources.paperList} fields={this.dropdownListFields} value={this.selectedItem.pageSettings.paperSize}/>
                    </div>
                </div>
                <div id="printCustomSize" className="row db-dialog-prop-row" style={{ display: "none", height: "28px" }}>
                    <div className="col-xs-6 db-col-left">
                        <div className="db-text-container">
                            <div className="db-text">
                                <span>W</span>
                            </div>
                            <div className="db-text-input">
                                <NumericTextBoxComponent id="printPageWidth" min={100} step={1} format="n0" value={this.selectedItem.printSettings.pageWidth}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-6 db-col-right">
                        <div className="db-text-container">
                            <div className="db-text">
                                <span>H</span>
                            </div>
                            <div className="db-text-input">
                                <NumericTextBoxComponent id="printPageHeight" min={100} step={1} format="n0" value={this.selectedItem.printSettings.pageHeight}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="printOrientation" className="row db-dialog-prop-row" style={{ height: "28px", padding: "5px 0px" }}>
                    <div className="col-xs-3 db-prop-col-style" style={{ marginRight: "8px" }}>
                        <RadioButtonComponent id='printPortrait' label="Portrait" name="printSettings" checked={this.selectedItem.printSettings.isPortrait}/>
                    </div>
                    <div className="col-xs-3 db-prop-col-style">
                        <RadioButtonComponent id='printLandscape' label="Landscape" name="printSettings" checked={this.selectedItem.printSettings.isLandscape}/>
                    </div>
                </div>
                <div className="row db-dialog-prop-row" style={{ marginTop: "16px" }}>
                    <CheckBoxComponent id='printMultiplePage' label="Scale to fit 1 page" checked={this.selectedItem.printSettings.multiplePage}/>
                </div>
            </div>);
    }
    //To get th dialog buttons
    getDialogButtons(dialogType) {
        const buttons = [];
        // eslint-disable-next-line
        switch (dialogType) {
            case 'export':
                buttons.push({
                    click: this.btnExportClick.bind(this), buttonModel: { content: 'Export', cssClass: 'e-flat e-db-primary', isPrimary: true }
                });
                break;
            case 'print':
                buttons.push({
                    click: this.btnPrintClick.bind(this), buttonModel: { content: 'Print', cssClass: 'e-flat e-db-primary', isPrimary: true }
                });
                break;
        }
        buttons.push({
            click: this.btnCancelClick.bind(this), buttonModel: { content: 'Cancel', cssClass: 'e-flat', isPrimary: true }
        });
        return buttons;
    }   
    btnExportClick() {
        var diagram = this.selectedItem.selectedDiagram;
        var format= document.getElementById("exportFormat").ej2_instances[0];
        diagram.exportDiagram({
            fileName: this.selectedItem.exportSettings.fileName,
            format: format.value,
           multiplePage:diagram.pageSettings.multiplePage
        });
        this.exportDialog.hide();
    }
    btnPrintClick() {
        let pageWidth = this.selectedItem.printSettings.pageWidth;
        let pageHeight = this.selectedItem.printSettings.pageHeight;
        const paperSize =this.getPaperSize(this.selectedItem.printSettings.paperSize);
        if (paperSize.pageHeight && paperSize.pageWidth) {
            pageWidth = paperSize.pageWidth;
            pageHeight = paperSize.pageHeight;
        }
        if (this.selectedItem.pageSettings.isPortrait) {
            if (pageWidth > pageHeight) {
                const temp = pageWidth;
                pageWidth = pageHeight;
                pageHeight = temp;
            }
        }
        else {
            if (pageHeight > pageWidth) {
                const temp = pageHeight;
                pageHeight = pageWidth;
                pageWidth = temp;
            }
        }
        const diagram = this.selectedItem.selectedDiagram;
        diagram.print({
            "region": this.selectedItem.printSettings.region,
            "pageHeight": pageHeight, "pageWidth": pageWidth,
            "multiplePage": !this.selectedItem.printSettings.multiplePage,
            "pageOrientation": this.selectedItem.printSettings.isPortrait ? 'Portrait' : 'Landscape'
        });
        this.printDialog.hide();
    }
    btnCancelClick(args) {
        const ss = args.target;
        const key = ss.offsetParent.id;
        // eslint-disable-next-line
        switch (key) {
            case 'exportDialog':
                this.exportDialog.hide();
                break;
            case 'printDialog':
                this.printDialog.hide();
                break;
        }
    }
    toolbarEditorClick(args) 
        {
            var diagram = this.selectedItem.selectedDiagram;
            var item = args.item.tooltipText;
            // eslint-disable-next-line default-case
            switch(item)
            {
                case 'Undo':
                    diagram.undo();
                    break;
                case 'Redo':
                    diagram.redo();
                    break;
                case 'Select Tool':
                    diagram.clearSelection();
                    diagram.tool = DiagramTools.Default;
                    break;
                case 'Pan Tool':
                    diagram.clearSelection()
                    diagram.tool = DiagramTools.ZoomPan;
                    break;
                case 'Add Child':
                    var orientation = getOrientation();
                    addNode(orientation);
                    break;
                case 'Add Sibling':
                    addSibilingChild();
                    break;
                case 'Add Multiple Child':
                    addMultipleChild();
                    break;
            }
            if (item === 'Undo' || item === 'Redo' || item === 'Select Tool' || item === 'Pan Tool' || item === 'Add Child' || item === 'Add Sibling' || item === 'Add Multiple Child') {
                if (args.item.cssClass.indexOf('tb-item-selected') === -1) {
                    removeSelectedToolbarItem();
                    args.item.cssClass += ' tb-item-selected';
                }
                diagram.dataBind();
            }
            diagram.dataBind();
        };
//Zoom change button in toolbar
    zoomTemplate() {
        return (<div id="template_toolbar">
            <DropDownButtonComponent id="btnZoomIncrement" items={this.dropDownDataSources.zoomMenuItems} content={this.selectedItem.scrollSettings.currentZoom} select={zoomChange}/>
        </div>);
    }
    //diagram view radio button in toolbar
    diagramView(){
         return (<div id="template_toolbar" style={{marginLeft:"2px"}}>
         <RadioButtonComponent id="diagramView"value="Diagram View" name="mindmapView" label="Diagram View" checked={true} change={diagramViewChange}></RadioButtonComponent>
     </div>);
        
    }
    //textview radio button in toolbar
    textView(){
        return (<div id="template_toolbar" style={{marginLeft:"2px"}}>
        <RadioButtonComponent id="textview"value="Text View" name="mindmapView" label="Text View" change={textViewChange}></RadioButtonComponent>
    </div>);
    }
    nodeEdited(args){
        var treeObj = document.getElementById("treeView").ej2_instances[0]
        var tempData = workingData.filter((a) => a.id === args.nodeData.id);
        tempData[0].Label = args.newText;
        treeObj.selectedNodes = [args.nodeData.id];
    }
    keyPress(args){
        if (args.event.key === 'Enter') {
           addTreeNode();
        } else {
            setTimeout(() => {
                console.log(args);
            }, 0);
        }
    }
   // To enable the toolbar items
    enableMenuItems(itemText, selectedItem) {
        let diagram = document.getElementById("diagram").ej2_instances[0];
        let selectedItems = selectedItem.selectedDiagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(selectedItem.selectedDiagram.selectedItems.connectors);
        if (itemText) {
            var commandType = itemText.replace(/[' ']/g, '');
            if (selectedItems.length === 0) {
                // eslint-disable-next-line default-case
                switch (commandType.toLowerCase()) {
                    case 'edittooltip':
                        var disable = false;
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
                // eslint-disable-next-line default-case
                switch (commandType.toLowerCase()) {
                    case 'edittooltip':
                        return true;
                }
            }
            if (!(diagram.commandHandler.clipboardData.pasteIndex !== undefined
                && diagram.commandHandler.clipboardData.clipObject !== undefined) && itemText === 'Paste') {
                return true;
            }
            if (itemText === 'Undo' && selectedItem.selectedDiagram.historyManager.undoStack.length === 0) {
                return true;
            }
            if (itemText === 'Redo' && selectedItem.selectedDiagram.historyManager.redoStack.length === 0) {
                return true;
            }
            if (itemText === 'Select All') {
                if ((selectedItem.selectedDiagram.nodes.length === 0 && selectedItem.selectedDiagram.connectors.length === 0)) {
                    return true;
                }
            }
            if (itemText === 'Themes') {
                return true;
            }
            if (itemText === 'Show Shortcuts' && document.getElementById('overlay').style.display === 'none') {
                return true;
            }
        }
        return false;
    }
    //Method to change the values of zoom dropdown in toolbar
    zoomChange(args) {
        var zoomCurrentValue = document.getElementById("btnZoomIncrement").ej2_instances[0];
        var diagram = this.selectedItem.selectedDiagram;
        var currentZoom = diagram.scrollSettings.currentZoom;
        var zoom = {};
        // eslint-disable-next-line default-case
        switch (args.item.text) {
            case 'Zoom In':
                diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
                zoomCurrentValue.content = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
                break;
            case 'Zoom Out':
                diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
                zoomCurrentValue.content = (diagram.scrollSettings.currentZoom * 100).toFixed() + '%';
                break;
            case 'Zoom to Fit':
                zoom.zoomFactor = 1 / currentZoom - 1;
                diagram.zoomTo(zoom);
                zoomCurrentValue.content = diagram.scrollSettings.currentZoom;
                break;
            case 'Zoom to 50%':
                zoom.zoomFactor = (0.5 / currentZoom) - 1;
                diagram.zoomTo(zoom);
                break;
            case 'Zoom to 100%':
                zoom.zoomFactor = (1 / currentZoom) - 1;
                diagram.zoomTo(zoom);
                break;
            case 'Zoom to 200%':
                zoom.zoomFactor = (2 / currentZoom) - 1;
                diagram.zoomTo(zoom);
                break;
        }
      
        zoomCurrentValue.content = Math.round(diagram.scrollSettings.currentZoom*100) + ' %';
        
    }
      //Method to change diagramview in toolbar
    diagramViewChange(){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        var btnWindowMenu = document.getElementById("btnWindowMenu").ej2_instances[0];
        let toolbarObj = document.getElementsByClassName('disableItem');
        toolbarObj[0].style.cssText = 'pointer-events: all !important; opacity:1';
        toolbarObj[1].style.cssText = 'pointer-events: all !important; opacity:1';
         diagram.dataSourceSettings.dataSource = new DataManager(workingData);
         diagram.dataBind();
         document.getElementById('propertyPanel').style.display = 'block';
         document.getElementById('overlay').style.display = 'block';
         document.getElementById('treeview').style.display = 'none';
         document.getElementById('shortcutDiv').style.visibility = 'visible';
         btnWindowMenu.items[2].iconCss = document.getElementById('shortcutDiv').style.visibility === "hidden" ? '' : 'sf-icon-check-tick';
         diagram.fitToPage();
    }
    //Method to change treeview in toolbar
    textViewChange(){ 
        var diagram = document.getElementById("diagram").ej2_instances[0];
        diagram.clearSelection();
        var toolbarObj = document.getElementsByClassName('disableItem');
        toolbarObj[0].style.cssText = 'pointer-events: none !important; opacity:0.5';
        toolbarObj[1].style.cssText = 'pointer-events: none !important; opacity:0.5';
        var treeObj = document.getElementById("treeView").ej2_instances[0];
        treeObj.fields.dataSource = new DataManager(workingData);
        treeObj.dataBind();
        document.getElementById('propertyPanel').style.display = 'none';
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('treeview').style.display = 'block';
        document.getElementById('shortcutDiv').style.visibility = 'hidden';
    }
    treemenuclick(args){
    var treeObj = document.getElementById("treeView").ej2_instances[0]
        var targetNodeId = treeObj.selectedNodes[0];
        if (args.item.text === "Add New Item") {
            addTreeNode();
        }
        else if (args.item.text === "Remove Item") {
            treeObj.removeNodes([targetNodeId]);
            for (var i = workingData.length - 1; i >= 0; i--) {
                if (workingData[i].id === targetNodeId) {
                    workingData.splice(i, 1);
                }
            }
        }
        else if (args.item.text === "Rename Item") {
            treeObj.beginEdit(targetNodeId);
        }
   }
   //To get shortcut keys for the menu items
    getShortCutKey(menuItem) {
        let shortCutKey = navigator.platform.indexOf('Mac') > -1 ? 'Cmd' : 'Ctrl';
        // eslint-disable-next-line
        switch (menuItem) {
            case 'New':
              // eslint-disable-next-line
                shortCutKey = 'Shift' + '+N';
                break;
            case 'Open':
                shortCutKey = shortCutKey + '+O';
                break;
            case 'Save':
                shortCutKey = shortCutKey + '+S';
                break;
            case 'Undo':
                shortCutKey = shortCutKey + '+Z';
                break;
            case 'Redo':
                shortCutKey = shortCutKey + '+Y';
                break;
            case 'Cut':
                shortCutKey = shortCutKey + '+X';
                break;
            case 'Copy':
                shortCutKey = shortCutKey + '+C';
                break;
            case 'Paste':
                shortCutKey = shortCutKey + '+V';
                break;
            case 'Delete':
                shortCutKey = 'Delete';
                break;
            case 'Duplicate':
                shortCutKey = shortCutKey + '+D';
                break;
            case 'Select All':
                shortCutKey = shortCutKey + '+A';
                break;
            case 'Zoom In':
                shortCutKey = shortCutKey + '++';
                break;
            case 'Zoom Out':
                shortCutKey = shortCutKey + '+-';
                break;
            case 'Group':
                shortCutKey = shortCutKey + '+G';
                break;
            case 'Ungroup':
                shortCutKey = shortCutKey + '+U';
                break;
            case 'Send To Back':
                shortCutKey = shortCutKey + '+Shift+B';
                break;
            case 'Bring To Front':
                shortCutKey = shortCutKey + '+Shift+F';
                break;
            default:
                shortCutKey = '';
                break;
        }
        return shortCutKey;
    }
    scrollChange(args){
        var diagram=this.selectedItem.selectedDiagram;
        var zoomCurrentValue = document.getElementById("btnZoomIncrement");
        if (zoomCurrentValue && zoomCurrentValue.ej2_instances) {
            zoomCurrentValue = document.getElementById("btnZoomIncrement").ej2_instances[0];
            zoomCurrentValue.content = Math.round(diagram.scrollSettings.currentZoom * 100) + ' %';
        }
     }
     //To set the nodes default values
     getNodeDefaults(obj){
        if (obj.id !== 'textNode' && obj.data) {
            //obj.constraints = draggableCheckbox.checked ?NodeConstraints.Default |NodeConstraints.AllowDrop :NodeConstraints.Default & ~NodeConstraints.Drag;
            var empInfo = obj.data;
            obj.style = {
                fill: obj.data.fill, strokeColor: obj.data.strokeColor,
                strokeWidth: 1
            };
            if (empInfo.branch === 'Root') {
                obj.addInfo = { level: 0 };
                obj.data.level = obj.addInfo.level;
                obj.data.orientation = empInfo.branch;
            }
            obj.addInfo = { level: obj.data.level, orientation: obj.data.orientation };
            if (obj.data.orientation === "Left") {
                obj.expandIcon = { shape: isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 1, y: 0.5 } };
                obj.collapseIcon = { shape: isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 1, y: 0.5 } };
            } else if (obj.data.orientation === "Root") {
                obj.expandIcon = { shape: isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0.5, y: 1 } };
                obj.collapseIcon = { shape: isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0.5, y: 1 } };
            } else {
                obj.expandIcon = { shape: isExpanded ? 'Minus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0, y: 0.5 } };
                obj.collapseIcon = { shape: isExpanded ? 'Plus' : 'None', height: 10, width: 10, fill: 'white', borderColor: 'black', offset: { x: 0, y: 0.5 } };
            }
            obj.shape.cornerRadius = empInfo.branch === 'Root' ? 5 : 0;
            obj.shape = empInfo.branch === 'Root' ? { type: 'Basic', shape: 'Ellipse' } : { type: 'Basic', shape: 'Rectangle' };
            obj.width = empInfo.branch === 'Root' ? 150 : 100;
            obj.height = empInfo.branch === 'Root' ? 75 : childHeight;
            obj.annotations = [{
                content: empInfo.Label,

            }];
            var port = this.getPort();
            if (!obj.ports.length) {
                    obj.ports=port;
            }
           hideUserHandle('Top');
        }
        setTimeout(function () {
            if (mindMapPatternTarget) {
                this.diagramEvents.mindmapPatternChange(mindMapPatternTarget);
            }
        }, 0);

        return obj;
     }
      //Defining the port values
     getPort() {
        var port =
            [{
                id: 'leftPort', offset: { x: 0, y: 0.5 }, visibility: PortVisibility.Hidden,
                style: { fill: 'black' }
            },
            {
                id: 'rightPort', offset: { x: 1, y: 0.5 }, visibility: PortVisibility.Hidden,
                style: { fill: 'black' }
            },
            ];
        return port;
    }
    //To set the connector default values
    getConnectorDefaults(connector) {
        var diagram = document.getElementById("diagram").ej2_instances[0];
        connector.type = connectorType;
        connector.targetDecorator = { shape: 'None' };
        var sourceNode = diagram.getObject(connector.sourceID);
        var targetNode = diagram.getObject(connector.targetID);
        if (targetNode.data.branch === 'Right' || targetNode.data.branch === 'subRight') {
            connector.sourcePortID = sourceNode.ports[0].id;
            connector.targetPortID = targetNode.ports[1].id;
            connector.style = { strokeWidth: 1, strokeColor: '#8E44AD' };
        }
        else if (targetNode.data.branch === 'Left' || targetNode.data.branch === 'subLeft') {
            connector.sourcePortID = sourceNode.ports[1].id;
            connector.targetPortID = targetNode.ports[0].id;
            connector.style = { strokeWidth: 1, strokeColor: '#3498DB' };
        }
        connector.constraints &= ~ConnectorConstraints.Select;
        return connector;
    };
   //selection change event
    selectionChange(arg){
          if (arg.state === 'Changing') {
            var diagram = document.getElementById("diagram").ej2_instances[0];
            if (arg.newValue[0] instanceof Node && arg.newValue[0].addInfo) {
                for (var _i = 0, _a = diagram.selectedItems.userHandles; _i < _a.length; _i++) {
                    var handle_1 = _a[_i];
                    handle_1.visible = true;
                }
                if (arg.newValue[0].addInfo.orientation === 'Left' ||
                    arg.newValue[0].addInfo.orientation === 'subLeft') {
                   hideUserHandle('leftHandle');
                    this.changeUserHandlePosition('leftHandle');
                }
                else if (arg.newValue[0].addInfo.orientation === 'Right' ||
                    arg.newValue[0].addInfo.orientation === 'subRight') {
                       hideUserHandle('rightHandle');
                        this.changeUserHandlePosition('rightHandle');
                }
                else if (arg.newValue[0].data.branch === 'Root') {
                   hideUserHandle('devare');
                }
                UtilityMethods.prototype.onClickDisable(false, arg.newValue[0]);
            }
            else {
               hideUserHandle('leftHandle');
               hideUserHandle('rightHandle');
               hideUserHandle('devare');
                UtilityMethods.prototype.onClickDisable(true);
            }
        }
    }

    arrangeMenuBeforeOpen(args) {
        for (var i = 0; i < args.element.children.length; i++) {
            args.element.children[i].style.display = 'block';
        }
        
        if (args.event && closest(args.event.target, '.e-dropdown-btn') !== null) {
            args.cancel = true;
        }
        
    }
    arrangeMenuBeforeClose(args) {
        if (args.event && closest(args.event.target, '.e-dropdown-btn') !== null) {
            args.cancel = true;
        }
        if (!args.element) {
            args.cancel = true;
        }
    }
   
   beforeopen(args) {
        var treeObj = document.getElementById("treeView").ej2_instances[0]
        var menuObj = document.getElementById("contextmenu").ej2_instances[0]
        var targetNodeId = treeObj.selectedNodes[0];
        var targetNode = document.querySelector('[data-uid="' + targetNodeId + '"]');
        if(targetNode){
            if (targetNode.classList.contains('remove')) {
                menuObj.enableItems(['Remove Item'], false);
            }
            else {
                menuObj.enableItems(['Remove Item'], true);
            }
            if (targetNode.classList.contains('rename')) {
                menuObj.enableItems(['Rename Item'], false);
            }
            else {
                menuObj.enableItems(['Rename Item'], true);
            }
        }
        else{
            args.cancel =true;
        }
}
//event triggered on menu items click
   menuClick(args) {
        const buttonElement = document.getElementsByClassName('e-btn-hover')[0];
        if (buttonElement) {
            buttonElement.classList.remove('e-btn-hover');
        }
        const diagram = this.selectedItem.selectedDiagram;
        const commandType = args.item.text;
        var zoomCurrentValue = document.getElementById("btnZoomIncrement").ej2_instances[0];
        var currentZoom = diagram.scrollSettings.currentZoom;
        var zoom = {};
        // eslint-disable-next-line default-case
        switch (commandType) {
            case 'New':
                diagram.clear();
                break;
            case 'Open':
                document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
                break;
            case 'Save':
                this.download(diagram.saveDiagram());
                break;
            case 'Print':
                this.selectedItem.printSettings.pageHeight = this.selectedItem.pageSettings.pageHeight;
                this.selectedItem.printSettings.pageWidth = this.selectedItem.pageSettings.pageWidth;
                this.selectedItem.printSettings.paperSize = this.selectedItem.pageSettings.paperSize;
                this.selectedItem.printSettings.isPortrait = this.selectedItem.pageSettings.isPortrait;
                this.selectedItem.printSettings.isLandscape = !this.selectedItem.pageSettings.isPortrait;
                this.printDialog.show();
                break;
            case 'Export':
                this.exportDialog.show();
                break;
            case 'Undo':
                diagram.undo();
                break;
            case 'Redo':
                diagram.redo();
                break;
            case 'Cut':
                diagram.cut();
                break;
            case 'Copy':
                diagram.copy();
                break;
            case 'Paste':
                diagram.paste();
                break;
            case 'Delete':
                diagram.remove();
                break;
            case 'Select All':
                diagram.clearSelection();
                diagram.selectAll();
                break;
            case "Zoom In":
                diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 });
                zoomCurrentValue.content = this.selectedItem.scrollSettings.currentZoom
                break;
            case 'Zoom Out':
                diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 });
                zoomCurrentValue.content = this.selectedItem.scrollSettings.currentZoom
                break;
            case 'Show Toolbar':
                UtilityMethods.prototype.hideElements('hide-toolbar', diagram);
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
          
            case 'Show Properties':
                UtilityMethods.prototype.hideElements('hide-properties', diagram);
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
            case 'Show Shortcuts':
                var node1 = document.getElementById('shortcutDiv');
                node1.style.visibility = node1.style.visibility === "hidden" ? node1.style.visibility = "visible" : node1.style.visibility = "hidden";
                args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                break;
                case 'Show Lines':
                    diagram.snapSettings.constraints = diagram.snapSettings.constraints ^ SnapConstraints.ShowLines;
                    args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                    break;
                case 'Show Rulers':
                    args.item.iconCss = args.item.iconCss ? '' : 'sf-icon-check-tick';
                    diagram.rulerSettings.showRulers = !diagram.rulerSettings.showRulers;
                    break;
                case 'Fit To Screen':
                    zoom.zoomFactor = 1 / currentZoom - 1;
                    diagram.zoomTo(zoom);
                    zoomCurrentValue.content = diagram.scrollSettings.currentZoom;
                    break;
        }
        diagram.dataBind();
    }
    //To hide the toolbar container
    hideToolbar(){
        var diagram = document.getElementById("diagram").ej2_instances[0];
        var btnWindowMenu = document.getElementById("btnWindowMenu").ej2_instances[0];
        // var expandcollapseicon = document.getElementById('btnHideToolbar');
        UtilityMethods.prototype.hideElements('hide-properties', diagram);
        btnWindowMenu.items[1].iconCss = btnWindowMenu.items[1].iconCss ? '' : 'sf-icon-check-tick';
    }
    //To change the paper size
    paperListChange(args,diagram)
    {
        var value = args.item.value;
        var paperSize = this.getPaperSize(value);
        var pageWidth = paperSize.pageWidth;
        var pageHeight = paperSize.pageHeight;
        if (pageWidth && pageHeight) {
            if (diagram.pageSettings.orientation === 'Portrait') {
                if (pageWidth > pageHeight) {
                    var temp = pageWidth;
                    pageWidth = pageHeight;
                    pageHeight = temp;
                }
            }
            else {
                if (pageHeight > pageWidth) {
                    // eslint-disable-next-line no-redeclare
                    var temp = pageHeight;
                    pageHeight = pageWidth;
                    pageWidth = temp;
                }
            }
            diagram.pageSettings.width = pageWidth;
            diagram.pageSettings.height = pageHeight;
        }
        else{
            diagram.pageSettings.width = 1460;
            diagram.pageSettings.height = 600;
        }
        let designContextMenu = document.getElementById('designContextMenu').ej2_instances[0];
        this.updatePaperSelection(designContextMenu.items[1],args.item.value);
        diagram.dataBind();
    };
    updatePaperSelection (items,value)
    {
        for(var i=0;i<items.items.length;i++)
        {
         if(value === items.items[i].value){
             items.items[i].iconCss = 'sf-icon-check-tick';
         }
         else{
             items.items[i].iconCss = '';
         }
        }
    };
  //To check and uncheck the menu items
    updateSelection(item)
    {
        for(var i=0;i<item.parentObj.items.length;i++)
        {
            if(item.text === item.parentObj.items[i].text){
                item.parentObj.items[i].iconCss = 'sf-icon-check-tick';
            }
            else{
                item.parentObj.items[i].iconCss = '';
            }
        }
    };
    getPaperSize (args)
    {
        var paperSize = new PaperSize();
        // eslint-disable-next-line default-case
        switch (args) {
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
            case 'A0':
                paperSize.pageWidth = 3179;
                paperSize.pageHeight = 4494;
                break;
             case 'A1':
                paperSize.pageWidth = 2245;
                paperSize.pageHeight = 3179;
                break;
             case 'A2':
                paperSize.pageWidth = 1587;
                paperSize.pageHeight = 2245;
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
        return paperSize
    };
    //To save the diagram
    download(data)
    {
        if (window.navigator.msSaveBlob) {
            var blob = new Blob([data], { type: 'data:text/json;charset=utf-8,' });
            window.navigator.msSaveOrOpenBlob(blob, 'Diagram.json');
        }
        else {
            var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(data);
            var a = document.createElement('a');
            a.href = dataStr;
            a.download = document.getElementById('diagramName').innerHTML+'.json';
            document.body.appendChild(a);
            a.click();
            a.remove();
        }
    };
    menumouseover(args) {
        var target = args.target;
        var diagram=this.selectedItem.selectedDiagram
        if (target && (target.className === 'e-control e-dropdown-btn e-lib e-btn db-dropdown-menu' ||
        target.className === 'e-control e-dropdown-btn e-lib e-btn db-dropdown-menu e-ddb-active')) {
        if (this.buttonInstance && this.buttonInstance.id !== target.id) {
            if (this.buttonInstance.getPopUpElement().classList.contains('e-popup-open')) {
                this.buttonInstance.toggle();
                var buttonElement = document.getElementById(this.buttonInstance.element.id);
                buttonElement.classList.remove('e-btn-hover');
            }
        }
        var button1 = target.ej2_instances[0];
        this.buttonInstance = button1;
        if (button1.getPopUpElement().classList.contains('e-popup-close')) {
            button1.toggle();
            if (button1.element.id === 'btnArrangeMenu') {
             UtilityMethods.prototype.enableArrangeMenuItems(diagram);
            }
            var buttonElement1 = document.getElementById(this.buttonInstance.element.id);
            buttonElement1.classList.add('e-btn-hover');
        }
    } else {
        if (closest(target, '.e-dropdown-popup') === null && closest(target, '.e-dropdown-btn') === null) {
            if (this.buttonInstance && this.buttonInstance.getPopUpElement().classList.contains('e-popup-open')) {
                this.buttonInstance.toggle();
                var buttonElement2 = document.getElementById(this.buttonInstance.element.id);
                buttonElement2.classList.remove('e-btn-hover');
            }
        }
    }
    }
    onHideNodeClick(args) {
        var node1 = document.getElementById('shortcutDiv');
        var diagram = document.getElementById('diagram').ej2_instances[0];
        var btnWindowMenu = document.getElementById("btnWindowMenu").ej2_instances[0];
        node1.style.visibility = node1.style.visibility === "hidden" ? node1.style.visibility = "visible" : node1.style.visibility = "hidden";
        btnWindowMenu.items[2].iconCss = node1.style.visibility === "hidden" ? '' : 'sf-icon-check-tick';
        diagram.dataBind();
    }
   enableEditMenuItems(diagram) {
        var contextInstance = document.getElementById('editContextMenu');
        var contextMenu = contextInstance.ej2_instances[0];
        var selectedItems = diagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(diagram.selectedItems.connectors);
        for (var i = 0; i < contextMenu.items.length; i++) {
            contextMenu.enableItems([contextMenu.items[i].text], false);
        }
        var objects = diagram.selectedItems.nodes.concat(diagram.selectedItems.connectors);
        if (objects.length > 0) {
            contextMenu.enableItems(['Cut', 'Copy', 'Delete', 'Order Commands', 'Rotate']);
        }
        if (diagram.historyManager.undoStack.length > 0) {
            contextMenu.enableItems(['Undo']);
        }
        if (diagram.historyManager.redoStack.length > 0) {
            contextMenu.enableItems(['Redo']);
        }
        if ((diagram.commandHandler.clipboardData.pasteIndex !== undefined
            && diagram.commandHandler.clipboardData.clipObject !== undefined)) {
            contextMenu.enableItems(['Paste']);
        }
    }
    

}

export default App;
