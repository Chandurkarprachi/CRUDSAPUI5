var count = 1000;
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Fragment,MessageBox) {
        "use strict";

        return Controller.extend("registrationform.controller.View1", {
            onInit: function () {
                var oPage = this.getView().byId("page");
                oPage.addStyleClass("myBackgroundStyle");
                this.tData = [];
                this.index;
                this.flag = [];
                // this.student = {
                //     id: "",
                //     firstname: "",
                //     lastname: ""
                // };
            },
            Tilepress:function(oEvent){
                this.getView().byId("_IDGenToolbar1").setVisible(false);
                this.getView().byId("manageTile").setVisible(false);
                this.getView().byId("addTile").setVisible(true);
                this.getView().byId("viewTile").setVisible(true);
                this.getView().byId("toolbar1").setVisible(true);
                
            },
            onBack(oEvent){
                this.getView().byId("_IDGenToolbar1").setVisible(false);
                this.getView().byId("manageTile").setVisible(true);
            },
            onBack1(oEvent){
                this.getView().byId("manageTile").setVisible(true);
                this.getView().byId("_IDGenToolbar1").setVisible(false);
                this.getView().byId("addTile").setVisible(false);
                this.getView().byId("viewTile").setVisible(false);
                this.getView().byId("toolbar1").setVisible(false);
                this.getView().byId("Texport").setVisible(false);
            },
            oDialogPopup: null,
            onAddStudent: function (oEvent) {
                
                if (!this.oDialogPopup) {
                    this.oDialogPopup = sap.ui.xmlfragment("registrationform.fragments.form", this);
                    var oDialogModel = new sap.ui.model.json.JSONModel();
                    this.oDialogPopup.setModel(oDialogModel);

                }//end of if
                // this.oDialogPopup.getModel().setData(this.student);
                //var data = JSON.parse(JSON.stringify(this.student));
                //this.oDialogPopup.getModel().setData(data);
                sap.ui.getCore().byId("btnEdit").setVisible(false);
                sap.ui.getCore().byId("btnSave").setVisible(true);
                this.oDialogPopup.open();

            },
            onSave: function (oEvent) {
                //get the values from input

                var firstname = sap.ui.getCore().byId("idName").getValue();
                var lastname = sap.ui.getCore().byId("idLasName").getValue();
                count++;
                //before pushing data validate the values
                this.flag[0] = this.validate(sap.ui.getCore().byId("idName"), firstname, "FirstName", 1);
                this.flag[1] = this.validate(sap.ui.getCore().byId("idLasName"), lastname, "LastName", 1);
                //(id,value,text,mandatory)

                for (var i = 0; i < this.flag.length - 1; i++) {
                    if (this.flag[i] === 1 && this.flag[1] === 1) {
                        this.tData.push({
                            firstname: firstname,
                            lastname: lastname,
                            studid: count
                        });
                        //creating new Table Model to insert input data in model so that we can bind the data to the table
                        this.oTableModel = new sap.ui.model.json.JSONModel();
                        //setting tData to the table model
                        this.oTableModel.setData(this.tData);
                        //getting table object
                        var oTable = this.getView().byId("Texport");
                        oTable.setModel(this.oTableModel, "TableModel");
                        oTable.getModel("TableModel").refresh();
                        this.Clear();
                        this.oDialogPopup.close();
                        MessageBox.success("Student Record Created");

                    }
                }
                this.getView().byId("Texport").setVisible(false);

            },
            validate: function (id, val, txt, mandatory) {
                var len = val.length;
                if (len === 0 && mandatory === 1) {
                    id.setValueStateText(txt + " must not be empty.");
                    id.setValueState("Error");
                    id.focus();
                    return (0);
                }
                else {
                    id.setValueState("None");
                    return (1);
                }
            },
            onEdit: function (oEvent) {
                sap.ui.getCore().byId("btnEdit").setVisible(true);
                sap.ui.getCore().byId("btnSave").setVisible(false);
                this.index = Number(oEvent.getSource().getBindingContext("TableModel").sPath[1]);
                var oCurrentRecord = oEvent.getSource().getBindingContext("TableModel").getObject();
                var currentFname = oCurrentRecord.firstname;
                var currentLname = oCurrentRecord.lastname;
                sap.ui.getCore().byId("idName").setValue(currentFname);
                sap.ui.getCore().byId("idLasName").setValue(currentLname);
                this.oDialogPopup.open();
                // sap.ui.getCore().byId("_IDGenSimpleForm1").setBindingContext(oCurrentRecord);          
            },
            onEditSave: function () 
            {
                var firstname = sap.ui.getCore().byId("idName").getValue();
                var lastname = sap.ui.getCore().byId("idLasName").getValue();
             
                this.flag[0] = this.validate(sap.ui.getCore().byId("idName"), firstname, "FirstName", 1);
                this.flag[1] = this.validate(sap.ui.getCore().byId("idLasName"), lastname, "LastName", 1);
                for (var i = 0; i < this.flag.length - 1; i++) {
                    if (this.flag[i] === 1 && this.flag[1] === 1) {
                        var removed = this.tData.splice(this.index, 1);
                        var oldStudId = removed[0].studid;
                        this.tData.splice(this.index, 0, {
                            firstname: firstname,
                            lastname: lastname,
                            studid: oldStudId
                        });
                        this.oTableModel.setData(this.tData);
                        var oTable = this.getView().byId("Texport");
                        oTable.setModel(this.oTableModel, "TableModel");
                        this.Clear();
                        this.oDialogPopup.close();
                    }//if
                }//FOR

            },
            Clear: function () {
                sap.ui.getCore().byId("idName").setValue("");
                sap.ui.getCore().byId("idLasName").setValue("");
            },
            onCancel: function () {
                this.Clear();
                this.oDialogPopup.close();
            },
            onDelete: function (oEvent) {
                var index = Number(oEvent.getSource().getBindingContext("TableModel").sPath[1]);
                var aData = this.oTableModel.getData();
                aData.splice(index, 1);
                this.oTableModel.setData(aData);
                var oTable = this.getView().byId("Texport");
                oTable.setModel(this.oTableModel, "TableModel");
                this.oDialogPopup.close();
            },
            showStudList:function(oEvent){

                this.getView().byId("Texport").setVisible(true);
                this.getView().byId("toolbar1").setVisible(true);
                this.getView().byId("_IDGenToolbar1").setVisible(false);
                this.getView().byId("manageTile").setVisible(false);
                this.getView().byId("addTile").setVisible(false);
                this.getView().byId("viewTile").setVisible(false);
            }
        });
    });
