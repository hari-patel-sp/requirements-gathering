(function($){
  $(function(){

    if (typeof(Storage) !== "undefined") {
      retrieveProgress();
    } else {
      showModal("Error. Please use a browser that supports HTML5 local storage.");
    }

    $('.sidenav').sidenav();
    $('select').formSelect();

    $("#logo-container").click(function(){goToHome();});
    $("#get-started-button").click(function(){goToStep(0);});

    $("#close-modal").click(function(){$("#modal").hide();});

    $("#cancel-modal").click(function(){$("#reset-modal").hide();});
    $("#accept-modal").click(function(){localStorage.clear(); $("#reset-modal").hide(); window.location.reload();});

    $("#cancel-send-button").click(function(){cancelSend();});
    $("#download-button").click(function(){downloadResponses();});
    $("#send-button").click(function(){sendAsEmail();});

    $("#next-button").click(function(){goToNext();});
    $("#prev-button").click(function(){goToPrev();});

    $("#save-1").click(function(){saveProgress();});
    $("#save-2").click(function(){saveProgress();});
    $("#send-1").click(function(){showSendToSailPointForm();});
    $("#send-2").click(function(){showSendToSailPointForm();});

    $("#wizard-hr").click(function(){goToStep(0);});
    $("#wizard-applications").click(function(){goToStep(1);});
    $("#wizard-authentication").click(function(){goToStep(2);});
    $("#wizard-password").click(function(){goToStep(3);});
    $("#wizard-identities").click(function(){goToStep(4);});
    $("#wizard-conversions").click(function(){goToStep(5);});
    $("#wizard-provisioning").click(function(){goToStep(6);});
    $("#wizard-rolesAndAccess").click(function(){goToStep(7);});
    $("#wizard-certifications").click(function(){goToStep(8);});
    $("#wizard-integrations").click(function(){goToStep(9);});

    $("#add-hr-source-link").click(function(){addHRSource();});
    $("#add-application-link").click(function(){addApplication();});
    $("#add-lcs-link").click(function(){addLCS();});
    $("#add-conversions-link").click(function(){addConversion();});
    
    $("#reset-link").click(function(){confirmReset();});

  });
})(jQuery);

var steps = ['hr','applications','authentication','password','identities','conversions','provisioning','rolesAndAccess','certifications','integrations'];
var dataModel = JSON.parse("{\r\n" + 
"	\"hr\": [\"name\", \"populationType\", \"aggFrequency\", \"sandbox\", \"connector\", \"managerCorrelation\", \"comments\"],\r\n" + 
"	\"applications\": [\"name\", \"populationType\", \"aggFrequency\", \"sandbox\", \"connector\", \"accountCorrelation\", \"numberOfAccounts\", \"numberOfEntitlements\", \"purpose\", \"adminAccounts\", \"adminAccountFilter\", \"comments\"],\r\n" + 
"	\"authentication\": [\"authenticationSource\", \"singleSignOn\", \"passwordReset\", \"mfa\", \"providerMfa\", \"comments\"],\r\n" + 
"	\"password\": [\"passwordInterceptor\", \"desktopPasswordReset\", \"sourcesToSync\", \"comments\"],\r\n" + 
"	\"identities\": [\"lcsName\", \"logic\", \"applicationName*\", \"accessChange*\", \"comments*\"],\r\n" + 
"	\"conversions\": [\"type\", \"applicationName*\", \"accessChange*\", \"comments*\"],\r\n" + 
"	\"provisioning\": [\"name\", \"birthrightAccess\", \"rbac\", \"emailNotifications\", \"emailList\", \"accountIDLogic\", \"passwordLogic\", \"comments\"],\r\n" + 
"	\"rolesAndAccess\": [\"robo\", \"forRobo\", \"rbac\", \"approvalProcesses\", \"descRbac\", \"comments\"],\r\n" + 
"	\"certifications\": [\"managerCerts\", \"sourceOwnerCerts\", \"certFrequency\", \"eventBased\", \"descEventBased\", \"adHoc\", \"descAdHoc\", \"comments\"],\r\n" + 
"	\"integrations\": [\"ticketingSystem\", \"sandbox\", \"comments\"]\r\n" + 
"}");
var codeToEnglish = JSON.parse("{\"regex\":[{\"input\":\"hr-name\",\"replacement\":\"Source Name\"},{\"input\":\"hr-populationType\",\"replacement\":\"Population\"},{\"input\":\"hr-aggFrequency\",\"replacement\":\"Aggregation Frequency\"},{\"input\":\"hr-sandbox\",\"replacement\":\"Sandbox Environment Exists?\"},{\"input\":\"hr-connector\",\"replacement\":\"SailPoint Connector\"},{\"input\":\"hr-managerCorrelation\",\"replacement\":\"Manager Correlation Info\"},{\"input\":\"hr-comments\",\"replacement\":\"Comments\"},{\"input\":\"applications-name\",\"replacement\":\"Application Name\"},{\"input\":\"applications-populationType\",\"replacement\":\"Population\"},{\"input\":\"applications-aggFrequency\",\"replacement\":\"Aggregation Frequency\"},{\"input\":\"applications-sandbox\",\"replacement\":\"Sandbox Environment Exists?\"},{\"input\":\"applications-connector\",\"replacement\":\"SailPoint Connector\"},{\"input\":\"applications-accountCorrelation\",\"replacement\":\"Account Correlation Info\"},{\"input\":\"applications-numberOfAccounts\",\"replacement\":\"Number of Accounts\"},{\"input\":\"applications-numberOfEntitlements\",\"replacement\":\"Number of Entitlements\"},{\"input\":\"applications-purpose\",\"replacement\":\"Purpose of Application\"},{\"input\":\"applications-adminAccounts\",\"replacement\":\"Admin Accounts in Source?\"},{\"input\":\"applications-adminAccountFilter\",\"replacement\":\"Admin Accounts Identified By\"},{\"input\":\"applications-comments\",\"replacement\":\"Comments\"},{\"input\":\"authentication-authenticationSource\",\"replacement\":\"Authentication Source for IDN\"},{\"input\":\"authentication-singleSignOn\",\"replacement\":\"Single Sign On?\"},{\"input\":\"authentication-passwordReset\",\"replacement\":\"Password Reset?\"},{\"input\":\"authentication-mfa\",\"replacement\":\"MFA?\"},{\"input\":\"authentication-providerMfa\",\"replacement\":\"MFA Provider\"},{\"input\":\"authentication-comments\",\"replacement\":\"Comments\"},{\"input\":\"password-passwordInterceptor\",\"replacement\":\"Require Password Interceptor?\"},{\"input\":\"password-desktopPasswordReset\",\"replacement\":\"Require Desktop Password Reset?\"},{\"input\":\"password-sourcesToSync\",\"replacement\":\"Sources to Sync\"},{\"input\":\"password-comments\",\"replacement\":\"Comments\"},{\"input\":\"identities-lcsName\",\"replacement\":\"Lifecycle State\"},{\"input\":\"identities-logic\",\"replacement\":\"LCS Logic\"},{\"input\":\"identities-applicationName\",\"replacement\":\"Application Name\"},{\"input\":\"identities-accessChange\",\"replacement\":\"Changes in Access\"},{\"input\":\"identities-comments\",\"replacement\":\"Comments\"},{\"input\":\"conversions-type\",\"replacement\":\"Type of Conversion\"},{\"input\":\"conversions-applicationName\",\"replacement\":\"Application Name\"},{\"input\":\"conversions-accessChange\",\"replacement\":\"Changes in Access\"},{\"input\":\"conversions-comments\",\"replacement\":\"Comments\"},{\"input\":\"provisioning-name\",\"replacement\":\"Application Name\"},{\"input\":\"provisioning-birthrightAccess\",\"replacement\":\"Birthright Access to Grant\"},{\"input\":\"provisioning-rbac\",\"replacement\":\"Using Role-Based Access?\"},{\"input\":\"provisioning-emailNotifications\",\"replacement\":\"Send Notifications on Create?\"},{\"input\":\"provisioning-emailList\",\"replacement\":\"Person(s) to Notify\"},{\"input\":\"provisioning-accountIDLogic\",\"replacement\":\"Account ID Generation Logic\"},{\"input\":\"provisioning-passwordLogic\",\"replacement\":\"Initial Password Logic\"},{\"input\":\"provisioning-comments\",\"replacement\":\"Comments\"},{\"input\":\"rolesAndAccess-robo\",\"replacement\":\"Allow Requests on Behalf Of?\"},{\"input\":\"rolesAndAccess-forRobo\",\"replacement\":\"Allow ROBO For\"},{\"input\":\"rolesAndAccess-rbac\",\"replacement\":\"Using Role-Based Access?\"},{\"input\":\"rolesAndAccess-approvalProcesses\",\"replacement\":\"Access Request Approval Workflows\"},{\"input\":\"rolesAndAccess-descRbac\",\"replacement\":\"Role-Based Access Requirements\"},{\"input\":\"rolesAndAccess-comments\",\"replacement\":\"Comments\"},{\"input\":\"certifications-managerCerts\",\"replacement\":\"Manager Certifications?\"},{\"input\":\"certifications-sourceOwnerCerts\",\"replacement\":\"Source Owner Certifications?\"},{\"input\":\"certifications-certFrequency\",\"replacement\":\"Frequency of Certifications\"},{\"input\":\"certifications-eventBased\",\"replacement\":\"Certifications Driven Off Events?\"},{\"input\":\"certifications-descEventBased\",\"replacement\":\"Event-Driven Certification Requirements\"},{\"input\":\"certifications-adHoc\",\"replacement\":\"One-Off/Ad Hoc Certifications?\"},{\"input\":\"certifications-descAdHoc\",\"replacement\":\"One-Off/Ad Hoc Certification Requirements\"},{\"input\":\"certifications-comments\",\"replacement\":\"Comments\"},{\"input\":\"integrations-ticketingSystem\",\"replacement\":\"Ticketing System Name\"},{\"input\":\"integrations-sandbox\",\"replacement\":\"Sandbox Environment Available?\"},{\"input\":\"integrations-comments\",\"replacement\":\"Comments\"}]}");

function saveProgress() {

  var moduleCounter = 0;
  var savedData = JSON.parse("{\"data\":[]}");

  var savedStep = 0;
  if("savedStep" in localStorage) {savedStep = localStorage.getItem("savedStep");}
  
  for(var module=0; module<steps.length; module++) {
    //For each module
    var moduleName = steps[module];
    var moduleDTO = "";
    var dataObj = JSON.parse("{\"category\":\""+moduleName+"\",\"attributes\":{\"sources\":[]}}");

    switch(moduleName) {
      case "hr": moduleDTO = dataModel.hr; break;
      case "applications": moduleDTO = dataModel.applications; break;
      case "authentication": moduleDTO = dataModel.authentication; break;
      case "identities": moduleDTO = dataModel.identities; break;
      case "password": moduleDTO = dataModel.password; break;
      case "conversions": moduleDTO = dataModel.conversions; break;
      case "provisioning": moduleDTO = dataModel.provisioning; break;
      case "rolesAndAccess": moduleDTO = dataModel.rolesAndAccess; break;
      case "certifications": moduleDTO = dataModel.certifications; break;
      case "integrations": moduleDTO = dataModel.integrations; break;
    }
    
    $('.row[data-class="'+moduleName+'-card"]').each(function(){
      var id = $(this).attr('id');
      var counter = id.replace(moduleName+"-card-","");

      //For each entry in the module, build the JSON object
      var entryObj = JSON.parse("{}");
      for(var dtoCounter=0; dtoCounter<moduleDTO.length; dtoCounter++) {
        var dtoVariable = moduleDTO[dtoCounter];

        if(dtoVariable.includes("*")) {
          //We have multiple sources as part of this attribute; need to cycle through them all
          $('.row[data-class="applications-card"]').each(function(){
            var id = $(this).attr('id');
            var thisID = 0;
            thisID = id.replace("applications-card-","");
            var entryObjVar = dtoVariable.replace("*","")+"-"+thisID;
            entryObj[entryObjVar] = $("#"+moduleName+"-"+entryObjVar+"-"+counter).val();
          });
        }
        else {
          //Not source-specific
          entryObj[dtoVariable] = $("#"+moduleName+"-"+dtoVariable+"-"+counter).val();
        }
      }
      dataObj.attributes.sources.push(entryObj);
    });

    savedData.data.push(dataObj);
  }

  localStorage.setItem("savedData", JSON.stringify(savedData));
  
  //Update the saved step to the current one if it's larger than previously saved
  var currStep = 0;
  var savedStep = 0;
  if("currStep" in localStorage) {currStep = localStorage.getItem("currStep");}
  if("savedStep" in localStorage) {savedStep = localStorage.getItem("savedStep");}

  if(currStep >= savedStep) {
    localStorage.setItem("savedStep", currStep);
  }

  var appChanges = "false";
  if("appChanges" in localStorage) {appChanges = localStorage.getItem("appChanges");}

  if(appChanges == "true") {
    //Dynamically populate the source dropdowns/cards as needed
    refreshApplications();
  }
}

function retrieveProgress() {
  var savedData = JSON.parse(localStorage.getItem("savedData"));
  var hr = false;
  var applications = false;
  var identities = false;
  var conversions = false;
  var provisioning = false;
  
  if(savedData != null) {
    var savedStep = 0;
    if("savedStep" in localStorage) {savedStep = localStorage.getItem("savedStep");}


    for(var module=0; module<steps.length; module++) {
      //For each module
      var dataObj = savedData.data[module];
      if(typeof dataObj !== "undefined") {
        var moduleName = dataObj.category;
        var arrayCounter = 1;
        var entries = dataObj.attributes.sources;

        switch(moduleName) {
          case "hr": moduleDTO = dataModel.hr; break;
          case "applications": moduleDTO = dataModel.applications; break;
          case "authentication": moduleDTO = dataModel.authentication; break;
          case "identities": moduleDTO = dataModel.identities; break;
          case "password": moduleDTO = dataModel.password; break;
          case "conversions": moduleDTO = dataModel.conversions; break;
          case "provisioning": moduleDTO = dataModel.provisioning; break;
          case "rolesAndAccess": moduleDTO = dataModel.rolesAndAccess; break;
          case "certifications": moduleDTO = dataModel.certifications; break;
          case "integrations": moduleDTO = dataModel.integrations; break;
        }

        do {
          //For each entry in the module, get the JSON object and render it to the UI
          if(moduleName == "hr") { renderHRSourceCard(arrayCounter); hr = true;}
          if(moduleName == "applications") { renderApplicationCard(arrayCounter); applications = true;}
          if(moduleName == "identities") { renderLCSCard(arrayCounter); identities = true;}
          if(moduleName == "conversions") { renderConversionCard(arrayCounter); conversions = true;}

          var entryObj = entries[arrayCounter-1];
          if(typeof entryObj !== "undefined") {
            for(var dtoCounter=0; dtoCounter<moduleDTO.length; dtoCounter++) {
              var dtoVariable = moduleDTO[dtoCounter];
              if(dtoVariable.includes("*")) {
                //We have multiple sources as part of this attribute; need to cycle through them all
                $('.row[data-class="applications-card"]').each(function(){
                  var id = $(this).attr('id');
                  var thisID = 0;
                  thisID = id.replace("applications-card-","");
                  var entryObjVar = dtoVariable.replace("*","")+"-"+thisID;
                  $("#"+moduleName+"-"+entryObjVar+"-"+arrayCounter).val(entryObj[entryObjVar]);
                });
              }
              else {
                //Not source-specific
                $("#"+moduleName+"-"+dtoVariable+"-"+arrayCounter).val(entryObj[dtoVariable]);
              }
            }
          }
          arrayCounter++;
        }
        while(arrayCounter<=entries.length);
      }
    }

  }

  //Dynamically populate the source dropdowns/cards as needed
  refreshApplications();
}

function showModal(content) {
  $("#modal-content").html(content);
  $("#modal").show();
}

function goToHome() {
  saveProgress();
  $("#index-banner").show();
  $("#index-send").hide();

  //Hide the forms and the progress bar
  $("#wizard-progress").hide();
  $("#step-buttons").hide();
  $(".user-form").each(function(){
    $(this).hide();
  });

  $('html, body').animate({
    scrollTop: 0
  }, 0);
}

function goToNext() {
  var currStep = 0;
  if("currStep" in localStorage) {currStep = parseInt(localStorage.getItem("currStep"));}

  if(currStep == 1) {
    //Need to set app changes to true so that auth card refreshes
    localStorage.setItem("appChanges","true");
  }
  
  if(currStep == 9) {
    showSendToSailPointForm();
  }
  else {
    goToStep(currStep + 1);
  }
}

function goToPrev() {
  var currStep = 0;
  if("currStep" in localStorage) {currStep = parseInt(localStorage.getItem("currStep"));}

  if(currStep == 0) {
    goToHome();
  }
  else {
    goToStep(currStep - 1);
  }
}

function goToStep(loc) {
  var targetStepName = steps[loc];

  //Hide the greeting
  $("#index-banner").hide();
  $("#index-send").hide();

  //Update the progress bar
  var savedStep = 0;
  if("savedStep" in localStorage) {savedStep = localStorage.getItem("savedStep");}
  
  for(var k=0; k<steps.length; k++) {
    var thisStep = steps[k];

    if(k == loc) {
      $("#wizard-"+thisStep).removeClass("active").removeClass("incomplete").addClass("active");
    }
    else if(k<=savedStep && savedStep>0) {
      $("#wizard-"+thisStep).removeClass("active").removeClass("incomplete").addClass("completed");
    }
    else {
      $("#wizard-"+thisStep).removeClass("completed").removeClass("active").addClass("incomplete");
    }

    $('html, body').animate({
      scrollTop: 0
    }, 0);
    
  }

  //Show the progress bar and the right form
  $("#wizard-progress").show();
  $("#step-buttons").show();
  $(".user-form").each(function(){
    $(this).hide();
  });
  $("#"+targetStepName).show();

  //Save the current location
  var appChanges = false;
  if("appChanges" in localStorage) {appChanges = localStorage.getItem("appChanges");}

  localStorage.setItem("currStep",loc);
  if(loc > 0) {
    saveProgress();
  }
}

function addHRSource() {

  //Get the next sourceNum
  var numHRSources = parseInt(getHRSourceCount());
  var sourceNum = numHRSources + 1;

  renderHRSourceCard(sourceNum);
  saveProgress();

  $('html, body').animate({
    scrollTop: $("#hr-card-"+sourceNum).offset().top
  }, 'medium');
}

function addApplication() {

  //Get the next sourceNum
  var numApplications = parseInt(getApplicationCount());
  var appNum = numApplications + 1;

  renderApplicationCard(appNum);
  localStorage.setItem("appChanges","true");
  saveProgress();
  localStorage.setItem("appChanges","true");

  $('html, body').animate({
    scrollTop: $("#applications-card-"+appNum).offset().top
  }, 'medium');
}

function addLCS() {

  //Get the next sourceNum
  var numLCSStates = parseInt(getLCSCount());
  var lcsNum = numLCSStates + 1;

  renderLCSCard(lcsNum);
  saveProgress();
  $('html, body').animate({
    scrollTop: $("#identities-card-"+lcsNum).offset().top
  }, 'medium');
}

function addConversion() {

  //Get the next sourceNum
  var numConversions = parseInt(getConversionCount());
  var conversionNum = numConversions + 1;

  renderConversionCard(conversionNum);
  saveProgress();
  $('html, body').animate({
    scrollTop: $("#conversions-card-"+conversionNum).offset().top
  }, 'medium');
}

function removeHRSource(e,cardNum) {
  var e = e || window.event;
  e.preventDefault();
  $("#hr-card-"+cardNum).remove();
  saveProgress();
}

function removeApplication(e,cardNum) {
  var e = e || window.event;
  e.preventDefault();
  $("#applications-card-"+cardNum).remove();

  localStorage.setItem("appChanges","true");
  saveProgress();
  localStorage.setItem("appChanges","true");
}

function removeLCS(e,cardNum) {
  var e = e || window.event;
  e.preventDefault();
  $("#identities-card-"+cardNum).remove();
  saveProgress();
}

function removeConversion(e,cardNum) {
  var e = e || window.event;
  e.preventDefault();
  $("#conversions-card-"+cardNum).remove();
  saveProgress();
}

function getHRSourceCount() {
  var maxID = 0;
  $('.row[data-class="hr-card"]').each(function(){
    var id = $(this).attr('id');
    maxID = id.replace("hr-card-","");
  });
  return maxID;
}

function getApplicationCount() {
  var maxID = 0;
  $('.row[data-class="applications-card"]').each(function(){
    var id = $(this).attr('id');
    maxID = id.replace("applications-card-","");
  });
  return maxID;
}

function getLCSCount() {
  var maxID = 0;
  $('.row[data-class="identities-card"]').each(function(){
    var id = $(this).attr('id');
    maxID = id.replace("identities-card-","");
  });
  return maxID;
}

function getConversionCount() {
  var maxID = 0;
  $('.row[data-class="conversions-card"]').each(function(){
    var id = $(this).attr('id');
    maxID = id.replace("conversions-card-","");
  });
  return maxID;
}

function confirmReset() {
    $("#reset-modal").show();
}

function renderHRSourceCard(sourceNum) {

  var hidden = "";
  if(sourceNum == 1) {hidden = "hidden";}

  var newHTML = "<div class=\"row\" data-class=\"hr-card\" id=\"hr-card-"+sourceNum+"\">\r\n" + 
  "            <div class=\"col s12 m12 l12\">\r\n" + 
  "              <div class=\"card grey lighten-4\">\r\n" + 
  "                <div class=\"card-content\">\r\n" + 
  "                  <span class=\"card-title\">HR Source "+sourceNum+"<div class=\"right remove-link deep-orange-text darken-4 "+hidden+"\" onclick=\"removeHRSource(event,'"+sourceNum+"');\">Remove</div></span>\r\n" + 
  "                  <div class=\"row\">\r\n" + 
  "                    <form class=\"col s12 m12 l12\">\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"input-field col s12 m6 l4\">\r\n" + 
  "                          <input data-class=\"hr\" placeholder=\"\" data-key=\"name\" id=\"hr-name-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"hr-name-"+sourceNum+"\">Application Name</label>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l4\">\r\n" + 
  "                          <select class=\"indigo-text darken-4\" data-class=\"hr\" data-key=\"populationType\" id=\"hr-populationType-"+sourceNum+"\">\r\n" + 
  "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"All Workers\">All Workers</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Full-Time Employees Only\">Full-Time Employees Only</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Contingent Workers Only\">Contingent Workers Only</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Contractors Only\">Contractors Only</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Full-Time and Contractors\">Full-Time and Contractors</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Full-Time and Contingent\">Full-Time and Contingent</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Contractors and Contingent\">Contractors and Contingent</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Other\">Other (describe in comments)</option>\r\n" + 
  "                          </select>\r\n" + 
  "                          <label>Worker Population</label>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l2\">\r\n" + 
  "                          <input data-class=\"hr\" placeholder=\"\" data-key=\"aggFrequency\" id=\"hr-aggFrequency-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"hr-aggFrequency-"+sourceNum+"\">Data Change Freq.</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">What does this mean?<span class=\"tooltiptext\">This is how often we would need to read user records from the system in order to capture changes in a timely fashion.</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l2\">\r\n" + 
  "                          <select class=\"indigo-text darken-4\" data-class=\"hr\" data-key=\"sandbox\" id=\"hr-sandbox-"+sourceNum+"\">\r\n" + 
  "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Yes\">Yes</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"No\">No</option>\r\n" + 
  "                          </select>\r\n" + 
  "                          <label>Sandbox/Dev Instance?</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">What does this mean?<span class=\"tooltiptext\">Is there a 'test' system or dummy data available for us to develop against?</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"input-field col s12 m6 l6\">\r\n" + 
  "                          <select class=\"indigo-text darken-4\" data-class=\"hr\" data-key=\"connector\" id=\"hr-connector-"+sourceNum+"\">\r\n" + 
  "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Don't Know\">Don't Know/Unsure/Other</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Active Directory\">Active Directory</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"CA ACF2\">CA ACF2</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Active Directory Application Module (ADAM)\">Active Directory Application Module (ADAM)</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM AIX\">IBM AIX</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Amazon Web Services\">Amazon Web Services</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Azure Active Directory\">Azure Active Directory</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"BMC\">BMC</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Box\">Box</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Dropbox\">Dropbox</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Duo\">Duo</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Delimited File\">Delimited File</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Facebook Workplace\">Facebook Workplace</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"GSuite/GoogleApps\">GSuite/GoogleApps</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"GoToMeeting\">GoToMeeting</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM DB2\">IBM DB2</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM Lotus Domino\">IBM Lotus Domino</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM i\">IBM i</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM Tivoli Directory Server\">IBM Tivoli Directory Server</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"JDBC\">JDBC</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Jive\">Jive</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Linux\">Linux</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Microsoft SQL Server\">Microsoft SQL Server</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Microsoft SharePoint Online\">Microsoft SharePoint Online</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Microsoft SharePoint Server\">Microsoft SharePoint Server</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Novell eDirectory /NetIQ\">Novell eDirectory /NetIQ</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"OpenLDAP\">OpenLDAP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle E-business Suite\">Oracle E-business Suite</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Fusion HCM\">Oracle Fusion HCM</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Database\">Oracle Database</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Human Resources Management System\">Oracle Human Resources Management System</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Internet Directory\">Oracle Internet Directory</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle NetSuite\">Oracle NetSuite</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle PeopleSoft ERP\">Oracle PeopleSoft ERP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle PeopleSoft HRMS\">Oracle PeopleSoft HRMS</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM RACF LDAP\">IBM RACF LDAP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM RACF\">IBM RACF</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Remedyforce\">Remedyforce</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"RSA Authentication Manager\">RSA Authentication Manager</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Salesforce\">Salesforce</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Business Suite / SAP ERP\">SAP Business Suite / SAP ERP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP HANA\">SAP HANA</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Human Resources Management System\">SAP Human Resources Management System</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Portal\">SAP Portal</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP S/4HANA Cloud\">SAP S/4HANA Cloud</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SCIM 1.1\">SCIM 1.1</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SCIM 2.0\">SCIM 2.0</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"ServiceNow\">ServiceNow</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Siebel CRM\">Oracle Siebel CRM</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Slack\">Slack</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Solaris\">Oracle Solaris</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SQL Loader\">SQL Loader</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP SuccessFactors Employee Central\">SAP SuccessFactors Employee Central</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SunOne / ODSEE\">SunOne / ODSEE</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Sybase\">SAP Sybase</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"CA Top Secret LDAP\">CA Top Secret LDAP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"CA Top Secret\">CA Top Secret</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Cisco WebEx\">Cisco WebEx</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Web Services\">Web Services</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Workday\">Workday</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Workday Accounts\">Workday Accounts</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Yammer\">Yammer</option>\r\n" + 
  "                          </select>\r\n" + 
  "                          <label>Connectivity</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">Not sure?<span class=\"tooltiptext\">If you're unsure which connector applies, please reference the Deciding Which Connector to Use article linked above.</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l6\">\r\n" + 
  "                          <input data-class=\"hr\" placeholder=\"e.g., Manager's employeeID is MANAGER_ID in user record\" data-key=\"managerCorrelation\" id=\"hr-managerCorrelation-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"hr-managerCorrelation-"+sourceNum+"\">Manager Correlation Info</label>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n" + 
  "                      <div class=\"row\">\r\n" +
  "                        <div class=\"input-field col s12 m12 l12\">\r\n" +
  "                          <textarea data-class=\"hr\" placeholder=\"\" data-key=\"comments\" id=\"hr-comments-"+sourceNum+"\" class=\"materialize-textarea\"></textarea>\r\n" +
  "                          <label for=\"hr-comments-"+sourceNum+"\">Additional Notes/Comments (optional)</label>\r\n" +
  "                        </div>\r\n" +
  "                      </div>\r\n" +
  "                    </form>\r\n" + 
  "                  </div> \r\n" + 
  "                </div>\r\n" + 
  "              </div>\r\n" + 
  "            </div>\r\n" + 
  "          </div>";
  $("#hr-cards").append(newHTML);
  $('select').formSelect();
  $('label').each(function(){
    if($(this).attr("for")) {
      $(this).addClass('active');
    }
  });
}

function renderApplicationCard(sourceNum) {

  var hidden = "";
  if(sourceNum == 1) {hidden = "hidden";}

  var newHTML = "<div class=\"row\" data-class=\"applications-card\" id=\"applications-card-"+sourceNum+"\">\r\n" + 
  "            <div class=\"col s12 m12 l12\">\r\n" + 
  "              <div class=\"card grey lighten-4\">\r\n" + 
  "                <div class=\"card-content\">\r\n" + 
  "                  <span class=\"card-title\">Application "+sourceNum+"<div class=\"right remove-link deep-orange-text darken-4 "+hidden+"\" onclick=\"removeApplication(event,'"+sourceNum+"');\">Remove</div></span>\r\n" + 
  "                  <div class=\"row\">\r\n" + 
  "                    <form class=\"col s12 m12 l12\">\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"input-field col s12 m6 l4\">\r\n" + 
  "                          <input data-class=\"applications\" placeholder=\"\" data-key=\"name\" id=\"applications-name-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"applications-name-"+sourceNum+"\">Application Name</label>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l4\">\r\n" + 
  "                          <select class=\"indigo-text darken-4\" data-class=\"applications\" data-key=\"populationType\" id=\"applications-populationType-"+sourceNum+"\">\r\n" + 
  "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"All Workers\">All Workers</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Full-Time Employees Only\">Full-Time Employees Only</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Contingent Workers Only\">Contingent Workers Only</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Contractors Only\">Contractors Only</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Full-Time and Contractors\">Full-Time and Contractors</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Full-Time and Contingent\">Full-Time and Contingent</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Contractors and Contingent\">Contractors and Contingent</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Other\">Other (describe in comments)</option>\r\n" + 
  "                          </select>\r\n" + 
  "                          <label>Worker Population</label>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l2\">\r\n" + 
  "                          <input data-class=\"applications\" placeholder=\"\" data-key=\"aggFrequency\" id=\"applications-aggFrequency-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"applications-aggFrequency-"+sourceNum+"\">Data Change Freq.</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">What does this mean?<span class=\"tooltiptext\">This is how often we would need to read user records from the system in order to capture changes in a timely fashion.</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l2\">\r\n" + 
  "                          <select class=\"indigo-text darken-4\" data-class=\"applications\" data-key=\"sandbox\" id=\"applications-sandbox-"+sourceNum+"\">\r\n" + 
  "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Yes\">Yes</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"No\">No</option>\r\n" + 
  "                          </select>\r\n" + 
  "                          <label>Sandbox/Dev Instance?</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">What does this mean?<span class=\"tooltiptext\">Is there a 'test' system or dummy data available for us to develop against?</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"input-field col s12 m6 l6\">\r\n" + 
  "                          <select class=\"indigo-text darken-4\" data-class=\"applications\" data-key=\"connector\" id=\"applications-connector-"+sourceNum+"\">\r\n" + 
  "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Don't Know\">Don't Know/Unsure/Other</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Active Directory\">Active Directory</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"CA ACF2\">CA ACF2</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Active Directory Application Module (ADAM)\">Active Directory Application Module (ADAM)</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM AIX\">IBM AIX</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Amazon Web Services\">Amazon Web Services</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Azure Active Directory\">Azure Active Directory</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"BMC\">BMC</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Box\">Box</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Dropbox\">Dropbox</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Duo\">Duo</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Delimited File\">Delimited File</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Facebook Workplace\">Facebook Workplace</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"GSuite/GoogleApps\">GSuite/GoogleApps</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"GoToMeeting\">GoToMeeting</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM DB2\">IBM DB2</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM Lotus Domino\">IBM Lotus Domino</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM i\">IBM i</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM Tivoli Directory Server\">IBM Tivoli Directory Server</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"JDBC\">JDBC</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Jive\">Jive</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Linux\">Linux</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Microsoft SQL Server\">Microsoft SQL Server</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Microsoft SharePoint Online\">Microsoft SharePoint Online</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Microsoft SharePoint Server\">Microsoft SharePoint Server</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Novell eDirectory /NetIQ\">Novell eDirectory /NetIQ</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"OpenLDAP\">OpenLDAP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle E-business Suite\">Oracle E-business Suite</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Fusion HCM\">Oracle Fusion HCM</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Database\">Oracle Database</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Human Resources Management System\">Oracle Human Resources Management System</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Internet Directory\">Oracle Internet Directory</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle NetSuite\">Oracle NetSuite</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle PeopleSoft ERP\">Oracle PeopleSoft ERP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle PeopleSoft applicationsMS\">Oracle PeopleSoft applicationsMS</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM RACF LDAP\">IBM RACF LDAP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"IBM RACF\">IBM RACF</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Remedyforce\">Remedyforce</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"RSA Authentication Manager\">RSA Authentication Manager</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Salesforce\">Salesforce</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Business Suite / SAP ERP\">SAP Business Suite / SAP ERP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP HANA\">SAP HANA</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Human Resources Management System\">SAP Human Resources Management System</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Portal\">SAP Portal</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP S/4HANA Cloud\">SAP S/4HANA Cloud</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SCIM 1.1\">SCIM 1.1</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SCIM 2.0\">SCIM 2.0</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"ServiceNow\">ServiceNow</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Siebel CRM\">Oracle Siebel CRM</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Slack\">Slack</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Oracle Solaris\">Oracle Solaris</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SQL Loader\">SQL Loader</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP SuccessFactors Employee Central\">SAP SuccessFactors Employee Central</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SunOne / ODSEE\">SunOne / ODSEE</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"SAP Sybase\">SAP Sybase</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"CA Top Secret LDAP\">CA Top Secret LDAP</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"CA Top Secret\">CA Top Secret</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Cisco WebEx\">Cisco WebEx</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Web Services\">Web Services</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Workday\">Workday</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Workday Accounts\">Workday Accounts</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Yammer\">Yammer</option>\r\n" + 
  "                          </select>\r\n" + 
  "                          <label>Connectivity</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">Not sure?<span class=\"tooltiptext\">If you're unsure which connector applies, please reference the Deciding Which Connector to Use article linked above.</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l6\">\r\n" + 
  "                          <input data-class=\"applications\" placeholder=\"e.g., User's employee number is in the 'employeeID' field of the account\" data-key=\"accountCorrelation\" id=\"applications-accountCorrelation-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"applications-accountCorrelation-"+sourceNum+"\">Account Correlation Info</label>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"input-field col s12 m4 l2\">\r\n" + 
  "                          <input data-class=\"applications\" placeholder=\"\" data-key=\"numberOfAccounts\" id=\"applications-numberOfAccounts-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"applications-numberOfAccounts-"+sourceNum+"\">No. of Accounts</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">What does this mean?<span class=\"tooltiptext\">Approx. how many user records are in this system?</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m4 l2\">\r\n" + 
  "                          <input data-class=\"applications\" placeholder=\"\" data-key=\"numberOfEntitlements\" id=\"applications-numberOfEntitlements-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"applications-numberOfEntitlements-"+sourceNum+"\">No. of Entitlements</label>\r\n" + 
  "                          <span class=\"helper-text\"><div class=\"tooltip\">What does this mean?<span class=\"tooltiptext\">Approx. how many unique access items (roles, groups, permissions, etc.) are in this system?</span></div></span>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m4 l8\">\r\n" + 
  "                          <input data-class=\"applications\" placeholder=\"\" data-key=\"purpose\" id=\"applications-purpose-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"applications-purpose-"+sourceNum+"\">Purpose of the Application</label>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"row\"></div>\r\n" + 
  "                        <div class=\"input-field col s12 m4 l2\">\r\n" + 
  "                          <select class=\"indigo-text darken-4\" data-class=\"applications\" data-key=\"adminAccounts\" id=\"applications-adminAccounts-"+sourceNum+"\">\r\n" + 
  "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"Yes\">Yes</option>\r\n" + 
  "                            <option class=\"indigo-text darken-4\" value=\"No\">No</option>\r\n" + 
  "                          </select>\r\n" + 
  "                          <label>Admin/Service Accounts?</label>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m8 l10\">\r\n" + 
  "                          <input data-class=\"applications\" placeholder=\"e.g., All admin accounts have '-admin' at the end of the account name\" data-key=\"adminAccountFilter\" id=\"applications-adminAccountFilter-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"applications-adminAccountFilter-"+sourceNum+"\">How can we identify or separate admin/service accounts?</label>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"input-field col s12 m12 l12\">\r\n" + 
  "                          <textarea data-class=\"applications\" placeholder=\"\" data-key=\"comments\" id=\"applications-comments-"+sourceNum+"\" class=\"materialize-textarea\"></textarea>\r\n" + 
  "                          <label for=\"applications-comments-"+sourceNum+"\">Additional Notes/Comments (optional)</label>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n" + 
  "                    </form>\r\n" + 
  "                  </div> \r\n" + 
  "                </div>\r\n" + 
  "              </div>\r\n" + 
  "            </div>\r\n" + 
  "          </div>";
  $("#applications-cards").append(newHTML);
  $('select').formSelect();
  $('label').each(function(){
    if($(this).attr("for")) {
      $(this).addClass('active');
    }
  });
}

function renderLCSCard(sourceNum) {
  var hidden = "";
  if(sourceNum == 1) {hidden = "hidden";}

  var newHTML = "<div class=\"row\" data-class=\"identities-card\" id=\"identities-card-"+sourceNum+"\">\r\n" + 
  "             <div class=\"col s12 m12 l12\">\r\n" + 
  "              <div class=\"card grey lighten-4\">\r\n" + 
  "                <div class=\"card-content\">\r\n" + 
  "                  <span class=\"card-title\">Lifecycle State "+sourceNum+"<div class=\"right remove-link deep-orange-text darken-4 "+hidden+"\" onclick=\"removeLCS(event,'"+sourceNum+"');\">Remove</div></span>\r\n" + 
  "                  <div class=\"row\">\r\n" + 
  "                    <form class=\"col s12 m12 l12\">\r\n" + 
  "                      <div class=\"row\">\r\n" + 
  "                        <div class=\"input-field col s12 m6 l3\">\r\n" + 
  "                          <input data-class=\"identities\" placeholder=\"e.g., Active, Terminated\" data-key=\"lcsName\" id=\"identities-lcsName-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"identities-lcsName-"+sourceNum+"\">Name/Status</label>\r\n" + 
  "                        </div>\r\n" + 
  "                        <div class=\"input-field col s12 m6 l9\">\r\n" + 
  "                          <input data-class=\"identities\" placeholder=\"e.g., If the user's start date is after the current date, but their status is 'Active', then place them in a 'Prehire' state\" data-key=\"logic\" id=\"identities-logic-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                          <label for=\"identities-logic-"+sourceNum+"\">Criteria/Logic for Assigning to State</label>\r\n" + 
  "                        </div>\r\n" + 
  "                      </div>\r\n";

  var appNum = 1;
  //We need to add a row for each source saved
  $('.row[data-class="applications-card"]').each(function(){
    var id = $(this).attr('id');
    var idValue = id.replace("applications-card-","");
    var appName = $("#applications-name-"+idValue).val();
      if(appName == "") {
        appName = "Unnamed Application " + idValue;
      }


    newHTML += "                      <div class=\"row\" id=\"identities-applications-"+sourceNum+"\">\r\n" + 
    "                        <div class=\"input-field col s12 m6 l3\">\r\n" + 
    "                          <input data-class=\"identities\" placeholder=\"\" data-key=\"applicationName-"+sourceNum+"\" id=\"identities-applicationName-"+idValue+"-"+sourceNum+"\" type=\"text\" class=\"\" value=\""+appName+"\" readonly>\r\n" + 
    "                          <label for=\"identities-applicationName-"+idValue+"-"+sourceNum+"\">Application</label>\r\n" + 
    "                        </div>\r\n" + 
    "                        <div class=\"input-field col s12 m12 l9\">\r\n" + 
    "                          <textarea data-class=\"identities\" placeholder=\"e.g., Accounts are created, but in a disabled state\" data-key=\"accessChange-"+sourceNum+"\" id=\"identities-accessChange-"+idValue+"-"+sourceNum+"\" class=\"materialize-textarea\"></textarea>\r\n" + 
    "                          <label for=\"identities-accessChange-"+idValue+"-"+sourceNum+"\">Access Changes that Occur</label>\r\n" + 
    "                        </div>\r\n" + 
    "                      </div>\r\n" + 
    "                      <div class=\"row\">\r\n" +
    "                        <div class=\"input-field col s12 m12 l12\">\r\n" + 
    "                          <textarea data-class=\"identities\" placeholder=\"\" data-key=\"comments-"+sourceNum+"\" id=\"identities-comments-"+idValue+"-"+sourceNum+"\" class=\"materialize-textarea\"></textarea>\r\n" + 
    "                          <label for=\"identities-comments-"+idValue+"-"+sourceNum+"\">Additional Notes/Comments (optional)</label>\r\n" + 
    "                        </div>\r\n" + 
    "                      </div>\r\n";
    appNum++;
  });
  //Done adding the row

  newHTML += "                    </form>\r\n" + 
  "                  </div> \r\n" + 
  "                </div>\r\n" + 
  "              </div>\r\n" + 
  "            </div>\r\n" + 
  "          </div>";
  $("#lcs-cards").append(newHTML);
  $('label').each(function(){
    if($(this).attr("for")) {
      $(this).addClass('active');
    }
  });

}

function renderConversionCard(sourceNum) {

  var hidden = "";
  if(sourceNum == 1) {hidden = "hidden";}

  var newHTML = "<div class=\"row\" data-class=\"conversions-card\" id=\"conversions-card-"+sourceNum+"\">\r\n" + 
  "  <div class=\"col s12 m12 l12\">\r\n" + 
  "    <div class=\"card grey lighten-4\">\r\n" + 
  "      <div class=\"card-content\">\r\n" + 
  "        <span class=\"card-title\">Conversion Scenario "+sourceNum+"<div class=\"right remove-link deep-orange-text darken-4 "+hidden+"\" onclick=\"removeConversion(event,'"+sourceNum+"');\">Remove</div></span>\r\n" + 
  "        <div class=\"row\">\r\n" + 
  "          <form class=\"col s12 m12 l12\">\r\n" + 
  "            <div class=\"row\">\r\n" + 
  "              <div class=\"input-field col s12 m6 l5\">\r\n" + 
  "                <input data-class=\"conversions\" placeholder=\"\" data-key=\"type-"+sourceNum+"\" id=\"conversions-type-"+sourceNum+"\" type=\"text\" class=\"\" value=\"\">\r\n" + 
  "                <label for=\"conversions-type-"+sourceNum+"\">Type (Employee to Contractor, etc.)</label>\r\n" + 
  "              </div>\r\n" + 
  "            </div>\r\n";
  var appNum = 1;
  //We need to add a row for each source saved
  $('.row[data-class="applications-card"]').each(function(){
    var id = $(this).attr('id');
    var idValue = id.replace("applications-card-","");
    var appName = $("#applications-name-"+idValue).val();


    newHTML += "            <div class=\"row\">\r\n" + 
  "              <div class=\"input-field col s12 m6 l3\">\r\n" + 
  "                <input data-class=\"conversions\" placeholder=\"\" data-key=\"applicationName-"+sourceNum+"\" id=\"conversions-applicationName-"+idValue+"-"+sourceNum+"\" type=\"text\" class=\"\" value=\""+appName+"\" readonly>\r\n" + 
  "                <label for=\"conversions-applicationName-"+idValue+"-"+sourceNum+"\">Application</label>\r\n" + 
  "              </div>\r\n" + 
  "              <div class=\"input-field col s12 m12 l9\">\r\n" + 
  "                <textarea data-class=\"conversions\" placeholder=\"\" data-key=\"accessChange-"+sourceNum+"\" id=\"conversions-accessChange-"+idValue+"-"+sourceNum+"\" class=\"materialize-textarea\"></textarea>\r\n" + 
  "                <label for=\"conversions-accessChange-"+idValue+"-"+sourceNum+"\">Access Changes that Occur</label>\r\n" + 
  "              </div>\r\n" + 
  "            </div>\r\n" + 
  "            <div class=\"row\">\r\n" + 
  "              <div class=\"input-field col s12 m12 l12\">\r\n" + 
  "                <textarea data-class=\"conversions\" placeholder=\"\" data-key=\"comments-"+sourceNum+"\" id=\"conversions-comments-"+idValue+"-"+sourceNum+"\" class=\"materialize-textarea\"></textarea>\r\n" + 
  "                <label for=\"conversions-comments-"+idValue+"-"+sourceNum+"\">Additional Notes/Comments (optional)</label>\r\n" + 
  "              </div>\r\n" + 
  "            </div>\r\n";
  appNum++;
  });
  
  newHTML += "          </form>\r\n" + 
  "        </div> \r\n" + 
  "      </div>\r\n" + 
  "    </div>\r\n" + 
  "  </div>\r\n" + 
  "</div>";
  $("#movers-cards").append(newHTML);
  $('label').each(function(){
    if($(this).attr("for")) {
      $(this).addClass('active');
    }
  });
}

function renderProvisioningCards() {

  //Let's first clear the existing div
  $("#targets-cards").html("");

  var moduleName = "provisioning";
  var indexLoc = steps.indexOf(moduleName);
  var savedData = JSON.parse(localStorage.getItem("savedData"));

  //We need to add a row for each source saved
  var sourceNum = 1;
  $('.row[data-class="applications-card"]').each(function(){
    var id = $(this).attr('id');
    var idValue = id.replace("applications-card-","");
    var appName = $("#applications-name-"+idValue).val();
      if(appName == "") { appName = "Application " + sourceNum; }

    //We need to get this application's dataObj
    var birthrightAccess = "";
    var noRbacSelected = "selected";
    var rbacYesSelected = "";
    var rbacNoSelected = "";
    var noEmailSelected = "selected";
    var emailYesSelected = "";
    var emailNoSelected = "";
    var emailList = "";
    var accountIDLogic = "";
    var passwordLogic = "";
    var comments = "";

    if(savedData != null) {
      var dataObj = savedData.data[indexLoc];
      if(typeof dataObj !== "undefined" && dataObj.attributes.sources.length > 0) {
        var entry = dataObj.attributes.sources[sourceNum-1];

        if(typeof entry !== "undefined") {
          if(entry.rbac == "Yes") {
            noRbacSelected = "";
            rbacYesSelected = "selected";
          }
          else if(entry.rbac == "No") {
            noRbacSelected = "";
            rbacNoSelected = "selected";
          }
  
          if(entry.emailNotifications == "Yes") {
            noEmailSelected = "";
            emailYesSelected = "selected";
          }
          else if(entry.emailNotifications == "No") {
            noEmailSelected = "";
            emailNoSelected = "selected";
          }
  
          birthrightAccess = entry.birthrightAccess;
          emailList = entry.emailList;
          accountIDLogic = entry.accountIDLogic;
          passwordLogic = entry.passwordLogic;
          comments = entry.comments;
        }
      }
    }

    var newHTML = "<div class=\"row\" data-class=\"provisioning-card\" id=\"provisioning-card-"+sourceNum+"\">\r\n" + 
    "             <div class=\"col s12 m12 l12\">\r\n" + 
    "              <div class=\"card grey lighten-4\">\r\n" + 
    "                <div class=\"card-content\">\r\n" + 
    "                  <span class=\"card-title\">"+appName+"</span>\r\n" + 
    "                  <div class=\"row\">\r\n" + 
    "                    <form class=\"col s12 m12 l12\">\r\n" + 
    "                      <div class=\"row\">\r\n" + 
    "                        <div class=\"input-field col s12 m12 l8\">\r\n" + 
    "                          <input data-class=\"provisioning\" data-key=\"name\" id=\"provisioning-name-"+sourceNum+"\" type=\"hidden\" value=\""+appName+"\">\r\n" + 
    "                          <textarea data-class=\"provisioning\" placeholder=\"\" data-key=\"birthrightAccess\" id=\"provisioning-birthrightAccess-"+sourceNum+"\" class=\"materialize-textarea\">"+birthrightAccess+"</textarea>\r\n" + 
    "                          <label for=\"provisioning-birthrightAccess-"+sourceNum+"\">Entitlements Given as Birthright</label>\r\n" + 
    "                        </div>\r\n" + 
    "                        <div class=\"input-field col s12 m6 l2\">\r\n" + 
    "                          <select class=\"indigo-text darken-4\" data-class=\"provisioning\" data-key=\"rbac\" id=\"provisioning-rbac-"+sourceNum+"\">\r\n" + 
    "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled "+noRbacSelected+">Select...</option>\r\n" + 
    "                            <option class=\"indigo-text darken-4\" value=\"Yes\" "+rbacYesSelected+">Yes</option>\r\n" + 
    "                            <option class=\"indigo-text darken-4\" value=\"No\" "+rbacNoSelected+">No</option>\r\n" + 
    "                          </select>\r\n" + 
    "                          <label>Role-Based Also?</label>\r\n" + 
    "                        </div>\r\n" + 
    "                        <div class=\"input-field col s12 m6 l2\">\r\n" + 
    "                          <select class=\"indigo-text darken-4\" data-class=\"provisioning\" data-key=\"emailNotifications\" id=\"provisioning-emailNotifications-"+sourceNum+"\">\r\n" + 
    "                            <option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled "+noEmailSelected+">Select...</option>\r\n" + 
    "                            <option class=\"indigo-text darken-4\" value=\"Yes\" "+emailYesSelected+">Yes</option>\r\n" + 
    "                            <option class=\"indigo-text darken-4\" value=\"No\" "+emailNoSelected+">No</option>\r\n" + 
    "                          </select>\r\n" + 
    "                          <label>Send Emails on Create?</label>\r\n" + 
    "                        </div>\r\n" + 
    "                      </div>\r\n" + 
    "                      <div class=\"row\">\r\n" + 
    "                        <div class=\"input-field col s12 m6 l4\">\r\n" + 
    "                          <input data-class=\"provisioning\" placeholder=\"\" data-key=\"emailList\" id=\"provisioning-emailList-"+sourceNum+"\" type=\"text\" class=\"\" value=\""+emailList+"\">\r\n" + 
    "                          <label for=\"provisioning-emailList-"+sourceNum+"\">Users/Groups to Notify</label>\r\n" + 
    "                        </div>\r\n" + 
    "                        <div class=\"input-field col s12 m12 l4\">\r\n" + 
    "                          <textarea data-class=\"provisioning\" placeholder=\"\" data-key=\"accountIDLogic\" id=\"provisioning-accountIDLogic-"+sourceNum+"\" class=\"materialize-textarea\">"+accountIDLogic+"</textarea>\r\n" + 
    "                          <label for=\"provisioning-accountIDLogic-"+sourceNum+"\">Logic for Generating Account ID</label>\r\n" + 
    "                        </div>\r\n" + 
    "                        <div class=\"input-field col s12 m12 l4\">\r\n" + 
    "                          <textarea data-class=\"provisioning\" placeholder=\"\" data-key=\"passwordLogic\" id=\"provisioning-passwordLogic-"+sourceNum+"\" class=\"materialize-textarea\">"+passwordLogic+"</textarea>\r\n" + 
    "                          <label for=\"provisioning-passwordLogic-"+sourceNum+"\">Logic for Generating Initial Password</label>\r\n" + 
    "                        </div>\r\n" + 
    "                      </div>\r\n" + 
    "                      <div class=\"row\">\r\n" + 
    "                        <div class=\"input-field col s12 m12 l12\">\r\n" + 
    "                          <textarea data-class=\"provisioning\" placeholder=\"\" data-key=\"comments\" id=\"provisioning-comments-"+sourceNum+"\" class=\"materialize-textarea\">"+comments+"</textarea>\r\n" + 
    "                          <label for=\"provisioning-comments-"+sourceNum+"\">Additional Notes/Comments (optional)</label>\r\n" + 
    "                        </div>\r\n" + 
    "                      </div>\r\n" + 
    "                    </form>\r\n" + 
    "                  </div> \r\n" + 
    "                </div>\r\n" + 
    "              </div>\r\n" + 
    "            </div>\r\n" +
    "          </div>";

    $("#targets-cards").append(newHTML);
    sourceNum++;
  });

  $('label').each(function(){
    if($(this).attr("for")) {
      $(this).addClass('active');
    }
  });

  $("select").formSelect();
}

function refreshApplications() {

  var appNum = 1;

  var selectOptions = "<option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"\" disabled selected>Select...</option>";
  selectOptions += "<option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\"IdentityNow\">IdentityNow</option>";

  //We need to add an entry to the authentication dropdown for each source saved
  $('.row[data-class="applications-card"]').each(function(){
    var id = $(this).attr('id');
    var idValue = id.replace("applications-card-","");
    var appName = $("#applications-name-"+idValue).val();
      if(appName == "") {
        appName = "Unnamed Application " + idValue;
      }

    var selectedHTML = "";
    var savedData = JSON.parse(localStorage.getItem("savedData"));
    var indexLoc = steps.indexOf("authentication");

    if(savedData != null) {
      var dataObj = savedData.data[indexLoc];

      if(typeof dataObj !== "undefined") {
        var authSource = dataObj.attributes.sources[0].authenticationSource;
        if(appName == authSource) {
          selectedHTML = "selected";
        }
      }
    }
    selectOptions += "<option class=\"indigo-text darken-4\" style=\"color: #3f51b5 !important;\" value=\""+appName+"\" " + selectedHTML + ">"+appName+"</option>";
    appNum++;
  });

  
  $("#authentication-authenticationSource-1").html(selectOptions);
  $("select").formSelect();

  //We need to re-render the provisioning cards
  renderProvisioningCards();
  localStorage.setItem("appChanges","false");
}

function refreshLCSCards() {

  //Clear out the identities cards; we'll populate these again using the new list of apps
  $("#lcs-cards").html("");

  var savedData = JSON.parse(localStorage.getItem("savedData"));
  var identities = false;
  
  if(savedData != null) {

    //identities
    var moduleName = "identities";
    var indexLoc = steps.indexOf(moduleName);
    var dataObj = savedData.data[indexLoc];
    var moduleDTO = dataModel.identities;
    if(typeof dataObj !== "undefined") {
      var arrayCounter = 1;
      var entries = dataObj.attributes.sources;

      do {
        //For each entry in the module, get the JSON object and render it to the UI
        renderLCSCard(arrayCounter);
        var entryObj = entries[arrayCounter-1];
        if(typeof entryObj !== "undefined") {
          for(var dtoCounter=0; dtoCounter<moduleDTO.length; dtoCounter++) {
            var dtoVariable = moduleDTO[dtoCounter];
            $("#"+moduleName+"-"+dtoVariable+"-"+arrayCounter).val(entryObj[dtoVariable]);
          }
        }
        arrayCounter++;
        identities = true;
      }
      while(arrayCounter<=entries.length);
    }
  }
}

function refreshMoversCards() {

  //Clear out the conversions cards; we'll populate these again using the new list of apps
  $("#movers-cards").html("");

  var savedData = JSON.parse(localStorage.getItem("savedData"));
  var conversions = false;
  
  if(savedData != null) {

    //conversions
    var moduleName = "conversions";
    var indexLoc = steps.indexOf(moduleName);
    var dataObj = savedData.data[indexLoc];
    var moduleDTO = dataModel.conversions;
    if(typeof dataObj !== "undefined") {
      var arrayCounter = 1;
      var entries = dataObj.attributes.sources;

      do {
        //For each entry in the module, get the JSON object and render it to the UI
        renderConversionCard(arrayCounter);
        var entryObj = entries[arrayCounter-1];
        if(typeof entryObj !== "undefined") {
          for(var dtoCounter=0; dtoCounter<moduleDTO.length; dtoCounter++) {
            var dtoVariable = moduleDTO[dtoCounter];
            $("#"+moduleName+"-"+dtoVariable+"-"+arrayCounter).val(entryObj[dtoVariable]);
          }
        }
        arrayCounter++;
        conversions = true;
      }
      while(arrayCounter<=entries.length);
    }
  }
}

function showSendToSailPointForm() {
  saveProgress();
  $("#index-banner").hide();
  $("#index-send").show();

  //Hide the forms and the progress bar
  $("#wizard-progress").hide();
  $("#step-buttons").hide();
  $(".user-form").each(function(){
    $(this).hide();
  });

  $('html, body').animate({
    scrollTop: 0
  }, 0);
}

function cancelSend() {
  var currStep = 0;
  if("currStep" in localStorage) {currStep = parseInt(localStorage.getItem("currStep"));}
  goToStep(currStep);
}

function generateMarkdownData() {
  var savedData = JSON.parse(localStorage.getItem("savedData"));

  var docData = "# SailPoint Requirements Wizard Responses  \r\n";
  docData += "### Client: " + $("#company-name").val() + "  \r\n";
  docData += "### CSM: " + $("#csm-name").val() + " - " + $("#csm-email").val() + "  \r\n";
  docData += "  \r\n";

  if(savedData != null) {

    for(var module=0; module<steps.length; module++) {
      //For each module
      var dataObj = savedData.data[module];
      if(typeof dataObj !== "undefined") {
        var moduleName = dataObj.category;
        var arrayCounter = 1;
        var entries = dataObj.attributes.sources;

        if(moduleName == "rolesAndAccess") { 
          docData += "#### ROLES AND ACCESS  \r\n";
        }
        else {
          docData += "#### " + moduleName.toUpperCase() + "  \r\n";
        }
        

        switch(moduleName) {
          case "hr": moduleDTO = dataModel.hr; break;
          case "applications": moduleDTO = dataModel.applications; break;
          case "authentication": moduleDTO = dataModel.authentication; break;
          case "identities": moduleDTO = dataModel.identities; break;
          case "password": moduleDTO = dataModel.password; break;
          case "conversions": moduleDTO = dataModel.conversions; break;
          case "provisioning": moduleDTO = dataModel.provisioning; break;
          case "rolesAndAccess": moduleDTO = dataModel.rolesAndAccess; break;
          case "certifications": moduleDTO = dataModel.certifications; break;
          case "integrations": moduleDTO = dataModel.integrations; break;
        }

        do {
          var entryObj = entries[arrayCounter-1];
          if(typeof entryObj !== "undefined") {

            //Prep a table
            docData += "| Form Field | Response |  \r\n";
            docData += "| :-- | :-- |  \r\n";

            for(var dtoCounter=0; dtoCounter<moduleDTO.length; dtoCounter++) {
              if(typeof moduleDTO[dtoCounter] !== "undefined") {
                var dtoVariable = moduleDTO[dtoCounter];
                if(dtoVariable.includes("*")) {
                  //We have multiple sources as part of this attribute; need to cycle through them all
                  $('.row[data-class="applications-card"]').each(function(){
                    var id = $(this).attr('id');
                    var thisID = 0;
                    thisID = id.replace("applications-card-","");
                    var entryObjVar = dtoVariable.replace("*","")+"-"+thisID;

                    if(typeof entryObj[entryObjVar] !== "undefined" && entryObj[entryObjVar] !== null) {
                      docData += "| " + moduleName+"-"+entryObjVar+" | " + entryObj[entryObjVar] + " |  \r\n";
                    }
                    else {
                      docData += "| " + moduleName+"-"+entryObjVar+" |  |  \r\n";
                    }
                    
                  });
                }
                else {
                  //Not source-specific
                  if(typeof entryObj[dtoVariable] !== "undefined" && entryObj[dtoVariable] !== null) {
                    docData += "| " + moduleName+"-"+dtoVariable+" | " + entryObj[dtoVariable] + " |  \r\n";
                  }
                  else {
                    docData += "| " + moduleName+"-"+dtoVariable+" |  |  \r\n";
                  }
                }
              }
            }
            docData += "  \r\n";
          }
          arrayCounter++;

          docData += "  \r\n  \r\n";

        }
        while(arrayCounter<=entries.length);
      }
    }
  }

  //Replace system IDs with human-readable data
  var translationModel = codeToEnglish.regex;
  for(var counter=0; counter < translationModel.length; counter++) {
    var entry = translationModel[counter];
    var searchString = entry.input;
    var replaceString = entry.replacement;

    var replacer = new RegExp(searchString,"g");
    docData = docData.replace(replacer, replaceString);
  }

  localStorage.setItem("mdData",docData);
}

function downloadResponses() {
  generateMarkdownData();
  var docData = localStorage.getItem("mdData");
  saveTextAs(docData,"responses.md");
}

function sendAsEmail() {

  showModal("Sorry! This feature isn't supported in offline mode just yet.");

  /*generateMarkdownData();
  var docData = localStorage.getItem("mdData");
  saveTextAs(docData,"responses.md");
  
  var recipientEmail = $("#csm-email").val();
  var recipientName = $("#csm-name").val();
  var customerName = $("#company-name").val();

  var emailSubject = encodeURI("Reqs gathering responses for "+customerName);
  var emailBody = $("#send-comments").val().trim();
  if(emailBody == "" || typeof emailBody === "undefined") {
    emailBody = encodeURI("Hi "+recipientName+",\r\n\r\nPlease find "+customerName+"'s requirements gathering wizard responses attached.\n\n\r\n");
  }
  else {
    emailBody = encodeURI(emailBody+"\r\n\r\n");
  }

  window.open("mailto:"+recipientEmail+"?subject="+emailSubject+"&body="+emailBody);*/
}