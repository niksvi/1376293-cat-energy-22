document.querySelector('.map').removeAttribute('hidden');
let map, icon;
function initMap() {
  map = new google.maps.Map(document.querySelector('.map'),{
    center : { lat: 59.93872192287188, lng: 30.32305433924948 }
  });
  setMapCenter();

  if (window.innerWidth < 768) {
    icon = {
      url: 'img/common/map-pin-mobile.png'
    };
  } else {
    icon = {
      url: 'img/common/map-pin.png'
    };
  };
  let marker = new google.maps.Marker({
    position: { lat: 59.93872192287188, lng: 30.32305433924948 },
    map: map,
    title: 'Cat Energy',
    icon: icon
  });
}
window.addEventListener('resize', setMapCenter);

function setMapCenter() {
  if (window.innerWidth < 768) {
    map.setZoom(14);
  } else if (window.innerWidth > 1280) {
    map.setCenter({ lat: 59.938838891951825, lng: 30.319411560295798 })
    map.setZoom(16);
  } else {
    map.setZoom(15);
  };
}
