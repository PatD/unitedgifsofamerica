// Punch List
/*


makeMapValuesIntoDropdown = load mobile only

Update URL with state


*/


// DOM ELEMENTS


// Global location
var myLat = 0;
var myLong = 0;
/// Global my state variable
var usersHomeState = "America";


  // About link
  var aboutLink = document.getElementById("aboutLink");

  // Dropdown where we want our states added
  var fiftyStatesDropdown = document.getElementById("fiftyStatesDropdown");

  // Save Button in Modal
  var saveButton = document.getElementById("myOfficialStateSaver");
  
  // location of SVG map
  const svgamericamap = document.getElementById("SVGAMERICA");
  
  // Selects all the child nodes of SVGMAP
  var mapchild = svgamericamap.children;
  
  // State name text node
  var stateNameHeader = document.getElementById("stateNameHeader");
  
  // Image + text where per-state-gif lands
  var stateGifHolder = document.getElementById("stateGifHolder");
  var stateTitleforModal = document.getElementById("stateTitleforModal");



  // Loading GIF for modal
  const loadingGif = "loading-america.gif";
  
  
  // Default fills color of SVG Map
  const mapColor = "#fff";
  const mapColorHover = "#ff0000";
  const mapColorFavorite = "url(#favoriteStateBackgroundImage)";


// Global variable: End user's Favorite State
  // localStorage sets this if the user set one in the last session
var myFavoriteState = localStorage.favoriteState;
var myFavoriteStateID = localStorage.favoriteStateID;




// Function: Checks if state is in localStorage, and selects the state on map
var onLoadState = function(){
  var onLoadFavoriteStateNode = document.getElementById(myFavoriteStateID);
  onLoadFavoriteStateNode.setAttribute("favorite", "true");
  onLoadFavoriteStateNode.setAttribute("fill", mapColorFavorite);
};


// Function: removes any previously selected favorite state.
var makeStateUnfavorite = function(){
  var oldFavoriteStateID = localStorage.getItem('favoriteStateID');
  var oldFavoriteStateNode = document.getElementById(oldFavoriteStateID);
  
  // Remove favorite attribute
  oldFavoriteStateNode.removeAttribute("favorite");
  
  // Returns color to normal
  oldFavoriteStateNode.setAttribute("fill", mapColor);
};



// Function: Saves selected state to local storage. Updates map.
var savemyState = function(passedStateName, passedStateID){
  
    // Adds event listener for clicking save
    saveButton.addEventListener("click", function handler(){
      
      // removes any existing favorite
      makeStateUnfavorite();
    
      // If we leave this line in, we can only use the button once? 
      this.removeEventListener('click', handler);
      
      // Put our passed value into local storage!
      localStorage.setItem('favoriteState', passedStateName);
      localStorage.setItem('favoriteStateID', passedStateID);
      
      // The state which we just selected to be favorite, color it in!
      var mySelectedStateID = document.getElementById(passedStateID);
      mySelectedStateID.setAttribute("fill", mapColorFavorite);
  
      // This state we just selected to be favorite, add an attribute mark it so
      mySelectedStateID.setAttribute("favorite", "true");
  
    });
  
};




// Helper function to find our location.
// Callback returns lat and Long
var getOurLocation = function(loc) {
  
  // Green GPS button
  var getGPScoordsButton = document.getElementById("getGPScoordsButton");
  
  getGPScoordsButton.addEventListener("click",function(){ 
  
  
  if(document.documentElement.clientWidth	 < 640 && navigator.geolocation){
  
    navigator.geolocation.getCurrentPosition(
      function (position) {
            console.log(position);
        var returnValue = {
     
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        //  return loc with our coords
        loc(returnValue);
      
      });
  }
  else{
    console.log("Error in Geolocation, or yer screen's too big");
  }
  
 });  // event listener
};



// Find our state, based on GPS coords
// Uses OpenStreetMap service
// Relies on global myLat and myLat
var getOurState = function(){
  
  var url = "http://nominatim.openstreetmap.org/reverse?pdoran@gmail.com&zoom=8&format=json&lat=" + myLat + "&lon=" + myLong;

  req = new XMLHttpRequest();
  req.open('GET', url);
  req.send();
  
  req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
      var _returnedAddress =JSON.parse(this.responseText);
       console.log(_returnedAddress.address.state);
      
      usersHomeState = _returnedAddress.address.state;
        getGif(usersHomeState);
        
    };
  };

};



// Function to create a dropdown from the values of the SVG map
var makeMapValuesIntoDropdown = function(){
  

  // Place our States in this Array
  var _stateArray = [];
  
  // Loops through each state, gathers ID and name, puts in an <option> tag
  for(var i=0;i < mapchild.length; i++){

    var _stateID = mapchild[i].getAttribute("data-id");
    var _stateName = mapchild[i].getAttribute("data-name");
    var _stateOptionNode = "<option value=" + _stateID + ">" + _stateName + "</option>";
   
    //  Adds <options> to _stateArray 
    _stateArray.push(_stateOptionNode);
  };

  // Sorts array alphabetically
  _stateArray.sort();

  // converts array to String, puts it in the select 
  var stateArrayString = _stateArray.toString();
  fiftyStatesDropdown.innerHTML = stateArrayString;
};


// Function: Fires GIF modal for the selected state when selected on dropdown
var loadStateonSelect = function(){
  
  fiftyStatesDropdown.onchange = function(){
  
    var chosenoption=this.options[this.selectedIndex];
    var chosenoptionState=this.options[this.selectedIndex].text;
    
    chosenoption.setAttribute("selected","selected");
    
    // fires function to load gif via modal
    getGif(chosenoptionState);
  };
};






 
// Function: Handles Map hover, click, loading modal
var mapEventSetter = function(){
    
    // Loop through the states
    for(var i = 0; i < mapchild.length; i++){

    // Mouseover event handler
      mapchild[i].addEventListener("mouseover", function(){
        
          // Sets background color of state
          // if it's not our favorite
          if(!this.hasAttribute("favorite")){
            this.setAttribute("fill",mapColorHover);
          };

          var stateFullName = this.getAttribute("data-name");
          
          // sets text header to state name
          stateNameHeader.textContent = stateFullName;
          
          // Clears already loaded GIF if there is one
          // stateGifHolder.setAttribute("src", loadingGif);
      
      }); // End mouseover function
      
      
      
    // Mouseout event handler
      mapchild[i].addEventListener("mouseout", function(){
        if(!this.hasAttribute("favorite")){
          this.setAttribute("fill",mapColor);
        };
      
        var stateFullName = this.getAttribute("data-name");
        
        // removes state name from h2
        stateNameHeader.textContent = "";
      }); // End mosueout function
      
      
      
      // Event listener for click
      mapchild[i].addEventListener("click", function(){
         
        // Clears already loaded GIF if there is one
        // So it doesn't show up accidentally for fast-clickers
        stateGifHolder.setAttribute("src", loadingGif);
         
        // What the state and ID are here:
        var stateFullName = this.getAttribute("data-name");
        var stateID = this.getAttribute("data-id");
         
        // pass name to getGif function
        getGif(stateFullName);
        
        this.setAttribute("fill",mapColorHover);
          
        stateNameHeader.textContent = stateFullName;
        
        // Adds event listener for save the state
        savemyState(stateFullName,stateID);
        
       });
     
    }; // for loop per dom element in map

};  
    

  
    
    
  // Service that loads from Giffy.  Expects name of state as paramter
  // Also handles modal
  
  var getGif = function(stateFullName){
    
    const apiKey = "dc6zaTOxFJmzC";
    var stateFullName = stateFullName;
    const loadGifs = new XMLHttpRequest();

    loadGifs.onreadystatechange = function() {
      
      if (this.readyState == 4 && this.status == 200) {
       
        var returnedGifs = JSON.parse(this.responseText);
        
        // Actual GIF
        var mainGif = returnedGifs.data[0].images.original.url;
      
        // Title in modal:
        stateTitleforModal.innerHTML=stateFullName;
         
        // Sets SRC of image in Modal to value from GIFFY feed
        stateGifHolder.setAttribute("src",mainGif);
         
        // Fires modal dialog box
        $('#stateModal').modal('show')
        
      
        } // if
        
        else{
          // Error handling
         console.log("Loading GIF from giphy");
        }
      };
  
      loadGifs.open("GET", "http://api.giphy.com/v1/gifs/search?q=" + stateFullName + "&api_key="+ apiKey +"&limit=1");
      loadGifs.send();
   }; // getgif



// Open about modal
// Uses Bootstrap modal 
    
var openAboutModal = function(){
  aboutLink.addEventListener("click", function(){
    $('#aboutModal').modal('show')
  });  
};







    












// Waits for all content to be loaded
  document.addEventListener('DOMContentLoaded', function() {
   
    // For mobile, makes a dropdown
    makeMapValuesIntoDropdown();
    
    // Here you pass a callback function as a parameter to `updateCoordinate`.
    getOurLocation(function (loc) {
        // sets global variables from returned vals
        myLat = loc.latitude;
        myLong = loc.longitude;
        getOurState();
    });

    mapEventSetter();
    loadStateonSelect();
    openAboutModal();
    onLoadState();
  }); // DOM loaded   
