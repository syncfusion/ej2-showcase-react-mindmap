export class DropDownDataSources {
    constructor() {
        this.fileMenuItems = this.getFileMenuItems();
        this.editMenuItems = this.getEditMenuItems();
        this.viewMenuItems = this.getViewMenuItems();
        this.windowMenuItems = this.getWindowMenuItems();
        //To specify file format items
        this.fileFormats = [
            { text: 'JPG', value: 'JPG' }, { text: 'PNG', value: 'PNG' },
            { text: 'SVG', value: 'SVG' }
        ];
         //To specify diagram regions items
        this.diagramRegions = [
            { text: 'Content', value: 'Content' }
        ];
         //To specify format that we can import
        this.importFormat = [
            { text: 'CSV', value: 'CSV' }, { text: 'XML', value: 'XML' }, { text: 'JSON', value: 'JSON' }
        ];
         //To specify the styles of the border
        this.borderStyles = [
            { text: 'None', value: 'None', className: 'ddl-svg-style ddl_linestyle_none' },
            { text: '1,2', value: '1,2', className: 'ddl-svg-style ddl_linestyle_one_two' },
            { text: '3,3', value: '3,3', className: 'ddl-svg-style ddl_linestyle_three_three' },
            { text: '5,3', value: '5,3', className: 'ddl-svg-style ddl_linestyle_five_three' },
            { text: '4,4,1', value: '4,4,1', className: 'ddl-svg-style ddl_linestyle_four_four_one' }
        ];
        //To specify the context menu items
        this.menuItems = [
            { text: 'Add New Item' },
            { text: 'Rename Item' },
            { text: 'Remove Item' }
        ];
        //To specify the font family items
        this.fontFamilyList = [
            { text: 'Arial', value: 'Arial' },
            { text: 'Aharoni', value: 'Aharoni' },
            { text: 'Bell MT', value: 'Bell MT' },
            { text: 'Fantasy', value: 'Fantasy' },
            { text: 'Times New Roman', value: 'Times New Roman' },
            { text: 'Segoe UI', value: 'Segoe UI' },
            { text: 'Verdana', value: 'Verdana' },
        ];
     //To specify the mindmap Levels items
        this.mindmapLevels = [
            { text: 'Root', value: 'Level0' }, { text: 'Level1', value: 'Level1' },
            { text: 'Level2', value: 'Level2' }, { text: 'Level3', value: 'Level3' },
            { text: 'Level4', value: 'Level4' }, { text: 'Level5', value: 'Level5' },
        ];
    //To specify the mindmap shapes items
      this.mindmapShapeDatasource=[
                { text: 'Rectangle', value: 'Rectangle' }, { text: 'Ellipse', value: 'Ellipse' },
                { text: 'Star', value: 'Star' }, { text: 'Cloud', value: 'Cloud' },
                { text: 'Free hand', value: 'Free hand' }, { text: 'Line', value: 'Line' },
            ];
        //To specify the zoom items
        this.zoomMenuItems = [
            { text: 'Zoom In' },{ text: 'Zoom Out' },{ text: 'Zoom to Fit' },{ text: 'Zoom to 50%' },
            { text: 'Zoom to 100%' },{ text: 'Zoom to 200%' },
        ];
        this.paperList = [
            { text: 'Letter (8.5 in x 11 in)', value: 'Letter' }, { text: 'Legal (8.5 in x 14 in)', value: 'Legal' },
            { text: 'Tabloid (279 mm x 432 mm)', value: 'Tabloid' }, { text: 'A3 (297 mm x 420 mm)', value: 'A3' },
            { text: 'A4 (210 mm x 297 mm)', value: 'A4' }, { text: 'A5 (148 mm x 210 mm)', value: 'A5' },
            { text: 'A6 (105 mm x 148 mm)', value: 'A6' }, { text: 'Custom', value: 'Custom' },
        ];
    }
    // define the File Menu Items
    getFileMenuItems() {
        const menuItems = [
            { text: 'New', iconCss: 'sf-icon-new' },
                { text: 'Open', iconCss: 'sf-icon-open' },
                { separator: true },
                { text: 'Save', iconCss: 'sf-icon-save' },
                { separator: true },
                { text: 'Export', iconCss: 'sf-icon-export'},
                { text: 'Print', iconCss: 'sf-icon-print' },
        ];
        return menuItems;
    }
    // define the Edit Menu Items
    getEditMenuItems() {
        const menuItems = [
            { text: 'Undo', iconCss: 'sf-icon-undo' },
            { text: 'Redo', iconCss: 'sf-icon-redo' },
            { separator: true },
            { text: 'Cut', iconCss: 'sf-icon-cut' },
            { text: 'Copy', iconCss: 'sf-icon-copy' },
            { text: 'Paste', iconCss: 'sf-icon-paste' },
            { separator: true },
            { text: 'Delete', iconCss: 'sf-icon-delete' },
            { separator: true },
            { text: 'Select All' }
        ];
        return menuItems;
    }
    // define the View Menu Items
    getViewMenuItems() {
        const menuItems = [
            { text: 'Zoom In', iconCss: 'sf-icon-zoom-in' }, 
            { text: 'Zoom Out', iconCss: 'sf-icon-zoom-out' }, { separator: true },
            { text: 'Fit To Screen' }, { separator: true },
            { text: 'Show Rulers', iconCss: 'sf-icon-check-tick' },
            { text: 'Show Lines' },
        ];
        return menuItems;
    }
    // define the Window Menu Items
    getWindowMenuItems() {
        const menuItems1 = [
            { text: 'Show Toolbar', iconCss: 'sf-icon-check-tick' },
            { text: 'Show Properties', iconCss: 'sf-icon-check-tick' },
            { text: 'Show Shortcuts', iconCss: 'sf-icon-check-tick' },
        ];
        return menuItems1;
    }
    // define the paperlist Menu Items
    paperList(){
        var items =[
            { text: 'Letter (8.5 in x 11 in)', value: 'Letter',iconCss:'sf-icon-check-tick'  }, { text: 'Legal (8.5 in x 14 in)', value: 'Legal' },
            { text: 'Tabloid (279 mm x 432 mm)', value: 'Tabloid' }, { text: 'A3 (297 mm x 420 mm)', value: 'A3' },
            { text: 'A4 (210 mm x 297 mm)', value: 'A4' }, { text: 'A5 (148 mm x 210 mm)', value: 'A5' },
            { text: 'A6 (105 mm x 148 mm)', value: 'A6' }
        ]
        return items;
    }
}