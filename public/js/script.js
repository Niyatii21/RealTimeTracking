const socket = io();
//Checks if the browser supports geolocation.

if(navigator.geolocation){

    //Continuously monitors the user's location.
    navigator.geolocation.watchPosition((position)=>{
       const {latitude,longitude}= position.coords;

       //When the position updates, it sends latitude (lat) and longitude (long) to the server via Socket.IO 
       socket.emit("send-location",{latitude,longitude});
    },(e)=>{
        console.log(e);
    },{
        enableHighAccuracy:true,
        maximumAge:0, //no caching
        timeout:5000,
    });
}

const map = L.map("map").setView([0,0],16); //asking for location

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"OpenStreetMap"
}).addTo(map);


const markers={};

socket.on("receive-location",(data)=>{
    const {id,latitude,longitude} = data;
    map.setView([latitude,longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }
    else{
        markers[id]=L.marker([latitude,longitude]).addTo(map)
    }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
})