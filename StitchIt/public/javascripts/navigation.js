var link_ids = [
    {'link_id': 'global-projections-link', 'section_id': 'map-projections'},
    {'link_id': 'migration-link', 'section_id': 'migration'},
    {'link_id': 'infrastructure-link', 'section_id': 'infrastructure'}
];

function createToggle(selected_id){
    var object = document.getElementById(selected_id['link_id']);
    object.onclick = function(){
        link_ids.forEach(function(link_id) {
            var section = document.getElementById(link_id['section_id']);
            var corresponding_link = document.getElementById(link_id['link_id']);
            if (selected_id['section_id'] === link_id['section_id']){
                section.style.display = "block";
                corresponding_link.style.color = 'rgb(255,0,255)';
            } 
            else {
                section.style.display = "none";
                corresponding_link.style.color = '#658c5d';
            }  
        });
    };
}

link_ids.forEach(createToggle);

// toggle all off when title clicked
function toggleAllOff(){
    link_ids.forEach(function(link_id) {
        var section = document.getElementById(link_id['section_id']);
        var corresponding_link = document.getElementById(link_id['link_id']);
        section.style.display = "none";
        corresponding_link.style.color = '#2c3387';
    });
};

var title = document.getElementById('title-text');
title.onclick = toggleAllOff;

var mobileTitle = document.getElementById('title-text-mobile');
mobileTitle.onclick = toggleAllOff;

